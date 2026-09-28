

import { useState } from "react"
import { Link } from "react-router-dom"
import Layout from "../components/layout/Layout"
import { handleSubmit } from "../utils/enquiry"
export default function BlogSingle() {
	const [commentStatus, setCommentStatus] = useState("")

	return (
		<>

			<Layout headerStyle={1} footerStyle={1} breadcrumbTitle="title">
				<div>
					<div className="page-title page-title-blog text-left">
						<div className="themeflat-container">
							<div className="row">
								<div className="col-md-12">
									<div className="page-title-heading">
										<h1 className="title">Blog detail</h1>
									</div>{/* /.page-title-captions */}
									<div className="breadcrumbs">
										<ul>
											<li><Link to="/">Homepage</Link></li>
											<li> <i className="icon-Arrow---Right-2" /></li>
											<li><Link to="/blog">Latest News</Link></li>
										</ul>
									</div>{/* /.breadcrumbs */}
								</div>{/* /.col-md-12 */}
							</div>{/* /.row */}
						</div>{/* /.container */}
					</div>{/* /.page-title */}
					{/* Blog Posts */}
					<section className="main-content blog-content-single">
						<div className="themeflat-container">
							<div className="row">
								<div className="col-md-12 col-lg-9 col-xl-9 col-xxl-9 widget-blog-content">
									<div className="post-wrap">
										<article className="entry format-standard">
											<div className="main-post">
												<div className="tag">
													<ul>
														<li>
															<Link to="/blog">Running</Link>
														</li>
													</ul>
												</div>
												<h2 className="entry-title-single">
													How to Plan a Community Sports Event from Start to Finish
												</h2>
												<div className="entry-meta">
													<span className="author line"><img src="images/blog/Avatar.png" alt="" /><Link to="/blog">by
														VETRI KALAM Team </Link></span>
													<span className="date line"><Link to="/blog">Insights</Link></span>
												</div>{/* /.entry-meta */}
												<div className="entry-content">
													<p className="post">Planning a community sports event starts with a clear goal. Think about
														who you
														want to reach - families, students, corporate teams or regular runners, and choose
														a format that suits them, from a short community run to a full sports festival.
														Then work backwards: set the date, confirm the venue in Salem and open
														registrations, brief the volunteers and build the race-day schedule so that
														every task has an owner before the first participant arrives.</p>
												</div>{/* /.entry-post */}
												<div className="feature-post">
													<div className="entry-image">
														<img src="images/blog/blog-details.jpg" alt="VETRI KALAM news" />
													</div>{/* /.entry-image */}
												</div>{/* /.feature-post */}
												<blockquote className="alignleft">
													<i className="icon-clarity_block-quote-line"> </i>
													<div className="wrap-text">
														<p className="blockqoute-text">
															“A well-planned event is one that participants barely notice - registration,
															route and refreshments simply fall into place, leaving runners free to enjoy
															the day.”</p>
														<span className="whisper">- VETRI KALAM Event Team</span>
													</div>
												</blockquote>
												<div className="content-post-single">
													<h4 className="title-single">Where should you begin?</h4>
													<p className="post">
														Start with the basics: a realistic budget and a date that
														works for your city
														and does not clash with local exams or festivals. Decide which events
														you will run, the distance categories and the age groups, then build a
														simple run sheet
														covering check-in, briefing, the start, hydration points, medical cover and
														the finish, so that every task has an owner on race day.
													</p>
													<p className="post">
														Next, think about the people who will run the day.
														Brief volunteers on registration, route marshalling, hydration points and
														first aid, then give
														each zone a single owner so that small problems are
														solved early
														instead of reaching the participants on event day.
													</p>
												</div>
												<div className="wrap-share">
													<div className="tag">
														<span>Tag:</span>
														<ul>
															<li>
																<Link to="/blog">Race</Link>
															</li>
															<li>
																<Link to="/blog">Running</Link>
															</li>
															<li>
																<Link to="/blog">Gym</Link>
															</li>
														</ul>
													</div>
													<div className="share-post">
														<span>Share</span>
														<ul className="flat-socials">
															<li>
																<a href="#top"><i className="icon-twitter" /></a>
															</li>
															<li>
																<a href="#top"><i className="icon-dribbble" /></a>
															</li>
															<li>
																<a href="#top"><i className="icon-behance" /></a>
															</li>
															<li>
																<a href="#top"><i className="icon-pinterest" /></a>
															</li>
														</ul>
													</div>
												</div>
											</div>{/* /.main-post */}
										</article>
										<nav className="posts-navigation">
											<ul className="nav-links">
												<li className="previous-post">
													<div className="button-navigation prev-button">
														<Link to="/blog-single">Previous</Link>
													</div>
													<div className="title-post"><Link to="/blog-single">Race-Day Checklist: What Every
														Participant Should Prepare</Link></div>
												</li>
												<li className="next-post">
													<div className="button-navigation prev-button">
														<Link to="/blog-single">Next</Link>
													</div>
													<div className="title-post"><Link to="/blog-single">Corporate Sports Days: How to Engage Your
														Team Through Sport</Link></div>
												</li>
											</ul>{/* .nav-links */}
										</nav>
										<div className="comment-post">
											<div className="comment-list-wrap">
												<div className="select-comment">
													<h4 className="comment-title">Comments</h4>
												</div>
<ul className="comment-list">
															<li>
																<article className="comment">
																	<div className="comment-detail">
																		<p className="post comment-body">No comments have been posted on this
																			post yet. Questions or notes for the VETRI KALAM team are welcome -
																			use the form below.</p>
																	</div>
																</article>
															</li>
														</ul>{/* /.comment-list */}
											</div>{/* /.comment-list-wrap */}
											<div id="respond" className="comment-respond">
												<h4 className="comment-title">Leave a Comment</h4>
												<form id="commentform" className="comment-form"
												onSubmit={(event) => handleSubmit(
													event,
													'Comment on a VETRI KALAM news post',
													[['Name', 'author'], ['Email', 'email'], ['Comment', 'comment']],
													setCommentStatus
												)}
											>
													<fieldset className="name-container">
														<input type="text" id="author" placeholder="Your name*" className="tb-my-input" name="author" tabIndex={1} size={32} aria-required="true" required />
													</fieldset>
													<fieldset className="email-container">
														<input type="email" id="email" placeholder="Your email*" className="tb-my-input" name="email" tabIndex={2} size={32} aria-required="true" required />
													</fieldset>
													<fieldset className="message">
														<textarea id="comment-message" name="comment" rows={8} tabIndex={4} placeholder="Your comment*" aria-required="true" required defaultValue="" />
													</fieldset>
													<p className="check">
														<input type="checkbox" name="remember" defaultValue="yes" />
														<span>Save my name and email in this browser for the next time I comment.</span>
													</p>
													<p className="form-submit">
														<button name="submit" type="submit" id="comment-reply" className="submit">Post Comment</button>
													{commentStatus ? <p className="form-status" role="status">{commentStatus}</p> : null}
													</p>
												</form>
											</div>{/* /#respond */}
										</div>{/* /.comment-post */}
									</div>{/* /.post-wrap */}
								</div>{/* /.col-md-9 */}
								<div className="col-md-12 col-lg-3 col-xl-3 col-xxl-3">
									<div className="sidebar">
										<div className="widget widget-text widget-aboutme ">
											<div className="textwidget">
												<div className="profile">
													<div className="imgae-profile">
														<img src="images/blog/profile-blog.png" alt="" />
													</div>
													<div className="content-profile">
														<span>VETRI KALAM Team</span>
														<p>Where Champions Meet</p>
														<button className="flat-button">Follow</button>
													</div>
												</div>
												<p>VETRI KALAM Sports & Events shares practical guides, training tips and
													event updates for runners, teams and organisers across Tamil Nadu.</p>
												<ul className="flat-socials">
													<li>
														<a href="#top"><i className="icon-twitter" /></a>
													</li>
													<li>
														<a href="#top"><i className="icon-dribbble" /></a>
													</li>
													<li>
														<a href="#top"><i className="icon-behance" /></a>
													</li>
													<li>
														<a href="#top"><i className="icon-pinterest" /></a>
													</li>
												</ul>
											</div>{/* /.textwidget */}
										</div>{/* /.widget-text */}
										<div className="widget widget-search">
											<form action="/" id="searchforms" method="get">
												<div>
													<input type="text" id="ss" className="sss" placeholder="Search" />
													<button aria-label="Search" className="wp-element-button" type="submit"><i className="icon-U" /></button>
												</div>
											</form>
										</div>{/* /.widget-search */}
										<div className="widget widget-categories">
											<h5 className="widget-title">Category</h5>
											<ul>
												<li><Link to="/blog"><i className="icon-Arrow---Right-2" />Running<span className="pull-right">1</span></Link></li>
												<li><Link to="/blog"><i className="icon-Arrow---Right-2" />Marathons<span className="pull-right">2</span></Link></li>
												<li><Link to="/blog"><i className="icon-Arrow---Right-2" />Corporate<span className="pull-right">3</span></Link></li>
												<li><Link to="/blog"><i className="icon-Arrow---Right-2" />Community<span className="pull-right">4</span></Link></li>
												<li><Link to="/blog"><i className="icon-Arrow---Right-2" />Registration<span className="pull-right">5</span></Link></li>
											</ul>
										</div>{/* /.widget-categories */}
										<div className="widget widget-tags">
											<h5 className="widget-title">Popular Tags</h5>
											<div className="tag">
												<ul>
													<li>
														<Link to="/blog">Race</Link>
													</li>
													<li>
														<Link to="/blog">Running</Link>
													</li>
													<li>
														<Link to="/blog">Running</Link>
													</li>
													<li>
														<Link to="/blog">Training</Link>
													</li>
													<li>
														<Link to="/blog">Events</Link>
													</li>
												</ul>
											</div>
										</div>{/* /.widget-tags */}
										<div className="widget widget-popular-news">
											<h5 className="widget-title">Recent Posts</h5>
											<ul className="popular-news clearfix">
												<li>
													<div className="thumb">
														<img src="images/blog/post1.jpg" alt="" />
													</div>
													<div className="text">
														<h6>
															<Link to="/blog-single">How to Prepare for Your First
																Marathon</Link>
														</h6>
														<p className="date-popular-news">Insights</p>
													</div>
												</li>
												<li>
													<div className="thumb">
														<img src="images/blog/post2.jpg" alt="" />
													</div>
													<div className="text">
														<h6><Link to="/blog-single">A Step-by-Step Registration Guide for
															Event Organisers</Link></h6>
														<p className="date-popular-news">Insights</p>
													</div>
												</li>
												<li>
													<div className="thumb">
														<img src="images/blog/post3.jpg" alt="" />
													</div>
													<div className="text">
														<h6><Link to="/blog-single">Why Community Sports Bring People
															Together</Link></h6>
														<p className="date-popular-news">Insights</p>
													</div>
												</li>
											</ul>{/* /.popular-news */}
										</div>{/* /.widget-popular-news */}
										<div className="widget widget-form-subscribe">
											<h3>Subscribe For Daily Newsletter</h3>
											<img src="images/blog/subscribe.png" alt="" />
											<form action="/">
												<input type="email" id="email-sb" name="email" placeholder="Your email address" />
												<input type="submit" defaultValue="Follow" />
											</form>
										</div>{/* /.widget-Archive */}
									</div>{/* /.sidebar */}
								</div>{/* /.col-md-3 */}
							</div>{/* /.row */}
							<div className="widget-tf-blog">
								<div className="tf-title-wrap title-small">
									<h2 className="title-blog wow fadeInUp animated">
										Our Blogs
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
															<Link to="/blog-single">Running</Link>
														</li>
													</ul>
												</div>
												<h2 className="entry-title"><Link to="/blog-single">Race-Day Checklist: What Every
													Participant Should
													Prepare</Link>
												</h2>
												<div className="entry-meta">
													<span className="author line"><Link to="/blog-single">by VETRI KALAM Team </Link></span>
													<span className="date line"><Link to="/blog-single">Insights</Link></span>
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
														<li><Link to="/blog-single">Race</Link></li>
													</ul>
												</div>
												<h2 className="entry-title wow fadeInUp animated"><Link to="/blog-single">Corporate Sports Days: How to
													Engage Your Team
													Through Sport and Make
													Every Employee
													Feel Part of It</Link>
												</h2>
												<div className="entry-meta wow fadeInUp animated">
													<span className="author line">by <Link to="/blog-single">VETRI KALAM Team </Link></span>
													<span className="date line"><Link to="/blog-single">Insights</Link></span>
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
														<li><Link to="/blog-single">Running</Link></li>
													</ul>
												</div>
												<h2 className="entry-title wow fadeInUp animated"><Link to="/blog-single">How to Prepare for
													Your First
													Marathon: A Step-by-Step
													Guide</Link>
												</h2>
												<div className="entry-meta wow fadeInUp animated">
													<span className="author line">by <Link to="/blog-single">VETRI KALAM Team </Link></span>
													<span className="date line"><Link to="/blog-single">Insights</Link></span>
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
														<li><Link to="/blog-single">Running</Link></li>
													</ul>
												</div>
												<h2 className="entry-title wow fadeInUp animated"><Link to="/blog-single">Why Community
													Sports Bring People
													Together Across
													Salem</Link>
												</h2>
												<div className="entry-meta wow fadeInUp animated">
													<span className="author line">by <Link to="/blog-single">VETRI KALAM Team</Link></span>
													<span className="date line"><Link to="/blog-single">Insights</Link></span>
												</div>
												<Link className="more-link wow fadeInUp animated" to="/blog-single">Read More</Link>
												{/* /.entry-meta */}
											</div>{/* /.main-post */}
										</article>
									</div>
								</div>
							</div>
						</div>{/* /.container */}
					</section>
				</div>

			</Layout>
		</>
	)
}