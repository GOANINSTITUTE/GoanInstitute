import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { db } from "../firebase-config"; // or wherever your config is
import { collection, query, where, getDocs } from "firebase/firestore";
import "../Pages/CSS/ThankYou.css"; // Import the CSS

export default function ThankYou() {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const paymentId = search.get("payment_id");

  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(!!paymentId);
  const [error, setError] = useState("");

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

  return (
    <div className="container thankyou-container text-center">
      <img src="/logodarvik.png" alt="Darvik Foundation" className="thankyou-logo" />
      <div className="thankyou-content mx-auto">
        <h1 className="display-5 text-success fw-bold mb-3">
          Thank You!
        </h1>
        {loading ? (
          <div>
            <div className="spinner-border text-success" role="status"></div>
            <div className="mt-3">Fetching your donation details...</div>
          </div>
        ) : error ? (
          <>
            <div className="alert alert-warning">{error}</div>
            <Link to="/" className="btn btn-outline-primary mt-3">Go Home</Link>
          </>
        ) : donation ? (
          <>
            <p className="lead mb-3">
              Dear <span className="fw-semibold">{donation.name}</span>,
              <br />
              We have received your donation of 
              <span className="text-primary-emphasis fw-bold ms-1">₹{donation.amount}</span>.
            </p>
            <p>
              <small>
                Payment ID:{" "}
                <span className="fw-bolder">{paymentId}</span>
              </small>
            </p>
            {donation.razorpay_order_id && (
              <p>
                <small>
                  Order ID:{" "}
                  <span className="fw-bolder">{donation.razorpay_order_id}</span>
                </small>
              </p>
            )}
            {donation.pan && (
              <p>
                <small>
                  PAN: <span className="fw-bolder">{donation.pan}</span>
                </small>
              </p>
            )}
            <div className="alert alert-info d-inline-block my-4 text-start">
              <strong>What next?</strong>
              <ul className="mb-0 ps-3 small">
                <li>
                  You will receive an email receipt soon (if email was provided).
                </li>
                <li>
                  If eligible, our team will help you claim your 80G tax benefit.
                </li>
                <li>
                  Thank you for supporting Darvik Foundation's mission!
                </li>
              </ul>
            </div>
            <div className="mt-4 mb-2">
              <Link className="btn btn-success" to="/">Back to Home</Link>
            </div>
          </>
        ) : (
          <div>
            <div className="alert alert-secondary">
              No donation details found.<br />
              Please contact us if you believe this is an error.
            </div>
            <Link to="/" className="btn btn-outline-primary mt-3">Go Home</Link>
          </div>
        )}
      </div>
    </div>
  );
}
