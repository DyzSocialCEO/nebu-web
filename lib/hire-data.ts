import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

export type HireStatus = "pending" | "approved" | "declined" | "delivered";

export type HireSubmission = {
  id: string;
  createdAt: string;
  handle: string;
  credit: string;
  story: string;
  coin: string;
  mood: string;
  paymentTx: string;
  quotedRate: string;
  status: HireStatus;
  response: string;
  deliveredTrack: string;
};

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), ".data");
const databasePath = path.join(dataDir, "hire.sqlite");

let database: DatabaseSync | null = null;

function getDatabase() {
  if (database) return database;
  mkdirSync(dataDir, { recursive: true });
  database = new DatabaseSync(databasePath);
  database.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS hire_submissions (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      handle TEXT NOT NULL,
      story TEXT NOT NULL,
      coin TEXT NOT NULL DEFAULT '',
      mood TEXT NOT NULL DEFAULT '',
      payment_tx TEXT NOT NULL,
      quoted_rate TEXT NOT NULL DEFAULT '',
      status TEXT NOT NULL DEFAULT 'pending',
      response TEXT NOT NULL DEFAULT '',
      delivered_track TEXT NOT NULL DEFAULT '',
      credit TEXT NOT NULL DEFAULT ''
    );
    CREATE INDEX IF NOT EXISTS hire_submissions_status_created
      ON hire_submissions(status, created_at DESC);
  `);
  const columns = database.prepare("PRAGMA table_info(hire_submissions)").all() as Record<string, unknown>[];
  if (!columns.some(column => String(column.name) === "credit")) {
    database.exec("ALTER TABLE hire_submissions ADD COLUMN credit TEXT NOT NULL DEFAULT ''");
  }
  return database;
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function rowToSubmission(row: Record<string, unknown>): HireSubmission {
  const status = String(row.status || "pending");
  return {
    id: String(row.id || ""),
    createdAt: String(row.created_at || ""),
    handle: String(row.handle || ""),
    credit: String(row.credit || ""),
    story: String(row.story || ""),
    coin: String(row.coin || ""),
    mood: String(row.mood || ""),
    paymentTx: String(row.payment_tx || ""),
    quotedRate: String(row.quoted_rate || ""),
    status: (["pending", "approved", "declined", "delivered"].includes(status) ? status : "pending") as HireStatus,
    response: String(row.response || ""),
    deliveredTrack: String(row.delivered_track || ""),
  };
}

export function createHireSubmission(input: {
  handle: unknown;
  credit?: unknown;
  story: unknown;
  coin?: unknown;
  mood?: unknown;
  paymentTx: unknown;
  quotedRate?: unknown;
}) {
  const handle = clean(input.handle, 80);
  const credit = clean(input.credit, 80);
  const story = clean(input.story, 1600);
  const coin = clean(input.coin, 120);
  const mood = clean(input.mood, 80);
  const paymentTx = clean(input.paymentTx, 240);
  const quotedRate = clean(input.quotedRate, 80);

  if (!handle || handle.length < 2) throw new Error("handle");
  if (!story || story.length < 8) throw new Error("story");
  if (!paymentTx || paymentTx.length < 8) throw new Error("paymentTx");

  const id = `hire-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const createdAt = new Date().toISOString();
  const db = getDatabase();
  db.prepare(`
    INSERT INTO hire_submissions
      (id, created_at, handle, story, coin, mood, payment_tx, quoted_rate, status, response, delivered_track, credit)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', '', '', ?)
  `).run(id, createdAt, handle, story, coin, mood, paymentTx, quotedRate, credit);

  return { id, createdAt };
}

export function listHireSubmissions(limit = 200): HireSubmission[] {
  const db = getDatabase();
  const safeLimit = Math.min(500, Math.max(1, Math.floor(limit)));
  const rows = db.prepare(`
    SELECT * FROM hire_submissions
    ORDER BY created_at DESC
    LIMIT ?
  `).all(safeLimit) as Record<string, unknown>[];
  return rows.map(rowToSubmission);
}

export function updateHireSubmission(input: {
  id: unknown;
  status?: unknown;
  response?: unknown;
  deliveredTrack?: unknown;
}) {
  const id = clean(input.id, 120);
  const requestedStatus = clean(input.status, 30);
  const status = (["pending", "approved", "declined", "delivered"].includes(requestedStatus)
    ? requestedStatus
    : "pending") as HireStatus;
  const response = clean(input.response, 500);
  const deliveredTrack = clean(input.deliveredTrack, 1000);
  if (!id) throw new Error("id");

  const db = getDatabase();
  const result = db.prepare(`
    UPDATE hire_submissions
    SET status = ?, response = ?, delivered_track = ?
    WHERE id = ?
  `).run(status, response, deliveredTrack, id);

  if (Number(result.changes) < 1) throw new Error("not-found");
  const row = db.prepare("SELECT * FROM hire_submissions WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  if (!row) throw new Error("not-found");
  return rowToSubmission(row);
}
