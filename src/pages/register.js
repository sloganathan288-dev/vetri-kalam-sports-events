import { useEffect, useMemo, useRef, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import Layout from "../components/layout/Layout"
import { fetchEvents, submitRegistration } from "../utils/api"
import { consumeQuick } from "../utils/quickRegister"

/* Indian states and Union Territories — keeps `state` consistent across rows. */
const STATES = [
	"Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
	"Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
	"Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
	"Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
	"Uttar Pradesh", "Uttarakhand", "West Bengal",
	"Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
	"Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
]

const GENDERS = ["Male", "Female", "Other", "Prefer not to say"]
const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"]

const EMPTY = {
	registrationId: "",
	eventId: "",
	participantName: "",
	dateOfBirth: "",
	gender: "",
	phone: "",
	email: "",
	address: "",
	city: "",
	state: "Tamil Nadu",
	emergencyContactName: "",
	emergencyContactPhone: "",
	category: "",
	raceCategory: "",
	tshirtSize: "",
	paymentUtr: "",
}

/** VK-YYYYMMDD-XXXXXX — proposed here, finally assigned by the server. */
function candidateId() {
	const d = new Date()
	const p = (n) => String(n).padStart(2, "0")
	const day = `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}`
	const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
	let rand = ""
	for (let i = 0; i < 6; i++) {
		rand += alphabet[Math.floor(Math.random() * alphabet.length)]
	}
	return `VK-${day}-${rand}`
}

function ageFromDob(value) {
	if (!value) return ""
	const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
	if (!m) return ""
	const now = new Date()
	let age = now.getFullYear() - Number(m[1])
	const monthNow = now.getMonth() + 1
	const dayNow = now.getDate()
	if (monthNow < Number(m[2]) || (monthNow === Number(m[2]) && dayNow < Number(m[3]))) age -= 1
	return age < 0 || age > 120 ? "" : age
}

function todayIso() {
	const d = new Date()
	const p = (n) => String(n).padStart(2, "0")
	return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

/* Mirrors the server rules so problems surface immediately; the API remains
   the authority and its errors are shown if they differ. */
function validate(form, event) {
	const e = {}
	if (!form.eventId) e.eventId = "Please choose an event."
	else if (event && !event.registrationOpen) e.eventId = "Registration for this event is closed."

	const name = form.participantName.trim()
	if (!name) e.participantName = "Participant name is required."
	else if (name.length < 2) e.participantName = "Participant name is too short."

	if (!form.dateOfBirth) e.dateOfBirth = "Date of birth is required."
	else if (form.dateOfBirth > todayIso()) e.dateOfBirth = "Date of birth cannot be in the future."
	else {
		const age = ageFromDob(form.dateOfBirth)
		if (age === "") e.dateOfBirth = "Check the date of birth."
		else if (age < 5 || age > 100) e.dateOfBirth = "Participants must be between 5 and 100 years old."
	}

	if (!form.gender) e.gender = "Please choose an option."

	const digits = (v) => v.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "")
	if (!form.phone.trim()) e.phone = "Phone is required."
	else if (!/^[6-9]\d{9}$/.test(digits(form.phone))) e.phone = "Enter a valid 10-digit mobile number."

	if (!form.email.trim()) e.email = "Email is required."
	else if (!/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(form.email.trim()))
		e.email = "Enter a valid email address."

	if (!form.city.trim()) e.city = "City is required."
	if (!form.state) e.state = "State is required."

	if (!form.emergencyContactName.trim()) e.emergencyContactName = "Emergency contact name is required."
	if (!form.emergencyContactPhone.trim()) e.emergencyContactPhone = "Emergency contact phone is required."
	else if (!/^[6-9]\d{9}$/.test(digits(form.emergencyContactPhone)))
		e.emergencyContactPhone = "Enter a valid 10-digit mobile number."

	if (!form.category) e.category = "Please choose an event category."
	if (!form.raceCategory) e.raceCategory = "Please choose a race or sports category."

	if (event && event.tshirtRequired && !form.tshirtSize)
		e.tshirtSize = "T-shirt size is required."

	if (form.paymentUtr.trim() && !/^[A-Za-z0-9][A-Za-z0-9\-_/]*$/.test(form.paymentUtr.trim()))
		e.paymentUtr = "Payment reference may only contain letters, numbers, - _ /"
	else if (event && Number(event.registrationFee || 0) > 0 && !form.paymentUtr.trim())
		e.paymentUtr = "Payment reference (UTR / UPI) is required for a paid event."

	return e
}

export default function Register() {
	const [searchParams] = useSearchParams()
	const [events, setEvents] = useState([])
	const [loadState, setLoadState] = useState("loading")
	const [loadError, setLoadError] = useState("")
	const [form, setForm] = useState(EMPTY)
	const [errors, setErrors] = useState({})
	const [status, setStatus] = useState(null) // {kind:'success'|'error', ...}
	const [submitting, setSubmitting] = useState(false)
	const [receipt, setReceipt] = useState(null)
	const errorRef = useRef(null)

	/* ---- catalogue + carry-over from the sidebar "Join now" forms ----- */
	useEffect(() => {
		const quick = consumeQuick()
		const base =
			quick && (quick.participantName || quick.email || quick.phone)
				? Object.assign({}, EMPTY, quick, { registrationId: candidateId() })
				: EMPTY
		if (base !== EMPTY) setForm(base)

		let alive = true
		fetchEvents()
			.then((data) => {
				if (!alive) return
				setEvents(data.events || [])
				setLoadState("ready")
				const wanted = searchParams.get("event")
				const preselect = (data.events || []).find((e) => e.eventId === wanted)
				if (preselect && preselect.registrationOpen) selectEvent(preselect, base)
			})
			.catch((err) => {
				if (!alive) return
				setLoadState("error")
				setLoadError(err.message || "Could not load events.")
			})
		return () => { alive = false }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	function selectEvent(event, base) {
		setForm(Object.assign({}, base || form, {
			registrationId: (base || form).registrationId || candidateId(),
			eventId: event ? event.eventId : "",
			category: event ? event.category : "",
			raceCategory: "",
		}))
	}

	const selectedEvent = useMemo(
		() => events.find((e) => e.eventId === form.eventId) || null,
		[events, form.eventId]
	)

	function set(key, value) {
		setForm((prev) => {
			const next = Object.assign({}, prev, { [key]: value })
			if (key === "eventId") {
				const ev = events.find((e) => e.eventId === value)
				next.category = ev ? ev.category : ""
				next.raceCategory = ""
			}
			if (!next.registrationId) next.registrationId = candidateId()
			return next
		})
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

		const found = validate(form, selectedEvent)
		if (Object.keys(found).length) {
			setErrors(found)
			setStatus({ kind: "error", message: "Please correct the highlighted fields." })
			if (errorRef.current) errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
			return
		}
		setErrors({})

		setSubmitting(true)
		try {
			const data = await submitRegistration({
				registrationId: form.registrationId,
				eventId: form.eventId,
				participantName: form.participantName.trim(),
				dateOfBirth: form.dateOfBirth,
				gender: form.gender,
				phone: form.phone.trim(),
				email: form.email.trim(),
				address: form.address.trim(),
				city: form.city.trim(),
				state: form.state,
				emergencyContactName: form.emergencyContactName.trim(),
				emergencyContactPhone: form.emergencyContactPhone.trim(),
				category: form.category,
				raceCategory: form.raceCategory,
				tshirtSize: form.tshirtSize,
				paymentUtr: form.paymentUtr.trim(),
			})

			// Reached ONLY after the API confirmed a stored row.
			setReceipt(data.registration)
			setStatus({
				kind: "success",
				message: "Your registration has been recorded.",
			})
			window.scrollTo({ top: 0, behavior: "smooth" })
		} catch (err) {
			if (err.errors) setErrors(err.errors)
			setStatus({ kind: "error", message: err.message })
			if (errorRef.current) errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
		} finally {
			setSubmitting(false)
		}
	}

	function reset() {
		setReceipt(null)
		setStatus(null)
		setErrors({})
		setForm(Object.assign({}, EMPTY, { registrationId: candidateId() }))
	}

	const err = (key) => (errors[key] ? { "aria-invalid": "true", "aria-describedby": `${key}-error` } : {})
	const errText = (key) => (errors[key] ? <span className="vk-field-error" id={`${key}-error`}>{errors[key]}</span> : null)
	const req = <span className="vk-required" aria-hidden="true">*</span>

	return (
		<>
			<Layout headerStyle={1} footerStyle={1} breadcrumbTitle="title">
				<div className="page-title page-title-blog">
					<div className="themeflat-container">
						<div className="row">
							<div className="col-md-12">
								<div className="page-title-heading">
									<h1 className="title">Event Registration</h1>
								</div>
								<div className="breadcrumbs">
									<ul>
										<li><Link to="/">Homepage</Link></li>
										<li><i className="icon-Arrow---Right-2" /></li>
										<li><a href="#top">Registration</a></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="vk-register main-content">
					<div className="themeflat-container">
						<div ref={errorRef}>
							{status ? (
								<div
									className={`vk-alert ${status.kind === "success" ? "is-success" : "is-error"}`}
									role={status.kind === "success" ? "status" : "alert"}
								>
									{status.message}
								</div>
							) : null}
						</div>

						{receipt ? (
							<div className="vk-receipt">
								<h2>Registration recorded</h2>
								<p className="vk-receipt-lead">
									Your entry has been stored. Quote the registration ID below in any
									communication with the organiser.
								</p>
								<dl className="vk-receipt-grid">
									<div><dt>Registration ID</dt><dd className="vk-receipt-id">{receipt.registrationId}</dd></div>
									<div><dt>Participant</dt><dd>{receipt.participantName}</dd></div>
									<div><dt>Event</dt><dd>{receipt.eventName}</dd></div>
									<div><dt>Category</dt><dd>{receipt.raceCategory}</dd></div>
									<div><dt>Registered on</dt><dd>{new Date(receipt.registrationDate).toLocaleString("en-IN")}</dd></div>
									<div><dt>Payment status</dt><dd>{receipt.paymentStatus}</dd></div>
									<div><dt>Registration status</dt><dd>{receipt.registrationStatus}</dd></div>
								</dl>
								<p className="vk-receipt-note">
									Payment and registration status are confirmed manually by the
									organiser. Nothing has been charged by submitting this form.
								</p>
								<div className="vk-receipt-actions">
									<button type="button" className="flat-button" onClick={reset}>
										<span>Register another participant</span>
									</button>
									<Link to="/check-registration" className="flat-button vk-btn-ghost"><span>Check Registration</span></Link>
								<Link to="/event" className="flat-button vk-btn-ghost"><span>View events</span></Link>
								</div>
							</div>
						) : (
							<form className="vk-reg-form" onSubmit={onSubmit} noValidate>
								<div className="vk-form-head">
									<h2>Register for a VETRI KALAM event</h2>
									<p>
										Fields marked <span className="vk-required">*</span> are required.
										Your details are used only to organise this event.
									</p>
								</div>

								{loadState === "loading" ? (
									<p className="vk-loading" role="status">Loading events…</p>
								) : null}

								{loadState === "error" ? (
									<div className="vk-alert is-error" role="alert">
										Events could not be loaded: {loadError} Please call{" "}
										<a href="tel:+918838676284">+91 88386 76284</a> or email{" "}
										<a href="mailto:sloganathan0105@gmail.com">sloganathan0105@gmail.com</a>{" "}
										to register.
									</div>
								) : null}

								<h3 className="vk-section-title">Event selection</h3>
								<div className="vk-grid">
									<div className="vk-field">
										<label htmlFor="registrationId">Registration ID</label>
										<input
											id="registrationId" name="registrationId" type="text"
											className="tb-my-input" value={form.registrationId}
											aria-describedby="registrationId-help" readOnly
										/>
										<span className="vk-help" id="registrationId-help">
											Generated automatically. The server assigns the final ID on submission.
										</span>
									</div>

									<div className="vk-field">
										<label htmlFor="eventId">Event {req}</label>
										<select
											id="eventId" name="eventId" className="tb-my-input"
											value={form.eventId} onChange={(e) => set("eventId", e.target.value)}
											{...err("eventId")}
										>
											<option value="">Select an event…</option>
											{events.map((e) => (
												<option key={e.eventId} value={e.eventId} disabled={!e.registrationOpen}>
													{e.eventName}{e.registrationOpen ? "" : " (closed)"}
												</option>
											))}
										</select>
										{errText("eventId")}
									</div>

									<div className="vk-field">
										<label htmlFor="category">Event category {req}</label>
										<select
											id="category" name="category" className="tb-my-input"
											value={form.category} onChange={(e) => set("category", e.target.value)}
											{...err("category")}
										>
											<option value="">Select a category…</option>
											{selectedEvent
												? <option value={selectedEvent.category}>{selectedEvent.category}</option>
												: events.map((e) => (
													<option key={e.category} value={e.category}>{e.category}</option>
												))}
										</select>
										{errText("category")}
									</div>

									<div className="vk-field">
										<label htmlFor="raceCategory">Race / sports category {req}</label>
										<select
											id="raceCategory" name="raceCategory" className="tb-my-input"
											value={form.raceCategory} onChange={(e) => set("raceCategory", e.target.value)}
											{...err("raceCategory")}
										>
											<option value="">
												{selectedEvent ? "Select a category…" : "Choose an event first…"}
											</option>
											{selectedEvent
												? selectedEvent.raceCategories.map((c) => (
													<option key={c} value={c}>{c}</option>
												))
												: null}
										</select>
										{errText("raceCategory")}
									</div>
								</div>

								<h3 className="vk-section-title">Participant details</h3>
								<div className="vk-grid">
									<div className="vk-field vk-span-2">
										<label htmlFor="participantName">Participant name {req}</label>
										<input
											id="participantName" name="participantName" type="text"
											className="tb-my-input" value={form.participantName}
											onChange={(e) => set("participantName", e.target.value)}
											autoComplete="name" maxLength={100} {...err("participantName")}
										/>
										{errText("participantName")}
									</div>

									<div className="vk-field">
										<label htmlFor="dateOfBirth">Date of birth {req}</label>
										<input
											id="dateOfBirth" name="dateOfBirth" type="date"
											className="tb-my-input" value={form.dateOfBirth}
											max={todayIso()}
											onChange={(e) => set("dateOfBirth", e.target.value)}
											{...err("dateOfBirth")}
										/>
										{errText("dateOfBirth")}
									</div>

									<div className="vk-field">
										<label htmlFor="age">Age</label>
										<input
											id="age" name="age" type="text" className="tb-my-input"
											value={ageFromDob(form.dateOfBirth)} readOnly
											aria-describedby="age-help"
										/>
										<span className="vk-help" id="age-help">Calculated from date of birth.</span>
									</div>

									<div className="vk-field">
										<label htmlFor="gender">Gender {req}</label>
										<select
											id="gender" name="gender" className="tb-my-input"
											value={form.gender} onChange={(e) => set("gender", e.target.value)}
											{...err("gender")}
										>
											<option value="">Select…</option>
											{GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
										</select>
										{errText("gender")}
									</div>

									<div className="vk-field">
										<label htmlFor="tshirtSize">T-shirt size {req}</label>
										<select
											id="tshirtSize" name="tshirtSize" className="tb-my-input"
											value={form.tshirtSize} onChange={(e) => set("tshirtSize", e.target.value)}
											{...err("tshirtSize")}
										>
											<option value="">Select…</option>
											{TSHIRT_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
										</select>
										{errText("tshirtSize")}
									</div>

									<div className="vk-field">
										<label htmlFor="phone">Phone {req}</label>
										<input
											id="phone" name="phone" type="tel" inputMode="tel"
											className="tb-my-input" value={form.phone}
											onChange={(e) => set("phone", e.target.value)}
											autoComplete="tel" maxLength={20} placeholder="+91 "
											{...err("phone")}
										/>
										{errText("phone")}
									</div>

									<div className="vk-field">
										<label htmlFor="email">Email {req}</label>
										<input
											id="email" name="email" type="email" inputMode="email"
											className="tb-my-input" value={form.email}
											onChange={(e) => set("email", e.target.value)}
											autoComplete="email" maxLength={254} {...err("email")}
										/>
										{errText("email")}
									</div>
								</div>

								<h3 className="vk-section-title">Address</h3>
								<div className="vk-grid">
									<div className="vk-field vk-span-3">
										<label htmlFor="address">Address</label>
										<textarea
											id="address" name="address" className="tb-my-input" rows={2}
											value={form.address} onChange={(e) => set("address", e.target.value)}
											maxLength={250} autoComplete="street-address"
										/>
									</div>
									<div className="vk-field">
										<label htmlFor="city">City {req}</label>
										<input
											id="city" name="city" type="text" className="tb-my-input"
											value={form.city} onChange={(e) => set("city", e.target.value)}
											autoComplete="address-level2" maxLength={80} {...err("city")}
										/>
										{errText("city")}
									</div>
									<div className="vk-field">
										<label htmlFor="state">State {req}</label>
										<select
											id="state" name="state" className="tb-my-input"
											value={form.state} onChange={(e) => set("state", e.target.value)}
											{...err("state")}
										>
											{STATES.map((s) => <option key={s} value={s}>{s}</option>)}
										</select>
										{errText("state")}
									</div>
								</div>

								<h3 className="vk-section-title">Emergency contact</h3>
								<div className="vk-grid">
									<div className="vk-field">
										<label htmlFor="emergencyContactName">Contact name {req}</label>
										<input
											id="emergencyContactName" name="emergencyContactName" type="text"
											className="tb-my-input" value={form.emergencyContactName}
											onChange={(e) => set("emergencyContactName", e.target.value)}
											maxLength={100} {...err("emergencyContactName")}
										/>
										{errText("emergencyContactName")}
									</div>
									<div className="vk-field">
										<label htmlFor="emergencyContactPhone">Contact phone {req}</label>
										<input
											id="emergencyContactPhone" name="emergencyContactPhone" type="tel"
											inputMode="tel" className="tb-my-input"
											value={form.emergencyContactPhone}
											onChange={(e) => set("emergencyContactPhone", e.target.value)}
											maxLength={20} placeholder="+91 " {...err("emergencyContactPhone")}
										/>
										{errText("emergencyContactPhone")}
									</div>
								</div>

								<h3 className="vk-section-title">Payment reference</h3>
								<div className="vk-grid">
									<div className="vk-field vk-span-2">
										<label htmlFor="paymentUtr">Payment / UTR ID</label>
										<input
											id="paymentUtr" name="paymentUtr" type="text"
											className="tb-my-input" value={form.paymentUtr}
											onChange={(e) => set("paymentUtr", e.target.value)}
											maxLength={40} {...err("paymentUtr")}
										/>
										{errText("paymentUtr")}
										<span className="vk-help">
											Optional. Enter it only if you have already paid and were given a
											UTR or UPI reference. No payment is taken by this form.
										</span>
									</div>
								</div>

								<h3 className="vk-section-title">Assigned automatically</h3>
								<div className="vk-grid">
									<div className="vk-field">
										<label htmlFor="regDate">Registration date</label>
										<input id="regDate" type="text" className="tb-my-input" value={todayIso()} readOnly />
									</div>
									<div className="vk-field">
										<label htmlFor="payStatus">Payment status</label>
										<input id="payStatus" type="text" className="tb-my-input" value="Pending" readOnly />
									</div>
									<div className="vk-field">
										<label htmlFor="regStatus">Registration status</label>
										<input id="regStatus" type="text" className="tb-my-input" value="Pending" readOnly />
									</div>
								</div>

								<div className="vk-form-actions">
									<button
										type="submit" className="flat-button" disabled={submitting || loadState !== "ready"}
									>
										<span>{submitting ? "Submitting…" : "Submit registration"}</span>
									</button>
									<p className="vk-privacy">
										We store these details to run the event you are entering. To have
										them corrected or removed, contact{" "}
										<a href="mailto:sloganathan0105@gmail.com">sloganathan0105@gmail.com</a>.
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
