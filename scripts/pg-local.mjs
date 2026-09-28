#!/usr/bin/env node
/**
 * Throwaway local PostgreSQL cluster — used ONLY to verify the schema, the
 * APIs, the dashboard and the Excel export during development. Nothing in the
 * application reads this file; production always uses DATABASE_URL (Neon).
 *
 *   node scripts/pg-local.mjs start    # initdb (first run) + start + create db
 *   node scripts/pg-local.mjs status   # is it up?
 *   node scripts/pg-local.mjs stop     # stop the cluster
 *   node scripts/pg-local.mjs reset    # destroy the data dir and start fresh
 *
 * The data directory (.pgdata) and log are git-ignored.
 */
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PGBIN = path.join(ROOT, 'node_modules', '@embedded-postgres', 'windows-x64', 'native', 'bin')
const DATA = process.env.PGDATA_DIR || path.join(ROOT, '.pgdata')
const LOG = path.join(ROOT, '.pgdata.log')
const PORT = Number(process.env.PGPORT || 5433)
const DB = process.env.PGDATABASE_NAME || 'vetri_kalam'
const USER = 'postgres'
const PASS = process.env.PGLOCAL_PASSWORD || 'vetri_local_test'

export const LOCAL_DATABASE_URL =
  `postgresql://${USER}:${encodeURIComponent(PASS)}@127.0.0.1:${PORT}/${DB}`

function bin(name) {
  const p = path.join(PGBIN, name)
  if (!existsSync(p)) {
    throw new Error(`PostgreSQL binary not found: ${p}\nRun: npm i -D embedded-postgres`)
  }
  return p
}

function run(exe, args, opts = {}) {
  const r = spawnSync(exe, args, { cwd: ROOT, encoding: 'utf8', ...opts })
  if (r.error) throw r.error
  return r
}

function isRunning() {
  if (!existsSync(path.join(DATA, 'postmaster.pid'))) return false
  const r = run(bin('pg_ctl.exe'), ['-D', DATA, 'status'], { stdio: 'pipe' })
  // pg_ctl status: exit 0 = running, 3 = not running, 4 = no data dir
  return r.status === 0
}

async function connect(url, sql) {
  const { default: pg } = await import('pg')
  const client = new pg.Client({ connectionString: url })
  await client.connect()
  try {
    return await client.query(sql)
  } finally {
    await client.end()
  }
}

function initCluster() {
  console.log(`· initialising cluster at ${DATA}`)
  mkdirSync(DATA, { recursive: true })
  const pw = path.join(ROOT, '.pgpw')
  writeFileSync(pw, PASS, 'utf8')
  try {
    const r = run(bin('initdb.exe'), [
      '-D', DATA,
      '-U', USER,
      '-E', 'UTF8',
      '--locale=C',
      '-A', 'scram-sha-256',
      '--pwfile=' + pw,
    ], { stdio: 'pipe' })
    if (r.status !== 0) {
      throw new Error(`initdb failed (${r.status}):\n${r.stdout || ''}\n${r.stderr || ''}`)
    }
  } finally {
    try { rmSync(pw, { force: true }) } catch { /* ignore */ }
  }
}

function startCluster() {
  console.log(`· starting PostgreSQL on 127.0.0.1:${PORT}`)
  const r = run(bin('pg_ctl.exe'), [
    '-D', DATA,
    '-l', LOG,
    '-o', `-p ${PORT} -c listen_addresses=127.0.0.1 -c fsync=off -c synchronous_commit=off`,
    'start',
  ], { stdio: 'pipe' })
  if (r.status !== 0) {
    const tail = existsSync(LOG) ? readFileSync(LOG, 'utf8').split('\n').slice(-25).join('\n') : ''
    throw new Error(`pg_ctl start failed (${r.status}):\n${r.stderr || ''}\n${tail}`)
  }
}

async function ensureDatabase() {
  const adminUrl =
    `postgresql://${USER}:${encodeURIComponent(PASS)}@127.0.0.1:${PORT}/postgres`
  const exists = await connect(adminUrl, `SELECT 1 FROM pg_database WHERE datname = $1`, [DB])
    .catch(async () => {
      // some drivers need a param-less probe; fall back to string interpolation
      const { default: pg } = await import('pg')
      const c = new pg.Client({ connectionString: adminUrl })
      await c.connect()
      const r = await c.query(`SELECT 1 FROM pg_database WHERE datname = '${DB}'`)
      await c.end()
      return r
    })
  if (exists.rowCount === 0) {
    console.log(`· creating database ${DB}`)
    const { default: pg } = await import('pg')
    const c = new pg.Client({ connectionString: adminUrl })
    await c.connect()
    await c.query(`CREATE DATABASE "${DB}"`)
    await c.end()
  } else {
    console.log(`· database ${DB} already exists`)
  }
}

const cmd = process.argv[2] || 'start'

try {
  if (cmd === 'stop') {
    if (!existsSync(DATA)) { console.log('· no cluster to stop'); process.exit(0) }
    run(bin('pg_ctl.exe'), ['-D', DATA, '-m', 'fast', 'stop'], { stdio: 'pipe' })
    console.log('· stopped')
  } else if (cmd === 'status') {
    console.log(isRunning() ? `RUNNING on 127.0.0.1:${PORT}` : 'NOT RUNNING')
  } else if (cmd === 'reset') {
    if (isRunning()) run(bin('pg_ctl.exe'), ['-D', DATA, '-m', 'fast', 'stop'], { stdio: 'pipe' })
    rmSync(DATA, { recursive: true, force: true })
    rmSync(LOG, { force: true })
    console.log('· wiped, restarting')
    initCluster(); startCluster(); await ensureDatabase()
    console.log('\nDATABASE_URL=' + LOCAL_DATABASE_URL)
  } else {
    if (!existsSync(path.join(DATA, 'PG_VERSION'))) initCluster()
    if (!isRunning()) startCluster()
    else console.log('· already running')
    await ensureDatabase()
    console.log('\nDATABASE_URL=' + LOCAL_DATABASE_URL)
  }
} catch (err) {
  console.error('ERROR:', err.message)
  process.exit(1)
}
