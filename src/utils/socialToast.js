/**
 * Small, truthful click feedback for the site's social-media icons.
 *
 * This module only OBSERVES clicks: it never prevents, changes or rewrites
 * the link's href/destination. It flashes the network name (e.g. "Facebook")
 * for a moment and then hides itself. No new dependencies are used.
 */

const LABELS = {
	'icon-facebook': 'Facebook',
	'icon-linkedin': 'LinkedIn',
	'icon-linkedin2': 'LinkedIn',
	'icon-twitter': 'Twitter',
	'icon-instagram': 'Instagram',
	'icon-youtube': 'YouTube',
}

let toastEl = null
let hideTimer = null
let reduceMotion = false

function ensureToast() {
	if (toastEl) return toastEl
	const el = document.createElement('div')
	el.setAttribute('role', 'status')
	el.setAttribute('aria-live', 'polite')
	el.style.cssText = [
		'position:fixed',
		'left:50%',
		'bottom:24px',
		'transform:translate(-50%, 12px)',
		'opacity:0',
		'pointer-events:none',
		'z-index:9999',
		'max-width:calc(100vw - 32px)',
		'box-sizing:border-box',
		'padding:10px 18px',
		'border-radius:999px',
		'background:rgba(18,18,18,0.94)',
		'color:#ffffff',
		'font-size:14px',
		'font-weight:600',
		'letter-spacing:0.04em',
		'line-height:1.2',
		'text-align:center',
		'font-family:inherit',
		'box-shadow:0 6px 20px rgba(0,0,0,0.25)',
		'white-space:nowrap',
		'overflow:hidden',
		'text-overflow:ellipsis',
		'transition:opacity 0.25s ease, transform 0.25s ease',
	].join(';')
	try {
		reduceMotion = window.matchMedia
			&& window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduceMotion) el.style.transition = 'none'
	} catch (err) {
		reduceMotion = false
	}
	document.body.appendChild(el)
	toastEl = el
	return el
}

function flash(label) {
	const el = ensureToast()
	el.textContent = label
	// Restart the entrance even when the same label is clicked twice in a row.
	el.style.opacity = '0'
	el.style.transform = 'translate(-50%, 12px)'
	void el.offsetHeight // force reflow
	el.style.opacity = '1'
	el.style.transform = 'translate(-50%, 0)'
	clearTimeout(hideTimer)
	hideTimer = setTimeout(() => {
		el.style.opacity = '0'
		el.style.transform = 'translate(-50%, 12px)'
	}, 1800)
}

function labelFor(anchor) {
	if (!anchor || typeof anchor.querySelectorAll !== 'function') return null
	const icons = anchor.querySelectorAll('i')
	for (let i = 0; i < icons.length; i += 1) {
		const classes = icons[i].classList
		for (let c = 0; c < classes.length; c += 1) {
			if (Object.prototype.hasOwnProperty.call(LABELS, classes[c])) {
				return LABELS[classes[c]]
			}
		}
	}
	return null
}

function handleClick(event) {
	const target = event && event.target
	if (!target || typeof target.closest !== 'function') return
	const anchor = target.closest('a')
	if (!anchor) return
	const label = labelFor(anchor)
	if (label) flash(label)
	// The original link behaviour (href, target, default navigation) is left intact.
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
	document.addEventListener('click', handleClick, false)
}
