/**
 * VETRI KALAM Sports & Events — event catalogue.
 *
 * SINGLE SOURCE OF TRUTH for the public event list (GET /api/events), for the
 * registration form's Event / Category / Race-category dropdowns, and for the
 * seed data written into the `events` table by `npm run db:setup`.
 *
 * ---------------------------------------------------------------------------
 * DEMO CONTENT NOTICE
 * These are generic, fictional VETRI KALAM events used to demonstrate the
 * registration system end-to-end. They are NOT announcements of real fixtures.
 * The organiser edits this file (then re-runs `npm run db:setup`) to publish
 * real events. No results, awards, sponsors, participants, statistics or
 * partnerships are stated anywhere in this file.
 *
 * `registrationFee` is deliberately 0 for every demo event so that no price is
 * published. Set a value (> 0) only when a real fee has been agreed — doing so
 * makes the payment reference (UTR) field mandatory on the registration form.
 * ---------------------------------------------------------------------------
 */

const EVENTS = [
  {
    eventId: 'VK-MARATHON',
    eventName: 'VETRI KALAM Marathon',
    description:
      'Flagship road race across Salem with full marathon, half marathon, 10K and 5K categories.',
    date: '2026-12-06',
    time: '05:30',
    location: 'Salem, Tamil Nadu',
    category: 'Running & Marathon Events',
    registrationFee: 0,
    maxParticipants: null,
    registrationOpen: true,
    eventImage: 'images/event/e1.jpg',
    raceCategories: ['Full Marathon', 'Half Marathon', '10K Challenge', '5K Fun Run'],
    tshirtRequired: true,
  },
  {
    eventId: 'VK-SPORTS-FEST',
    eventName: 'VETRI KALAM Sports Fest',
    description:
      'Multi-sport festival featuring track and field, team games and individual championships.',
    date: '2026-11-22',
    time: '07:00',
    location: 'Salem, Tamil Nadu',
    category: 'Sports Competitions',
    registrationFee: 0,
    maxParticipants: null,
    registrationOpen: true,
    eventImage: 'images/event/e2.jpg',
    raceCategories: ['Track & Field', 'Team Sports', 'Individual Events'],
    tshirtRequired: true,
  },
  {
    eventId: 'VK-COMMUNITY-RUN',
    eventName: 'Community Run',
    description:
      'Open community race for first-time runners, families and running clubs.',
    date: '2026-11-08',
    time: '06:00',
    location: 'Salem, Tamil Nadu',
    category: 'Community Sports Events',
    registrationFee: 0,
    maxParticipants: null,
    registrationOpen: true,
    eventImage: 'images/event/e3.jpg',
    raceCategories: ['3K Walk', '5K Run', '10K Run'],
    tshirtRequired: true,
  },
  {
    eventId: 'VK-CORPORATE',
    eventName: 'Corporate Sports Challenge',
    description:
      'Inter-team corporate tournament with relay, tug-of-war and team obstacle events.',
    date: '2026-12-13',
    time: '08:00',
    location: 'Salem, Tamil Nadu',
    category: 'Corporate Sports Events',
    registrationFee: 0,
    maxParticipants: null,
    registrationOpen: true,
    eventImage: 'images/event/e4.jpg',
    raceCategories: ['Team Challenge', 'Relay Challenge', 'Individual Challenge'],
    tshirtRequired: true,
  },
  {
    eventId: 'VK-YOUTH',
    eventName: 'Youth Sports Championship',
    description:
      'Age-group athletics and games championship for school and college participants.',
    date: '2027-01-17',
    time: '07:30',
    location: 'Salem, Tamil Nadu',
    category: 'Sports Competitions',
    registrationFee: 0,
    maxParticipants: null,
    registrationOpen: true,
    eventImage: 'images/event/e5.jpg',
    raceCategories: ['Sub-Junior Boys', 'Sub-Junior Girls', 'Junior Boys', 'Junior Girls'],
    tshirtRequired: true,
  },
  {
    eventId: 'VK-10K-CHALLENGE',
    eventName: 'VETRI KALAM 10K Challenge',
    description: 'Timed 10K road race for competitive and recreational runners.',
    date: '2027-02-07',
    time: '06:00',
    location: 'Salem, Tamil Nadu',
    category: 'Running & Marathon Events',
    registrationFee: 0,
    maxParticipants: null,
    registrationOpen: true,
    eventImage: 'images/event/e6.jpg',
    raceCategories: ['10K Open', '10K Masters', '5K Fun Run'],
    tshirtRequired: true,
  },
]

/** Distinct event categories, used as the "Event Category" filter/dropdown. */
const CATEGORIES = Array.from(new Set(EVENTS.map((e) => e.category)))

const TSHIRT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

const GENDERS = ['Male', 'Female', 'Other', 'Prefer not to say']

function getEvent(eventId) {
  if (!eventId) return null
  return EVENTS.find((e) => e.eventId === String(eventId)) || null
}

/** Public shape — never leaks internal flags to the browser. */
function toPublic(e) {
  if (!e) return null
  return {
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
  }
}

module.exports = {
  EVENTS,
  CATEGORIES,
  TSHIRT_SIZES,
  GENDERS,
  getEvent,
  toPublic,
}
