

import { useEffect, useState } from "react"
import BackToTop from '../elements/BackToTop'
import Footer1 from './footer/Footer1'
import Footer2 from './footer/Footer2'
import Header1 from "./header/Header1"
import Header2 from './header/Header2'
import MobileMenu from './MobileMenu'

export default function Layout({ headerStyle, footerStyle, breadcrumbTitle, children,backAlt }) {
	const [scroll, setScroll] = useState(0)
	// Mobile Menu
	const [isMobileMenu, setMobileMenu] = useState(false)
	const handleMobileMenu = () => setMobileMenu(!isMobileMenu)

	// Cart
	const [isCart, setCart] = useState(false)
	const handleCart = () => setCart(!isCart)

	useEffect(() => {
		const WOW = require('wowjs')
		window.wow = new WOW.WOW({
			live: false
		})
		window.wow.init()

		const onScroll = () => {
			setScroll(window.scrollY > 100)
		}

		window.addEventListener("scroll", onScroll)
		return () => window.removeEventListener("scroll", onScroll)
	}, [])
	return (
		<><div id="top" />
			{/* <AddClassBody /> */}
			{!headerStyle && <Header1
				scroll={scroll}
				isMobileMenu={isMobileMenu}
				handleMobileMenu={handleMobileMenu}
				isCart={isCart}
				handleCart={handleCart}
			/>}
			{headerStyle === 1 ? <Header1
				scroll={scroll}
				isMobileMenu={isMobileMenu}
				handleMobileMenu={handleMobileMenu}
				isCart={isCart}
				handleCart={handleCart}
			/> : null}

			{headerStyle === 2 ? <Header2
				scroll={scroll}
				isMobileMenu={isMobileMenu}
				handleMobileMenu={handleMobileMenu}
				isCart={isCart}
				handleCart={handleCart}
			/> : null}
			<MobileMenu isMobileMenu={isMobileMenu} handleMobileMenu={handleMobileMenu} />


			{children}

			{!footerStyle && < Footer1 />}
			{footerStyle === 1 ? < Footer1 /> : null}
			{footerStyle === 2 ? < Footer2 /> : null}

			<BackToTop target="#top" backAlt={backAlt} />

		</>
	)
}
