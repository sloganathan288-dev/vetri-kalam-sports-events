
import { Link } from "react-router-dom"

export default function Banner() {
	return (
		<>

			<div className="tf-widget-banner">
				<div className="themeflat-container">
					<div className="tf-banne-paralax">
						<h2 className="title-banner wow fadeInUp animated ">
							Register for the next VETRI KALAM event
						</h2>
						<span className="sale wow fadeInUp animated ">OPEN</span>
						<img src="images/retinal/vk-wordmark.png" alt="VETRI KALAM Sports &amp; Events" className="wow fadeInUp animated" />
						<Link to="/contact" className="flat-button wow fadeInUp animated ">Register now</Link>
					</div>
				</div>
			</div>
		</>
	)
}
