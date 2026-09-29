/**
 * Registration data access — all SQL for the registration system lives here.
 *
 * Naming convention: SQL stays snake_case (matches the schema), every function
 * returns camelCase objects ready to be serialised to the browser.
 */
const { query, withTransaction } = require('./db')
const { generateRegistrationId } = require('./validate')

const COLUMNS = `
  id, registration_id, event_id, event_name, participant_name, date_of_birth, age,
  gender, phone, email, address, city, state,
  emergency_contact_name, emergency_contact_phone,
  category, race_category, tshirt_size,
  registration_date, payment_status, payment_utr, registration_status,
  created_at, updated_at
`

/**
 * Render a `date` column as `YYYY-MM-DD`.
 *
 * node-postgres hands DATE values back as a Date sitting at LOCAL midnight, so
 * the calendar day is in the local components. Taking the UTC day instead
 * (toISOString().slice(0,10)) silently loses a day in any positive-offset
 * timezone: 1995-06-15T00:00 IST serialises as 1995-06-14T18:30Z, i.e. the
 * participant's date of birth came back one day early. Values that are not a
 * Date (already a string, or null) are passed through untouched.
 */
function dateOnly(v) {
  if (!(v instanceof Date)) return v
  const p = (n) => String(n).padStart(2, '0')
  return `${v.getFullYear()}-${p(v.getMonth() + 1)}-${p(v.getDate())}`
}

function mapRow(r) {
  if (!r) return null
  return {
    id: Number(r.id),
    registrationId: r.registration_id,
    eventId: r.event_id,
    eventName: r.event_name,
    participantName: r.participant_name,
    dateOfBirth: dateOnly(r.date_of_birth),
    age: r.age,
    gender: r.gender,
    phone: r.phone,
    email: r.email,
    address: r.address,
    city: r.city,
    state: r.state,
    emergencyContactName: r.emergency_contact_name,
    emergencyContactPhone: r.emergency_contact_phone,
    category: r.category,
    raceCategory: r.race_category,
    tshirtSize: r.tshirt_size,
    registrationDate: r.registration_date,
    paymentStatus: r.payment_status,
    paymentUtr: r.payment_utr,
    registrationStatus: r.registration_status,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

/**
 * Insert one registration.
 *
 * - Retries with a fresh registration_id if the (very unlikely) code collides.
 * - Converts the (event_id, email) unique violation into a friendly 409 so a
 *   double-tapped submit button can never create two rows.
 * - `payment_status` and `registration_status` are written exactly as
 *   validated: always 'Pending'. Nothing here can mark a payment as Paid.
 */
async function createRegistration(value) {
  const sql = `
    INSERT INTO registrations (
      registration_id, event_id, event_name, participant_name, date_of_birth, age,
      gender, phone, email, address, city, state,
      emergency_contact_name, emergency_contact_phone,
      category, race_category, tshirt_size,
      registration_date, payment_status, payment_utr, registration_status
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,
      now(),$18,$19,$20
    )
    RETURNING ${COLUMNS}
  `

  const args = (v) => [
    v.registration_id, v.event_id, v.event_name, v.participant_name,
    v.date_of_birth, v.age, v.gender, v.phone, v.email, v.address,
    v.city, v.state, v.emergency_contact_name, v.emergency_contact_phone,
    v.category, v.race_category, v.tshirt_size,
    v.payment_status, v.payment_utr, v.registration_status,
  ]

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const result = await withTransaction((client) => client.query(sql, args(value)))
      return mapRow(result.rows[0])
    } catch (err) {
      if (err.code === '23505' && err.constraint === 'uq_reg_registration_id') {
        // Extremely unlikely — retry with a fresh code.
        value = Object.assign({}, value, { registration_id: generateRegistrationId() })
        continue
      }
      throw err
    }
  }
  throw Object.assign(new Error('Could not allocate a unique registration ID.'), { status: 500 })
}

/**
 * Build the WHERE clause shared by the list query and the count query.
 * Returns `{ where, params }` (1-based placeholders).
 */
function buildWhere(f) {
  const clauses = []
  const params = []
  const add = (clause, value) => {
    params.push(value)
    clauses.push(clause.replace('?', `$${params.length}`))
  }

  if (f.search) {
    const like = `%${f.search.replace(/[%_\\]/g, '\\$&')}%`
    params.push(like, like, like, like, like)
    const n = params.length
    clauses.push(
      `(participant_name ILIKE $${n - 4} OR registration_id ILIKE $${n - 3} ` +
      `OR phone ILIKE $${n - 2} OR email ILIKE $${n - 1} OR city ILIKE $${n})`
    )
  }
  if (f.eventId) add('event_id = ?', f.eventId)
  if (f.category) add('category = ?', f.category)
  if (f.raceCategory) add('race_category = ?', f.raceCategory)
  if (f.paymentStatus) add('payment_status = ?', f.paymentStatus)
  if (f.registrationStatus) add('registration_status = ?', f.registrationStatus)
  if (f.from) add('created_at >= ?::date', f.from)
  if (f.to) add('created_at < (?::date + interval \'1 day\')', f.to)

  return { where: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '', params }
}

/**
 * Paged, filtered registration list plus global dashboard counters.
 *
 * `items`/`total` respect the filters (so "12 of 340" reads correctly), while
 * `stats` is always computed over every row so the dashboard tiles show the
 * true overall picture.
 */
