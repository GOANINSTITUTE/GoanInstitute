import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Pages/CSS/Contact.css';

const SmallContact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    const emailKey = `contact_last_${form.email.trim().toLowerCase()}`;
    const lastSent = localStorage.getItem(emailKey);
    const now = Date.now();
    if (lastSent && now - parseInt(lastSent, 10) < 24 * 60 * 60 * 1000) {
      setError('You have already sent a message within 24 hours. Please try again later.');
      return;
    }
    emailjs.send(
      'service_5vu0uz3',        // replace with your EmailJS service ID
      'template_zmompmr',       // replace with your EmailJS template ID
      {
        from_name: form.name,
        from_email: form.email,
        message: form.message,
        email: form.email,
        title: 'Contact Form Request',
      },
      'bWp1_bBj4-hsTtXtQ'     
    )
      .then(() => {
        localStorage.setItem(emailKey, now.toString());
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        setForm({ name: '', email: '', message: '' });
      })
      .catch(() => {
        setError('Failed to send message. Please try again later.');
      });
  };

  return (
    <div className="contact-main-wrapper">
      {/* Left Side (25% desktop / full width mobile) */}
      <div className="contact-left">
        <h4 className='text-dark'>Partner with us to transform ideas into lasting impact.</h4>
        <p>Tell me about your project — I’m all ears.</p>
      </div>

      {/* Right Side (75% desktop / full width mobile) */}
      <div className="contact-right">
        <h4 className="text-center mb-3 text-dark">Get in Touch</h4>

        {submitted ? (
          <div className="alert alert-success text-center" role="alert">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '2rem' }}></i>
            <span className="ms-2">Thank you! We'll get back to you soon.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} autoComplete="off" className="contact-form">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
              className="border-bottom-input"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              className="border-bottom-input"
            />
            <input
              type="text"
              name="message"
              placeholder="Message"
              value={form.message}
              onChange={handleChange}
              required
              className="border-bottom-input accent"
            />
            <button type="submit" className="btn btn-primary submit-button">
              Send
            </button>
            {error && <div className="text-danger text-center mt-2 error-message">{error}</div>}
          </form>
        )}
      </div>
    </div>
  );
};

export default SmallContact;
