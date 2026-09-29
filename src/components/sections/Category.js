
import { Link } from "react-router-dom"

export default function Category() {
	return (
		<>

			<div className="tf-widget-category-product main-content">
				<div className="themeflat-container">
					<div className="tf-category-product">
						<div className="title-box title-medium center-title-box">
							<h2 className="title-section wow fadeInUp animated">Browse by category</h2>
						</div>
						<div className="tf-product-category style2 columns-5">
							<div className="product-category wow fadeInUp animated" data-wow-delay="0.1s">
								<div className="inner">
									<Link to="/event">
										<div className="category-thumbnail">
											<img src="images/product/categories.jpg" className="img-thumbnail" alt="VETRI KALAM event category" />
										</div>
									</Link>
									<h5 className="category-title">
										<Link to="/event">Marathons & Runs</Link>
									</h5>
								</div>
							</div>
							<div className="product-category wow fadeInUp animated" data-wow-delay="0.3s">
								<div className="inner">
									<Link to="/event">
										<div className="category-thumbnail">
											<img src="images/product/categories1.jpg" className="img-thumbnail" alt="VETRI KALAM event category" />
										</div>
									</Link>
									<h5 className="category-title">
										<Link to="/event">Sports Competitions</Link>
									</h5>
								</div>
							</div>
							<div className="product-category wow fadeInUp animated" data-wow-delay="0.5s">
								<div className="inner">
									<Link to="/event">
										<div className="category-thumbnail">
											<img src="images/product/categories2.jpg" className="img-thumbnail" alt="VETRI KALAM event category" />
										</div>
									</Link>
									<h5 className="category-title">
										<Link to="/event">Corporate Sports</Link>
									</h5>
								</div>
							</div>
							<div className="product-category wow fadeInUp animated" data-wow-delay="0.7s">
								<div className="inner">
									<Link to="/event">
										<div className="category-thumbnail">
											<img src="images/product/categories3.jpg" className="img-thumbnail" alt="VETRI KALAM event category" />
										</div>
									</Link>
									<h5 className="category-title">
										<Link to="/event">Community Sports</Link>
									</h5>
								</div>
							</div>
							<div className="product-category wow fadeInUp animated" data-wow-delay="0.9s">
								<div className="inner">
									<Link to="/register">
										<div className="category-thumbnail">
											<img src="images/product/categories4.jpg" className="img-thumbnail" alt="VETRI KALAM event category" />
										</div>
									</Link>
									<h5 className="category-title">
										<Link to="/register">Registration & Ticketing</Link>
									</h5>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