async function listRegistrations(f) {
  const { where, params } = buildWhere(f)

  const [rows, count, stats] = await Promise.all([
    query(
      `SELECT ${COLUMNS} FROM registrations ${where}
       ORDER BY ${f.sort} ${f.order === 'asc' ? 'ASC' : 'DESC'}, id DESC
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      params.concat([f.pageSize, (f.page - 1) * f.pageSize])
    ),
    query(`SELECT count(*)::int AS total FROM registrations ${where}`, params),
    query(
      `SELECT
         count(*)::int AS total,
         count(*) FILTER (WHERE payment_status = 'Paid')::int      AS paid,
         count(*) FILTER (WHERE payment_status = 'Pending')::int   AS paymentPending,
         count(*) FILTER (WHERE payment_status = 'Failed')::int    AS failed,
         count(*) FILTER (WHERE payment_status = 'Refunded')::int  AS refunded,
         count(*) FILTER (WHERE registration_status = 'Confirmed')::int AS confirmed,
         count(*) FILTER (WHERE registration_status = 'Pending')::int   AS statusPending,
         count(*) FILTER (WHERE registration_status = 'Waitlist')::int  AS waitlist,
         count(*) FILTER (WHERE registration_status = 'Cancelled')::int AS cancelled,
         count(DISTINCT event_id)::int AS events
       FROM registrations`
    ),
  ])

  const s = stats.rows[0]
  return {
    items: rows.rows.map(mapRow),
    total: count.rows[0].total,
    page: f.page,
    pageSize: f.pageSize,
    stats: {
      total: s.total,
      paid: s.paid,
      paymentPending: s.paymentPending,
      failed: s.failed,
      refunded: s.refunded,
      confirmed: s.confirmed,
      statusPending: s.statusPending,
      waitlist: s.waitlist,
      cancelled: s.cancelled,
      events: s.events,
    },
  }
}

/** Fetch every matching row (no pagination) — used by the Excel export. */
async function allRegistrations(f) {
  const { where, params } = buildWhere(f)
  const rows = await query(
    `SELECT ${COLUMNS} FROM registrations ${where}
     ORDER BY created_at DESC, id DESC LIMIT 100000`,
    params
  )
  return rows.rows.map(mapRow)
}

/** Accepts either the numeric id or the human registration code (VK-…). */
async function getRegistration(key) {
  const k = String(key || '').trim()
  if (!k) return null
  const isNumeric = /^\d+$/.test(k)
  const result = await query(
    `SELECT ${COLUMNS} FROM registrations
      WHERE ${isNumeric ? 'id = $1' : 'registration_id = $1'}
      LIMIT 1`,
    [isNumeric ? Number(k) : k.toUpperCase()]
  )
  return mapRow(result.rows[0])
}

/** Apply a partial update. Returns the fresh row, or null when not found. */
async function updateRegistration(key, updates) {
  const existing = await getRegistration(key)
  if (!existing) return null

  const keys = Object.keys(updates)
  if (keys.length === 0) return existing

  const sets = keys.map((k, i) => `${k} = $${i + 1}`)
  const params = keys.map((k) => updates[k])

  const result = await query(
    `UPDATE registrations SET ${sets.join(', ')}, updated_at = now()
      WHERE id = $${params.length + 1}
      RETURNING ${COLUMNS}`,
    params.concat([existing.id])
  )
  return mapRow(result.rows[0])
}

/**
 * Customer self-service lookup — finds a registration ONLY when BOTH the
 * registration code AND the phone number used during registration match the
 * same row. Returns a trimmed view (no contact details, no UTR, no address)
 * so nothing belonging to another participant can ever leak through.
 *
 * The phone comparison strips formatting and any leading 91 / +91 country
 * code from both sides, so "9876543210", "+91 98765 43210" and
 * "91-98765-43210" all match a stored "+919876543210".
 */
async function findRegistrationForCustomer(registrationId, phone) {
  const id = String(registrationId || '').trim().toUpperCase()
  const digits = String(phone || '').replace(/\D/g, '')
  const local = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits
  if (!id || !local) return null

  const result = await query(
    `SELECT registration_id, event_name, participant_name, category,
            registration_date, payment_status, registration_status
     FROM registrations
     WHERE UPPER(registration_id) = $1
       AND right(regexp_replace(phone, '\\D', '', 'g'), 10) = $2
     LIMIT 1`,
    [id, local]
  )
  const r = result.rows[0]
  if (!r) return null
  return {
    registrationId: r.registration_id,
    participantName: r.participant_name,
    eventName: r.event_name,
    category: r.category,
    registrationDate: dateOnly(r.registration_date),
    paymentStatus: r.payment_status,
    registrationStatus: r.registration_status,
  }
}

/** @returns {boolean} whether a row was actually removed. */
async function deleteRegistration(key) {
  const existing = await getRegistration(key)
  if (!existing) return false
  const result = await query('DELETE FROM registrations WHERE id = $1', [existing.id])
  return result.rowCount > 0
}

/** Aggregated counters for the dashboard header. */
async function getStats() {
  const result = await query(
    `SELECT
       count(*)::int AS total,
       count(*) FILTER (WHERE payment_status = 'Paid')::int      AS paid,
       count(*) FILTER (WHERE payment_status = 'Pending')::int   AS paymentPending,
       count(*) FILTER (WHERE registration_status = 'Confirmed')::int AS confirmed,
       count(*) FILTER (WHERE registration_status = 'Cancelled')::int AS cancelled,
       count(DISTINCT event_id)::int AS events
     FROM registrations`
  )
  const s = result.rows[0]
  return {
    total: s.total,
    paid: s.paid,
    paymentPending: s.paymentPending,
    confirmed: s.confirmed,
    cancelled: s.cancelled,
    events: s.events,
  }
}

module.exports = {
  createRegistration,
  listRegistrations,
  allRegistrations,
  getRegistration,
  findRegistrationForCustomer,
  updateRegistration,
  deleteRegistration,
  getStats,
}
