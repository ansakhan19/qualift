import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), 'qualift.db')

let _db

export function getDb() {
  if (!_db) {
    _db = new Database(DB_PATH)
    _db.pragma('journal_mode = WAL')
    _db.pragma('foreign_keys = ON')
    migrate(_db)
  }
  return _db
}

function migrate(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id          TEXT PRIMARY KEY,
      email       TEXT NOT NULL,
      token       TEXT,
      token_expires_at INTEGER,
      progress    TEXT NOT NULL DEFAULT '{}',
      created_at  INTEGER NOT NULL,
      updated_at  INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_email ON sessions(email);
    CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
  `)
}

// ── Session helpers ──────────────────────────────────────────────

export function getSessionByToken(token) {
  const db = getDb()
  return db.prepare('SELECT * FROM sessions WHERE token = ?').get(token)
}

export function getSessionByEmail(email) {
  const db = getDb()
  return db.prepare('SELECT * FROM sessions WHERE email = ? ORDER BY updated_at DESC LIMIT 1').get(email)
}

export function getSessionById(id) {
  const db = getDb()
  return db.prepare('SELECT * FROM sessions WHERE id = ?').get(id)
}

export function upsertSession({ id, email, token, tokenExpiresAt, progress }) {
  const db = getDb()
  const now = Date.now()
  db.prepare(`
    INSERT INTO sessions (id, email, token, token_expires_at, progress, created_at, updated_at)
    VALUES (@id, @email, @token, @tokenExpiresAt, @progress, @now, @now)
    ON CONFLICT(id) DO UPDATE SET
      email            = excluded.email,
      token            = excluded.token,
      token_expires_at = excluded.token_expires_at,
      progress         = excluded.progress,
      updated_at       = excluded.updated_at
  `).run({ id, email, token: token ?? null, tokenExpiresAt: tokenExpiresAt ?? null, progress: JSON.stringify(progress ?? {}), now })
}

export function updateProgress(sessionId, progress) {
  const db = getDb()
  db.prepare('UPDATE sessions SET progress = ?, updated_at = ? WHERE id = ?')
    .run(JSON.stringify(progress), Date.now(), sessionId)
}

export function clearToken(sessionId) {
  const db = getDb()
  db.prepare('UPDATE sessions SET token = NULL, token_expires_at = NULL WHERE id = ?').run(sessionId)
}
