import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const BRAND = 'VETRI KALAM Sports & Events'
const DEFAULT_DESCRIPTION = 'VETRI KALAM Sports & Events organizes professional sports events, competitions, running events, community sports activities and event-registration experiences.'

const TITLES = {
	'/': `${BRAND} | Where Champions Meet`,
	'/homev2': `Compete. Conquer. Celebrate. | ${BRAND}`,
	'/homev3': `Events & Registration | ${BRAND}`,
	'/about': `About Us | ${BRAND}`,
	'/blog': `News & Insights | ${BRAND}`,
	'/blog-single': `Article | ${BRAND}`,
	'/contact': `Contact Us | ${BRAND}`,
	'/event': `Our Events | ${BRAND}`,
	'/event-details': `Event Details | ${BRAND}`,
	'/register': `Registration | ${BRAND}`,
	'/check-registration': `Check Registration | ${BRAND}`,
	'/admin/login': `Organizer Sign In | ${BRAND}`,
	'/admin/dashboard': `Organizer Dashboard | ${BRAND}`,
}

/* One description per route so search results match the page they land on. */
const DESCRIPTIONS = {
	'/': 'VETRI KALAM Sports & Events — where champions meet. Sports events, races and competitions organised in Salem, Tamil Nadu.',
	'/homev2': 'Compete. Conquer. Celebrate. Discover VETRI KALAM Sports & Events — professional sports event organising in Salem, Tamil Nadu.',
	'/homev3': 'Browse upcoming VETRI KALAM events and register online for marathons, sports competitions, community runs and corporate challenges.',
	'/about': 'About VETRI KALAM Sports & Events — a founder-led sports events organiser based in Salem, Tamil Nadu, India.',
	'/blog': 'News, training notes and event updates from VETRI KALAM Sports & Events.',
	'/blog-single': 'Article from VETRI KALAM Sports & Events.',
	'/contact': 'Contact VETRI KALAM Sports & Events — phone, WhatsApp, email and location in Salem, Tamil Nadu, India.',
	'/event': 'Upcoming VETRI KALAM events — marathons, sports festivals, community runs, corporate challenges and youth championships.',
	'/event-details': 'Event details, categories and entry information for VETRI KALAM Sports & Events.',
	'/register': 'Register for a VETRI KALAM event — enter your details, choose a category and receive your registration ID.',
	'/check-registration': 'Check the status of your VETRI KALAM event registration using your registration ID and phone number.',
	'/admin/login': 'Sign in to the VETRI KALAM organiser dashboard to manage event registrations.',
	'/admin/dashboard': 'VETRI KALAM organiser dashboard — view, search, filter and export event registrations.',
}

export default function PageTitle() {
	const location = useLocation()

	useEffect(() => {
		const path = location.pathname.toLowerCase().replace(/\/+$/, '') || '/'
		document.title = TITLES[path] || `${BRAND} | Where Champions Meet`

		let meta = document.querySelector('meta[name="description"]')
		if (!meta) {
			meta = document.createElement('meta')
			meta.setAttribute('name', 'description')
			document.head.appendChild(meta)
		}
		meta.setAttribute('content', DESCRIPTIONS[path] || DEFAULT_DESCRIPTION)
	}, [location.pathname])

	return null
}
