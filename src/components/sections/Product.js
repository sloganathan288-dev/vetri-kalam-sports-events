
import { Link } from "react-router-dom"

export default function Product() {
	return (
		<>

			<div className="tf-widget-product main-content background-grey">
				<div className="themeflat-container">
					<div className="tf-product">
						{/* header style v2 */}
						<div className="title-box-v2 title-large center-title-box">
							<h2 className="title-section wow fadeInUp animated">Our services</h2>
						</div>{/* header style v2 */}
						<div className="row">
							<div className="col-12 col-sm-6 col-md-6 col-lg-3">
								<div className="product-item-v1 wow fadeInUp animated" data-wow-delay="0.1s">
									<div className="product-image">
										<img src="images/product/1.jpg" alt="" />
									</div>
									<div className="product-content">
										<h6 className="title-product"><Link to="/event">Running & Marathon Events</Link></h6>
										<div className="category-product"><Link to="/event">VETRI KALAM</Link></div>
										<div className="price">Entry open</div>
									</div>
								</div>
							</div>
							<div className="col-12 col-sm-6 col-md-6 col-lg-3">
								<div className="product-item-v1 wow fadeInUp animated" data-wow-delay="0.3s">
									<div className="product-image">
										<img src="images/product/2.jpg" alt="" />
									</div>
									<div className="product-content">
										<h6 className="title-product"><Link to="/event">Sports Competitions</Link></h6>
										<span className="category-product"><Link to="/event">VETRI KALAM</Link></span>
										<div className="price">
											<span className="price-sale">Entry</span>
											<span className="price-product"> open</span>
											<span className="percent-sale"></span>
										</div>
									</div>
								</div>
							</div>
							<div className="col-12 col-sm-6 col-md-6 col-lg-3">
								<div className="product-item-v1 wow fadeInUp animated" data-wow-delay="0.5s">
									<div className="product-image">
										<img src="images/product/3.jpg" alt="" />
									</div>
									<div className="product-content">
										<h6 className="title-product"><Link to="/event">Corporate Sports Events</Link></h6>
										<span className="category-product"><Link to="/event">VETRI KALAM</Link></span>
										<span className="price">Entry open</span>
									</div>
								</div>
							</div>
							<div className="col-12 col-sm-6 col-md-6 col-lg-3">
								<div className="product-item-v1 wow fadeInUp animated" data-wow-delay="0.7s">
									<div className="product-image">
										<img src="images/product/4.jpg" alt="" />
									</div>
									<div className="product-content">
										<h6 className="title-product"><Link to="/event">Event Registration & Ticketing</Link></h6>
										<span className="category-product"><Link to="/event">VETRI KALAM</Link></span>
										<span className="price">Entry open</span>
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
