/**
 * Thin API client for the VETRI KALAM registration backend.
 *
 * All calls are same-origin (`/api/...`), so:
 *   - in development CRA's `proxy` forwards them to the local API server
 *   - on Vercel they resolve to the serverless functions in `/api`
 *
 * The admin token lives in localStorage. Nothing sensitive is stored there —
 * only the signed JWT, which expires after 8 hours and carries no password.
 */

const BASE = '/api'
const TOKEN_KEY = 'vk_admin_token'
const ADMIN_KEY = 'vk_admin_email'

export function getToken() {
  try { return window.localStorage.getItem(TOKEN_KEY) } catch { return null }
}

export function getAdminEmail() {
  try { return window.localStorage.getItem(ADMIN_KEY) } catch { return null }
}

export function setSession(token, email) {
  try {
    window.localStorage.setItem(TOKEN_KEY, token)
    window.localStorage.setItem(ADMIN_KEY, email || '')
  } catch { /* storage disabled */ }
}

export function clearSession() {
  try {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.removeItem(ADMIN_KEY)
  } catch { /* storage disabled */ }
}

/** True when a token exists and is not obviously expired. */
export function hasSession() {
  const token = getToken()
  if (!token) return false
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return typeof payload.exp === 'number' && payload.exp * 1000 > Date.now()
  } catch {
    return false
  }
}

class ApiError extends Error {
  constructor(message, status, errors) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors || null
  }
}

async function request(path, options = {}) {
  const headers = Object.assign({ Accept: 'application/json' }, options.headers || {})
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json'

  let res
  try {
    res = await fetch(BASE + path, Object.assign({}, options, { headers }))
  } catch {
    throw new ApiError(
      'Could not reach the server. Check your connection and try again.',
      0,
      null
    )
  }

  const text = await res.text()
  let data = null
  if (text) {
    try { data = JSON.parse(text) } catch { data = null }
  }

  if (!res.ok) {
    // A 401 anywhere means the session is no longer usable.
    if (res.status === 401) clearSession()
    throw new ApiError(
      (data && data.message) || `Request failed (HTTP ${res.status}).`,
      res.status,
      data && data.errors
    )
  }
  return data
}

// ---------------------------------------------------------------- public ---

/** Fetch the event catalogue (events + categories + option lists). */
export function fetchEvents() {
  return request('/events')
}

/** Submit a registration. Resolves only after PostgreSQL acknowledges it. */
export function submitRegistration(payload) {
  return request('/registrations', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/** Exchange organiser credentials for a JWT. */
export function login(email, password) {
  return request('/auth', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

// ----------------------------------------------------------------- admin ---

function toQuery(params) {
  const parts = []
  Object.keys(params || {}).forEach((k) => {
    const v = params[k]
    if (v === undefined || v === null || v === '') return
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
  })
  return parts.length ? `?${parts.join('&')}` : ''
}

export function fetchRegistrations(filters) {
  return request(`/registrations${toQuery(filters)}`)
}

export function fetchRegistration(id) {
  return request(`/registrations/${encodeURIComponent(id)}`)
}

export function updateRegistration(id, patch) {
  return request(`/registrations/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}

export function deleteRegistration(id) {
  return request(`/registrations/${encodeURIComponent(id)}`, { method: 'DELETE' })
}

/**
 * Download the filtered registration list as a real .xlsx file.
 * Uses the authenticated endpoint and triggers a browser download — no data
 * is written by the browser beyond the blob it is handed.
 */
export async function exportToExcel(filters) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${BASE}/export${toQuery(filters)}`, { headers })
  } catch {
    throw new ApiError('Could not reach the server to export the file.', 0, null)
  }

  if (!res.ok) {
    if (res.status === 401) clearSession()
    let data = null
    try { data = await res.json() } catch { /* ignore */ }
    throw new ApiError(
      (data && data.message) || `Export failed (HTTP ${res.status}).`,
      res.status
    )
  }

  const disposition = res.headers.get('Content-Disposition') || ''
  const match = disposition.match(/filename="([^"]+)"/)
  const filename = match ? match[1] : 'VETRI-KALAM-Registrations.xlsx'

  const blob = await res.blob()
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)

  return filename
}

export { ApiError }
