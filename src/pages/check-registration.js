import { useState } from "react"
import { Link } from "react-router-dom"
import Layout from "../components/layout/Layout"
import { checkRegistration } from "../utils/api"

const EMPTY = { registrationId: "", phone: "" }

/* Mirrors the server rules so problems surface immediately; the API remains
   the authority and its errors are shown if they differ. */
function normalizePhone(value) {
	const digits = value.replace(/\D/g, "")
	return digits.startsWith("91") && digits.length === 12 ? digits.slice(2) : digits
}

function validate(form) {
	const e = {}

	const id = form.registrationId.trim().toUpperCase()
	if (!id) e.registrationId = "Registration ID is required."
	else if (!/^VK-\d{8}-[A-Z0-9]{6}$/.test(id))
		e.registrationId = "Enter the registration ID exactly as shown (e.g. VK-20260425-ABC123)."

	if (!form.phone.trim()) e.phone = "Phone number is required."
	else if (!/^[6-9]\d{9}$/.test(normalizePhone(form.phone)))
		e.phone = "Enter the 10-digit mobile number used during registration."

	return e
}

function paymentBadge(status) {
	const map = { Paid: "is-paid", Pending: "is-pending", Failed: "is-failed", Refunded: "is-refunded" }
	return `vk-badge ${map[status] || ""}`
}

function registrationBadge(status) {
	const map = { Confirmed: "is-confirmed", Pending: "is-pending", Cancelled: "is-cancelled", Waitlist: "is-waitlist" }
	return `vk-badge ${map[status] || ""}`
}

export default function CheckRegistration() {
	const [form, setForm] = useState(EMPTY)
	const [errors, setErrors] = useState({})
	const [status, setStatus] = useState(null) // {kind:'success'|'error', ...}
	const [result, setResult] = useState(null)
	const [busy, setBusy] = useState(false)

	function set(key, value) {
		setForm((prev) => Object.assign({}, prev, { [key]: value }))
		setErrors((prev) => {
			if (!prev[key]) return prev
			const next = Object.assign({}, prev)
			delete next[key]
			return next
		})
	}

	async function onSubmit(event) {
		event.preventDefault()
		setStatus(null)

		const found = validate(form)
		if (Object.keys(found).length) {
			setErrors(found)
			return
		}
		setErrors({})
		setBusy(true)

		try {
			const data = await checkRegistration(form.registrationId.trim().toUpperCase(), form.phone.trim())
			setResult(data.registration)
			setStatus({ kind: "success", message: "Registration found." })
			window.scrollTo({ top: 0, behavior: "smooth" })
		} catch (err) {
			setResult(null)
			setStatus({ kind: "error", message: err.message })
		} finally {
			setBusy(false)
		}
	}

	function reset() {
		setResult(null)
		setStatus(null)
		setErrors({})
		setForm(EMPTY)
	}

	const err = (key) => (errors[key] ? { "aria-invalid": "true" } : {})
	const errText = (key) => (errors[key] ? <span className="vk-field-error">{errors[key]}</span> : null)
	const req = <span className="vk-required" aria-hidden="true">*</span>

	return (
		<>
			<Layout headerStyle={1} footerStyle={1} breadcrumbTitle="title">
				<div className="page-title page-title-blog">
					<div className="themeflat-container">
						<div className="row">
							<div className="col-md-12">
								<div className="page-title-heading">
									<h1 className="title">Check Registration</h1>
								</div>
								<div className="breadcrumbs">
									<ul>
										<li><Link to="/">Homepage</Link></li>
										<li><i className="icon-Arrow---Right-2" /></li>
										<li><a href="#top">Check Registration</a></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="vk-check main-content">
					<div className="themeflat-container">
						{status ? (
							<div
								className={`vk-alert ${status.kind === "success" ? "is-success" : "is-error"}`}
								role={status.kind === "success" ? "status" : "alert"}
							>
								{status.message}
							</div>
						) : null}

						{result ? (
							<div className="vk-receipt">
								<h2>Registration found</h2>
								<p className="vk-receipt-lead">
									These are the details matching your registration ID and phone number.
								</p>
								<dl className="vk-receipt-grid">
									<div><dt>Registration ID</dt><dd className="vk-receipt-id">{result.registrationId}</dd></div>
									<div><dt>Participant name</dt><dd>{result.participantName}</dd></div>
									<div><dt>Event</dt><dd>{result.eventName}</dd></div>
									<div><dt>Category</dt><dd>{result.category}</dd></div>
									<div><dt>Registration date</dt><dd>{new Date(result.registrationDate).toLocaleDateString("en-IN")}</dd></div>
									<div>
										<dt>Payment status</dt>
										<dd><span className={paymentBadge(result.paymentStatus)}>{result.paymentStatus}</span></dd>
									</div>
									<div>
										<dt>Registration status</dt>
										<dd><span className={registrationBadge(result.registrationStatus)}>{result.registrationStatus}</span></dd>
									</div>
								</dl>
								<p className="vk-receipt-note">
									Payment and registration status are confirmed manually by the
									organiser. If anything looks wrong, contact us with your
									registration ID.
								</p>
								<div className="vk-receipt-actions">
									<button type="button" className="flat-button" onClick={reset}>
										<span>Check another registration</span>
									</button>
									<Link to="/register" className="flat-button vk-btn-ghost"><span>New registration</span></Link>
								</div>
							</div>
						) : (
							<form className="vk-check-form" onSubmit={onSubmit} noValidate>
								<div className="vk-form-head">
									<h2>Check your registration</h2>
									<p>
										Enter the registration ID you received and the phone number used
										during registration. Both must match our records.
									</p>
								</div>

								<div className="vk-grid">
									<div className="vk-field vk-span-2">
										<label htmlFor="check-registrationId">Registration ID {req}</label>
										<input
											id="check-registrationId" name="registrationId" type="text"
											className="tb-my-input" value={form.registrationId}
											onChange={(e) => set("registrationId", e.target.value)}
											placeholder="VK-20260425-ABC123" autoComplete="off"
											{...err("registrationId")}
										/>
										{errText("registrationId")}
									</div>

									<div className="vk-field vk-span-2">
										<label htmlFor="check-phone">Registered phone number {req}</label>
										<input
											id="check-phone" name="phone" type="tel" inputMode="tel"
											className="tb-my-input" value={form.phone}
											onChange={(e) => set("phone", e.target.value)}
											placeholder="+91 98765 43210" autoComplete="tel" maxLength={20}
											{...err("phone")}
										/>
										{errText("phone")}
										<span className="vk-help">The 10-digit mobile number you entered while registering.</span>
									</div>
								</div>

								<div className="vk-form-actions">
									<button type="submit" className="flat-button" disabled={busy}>
										<span>{busy ? "Checking…" : "Check registration"}</span>
									</button>
									<p className="vk-privacy">
										Your details are used only to look up this registration. We never
										show information that does not match both fields.
									</p>
								</div>
							</form>
						)}
					</div>
				</div>
			</Layout>
		</>
	)
}
