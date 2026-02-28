import { join } from "path";
import { readFileSync, writeFileSync, existsSync } from "fs";

/* ─── Database path ───
   Production (Coolify): /data/sandbox-feedback.sqlite (persistent volume)
   Dev: project root sandbox-feedback.sqlite / sandbox-feedback.json (fallback)
*/
const DB_PATH =
  process.env.NODE_ENV === "production"
    ? "/data/sandbox-feedback.sqlite"
    : join(process.cwd(), "sandbox-feedback.sqlite");

const JSON_FALLBACK = join(process.cwd(), "sandbox-feedback.json");

/* ─── Types ─── */

export interface FeedbackRow {
  id: number;
  section: string;
  version: string | null;
  user_email: string;
  user_name: string | null;
  rating: number | null;
  comment: string;
  status: string;
  resolution_note: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export interface FeedbackInput {
  section: string;
  version?: string;
  user_email: string;
  user_name?: string;
  rating?: number;
  comment: string;
}

/* ─── Try loading better-sqlite3 (native, production) ─── */

let _sqliteDb: ReturnType<typeof initSqlite> | null = null;
let _usingSqlite = false;

function initSqlite() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Database = require("better-sqlite3");
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL,
      version TEXT,
      user_email TEXT NOT NULL,
      user_name TEXT,
      rating INTEGER CHECK(rating BETWEEN 1 AND 5),
      comment TEXT NOT NULL,
      status TEXT DEFAULT 'open' CHECK(status IN ('open','acknowledged','done')),
      resolution_note TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      resolved_at TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_feedback_section ON feedback(section);
    CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
    CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback(user_email);
  `);
  return db;
}

function getSqliteDb() {
  if (!_sqliteDb) {
    _sqliteDb = initSqlite();
    _usingSqlite = true;
  }
  return _sqliteDb;
}

/* ─── JSON fallback for local dev when native module unavailable ─── */

function loadJson(): FeedbackRow[] {
  try {
    if (existsSync(JSON_FALLBACK)) {
      return JSON.parse(readFileSync(JSON_FALLBACK, "utf-8"));
    }
  } catch { /* first run */ }
  return [];
}

function saveJson(rows: FeedbackRow[]) {
  writeFileSync(JSON_FALLBACK, JSON.stringify(rows, null, 2), "utf-8");
}

let _nextId: number | null = null;
function nextJsonId(): number {
  const rows = loadJson();
  if (_nextId === null) {
    _nextId = rows.reduce((max, r) => Math.max(max, r.id), 0);
  }
  _nextId++;
  return _nextId;
}

/* ─── Detect backend ─── */

let _backendChecked = false;
function canUseSqlite(): boolean {
  if (_backendChecked) return _usingSqlite;
  _backendChecked = true;
  try {
    getSqliteDb();
    return true;
  } catch {
    console.warn("[db] better-sqlite3 unavailable, using JSON fallback for dev");
    return false;
  }
}

/* ─── Public API ─── */

export function addFeedback(input: FeedbackInput): FeedbackRow {
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);

  if (canUseSqlite()) {
    const db = getSqliteDb();
    const stmt = db.prepare(`
      INSERT INTO feedback (section, version, user_email, user_name, rating, comment)
      VALUES (@section, @version, @user_email, @user_name, @rating, @comment)
    `);
    const result = stmt.run({
      section: input.section,
      version: input.version ?? null,
      user_email: input.user_email,
      user_name: input.user_name ?? null,
      rating: input.rating ?? null,
      comment: input.comment,
    });
    return db.prepare("SELECT * FROM feedback WHERE id = ?").get(result.lastInsertRowid) as FeedbackRow;
  }

  // JSON fallback
  const rows = loadJson();
  const row: FeedbackRow = {
    id: nextJsonId(),
    section: input.section,
    version: input.version ?? null,
    user_email: input.user_email,
    user_name: input.user_name ?? null,
    rating: input.rating ?? null,
    comment: input.comment,
    status: "open",
    resolution_note: null,
    created_at: now,
    updated_at: now,
    resolved_at: null,
  };
  rows.unshift(row);
  saveJson(rows);
  return row;
}

export function getFeedback(filters?: {
  section?: string;
  status?: string;
  user_email?: string;
  limit?: number;
}): FeedbackRow[] {
  if (canUseSqlite()) {
    const db = getSqliteDb();
    const conditions: string[] = [];
    const params: Record<string, unknown> = {};

    if (filters?.section) {
      conditions.push("section = @section");
      params.section = filters.section;
    }
    if (filters?.status) {
      conditions.push("status = @status");
      params.status = filters.status;
    }
    if (filters?.user_email) {
      conditions.push("user_email = @user_email");
      params.user_email = filters.user_email;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const limit = filters?.limit ? `LIMIT ${filters.limit}` : "";
    return db
      .prepare(`SELECT * FROM feedback ${where} ORDER BY created_at DESC ${limit}`)
      .all(params) as FeedbackRow[];
  }

  // JSON fallback
  let rows = loadJson();
  if (filters?.section) rows = rows.filter((r) => r.section === filters.section);
  if (filters?.status) rows = rows.filter((r) => r.status === filters.status);
  if (filters?.user_email) rows = rows.filter((r) => r.user_email === filters.user_email);
  rows.sort((a, b) => b.created_at.localeCompare(a.created_at));
  if (filters?.limit) rows = rows.slice(0, filters.limit);
  return rows;
}

export function resolveFeedback(
  id: number,
  status: "acknowledged" | "done",
  resolution_note?: string,
): FeedbackRow | null {
  const now = new Date().toISOString().replace("T", " ").slice(0, 19);
  const resolvedAt = status === "done" ? now : null;

  if (canUseSqlite()) {
    const db = getSqliteDb();
    db.prepare(`
      UPDATE feedback
      SET status = @status,
          resolution_note = @resolution_note,
          updated_at = datetime('now'),
          resolved_at = @resolved_at
      WHERE id = @id
    `).run({
      id,
      status,
      resolution_note: resolution_note ?? null,
      resolved_at: resolvedAt,
    });
    return (db.prepare("SELECT * FROM feedback WHERE id = ?").get(id) as FeedbackRow) ?? null;
  }

  // JSON fallback
  const rows = loadJson();
  const row = rows.find((r) => r.id === id);
  if (!row) return null;
  row.status = status;
  row.resolution_note = resolution_note ?? null;
  row.updated_at = now;
  row.resolved_at = resolvedAt;
  saveJson(rows);
  return row;
}

export function getFeedbackStats(): Record<string, { total: number; open: number }> {
  if (canUseSqlite()) {
    const db = getSqliteDb();
    const rows = db
      .prepare(`
        SELECT section,
               COUNT(*) as total,
               SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open
        FROM feedback
        GROUP BY section
      `)
      .all() as Array<{ section: string; total: number; open: number }>;

    const stats: Record<string, { total: number; open: number }> = {};
    for (const r of rows) {
      stats[r.section] = { total: r.total, open: r.open };
    }
    return stats;
  }

  // JSON fallback
  const rows = loadJson();
  const stats: Record<string, { total: number; open: number }> = {};
  for (const r of rows) {
    if (!stats[r.section]) stats[r.section] = { total: 0, open: 0 };
    stats[r.section].total++;
    if (r.status === "open") stats[r.section].open++;
  }
  return stats;
}
