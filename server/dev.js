#!/usr/bin/env node
/**
 * Local API server — mounts the exact same handlers Vercel deploys, on plain
 * `node:http`, so `npm start` (CRA on :3000) can proxy /api/* to :5000 and
 * development behaves like production.
 *
 *   node server/dev.js          # or:  npm run api
 *
 * Nothing here is bundled into the browser. Vercel never runs this file — it
 * runs `api/**` directly. This exists purely so the registration flow, the
 * dashboard and the Excel export can be exercised locally.
 */
const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')
const { URL } = require('node:url')

const ROOT = path.resolve(__dirname, '..')

// --- minimal .env loader (avoids depending on a transitive package) ---------
;(function loadEnv() {
  const file = path.join(ROOT, '.env')
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!m) continue
    let v = m[2]
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1)
    }
    if (process.env[m[1]] === undefined) process.env[m[1]] = v
  }
})()

const ROUTES = [
  { method: 'POST', pattern: /^\/api\/auth$/, file: 'api/auth.js' },
  { method: 'GET', pattern: /^\/api\/events$/, file: 'api/events.js' },
  { method: 'GET', pattern: /^\/api\/export$/, file: 'api/export.js' },
  { method: '*', pattern: /^\/api\/registrations$/, file: 'api/registrations.js' },
  { method: '*', pattern: /^\/api\/registrations\/([^/]+)$/, file: 'api/registrations/[id].js' },
  { method: 'POST', pattern: /^\/api\/check-registration$/, file: 'api/check-registration.js' },
]

// Load (and reload) handlers. Shared `lib/*` modules are invalidated on every
// request so an edit during development takes effect without a restart.
function load(file) {
  const full = path.join(ROOT, file)
  const libDir = path.join(ROOT, 'lib') + path.sep
  for (const key of Object.keys(require.cache)) {
    if (key === full || key.startsWith(libDir)) delete require.cache[key]
  }
  return require(full)
}

function notFound(res) {
  res.statusCode = 404
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify({ ok: false, message: 'Not found.' }))
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)

  // expose query in the same shape Vercel provides
  const query = {}
  url.searchParams.forEach((v, k) => { query[k] = v })
  req.query = query
  req.url = url.pathname + url.search

  if (!url.pathname.startsWith('/api/')) return notFound(res)

  for (const route of ROUTES) {
    const m = url.pathname.match(route.pattern)
    if (!m) continue
    if (route.method !== '*' && route.method !== req.method) {
      res.statusCode = 405
      res.setHeader('Allow', route.method)
      res.setHeader('Content-Type', 'application/json; charset=utf-8')
      res.end(JSON.stringify({ ok: false, message: `Method not allowed. Use: ${route.method}` }))
      return
    }
    try {
      const handler = load(route.file)
      if (m[1] !== undefined) {
        req.params = { id: decodeURIComponent(m[1]) }
      }
      await handler(req, res)
    } catch (err) {
      console.error('[dev-api]', err)
      if (!res.headersSent) {
        res.statusCode = err.status || 500
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify({
          ok: false,
          message: err.publicMessage || err.message || 'Internal error.',
        }))
      }
    }
    return
  }
  notFound(res)
})

const PORT = Number(process.env.API_PORT || 5000)
server.listen(PORT, () => {
  console.log(`VETRI KALAM API (dev) → http://localhost:${PORT}/api/…`)
  console.log(`  DATABASE_URL: ${process.env.DATABASE_URL ? 'configured' : 'MISSING (set it in .env)'}`)
  console.log(`  ADMIN_EMAIL : ${process.env.ADMIN_EMAIL ? 'configured' : 'MISSING (set it in .env)'}`)
  console.log(`  JWT_SECRET  : ${process.env.JWT_SECRET ? 'configured' : 'MISSING (set it in .env)'}`)
})
