/**
 * Excel (.xlsx) export for the organiser.
 *
 * ExcelJS produces a genuine Office Open XML workbook in memory — nothing is
 * ever written to disk, because a Vercel function's filesystem is ephemeral.
 * The database stays the single source of truth; this file is only a report
 * the organiser asks for on demand.
 */
const ExcelJS = require('exceljs')

const HEADER_FILL = 'FF0A1F44'   // VETRI KALAM deep navy
const ACCENT_FILL = 'FF1E6BE6'   // VETRI KALAM blue
const BAND_FILL = 'FFF2F6FC'

/** Columns exactly as required by the export specification. */
const COLUMNS = [
  { header: 'Registration ID',        key: 'registrationId',        width: 22 },
  { header: 'Event',                  key: 'eventName',             width: 30 },
  { header: 'Participant Name',       key: 'participantName',       width: 26 },
  { header: 'Date of Birth',          key: 'dateOfBirth',           width: 14 },
  { header: 'Age',                    key: 'age',                   width: 7 },
  { header: 'Gender',                 key: 'gender',                width: 16 },
  { header: 'Phone',                  key: 'phone',                 width: 16 },
  { header: 'Email',                  key: 'email',                 width: 32 },
  { header: 'Address',                key: 'address',               width: 38 },
  { header: 'City',                   key: 'city',                  width: 18 },
  { header: 'State',                  key: 'state',                 width: 18 },
  { header: 'Emergency Contact Name', key: 'emergencyContactName',  width: 26 },
  { header: 'Emergency Contact Phone',key: 'emergencyContactPhone', width: 20 },
  { header: 'Event Category',         key: 'category',              width: 28 },
  { header: 'Race / Sports Category', key: 'raceCategory',          width: 24 },
  { header: 'T-Shirt Size',           key: 'tshirtSize',            width: 13 },
  { header: 'Registration Date',      key: 'registrationDateText',  width: 20 },
  { header: 'Payment Status',         key: 'paymentStatus',         width: 15 },
  { header: 'Payment / UTR ID',       key: 'paymentUtr',            width: 22 },
  { header: 'Registration Status',    key: 'registrationStatus',    width: 18 },
]

/** Render a timestamp in IST (Asia/Kolkata) as `YYYY-MM-DD HH:MM`. */
function ist(value) {
  if (!value) return ''
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  const istd = new Date(d.getTime() + 5.5 * 60 * 60 * 1000)
  const p = (n) => String(n).padStart(2, '0')
  return (
    `${istd.getUTCFullYear()}-${p(istd.getUTCMonth() + 1)}-${p(istd.getUTCDate())} ` +
    `${p(istd.getUTCHours())}:${p(istd.getUTCMinutes())}`
  )
}

function toRow(r) {
  return {
    registrationId: r.registrationId,
    eventName: r.eventName,
    participantName: r.participantName,
    dateOfBirth: r.dateOfBirth,
    age: r.age,
    gender: r.gender,
    phone: r.phone,
    email: r.email,
    address: r.address || '',
    city: r.city,
    state: r.state,
    emergencyContactName: r.emergencyContactName,
    emergencyContactPhone: r.emergencyContactPhone,
    category: r.category,
    raceCategory: r.raceCategory,
    tshirtSize: r.tshirtSize || '',
    registrationDateText: ist(r.registrationDate),
    paymentStatus: r.paymentStatus,
    paymentUtr: r.paymentUtr || '',
    registrationStatus: r.registrationStatus,
  }
}

/**
 * @param {Array} rows     registration records (from lib/registrations.js)
 * @param {object} summary optional metadata written into the title area
 * @returns {Promise<Buffer>}
 */
async function buildRegistrationsWorkbook(rows, summary = {}) {
  const wb = new ExcelJS.Workbook()
  wb.creator = 'VETRI KALAM Sports & Events'
  wb.lastModifiedBy = 'VETRI KALAM Sports & Events'
  wb.created = new Date()
  wb.modified = new Date()

  const ws = wb.addWorksheet('Registrations', {
    views: [{ state: 'frozen', ySplit: 4 }],
    pageSetup: { orientation: 'landscape', fitToPage: true },
  })

  ws.columns = COLUMNS.map((c) => ({ header: c.header, key: c.key, width: c.width }))

  // Title block above the header row. ExcelJS has already materialised the
  // column headers on row 1, so inserting three rows here pushes them down to
  // row 4 — which is exactly where ySplit and autoFilter expect them.
  ws.insertRow(1, ['VETRI KALAM Sports & Events — Registration Export'])
  ws.insertRow(2, [
    `Generated: ${ist(new Date())} IST` +
      (summary.filterText ? `   |   Filter: ${summary.filterText}` : ''),
  ])
  ws.insertRow(3, [`Total records: ${rows.length}`])

  const title = ws.getRow(1)
  title.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } }
  title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: HEADER_FILL } }
  title.alignment = { vertical: 'middle' }
  ws.getRow(1).height = 24

  const meta = ws.getRow(2)
  meta.font = { size: 10, color: { argb: 'FF44506A' } }

  // Header row at row 4 (frozen via ySplit, and the range autoFilter covers).
  // Normally ExcelJS's own headers have already landed here; the guard covers
  // the case where that row is still empty so the header can never be missing.
  const headerRow = ws.getRow(4)
  if (!headerRow.getCell(1).value) headerRow.values = COLUMNS.map((c) => c.header)
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }
  headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: ACCENT_FILL } }
  headerRow.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true }
  headerRow.height = 30

  rows.forEach((r, i) => {
    const row = ws.addRow(toRow(r))
    row.alignment = { vertical: 'top' }
    if (i % 2 === 1) {
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: BAND_FILL } }
    }
    // Keep IDs, phones and emails as literal text so Excel cannot reformat
    // them (e.g. turning a phone number into scientific notation).
    ;['registrationId', 'phone', 'email', 'emergencyContactPhone', 'paymentUtr'].forEach((k) => {
      row.getCell(k).numFmt = '@'
    })
  })

  if (rows.length) {
    ws.autoFilter = {
      from: { row: 4, column: 1 },
      to: { row: 4, column: COLUMNS.length },
    }
  }

  const buffer = await wb.xlsx.writeBuffer()
  return Buffer.from(buffer)
}

/** Safe, filesystem-independent download filename. */
function exportFilename(date = new Date()) {
  const p = (n) => String(n).padStart(2, '0')
  const d = `${date.getUTCFullYear()}${p(date.getUTCMonth() + 1)}${p(date.getUTCDate())}`
  return `VETRI-KALAM-Registrations-${d}.xlsx`
}

module.exports = { buildRegistrationsWorkbook, exportFilename, COLUMNS }
