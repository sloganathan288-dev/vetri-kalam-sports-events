/**
 * Carries data from the template's compact "Join now" sidebar forms on
 * /event, /event-details and /about across to the full registration form.
 *
 * Those sidebar widgets were decorative in the original template — submitting
 * one did nothing but reload the page. Rather than leave a form that appears
 * broken (or rebuild the widget, which would change the layout), a submit now
 * stores what the visitor typed and opens /register with it pre-filled.
 * The real form still performs all validation; nothing here is stored
 * permanently and nothing is sent anywhere.
 */

const KEY = 'vk_quick_fields'

/** Read a submitted HTMLFormElement into a flat, trimmed object. */
export function collectQuick(form) {
	let data = {}
	try {
		data = new FormData(form)
	} catch {
		return {}
	}

	const pick = (...names) => {
		for (const n of names) {
			const v = data.get(n)
			if (v !== null && v !== undefined && String(v).trim() !== '') {
				return String(v).trim()
			}
		}
		return ''
	}

	const rawGender = pick('sex', 'gender').toLowerCase()
	const gender =
		rawGender === 'female' ? 'Female'
			: rawGender === 'male' ? 'Male'
				: ''

	return {
		participantName: pick('author', 'name', 'fullname', 'participantName'),
		email: pick('email', 'user_email'),
		phone: pick('telephone', 'phone', 'tel'),
		gender,
	}
}

/** Persist for the next route only (sessionStorage clears when the tab closes). */
export function saveQuick(fields) {
	if (!fields) return
	try {
		window.sessionStorage.setItem(KEY, JSON.stringify(fields))
	} catch {
		/* storage disabled — the visitor simply retypes the details */
	}
}

/** Read once and clear, so stale details never pre-fill a later visit. */
export function consumeQuick() {
	try {
		const raw = window.sessionStorage.getItem(KEY)
		if (!raw) return null
		window.sessionStorage.removeItem(KEY)
		const parsed = JSON.parse(raw)
		if (!parsed || typeof parsed !== 'object') return null
		return {
			participantName: typeof parsed.participantName === 'string' ? parsed.participantName : '',
			email: typeof parsed.email === 'string' ? parsed.email : '',
			phone: typeof parsed.phone === 'string' ? parsed.phone : '',
			gender: typeof parsed.gender === 'string' ? parsed.gender : '',
		}
	} catch {
		return null
	}
}

/** Shared onSubmit for the sidebar forms: stop the page reload, then move on. */
export function quickSubmit(event, navigate) {
	event.preventDefault()
	saveQuick(collectQuick(event.target))
	if (typeof navigate === 'function') navigate('/register')
}
