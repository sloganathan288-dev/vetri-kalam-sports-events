/**
 * /api/registrations/:id
 *
 *   GET    /api/registrations/:id   admin — single record (by id or VK-… code)
 *   PATCH  /api/registrations/:id   admin — change payment / registration status
 *   DELETE /api/registrations/:id   admin — remove an entry
 *
 * The identifier may be the numeric primary key or the human-facing
 * registration code, so the organiser can paste either one from anywhere.
 */
const { ok, fail, methodNotAllowed, readJson, getParam, handler } = require('../../lib/respond')
const { requireAdmin } = require('../../lib/auth')
const { validatePatch } = require('../../lib/validate')
const {
  getRegistration,
  updateRegistration,
  deleteRegistration,
} = require('../../lib/registrations')

module.exports = handler(async (req, res) => {
  if (req.method === 'OPTIONS') return ok(res, {})

  if (!requireAdmin(req, res, fail)) return undefined

  const key = getParam(req, 'id')
  if (!key) return fail(res, 400, 'A registration id is required.')

  // ------------------------------------------------------------------- GET
  if (req.method === 'GET') {
    const row = await getRegistration(key)
    if (!row) return fail(res, 404, 'No registration matches that id.')
    return ok(res, { registration: row })
  }

  // ----------------------------------------------------------------- PATCH
  if (req.method === 'PATCH') {
    const body = await readJson(req)
    const patch = validatePatch(body)
    if (!patch.ok) {
      const e = new Error('Please correct the highlighted fields.')
      e.status = 400
      e.details = patch.errors
      throw e
    }
    if (Object.keys(patch.updates).length === 0) {
      return fail(res, 400, 'Nothing to update.')
    }

    const updated = await updateRegistration(key, patch.updates)
    if (!updated) return fail(res, 404, 'No registration matches that id.')
    return ok(res, { registration: updated, message: 'Registration updated.' })
  }

  // --------------------------------------------------------------- DELETE
  if (req.method === 'DELETE') {
    const removed = await deleteRegistration(key)
    if (!removed) return fail(res, 404, 'No registration matches that id.')
    return ok(res, { message: 'Registration deleted.' })
  }

  return methodNotAllowed(res, ['GET', 'PATCH', 'DELETE'])
})
