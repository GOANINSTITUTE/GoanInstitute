import React from 'react';

function Footer() {
  return (
    <footer
      className="footer-main position-relative"
      style={{
        background: 'linear-gradient(90deg, #0d6efd 60%, #3a86ff 100%)',
        color: '#fff',
        borderTop: 'none',
        paddingTop: '3rem',
        paddingBottom: '1rem',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div className="container">
        <div className="row align-items-center gy-3">
          {/* Logo and foundation info */}
          <div className="col-12 col-md-4 text-center text-md-start mb-2 mb-md-0">
            <img
              src="/logodarvik.png"
              alt="Darvik Foundation Logo"
              style={{ height: 48, marginBottom: 8 }}
            />
            <div className="fw-bold" style={{ fontSize: 18 }}>
              Darvik Foundation
            </div>
            <div style={{ fontSize: 13, opacity: 0.85 }}>
              Empowering communities, nurturing nature, and preserving culture.
            </div>
          </div>

          {/* Contact info */}
          <div className="col-12 col-md-4 text-center mb-2 mb-md-0">
            <div className="mb-2 fw-semibold">Contact</div>
            <div style={{ fontSize: 15 }}>
              <a
                href="mailto:darvikfoundation22@gmail.com"
                style={{ color: '#fff', textDecoration: 'underline dotted', opacity: 0.95 }}
              >
                darvikfoundation22@gmail.com
              </a>
            </div>
            <div style={{ fontSize: 15 }}>
              <a
                href="tel:+919876543210"
                style={{ color: '#fff', textDecoration: 'none', opacity: 0.95 }}
              >
                +91 99466 13508
              </a>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="col-12 col-md-4 text-center text-md-end">
            <div className="mb-2 fw-semibold">Follow Us</div>
            <div className="footer-social d-flex justify-content-center justify-content-md-end gap-3">
              <a
                href="https://facebook.com/darvikfoundation"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                style={{ color: '#fff', fontSize: 22 }}
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="https://twitter.com/darvikfoundation"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                style={{ color: '#fff', fontSize: 22 }}
              >
                <i className="bi bi-twitter"></i>
              </a>
              <a
                href="https://instagram.com/darvikfoundation"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{ color: '#fff', fontSize: 22 }}
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="https://linkedin.com/company/darvikfoundation"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{ color: '#fff', fontSize: 22 }}
              >
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255,255,255,0.15)', margin: '1.5rem 0 1rem 0' }} />

        <div className="row">
          <div className="col-12 text-center" style={{ fontSize: 14, opacity: 0.85 }}>
            &copy; {new Date().getFullYear()} Darvik Foundation. All rights reserved.
            <br />
            <span style={{ fontSize: 13, opacity: 0.8 }}>
              Developed by{' '}
              <a
                href="https://sriramprasadm.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#fff', textDecoration: 'underline', fontWeight: 500 }}
              >
                Mahendran Sriramrasad
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
