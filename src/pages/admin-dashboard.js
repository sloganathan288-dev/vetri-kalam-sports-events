import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Link, Navigate, useNavigate } from "react-router-dom"
import Layout from "../components/layout/Layout"
import {
	clearSession,
	deleteRegistration,
	exportToExcel,
	fetchEvents,
	fetchRegistrations,
	getAdminEmail,
	hasSession,
	updateRegistration,
} from "../utils/api"

const PAYMENT = ["Pending", "Paid", "Failed", "Refunded"]
const STATUS = ["Pending", "Confirmed", "Waitlist", "Cancelled"]
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]

const badgeClass = (kind, value) => {
	const map = {
		Paid: "is-paid", Confirmed: "is-confirmed", Pending: "is-pending",
		Failed: "is-failed", Cancelled: "is-cancelled",
		Refunded: "is-refunded", Waitlist: "is-waitlist",
	}
	return `vk-badge ${map[value] || ""}`
}

function fmtDateTime(value) {
	if (!value) return "—"
	const d = new Date(value)
	if (Number.isNaN(d.getTime())) return "—"
	return d.toLocaleString("en-IN", {
		day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
	})
}

const BLANK_FILTERS = {
	search: "", event: "", category: "", paymentStatus: "", registrationStatus: "",
	from: "", to: "",
}

