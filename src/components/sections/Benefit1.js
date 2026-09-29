
// import "@/node_modules/react-modal-video/css/modal-video.css"
import { useState } from 'react'
import ModalVideo from 'react-modal-video'
import "../../../node_modules/react-modal-video/css/modal-video.css"

export default function Benefit1() {
	const [isOpen, setOpen] = useState(false)
	return (
		<>

			<div className="tf-widget-benefit background-black">
				<div className="themeflat-container">
					<div className="tf-benefit">
						{/* header style v2 */}
						<div className="title-box-v2 center-title-box title-large">
							<span className="sub-title wow fadeInUp animated">our promise</span>
							<h2 className="title-section wow fadeInUp animated">Why choose VETRI KALAM</h2>
						</div>{/* header style v2 */}
						<div className="benefit-wrap-content">
							<div className="row">
								<div className="col-md-4 benefit-on-left">
									<div className="benefit-item">
										<div className="benefit-content">
											<h6 className="title-benefit wow fadeInLeft animated">
												Running & Marathon Events
											</h6>
											<p className="description-benefit wow fadeInLeft animated">
												Marathon and road-race concepts planned from route design to the finish line.
											</p>
										</div>
										<div className="benefit-number">
											<span className="number wow zoomIn animated">01</span>
										</div>
									</div>
									<div className="benefit-item">
										<div className="benefit-content">
											<h6 className="title-benefit wow fadeInLeft animated">
												Sports Competitions
											</h6>
											<p className="description-benefit wow fadeInLeft animated">
												Tournaments and competitions coordinated for clubs, schools and communities.
											</p>
										</div>
										<div className="benefit-number">
											<span className="number wow zoomIn animated">02</span>
										</div>
									</div>
								</div>
								<div className="col-md-4 benefit-center ">
									<div className="benefit-video">
										<img className="video" src="images/retinal/video.jpg" alt="" />
										<a href="#top" onClick={() => setOpen(true)} className="popup-youtube">
											<i className="icon-play3" />
										</a>
										<img className="shape-video-1" src="images/retinal/Inforgraphic.png" alt="" />
										<img className="shape-video-2" src="images/retinal/Inforgraphic1.png" alt="" />
										<img className="shape-video-3" src="images/retinal/Inforgraphic2.png" alt="" />
										<img className="shape-video-4" src="images/retinal/Inforgraphic3.png" alt="" />
									</div>
								</div>
								<div className="col-md-4 benefit-on-right">
									<div className="benefit-item">
										<div className="benefit-number">
											<span className="number wow zoomIn animated">03</span>
										</div>
										<div className="benefit-content">
											<h6 className="title-benefit wow fadeInRight animated">
												Corporate Sports Events
											</h6>
											<p className="description-benefit wow fadeInRight animated">
												Team-focused sports days shaped around your company and its people.
											</p>
										</div>
									</div>
									<div className="benefit-item">
										<div className="benefit-number">
											<span className="number wow zoomIn animated">04</span>
										</div>
										<div className="benefit-content">
											<h6 className="title-benefit wow fadeInRight animated">
												Community Sports Events</h6>
											<p className="description-benefit wow fadeInRight animated">
												Local sporting initiatives that bring Salem communities together.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<ModalVideo channel='youtube' autoplay isOpen={isOpen} videoId="JXMWOmuR1hU" onClose={() => setOpen(false)} />
		</>
	)
}
