import React from "react";
import "./CSS/Footer.css";

function Footer() {
  return (
    <footer className="footer-main position-relative">
      <div className="container">
        <div className="row align-items-start gy-4">
          <div className="col-12 col-md-4 text-center text-md-start">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "1rem",
                flexWrap: "wrap",
              }}
            >
              <img
                src="https://res.cloudinary.com/dcfpgz4x8/image/upload/v1762753746/cropped-Untitled-design-18_zgjahh.png"
                alt="GICE Logo"
                style={{
                  height: "70px", // 🔹 slightly bigger logo
                  width: "auto",
                  marginRight: "1rem",
                }}
              />
            </div>

            <p className=""
              style={{
                fontSize: "0.9rem",
                lineHeight: "1.5",
                textAlign: "justify",
              }}
            >
              We are dedicated in leading educational programs and associated
              services that foster the acquisition of knowledge and skills
              crucial for career advancement, lifelong learning, and personal
              growth.
            </p>
          </div>

          {/* ✅ Contact info (Always visible) */}
          <div className="col-12 col-md-4 text-center">
            <div className="mb-2 fw-semibold footer-heading">Contact Us</div>
            <div>
              <a href="tel:+919207700930" className="footer-link">
                +91 92077 00930
              </a>
              ,{" "}
              <a href="tel:+916238818885" className="footer-link">
                0484 280 1994
              </a>
            </div>
            <div className="mt-2">
              
              <a
                href="mailto:gicerecruitment@gmail.com"
                className="footer-link dotted"
              >
                gicerecruitment@gmail.com
              </a>
            </div>
            <div className="mt-2" style={{ fontSize: "0.9rem" }}>
              Manjooran's Estate, Edappally Junction, Kochi, Kerala 682024
            </div>
          </div>

          {/* 🖥️ Quick Menu — show only on desktop */}
          <div className="col-12 col-md-4 text-center text-md-start d-none d-md-block">
            <div className="mb-2 fw-semibold footer-heading">Quick Menu</div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                lineHeight: "1.8",
                fontSize: "0.95rem",
              }}
            >
              <li><a href="/" className="footer-link">Home</a></li>
              <li><a href="/GICEFamily" className="footer-link">GICE Family</a></li>
              <li><a href="/profile" className="footer-link">GICE Profile</a></li>
              <li><a href="/testimonials" className="footer-link">Testimonials</a></li>
              <li><a href="/services" className="footer-link">Services</a></li>
              <li><a href="/career" className="footer-link">Career</a></li>
              <li><a href="/contact" className="footer-link">Contact</a></li>
            </ul>
          </div>
        </div>

        <hr className="footer-divider d-none d-md-block" />

        {/* 🖥️ Social links — desktop only */}
        <div className="row d-none d-md-flex">
          <div className="col-12 text-center footer-bottom">
            <div className="mb-2 fw-semibold footer-heading">Follow Us</div>
            <div className="footer-social d-flex justify-content-center gap-3 mb-3">
              <a href="https://www.facebook.com/goaninstitute/" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://www.instagram.com/goaninstitute_gice/reels/" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://www.youtube.com/channel/UCwBWV0coL2aoPZ6uLj2Mrfw" target="_blank" rel="noopener noreferrer">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
            <p className="mb-0" style={{ fontSize: "0.9rem" }}>
              Copyright © 2025 <strong>GOAN INSTITUTE</strong> - All Rights Reserved.
            </p>
          </div>
        </div>

        {/* 📱 Simple copyright for mobile */}
        <div className="text-center d-md-none mt-3" style={{ fontSize: "0.8rem" }}>
          © 2025 <strong>GOAN INSTITUTE</strong>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
