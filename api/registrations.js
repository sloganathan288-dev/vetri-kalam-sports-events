/**
 * /api/registrations
 *
 *   POST /api/registrations       public   — submit a new entry
 *   GET  /api/registrations       admin    — search / filter / page entries
 *
 * The public route can only ever create a row with payment_status =
 * 'Pending' and registration_status = 'Pending'; there is no code path here
 * that marks a payment as Paid.
 */
const { ok, fail, methodNotAllowed, readJson, getQuery, handler } = require('../lib/respond')
const { requireAdmin } = require('../lib/auth')
const { validateRegistration, parseListQuery } = require('../lib/validate')
const { createRegistration, listRegistrations, getStats } = require('../lib/registrations')

module.exports = handler(async (req, res) => {
  if (req.method === 'OPTIONS') return ok(res, {})

  // ------------------------------------------------------------------ POST
  if (req.method === 'POST') {
    const body = await readJson(req)
    const result = validateRegistration(body)

    if (!result.ok) {
      const e = new Error('Please correct the highlighted fields.')
      e.status = 400
      e.details = result.errors
      throw e
    }

    const row = await createRegistration(result.value)

    // Only reached after the INSERT has been acknowledged by PostgreSQL.
    return ok(
      res,
      {
        registration: row,
        registrationId: row.registrationId,
        message:
          'Registration stored. Keep a note of your registration ID — you will need it to check your entry.',
      },
      201
    )
  }

  // ------------------------------------------------------------------- GET
  if (req.method === 'GET') {
    if (!requireAdmin(req, res, fail)) return undefined

    const filters = parseListQuery(getQuery(req))
    const result = await listRegistrations(filters)
    return ok(res, result)
  }

  return methodNotAllowed(res, ['POST', 'GET'])
})

// Exported so the dev server can reuse the same aggregate without a round trip.
module.exports._getStats = getStats
