/**
 * POST /api/auth (api/auth.js → /api/auth) — organiser sign-in.
 *
 * Credentials are compared, in constant time, against ADMIN_EMAIL and
 * ADMIN_PASSWORD from the environment. On success a signed JWT is returned;
 * the browser stores it and sends it as `Authorization: Bearer …` on every
 * admin request. No password, hash or secret is ever returned to the client.
 */
const { ok, fail, methodNotAllowed, readJson, handler } = require('../lib/respond')
const { verifyCredentials, signToken } = require('../lib/auth')

// Lightweight per-instance throttle. Vercel functions are stateless, so this
// blunts bursts against a warm instance rather than being a global WAF rule —
// it is a first line of defence, not the only one.
const attempts = new Map()
const WINDOW_MS = 10 * 60 * 1000
const MAX_ATTEMPTS = 20

function tooMany(req) {
  const ip =
    (req.headers && (req.headers['x-forwarded-for'] || req.headers['x-real-ip'])) || 'unknown'
  const key = String(ip).split(',')[0].trim()
  const now = Date.now()
  const entry = attempts.get(key)
  if (!entry || now - entry.start > WINDOW_MS) {
    attempts.set(key, { start: now, count: 1 })
    return false
  }
  entry.count += 1
  return entry.count > MAX_ATTEMPTS
}

module.exports = handler(async (req, res) => {
  if (req.method === 'OPTIONS') return ok(res, {})
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST'])

  if (tooMany(req)) {
    return fail(res, 429, 'Too many sign-in attempts. Please wait a few minutes and try again.')
  }

  const body = await readJson(req)
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const password = typeof body.password === 'string' ? body.password : ''

  if (!email || !password) {
    return fail(res, 400, 'Enter your email and password.', {
      email: email ? undefined : 'Email is required.',
      password: password ? undefined : 'Password is required.',
    })
  }

  let valid = false
  try {
    valid = verifyCredentials(email, password)
  } catch (err) {
    // Misconfiguration (missing env vars) — report it as a server problem,
    // never as "wrong password", and never echo which variable is missing.
    console.error('[auth] configuration error:', err.message)
    return fail(
      res, 500,
      'Sign-in is not configured on this server yet. Set the admin environment variables and redeploy.'
    )
  }

  if (!valid) {
    return fail(res, 401, 'Incorrect email or password.')
  }

  const token = signToken(
    { sub: email.trim().toLowerCase(), role: 'admin', name: 'VETRI KALAM Organiser' },
    { expiresInSec: 8 * 60 * 60 }
  )

  return ok(res, {
    token,
    expiresIn: 8 * 60 * 60,
    admin: { email: email.trim().toLowerCase() },
  })
})
