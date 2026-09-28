
import { Link } from "react-router-dom"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
	modules: [Autoplay, Pagination, Navigation],
	effect: "fade",
	pagination: {
		el: ".swiper-pagination",
		clickable: true,
	},
}

export default function Slider3() {
	return (
		<>

			<div className="tf-widget-slider-v2">
				<div className="themeflat-container">
					<div className="row">
						<div className="col-md-8 pd-r-slider">
							<Swiper {...swiperOptions} className="swiper tf-slider-product wow fadeInLeft animated" data-wow-delay="0.3s">
								<div className="slide-product-wrap swiper-wrapper">
									<SwiperSlide className="slide-product-item swiper-slide">
										<div className="product-image">
											<img src="images/slides/slidev1.jpg" alt="" />
										</div>
										<div className="product-content">
											<div className="content-slide">
												<span className="sale-up">Entries Open</span>
												<h2>Looking For Your Next Event</h2>
												<p className="post">Where Champions Meet</p>
												<Link to="/register" className="flat-button">Register Now</Link>
											</div>
										</div>
									</SwiperSlide>
									<SwiperSlide className="slide-product-item swiper-slide">
										<div className="product-image">
											<img src="images/slides/slidev2.jpg" alt="" />
										</div>
										<div className="product-content">
											<div className="content-slide">
												<span className="sale-up">Entries Open</span>
												<h2>Register For The Next Event</h2>
												<p className="post">Compete. Conquer. Celebrate.</p>
												<Link to="/register" className="flat-button">Register Now</Link>
											</div>
										</div>
									</SwiperSlide>
								</div>
								<div className="swiper-pagination" />
							</Swiper>
						</div>
						<div className="col-md-4 pd-l-banner">
							<div className="tf-banner-product wow fadeInRight animated" data-wow-delay="0.5s">
								<div className="banner-product-wrap">
									<div className="banner-product-item">
										<div className="product-image">
											<img src="images/slides/bannerv1.jpg" alt="VETRI KALAM Marathon" />
										</div>
										<div className="product-content">
											<div className="content-banner">
												<span className="sale-up">Salem, Tamil Nadu</span>
												<h4><Link to="/event-details">VETRI KALAM Marathon</Link></h4>
												<div className="price">Entry <span>open</span></div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="tf-banner-product wow fadeInRight animated" data-wow-delay="0.10s">
								<div className="banner-product-wrap">
									<div className="banner-product-item">
										<div className="product-image">
											<img src="images/slides/bannerv2.jpg" alt="VETRI KALAM Sports Fest" />
										</div>
										<div className="product-content">
											<div className="content-banner">
												<span className="sale-up">Salem, Tamil Nadu</span>
												<h4><Link to="/event-details">VETRI KALAM Sports Fest</Link></h4>
												<div className="price">Entry <span>open</span></div>
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
