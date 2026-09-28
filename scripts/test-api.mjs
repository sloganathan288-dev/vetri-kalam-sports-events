#!/usr/bin/env node
/**
 * End-to-end integration test for the VETRI KALAM registration backend.
 *
 * Runs against the LOCAL dev API (npm run api) which serves the exact handlers
 * Vercel deploys, backed by the throwaway PostgreSQL cluster. It exercises the
 * real HTTP surface — no mocks, no in-memory storage.
 *
 *   node scripts/test-api.mjs
 *
 * Exits non-zero if any check fails.
 */
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BASE = process.env.TEST_API_BASE || 'http://127.0.0.1:5000'

// local admin credentials from .env
function readEnv(key) {
  const file = path.join(ROOT, '.env')
  try {
    const m = readFileSync(file, 'utf8').match(new RegExp(`^${key}=(.*)$`, 'm'))
    return m ? m[1].trim() : ''
  } catch { return '' }
}
const ADMIN_EMAIL = readEnv('ADMIN_EMAIL')
const ADMIN_PASSWORD = readEnv('ADMIN_PASSWORD')

let passed = 0
const failures = []

function check(name, cond, detail) {
  if (cond) {
    passed += 1
    console.log(`  PASS  ${name}`)
  } else {
    failures.push(name + (detail ? ` — ${detail}` : ''))
    console.log(`  FAIL  ${name}${detail ? ' — ' + detail : ''}`)
  }
}

