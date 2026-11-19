import crypto from 'node:crypto';
import path from 'node:path';
import 'dotenv/config';
import express from 'express';
import {
  getDb,
  getOrderByReference,
  getPaymentRecordByReference,
  listActiveProducts,
  listPaymentRecords,
  saveEnquiry,
  softDeleteProduct,
  upsertProduct,
} from './server/db.ts';
import {
  getPaystackMode,
  getPaystackPublicKey,
  getPaystackWebhookSecret,
  initializePaystackCheckout,
  processPaystackWebhookEvent,
  verifyPaystackTransaction,
} from './server/paystack.ts';

export async function createAppServer() {
  getDb();

  const app = express();
  app.set('trust proxy', 1);

  // CRITICAL: Paystack webhook requires the exact raw body buffer BEFORE express.json()
  app.post(
    '/api/webhooks/paystack',
    express.raw({ type: 'application/json' }),
    (req, res) => {
      const rawBody = Buffer.isBuffer(req.body)
        ? req.body
        : Buffer.from(JSON.stringify(req.body || {}), 'utf8');
      const signature = req.header('x-paystack-signature');

      const result = processPaystackWebhookEvent(rawBody, signature);
      if (result.status === 'rejected' && !result.handled) {
        return res.status(401).json({ status: false, message: result.message });
      }
      return res.status(200).json({ ok: true, ...result });
    }
  );

  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      business: 'BAFFA NJANGIRDE AGRO-ALLIED FARM',
      currency: 'NGN',
      paystackMode: getPaystackMode(),
    });
  });

  app.post('/api/enquiries', (req, res) => {
    const body = req.body as {
      customerName?: string;
      customerPhone?: string;
      customerEmail?: string;
      interest?: string;
      message?: string;
      recipientEmail?: string;
    };

    if (!body.customerName || body.customerName.trim().length < 2) {
      return res.status(400).json({ error: 'Customer name is required.' });
    }
    if (!body.customerPhone || !/^[+\d\s()-]{7,20}$/.test(body.customerPhone.trim())) {
      return res.status(400).json({ error: 'Valid phone number is required.' });
    }
    if (!body.message || body.message.trim().length < 5) {
      return res.status(400).json({ error: 'Enquiry message is required.' });
    }

    const id = `ENQ-${Date.now().toString(36).toUpperCase()}-${crypto
      .randomBytes(2)
      .toString('hex')
      .toUpperCase()}`;

    const saved = saveEnquiry({
      id,
      recipientEmail: (body.recipientEmail || 'bamainahassan@gmail.com').trim(),
      customerName: body.customerName.trim(),
      customerPhone: body.customerPhone.trim(),
      customerEmail: body.customerEmail?.trim() || undefined,
      interest: (body.interest || 'General Farm Enquiry').trim(),
      message: body.message.trim(),
    });

    return res.status(201).json({ ok: true, enquiry: saved });
  });

  // Trusted server-side products & NGN pricing catalog
  app.get('/api/products', (_req, res) => {
    res.json({ products: listActiveProducts() });
  });

  app.post('/api/products', (req, res) => {
    const body = req.body as {
      id?: string;
      division?: 'livestock' | 'poultry' | 'fish-farming';
      name?: string;
      unit_label?: string;
      price_ngn?: number;
      description?: string;
      availability?: string;
      image_url?: string;
    };

    if (!body.name || !body.division || typeof body.price_ngn !== 'number' || body.price_ngn < 100) {
      return res.status(400).json({
        error: 'Product name, division, and a valid NGN price (>= 100) are required.',
      });
    }

    const id =
      body.id ||
      `prod-${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;

    const saved = upsertProduct({
      id,
      division: body.division,
      name: body.name.trim(),
      unit_label: (body.unit_label || 'Per Unit').trim(),
      price_ngn: Math.round(body.price_ngn),
      description: (body.description || 'Farm produce from Baffa Njangirde Agro-Allied Farm.').trim(),
      availability: (body.availability || 'Available on Enquiry').trim(),
      image_url: body.image_url || '/src/assets/images/hero_integrated_farm_1795091831726.jpg',
    });

    return res.status(201).json({ product: saved });
  });

  app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const body = req.body as {
      division?: 'livestock' | 'poultry' | 'fish-farming';
      name?: string;
      unit_label?: string;
      price_ngn?: number;
      description?: string;
      availability?: string;
      image_url?: string;
    };

    if (!body.name || !body.division || typeof body.price_ngn !== 'number' || body.price_ngn < 100) {
      return res.status(400).json({
        error: 'Valid product name, division, and NGN price (>= 100) are required.',
      });
    }

    const saved = upsertProduct({
      id,
      division: body.division,
      name: body.name.trim(),
      unit_label: (body.unit_label || 'Per Unit').trim(),
      price_ngn: Math.round(body.price_ngn),
      description: (body.description || '').trim(),
      availability: (body.availability || 'Available on Enquiry').trim(),
      image_url: body.image_url || '/src/assets/images/hero_integrated_farm_1795091831726.jpg',
    });

    return res.json({ product: saved });
  });

  app.delete('/api/products/:id', (req, res) => {
    softDeleteProduct(req.params.id);
    return res.json({ ok: true });
  });

  // Safe public Paystack config (never exposes secret or webhook keys)
  app.get('/api/payments/config', (_req, res) => {
    const mode = getPaystackMode();
    res.json({
      mode,
      currency: 'NGN',
      publicKey: getPaystackPublicKey() || null,
      webhookEndpoint: '/api/webhooks/paystack',
    });
  });

  // Initialize Paystack transaction using strictly server-side prices
  app.post('/api/payments/initialize', async (req, res) => {
    try {
      const { customerName, customerEmail, customerPhone, items } = req.body as {
        customerName: string;
        customerEmail: string;
        customerPhone: string;
        items: { productId: string; quantity: number }[];
      };

      const protocol = req.protocol || 'https';
      const host = req.get('host') || 'localhost:3000';
      const originUrl = process.env.APP_URL || `${protocol}://${host}`;

      const result = await initializePaystackCheckout({
        customerName,
        customerEmail,
        customerPhone,
        items,
        originUrl,
      });

      return res.json({ status: true, ...result });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unable to initialize payment.';
      return res.status(400).json({ status: false, error: message });
    }
  });

  // Verify transaction status
  app.get('/api/payments/verify/:reference', async (req, res) => {
    try {
      const verification = await verifyPaystackTransaction(req.params.reference);
      return res.json(verification);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Verification failed.';
      return res.status(404).json({ verified: false, status: 'failed', message });
    }
  });

  // List payment records for admin/records table
  app.get('/api/payments/records', (_req, res) => {
    const records = listPaymentRecords(100);
    res.json({ records });
  });

  // Local Test Sandbox Simulator endpoint (ONLY active when PAYSTACK_SECRET_KEY is not set)
  app.post('/api/payments/test-simulate', (req, res) => {
    if (getPaystackMode() !== 'simulation') {
      return res.status(403).json({
        error: 'Simulation endpoint is disabled when Paystack API keys are configured.',
      });
    }

    const { reference, outcome, channel } = req.body as {
      reference?: string;
      outcome?: 'success' | 'failed' | 'pending';
      channel?: 'card' | 'bank_transfer';
    };

    if (!reference || !outcome) {
      return res.status(400).json({ error: 'reference and outcome are required.' });
    }

    const order = getOrderByReference(reference);
    const payment = getPaymentRecordByReference(reference);
    if (!order || !payment) {
      return res.status(404).json({ error: 'Order not found for reference.' });
    }

    if (outcome === 'pending') {
      return res.json({
        status: 'pending',
        reference,
        redirectUrl: `/#payment-pending?reference=${encodeURIComponent(reference)}`,
      });
    }

    // Dispatch a genuine HMAC-SHA512 signed webhook event through the real webhook processor
    const simSecret = getPaystackWebhookSecret() || 'local_test_sandbox_secret';
    const eventPayload = {
      event: outcome === 'success' ? 'charge.success' : 'charge.failed',
      data: {
        id: Math.floor(100000000 + Math.random() * 900000000),
        reference: order.payment_reference,
        amount: order.total_kobo,
        currency: 'NGN',
        channel: channel || 'card',
        status: outcome,
        gateway_response:
          outcome === 'success'
            ? 'Successful (Paystack Test Sandbox)'
            : 'Declined by test card (Paystack Test Sandbox)',
        paid_at: new Date().toISOString(),
      },
    };
    const rawBody = Buffer.from(JSON.stringify(eventPayload), 'utf8');
    const signature = crypto
      .createHmac('sha512', simSecret)
      .update(rawBody)
      .digest('hex');

    processPaystackWebhookEvent(rawBody, signature, simSecret);

    const redirectUrl =
      outcome === 'success'
        ? `/#payment-success?reference=${encodeURIComponent(reference)}`
        : `/#payment-failed?reference=${encodeURIComponent(reference)}`;

    return res.json({ status: outcome, reference, redirectUrl });
  });

  // Frontend Vite dev middleware OR static dist serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  return app;
}

// Start server when run directly
const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(import.meta.filename);

if (isDirectRun) {
  const port = Number(process.env.PORT) || 3000;
  createAppServer().then((app) => {
    app.listen(port, '0.0.0.0', () => {
      console.log(
        `Baffa Njangirde Agro-Allied Farm server listening on http://0.0.0.0:${port}`
      );
    });
  });
}
