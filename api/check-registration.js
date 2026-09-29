/**
 * /api/check-registration
 *
 *   POST /api/check-registration   public — customer self-service lookup
 *
 * Requires BOTH the registration code AND the phone number used during
 * registration to match the same row. Returns a trimmed view only —
 * registration ID, participant name, event, category, registration date,
 * payment status and registration status. No contact details, no UTR, no
 * address, and no way to list or enumerate other participants' entries.
 */
const { ok, fail, methodNotAllowed, readJson, handler } = require('../lib/respond')
const { validateCheckRegistration } = require('../lib/validate')
const { findRegistrationForCustomer } = require('../lib/registrations')

module.exports = handler(async (req, res) => {
  if (req.method === 'OPTIONS') return ok(res, {})

  if (req.method === 'POST') {
    const body = await readJson(req)
    const result = validateCheckRegistration(body)

    if (!result.ok) {
      const e = new Error('Please correct the highlighted fields.')
      e.status = 400
      e.details = result.errors
      throw e
    }

    const registration = await findRegistrationForCustomer(
      result.value.registration_id,
      result.value.phone
    )

    if (!registration) {
      return fail(res, 404, 'Registration not found.')
    }

    return ok(res, { registration })
  }

  return methodNotAllowed(res, ['POST'])
})
