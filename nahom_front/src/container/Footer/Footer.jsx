import React, { useState } from 'react';

import { images } from '../../constants';
import { AppWrap, MotionWrap } from '../../wrapper';
import './Footer.scss';

const Footer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    website: '',
  });
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { name, email, message } = formData;

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;
    if (!name || !email || !message) {
      setFormError('Please complete all fields before sending your message.');
      return;
    }

    setLoading(true);
    setFormError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            'Contact form is unavailable. Please use the email link.',
          );
        }
        const error = await response
          .json()
          .catch(() => ({ message: 'Unknown error' }));
        throw new Error(error?.message || 'Unable to send your message.');
      }

      setIsFormSubmitted(true);
      setFormError('');
      setFormData({ name: '', email: '', message: '', website: '' });
    } catch (error) {
      setFormError(error.message || 'Unable to send your message right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="head-text">Contact me</h2>

      <div className="app__footer-cards">
        <div className="app__footer-card ">
          <img src={images.email} alt="email" />
          <a href="mailto:d.nahom.aron@gmail.com" className="p-text">
            d.nahom.aron@gmail.com
          </a>
        </div>
        <div className="app__footer-card">
          <img src={images.mobile} alt="phone" />
          <a href="tel:+12405362523" className="p-text">
            +12405362523
          </a>
        </div>
      </div>
      {!isFormSubmitted ? (
        <form
          className="app__footer-form app__flex"
          onSubmit={handleSubmit}
          aria-busy={loading}
        >
          <label className="contact-honeypot" aria-hidden="true">
            Website
            <input
              name="website"
              value={formData.website}
              onChange={handleChangeInput}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>
          <div className="app__flex">
            <input
              className="p-text"
              type="text"
              placeholder="Your Name"
              name="name"
              aria-label="Your name"
              autoComplete="name"
              required
              maxLength={120}
              value={name}
              onChange={handleChangeInput}
              disabled={loading}
            />
          </div>
          <div className="app__flex">
            <input
              className="p-text"
              type="email"
              placeholder="Your Email"
              name="email"
              aria-label="Your email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={handleChangeInput}
              disabled={loading}
            />
          </div>
          <div>
            <textarea
              className="p-text"
              placeholder="Your Message"
              value={message}
              name="message"
              aria-label="Your message"
              required
              minLength={20}
              maxLength={2000}
              onChange={handleChangeInput}
              disabled={loading}
            />
          </div>
          {formError && (
            <p className="app__footer-error" role="alert">
              {formError}
            </p>
          )}
          <button type="submit" className="p-text" disabled={loading}>
            {!loading ? 'Send Message' : 'Sending...'}
          </button>
        </form>
      ) : (
        <div role="status">
          <h3 className="head-text">Thank you for getting in touch!</h3>
        </div>
      )}
    </>
  );
};

export default AppWrap(
  MotionWrap(Footer, 'app__footer'),
  'contact',
  'app__whitebg',
);
