import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import PageTransition from "../Components/PageTransition";
import AnimatedHero from "../Components/AnimatedHero";
import "./CSS/ContactPage.css";

const orgAddress = `Manjooran's estate,
Edappally Junction, Kochi,
Kerala - 682024`;

const HostingerEmail ="goaninstituteinternational@gmail.com";
const orgPhone = "+91 92077 00930";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const emailKey = `contact_last_${form.email.trim().toLowerCase()}`;
    const lastSent = localStorage.getItem(emailKey);
    const now = Date.now();
    if (lastSent && now - parseInt(lastSent, 10) < 24 * 60 * 60 * 1000) {
      setError(
        "You have already sent a message in the last 24 hours. Please try again later."
      );
      return;
    }

    setSending(true);

    emailjs
      .send(
        "service_5vu0uz3",
        "template_zmompmr",
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message,
          email: form.email,
          title: "Contact Form Request",
        },
        "bWp1_bBj4-hsTtXtQ"
      )
      .then(() => {
        localStorage.setItem(emailKey, now.toString());
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        setForm({ name: "", email: "", message: "" });
      })
      .catch(() => {
        setError("Failed to send message. Please try again later.");
      })
      .finally(() => setSending(false));
  };

  return (
    <PageTransition className="contact-page bg-light">
      {/* Hero Section */}
      <AnimatedHero
        title="Contact Us"
        subtitle="For any queries or support, feel free to contact the Goan Institute. Our team is here to assist you with recruitment-related inquiries, job opportunities, academic programmes, and general information. You may reach us by phone or email, or visit our Admin Office at Edappally for further assistance. We are committed to providing all the information you need."
        className="services-hero-modern"
        overlayColor="rgba(102,126,234,0.1)"
      />

      {/* Contact Section */}
      <section className="contact-section py-5">
        <div className="container responsive-padding">
          <div className="row gx-5 gy-4">
            {/* Contact Info */}
            <div className="col-lg-5">
              <div className="card shadow-sm p-4 h-100">
                <h5 className="mb-4 text-secondary">Our Address</h5>
                <pre
                  className="mb-4 fs-6 lh-base text-dark"
                  style={{ whiteSpace: "pre-wrap", fontFamily: "inherit" }}
                >
                  {orgAddress}
                </pre>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-3">
                    <span className="bg-accent rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                      <i className="bi bi-envelope-fill text-secondary fs-4"></i>
                    </span>
                    <a
                      href={`mailto:${HostingerEmail}`}
                      className="text-decoration-none text-dark fw-semibold contact-text"
                    >
                      {HostingerEmail}
                    </a>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="bg-accent rounded-circle circle-md d-inline-flex align-items-center justify-content-center">
                      <i className="bi bi-phone-fill text-secondary fs-4"></i>
                    </span>
                    <a
                      href={`tel:${orgPhone}`}
                      className="text-decoration-none text-dark fw-semibold contact-text"
                    >
                      {orgPhone}
                    </a>
                    
                  </div>

<div className="d-flex align-items-center gap-3">
                    <span className="bg-accent rounded-circle circle-md d-inline-flex align-items-center justify-content-center">
                      <i className="bi bi-telephone-fill text-secondary fs-4"></i>
                    </span>
                    <a
                      href={`tel:${orgPhone}`}
                      className="text-decoration-none text-dark fw-semibold contact-text"
                    >
                      0484 280 1994
                    </a>
                    
                  </div>
                  
                </div>

                {/* Map */}
                <div
                  className="mt-5 position-relative rounded shadow-sm overflow-hidden"
                  style={{ minHeight: 220 }}
                >
                  {mapLoading && (
                    <div
                      className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center bg-white bg-opacity-75"
                      style={{ zIndex: 10 }}
                    >
                      <div
                        className="spinner-border text-primary"
                        style={{ width: 40, height: 40 }}
                        role="status"
                      >
                        <span className="visually-hidden">Loading map...</span>
                      </div>
                    </div>
                  )}
                  <iframe
                    title="Goan Institute Location"
                    src="https://www.google.com/maps?q=Manjooran's%20Estate,%20Edappally%20Junction,%20Kochi,%20Kerala%20682024&output=embed"
                    width="100%"
                    height="220"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    onLoad={() => setMapLoading(false)}
                  ></iframe>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-7">
              <div className="card shadow-sm p-4">
                <h5 className="mb-4 text-secondary">Send Us a Message</h5>
                {submitted ? (
                  <div className="alert alert-success text-center py-5" role="alert">
                    <i className="bi bi-check-circle-fill text-success display-4"></i>
                    <h4 className="mt-3">Thank you for reaching out!</h4>
                    <p>We'll get back to you soon.</p>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="alert alert-danger" role="alert">
                        {error}
                      </div>
                    )}
                    <form onSubmit={handleSubmit} noValidate>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label fw-semibold">
                          Name
                        </label>
                        <input
                          type="text"
                          className="form-control textarea-secondary"
                          id="name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          required
                          disabled={sending}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label fw-semibold">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control textarea-secondary"
                          id="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          required
                          disabled={sending}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="message" className="form-label fw-semibold">
                          Message
                        </label>
                        <textarea
                          className="form-control textarea-secondary"
                          id="message"
                          name="message"
                          rows={6}
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Type your message here..."
                          required
                          disabled={sending}
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="btn-accent"
                        disabled={sending}
                        aria-live="polite"
                        aria-busy={sending}
                      >
                        {sending && (
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                            style={{ animation: "spinner-fade-in 0.4s ease forwards" }}
                          ></span>
                        )}
                        {sending ? "Sending..." : "Send Message"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Contact;
