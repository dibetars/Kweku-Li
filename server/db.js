import sqlite3 from 'sqlite3'
import path from 'path'
import fs from 'fs'

const isVercel = process.env.VERCEL === '1'
const dataDir = isVercel ? '/tmp' : path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir)

// On Vercel, the database will be reset on each cold start.
// This is a known limitation of using SQLite in a serverless environment.
// For production persistence, use Vercel Postgres or Turso.
const db = new sqlite3.Database(path.join(dataDir, 'app.sqlite'))

export const getDb = () => db

export const initDb = (seedContent, bcrypt) => {
  db.serialize(() => {
    db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, role TEXT NOT NULL, created_at TEXT NOT NULL)')
    db.run('CREATE TABLE IF NOT EXISTS content (key TEXT PRIMARY KEY, value TEXT NOT NULL, updated_by INTEGER, updated_at TEXT NOT NULL)')
    db.run('CREATE TABLE IF NOT EXISTS audit_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, action TEXT NOT NULL, key TEXT, before TEXT, after TEXT, created_at TEXT NOT NULL, ip TEXT)')

    // Ensure admin user exists (re-seed on every startup for Vercel/ephemeral DBs)
    db.get('SELECT COUNT(*) as c FROM users WHERE username = ?', ['admin'], async (err, row) => {
      if (!err && row.c === 0) {
        console.log('Seeding admin user...')
        // Default password or from env
        const password = process.env.ADMIN_PASSWORD || 'password123'
        const hash = await bcrypt.hash(password, 12)
        const now = new Date().toISOString()
        db.run('INSERT INTO users (username, password_hash, role, created_at) VALUES (?, ?, ?, ?)', ['admin', hash, 'admin', now], (e) => {
          if (e) console.error('Failed to seed admin user:', e)
          else console.log('Admin user seeded.')
        })
      }
    })

    // Seed content if empty
    db.get('SELECT COUNT(*) as c FROM content', (err, row) => {
      if (!err && row.c === 0) {
        console.log('Seeding initial content...')
        const now = new Date().toISOString()
        const stmt = db.prepare('INSERT INTO content (key, value, updated_at) VALUES (?, ?, ?)')
        Object.entries(seedContent).forEach(([key, value]) => {
          stmt.run(key, value, now)
        })
        stmt.finalize()
      }
    })
  })
}
