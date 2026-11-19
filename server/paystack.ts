import crypto from 'node:crypto';
import {
  getDb,
  getOrderByReference,
  getPaymentRecordByReference,
  getProductById,
  type OrderItemSnapshot,
  type OrderRecord,
  type PaymentRecord,
} from './db.ts';

export type PaystackMode = 'live' | 'test' | 'simulation';

function cleanEnvValue(val: string | undefined): string {
  if (!val) return '';
  const trimmed = val.trim();
  if (
    trimmed.includes('your_paystack') ||
    trimmed === 'MY_PAYSTACK_SECRET_KEY' ||
    trimmed === 'MY_PAYSTACK_PUBLIC_KEY'
  ) {
    return '';
  }
  return trimmed;
}

export function getPaystackSecretKey(): string {
  return cleanEnvValue(process.env.PAYSTACK_SECRET_KEY);
}

export function getPaystackPublicKey(): string {
  return cleanEnvValue(process.env.PAYSTACK_PUBLIC_KEY);
}

export function getPaystackWebhookSecret(): string {
  return (
    cleanEnvValue(process.env.PAYSTACK_WEBHOOK_SECRET) || getPaystackSecretKey()
  );
}

export function getPaystackMode(): PaystackMode {
  const secret = getPaystackSecretKey();
  if (secret.startsWith('sk_live_')) return 'live';
  if (secret.startsWith('sk_test_')) return 'test';
  return 'simulation';
}

export interface InitializeCheckoutInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: { productId: string; quantity: number }[];
  originUrl: string;
}

export interface InitializeCheckoutResult {
  orderId: string;
  reference: string;
  authorizationUrl: string;
  totalNgn: number;
  totalKobo: number;
  currency: 'NGN';
  mode: PaystackMode;
  items: OrderItemSnapshot[];
}

export function validateCustomerInput(input: InitializeCheckoutInput): string | null {
  if (!input.customerName || input.customerName.trim().length < 2) {
    return 'Please enter your full name (at least 2 characters).';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.customerEmail || !emailRegex.test(input.customerEmail.trim())) {
    return 'Please enter a valid email address for your payment receipt.';
  }
  const phoneRegex = /^[+\d\s()-]{7,20}$/;
  if (!input.customerPhone || !phoneRegex.test(input.customerPhone.trim())) {
    return 'Please enter a valid phone number.';
  }
  if (!Array.isArray(input.items) || input.items.length === 0) {
    return 'Your order must include at least one agricultural product.';
  }
  for (const item of input.items) {
    if (
      !item.productId ||
      typeof item.quantity !== 'number' ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 500
    ) {
      return 'Each product must have a valid whole-number quantity between 1 and 500.';
    }
  }
  return null;
}

