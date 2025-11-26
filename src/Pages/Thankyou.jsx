import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { db } from "../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../Pages/CSS/ThankYou.css";
import PageTransition from "../Components/PageTransition";
import AnimatedHero from "../Components/AnimatedHero";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function ThankYou() {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const paymentId = search.get("payment_id");
  const certificateRef = useRef();

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(!!paymentId);
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  // Toast state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  // Show initial toast if passed from previous page
  useEffect(() => {
    if (location.state?.toastMessage) {
      setToastMessage(location.state.toastMessage);
      setToastType(location.state.toastType || "success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }
  }, [location.state]);

  // Fetch donation details
  useEffect(() => {
    async function fetchDonation() {
      if (!paymentId) return;
      setLoading(true);
      try {
        const q = query(
          collection(db, "donations"),
          where("razorpay_payment_id", "==", paymentId)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          setDonation(snap.docs[0].data());
        } else {
          setError("Donation record not found.");
        }
      } catch (e) {
        setError("Could not fetch donation details!");
      }
      setLoading(false);
    }
    fetchDonation();
  }, [paymentId]);

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return new Date().toLocaleDateString("en-IN");
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generate PDF certificate
  const downloadCertificate = useCallback(async () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    try {
      const input = certificateRef.current;
      const originalWidth = input.style.width;
      const originalTransform = input.style.transform;

      input.style.width = "900px";
      input.style.transform = "scale(1)";

      const canvas = await html2canvas(input, {
        scale: 5,
        useCORS: true,
        logging: false,
        backgroundColor: "#d6d3d3",
      });

      input.style.width = originalWidth;
      input.style.transform = originalTransform;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a3",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save(`Darvik-Certificate-${paymentId}.pdf`);

      setToastMessage("Certificate downloaded successfully!");
      setToastType("success");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } catch (err) {
      console.error(err);
      setToastMessage("Error generating certificate.");
      setToastType("error");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setIsDownloading(false);
    }
  }, [certificateRef, paymentId]);

  // Automatically download certificate once donation is loaded
  useEffect(() => {
    if (donation) downloadCertificate();
  }, [donation, downloadCertificate]);

  return (
    <PageTransition className="testimonials-page background">
      <AnimatedHero
        title="Thank You for Your Generosity"
        subtitle="Your support makes a meaningful difference"
        className="about-hero"
        overlayColor="rgba(14,77,109,0.15)"
      />

      {showToast && (
        <div className={`custom-toast ${toastType} show`}>
          {toastMessage}
        </div>
      )}

      <div className="thankyou-page">
        <div className="thankyou-card">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p className="text-secondary mt-3">Fetching your donation details...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="alert alert-danger">{error}</div>
              <Link to="/" className="btn btn-primary mt-3">Go Home</Link>
            </div>
          ) : donation ? (
            <>
              <div className="certificate-wrapper">
                <div className="certificate" ref={certificateRef}>
                  <div className="certificate-border">
                    <div className="certificate-header centered-header">
                      <div className="foundation-logo">
                        <img src="/logodarvik.png" alt="Darvik Foundation" />
                        <h2>Certificate of Appreciation</h2>
                      </div>
                      <div className="certificate-date">
                        Issued on: {formatDate(donation.created)}
                      </div>
                    </div>

                    <div className="certificate-body">
                      <div className="presentation-text">This certificate is proudly presented to</div>
                      <div className="donor-name">{donation.name}</div>
                      <div className="donation-details">
                        <p>In recognition of your generous contribution of</p>
                        <div className="donation-amount">₹{donation.amount}</div>
                        <p>towards our mission of building a brighter future.</p>
                        {donation.pan && <p>PAN: {donation.pan}</p>}
                        <p>Tax Exemption: {donation.taxExempt ? "Yes" : "No"}</p>
                      </div>
                      <div className="appreciation-text">
                        Your support enables us to continue our vital work and create lasting positive change in our community.
                      </div>
                    </div>

                    <div className="certificate-footer">
                      <div className="signature">
                        <div>Dhanesh Raveendranath</div>
                        <p>Founder, Darvik Foundation</p>
                      </div>
                      <div className="verification">
                        <p>Verification ID: {paymentId}</p>
                        {donation.razorpay_order_id && <p>Order Reference: {donation.razorpay_order_id}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="donation-info">
                <h3>Your Donation Summary</h3>
                <div className="info-grid">
                  <div className="info-item"><span className="info-label">Amount</span><span className="info-value">₹{donation.amount}</span></div>
                  <div className="info-item"><span className="info-label">Date</span><span className="info-value">{formatDate(donation.created)}</span></div>
                  <div className="info-item"><span className="info-label">Payment Method</span><span className="info-value">Online Payment</span></div>
                  <div className="info-item"><span className="info-label">Status</span><span className="info-value status-completed">Completed</span></div>
                  <div className="info-item"><span className="info-label">PAN</span><span className="info-value">{donation.pan || "N/A"}</span></div>
                </div>
              </div>

              <div className="next-steps">
                <h3>What Happens Next?</h3>
                <div className="steps-container">
                  <div className="step"><div className="step-icon"><i class="bi bi-envelope-arrow-up"></i></div><div className="step-content"><h4>Email Confirmation</h4><p>You will receive a detailed receipt via email within 24 hours.</p></div></div>
                  <div className="step">
  <div className="step-icon"><i class="bi bi-cash-coin"></i></div>
  <div className="step-content">
    <h4>Donation Refund</h4>
    <p>If your donation was made by mistake, you can request a refund within 7 days. Please mail us through the contact page and we will assist you.</p>
  </div>
</div>
                  <div className="step"><div className="step-icon"><i class="bi bi-file-bar-graph"></i></div><div className="step-content"><h4>Impact Report</h4><p>Receive updates on how your donation is making a difference.</p></div></div>
                </div>
              </div>

              <div className="actions">
                <button className="btn btn-primary" onClick={downloadCertificate} disabled={isDownloading}>
                  {isDownloading ? "Downloading..." : "Download Certificate as PDF"}
                </button>
                <Link to="/" className="btn btn-secondary">Return to Home</Link>
                <Link to="/impact" className="btn btn-accent">See Our Impact</Link>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="alert alert-secondary">
                No donation details found. <br />Please contact us if you believe this is an error.
              </div>
              <Link to="/" className="btn btn-primary mt-3">Go Home</Link>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
