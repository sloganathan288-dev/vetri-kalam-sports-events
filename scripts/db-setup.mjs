#!/usr/bin/env node
/**
 * Create / update the schema and seed the demo events.
 *
 *   npm run db:setup          # uses DATABASE_URL from .env
 *
 * Idempotent: safe to run repeatedly. Applies db/schema.sql (CREATE IF NOT
 * EXISTS) and then upserts every event from lib/catalogue.js, so editing a
 * date or a category in the catalogue and re-running this keeps the database
 * in step with what the site advertises.
 */
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// --- load .env --------------------------------------------------------------
const envFile = path.join(ROOT, '.env')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!m) continue
    let v = m[2]
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))
      v = v.slice(1, -1)
    if (process.env[m[1]] === undefined) process.env[m[1]] = v
  }
}

const url = process.env.DATABASE_URL
if (!url) {
  console.error('ERROR: DATABASE_URL is not set.\n  Copy .env.example to .env and fill it in.')
  process.exit(1)
}

const { default: pg } = await import('pg')
const isNeon = /neon\.(tech|json)/i.test(url)
const sslOpts = isNeon ? { rejectUnauthorized: false } : undefined
let client = new pg.Client({ connectionString: url, ssl: sslOpts })

const { EVENTS } = await import('../lib/catalogue.js')

/** `…/dbname` → `…/postgres`, so we can issue CREATE DATABASE if needed. */
function adminUrlFor(u) {
  const i = u.lastIndexOf('/')
  return i < 0 ? u : u.slice(0, i) + '/postgres'
}

function dbNameOf(u) {
  const i = u.lastIndexOf('/')
  return i < 0 ? '' : decodeURIComponent(u.slice(i + 1))
}

async function ensureDatabaseExists() {
  const probe = client
  try {
    await probe.connect()
    return
  } catch (err) {
    // 3D000 = invalid_catalog_name → the database itself does not exist yet.
    if (err.code !== '3D000') throw err
    try { await probe.end() } catch { /* ignore */ }
  }

  const name = dbNameOf(url)
  if (!name) throw new Error('Could not determine the database name from DATABASE_URL.')
  if (url.includes('neon.')) {
    throw new Error(`Database "${name}" does not exist on this Neon project. Create it in the Neon console.`)
  }

  console.log(`· creating database ${name}`)
  const admin = new pg.Client({ connectionString: adminUrlFor(url), ssl: sslOpts })
  await admin.connect()
  await admin.query(`CREATE DATABASE "${name.replace(/"/g, '""')}"`)
  await admin.end()

  // A client whose connect() failed is not safely reusable — build a fresh one.
  client = new pg.Client({ connectionString: url, ssl: sslOpts })
  await client.connect()
}

try {
  await ensureDatabaseExists()

  console.log('· applying db/schema.sql')
  const schema = readFileSync(path.join(ROOT, 'db', 'schema.sql'), 'utf8')
  await client.query(schema)
  console.log('  schema OK')

  console.log(`· seeding ${EVENTS.length} events`)
  const upsert = `
    INSERT INTO events (
      event_id, event_name, description, event_date, event_time, location,
      category, registration_fee, max_participants, registration_open, event_image
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    ON CONFLICT (event_id) DO UPDATE SET
      event_name         = EXCLUDED.event_name,
      description        = EXCLUDED.description,
      event_date         = EXCLUDED.event_date,
      event_time         = EXCLUDED.event_time,
      location           = EXCLUDED.location,
      category           = EXCLUDED.category,
      registration_fee   = EXCLUDED.registration_fee,
      max_participants   = EXCLUDED.max_participants,
      registration_open  = EXCLUDED.registration_open,
      event_image        = EXCLUDED.event_image,
      updated_at         = now()
  `
  for (const e of EVENTS) {
    await client.query(upsert, [
      e.eventId,
      e.eventName,
      e.description,
      e.date,
      e.time,
      e.location,
      e.category,
      e.registrationFee,
      e.maxParticipants,
      e.registrationOpen,
      e.eventImage,
    ])
    console.log(`  · ${e.eventId.padEnd(20)} ${e.eventName}`)
  }

  const counts = await client.query(
    'SELECT (SELECT count(*) FROM events) AS events, (SELECT count(*) FROM registrations) AS registrations'
  )
  console.log(
    `\nReady — ${counts.rows[0].events} events, ${counts.rows[0].registrations} registrations.`
  )
} catch (err) {
  console.error('\nERROR:', err.message)
  process.exitCode = 1
} finally {
  await client.end().catch(() => {})
}
