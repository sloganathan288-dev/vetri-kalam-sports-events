
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
	modules: [Autoplay, Pagination, Navigation],
	slidesPerView: 3,
	spaceBetween: 32,
	loop: true,
}


export default function About2() {
	return (
		<>

			<div className="tf-widget-about-us-v2 background-grey main-content">
				<div className="themeflat-container">
					<div className="tf-about-v2">
						<div className="tf-title-wrap title-small">
							<div className="title-box-v2">
								<span className="sub-title wow fadeInUp animated">About Us</span>
								<h2 className="title-section wow fadeInUp animated">Welcome to VETRI KALAM!</h2>
								<p className="ab-v2 wow fadeInUp animated">VETRI KALAM Sports & Events is a full-service sports
									event management company based in Salem,
									Tamil Nadu — from participant registration,<br />
									ticketing and planning through to event-day operations.</p>
							</div>{/* header style v2 */}
							<img src="images/retinal/Button.png" className="app-logo-run" alt="" />
						</div>
						<Swiper {...swiperOptions} className="swiper image-carousel wow fadeInUp animated">
							<div className="image-about-us swiper-wrapper">
								<SwiperSlide><img className="swiper-slide" src="images/about/run1.jpg" alt="" /></SwiperSlide>
								<SwiperSlide><img className="swiper-slide" src="images/about/run2.jpg" alt="" /></SwiperSlide>
								<SwiperSlide><img className="swiper-slide" src="images/about/run3.jpg" alt="" /></SwiperSlide>
								<SwiperSlide><img className="swiper-slide" src="images/about/run1.jpg" alt="" /></SwiperSlide>
								<SwiperSlide><img className="swiper-slide" src="images/about/run2.jpg" alt="" /></SwiperSlide>
								<SwiperSlide><img className="swiper-slide" src="images/about/run3.jpg" alt="" /></SwiperSlide>
							</div>
						</Swiper>
					</div>
				</div>
			</div>
		</>
	)
}
