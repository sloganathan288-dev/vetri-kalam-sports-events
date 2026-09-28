/**
 * Static preview server for the production build (used by the responsive and
 * browser tests).
 *
 *   node scripts/serve-build.mjs [--port 4173]
 *
 * Serves build\ with an SPA fallback (any non-file path returns index.html) and
 * proxies /api/* to the local API server so registration, login and Excel
 * export can be exercised end-to-end.
 */
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const BUILD = path.join(ROOT, 'build')
const args = process.argv.slice(2)
const PORT = args.includes('--port') ? parseInt(args[args.indexOf('--port') + 1], 10) : 4173
const API = process.env.API_PORT || '5000'

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
}

function proxyApi(req, res) {
  const opts = {
    host: '127.0.0.1',
    port: API,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `127.0.0.1:${API}` },
  }
  const p = http.request(opts, (pr) => {
    res.writeHead(pr.statusCode || 502, pr.headers)
    pr.pipe(res)
  })
  p.on('error', () => {
    res.writeHead(502, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error: 'API server not reachable on :' + API }))
  })
  req.pipe(p)
}

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0])

  if (url.startsWith('/api/')) return proxyApi(req, res)

  let file = path.join(BUILD, url)
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html')

  if (!fs.existsSync(file)) {
    // SPA fallback — but never for asset-looking paths, so missing files are visible.
    if (path.extname(url)) {
      res.writeHead(404, { 'content-type': 'text/plain' })
      return res.end('not found: ' + url)
    }
    file = path.join(BUILD, 'index.html')
  }

  const ext = path.extname(file).toLowerCase()
  res.writeHead(200, { 'content-type': TYPES[ext] || 'application/octet-stream' })
  fs.createReadStream(file).pipe(res)
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`preview server: http://127.0.0.1:${PORT}  (build: ${BUILD}, api proxy -> :${API})`)
})
