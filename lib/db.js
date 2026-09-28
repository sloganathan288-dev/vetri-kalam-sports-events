/**
 * PostgreSQL connection pool.
 *
 * Neon (and Vercel serverless) both require TLS with SNI; `pg` handles that
 * from the connection string alone. The pool object is cached on `globalThis`
 * so that warm lambda invocations reuse connections instead of exhausting
 * Neon's connection limit — the standard pattern for Vercel + Neon.
 *
 * The connection string is read from process.env only. It never reaches the
 * browser: nothing under src/ imports this file.
 */
const { Pool } = require('pg')

function createPool() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    const err = new Error(
      'DATABASE_URL is not set. Add it to .env (local) and to the Vercel project environment variables (production).'
    )
    err.status = 500
    err.code = 'DB_CONFIG'
    throw err
  }

  const isNeon = /neon\.(tech|json)/i.test(connectionString)

  return new Pool({
    connectionString,
    ssl: isNeon ? { rejectUnauthorized: false } : undefined,
    max: Number(process.env.PG_POOL_MAX || 3),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    // Vercel functions can be frozen between requests; a dead socket must not
    // take the whole pool with it.
    allowExitOnIdle: true,
  })
}

function getPool() {
  if (!globalThis.__VK_PG_POOL__) {
    globalThis.__VK_PG_POOL__ = createPool()
  }
  return globalThis.__VK_PG_POOL__
}

/**
 * Run `fn(client)` inside a transaction. Always rolls back unless `fn`
 * resolves, so a partial write can never be committed.
 */
async function withTransaction(fn) {
  const pool = getPool()
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (err) {
    try { await client.query('ROLLBACK') } catch { /* ignore */ }
    throw err
  } finally {
    client.release()
  }
}

/** Simple query helper using a pooled client. */
async function query(text, params) {
  return getPool().query(text, params)
}

module.exports = { getPool, withTransaction, query }
