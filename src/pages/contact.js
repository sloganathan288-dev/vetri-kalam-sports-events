

import { useState } from "react"
import { Link } from "react-router-dom"
import Layout from "../components/layout/Layout"
import { handleSubmit } from "../utils/enquiry"

export default function Contact() {
	const [status, setStatus] = useState('')

	return (
		<>

			<Layout headerStyle={1} footerStyle={1} breadcrumbTitle="title">
				<div>
					<div className="page-title page-title-blog">
						<div className="themeflat-container">
							<div className="row">
								<div className="col-md-12">
									<div className="page-title-heading">
										<h1 className="title">Contact Us</h1>
									</div>{/* /.page-title-captions */}
									<div className="breadcrumbs">
										<ul>
											<li><Link to="/">Homepage</Link></li>
											<li><i className="icon-Arrow---Right-2" /></li>
											<li><a>Contact Us</a></li>
										</ul>
									</div>{/* /.breadcrumbs */}
								</div>{/* /.col-md-12 */}
							</div>{/* /.row */}
						</div>{/* /.container */}
					</div>{/* /.page-title */}
					{/* Map Contact us */}
					<div className="map-contact-us">
						<div className="map-contact relative">
							<iframe src="https://maps.google.com/maps?q=Salem%2C%20Tamil%20Nadu%2C%20India&z=12&ie=UTF8&iwloc=&output=embed" height={570} style={{ border: 0, width: "100%" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="VETRI KALAM Sports & Events location - Salem, Tamil Nadu" />
						</div>
					</div>
					{/* Map Contact us */}
					{/* Contact us */}
					<div className="tf-contact-page main-content">
						<div className="themeflat-container">
							<div className="row contact-page">
								<div className="col-md-5">
									<div className="contact-page-content">
										<div className="content-page-title">
											<span className="wow fadeInUp animated">Contact us</span>
											<h2 className="wow fadeInUp animated">Get in touch</h2>
											<p className="post wow fadeInUp animated">Planning an event, looking to register, or interested in
												partnering with us? Send us a message and our
												team will get back to you shortly.</p>
										</div>
										<div className="list-contact-us">
											<div className="inner">
												<span className="wow fadeInUp animated">Phone: </span>
												<h6 className="wow fadeInUp animated"><a href="tel:+918838676284">+91 88386 76284</a></h6>
											</div>
											<div className="inner">
												<span className="wow fadeInUp animated">WhatsApp: </span>
												<h6 className="wow fadeInUp animated">
													<a href="https://wa.me/918838676284" target="_blank" rel="noopener noreferrer">+91 88386 76284</a>
												</h6>
											</div>
											<div className="inner">
												<span className="wow fadeInUp animated">Email:</span>
												<a href="mailto:sloganathan0105@gmail.com" className="wow fadeInUp animated">
													<h6>sloganathan0105@gmail.com</h6>
												</a>
											</div>
											<div className="inner">
												<span className="wow fadeInUp animated">Location:</span>
												<h6 className="wow fadeInUp animated">
													<a href="https://maps.google.com/?q=Salem,+Tamil+Nadu,+India" target="_blank" rel="noopener noreferrer">Salem, Tamil Nadu, India</a>
												</h6>
											</div>
										</div>
										<div className="social-contact">
											<ul className="social-media wow fadeInUp animated">
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
								</div>
								<div className="col-md-7">
									<div className="contact-page-form">
										<form
											id="contactform-page"
											className="contact-page form-submit"
											onSubmit={(event) => handleSubmit(
												event,
												'Event enquiry - VETRI KALAM Sports & Events',
												[['Name', 'name'], ['Email', 'email'], ['Phone', 'phone'], ['Interested in', 'site'], ['Message', 'message']],
												setStatus
											)}
										>
											<div className="text-wrap clearfix">
												<fieldset className="name-wrap">
													<input type="text" id="name" className="tb-my-input" name="name" tabIndex={1} placeholder="Your name*" size={32} aria-required="true" required />
												</fieldset>
												<fieldset className="email-wrap">
													<input type="email" id="email" className="tb-my-input" name="email" tabIndex={2} placeholder="Your email*" size={32} aria-required="true" required />
												</fieldset>
												<fieldset className="phone-wrap">
													<input type="tel" id="phone" className="tb-my-input" name="phone" tabIndex={1} placeholder="Your phone*" size={32} aria-required="true" required />
												</fieldset>
												<fieldset className="age-wrap">
													<input type="text" id="age" className="tb-my-input" name="site" tabIndex={1} placeholder="Event or service interested in*" size={32} aria-required="true" required />
												</fieldset>
											</div>
											<fieldset className="message-wrap">
												<textarea id="comment-message" name="message" rows={3} tabIndex={4} placeholder="Message*" aria-required="true" required defaultValue={""} />
											</fieldset>
											<button name="submit" type="submit" id="comment-reply" className="flat-button btn-submit-comment"><span>Send enquiry</span></button>
											{status ? <p className="form-status" role="status">{status}</p> : null}
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

			</Layout>
		</>
	)
}
