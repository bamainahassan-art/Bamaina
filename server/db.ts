import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';

export interface ServerProduct {
  id: string;
  division: 'livestock' | 'poultry' | 'fish-farming';
  name: string;
  unit_label: string;
  price_ngn: number;
  description: string;
  availability: string;
  image_url: string;
  active: number;
}

export interface OrderItemSnapshot {
  productId: string;
  name: string;
  unitLabel: string;
  quantity: number;
  unitPriceNgn: number;
  unitPriceKobo: number;
  lineTotalKobo: number;
}

export interface OrderRecord {
  id: string;
  payment_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items_json: string;
  subtotal_kobo: number;
  total_kobo: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: number;
  transaction_id: string | null;
  payment_reference: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  order_id: string;
  amount_kobo: number;
  amount_ngn: number;
  currency: string;
  payment_method: string;
  payment_status: 'pending' | 'success' | 'failed';
  gateway_response: string | null;
  webhook_processed: number;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

const DEFAULT_PRODUCTS: ServerProduct[] = [
  {
    id: 'prod-cattle',
    division: 'livestock',
    name: 'Healthy Beef Cattle',
    unit_label: 'Per Head',
    price_ngn: 450000,
    description:
      'Well-nourished cattle raised under attentive pastoral care and clean housing for households, events, and meat traders.',
    availability: 'Available on Enquiry',
    image_url: '/src/assets/images/livestock_pasture_cattle_1795091831949.jpg',
    active: 1,
  },
  {
    id: 'prod-small-ruminants',
    division: 'livestock',
    name: 'Rams, Sheep & Goats',
    unit_label: 'Per Head',
    price_ngn: 95000,
    description:
      'Healthy small ruminants suited to regional climate conditions, cared for with balanced forage and clean water.',
    availability: 'Available on Enquiry',
    image_url: '/src/assets/images/livestock_pasture_cattle_1795091831949.jpg',
    active: 1,
  },
  {
    id: 'prod-broilers',
    division: 'poultry',
    name: 'Broiler Chickens',
    unit_label: 'Per Bird',
    price_ngn: 8500,
    description:
      'Healthy, well-fed broiler birds raised in clean ventilated houses for households, restaurants, and market vendors.',
    availability: 'Wholesale & Retail',
    image_url: '/src/assets/images/poultry_broiler_house_1795091831037.jpg',
    active: 1,
  },
  {
    id: 'prod-eggs',
    division: 'poultry',
    name: 'Fresh Farm Eggs (Crate of 30)',
    unit_label: 'Per Crate',
    price_ngn: 5500,
    description:
      'Clean, farm-fresh table eggs produced under disciplined daily poultry management.',
    availability: 'Available on Enquiry',
    image_url: '/src/assets/images/poultry_broiler_house_1795091831037.jpg',
    active: 1,
  },
  {
    id: 'prod-catfish',
    division: 'fish-farming',
    name: 'Fresh Table-Size Catfish (1kg)',
    unit_label: 'Per Kg',
    price_ngn: 3800,
    description:
      'Healthy African catfish raised in clean aquaculture ponds with attentive water management and balanced nutrition.',
    availability: 'Available on Enquiry',
    image_url: '/src/assets/images/aquaculture_fish_ponds_1795091831987.jpg',
    active: 1,
  },
  {
    id: 'prod-juveniles',
    division: 'fish-farming',
    name: 'Catfish Grow-Out Stock (Pack of 100)',
    unit_label: 'Per 100 Juveniles',
    price_ngn: 15000,
    description:
      'Active, healthy pond stock nurtured under clean aquaculture practices.',
    availability: 'Seasonal Availability',
    image_url: '/src/assets/images/aquaculture_fish_ponds_1795091831987.jpg',
    active: 1,
  },
];

let dbInstance: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (dbInstance) return dbInstance;

