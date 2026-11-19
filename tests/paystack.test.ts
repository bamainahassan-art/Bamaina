import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

const tempDbPath = path.join(os.tmpdir(), `baffa_test_${Date.now()}.db`);
process.env.FARM_DB_PATH = tempDbPath;
process.env.PAYSTACK_WEBHOOK_SECRET = 'sk_test_unit_verification_secret';

const { getDb, getOrderByReference, getPaymentRecordByReference, listActiveProducts } =
  await import('../server/db.ts');
const {
  initializePaystackCheckout,
  processPaystackWebhookEvent,
  verifyPaystackTransaction,
} = await import('../server/paystack.ts');

test.after(() => {
  try {
    if (fs.existsSync(tempDbPath)) fs.unlinkSync(tempDbPath);
  } catch {
    // ignore cleanup errors
  }
});

test('1. Server-side pricing & NGN->Kobo calculation + unique references', async () => {
  getDb();
  const products = listActiveProducts();
  assert.ok(products.length >= 6, 'Default server catalog should be seeded');

  const broilers = products.find((p) => p.id === 'prod-broilers')!;
  const catfish = products.find((p) => p.id === 'prod-catfish')!;

  const initA = await initializePaystackCheckout({
    customerName: 'Aminu Bello',
    customerEmail: 'aminu@example.com',
    customerPhone: '08065494739',
    items: [
      { productId: broilers.id, quantity: 2 },
      { productId: catfish.id, quantity: 3 },
    ],
    originUrl: 'https://example.com',
  });

  const initB = await initializePaystackCheckout({
    customerName: 'Aminu Bello',
    customerEmail: 'aminu@example.com',
    customerPhone: '08065494739',
    items: [{ productId: broilers.id, quantity: 1 }],
    originUrl: 'https://example.com',
  });

  const expectedNgn = broilers.price_ngn * 2 + catfish.price_ngn * 3;
  assert.equal(initA.currency, 'NGN');
  assert.equal(initA.totalNgn, expectedNgn);
  assert.equal(initA.totalKobo, expectedNgn * 100);
  assert.notEqual(initA.reference, initB.reference, 'References must be unique');
});

test('2. Rejects invalid customer input and unknown products', async () => {
  await assert.rejects(
    () =>
      initializePaystackCheckout({
        customerName: 'A',
        customerEmail: 'invalid-email',
        customerPhone: '080',
        items: [{ productId: 'prod-broilers', quantity: 1 }],
        originUrl: 'https://example.com',
      }),
    /full name/i
  );

  await assert.rejects(
    () =>
      initializePaystackCheckout({
        customerName: 'Sadiq Umar',
        customerEmail: 'sadiq@example.com',
        customerPhone: '08065494739',
        items: [{ productId: 'nonexistent-product', quantity: 1 }],
        originUrl: 'https://example.com',
      }),
    /unavailable/i
  );
});

test('3. Webhook HMAC-SHA512 validation, charge.success processing, duplicate protection & DB record', async () => {
  const init = await initializePaystackCheckout({
    customerName: 'Fatima Danjuma',
    customerEmail: 'fatima@example.com',
    customerPhone: '08065494739',
    items: [{ productId: 'prod-eggs', quantity: 4 }],
    originUrl: 'https://example.com',
  });

  const payload = {
    event: 'charge.success',
    data: {
      id: 987654321,
      reference: init.reference,
      amount: init.totalKobo,
      currency: 'NGN',
      channel: 'card',
      status: 'success',
      gateway_response: 'Successful',
      paid_at: '2026-11-19T12:00:00.000Z',
    },
  };
  const rawBody = Buffer.from(JSON.stringify(payload), 'utf8');

  // Invalid signature must be rejected
  const invalidRes = processPaystackWebhookEvent(rawBody, 'invalid_signature_hex');
  assert.equal(invalidRes.status, 'rejected');
  assert.equal(getOrderByReference(init.reference)?.status, 'pending');

  // Valid HMAC SHA-512 signature must succeed
  const validSig = crypto
    .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex');

  const okRes = processPaystackWebhookEvent(rawBody, validSig);
  assert.equal(okRes.status, 'processed');
  assert.equal(okRes.duplicate, false);

  const order = getOrderByReference(init.reference)!;
  const record = getPaymentRecordByReference(init.reference)!;
  assert.equal(order.status, 'paid');
  assert.equal(record.payment_status, 'success');
  assert.equal(record.transaction_id, '987654321');
  assert.equal(record.currency, 'NGN');
  assert.equal(record.amount_kobo, init.totalKobo);
  assert.equal(record.payment_method, 'card');
  assert.equal(record.customer_email, 'fatima@example.com');
  assert.equal(record.order_id, init.orderId);

  // Duplicate webhook must be ignored safely
  const dupRes = processPaystackWebhookEvent(rawBody, validSig);
  assert.equal(dupRes.status, 'duplicate');
  assert.equal(dupRes.duplicate, true);

  // Verify endpoint confirms success
  const verified = await verifyPaystackTransaction(init.reference);
  assert.equal(verified.verified, true);
  assert.equal(verified.status, 'success');
});

test('4. Rejects webhook with incorrect amount and handles charge.failed', async () => {
  const initMismatch = await initializePaystackCheckout({
    customerName: 'Musa Ibrahim',
    customerEmail: 'musa@example.com',
    customerPhone: '08065494739',
    items: [{ productId: 'prod-catfish', quantity: 5 }],
    originUrl: 'https://example.com',
  });

  const tamperedBody = Buffer.from(
    JSON.stringify({
      event: 'charge.success',
      data: {
        id: 111222333,
        reference: initMismatch.reference,
        amount: 100, // Wrong amount!
        currency: 'NGN',
        channel: 'bank_transfer',
        status: 'success',
      },
    }),
    'utf8'
  );
  const sigMismatch = crypto
    .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET!)
    .update(tamperedBody)
    .digest('hex');

  const mismatchRes = processPaystackWebhookEvent(tamperedBody, sigMismatch);
  assert.equal(mismatchRes.status, 'rejected');
  assert.equal(getOrderByReference(initMismatch.reference)?.status, 'failed');

  const initFail = await initializePaystackCheckout({
    customerName: 'Zainab Lawal',
    customerEmail: 'zainab@example.com',
    customerPhone: '08065494739',
    items: [{ productId: 'prod-broilers', quantity: 1 }],
    originUrl: 'https://example.com',
  });

  const failBody = Buffer.from(
    JSON.stringify({
      event: 'charge.failed',
      data: {
        id: 444555666,
        reference: initFail.reference,
        amount: initFail.totalKobo,
        currency: 'NGN',
        channel: 'card',
        gateway_response: 'Insufficient funds',
      },
    }),
    'utf8'
  );
  const failSig = crypto
    .createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET!)
    .update(failBody)
    .digest('hex');

  const failRes = processPaystackWebhookEvent(failBody, failSig);
  assert.equal(failRes.status, 'processed');
  const verifiedFail = await verifyPaystackTransaction(initFail.reference);
  assert.equal(verifiedFail.verified, false);
  assert.equal(verifiedFail.status, 'failed');
});
