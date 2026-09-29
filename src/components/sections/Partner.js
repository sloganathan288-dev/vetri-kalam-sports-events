
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const swiperOptions = {
	modules: [Autoplay, Pagination, Navigation],
	slidesPerView: 3,
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
			slidesPerView: 3,
			spaceBetween: 30,
		},
		991: {
			slidesPerView: 4,
			spaceBetween: 30,
		},
		1199: {
			slidesPerView: 5,
			spaceBetween: 30,
		},
		1350: {
			slidesPerView: 6,
			spaceBetween: 30,
		},
	}
}

export default function Partner() {
	return (
		<>

			<div className="tf-widget-partner background-black">
				<div className="themeflat-container">
					<div className="tf-partner">
						<Swiper {...swiperOptions} className="sologan-logo">
							<SwiperSlide>
								<img className="image-logo" src="images/retinal/slg5.jpg" alt="VETRI KALAM sports event" />
							</SwiperSlide>
							<SwiperSlide>
								<img className="image-logo" src="images/retinal/slg2.jpg" alt="VETRI KALAM sports event" />
							</SwiperSlide>
							<SwiperSlide>
								<img className="image-logo" src="images/retinal/slg3.jpg" alt="VETRI KALAM sports event" />
							</SwiperSlide>
							<SwiperSlide>
								<img className="image-logo" src="images/retinal/slg4.jpg" alt="VETRI KALAM sports event" />
							</SwiperSlide>
							<SwiperSlide>
								<img className="image-logo" src="images/retinal/slg6.jpg" alt="VETRI KALAM sports event" />
							</SwiperSlide>
							<SwiperSlide>
								<img className="image-logo" src="images/retinal/slg1.jpg" alt="VETRI KALAM sports event" />
							</SwiperSlide>
							<SwiperSlide>
								<img className="image-logo" src="images/retinal/slg5.jpg" alt="VETRI KALAM sports event" />
							</SwiperSlide>
							<SwiperSlide>
								<img className="image-logo" src="images/retinal/slg2.jpg" alt="VETRI KALAM sports event" />
							</SwiperSlide>
							<SwiperSlide>
								<img className="image-logo" src="images/retinal/slg3.jpg" alt="VETRI KALAM sports event" />
							</SwiperSlide>
							<SwiperSlide>
								<img className="image-logo" src="images/retinal/slg4.jpg" alt="VETRI KALAM sports event" />
							</SwiperSlide>
							<SwiperSlide>
								<img className="image-logo" src="images/retinal/slg6.jpg" alt="VETRI KALAM sports event" />
							</SwiperSlide>
							<SwiperSlide>
								<img className="image-logo" src="images/retinal/slg1.jpg" alt="VETRI KALAM sports event" />
							</SwiperSlide>
						</Swiper>
					</div>
				</div>
			</div>
		</>
	)
}
