
import { useState } from "react"
import { Link } from "react-router-dom"

export default function Product2() {
	const [isTab, setIsTab] = useState(1)
	const handleTab = (i) => {
		setIsTab(i)
	}
	return (
		<>

			<div className="tf-widget-product-tab">
				<div className="themeflat-container">
					<div className="tf-product-tab">
						<div className="tab-wrap-product title-small">
							<h2 className="title-section wow fadeInUp animated">Events & Registration</h2>
							<ul className="nav nav-tabs justify-content-end tab-our-product" id="myTab2" role="tablist">
								<li className="nav-item" onClick={() => handleTab(1)}>
									<button className={isTab === 1 ? "nav-link active" : "nav-link"} id="home-tab2" data-bs-toggle="tab" data-bs-target="#home2" type="button" role="tab" aria-controls="home" aria-selected="true">Upcoming Events</button>
								</li>
								<li className="nav-item" onClick={() => handleTab(2)}>
									<button className={isTab === 2 ? "nav-link active" : "nav-link"} id="profile-tab2" data-bs-toggle="tab" data-bs-target="#profile2" type="button" role="tab" aria-controls="profile" aria-selected="false">Popular
										events</button>
								</li>
							</ul>
						</div>
						<div className="tab-content" id="myTabContents">
							<div className={isTab === 1 ? "tab-pane fade show active" : "tab-pane fade"} id="home2" role="tabpanel" aria-labelledby="home-tab2">
								<div className="widget-our-product">
									<div className="our-product-item wow fadeInUp animated" data-wow-delay="0.1s">
										<div className="featured-product">
											<Link to="/event-details" className="product-thumnail">
												<div className="label-product">
													<div className="sale-percent">OPEN</div>
												</div>
												<img className="image-thumnail" src="images/product/5.jpg" alt="VETRI KALAM Marathon" />
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
												<h3 className="product-title">VETRI KALAM Marathon</h3>
											</Link>
											<div className="price">
												<span className="price-sale">Entry open</span>
												<span className="price-product">Register</span>
											</div>
										</div>
									</div>
									<div className="our-product-item wow fadeInUp animated" data-wow-delay="0.3s">
										<div className="featured-product">
											<Link to="/event-details" className="product-thumnail">
												<div className="label-product">
													<div className="sale-percent">OPEN</div>
												</div>
												<img className="image-thumnail" src="images/product/6.jpg" alt="VETRI KALAM Sports Fest" />
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
												<h3 className="product-title">VETRI KALAM Sports Fest</h3>
											</Link>
											<div className="price">
												<span className="price-sale">Entry open</span>
												<span className="price-product">Register</span>
											</div>
										</div>
									</div>
									<div className="our-product-item wow fadeInUp animated" data-wow-delay="0.5s">
										<div className="featured-product">
											<Link to="/event-details" className="product-thumnail">
												<div className="label-product">
													<span className="label-new">NEW</span>
												</div>
												<img className="image-thumnail" src="images/product/7.jpg" alt="Community Run" />
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
												<h3 className="product-title">Community Run</h3>
											</Link>
											<div className="price">
												<span className="price-sale">Entry open</span>
												<span className="price-product">Register</span>
											</div>
										</div>
									</div>
									<div className="our-product-item wow fadeInUp animated" data-wow-delay="0.7s">
										<div className="featured-product">
											<Link to="/event-details" className="product-thumnail">
												<div className="label-product">
													<span className="label-new">NEW</span>
													<div className="sale-percent">OPEN</div>
												</div>
												<img className="image-thumnail" src="images/product/8.jpg" alt="Corporate Sports Challenge" />
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
												<h3 className="product-title">Corporate Sports Challenge</h3>
											</Link>
											<div className="price">
												<span className="price-sale">Entry open</span>
												<span className="price-product">Register</span>
											</div>
										</div>
									</div>
									<div className="our-product-item wow fadeInUp animated" data-wow-delay="0.1s">
										<div className="featured-product">
											<Link to="/event-details" className="product-thumnail">
												<div className="label-product">
													<span className="label-new">NEW</span>
												</div>
												<img className="image-thumnail" src="images/product/9.jpg" alt="Youth Sports Championship" />
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
											<div className="price">Entry open</div>
										</div>
									</div>
									<div className="our-product-item wow fadeInUp animated" data-wow-delay="0.3s">
										<div className="featured-product">
											<Link to="/event" className="product-thumnail">
												<div className="label-product">
													<span className="label-new">NEW</span>
												</div>
												<img className="image-thumnail" src="images/product/10.jpg" alt="Running & Marathon Events" />
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
												<h3 className="product-title">Running & Marathon Events</h3>
											</Link>
											<div className="price">Entry open
											</div>
										</div>
									</div>
									<div className="our-product-item wow fadeInUp animated" data-wow-delay="0.5s">
										<div className="featured-product">
											<Link to="/event" className="product-thumnail">
												<div className="label-product">
													<div className="sale-percent">OPEN</div>
												</div>
												<img className="image-thumnail" src="images/product/11.jpg" alt="Sports Competitions" />
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
									</div>
									<div className="our-product-item wow fadeInUp animated" data-wow-delay="0.7s">
										<div className="featured-product">
											<Link to="/event" className="product-thumnail">
												<div className="label-product">
													<span className="label-new">NEW</span>
												</div>
												<img className="image-thumnail" src="images/product/12.jpg" alt="Corporate Sports Events" />
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
												<h3 className="product-title">Corporate Sports Events</h3>
											</Link>
											<div className="price">
												Entry open
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className={isTab === 2 ? "tab-pane fade show active" : "tab-pane fade"} role="tabpanel" aria-labelledby="profile-tab2">
								<div className="widget-our-product">
									<div className="our-product-item wow fadeInUp animated" data-wow-delay="0.1s">
										<div className="featured-product">
											<Link to="/event" className="product-thumnail">
												<div className="label-product">
													<div className="sale-percent">OPEN</div>
												</div>
												<img className="image-thumnail" src="images/product/5.jpg" alt="Community Sports Events" />
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
												<h3 className="product-title">Community Sports Events</h3>
											</Link>
											<div className="price">
												<span className="price-sale">Entry open</span>
												<span className="price-product">Register</span>
											</div>
										</div>
									</div>
									<div className="our-product-item wow fadeInUp animated" data-wow-delay="0.3s">
										<div className="featured-product">
											<Link to="/event" className="product-thumnail">
												<div className="label-product">
													<div className="sale-percent">OPEN</div>
												</div>
												<img className="image-thumnail" src="images/product/6.jpg" alt="Event Registration & Ticketing" />
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
											<Link to="/event">
												<h3 className="product-title">Event Registration & Ticketing</h3>
											</Link>
											<div className="price">
												<span className="price-sale">Entry open</span>
												<span className="price-product">Register</span>
											</div>
										</div>
									</div>
									<div className="our-product-item wow fadeInUp animated" data-wow-delay="0.5s">
										<div className="featured-product">
											<Link to="/event" className="product-thumnail">
												<div className="label-product">
													<span className="label-new">NEW</span>
												</div>
												<img className="image-thumnail" src="images/product/7.jpg" alt="Sports Event Management" />
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
												<h3 className="product-title">Sports Event Management</h3>
											</Link>
											<div className="price">
												<span className="price-sale">Entry open</span>
												<span className="price-product">Register</span>
											</div>
										</div>
									</div>
									<div className="our-product-item wow fadeInUp animated" data-wow-delay="0.7s">
										<div className="featured-product">
											<Link to="/event-details" className="product-thumnail">
												<div className="label-product">
													<span className="label-new">NEW</span>
													<div className="sale-percent">OPEN</div>
												</div>
												<img className="image-thumnail" src="images/product/8.jpg" alt="VETRI KALAM Marathon" />
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
												<h3 className="product-title">VETRI KALAM Marathon</h3>
											</Link>
											<div className="price">
												<span className="price-sale">Entry open</span>
												<span className="price-product">Register</span>
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
