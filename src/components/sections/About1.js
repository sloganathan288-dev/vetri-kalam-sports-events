

export default function About1() {
	return (
		<>

			<div className="tf-widget-about-us main-content">
				<div className="themeflat-container">
					<div className="tf-about-us">
						<div className="row">
							<div className="col-md-6 image-wraper">
								<div className="media">
									<div className="media-v1 wow fadeInLeft animated">
										<img className="mask-media" src="images/about/mask1.jpg" alt="" />
										<img className="shape-media" src="images/about/graphic.jpg" alt="" />
									</div>
									<img src="images/about/mask2.jpg" alt="" className="image-gr wow fadeInRight animated" />
									<img src="images/about/Intersect.png" alt="" className="intersect-img" />
								</div>
							</div>
							<div className="col-md-6">
								<div className="about-box">
									<img src="images/about/graphic-box.jpg" alt="" />
									{/* header style v1 */}
									<div className="title-box title-small-v2">
										<span className="sub-title wow fadeInUp animated">Welcome to VETRI KALAM!</span>
										<h2 className="title-section wow fadeInUp animated">Where Champions Meet
										</h2>
									</div>{/* header style v1 */}
									<p className="post wow fadeInUp animated">
										Welcome to VETRI KALAM Sports &amp; Events — a sports and event-management
										organisation based in Salem, Tamil Nadu. We plan and run professional sports
										events, competitions, marathons, corporate sports days and community sporting
										activities, with event registration and participant management handled end to end.
									</p>
									<div className="line" />
									<div className="about-button-group">
										<button className="flat-button wow fadeInUp animated">Find out more</button>
										<div className="infor-about">
											<img src="images/about/info.png" alt="" />
											<div className="info">
												<div className="name wow fadeInUp animated">Loganathan</div>
												<div className="job wow fadeInUp animated">Founder &amp; Event Organizer</div>
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