async function call(method, pathname, { token, body, raw } = {}) {
  const headers = { Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const res = await fetch(BASE + pathname, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (raw) return { status: res.status, headers: res.headers, buffer: Buffer.from(await res.arrayBuffer()) }

  const text = await res.text()
  let data = null
  try { data = text ? JSON.parse(text) : null } catch { data = null }
  return { status: res.status, data, headers: res.headers }
}

const stamp = Date.now()
const UNIQUE = `${stamp}@test.vetrikalam.example`
const PARTICIPANT = `Test Runner ${stamp % 100000}`

const validBody = {
  registrationId: '',
  eventId: 'VK-MARATHON',
  participantName: PARTICIPANT,
  dateOfBirth: '1996-04-12',
  gender: 'Male',
  phone: '9876543210',
  email: UNIQUE,
  address: '12, Test Street',
  city: 'Salem',
  state: 'Tamil Nadu',
  emergencyContactName: 'Test Relative',
  emergencyContactPhone: '9876500011',
  category: 'Running & Marathon Events',
  raceCategory: '10K Challenge',
  tshirtSize: 'L',
  paymentUtr: '',
}

let token = ''
let createdId = ''
let createdDbId = 0

console.log(`\nVETRI KALAM API integration tests → ${BASE}\n`)

// ---------------------------------------------------------------- health ---
console.log('· public endpoints')
{
  const r = await call('GET', '/api/events')
  check('GET /api/events returns 200', r.status === 200, `got ${r.status}`)
  check('events payload has 6 events', (r.data?.events || []).length === 6, `got ${(r.data?.events || []).length}`)
  check('events include race categories', Array.isArray(r.data?.events?.[0]?.raceCategories))
  check('events carry no secret fields',
    r.data && JSON.stringify(r.data).indexOf('DATABASE_URL') === -1)
}

{
  const r = await call('POST', '/api/auth', { body: { email: 'nobody@example.com', password: 'wrong' } })
  check('login rejects wrong credentials (401)', r.status === 401, `got ${r.status}`)
}

{
  const r = await call('POST', '/api/auth', { body: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD } })
  check('login accepts correct credentials (200)', r.status === 200, `got ${r.status}`)
  check('login returns a JWT', typeof r.data?.token === 'string' && r.data.token.split('.').length === 3)
  check('login response contains no password', !JSON.stringify(r.data || {}).includes(ADMIN_PASSWORD))
  token = r.data?.token || ''
}

// ------------------------------------------------- unauthorized access -----
console.log('\n· authorization')
{
  const r = await call('GET', '/api/registrations')
  check('list without token → 401', r.status === 401, `got ${r.status}`)
}
{
  const r = await call('GET', '/api/registrations', { token: 'not.a.jwt' })
  check('list with garbage token → 401', r.status === 401, `got ${r.status}`)
}
{
  const r = await call('GET', '/api/export')
  check('export without token → 401', r.status === 401, `got ${r.status}`)
}

// --------------------------------------------------------- create: bad ------
console.log('\n· validation rejects bad input')
{
  const r = await call('POST', '/api/registrations', { body: {} })
  check('empty payload → 400', r.status === 400, `got ${r.status}`)
  check('empty payload returns field errors', !!(r.data && r.data.errors))
  const e = r.data?.errors || {}
  check('missing name flagged', !!e.participantName)
  check('missing phone flagged', !!e.phone)
  check('missing email flagged', !!e.email)
  check('missing event flagged', !!e.eventId)
  check('missing emergency contact flagged', !!e.emergencyContactName)
}
{
  const r = await call('POST', '/api/registrations', {
    body: { ...validBody, email: 'not-an-email', phone: '12345', raceCategory: 'Nonexistent Category' },
  })
  check('malformed email/phone/category → 400', r.status === 400, `got ${r.status}`)
  const e = r.data?.errors || {}
  check('bad email flagged', !!e.email)
  check('bad phone flagged', !!e.phone)
  check('unknown race category flagged', !!e.raceCategory)
}
{
  const r = await call('POST', '/api/registrations', {
    body: { ...validBody, email: `${stamp + 1}@test.vetrikalam.example`, dateOfBirth: '2030-01-01' },
  })
  check('future date of birth → 400', r.status === 400, `got ${r.status}`)
  check('future DOB flagged', !!(r.data?.errors?.dateOfBirth))
}

// -------------------------------------------------------- create: good -----
console.log('\n· registration lifecycle')
{
  const r = await call('POST', '/api/registrations', { body: validBody })
  check('valid registration → 201', r.status === 201, `got ${r.status}: ${JSON.stringify(r.data)}`)
  createdId = r.data?.registrationId || ''
  createdDbId = r.data?.registration?.id || 0
  check('server returned a registration ID', /^VK-\d{8}-[A-Z0-9]{6}$/.test(createdId), createdId)
  check('new registration is payment Pending',
    r.data?.registration?.paymentStatus === 'Pending', r.data?.registration?.paymentStatus)
  check('new registration is status Pending',
    r.data?.registration?.registrationStatus === 'Pending', r.data?.registration?.registrationStatus)
  check('age derived from DOB is 29/30', [29, 30].includes(r.data?.registration?.age),
    String(r.data?.registration?.age))
  check('phone normalised to +91', r.data?.registration?.phone === '+919876543210',
    r.data?.registration?.phone)
}

{
  const r = await call('POST', '/api/registrations', { body: validBody })
  check('duplicate email for same event → 409', r.status === 409, `got ${r.status}`)
}

// ------------------------------------------------------------ read: list ----
console.log('\n· list, search and filters')
let list
{
  const r = await call('GET', '/api/registrations?pageSize=5', { token })
  check('list with token → 200', r.status === 200, `got ${r.status}`)
  list = r.data
  check('list returns items array', Array.isArray(r.data?.items))
  check('list exposes global stats', typeof r.data?.stats?.total === 'number')
  check('stats.total >= 1', (r.data?.stats?.total || 0) >= 1, String(r.data?.stats?.total))
}
{
  const r = await call(`GET`, `/api/registrations?search=${encodeURIComponent(PARTICIPANT)}`, { token })
  check('search by name finds the row', (r.data?.items || []).some((i) => i.registrationId === createdId))
}
{
  const r = await call('GET', `/api/registrations?search=${encodeURIComponent(createdId)}`, { token })
  check('search by registration ID works', (r.data?.items || []).length === 1)
}
{
  const r = await call('GET', '/api/registrations?event=VK-CORPORATE&pageSize=200', { token })
  check('event filter excludes other events',
    (r.data?.items || []).every((i) => i.eventId === 'VK-CORPORATE'))
}
{
  const r = await call('GET', '/api/registrations?paymentStatus=Paid', { token })
  check('payment filter returns only Paid',
    (r.data?.items || []).every((i) => i.paymentStatus === 'Paid'))
}
{
  const r = await call('GET', '/api/registrations?registrationStatus=Nonsense', { token })
  check('invalid status filter is sanitised (200, not 500)', r.status === 200, `got ${r.status}`)
}
{
  const r = await call('GET', '/api/registrations?pageSize=2&page=1', { token })
  check('pageSize honoured', (r.data?.items || []).length <= 2)
  check('page metadata returned', r.data?.page === 1)
}

// --------------------------------------------------------------- single -----
console.log('\n· read / update / delete one registration')
{
  const r = await call('GET', `/api/registrations/${encodeURIComponent(createdId)}`, { token })
  check('fetch by registration ID → 200', r.status === 200, `got ${r.status}`)
  check('fetched row matches', r.data?.registration?.participantName === PARTICIPANT)
}
{
  const r = await call('GET', `/api/registrations/${createdDbId}`, { token })
  check('fetch by numeric id → 200', r.status === 200, `got ${r.status}`)
}
{
  const r = await call('GET', '/api/registrations/VK-00000000-XXXXXX', { token })
  check('unknown ID → 404', r.status === 404, `got ${r.status}`)
}
{
  const r = await call('PATCH', `/api/registrations/${createdDbId}`, {
    token,
    body: { paymentStatus: 'Paid', registrationStatus: 'Confirmed', paymentUtr: 'UTR123456789' },
  })
  check('PATCH statuses → 200', r.status === 200, `got ${r.status}: ${JSON.stringify(r.data)}`)
  check('payment status now Paid', r.data?.registration?.paymentStatus === 'Paid')
  check('registration status now Confirmed', r.data?.registration?.registrationStatus === 'Confirmed')
  check('UTR stored', r.data?.registration?.paymentUtr === 'UTR123456789')
}
{
  const r = await call('PATCH', `/api/registrations/${createdDbId}`, {
    token, body: { paymentStatus: 'Rocket Science' },
  })
  check('PATCH with invalid status → 400', r.status === 400, `got ${r.status}`)
}
{
  const r = await call('PATCH', `/api/registrations/${createdDbId}`, { body: { paymentStatus: 'Paid' } })
  check('PATCH without token → 401', r.status === 401, `got ${r.status}`)
}

// ---------------------------------------------------------------- export ----
console.log('\n· Excel export')
{
  const r = await call('GET', '/api/export', { token, raw: true })
  check('export → 200', r.status === 200, `got ${r.status}`)
  check('export content-type is xlsx',
    (r.headers.get('content-type') || '').includes('spreadsheetml'),
    r.headers.get('content-type'))
  const disposition = r.headers.get('content-disposition') || ''
  check('filename is VETRI-KALAM-Registrations-*.xlsx',
    /^attachment; filename="VETRI-KALAM-Registrations-\d{8}\.xlsx"$/.test(disposition), disposition)
  check('export has content', r.buffer.length > 1000, `${r.buffer.length} bytes`)
  // Real xlsx = a ZIP container beginning with the "PK" magic number.
  check('export is a genuine xlsx (ZIP magic)', r.buffer[0] === 0x50 && r.buffer[1] === 0x4b)
  const pk = r.buffer.toString('binary')
  check('xlsx contains [Content_Types].xml', pk.includes('[Content_Types].xml'))
  check('xlsx contains the worksheet part', pk.includes('sheet1.xml') || pk.includes('sheet'))

  // Parse the workbook for real and assert on cell contents — xlsx parts are
  // deflate-compressed, so a raw byte search would prove nothing.
  try {
    const ExcelJS = (await import('exceljs')).default
    const wb = new ExcelJS.Workbook()
    await wb.xlsx.load(r.buffer)
    const ws = wb.worksheets[0]
    const grid = []
    ws.eachRow((row) => grid.push(row.values.slice(1).map((c) => (c == null ? '' : String(c)))))
    const flat = grid.flat().join(' | ')

    check('export has the required header columns',
      flat.includes('Registration ID') && flat.includes('Participant Name') &&
      flat.includes('Payment / UTR ID') && flat.includes('Registration Status') &&
      flat.includes('Emergency Contact Phone') && flat.includes('T-Shirt Size'),
      grid.find((g) => g.includes('Registration ID'))?.slice(0, 6).join(', '))
    check('export contains the new registration ID', flat.includes(createdId))
    check('export contains the participant name', flat.includes(PARTICIPANT))
    // The sheet is written as 3 title rows + 1 header row before any data.
    const dataRows = ws.rowCount - 4
    check('export has at least one data row', dataRows >= 1,
      `data rows=${dataRows} (sheet rows=${ws.rowCount})`)
  } catch (err) {
    check('workbook parses with exceljs', false, err.message)
  }
}
{
  const r = await call('GET', '/api/export?event=VK-YOUTH', { token, raw: true })
  check('filtered export → 200', r.status === 200, `got ${r.status}`)
}

// ------------------------------------------------------------- database -----
console.log('\n· PostgreSQL (direct SQL, bypassing the API)')
{
  const { default: pg } = await import('pg')
  const envFile = readFileSync(`${ROOT}/.env`, 'utf8')
  const conn = (envFile.match(/^DATABASE_URL=(.*)$/m) || [])[1]
  const c = new pg.Client({ connectionString: conn })
  await c.connect()
  try {
    const row = (await c.query(
      `SELECT registration_id, participant_name, payment_status, registration_status,
              age, phone, tshirt_size, race_category
         FROM registrations WHERE registration_id = $1`, [createdId]
    )).rows[0]
    check('row exists in PostgreSQL', !!row, 'not found')
    check('DB stored payment_status = Paid (set by PATCH)', row?.payment_status === 'Paid', row?.payment_status)
    check('DB stored registration_status = Confirmed', row?.registration_status === 'Confirmed', row?.registration_status)
    check('DB stored normalised phone', row?.phone === '+919876543210', row?.phone)
    check('DB stored derived age', row?.age === 29 || row?.age === 30, String(row?.age))
    check('DB stored T-shirt size', row?.tshirt_size === 'L', row?.tshirt_size)

    const schema = await c.query(
      `SELECT indexname FROM pg_indexes WHERE tablename = 'registrations'`
    )
    const idx = schema.rows.map((r) => r.indexname)
    check('unique constraint on registration_id exists', idx.includes('uq_reg_registration_id'), idx.join(','))
    check('unique constraint on (event,email) exists', idx.includes('uq_reg_event_email'))
    check('search indexes present',
      idx.includes('idx_reg_name_lower') && idx.includes('idx_reg_email_lower') &&
      idx.includes('idx_reg_payment') && idx.includes('idx_reg_status'))

    const cons = await c.query(
      `SELECT conname, pg_get_constraintdef(oid) AS def
         FROM pg_constraint WHERE conrelid = 'registrations'::regclass AND contype = 'c'`
    )
    check('CHECK constraint blocks non-enum payment status',
      cons.rows.some((r) => r.def.includes('payment_status')))
    check('CHECK constraint blocks non-enum registration status',
      cons.rows.some((r) => r.def.includes('registration_status')))

    const counts = await c.query(
      `SELECT count(*)::int AS n FROM registrations WHERE email = $1`, [UNIQUE]
    )
    check('exactly one row for the test email (duplicate blocked)', counts.rows[0].n === 1,
      `got ${counts.rows[0].n}`)

    // Events seeded from lib/catalogue.js
    const ev = await c.query('SELECT count(*)::int AS n FROM events')
    check('6 seeded events in the events table', ev.rows[0].n === 6, `got ${ev.rows[0].n}`)
  } finally {
    await c.end()
  }
}

// --------------------------------------------------------------- delete -----
console.log('\n· delete')
{
  const r = await call('DELETE', `/api/registrations/${createdDbId}`, { token })
  check('DELETE → 200', r.status === 200, `got ${r.status}`)
}
{
  const r = await call('GET', `/api/registrations/${createdDbId}`, { token })
  check('deleted row now 404', r.status === 404, `got ${r.status}`)
}
{
  const r = await call('DELETE', `/api/registrations/${createdDbId}`)
  check('DELETE without token → 401', r.status === 401, `got ${r.status}`)
}

// ---------------------------------------------------------------- summary ---
console.log(`\n${'='.repeat(60)}`)
console.log(`PASSED: ${passed}   FAILED: ${failures.length}`)
if (failures.length) {
  console.log('\nFailures:')
  failures.forEach((f) => console.log('  · ' + f))
}
console.log('='.repeat(60) + '\n')
process.exit(failures.length ? 1 : 0)
