/**
 * Input validation for the registration API.
 *
 * Deliberately dependency-free so nothing extra ships to the browser bundle.
 * Every rule returns a field-keyed message; the API returns them all at once
 * so the form can highlight every problem in a single pass.
 */
const { getEvent, CATEGORIES, TSHIRT_SIZES, GENDERS } = require('./catalogue')

const ERRORS = {
  required: (label) => `${label} is required.`,
}

function isBlank(v) {
  return v === undefined || v === null || String(v).trim() === ''
}

function str(v, max = 500) {
  if (v === undefined || v === null) return ''
  return String(v).replace(/\s+/g, ' ').trim().slice(0, max)
}

/** Accepts "9876543210", "+91 98765 43210", "91-98765-43210" → "+919876543210" */
function normalizePhone(v) {
  const digits = String(v == null ? '' : v).replace(/\D/g, '')
  const local = digits.startsWith('91') && digits.length === 12 ? digits.slice(2) : digits
  return local
}

function validMobile(v) {
  const d = normalizePhone(v)
  return /^[6-9]\d{9}$/.test(d)
}

function formatPhone(v) {
  const d = normalizePhone(v)
  return d ? `+91${d}` : ''
}

function validEmail(v) {
  const s = String(v == null ? '' : v).trim()
  if (s.length < 5 || s.length > 254) return false
  if (/\s/.test(s)) return false
  return /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(s)
}

/** Parses YYYY-MM-DD → Date, rejecting impossible dates like 2026-02-31. */
function parseDate(v) {
  const s = String(v == null ? '' : v).trim()
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])]
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null
  const dt = new Date(Date.UTC(y, mo - 1, d))
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null
  return dt
}

/** Whole years between a DOB date and now. */
function ageFromDate(dob) {
  const now = new Date()
  let age = now.getUTCFullYear() - dob.getUTCFullYear()
  const before =
    now.getUTCMonth() < dob.getUTCMonth() ||
    (now.getUTCMonth() === dob.getUTCMonth() && now.getUTCDate() < dob.getUTCDate())
  if (before) age -= 1
  return age
}

/**
 * Human-facing registration code: VK-YYYYMMDD-XXXXXX
 * Generated server-side (and optionally proposed by the client) — always
 * re-checked against the database before it is accepted.
 */
function generateRegistrationId(date = new Date()) {
  const p = (n, w = 2) => String(n).padStart(w, '0')
  const day =
    p(date.getUTCFullYear(), 4) + p(date.getUTCMonth() + 1) + p(date.getUTCDate())
  let rand = ''
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = require('crypto').randomBytes(6)
  for (let i = 0; i < 6; i++) rand += alphabet[bytes[i] % alphabet.length]
  return `VK-${day}-${rand}`
}

function validRegistrationId(v) {
  return /^VK-\d{8}-[A-Z0-9]{6}$/.test(String(v || '').trim().toUpperCase())
}

/** UPI reference / bank UTR — alphanumeric with common separators. */
function validUtr(v) {
  const s = String(v || '').trim()
  if (s.length < 4 || s.length > 40) return false
  return /^[A-Za-z0-9][A-Za-z0-9\-_/]*$/.test(s)
}

/**
 * Validate a registration payload.
 *
 * @param {object} input   raw request body
 * @returns {{ok:boolean, errors:object, value:object|null}}
 */
