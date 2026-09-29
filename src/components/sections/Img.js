
import { Link } from "react-router-dom"

export default function Img() {
	return (
		<>

			<div className="img-client background-grey">
				<div className="themeflat-container">
					<div className="title-box-v2 center-title-box title-large">
						<span className="sub-title wow fadeInUp animated">Our services</span>
						<h2 className="title-section wow fadeInUp animated">Sport is what we organise</h2>
					</div>{/* header style v2 */}
					<div className="logo-partner-about">
						<div className="logo-client">
							<div className="row">
								<div className="col-md-6 col-xxl-3 pd-img">
									<Link to="/event"><img src="images/retinal/svc1.jpg" alt="VETRI KALAM sports event" style={{ width: "100%", height: "100%", objectFit: "cover" }} className="wow zoomIn animated" data-wow-delay="0.1s" /></Link>
								</div>
								<div className="col-md-6 col-xxl-3 pd-img">
									<Link to="/event"><img src="images/retinal/svc2.jpg" alt="VETRI KALAM sports event" style={{ width: "100%", height: "100%", objectFit: "cover" }} className="wow zoomIn animated" data-wow-delay="0.3s" /></Link>
								</div>
								<div className="col-md-6 col-xxl-3 pd-img">
									<Link to="/event"><img src="images/retinal/svc3.jpg" alt="VETRI KALAM sports event" style={{ width: "100%", height: "100%", objectFit: "cover" }} className="wow zoomIn animated" data-wow-delay="0.5s" /></Link>
								</div>
								<div className="col-md-6 col-xxl-3 pd-img">
									<Link to="/event"><img src="images/retinal/svc4.jpg" alt="VETRI KALAM sports event" style={{ width: "100%", height: "100%", objectFit: "cover" }} className="wow zoomIn animated" data-wow-delay="0.7s" /></Link>
								</div>
								<div className="col-md-6 col-xxl-3 pd-img">
									<Link to="/event"><img src="images/retinal/svc5.jpg" alt="VETRI KALAM sports event" style={{ width: "100%", height: "100%", objectFit: "cover" }} className="wow zoomIn animated" data-wow-delay="0.1s" /></Link>
								</div>
								<div className="col-md-6 col-xxl-3 pd-img">
									<Link to="/event"><img src="images/retinal/svc6.jpg" alt="VETRI KALAM sports event" style={{ width: "100%", height: "100%", objectFit: "cover" }} className="wow zoomIn animated" data-wow-delay="0.3s" /></Link>
								</div>
								<div className="col-md-6 col-xxl-3 pd-img">
									<Link to="/event"><img src="images/retinal/svc7.jpg" alt="VETRI KALAM sports event" style={{ width: "100%", height: "100%", objectFit: "cover" }} className="wow zoomIn animated" data-wow-delay="0.5s" /></Link>
								</div>
								<div className="col-md-6 col-xxl-3 pd-img">
									<Link to="/event"><img src="images/retinal/svc8.jpg" alt="VETRI KALAM sports event" style={{ width: "100%", height: "100%", objectFit: "cover" }} className="wow zoomIn animated" data-wow-delay="0.7s" /></Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
