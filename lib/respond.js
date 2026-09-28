/**
 * Shared HTTP helpers for the Vercel functions AND the local dev server.
 *
 * Only plain `ServerResponse` primitives are used (statusCode / setHeader /
 * end) so the exact same handler code runs unchanged on Vercel's runtime and
 * on `node server/dev.js` during development.
 */

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Cache-Control': 'no-store',
  }
}

function applyCors(res) {
  const headers = corsHeaders()
  for (const [k, v] of Object.entries(headers)) {
    try { res.setHeader(k, v) } catch { /* ignore */ }
  }
}

/** Send a JSON body. Works on Vercel and on plain node:http. */
function json(res, status, body) {
  applyCors(res)
  try {
    res.statusCode = status
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(body))
  } catch { /* response already sent */ }
  return res
}

/** Send a binary body (used by the .xlsx export). */
function binary(res, status, buffer, headers) {
  applyCors(res)
  try {
    res.statusCode = status
    for (const [k, v] of Object.entries(headers)) res.setHeader(k, v)
    res.end(buffer)
  } catch { /* response already sent */ }
  return res
}

function fail(res, status, message, details) {
  const body = { ok: false, message }
  if (details) body.errors = details
  return json(res, status, body)
}

function ok(res, body, status = 200) {
  return json(res, status, Object.assign({ ok: true }, body))
}

function methodNotAllowed(res, allowed) {
  applyCors(res)
  try { res.setHeader('Allow', allowed.join(', ')) } catch { /* ignore */ }
  return fail(res, 405, `Method not allowed. Use: ${allowed.join(', ')}`)
}

/** Parse a JSON body without throwing. */
async function readJson(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'object') return req.body
    if (typeof req.body === 'string') {
      try { return JSON.parse(req.body || '{}') } catch { return {} }
    }
  }
  const chunks = []
  for await (const chunk of req) chunks.push(chunk)
  const raw = Buffer.concat(chunks).toString('utf8').trim()
  if (!raw) return {}
  try { return JSON.parse(raw) } catch (err) {
    const e = new Error('Request body must be valid JSON.')
    e.status = 400
    e.code = 'BAD_JSON'
    throw e
  }
}

/** Pull `req.query` in a shape that works on Vercel and plain node:http. */
function getQuery(req) {
  if (req.query && typeof req.query === 'object') return req.query
  if (typeof req.url === 'string' && req.url.includes('?')) {
    const qs = req.url.slice(req.url.indexOf('?') + 1)
    const out = {}
    for (const pair of qs.split('&')) {
      if (!pair) continue
      const i = pair.indexOf('=')
      const k = decodeURIComponent(i < 0 ? pair : pair.slice(0, i))
      const v = decodeURIComponent((i < 0 ? '' : pair.slice(i + 1)).replace(/\+/g, ' '))
      out[k] = v
    }
    return out
  }
  return {}
}

/** Path params from Vercel (`req.query.id`) or dev server (`req.params.id`). */
function getParam(req, name) {
  if (req.params && req.params[name] !== undefined) return req.params[name]
  const q = getQuery(req)
  if (q[name] !== undefined) return q[name]
  const m = (req.url || '').split('?')[0].match(/\/([^/]+)$/)
  return m ? decodeURIComponent(m[1]) : undefined
}

/** Wrap a handler so thrown errors always become a clean JSON response. */
function handler(fn) {
  return async function wrapped(req, res) {
    try {
      await fn(req, res)
    } catch (err) {
      const status = err.status || (err.code === 'EBADMESSAGE' ? 400 : 500)
      if (status >= 500) {
        // Log server-side only — never leak internals to the client.
        console.error('[api]', err)
      }
      if (err.code === '23505') {
        return fail(
          res, 409,
          'This email is already registered for the selected event. ' +
          'Contact us if you believe this is a mistake.'
        )
      }
      if (err.code === '23502' || err.code === '23514') {
        return fail(res, 400, 'The submitted data failed a database rule. Please review the form.')
      }
      return fail(
        res,
        status,
        err.statusMessage || err.message || 'Something went wrong. Please try again.',
        err.details
      )
    }
  }
}

module.exports = { json, binary, fail, ok, methodNotAllowed, readJson, getQuery, getParam, handler, applyCors }
