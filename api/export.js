/**
 * GET /api/export — admin only.
 *
 * Streams a genuine .xlsx workbook built from the current PostgreSQL rows.
 * Accepts the same filters as GET /api/registrations so the organiser can
 * export exactly what the table is showing, or everything when unfiltered.
 *
 * The file is generated in memory and returned directly — no temp file is
 * written, and no spreadsheet is ever used as storage.
 */
const { binary, fail, getQuery, methodNotAllowed, handler } = require('../lib/respond')
const { requireAdmin } = require('../lib/auth')
const { parseListQuery } = require('../lib/validate')
const { allRegistrations } = require('../lib/registrations')
const { buildRegistrationsWorkbook, exportFilename } = require('../lib/excel')

function describeFilters(f) {
  const parts = []
  if (f.search) parts.push(`search "${f.search}"`)
  if (f.eventId) parts.push(`event ${f.eventId}`)
  if (f.category) parts.push(`category ${f.category}`)
  if (f.raceCategory) parts.push(`race ${f.raceCategory}`)
  if (f.paymentStatus) parts.push(`payment ${f.paymentStatus}`)
  if (f.registrationStatus) parts.push(`status ${f.registrationStatus}`)
  if (f.from) parts.push(`from ${f.from}`)
  if (f.to) parts.push(`to ${f.to}`)
  return parts.join(', ')
}

module.exports = handler(async (req, res) => {
  if (req.method === 'OPTIONS') return ok200(res)
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET'])

  if (!requireAdmin(req, res, fail)) return undefined

  const filters = parseListQuery(getQuery(req))
  const rows = await allRegistrations(filters)

  const buffer = await buildRegistrationsWorkbook(rows, {
    filterText: describeFilters(filters),
  })
  const filename = exportFilename()

  return binary(res, 200, buffer, {
    'Content-Type':
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'Content-Disposition': `attachment; filename="${filename}"`,
    'Content-Length': String(buffer.length),
    'X-Content-Type-Options': 'nosniff',
  })
})

function ok200(res) {
  return binary(res, 200, Buffer.from(''), { 'Content-Length': '0' })
}
