
import { Link } from "react-router-dom"

export default function Blog() {
	return (
		<>

			<div className="tf-widget-blog main-content">
				<div className="themeflat-container">
					<div className="widget-tf-blog">
						<div className="tf-title-wrap title-small">
							<h2 className="title-blog wow fadeInUp animated">
								News & Guides
							</h2>
							<Link to="/blog" className="view-more wow fadeInUp animated">View all
								<svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<g clipPath="url(#clip0_6718_7111)">
										<path d="M5.25 4.5L12.75 12L5.25 19.5" stroke="#121212" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
										<path d="M12.75 4.5L20.25 12L12.75 19.5" stroke="#121212" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
									</g>
								</svg>
							</Link>
						</div>
						<div className="row">
							<div className="col-md-12 col-lg-6 col-xl-6 col-xxl-6 widget-blog-left">
								<article className="entry-widget-blog format-standard wow fadeInLeft animated">
									<div className="feature-post">
										<img src="images/blog/post-widget1.jpg" alt="" />
									</div>{/* /.feature-post */}
									<div className="main-post">
										<div className="tag">
											<ul>
												<li>
													<Link to="/blog-single">Race Guide</Link>
												</li>
											</ul>
										</div>
										<h2 className="entry-title"><Link to="/blog-single">How to Prepare for Your First 10K:
											Training, Gear and
											Race-Morning Basics</Link>
										</h2>
										<div className="entry-meta">
											<span className="author line"><Link to="/blog-single">by VETRI KALAM Team</Link></span>
											<span className="date line"><Link to="/blog-single">Guide</Link></span>
										</div>
										<Link className="more-link" to="/blog-single">Read More</Link>
										{/* /.entry-meta */}
									</div>{/* /.main-post */}
								</article>
							</div>
							<div className="col-md-12 col-lg-6 col-xl-6 col-xxl-6 widget-blog-right">
								<article className="entry-item format-standard">
									<div className="feature-post">
										<img src="images/blog/post-widget2.jpg" alt="" />
									</div>{/* /.feature-post */}
									<div className="main-post">
										<div className="tag wow fadeInUp animated">
											<ul>
												<li><Link to="/blog-single">Community</Link></li>
											</ul>
										</div>
										<h2 className="entry-title wow fadeInUp animated"><Link to="/blog-single">Community Sports Events: How
											Local Neighbourhoods
											Come Together for
											Active Days
											</Link>
										</h2>
										<div className="entry-meta wow fadeInUp animated">
											<span className="author line">by <Link to="/blog-single">VETRI KALAM Team</Link></span>
											<span className="date line"><Link to="/blog-single">Guide</Link></span>
										</div>
										<Link className="more-link wow fadeInUp animated" to="/blog-single">Read More</Link>
										{/* /.entry-meta */}
									</div>{/* /.main-post */}
								</article>
								<article className="entry-item format-standard">
									<div className="feature-post">
										<img src="images/blog/post-widget3.jpg" alt="" />
									</div>{/* /.feature-post */}
									<div className="main-post">
										<div className="tag wow fadeInUp animated">
											<ul>
												<li><Link to="/blog-single">Corporate</Link></li>
											</ul>
										</div>
										<h2 className="entry-title wow fadeInUp animated"><Link to="/blog-single">Corporate Sports Day Planning: A
											Step-by-Step Guide for
											Teams and
											Organisers</Link>
										</h2>
										<div className="entry-meta wow fadeInUp animated">
											<span className="author line">by <Link to="/blog-single">VETRI KALAM Team</Link></span>
											<span className="date line"><Link to="/blog-single">Guide</Link></span>
										</div>
										<Link className="more-link wow fadeInUp animated" to="/blog-single">Read More</Link>
										{/* /.entry-meta */}
									</div>{/* /.main-post */}
								</article>
								<article className="entry-item format-standard">
									<div className="feature-post">
										<img src="images/blog/post-widget4.jpg" alt="" />
									</div>{/* /.feature-post */}
									<div className="main-post">
										<div className="tag wow fadeInUp animated">
											<ul>
												<li><Link to="/blog-single">Registration</Link></li>
											</ul>
										</div>
										<h2 className="entry-title wow fadeInUp animated"><Link to="/blog-single">Event Registration Made Simple:
											A Guide for
											Participants and
											Organisers</Link>
										</h2>
										<div className="entry-meta wow fadeInUp animated">
											<span className="author line">by <Link to="/blog-single">VETRI KALAM Team</Link></span>
											<span className="date line"><Link to="/blog-single">Guide</Link></span>
										</div>
										<Link className="more-link wow fadeInUp animated" to="/blog-single">Read More</Link>
										{/* /.entry-meta */}
									</div>{/* /.main-post */}
								</article>
							</div>
						</div>
					</div>
				</div>{/* widge blog */}
			</div>
		</>
	)
}
