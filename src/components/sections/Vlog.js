
import { Link } from "react-router-dom"

export default function Vlog() {
	return (
		<>

			<div className="tf-widget-vlog-v3 main-content">
				<div className="themeflat-container">
					<div className="tf-blog-v3">
						{/* header style v1 */}
						<div className="title-box center-title-box title-large">
							<span className="sub-title-blog wow fadeInUp animated">Latest News</span>
							<h2 className="title-section wow fadeInUp animated">News & insights</h2>
						</div>{/* header style v1 */}
						<div className="row">
							<div className="col-md-4">
								<div className="item-vlog-v3 wow fadeInUp animated" data-wow-delay="0.1s">
									<div className="image-blog-v3">
										<img src="images/blog/bl-v3.jpg" alt="VETRI KALAM news" />
									</div>
									<div className="content-blog-v3">
										<div className="tag wow fadeInUp animated">
											<ul>
												<li><Link to="/blog">Running</Link></li>
											</ul>
										</div>
										<h5 className="entry-title wow fadeInUp animated"><Link to="/blog-single">Preparing For Your First
											Marathon: A Practical
											Guide To Race Day
											Preparation</Link></h5>
										<div className="entry-meta wow fadeInUp animated">
											<span className="author line">by <Link to="/blog-single">VETRI KALAM Team</Link></span>
											<span className="date line"><Link to="/blog">Salem, Tamil Nadu</Link></span>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-4">
								<div className="item-vlog-v3 wow fadeInUp animated" data-wow-delay="0.3s">
									<div className="image-blog-v3">
										<img src="images/blog/bl-v3-1.jpg" alt="VETRI KALAM news" />
									</div>
									<div className="content-blog-v3">
										<div className="tag wow fadeInUp animated">
											<ul>
												<li><Link to="/blog">Community</Link></li>
											</ul>
										</div>
										<h5 className="entry-title wow fadeInUp animated"><Link to="/blog-single">How Community Sports Bring
											People Together Across
											Salem</Link></h5>
										<div className="entry-meta wow fadeInUp animated">
											<span className="author line">by <Link to="/blog-single">VETRI KALAM Team </Link></span>
											<span className="date line"><Link to="/blog">Salem, Tamil Nadu</Link></span>
										</div>
									</div>
								</div>
							</div>
							<div className="col-md-4">
								<div className="item-vlog-v3 wow fadeInUp animated" data-wow-delay="0.5s">
									<div className="image-blog-v3">
										<img src="images/blog/bl-v3-2.jpg" alt="VETRI KALAM news" />
									</div>
									<div className="content-blog-v3">
										<div className="tag wow fadeInUp animated">
											<ul>
												<li><Link to="/blog">Corporate</Link></li>
											</ul>
										</div>
										<h5 className="entry-title wow fadeInUp animated"><Link to="/blog-single">Corporate Sports Days That
											Build Stronger Teams At
											Work</Link></h5>
										<div className="entry-meta wow fadeInUp animated">
											<span className="author line">by <Link to="/blog-single">VETRI KALAM Team </Link></span>
											<span className="date line"><Link to="/blog">Salem, Tamil Nadu</Link></span>
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
