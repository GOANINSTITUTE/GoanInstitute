import React, { useState, useEffect } from "react";
import "../Pages/CSS/Donation.css";
import "bootstrap/dist/css/bootstrap.min.css";
import PageTransition from "../Components/PageTransition";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase-config"; // Adjust path if needed
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const loadRazorpayScript = (src) =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    document.body.appendChild(script);
  });

export default function Donation() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    address: "",
    pincode: "",
    pan: "",
    taxExempt: false,
    updates: false,
    declaration: false,
    amount: 100
  });
  
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleDonate = async (e) => {
    e.preventDefault();
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.city.trim() ||
      !form.address.trim() ||
      !form.pincode.trim() ||
      !form.declaration
    ) {
      alert("Please fill all required fields and accept the declaration.");
      return;
    }

    setLoading(true);
    await loadRazorpayScript("https://checkout.razorpay.com/v1/checkout.js");

    const options = {
      key: "rzp_test_ygQ2ofq8bMB7bW", // <-- Replace with your Razorpay Key ID!
      amount: Number(form.amount) * 100,
      currency: "INR",
      name: "Darvik Foundation",
      description: "One Time Donation",
      image: "/logodarvik.png",
      handler: async function (response) {
        // response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature (if available)
        try {
          await addDoc(collection(db, "donations"), {
            ...form,
            razorpay_payment_id: response.razorpay_payment_id,
            // If you use Razorpay orders, include these:
            razorpay_order_id: response.razorpay_order_id || "",
            razorpay_signature: response.razorpay_signature || "",
            created: serverTimestamp()
          });
          alert("Thank you for your donation! Payment ID: " + response.razorpay_payment_id);
          navigate(`/thank-you?payment_id=${response.razorpay_payment_id}`);
        } catch (err) {
          alert("An error occurred while saving your donation. Please contact us.");
        }
        setLoading(false);
      },
      prefill: {
        name: form.name,
        email: form.email,
        contact: form.phone,
      },
      notes: {
        city: form.city,
        address: form.address,
        pincode: form.pincode,
        pan: form.pan,
        taxExempt: form.taxExempt ? "Yes" : "No",
        updates: form.updates ? "Yes" : "No"
      },
      theme: {
        color: "#0d6efd",
      },
      modal: {
        ondismiss: function() {
          setLoading(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <PageTransition className="donation-page bg-light">
      <section className="donation-section">
        <div className="container py-5">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <h1 className={`display-4 fw-bold text-primary mb-4 ${isVisible ? 'animate-fade-in' : ''}`}>
                Support Our Cause
              </h1>
              <div className="donation-divider mx-auto mb-4"></div>
              <p className="lead text-primary-emphasis">
                Your generous donation helps us continue our mission to make a positive impact in our community
              </p>
            </div>
          </div>
          <div className="row g-4">
            {/* Left: Info & Amount */}
            <div className={`col-lg-6 ${isVisible ? 'animate-fade-in' : ''}`}>
              <div className="card donation-card h-100">
                <div className="card-header donation-card-header">
                  <div className="text-center">
                    <div className="donation-logo-container mb-3">
                      <img src="/logodarvik.png" alt="Darvik Foundation" className="donation-logo" />
                    </div>
                    <h2 className="h4 fw-bold text-primary mb-2">One Time Donation</h2>
                    <p className="text-primary-emphasis fw-semibold">
                      YOU ARE SIGNING UP FOR A ONE TIME DONATION OF
                    </p>
                  </div>
                </div>
                <div className="card-body">
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-primary">Donation Amount (INR)*</label>
                    <div className="input-group">
                      <span className="input-group-text bg-primary text-white fw-bold">₹</span>
                      <input
                        type="number"
                        name="amount"
                        min="1"
                        className="form-control form-control-lg"
                        value={form.amount}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
                    {[100, 500, 1000, 2000, 5000, 10000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, amount }))}
                        className={`btn ${
                          form.amount === amount
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                  <div className="alert alert-info d-flex align-items-start">
                    <div className="flex-shrink-0 me-3">
                      <i className="bi bi-info-circle-fill text-info"></i>
                    </div>
                    <div>
                      <strong>Your payment is Secure</strong><br />
                      <small>
                        As per Indian Income Tax provisions, please provide your Full Name and Complete Address to maximize the impact of your donation. 
                        To claim tax exemption under section 80G, providing PAN is essential.
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right: Donor Details */}
            <div className={`col-lg-6 ${isVisible ? 'animate-fade-in animate-delay-150' : ''}`}>
              <div className="card donation-card h-100">
                <div className="card-header donation-card-header">
                  <h3 className="h4 fw-bold text-primary mb-0">Personal Details</h3>
                </div>
                <div className="card-body">
                  <form onSubmit={handleDonate} autoComplete="off">
                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-primary">Full Name*</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-person-fill text-primary"></i>
                          </span>
                          <input 
                            type="text" 
                            name="name" 
                            className="form-control" 
                            value={form.name} 
                            onChange={handleChange} 
                            required 
                            placeholder="Enter your full name"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-primary">Phone No.*</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-telephone-fill text-primary"></i>
                          </span>
                          <input 
                            type="tel" 
                            name="phone" 
                            className="form-control" 
                            value={form.phone} 
                            onChange={handleChange} 
                            required 
                            placeholder="Enter your phone number"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-primary">Email Address*</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-envelope-fill text-primary"></i>
                          </span>
                          <input 
                            type="email" 
                            name="email" 
                            className="form-control" 
                            value={form.email} 
                            onChange={handleChange} 
                            required 
                            placeholder="Enter your email"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-primary">City*</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-geo-alt-fill text-primary"></i>
                          </span>
                          <input 
                            type="text" 
                            name="city" 
                            className="form-control" 
                            value={form.city} 
                            onChange={handleChange} 
                            required 
                            placeholder="Enter your city"
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <label className="form-label fw-semibold text-primary">Address*</label>
                        <textarea 
                          name="address" 
                          className="form-control" 
                          rows="3"
                          value={form.address} 
                          onChange={handleChange} 
                          required 
                          placeholder="Enter your complete address"
                        ></textarea>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-primary">Pincode*</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-mailbox text-primary"></i>
                          </span>
                          <input 
                            type="text" 
                            name="pincode" 
                            className="form-control" 
                            value={form.pincode} 
                            onChange={handleChange} 
                            required 
                            placeholder="Enter pincode"
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-primary">PAN (Optional)</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-credit-card text-primary"></i>
                          </span>
                          <input 
                            type="text" 
                            name="pan" 
                            className="form-control" 
                            value={form.pan} 
                            onChange={handleChange} 
                            placeholder="Enter PAN for tax exemption"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="form-check mb-3">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          name="taxExempt" 
                          id="taxExempt" 
                          checked={form.taxExempt} 
                          onChange={handleChange} 
                        />
                        <label className="form-check-label text-primary" htmlFor="taxExempt">
                          I want to claim tax exemption under section 80G.
                        </label>
                      </div>
                      <div className="form-check mb-3">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          name="updates" 
                          id="updates" 
                          checked={form.updates} 
                          onChange={handleChange} 
                        />
                        <label className="form-check-label text-primary" htmlFor="updates">
                          Keep me updated by Email and phone.
                        </label>
                      </div>
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          name="declaration" 
                          id="declaration" 
                          checked={form.declaration} 
                          onChange={handleChange} 
                          required 
                        />
                        <label className="form-check-label text-primary fw-medium" htmlFor="declaration">
                          I declare and verify that the information given by me herein is complete, true and correct.*
                        </label>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className={`btn btn-lg w-100 d-flex align-items-center justify-content-center ${
                        loading 
                          ? "btn-secondary" 
                          : "btn-primary donation-btn"
                      }`}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-heart-fill me-2"></i>
                          Donate Now
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
