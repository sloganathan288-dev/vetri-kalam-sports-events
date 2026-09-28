
import { Link } from "react-router-dom"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
	modules: [Autoplay, Pagination, Navigation],
	slidesPerView: 3,
	spaceBetween: 30,
	// autoplay: {
	// 	delay: 2500,
	// 	disableOnInteraction: false,
	// },
	loop: true,

	// Navigation
	navigation: {
		nextEl: '.h1n',
		prevEl: '.h1p',
	},

	// Pagination
	pagination: {
		el: '.swiper-pagination',
		clickable: true,
	},

	breakpoints: {
		320: {
			slidesPerView: 1,
			spaceBetween: 30,
		},
		575: {
			slidesPerView: 2,
			spaceBetween: 30,
		},
		767: {
			slidesPerView: 1,
			spaceBetween: 30,
		},
		991: {
			slidesPerView: 1,
			spaceBetween: 30,
		},
		1199: {
			slidesPerView: 1,
			spaceBetween: 30,
		},
		1350: {
			slidesPerView: 2,
			spaceBetween: 30,
		},
	}
}

export default function Pack() {
	return (
		<>

			<div className="tf-widget-pack-product">
				<div className="row">
					<div className="col-md-6 pd-form">
						<div className="tf-pack-image">
							<img src="images/product/pack.jpg" alt="VETRI KALAM sports event" />
							<div className="dot-content pack-1">
								<div className="dot tf-dot-active">
									<Link to="/event-details" className="content">
										<span>VETRI KALAM Marathon</span>
										<div className="price">
											<span className="price-sale">Entry open</span>
											<span className="price-product">Register</span>
										</div>
									</Link>
								</div>
							</div>
							<div className="dot-content pack-2">
								<div className="dot">
									<Link to="/event-details" className="content">
										<span>VETRI KALAM Sports Fest</span>
										<div className="price">
											<span className="price-sale">Entry open</span>
											<span className="price-product">Register</span>
										</div>
									</Link>
								</div>
							</div>
							<div className="dot-content pack-3">
								<div className="dot">
									<Link to="/event-details" className="content">
										<span>Community Run</span>
										<div className="price">
											<span className="price-sale">Entry open</span>
											<span className="price-product">Register</span>
										</div>
									</Link>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-6 pd-form">
						<div className="tf-pack-product">
							<div className="title-box title-small center-title-box">
								<h2 className="title-section wow fadeInUp animated">Event Packages</h2>
							</div>
							<Swiper {...swiperOptions} className="owl-themes owl-carousel wow fadeInUp animated">
								<SwiperSlide className="our-product-item">
									<div className="featured-product">
										<Link to="/event-details" className="product-thumnail">
											<div className="label-product">
												<div className="sale-percent">OPEN</div>
											</div>
											<img className="image-thumnail" src="images/product/13.png" alt="Corporate Sports Challenge" />
										</Link>
										<div className="wrap-btn-action">
											<div className="tf-btn-wishlish">
												<Link to="/register" className="btn-action">
													<i className="icon-Vector2" />
												</Link>
												<div className="label">Register</div>
											</div>
											<div className="tf-btn-compare">
												<Link to="/event" className="btn-action">
													<i className="icon-Repeat" />
												</Link>
												<div className="label">All events</div>
											</div>
											<div className="tf-btn-quickview">
												<Link to="/event-details" className="btn-action">
													<i className="icon-Eye" />
												</Link>
												<div className="label">Event details</div>
											</div>
										</div>
										<div className="count-down relative">
											<div className="featured-countdown">
												Entries open
											</div>
										</div>
										<Link to="/register" className="btn-add-cart">Register</Link>
									</div>
									<div className="product-content">
										<Link to="/event-details">
											<h3 className="product-title">Corporate Sports Challenge</h3>
										</Link>
										<div className="price">
											<span className="price-sale">Entry open</span>
											<span className="price-product">Register</span>
										</div>
									</div>
								</SwiperSlide>
								<SwiperSlide className="our-product-item">
									<div className="featured-product">
										<Link to="/event-details" className="product-thumnail">
											<div className="label-product">
												<span className="label-new">NEW</span>
											</div>
											<img className="image-thumnail" src="images/product/14.png" alt="Youth Sports Championship" />
										</Link>
										<div className="wrap-btn-action">
											<div className="tf-btn-wishlish">
												<Link to="/register" className="btn-action">
													<i className="icon-Vector2" />
												</Link>
												<div className="label">Register</div>
											</div>
											<div className="tf-btn-compare">
												<Link to="/event" className="btn-action">
													<i className="icon-Repeat" />
												</Link>
												<div className="label">All events</div>
											</div>
											<div className="tf-btn-quickview">
												<Link to="/event-details" className="btn-action">
													<i className="icon-Eye" />
												</Link>
												<div className="label">Event details</div>
											</div>
										</div>
										<Link to="/register" className="btn-add-cart">Register</Link>
									</div>
									<div className="product-content">
										<Link to="/event-details">
											<h3 className="product-title">Youth Sports Championship</h3>
										</Link>
										<div className="price">
											<span className="price-sale">Entry open</span>
											<span className="price-product">Register</span>
										</div>
									</div>
								</SwiperSlide>
								<SwiperSlide className="our-product-item">
									<div className="featured-product">
										<Link to="/event" className="product-thumnail">
											<div className="label-product">
												<span className="label-new">NEW</span>
											</div>
											<img className="image-thumnail" src="images/product/7.png" alt="Sports Competitions" />
										</Link>
										<div className="wrap-btn-action">
											<div className="tf-btn-wishlish">
												<Link to="/register" className="btn-action">
													<i className="icon-Vector2" />
												</Link>
												<div className="label">Register</div>
											</div>
											<div className="tf-btn-compare">
												<Link to="/event" className="btn-action">
													<i className="icon-Repeat" />
												</Link>
												<div className="label">All events</div>
											</div>
											<div className="tf-btn-quickview">
												<Link to="/event-details" className="btn-action">
													<i className="icon-Eye" />
												</Link>
												<div className="label">Event details</div>
											</div>
										</div>
										<Link to="/register" className="btn-add-cart">Register</Link>
									</div>
									<div className="product-content">
										<Link to="/event">
											<h3 className="product-title">Sports Competitions</h3>
										</Link>
										<div className="price">
											<span className="price-sale">Entry open</span>
											<span className="price-product">Register</span>
										</div>
									</div>
								</SwiperSlide>
							</Swiper>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
