
import { Link } from "react-router-dom"

export default function Our() {
	return (
		<>

			<div className="tf-widget-our-collection main-content">
				<div className="themeflat-container">
					<div className="title-box title-small center-title-box">
						<h2 className="title-section wow fadeInUp animated">Our Events</h2>
					</div>
					<div className="row">
						<div className="col-md-6 pd-r-col">
							<div className="tf-collection wow fadeInLeft animated">
								<div className="tf-collection-wrap">
									<div className="collection-item">
										<div className="collection-image">
											<img src="images/retinal/cls1.jpg" alt="" />
										</div>
										<div className="collection-content">
											<div className="content-slide">
												<span className="sale-up">Entries Open</span>
												<h3>Where Champions Meet</h3>
												<p className="post">Compete. Conquer. Celebrate.</p>
												<Link to="/register" className="flat-button">Register Now</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="col-md-6 pd-l-col">
							<div className="row banner-tow">
								<div className="col-md-6 pd-r-col">
									<div className="tf-collection-banner wow fadeInRight animated" data-wow-delay="0.1s">
										<div className="collection-banner-wrap">
											<div className="collection-banner-item">
												<div className="banner-image">
													<img src="images/retinal/cls3.jpg" alt="" />
												</div>
												<div className="banner-content">
													<div className="content-banner">
														<span className="sale-up">Salem, Tamil Nadu</span>
														<h5><Link to="/event">Corporate Sports Events</Link></h5>
														<Link className="shop-now" to="/register">Register Now</Link>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-md-6 pd-l-col">
									<div className="tf-collection-banner wow fadeInRight animated" data-wow-delay="0.5s">
										<div className="collection-banner-wrap">
											<div className="collection-banner-item">
												<div className="banner-image">
													<img src="images/retinal/cls2.jpg" alt="" />
												</div>
												<div className="banner-content">
													<div className="content-banner">
														<span className="sale-up">Salem, Tamil Nadu</span>
														<h5><Link className="text-white" to="/event">Community Sports Events</Link></h5>
														<Link className="shop-now text-white" to="/register">Register Now</Link>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="tf-collection-one-col wow fadeInUp animated">
								<div className="collection-one-col-wrap">
									<div className="collection-one-col-item">
										<div className="one-col-image">
											<img src="images/retinal/cls4.jpg" alt="" />
										</div>
										<div className="one-col-content">
											<div className="content-banner">
												<span className="sale-up">Salem, Tamil Nadu</span>
												<h4><Link className="text-white" to="/event">Event Registration &amp; Ticketing</Link></h4>
												<Link className="shop-now text-white" to="/register">Register Now</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