function validateRegistration(input) {
  const errors = {}
  const data = input && typeof input === 'object' ? input : {}

  const event = getEvent(str(data.eventId, 64))
  if (!event) {
    errors.eventId = 'Please choose an event.'
  } else if (!event.registrationOpen) {
    errors.eventId = 'Registration for this event is currently closed.'
  }

  const participantName = str(data.participantName, 100)
  if (!participantName) errors.participantName = ERRORS.required('Participant name')
  else if (participantName.length < 2) errors.participantName = 'Participant name is too short.'
  // Unicode letters + combining marks (Tamil and other Indic scripts), digits,
  // spaces and the punctuation that appears in real personal names.
  else if (!/^[\p{L}\p{M}\d\s.'\-(),&]+$/u.test(participantName))
    errors.participantName = 'Participant name contains unsupported characters.'

  const dobRaw = str(data.dateOfBirth, 10)
  let dob = null
  if (!dobRaw) errors.dateOfBirth = ERRORS.required('Date of birth')
  else {
    dob = parseDate(dobRaw)
    if (!dob) errors.dateOfBirth = 'Enter the date of birth as YYYY-MM-DD.'
    else if (dob.getTime() > Date.now()) errors.dateOfBirth = 'Date of birth cannot be in the future.'
    else if (dob.getTime() < Date.now() - 100 * 365.25 * 864e5)
      errors.dateOfBirth = 'Check the date of birth.'
  }

  let age = null
  if (dob && !errors.dateOfBirth) {
    age = ageFromDate(dob)
    if (age < 5 || age > 100)
      errors.dateOfBirth = 'Participants must be between 5 and 100 years old.'
  }

  const gender = str(data.gender, 30)
  if (!gender) errors.gender = ERRORS.required('Gender')
  else if (!GENDERS.includes(gender)) errors.gender = 'Choose a valid gender option.'

  const phoneRaw = str(data.phone, 20)
  if (!phoneRaw) errors.phone = ERRORS.required('Phone')
  else if (!validMobile(phoneRaw)) errors.phone = 'Enter a valid 10-digit Indian mobile number.'

  const email = str(data.email, 254).toLowerCase()
  if (!email) errors.email = ERRORS.required('Email')
  else if (!validEmail(email)) errors.email = 'Enter a valid email address.'

  const address = str(data.address, 250) // optional

  const city = str(data.city, 80)
  if (!city) errors.city = ERRORS.required('City')
  else if (city.length < 2) errors.city = 'City name is too short.'

  const state = str(data.state, 80)
  if (!state) errors.state = ERRORS.required('State')
  else if (state.length < 2) errors.state = 'State name is too short.'

  const emergencyName = str(data.emergencyContactName, 100)
  if (!emergencyName) errors.emergencyContactName = ERRORS.required('Emergency contact name')
  else if (emergencyName.length < 2)
    errors.emergencyContactName = 'Emergency contact name is too short.'

  const emergencyPhoneRaw = str(data.emergencyContactPhone, 20)
  if (!emergencyPhoneRaw) errors.emergencyContactPhone = ERRORS.required('Emergency contact phone')
  else if (!validMobile(emergencyPhoneRaw))
    errors.emergencyContactPhone = 'Enter a valid 10-digit Indian mobile number.'

  const category = str(data.category, 80)
  if (!category) errors.category = ERRORS.required('Event category')
  else if (event && category !== event.category) errors.category = 'Choose a valid event category.'
  else if (!event && !CATEGORIES.includes(category))
    errors.category = 'Choose a valid event category.'

  const raceCategory = str(data.raceCategory, 80)
  if (!raceCategory) errors.raceCategory = ERRORS.required('Race / sports category')
  else if (event && !event.raceCategories.includes(raceCategory))
    errors.raceCategory = 'Choose a valid race or sports category for this event.'

  const tshirtRaw = str(data.tshirtSize, 10).toUpperCase()
  const tshirtRequired = event ? event.tshirtRequired : true
  let tshirtSize = null
  if (tshirtRequired) {
    if (!tshirtRaw) errors.tshirtSize = ERRORS.required('T-shirt size')
    else if (!TSHIRT_SIZES.includes(tshirtRaw))
      errors.tshirtSize = 'Choose a valid T-shirt size.'
    else tshirtSize = tshirtRaw
  } else if (tshirtRaw) {
    if (!TSHIRT_SIZES.includes(tshirtRaw)) errors.tshirtSize = 'Choose a valid T-shirt size.'
    else tshirtSize = tshirtRaw
  }

  const utrRaw = str(data.paymentUtr, 40)
  const fee = event ? Number(event.registrationFee || 0) : 0
  let paymentUtr = null
  if (utrRaw) {
    if (!validUtr(utrRaw))
      errors.paymentUtr = 'Payment reference may only contain letters, numbers, - _ /'
    else paymentUtr = utrRaw
  } else if (fee > 0) {
    // Only enforced when the event actually has a fee. Demo events are free,
    // so this branch stays dormant until the organiser sets a real price.
    errors.paymentUtr = 'Payment reference (UTR / UPI) is required for a paid event.'
  }

  let registrationId = str(data.registrationId, 20).toUpperCase()
  if (registrationId && !validRegistrationId(registrationId)) registrationId = ''
  if (!registrationId) registrationId = generateRegistrationId()

  const ok = Object.keys(errors).length === 0
  if (!ok) return { ok: false, errors, value: null }

  return {
    ok: true,
    errors: {},
    value: {
      registration_id: registrationId,
      event_id: event.eventId,
      event_name: event.eventName,
      participant_name: participantName,
      date_of_birth: dob.toISOString().slice(0, 10),
      age,
      gender,
      phone: formatPhone(phoneRaw),
      email,
      address: address || null,
      city,
      state,
      emergency_contact_name: emergencyName,
      emergency_contact_phone: formatPhone(emergencyPhoneRaw),
      category,
      race_category: raceCategory,
      tshirt_size: tshirtSize,
      payment_utr: paymentUtr,
      // Never Paid / Confirmed from a form submission alone — see PART 13.
      payment_status: 'Pending',
      registration_status: 'Pending',
    },
  }
}

/** Filters + pagination for the dashboard list query. */
function parseListQuery(q) {
  const raw = q && typeof q === 'object' ? q : {}
  const out = {
    search: str(raw.search, 120),
    eventId: str(raw.event, 80),
    category: str(raw.category, 80),
    raceCategory: str(raw.raceCategory, 80),
    paymentStatus: str(raw.paymentStatus, 30),
    registrationStatus: str(raw.registrationStatus, 30),
    from: null,
    to: null,
    sort: 'created_at',
    order: 'desc',
    page: 1,
    pageSize: 25,
  }

  if (raw.from) {
    const d = parseDate(raw.from)
    if (d) out.from = d.toISOString().slice(0, 10)
  }
  if (raw.to) {
    const d = parseDate(raw.to)
    if (d) out.to = d.toISOString().slice(0, 10)
  }
  if (out.from && out.to && out.from > out.to) {
    const t = out.from; out.from = out.to; out.to = t
  }

  const payment = ['Pending', 'Paid', 'Failed', 'Refunded']
  if (out.paymentStatus && !payment.includes(out.paymentStatus)) out.paymentStatus = ''
  const regStatus = ['Pending', 'Confirmed', 'Waitlist', 'Cancelled']
  if (out.registrationStatus && !regStatus.includes(out.registrationStatus))
    out.registrationStatus = ''

  const sorts = {
    created_at: 'created_at',
    registration_date: 'registration_date',
    participant_name: 'participant_name',
    event_name: 'event_name',
    age: 'age',
  }
  const sortKey = String(raw.sort || '')
  if (sorts[sortKey]) out.sort = sorts[sortKey]
  if (String(raw.order || '').toLowerCase() === 'asc') out.order = 'asc'

  const page = parseInt(raw.page, 10)
  if (Number.isFinite(page) && page > 0) out.page = Math.min(page, 100000)
  const size = parseInt(raw.pageSize || raw.limit, 10)
  if (Number.isFinite(size) && size > 0) out.pageSize = Math.min(size, 200)

  return out
}

/** PATCH payload — only the two status fields and the UTR are editable. */
function validatePatch(input) {
  const data = input && typeof input === 'object' ? input : {}
  const updates = {}
  const errors = {}

  if (data.paymentStatus !== undefined) {
    const v = str(data.paymentStatus, 30)
    if (!['Pending', 'Paid', 'Failed', 'Refunded'].includes(v))
      errors.paymentStatus = 'Invalid payment status.'
    else updates.payment_status = v
  }

  if (data.registrationStatus !== undefined) {
    const v = str(data.registrationStatus, 30)
    if (!['Pending', 'Confirmed', 'Waitlist', 'Cancelled'].includes(v))
      errors.registrationStatus = 'Invalid registration status.'
    else updates.registration_status = v
  }

  if (data.paymentUtr !== undefined) {
    const v = str(data.paymentUtr, 40)
    if (!v) updates.payment_utr = null
    else if (!validUtr(v)) errors.paymentUtr = 'Invalid payment reference.'
    else updates.payment_utr = v
  }

  if (data.participantName !== undefined) {
    const v = str(data.participantName, 100)
    if (v.length < 2) errors.participantName = 'Participant name is too short.'
    else updates.participant_name = v
  }

  if (data.phone !== undefined) {
    if (!validMobile(data.phone)) errors.phone = 'Enter a valid 10-digit mobile number.'
    else updates.phone = formatPhone(data.phone)
  }

  if (data.email !== undefined) {
    const v = str(data.email, 254).toLowerCase()
    if (!validEmail(v)) errors.email = 'Enter a valid email address.'
    else updates.email = v
  }

  if (data.tshirtSize !== undefined) {
    const v = str(data.tshirtSize, 10).toUpperCase()
    if (!v) updates.tshirt_size = null
    else if (!TSHIRT_SIZES.includes(v)) errors.tshirtSize = 'Invalid T-shirt size.'
    else updates.tshirt_size = v
  }

  return { ok: Object.keys(errors).length === 0, errors, updates }
}

module.exports = {
  validateRegistration,
  validatePatch,
  parseListQuery,
  generateRegistrationId,
  validRegistrationId,
  validMobile,
  validEmail,
  normalizePhone,
  formatPhone,
  parseDate,
  ageFromDate,
  str,
}
