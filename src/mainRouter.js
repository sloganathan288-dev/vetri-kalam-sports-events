import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PageTitle from './components/PageTitle'
import About from "./pages/about"
import BlogSingle from './pages/blog-single'
import Blog from "./pages/blog"
import Contact from "./pages/contact"
import EventDetails from './pages/event-details'
import Event from './pages/event'
import Homev2 from './pages/homev2'
import Homev3 from './pages/homev3'
import Home from './pages/index'
import Register from './pages/register'
import CheckRegistration from './pages/check-registration'
import AdminLogin from './pages/admin-login'
import AdminDashboard from './pages/admin-dashboard'

export default function MainRouter() {
	return (
		<>
			<BrowserRouter>
				<PageTitle />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/blog" element={<Blog />} />
					<Route path="/blog-single" element={<BlogSingle />} />
					<Route path="/contact" element={<Contact />} />
					<Route path="/event" element={<Event />} />
					<Route path="/event-details" element={<EventDetails />} />
					<Route path="/homeV2" element={<Homev2 />} />
					<Route path="/homeV3" element={<Homev3 />} />
					<Route path="/register" element={<Register />} />
					<Route path="/check-registration" element={<CheckRegistration />} />
					<Route path="/admin/login" element={<AdminLogin />} />
					<Route path="/admin/dashboard" element={<AdminDashboard />} />
				</Routes>
			</BrowserRouter>
		</>
	)
}
