/**
 * Admin authentication — JWT issued after checking the environment credentials.
 *
 * SECURITY NOTES
 *  - ADMIN_EMAIL / ADMIN_PASSWORD / JWT_SECRET live in environment variables
 *    only. Nothing here is bundled into the browser: this file is imported
 *    exclusively by `api/**` and `server/dev.js`, both of which run server-side.
 *  - Credential comparison is constant-time, so response timing cannot be used
 *    to enumerate the correct email or password.
 *  - Signing/verification uses the audited `jsonwebtoken` library (HS256) with
 *    algorithms pinned explicitly, rather than hand-rolled crypto.
 *  - There is no database user table, therefore no password — plaintext or
 *    hashed — exists anywhere in the codebase or the schema.
 */
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

function env(name) {
  const v = process.env[name]
  if (!v || String(v).trim() === '') {
    const err = new Error(`Missing required environment variable: ${name}`)
    err.status = 500
    err.publicMessage =
      'The server is not configured. Set the required environment variables and try again.'
    throw err
  }
  return String(v)
}

/** Constant-time string compare that does not leak length via early exit. */
function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a), 'utf8').digest()
  const hb = crypto.createHash('sha256').update(String(b), 'utf8').digest()
  return crypto.timingSafeEqual(ha, hb)
}

/**
 * Verify submitted credentials against ADMIN_EMAIL / ADMIN_PASSWORD.
 * Returns true only when both match. Never logs or echoes either value.
 */
function verifyCredentials(email, password) {
  if (typeof email !== 'string' || typeof password !== 'string') return false
  let adminEmail
  let adminPassword
  try {
    adminEmail = env('ADMIN_EMAIL')
    adminPassword = env('ADMIN_PASSWORD')
  } catch {
    return false
  }
  const emailOk = safeEqual(email.trim().toLowerCase(), adminEmail.trim().toLowerCase())
  const passOk = safeEqual(password, adminPassword)
  // Both comparisons always run, so a wrong password costs the same time as a
  // wrong email address.
  return emailOk && passOk
}

const ALGORITHMS = ['HS256']

/** @returns {string} a signed JWT valid for `expiresInSec` (default 8 hours). */
function signToken(payload, { expiresInSec = 8 * 60 * 60 } = {}) {
  return jwt.sign(payload, env('JWT_SECRET'), {
    algorithm: 'HS256',
    expiresIn: expiresInSec,
    issuer: 'vetri-kalam',
  })
}

/** @returns {object|null} the decoded payload, or null when invalid/expired. */
function verifyToken(token) {
  if (typeof token !== 'string' || token.split('.').length !== 3) return null
  try {
    return jwt.verify(token, env('JWT_SECRET'), {
      algorithms: ALGORITHMS,
      issuer: 'vetri-kalam',
    })
  } catch {
    return null
  }
}

function extractToken(req) {
  const raw = (req.headers && (req.headers.authorization || req.headers.Authorization)) || ''
  const m = String(raw).match(/^Bearer\s+(.+)$/i)
  return m ? m[1].trim() : null
}

/**
 * Guard for admin-only routes.
 * Sends a 401 and returns null when the caller is not authenticated.
 */
function requireAdmin(req, res, failFn) {
  let payload = null
  try {
    payload = verifyToken(extractToken(req))
  } catch (err) {
    // A missing JWT_SECRET must never become an auth bypass.
    console.error('[auth] token verification failed:', err.message)
    payload = null
  }
  if (!payload || payload.role !== 'admin') {
    failFn(res, 401, 'Your session is invalid or has expired. Please sign in again.')
    return null
  }
  return payload
}

module.exports = {
  verifyCredentials,
  signToken,
  verifyToken,
  extractToken,
  requireAdmin,
}
