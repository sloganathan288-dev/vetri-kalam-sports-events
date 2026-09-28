

import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
	modules: [Autoplay, Pagination, Navigation],
	slidesPerView: 1,
	spaceBetween: 30,
	autoplay: {
		delay: 2500,
		disableOnInteraction: false,
	},
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
	}
}
export default function Testimonial1() {
	return (
		<>

			<div className="tf-widget-testimonial background-black">
				<div className="themeflat-container">
					<div className="tf-testimonial">
						<div className="row">
							<div className="col-md-12 col-lg-7 col-xl-7 col-xxl-7">
								<div className="wow fadeInLeft animated">
									<Swiper {...swiperOptions} className="swiper-testimonial owl-theme" style={{ paddingBottom: '20px' }}>
										<SwiperSlide>
											<div className="tf-testimonial-content">
												<div className="user-info">
													<img className="icon-testimonil" src="images/testimonial/Graphic.png" alt="" />
													<div className="avata">
														<img src="images/testimonial/profile.jpg" alt="" />
													</div>
													<div className="info">
														<h6 className="name">Running &amp; Marathon Events</h6>
														<p className="post">Road races and community runs</p>
													</div>
												</div>
												<div className="content">
													<p className="description">Entries are taken online, and bibs, route marking and hydration are organised by our team from sign-up through to race morning.</p>
												</div>
											</div>
										</SwiperSlide>
										<SwiperSlide>
											<div className="tf-testimonial-content">
												<div className="user-info">
													<img className="icon-testimonil" src="images/testimonial/Graphic.png" alt="" />
													<div className="avata">
														<img src="images/testimonial/profile.jpg" alt="" />
													</div>
													<div className="info">
														<h6 className="name">Corporate Sports Events</h6>
														<p className="post">Team challenges and workplace sport</p>
													</div>
												</div>
												<div className="content">
													<p className="description">Team competitions are planned around your schedule, with entries and on-day coordination handled end to end.</p>
												</div>
											</div>
										</SwiperSlide>
										<SwiperSlide>
											<div className="tf-testimonial-content">
												<div className="user-info">
													<img className="icon-testimonil" src="images/testimonial/Graphic.png" alt="" />
													<div className="avata">
														<img src="images/testimonial/profile.jpg" alt="" />
													</div>
													<div className="info">
														<h6 className="name">Community Sports Events</h6>
														<p className="post">Family-friendly events in Salem</p>
													</div>
												</div>
												<div className="content">
													<p className="description">Categories and timings are set so families and first-time participants know where to be and when.</p>
												</div>
											</div>
										</SwiperSlide>
										<div className="owl-controls">
											<div className="owl-nav">
												<div className="owl-prev h1p">prev</div>
												<div className="owl-next h1n">next</div>
											</div>
										</div>
										{/* <div className="nav">
										<div className="prev h1p">
											<span>‹</span>
										</div>
										<div className="next h1n">
										<span>›</span>
										</div>
										</div> */}
									</Swiper>

								</div>
							</div>
							<div className="col-md-12 col-lg-5 col-xl-5 col-xxl-5">
								<div className="testimonial-wrap">
									<div className="testimonial-box wow fadeInUp animated " data-wow-delay="0.3s">
										<span>
											<svg width={33} height={41} viewBox="0 0 33 41" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M11.891 28.5245C11.8676 28.7817 11.6945 28.9968 11.4467 29.067C10.4646 29.3476 9.66951 29.4364 9.20651 29.876C7.74738 31.265 6.35839 32.7616 5.13777 34.361C3.62251 36.3439 3.41206 37.5365 4.469 38.9489C4.89925 39.5288 4.40352 40.3472 3.70201 40.1788C2.54686 39.9029 1.51799 38.8881 0.456369 37.0782C0.330098 36.863 0.353482 36.5918 0.507813 36.3954C3.2624 32.944 6.26953 29.7685 8.43486 26.0926C9.81449 23.7542 9.78175 20.5974 10.4692 17.8288C10.7966 16.5053 11.0304 15.0087 11.8068 13.9658C14.0797 10.9213 16.6004 8.06847 19.0276 5.13149C19.0323 5.12214 19.0323 5.11279 19.0276 5.10343C17.0681 2.81184 12.8169 2.59203 10.0156 4.6077C9.44503 5.01925 8.49098 5.62255 8.01863 5.45419C8.01395 5.45419 8.01395 5.44951 8.00927 5.44951C7.4808 5.02393 7.42936 4.28501 7.59772 4.07455C8.01395 3.55544 8.66402 3.15792 9.30005 2.9007C10.4458 2.43302 11.6571 2.08695 12.8029 1.68475C16.4367 0.408004 18.2887 0.623133 20.8843 2.33481C23.7231 4.20083 23.854 4.07923 25.4534 1.34335C25.8229 0.711991 26.9547 0.169492 27.7029 0.206905C28.4559 0.244319 29.5128 0.889707 29.8402 1.55848C30.8551 3.63027 28.9376 6.22117 26.5899 6.16973C25.1728 6.13699 24.9858 6.94138 25.4862 7.98429C25.9492 8.9477 26.5899 9.82224 27.2306 10.8558C27.2353 10.8652 27.2446 10.8698 27.254 10.8652C29.0358 10.1964 30.074 8.94302 30.4295 7.03024C30.5137 6.5766 30.8925 5.90315 31.2245 5.84703C31.6174 5.77688 32.2861 6.16505 32.5013 6.54386C32.7024 6.89929 32.6416 7.61483 32.3984 7.97494C31.2806 9.65388 30.1255 11.3141 28.8581 12.8855C27.3428 14.7702 26.7676 14.7234 25.3038 12.8949C24.794 12.2588 24.2843 11.6275 23.7137 10.9213C23.5921 10.7669 23.3629 10.7436 23.2086 10.8652C22.3341 11.5807 21.4876 12.2775 20.3465 13.2129C20.0892 13.4233 20.0378 13.7975 20.2295 14.064C21.6139 16.0049 23.0215 17.941 24.3638 19.9146C24.4526 20.0409 24.5321 20.1718 24.6116 20.3028C25.402 21.6356 24.5555 23.352 23.0262 23.5999C20.8796 23.9413 18.6769 23.9459 16.5256 24.2733C13.0461 24.8018 12.1388 25.7044 11.891 28.5245ZM14.1264 22.6178C14.1217 22.6318 14.1358 22.6505 14.1545 22.6458C15.7726 22.1407 16.9325 21.7806 18.0876 21.4205C18.1858 21.4065 18.1952 20.9201 18.0408 20.8874L15.2067 20.2326C15.015 20.1905 14.8233 20.3028 14.7671 20.4898C14.5707 21.1306 14.407 21.6824 14.1264 22.6178Z" fill="#C3E92D" />
											</svg>
											Race Day
										</span>
										<p className="testimonial">Registration, bibs, routes and hydration are planned in advance so race day runs to a set schedule.</p>
										<div className="shape-testimonial" />
									</div>
									<div className="testimonial-box wow fadeInUp animated " data-wow-delay="0.5s">
										<span>
											<svg width={33} height={41} viewBox="0 0 33 41" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M11.891 28.5245C11.8676 28.7817 11.6945 28.9968 11.4467 29.067C10.4646 29.3476 9.66951 29.4364 9.20651 29.876C7.74738 31.265 6.35839 32.7616 5.13777 34.361C3.62251 36.3439 3.41206 37.5365 4.469 38.9489C4.89925 39.5288 4.40352 40.3472 3.70201 40.1788C2.54686 39.9029 1.51799 38.8881 0.456369 37.0782C0.330098 36.863 0.353482 36.5918 0.507813 36.3954C3.2624 32.944 6.26953 29.7685 8.43486 26.0926C9.81449 23.7542 9.78175 20.5974 10.4692 17.8288C10.7966 16.5053 11.0304 15.0087 11.8068 13.9658C14.0797 10.9213 16.6004 8.06847 19.0276 5.13149C19.0323 5.12214 19.0323 5.11279 19.0276 5.10343C17.0681 2.81184 12.8169 2.59203 10.0156 4.6077C9.44503 5.01925 8.49098 5.62255 8.01863 5.45419C8.01395 5.45419 8.01395 5.44951 8.00927 5.44951C7.4808 5.02393 7.42936 4.28501 7.59772 4.07455C8.01395 3.55544 8.66402 3.15792 9.30005 2.9007C10.4458 2.43302 11.6571 2.08695 12.8029 1.68475C16.4367 0.408004 18.2887 0.623133 20.8843 2.33481C23.7231 4.20083 23.854 4.07923 25.4534 1.34335C25.8229 0.711991 26.9547 0.169492 27.7029 0.206905C28.4559 0.244319 29.5128 0.889707 29.8402 1.55848C30.8551 3.63027 28.9376 6.22117 26.5899 6.16973C25.1728 6.13699 24.9858 6.94138 25.4862 7.98429C25.9492 8.9477 26.5899 9.82224 27.2306 10.8558C27.2353 10.8652 27.2446 10.8698 27.254 10.8652C29.0358 10.1964 30.074 8.94302 30.4295 7.03024C30.5137 6.5766 30.8925 5.90315 31.2245 5.84703C31.6174 5.77688 32.2861 6.16505 32.5013 6.54386C32.7024 6.89929 32.6416 7.61483 32.3984 7.97494C31.2806 9.65388 30.1255 11.3141 28.8581 12.8855C27.3428 14.7702 26.7676 14.7234 25.3038 12.8949C24.794 12.2588 24.2843 11.6275 23.7137 10.9213C23.5921 10.7669 23.3629 10.7436 23.2086 10.8652C22.3341 11.5807 21.4876 12.2775 20.3465 13.2129C20.0892 13.4233 20.0378 13.7975 20.2295 14.064C21.6139 16.0049 23.0215 17.941 24.3638 19.9146C24.4526 20.0409 24.5321 20.1718 24.6116 20.3028C25.402 21.6356 24.5555 23.352 23.0262 23.5999C20.8796 23.9413 18.6769 23.9459 16.5256 24.2733C13.0461 24.8018 12.1388 25.7044 11.891 28.5245ZM14.1264 22.6178C14.1217 22.6318 14.1358 22.6505 14.1545 22.6458C15.7726 22.1407 16.9325 21.7806 18.0876 21.4205C18.1858 21.4065 18.1952 20.9201 18.0408 20.8874L15.2067 20.2326C15.015 20.1905 14.8233 20.3028 14.7671 20.4898C14.5707 21.1306 14.407 21.6824 14.1264 22.6178Z" fill="#C3E92D" />
											</svg>
											Community Fun
										</span>
										<p className="testimonial">Family-friendly categories and clear timings make it easy for first-time participants to take part.</p>
										<div className="shape-testimonial" />
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