  const dbPath =
    process.env.FARM_DB_PATH ||
    path.resolve(process.cwd(), 'data', 'baffa_farm.db');
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');

  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      division TEXT NOT NULL,
      name TEXT NOT NULL,
      unit_label TEXT NOT NULL DEFAULT 'Per Unit',
      price_ngn INTEGER NOT NULL,
      description TEXT NOT NULL,
      availability TEXT NOT NULL,
      image_url TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      payment_reference TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      items_json TEXT NOT NULL,
      subtotal_kobo INTEGER NOT NULL,
      total_kobo INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'NGN',
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payment_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_id TEXT,
      payment_reference TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      order_id TEXT NOT NULL,
      amount_kobo INTEGER NOT NULL,
      amount_ngn REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'NGN',
      payment_method TEXT NOT NULL DEFAULT 'pending',
      payment_status TEXT NOT NULL DEFAULT 'pending',
      gateway_response TEXT,
      webhook_processed INTEGER NOT NULL DEFAULT 0,
      transaction_date TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS webhook_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_key TEXT UNIQUE NOT NULL,
      event_type TEXT NOT NULL,
      payment_reference TEXT NOT NULL,
      received_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id TEXT PRIMARY KEY,
      recipient_email TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      interest TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  const countRow = db
    .prepare('SELECT COUNT(*) as cnt FROM products')
    .get() as { cnt: number };

  if (countRow.cnt === 0) {
    const insertStmt = db.prepare(`
      INSERT INTO products (id, division, name, unit_label, price_ngn, description, availability, image_url, active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const p of DEFAULT_PRODUCTS) {
      insertStmt.run(
        p.id,
        p.division,
        p.name,
        p.unit_label,
        p.price_ngn,
        p.description,
        p.availability,
        p.image_url,
        p.active
      );
    }
  }

  dbInstance = db;
  return db;
}

export function listActiveProducts(): ServerProduct[] {
  const db = getDb();
  return db
    .prepare('SELECT * FROM products WHERE active = 1 ORDER BY rowid ASC')
    .all() as unknown as ServerProduct[];
}

export function getProductById(id: string): ServerProduct | undefined {
  const db = getDb();
  return db
    .prepare('SELECT * FROM products WHERE id = ? AND active = 1')
    .get(id) as unknown as ServerProduct | undefined;
}

export function upsertProduct(product: Omit<ServerProduct, 'active'>): ServerProduct {
  const db = getDb();
  const existing = db
    .prepare('SELECT id FROM products WHERE id = ?')
    .get(product.id) as { id: string } | undefined;

  if (existing) {
    db.prepare(
      `UPDATE products
       SET division = ?, name = ?, unit_label = ?, price_ngn = ?, description = ?, availability = ?, image_url = ?, active = 1
       WHERE id = ?`
    ).run(
      product.division,
      product.name,
      product.unit_label,
      Math.max(100, Math.round(product.price_ngn)),
      product.description,
      product.availability,
      product.image_url,
      product.id
    );
  } else {
    db.prepare(
      `INSERT INTO products (id, division, name, unit_label, price_ngn, description, availability, image_url, active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`
    ).run(
      product.id,
      product.division,
      product.name,
      product.unit_label,
      Math.max(100, Math.round(product.price_ngn)),
      product.description,
      product.availability,
      product.image_url
    );
  }
  return getProductById(product.id)!;
}

export function softDeleteProduct(id: string): void {
  const db = getDb();
  db.prepare('UPDATE products SET active = 0 WHERE id = ?').run(id);
}

export function getOrderByReference(reference: string): OrderRecord | undefined {
  const db = getDb();
  return db
    .prepare('SELECT * FROM orders WHERE payment_reference = ?')
    .get(reference) as unknown as OrderRecord | undefined;
}

export function getPaymentRecordByReference(
  reference: string
): PaymentRecord | undefined {
  const db = getDb();
  return db
    .prepare('SELECT * FROM payment_records WHERE payment_reference = ?')
    .get(reference) as unknown as PaymentRecord | undefined;
}

export function listPaymentRecords(limit = 50): PaymentRecord[] {
  const db = getDb();
  return db
    .prepare('SELECT * FROM payment_records ORDER BY id DESC LIMIT ?')
    .all(limit) as unknown as PaymentRecord[];
}

export function saveEnquiry(input: {
  id: string;
  recipientEmail: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  interest: string;
  message: string;
}) {
  const db = getDb();
  const createdAt = new Date().toISOString();
  db.prepare(
    `INSERT INTO enquiries (id, recipient_email, customer_name, customer_phone, customer_email, interest, message, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    input.id,
    input.recipientEmail,
    input.customerName,
    input.customerPhone,
    input.customerEmail || null,
    input.interest,
    input.message,
    createdAt
  );
  return { id: input.id, recipientEmail: input.recipientEmail, createdAt };
}

