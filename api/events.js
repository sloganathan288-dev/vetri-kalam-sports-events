/**
 * GET /api/events — public event list.
 *
 * Serves the catalogue the registration form and the /event page read from.
 * No authentication required; no secrets returned.
 */
const { ok, methodNotAllowed, handler } = require('../lib/respond')
const { EVENTS, CATEGORIES, TSHIRT_SIZES, GENDERS } = require('../lib/catalogue')

module.exports = handler(async (req, res) => {
  if (req.method === 'OPTIONS') return ok(res, {})
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])

  return ok(res, {
    events: EVENTS.map((e) => ({
      eventId: e.eventId,
      eventName: e.eventName,
      description: e.description,
      date: e.date,
      time: e.time,
      location: e.location,
      category: e.category,
      registrationFee: e.registrationFee,
      maxParticipants: e.maxParticipants,
      registrationOpen: e.registrationOpen,
      eventImage: e.eventImage,
      raceCategories: e.raceCategories,
      tshirtRequired: e.tshirtRequired,
    })),
    categories: CATEGORIES,
    tshirtSizes: TSHIRT_SIZES,
    genders: GENDERS,
  })
})