export default function AdminDashboard() {
	const navigate = useNavigate()
	const authed = useMemo(() => hasSession(), [])

	const [filters, setFilters] = useState(BLANK_FILTERS)
	const [query, setQuery] = useState(BLANK_FILTERS)
	const [page, setPage] = useState(1)
	const [pageSize] = useState(25)
	const [data, setData] = useState(null)
	const [events, setEvents] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [notice, setNotice] = useState(null)
	const [selected, setSelected] = useState(null)
	const [modalError, setModalError] = useState("")
	const [saving, setSaving] = useState(false)
	const [exporting, setExporting] = useState(false)
	const [refreshKey, setRefreshKey] = useState(0)
	const debounce = useRef(null)

	// Declared with the other hooks — it must not sit below the auth redirect.
	const categories = useMemo(
		() => Array.from(new Set(events.map((e) => e.category))),
		[events]
	)

	const load = useCallback(async () => {
		setLoading(true)
		setError("")
		try {
			const result = await fetchRegistrations({
				...query, page, pageSize,
			})
			setData(result)
		} catch (err) {
			if (err.status === 401) {
				navigate("/admin/login", { replace: true })
				return
			}
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}, [query, page, pageSize, navigate])

	/* catalogue + registrations */
	useEffect(() => {
		if (!authed) return undefined
		fetchEvents()
			.then((d) => setEvents(d.events || []))
			.catch(() => setEvents([]))
		return undefined
	}, [authed])

	useEffect(() => {
		if (!authed) return undefined
		load()
		return undefined
	}, [authed, load, refreshKey])

	/* debounce the free-text search into the query state */
	useEffect(() => {
		if (debounce.current) clearTimeout(debounce.current)
		debounce.current = setTimeout(() => {
			setPage(1)
			setQuery((prev) => (prev.search === filters.search ? prev : { ...prev, search: filters.search }))
		}, 350)
		return () => clearTimeout(debounce.current)
	}, [filters.search])

	function applyFilter(key, value) {
		setFilters((prev) => Object.assign({}, prev, { [key]: value }))
		if (key !== "search") {
			setPage(1)
			setQuery((prev) => Object.assign({}, prev, { [key]: value }))
		}
	}

	function resetFilters() {
		setFilters(BLANK_FILTERS)
		setQuery(BLANK_FILTERS)
		setPage(1)
	}

	if (!authed) return <Navigate to="/admin/login" replace />

	const stats = (data && data.stats) || {
		total: 0, paid: 0, paymentPending: 0, confirmed: 0, cancelled: 0,
	}
	const items = (data && data.items) || []
	const total = data ? data.total : 0
	const totalPages = Math.max(1, Math.ceil(total / pageSize))

	async function onSave(patch) {
		setSaving(true)
		setModalError("")
		try {
			const result = await updateRegistration(selected.id, patch)
			setSelected(result.registration)
			setNotice({ kind: "success", message: "Registration updated." })
			setRefreshKey((k) => k + 1)
		} catch (err) {
			setModalError(err.message)
		} finally {
			setSaving(false)
		}
	}

	async function onDelete() {
		if (!selected) return
		const sure = window.confirm(
			`Delete registration ${selected.registrationId} for ${selected.participantName}? This cannot be undone.`
		)
		if (!sure) return
		setSaving(true)
		setModalError("")
		try {
			await deleteRegistration(selected.id)
			setSelected(null)
			setNotice({ kind: "success", message: "Registration deleted." })
			setRefreshKey((k) => k + 1)
		} catch (err) {
			setModalError(err.message)
		} finally {
			setSaving(false)
		}
	}

	async function onExport() {
		setExporting(true)
		setError("")
		try {
			const filename = await exportToExcel(query)
			setNotice({ kind: "success", message: `Downloaded ${filename}` })
		} catch (err) {
			if (err.status === 401) { navigate("/admin/login", { replace: true }); return }
			setError(err.message)
		} finally {
			setExporting(false)
		}
	}

	function logout() {
		clearSession()
		navigate("/admin/login", { replace: true })
	}

	return (
		<>
			<Layout headerStyle={1} footerStyle={1} breadcrumbTitle="title">
				<div className="page-title page-title-blog">
					<div className="themeflat-container">
						<div className="row">
							<div className="col-md-12">
								<div className="page-title-heading">
									<h1 className="title">Organiser Dashboard</h1>
								</div>
								<div className="breadcrumbs">
									<ul>
										<li><Link to="/">Homepage</Link></li>
										<li><i className="icon-Arrow---Right-2" /></li>
										<li><a>Registrations</a></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="vk-admin main-content">
					<div className="themeflat-container">
						<div className="vk-admin-bar">
							<div>
								<h1>Registrations</h1>
								<p className="vk-sub">
									{getAdminEmail() ? `Signed in as ${getAdminEmail()}` : "VETRI KALAM Sports & Events"}
								</p>
							</div>
							<div className="vk-admin-actions">
								<button type="button" className="vk-btn is-accent" onClick={onExport} disabled={exporting}>
									{exporting ? "Preparing…" : "Export to Excel"}
								</button>
								<button type="button" className="vk-btn" onClick={() => setRefreshKey((k) => k + 1)} disabled={loading}>
									{loading ? "Refreshing…" : "Refresh"}
								</button>
								<button type="button" className="vk-btn is-outline" onClick={logout}>Sign out</button>
							</div>
						</div>

						{notice ? (
							<div className={`vk-alert ${notice.kind === "success" ? "is-success" : "is-error"}`}
								role="status" onClick={() => setNotice(null)} style={{ cursor: "pointer" }}>
								{notice.message}
							</div>
						) : null}
						{error ? <div className="vk-alert is-error" role="alert">{error}</div> : null}

						<div className="vk-stats">
							<div className="vk-stat"><div className="vk-stat-label">Total registrations</div>
								<div className="vk-stat-value">{stats.total}</div></div>
							<div className="vk-stat is-ok"><div className="vk-stat-label">Paid</div>
								<div className="vk-stat-value">{stats.paid}</div></div>
							<div className="vk-stat is-warn"><div className="vk-stat-label">Pending payments</div>
								<div className="vk-stat-value">{stats.paymentPending}</div></div>
							<div className="vk-stat is-blue"><div className="vk-stat-label">Confirmed</div>
								<div className="vk-stat-value">{stats.confirmed}</div></div>
							<div className="vk-stat is-bad"><div className="vk-stat-label">Cancelled</div>
								<div className="vk-stat-value">{stats.cancelled}</div></div>
						</div>

						<div className="vk-filters">
							<div className="vk-field">
								<label htmlFor="f-search">Search</label>
								<input id="f-search" type="search" className="tb-my-input"
									placeholder="Name, ID, phone, email…" value={filters.search}
									onChange={(e) => applyFilter("search", e.target.value)} />
							</div>
							<div className="vk-field">
								<label htmlFor="f-event">Event</label>
								<select id="f-event" className="tb-my-input" value={filters.event}
									onChange={(e) => applyFilter("event", e.target.value)}>
									<option value="">All events</option>
									{events.map((e) => <option key={e.eventId} value={e.eventId}>{e.eventName}</option>)}
								</select>
							</div>
							<div className="vk-field">
								<label htmlFor="f-category">Category</label>
								<select id="f-category" className="tb-my-input" value={filters.category}
									onChange={(e) => applyFilter("category", e.target.value)}>
									<option value="">All categories</option>
									{categories.map((c) => <option key={c} value={c}>{c}</option>)}
								</select>
							</div>
							<div className="vk-field">
								<label htmlFor="f-payment">Payment</label>
								<select id="f-payment" className="tb-my-input" value={filters.paymentStatus}
									onChange={(e) => applyFilter("paymentStatus", e.target.value)}>
									<option value="">All</option>
									{PAYMENT.map((p) => <option key={p} value={p}>{p}</option>)}
								</select>
							</div>
							<div className="vk-field">
								<label htmlFor="f-status">Registration status</label>
								<select id="f-status" className="tb-my-input" value={filters.registrationStatus}
									onChange={(e) => applyFilter("registrationStatus", e.target.value)}>
									<option value="">All</option>
									{STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
								</select>
							</div>
							<div className="vk-field">
								<label htmlFor="f-from">From date</label>
								<input id="f-from" type="date" className="tb-my-input" value={filters.from}
									onChange={(e) => applyFilter("from", e.target.value)} />
							</div>
							<div className="vk-field">
								<label htmlFor="f-to">To date</label>
								<input id="f-to" type="date" className="tb-my-input" value={filters.to}
									onChange={(e) => applyFilter("to", e.target.value)} />
							</div>
							<div className="vk-filter-actions">
								<span className="vk-result-count">
									{loading ? "Loading…" : `${total} registration${total === 1 ? "" : "s"} found`}
								</span>
								<button type="button" className="vk-btn is-outline is-sm" onClick={resetFilters}>
									Clear filters
								</button>
							</div>
						</div>

						<div className="vk-table-wrap">
							{loading ? (
								<p className="vk-empty" role="status">Loading registrations…</p>
							) : items.length === 0 ? (
								<p className="vk-empty">No registrations match these filters.</p>
							) : (
								<table className="vk-table">
									<thead>
										<tr>
											<th>Registration ID</th>
											<th>Participant</th>
											<th>Event</th>
											<th>Category</th>
											<th>Phone</th>
											<th>Email</th>
											<th>Payment</th>
											<th>Status</th>
											<th>Registered</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{items.map((r) => (
											<tr key={r.id}>
												<td className="vk-cell-id">{r.registrationId}</td>
												<td>
													{r.participantName}
													<span className="vk-cell-sub">{r.age} yrs · {r.city}</span>
												</td>
												<td>{r.eventName}</td>
												<td>
													{r.raceCategory}
													<span className="vk-cell-sub">{r.category}</span>
												</td>
												<td><a href={`tel:${r.phone}`}>{r.phone}</a></td>
												<td><a href={`mailto:${r.email}`}>{r.email}</a></td>
												<td><span className={badgeClass("payment", r.paymentStatus)}>{r.paymentStatus}</span></td>
												<td><span className={badgeClass("status", r.registrationStatus)}>{r.registrationStatus}</span></td>
												<td>{fmtDateTime(r.registrationDate)}</td>
												<td>
													<div className="vk-actions">
														<button type="button" className="vk-btn is-outline is-sm"
															onClick={() => { setModalError(""); setSelected(r) }}>
															View
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							)}
						</div>

						{totalPages > 1 ? (
							<div className="vk-pager">
								<span className="vk-result-count">
									Page {page} of {totalPages}
								</span>
								<div className="vk-pager-controls">
									<button type="button" className="vk-btn is-outline is-sm"
										disabled={page <= 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))}>
										Previous
									</button>
									<button type="button" className="vk-btn is-outline is-sm"
										disabled={page >= totalPages || loading} onClick={() => setPage((p) => p + 1)}>
										Next
									</button>
								</div>
							</div>
						) : null}
					</div>
				</div>

				{selected ? (
					<DetailModal
						row={selected}
						saving={saving}
						error={modalError}
						onClose={() => setSelected(null)}
						onSave={onSave}
						onDelete={onDelete}
					/>
				) : null}
			</Layout>
		</>
	)
}

function DetailModal({ row, saving, error, onClose, onSave, onDelete }) {
	const [form, setForm] = useState({
		participantName: row.participantName,
		phone: row.phone,
		email: row.email,
		tshirtSize: row.tshirtSize || "",
		paymentStatus: row.paymentStatus,
		registrationStatus: row.registrationStatus,
		paymentUtr: row.paymentUtr || "",
	})

	useEffect(() => {
		setForm({
			participantName: row.participantName,
			phone: row.phone,
			email: row.email,
			tshirtSize: row.tshirtSize || "",
			paymentStatus: row.paymentStatus,
			registrationStatus: row.registrationStatus,
			paymentUtr: row.paymentUtr || "",
		})
	}, [row])

	useEffect(() => {
		function onKey(e) { if (e.key === "Escape") onClose() }
		document.addEventListener("keydown", onKey)
		document.body.style.overflow = "hidden"
		return () => {
			document.removeEventListener("keydown", onKey)
			document.body.style.overflow = ""
		}
	}, [onClose])

	const set = (k, v) => setForm((prev) => Object.assign({}, prev, { [k]: v }))
	const dirty =
		form.participantName !== row.participantName ||
		form.phone !== row.phone ||
		form.email !== row.email ||
		form.tshirtSize !== (row.tshirtSize || "") ||
		form.paymentStatus !== row.paymentStatus ||
		form.registrationStatus !== row.registrationStatus ||
		form.paymentUtr !== (row.paymentUtr || "")

	const detail = [
		["Registration ID", row.registrationId],
		["Participant", row.participantName],
		["Date of birth", row.dateOfBirth],
		["Age", `${row.age}`],
		["Gender", row.gender],
		["Event", row.eventName],
		["Event category", row.category],
		["Race / sports category", row.raceCategory],
		["T-shirt size", row.tshirtSize || "—"],
		["Phone", row.phone],
		["Email", row.email],
		["Address", row.address || "—"],
		["City", row.city],
		["State", row.state],
		["Emergency contact", `${row.emergencyContactName} · ${row.emergencyContactPhone}`],
		["Registered on", fmtDateTime(row.registrationDate)],
		["Last updated", fmtDateTime(row.updatedAt)],
	]

	return (
		<div className="vk-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
			<div className="vk-modal" role="dialog" aria-modal="true" aria-label={`Registration ${row.registrationId}`}>
				<div className="vk-modal-head">
					<div>
						<h3>{row.participantName}</h3>
						<span className="vk-cell-id">{row.registrationId}</span>
					</div>
					<button type="button" className="vk-modal-close" onClick={onClose} aria-label="Close">×</button>
				</div>

				<dl className="vk-detail-grid">
					{detail.map(([label, value]) => (
						<div key={label}><dt>{label}</dt><dd>{value}</dd></div>
					))}
				</dl>

				{error ? <div className="vk-alert is-error" role="alert">{error}</div> : null}

				<div className="vk-modal-controls">
					<div className="vk-field">
						<label htmlFor="m-payment">Payment status</label>
						<select id="m-payment" className="tb-my-input" value={form.paymentStatus}
							onChange={(e) => set("paymentStatus", e.target.value)}>
							{PAYMENT.map((p) => <option key={p} value={p}>{p}</option>)}
						</select>
					</div>
					<div className="vk-field">
						<label htmlFor="m-status">Registration status</label>
						<select id="m-status" className="tb-my-input" value={form.registrationStatus}
							onChange={(e) => set("registrationStatus", e.target.value)}>
							{STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
						</select>
					</div>
					<div className="vk-field">
						<label htmlFor="m-utr">Payment / UTR ID</label>
						<input id="m-utr" type="text" className="tb-my-input" maxLength={40}
							value={form.paymentUtr} onChange={(e) => set("paymentUtr", e.target.value)} />
					</div>
					<div className="vk-field">
						<label htmlFor="m-name">Participant name</label>
						<input id="m-name" type="text" className="tb-my-input" maxLength={100}
							value={form.participantName} onChange={(e) => set("participantName", e.target.value)} />
					</div>
					<div className="vk-field">
						<label htmlFor="m-phone">Phone</label>
						<input id="m-phone" type="tel" className="tb-my-input" maxLength={20}
							value={form.phone} onChange={(e) => set("phone", e.target.value)} />
					</div>
					<div className="vk-field">
						<label htmlFor="m-email">Email</label>
						<input id="m-email" type="email" className="tb-my-input" maxLength={254}
							value={form.email} onChange={(e) => set("email", e.target.value)} />
					</div>
					<div className="vk-field">
						<label htmlFor="m-size">T-shirt size</label>
						<select id="m-size" className="tb-my-input" value={form.tshirtSize}
							onChange={(e) => set("tshirtSize", e.target.value)}>
							<option value="">—</option>
							{SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
						</select>
					</div>
					<div className="vk-field" style={{ justifyContent: "flex-end" }}>
						<label>&nbsp;</label>
						<div className="vk-actions">
							<button type="button" className="vk-btn" disabled={!dirty || saving}
								onClick={() => onSave(form)}>
								{saving ? "Saving…" : "Save changes"}
							</button>
							<button type="button" className="vk-btn is-outline" onClick={onClose} disabled={saving}>
								Close
							</button>
							<button type="button" className="vk-btn is-danger" onClick={onDelete} disabled={saving}>
								Delete
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