export async function initializePaystackCheckout(
  input: InitializeCheckoutInput
): Promise<InitializeCheckoutResult> {
  const validationError = validateCustomerInput(input);
  if (validationError) {
    throw new Error(validationError);
  }

  // Merge duplicate productIds safely and calculate trusted server-side prices
  const qtyByProduct = new Map<string, number>();
  for (const line of input.items) {
    qtyByProduct.set(
      line.productId,
      (qtyByProduct.get(line.productId) || 0) + line.quantity
    );
  }

  const orderItems: OrderItemSnapshot[] = [];
  let subtotalKobo = 0;

  for (const [productId, quantity] of qtyByProduct.entries()) {
    const serverProduct = getProductById(productId);
    if (!serverProduct) {
      throw new Error(`Product "${productId}" is unavailable or does not exist.`);
    }
    const unitPriceKobo = Math.round(serverProduct.price_ngn * 100);
    const lineTotalKobo = unitPriceKobo * quantity;
    subtotalKobo += lineTotalKobo;
    orderItems.push({
      productId: serverProduct.id,
      name: serverProduct.name,
      unitLabel: serverProduct.unit_label,
      quantity,
      unitPriceNgn: serverProduct.price_ngn,
      unitPriceKobo,
      lineTotalKobo,
    });
  }

  if (subtotalKobo <= 0) {
    throw new Error('Order total must be greater than zero.');
  }

  const totalKobo = subtotalKobo;
  const totalNgn = totalKobo / 100;
  const nowIso = new Date().toISOString();
  const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${crypto
    .randomBytes(2)
    .toString('hex')
    .toUpperCase()}`;
  const reference = `BNAF-${Date.now()}-${crypto
    .randomBytes(4)
    .toString('hex')
    .toUpperCase()}`;

  const db = getDb();
  db.exec('BEGIN');
  try {
    db.prepare(
      `INSERT INTO orders (
        id, payment_reference, customer_name, customer_email, customer_phone,
        items_json, subtotal_kobo, total_kobo, currency, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'NGN', 'pending', ?, ?)`
    ).run(
      orderId,
      reference,
      input.customerName.trim(),
      input.customerEmail.trim().toLowerCase(),
      input.customerPhone.trim(),
      JSON.stringify(orderItems),
      subtotalKobo,
      totalKobo,
      nowIso,
      nowIso
    );

    db.prepare(
      `INSERT INTO payment_records (
        transaction_id, payment_reference, customer_name, customer_email, customer_phone,
        order_id, amount_kobo, amount_ngn, currency, payment_method, payment_status,
        gateway_response, webhook_processed, transaction_date, created_at, updated_at
      ) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, 'NGN', 'pending', 'pending', 'Initialized', 0, ?, ?, ?)`
    ).run(
      reference,
      input.customerName.trim(),
      input.customerEmail.trim().toLowerCase(),
      input.customerPhone.trim(),
      orderId,
      totalKobo,
      totalNgn,
      nowIso,
      nowIso,
      nowIso
    );
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  const mode = getPaystackMode();
  const cleanOrigin = input.originUrl.replace(/\/+$/, '');
  const callbackUrl = `${cleanOrigin}/#payment-success?reference=${encodeURIComponent(
    reference
  )}`;

  if (mode === 'simulation') {
    const simulationUrl = `${cleanOrigin}/#paystack-test-checkout?reference=${encodeURIComponent(
      reference
    )}`;
    return {
      orderId,
      reference,
      authorizationUrl: simulationUrl,
      totalNgn,
      totalKobo,
      currency: 'NGN',
      mode,
      items: orderItems,
    };
  }

  const secretKey = getPaystackSecretKey();
  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: input.customerEmail.trim().toLowerCase(),
      amount: totalKobo,
      currency: 'NGN',
      reference,
      callback_url: callbackUrl,
      metadata: {
        orderId,
        business: 'BAFFA NJANGIRDE AGRO-ALLIED FARM',
        customerName: input.customerName.trim(),
        customerPhone: input.customerPhone.trim(),
        items: orderItems.map((i) => ({
          productId: i.productId,
          name: i.name,
          quantity: i.quantity,
          unitPriceNgn: i.unitPriceNgn,
        })),
      },
    }),
  });

  const payload = (await response.json()) as {
    status?: boolean;
    message?: string;
    data?: { authorization_url?: string; access_code?: string; reference?: string };
  };

  if (!response.ok || !payload.status || !payload.data?.authorization_url) {
    db.prepare(
      `UPDATE orders SET status = 'failed', updated_at = ? WHERE payment_reference = ?`
    ).run(new Date().toISOString(), reference);
    db.prepare(
      `UPDATE payment_records SET payment_status = 'failed', gateway_response = ?, updated_at = ? WHERE payment_reference = ?`
    ).run(
      payload.message || 'Paystack initialization failed',
      new Date().toISOString(),
      reference
    );
    throw new Error(
      payload.message || 'Unable to initialize Paystack transaction at this time.'
    );
  }

  return {
    orderId,
    reference,
    authorizationUrl: payload.data.authorization_url,
    totalNgn,
    totalKobo,
    currency: 'NGN',
    mode,
    items: orderItems,
  };
}

export interface VerificationResult {
  verified: boolean;
  status: 'success' | 'pending' | 'failed';
  message: string;
  order: OrderRecord;
  payment: PaymentRecord;
  items: OrderItemSnapshot[];
  mode: PaystackMode;
}

export async function verifyPaystackTransaction(
  reference: string
): Promise<VerificationResult> {
  const cleanRef = reference.trim();
  if (!cleanRef) {
    throw new Error('Transaction reference is required.');
  }

  const order = getOrderByReference(cleanRef);
  const payment = getPaymentRecordByReference(cleanRef);
  if (!order || !payment) {
    throw new Error('No matching order found for this payment reference.');
  }

  const items = JSON.parse(order.items_json) as OrderItemSnapshot[];
  const mode = getPaystackMode();

  // If already verified and paid in DB (e.g., via webhook or prior verify), return verified state
  if (order.status === 'paid' && payment.payment_status === 'success') {
    return {
      verified: true,
      status: 'success',
      message: 'Payment verified and confirmed.',
      order,
      payment,
      items,
      mode,
    };
  }

  // In simulation mode without live/test keys, read current verified DB state
  if (mode === 'simulation') {
    if (payment.payment_status === 'failed' || order.status === 'failed') {
      return {
        verified: false,
        status: 'failed',
        message:
          payment.gateway_response || 'Transaction failed or was declined.',
        order,
        payment,
        items,
        mode,
      };
    }
    return {
      verified: false,
      status: 'pending',
      message:
        'Awaiting Paystack confirmation. Use the test checkout or check again.',
      order,
      payment,
      items,
      mode,
    };
  }

  // Real Paystack verification API call
  const secretKey = getPaystackSecretKey();
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(cleanRef)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    }
  );

  const payload = (await response.json()) as {
    status?: boolean;
    message?: string;
    data?: {
      id?: number | string;
      status?: string;
      reference?: string;
      amount?: number;
      currency?: string;
      channel?: string;
      gateway_response?: string;
      paid_at?: string;
    };
  };

  if (!response.ok || !payload.status || !payload.data) {
    return {
      verified: false,
      status: 'pending',
      message:
        payload.message || 'Unable to verify transaction with Paystack yet.',
      order,
      payment,
      items,
      mode,
    };
  }

  const tx = payload.data;
  const nowIso = new Date().toISOString();
  const db = getDb();

  if (tx.status === 'success') {
    // Strictly verify reference, amount (Kobo), and NGN currency
    if (
      tx.reference !== order.payment_reference ||
      Number(tx.amount) !== order.total_kobo ||
      (tx.currency || '').toUpperCase() !== 'NGN'
    ) {
      db.prepare(
        `UPDATE orders SET status = 'failed', updated_at = ? WHERE payment_reference = ?`
      ).run(nowIso, cleanRef);
      db.prepare(
        `UPDATE payment_records
         SET payment_status = 'failed', gateway_response = ?, updated_at = ?
         WHERE payment_reference = ?`
      ).run(
        `Verification mismatch: expected ${order.total_kobo} NGN, got ${tx.amount} ${tx.currency}`,
        nowIso,
        cleanRef
      );

      return {
        verified: false,
        status: 'failed',
        message: 'Payment amount or currency mismatch detected during verification.',
        order: getOrderByReference(cleanRef)!,
        payment: getPaymentRecordByReference(cleanRef)!,
        items,
        mode,
      };
    }

    db.exec('BEGIN');
    try {
      db.prepare(
        `UPDATE orders SET status = 'paid', updated_at = ? WHERE payment_reference = ? AND status != 'paid'`
      ).run(nowIso, cleanRef);

      db.prepare(
        `UPDATE payment_records
         SET transaction_id = ?, payment_method = ?, payment_status = 'success',
             gateway_response = ?, transaction_date = ?, updated_at = ?
         WHERE payment_reference = ?`
      ).run(
        String(tx.id ?? cleanRef),
        tx.channel || 'card',
        tx.gateway_response || 'Approved',
        tx.paid_at || nowIso,
        nowIso,
        cleanRef
      );
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }

    return {
      verified: true,
      status: 'success',
      message: 'Payment verified successfully with Paystack.',
      order: getOrderByReference(cleanRef)!,
      payment: getPaymentRecordByReference(cleanRef)!,
      items,
      mode,
    };
  }

  if (tx.status === 'failed' || tx.status === 'abandoned' || tx.status === 'reversed') {
    db.prepare(
      `UPDATE orders SET status = 'failed', updated_at = ? WHERE payment_reference = ? AND status != 'paid'`
    ).run(nowIso, cleanRef);
    db.prepare(
      `UPDATE payment_records
       SET transaction_id = ?, payment_method = ?, payment_status = 'failed',
           gateway_response = ?, updated_at = ?
       WHERE payment_reference = ? AND payment_status != 'success'`
    ).run(
      tx.id ? String(tx.id) : null,
      tx.channel || 'unknown',
      tx.gateway_response || tx.status,
      nowIso,
      cleanRef
    );

    return {
      verified: false,
      status: 'failed',
      message: tx.gateway_response || 'Transaction was not successful.',
      order: getOrderByReference(cleanRef)!,
      payment: getPaymentRecordByReference(cleanRef)!,
      items,
      mode,
    };
  }

  return {
    verified: false,
    status: 'pending',
    message: tx.gateway_response || 'Transaction is still pending confirmation.',
    order,
    payment,
    items,
    mode,
  };
}

export function verifyWebhookSignature(
  rawBody: Buffer,
  signatureHeader: string | undefined,
  overrideSecret?: string
): boolean {
  if (!signatureHeader) return false;
  const secret = overrideSecret ?? getPaystackWebhookSecret();
  if (!secret) return false;

  const expectedHex = crypto
    .createHmac('sha512', secret)
    .update(rawBody)
    .digest('hex');

  const sigBuf = Buffer.from(signatureHeader.trim(), 'utf8');
  const expBuf = Buffer.from(expectedHex, 'utf8');
  if (sigBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expBuf);
}

export interface WebhookProcessResult {
  handled: boolean;
  duplicate: boolean;
  status: 'processed' | 'duplicate' | 'ignored' | 'rejected';
  message: string;
}

export function processPaystackWebhookEvent(
  rawBody: Buffer,
  signatureHeader: string | undefined,
  overrideSecret?: string
): WebhookProcessResult {
  if (!verifyWebhookSignature(rawBody, signatureHeader, overrideSecret)) {
    return {
      handled: false,
      duplicate: false,
      status: 'rejected',
      message: 'Invalid Paystack webhook signature.',
    };
  }

  let parsed: {
    event?: string;
    data?: {
      id?: number | string;
      reference?: string;
      amount?: number;
      currency?: string;
      channel?: string;
      status?: string;
      gateway_response?: string;
      paid_at?: string;
    };
  };

  try {
    parsed = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return {
      handled: false,
      duplicate: false,
      status: 'rejected',
      message: 'Malformed webhook JSON payload.',
    };
  }

  const eventType = parsed.event || '';
  const data = parsed.data;
  const reference = data?.reference?.trim() || '';

  if (!reference || (eventType !== 'charge.success' && eventType !== 'charge.failed')) {
    return {
      handled: false,
      duplicate: false,
      status: 'ignored',
      message: `Ignored event "${eventType}".`,
    };
  }

  const db = getDb();
  const eventKey = `${eventType}:${reference}`;
  const alreadyProcessed = db
    .prepare('SELECT id FROM webhook_events WHERE event_key = ?')
    .get(eventKey) as { id: number } | undefined;

  if (alreadyProcessed) {
    return {
      handled: true,
      duplicate: true,
      status: 'duplicate',
      message: 'Duplicate webhook ignored safely.',
    };
  }

  const order = getOrderByReference(reference);
  if (!order) {
    return {
      handled: false,
      duplicate: false,
      status: 'ignored',
      message: `No local order found for reference ${reference}.`,
    };
  }

  const nowIso = new Date().toISOString();

  if (eventType === 'charge.success') {
    const amountOk = Number(data?.amount) === order.total_kobo;
    const currencyOk = (data?.currency || '').toUpperCase() === 'NGN';

    if (!amountOk || !currencyOk) {
      db.exec('BEGIN');
      try {
        db.prepare(
          `INSERT INTO webhook_events (event_key, event_type, payment_reference, received_at)
           VALUES (?, ?, ?, ?)`
        ).run(eventKey, eventType, reference, nowIso);
        db.prepare(
          `UPDATE orders SET status = 'failed', updated_at = ? WHERE payment_reference = ? AND status != 'paid'`
        ).run(nowIso, reference);
        db.prepare(
          `UPDATE payment_records
           SET payment_status = 'failed', gateway_response = ?, webhook_processed = 1, updated_at = ?
           WHERE payment_reference = ? AND payment_status != 'success'`
        ).run(
          `Webhook amount/currency mismatch: received ${data?.amount} ${data?.currency}`,
          nowIso,
          reference
        );
        db.exec('COMMIT');
      } catch (err) {
        db.exec('ROLLBACK');
        throw err;
      }

      return {
        handled: true,
        duplicate: false,
        status: 'rejected',
        message: 'Amount or currency mismatch in webhook payload.',
      };
    }

    db.exec('BEGIN');
    try {
      db.prepare(
        `INSERT INTO webhook_events (event_key, event_type, payment_reference, received_at)
         VALUES (?, ?, ?, ?)`
      ).run(eventKey, eventType, reference, nowIso);

      db.prepare(
        `UPDATE orders SET status = 'paid', updated_at = ? WHERE payment_reference = ?`
      ).run(nowIso, reference);

      db.prepare(
        `UPDATE payment_records
         SET transaction_id = ?, payment_method = ?, payment_status = 'success',
             gateway_response = ?, webhook_processed = 1, transaction_date = ?, updated_at = ?
         WHERE payment_reference = ?`
      ).run(
        String(data?.id ?? reference),
        data?.channel || 'card',
        data?.gateway_response || 'Successful',
        data?.paid_at || nowIso,
        nowIso,
        reference
      );
      db.exec('COMMIT');
    } catch (err) {
      db.exec('ROLLBACK');
      throw err;
    }

    return {
      handled: true,
      duplicate: false,
      status: 'processed',
      message: 'charge.success verified and recorded.',
    };
  }

  // Handle charge.failed
  db.exec('BEGIN');
  try {
    db.prepare(
      `INSERT INTO webhook_events (event_key, event_type, payment_reference, received_at)
       VALUES (?, ?, ?, ?)`
    ).run(eventKey, eventType, reference, nowIso);

    db.prepare(
      `UPDATE orders SET status = 'failed', updated_at = ? WHERE payment_reference = ? AND status != 'paid'`
    ).run(nowIso, reference);

    db.prepare(
      `UPDATE payment_records
       SET transaction_id = ?, payment_method = ?, payment_status = 'failed',
           gateway_response = ?, webhook_processed = 1, updated_at = ?
       WHERE payment_reference = ? AND payment_status != 'success'`
    ).run(
      data?.id ? String(data.id) : null,
      data?.channel || 'card',
      data?.gateway_response || 'Payment failed',
      nowIso,
      reference
    );
    db.exec('COMMIT');
  } catch (err) {
    db.exec('ROLLBACK');
    throw err;
  }

  return {
    handled: true,
    duplicate: false,
    status: 'processed',
    message: 'charge.failed recorded.',
  };
}
