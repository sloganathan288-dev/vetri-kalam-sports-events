export const BUSINESS_EMAIL = 'sloganathan0105@gmail.com'
export const BUSINESS_PHONE = '+91 88386 76284'
export const BUSINESS_WHATSAPP = '918838676284'

export const SERVICES = [
	{ value: 'running', label: 'Running & Marathon Events' },
	{ value: 'competitions', label: 'Sports Competitions' },
	{ value: 'corporate', label: 'Corporate Sports Events' },
	{ value: 'community', label: 'Community Sports Events' },
	{ value: 'registration', label: 'Event Registration & Ticketing' },
	{ value: 'management', label: 'Sports Event Management' },
]

/**
 * Builds a mailto: link carrying the enquiry. No backend is required, and no
 * success state is faked - the visitor's own mail client does the sending.
 */
export function buildMailto(subject, fieldMap, data) {
	const body = fieldMap
		.map(([label, name]) => [label, data.get(name)])
		.filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== '')
		.map(([label, value]) => label + ': ' + String(value).trim())
		.join('\r\n')

	return (
		'mailto:' +
		BUSINESS_EMAIL +
		'?subject=' +
		encodeURIComponent(subject) +
		'&body=' +
		encodeURIComponent(body)
	)
}

/**
 * Shared <form onSubmit> handler: prevents a dead page reload, collects the
 * named fields and opens a pre-filled message to the business inbox.
 */
export function handleSubmit(event, subject, fieldMap, setMessage) {
	event.preventDefault()

	const data = new FormData(event.target)

	if (typeof setMessage === 'function') {
		setMessage(
			'Opening your email app with this enquiry. If it does not open, email ' +
				BUSINESS_EMAIL +
				' or call ' +
				BUSINESS_PHONE +
				'.'
		)
	}

	window.location.href = buildMailto(subject, fieldMap, data)
}

/**
 * Newsletter sign-up without a backend: opens a pre-filled subscription request
 * to the business inbox instead of pretending the sign-up succeeded.
 */
export function handleNewsletter(event) {
	event.preventDefault()

	const data = new FormData(event.target)
	const email = data.get('email')

	window.location.href =
		'mailto:' +
		BUSINESS_EMAIL +
		'?subject=' +
		encodeURIComponent('Newsletter subscription') +
		'&body=' +
		encodeURIComponent('Please add ' + email + ' to the VETRI KALAM Sports & Events newsletter list.')
}
