import { useState } from 'react'
import { SERVICES, handleSubmit } from '../../utils/enquiry'

export default function Form2() {
	const [message, setMessage] = useState('')

	return (
		<>

			<div className="tf-widget-form-contact">
				<div className="themeflat-container">
					<div className="tf-form-contact">
						<div className="row">
							<div className="col-md-6 pd-form">
								<div className="map-contact relative">
									<iframe src="https://maps.google.com/maps?q=Salem%2C%20Tamil%20Nadu%2C%20India&z=12&ie=UTF8&iwloc=&output=embed" height={585} style={{ border: 0, width: "100%" }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="VETRI KALAM Sports & Events location - Salem, Tamil Nadu" />
								</div>
							</div>
							<div className="col-md-6 pd-form">
								<div className="form-contact background-black">
									<div className="heading-register">
										<h2 className="title-register">Contact Us</h2>
									</div>
									<div className="list-contact">
										<div className="contact">
											<span> Phone: </span>
											<p className="address"><a href="tel:+918838676284">+91 88386 76284</a></p>
										</div>
										<div className="contact">
											<span> Email: </span>
											<p className="address"><a href="mailto:sloganathan0105@gmail.com">sloganathan0105@gmail.com</a></p>
										</div>
									</div>
									<ul className="social-media">
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
									<div className="form-register">
										<form
											id="registerform"
											className="register-form"
											onSubmit={(event) => handleSubmit(
												event,
												'Event enquiry - VETRI KALAM Sports & Events',
												[['Name', 'author'], ['Email', 'email'], ['Phone', 'telephone'], ['Interested in', 'sex']],
												setMessage
											)}
										>
											<fieldset className="name-container">
												<input type="text" id="author" placeholder="Your name*" className="tb-my-input" name="author" tabIndex={1} size={32} aria-required="true" required />
											</fieldset>
											<fieldset className="email-container">
												<input type="email" id="email" placeholder="Your email*" className="tb-my-input" name="email" tabIndex={2} size={32} aria-required="true" required />
											</fieldset>
											<fieldset className="telephone-container">
												<input type="tel" id="telephone" placeholder="Phone number*" className="tb-my-input" name="telephone" tabIndex={1} size={32} aria-required="true" required />
											</fieldset>
											<fieldset className="sex-container">
												<select name="sex" id="sexs" className="tb-my-input" aria-required="true" required>
													<option value="">Event or service interested in*</option>
													{SERVICES.map((service) => (
														<option key={service.value} value={service.value}>{service.label}</option>
													))}
												</select>
											</fieldset>
											<p className="form-submit">
												<input name="submit" type="submit" id="comment-reply" className="submit-register" defaultValue="Send enquiry" />
											</p>
											{message ? <p className="form-status" role="status">{message}</p> : null}
										</form>
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
