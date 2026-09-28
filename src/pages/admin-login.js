import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Layout from "../components/layout/Layout"
import { login, setSession } from "../utils/api"

export default function AdminLogin() {
	const navigate = useNavigate()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [message, setMessage] = useState(null)
	const [errors, setErrors] = useState({})
	const [busy, setBusy] = useState(false)

	async function onSubmit(event) {
		event.preventDefault()
		setMessage(null)

		const found = {}
		if (!email.trim()) found.email = "Email is required."
		if (!password) found.password = "Password is required."
		if (Object.keys(found).length) {
			setErrors(found)
			return
		}
		setErrors({})
		setBusy(true)

		try {
			const data = await login(email.trim(), password)
			setSession(data.token, data.admin && data.admin.email)
			navigate("/admin/dashboard", { replace: true })
		} catch (err) {
			if (err.errors) setErrors(err.errors)
			setMessage({ kind: "error", message: err.message })
		} finally {
			setBusy(false)
		}
	}

	const errText = (key) =>
		errors[key] ? <span className="vk-field-error" id={`${key}-error`}>{errors[key]}</span> : null

	return (
		<>
			<Layout headerStyle={1} footerStyle={1} breadcrumbTitle="title">
				<div className="page-title page-title-blog">
					<div className="themeflat-container">
						<div className="row">
							<div className="col-md-12">
								<div className="page-title-heading">
									<h1 className="title">Organiser Sign In</h1>
								</div>
								<div className="breadcrumbs">
									<ul>
										<li><Link to="/">Homepage</Link></li>
										<li><i className="icon-Arrow---Right-2" /></li>
										<li><a>Organiser Dashboard</a></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="vk-admin main-content">
					<div className="themeflat-container">
						<div className="vk-login-wrap">
							<div className="vk-login-brand">
								<img src="/images/logo-v2.png" alt="VETRI KALAM Sports & Events" />
								<h2>Organiser Dashboard</h2>
								<p>Sign in to manage event registrations</p>
							</div>

							{message ? (
								<div className={`vk-alert ${message.kind === "success" ? "is-success" : "is-error"}`}
									role={message.kind === "success" ? "status" : "alert"}>
									{message.message}
								</div>
							) : null}

							<form className="vk-grid" onSubmit={onSubmit} noValidate>
								<div className="vk-field">
									<label htmlFor="admin-email">Email</label>
									<input
										id="admin-email" name="email" type="email" autoComplete="username"
										className="tb-my-input" value={email}
										onChange={(e) => setEmail(e.target.value)}
										aria-invalid={errors.email ? "true" : undefined}
									/>
									{errText("email")}
								</div>

								<div className="vk-field">
									<label htmlFor="admin-password">Password</label>
									<input
										id="admin-password" name="password" type="password"
										autoComplete="current-password"
										className="tb-my-input" value={password}
										onChange={(e) => setPassword(e.target.value)}
										aria-invalid={errors.password ? "true" : undefined}
									/>
									{errText("password")}
								</div>

								<div className="vk-form-actions" style={{ marginTop: "10px" }}>
									<button type="submit" className="vk-btn" disabled={busy}>
										<span>{busy ? "Signing in…" : "Sign in"}</span>
									</button>
									<Link to="/" className="vk-btn is-outline">Back to site</Link>
								</div>
							</form>

							<p className="vk-login-help">
								Access is limited to the VETRI KALAM organiser account. Credentials are
								verified server-side and never stored in this page.
							</p>
						</div>
					</div>
				</div>
			</Layout>
		</>
	)
}
