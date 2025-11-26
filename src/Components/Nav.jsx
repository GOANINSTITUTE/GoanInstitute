import "./Nav.css";
import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";

function Nav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const closeDrawer = () => setDrawerOpen(false);
  const openDrawer = () => setDrawerOpen(true);

  // Returns true if the current route matches the given path
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg minimal-navbar fixed-top">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img src="/logodarvik.png" alt="Darvik Foundation" className="navbar-logo" />
            <span className="navbar-brand-name">Darvik Foundation</span>
          </Link>
          <button
            type="button"
            className="navbar-toggler ms-auto"
            aria-label="Open navigation menu"
            onClick={openDrawer}
          >
            <span className="navbar-toggler-icon">
              <div></div>
              <div></div>
              <div></div>
            </span>
          </button>
          <div className="collapse navbar-collapse d-none d-lg-flex" id="navbarCollapse">
            <div className="navbar-nav ms-auto align-items-center">
              <Link to="/"           className={`nav-item nav-link${isActive('/')           ? " active" : ""}`}>Home</Link>
              <Link to="/about"      className={`nav-item nav-link${isActive('/about')      ? " active" : ""}`}>About</Link>
              <Link to="/news"       className={`nav-item nav-link${isActive('/news')       ? " active" : ""}`}>News</Link>
              <Link to="/gallery"    className={`nav-item nav-link${isActive('/gallery')    ? " active" : ""}`}>Gallery</Link>
              <Link to="/services"   className={`nav-item nav-link${isActive('/services')   ? " active" : ""}`}>Services</Link>
              <Link to="/team"       className={`nav-item nav-link${isActive('/team')       ? " active" : ""}`}>Team</Link>
              <Link to="/testimonials" className={`nav-item nav-link${isActive('/testimonials') ? " active" : ""}`}>Testimonials</Link>
              <Link to="/contact"    className={`nav-item nav-link${isActive('/contact')    ? " active" : ""}`}>Contact</Link>
            </div>
          </div>
          {/* Hanging Donate Button */}
          <Link
            to="/donate"
            className="donate-hang-btn d-none d-lg-block"
            style={{
              position: "fixed",
              top: "90px",
              right: "32px",
              zIndex: 1050,
              background: "linear-gradient(90deg,#0d6efd 60%,#3a86ff 100%)",
              color: "#fff",
              borderRadius: "50px",
              boxShadow: "0 4px 24px #0d6efd44",
              padding: "12px 28px",
              fontWeight: 700,
              fontSize: "1.1rem",
              textDecoration: "none",
              transition: "transform 0.2s",
              border: "none"
            }}
          >
            <i className="bi bi-heart-fill me-2"></i> Donate
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`mobile-nav-overlay${drawerOpen ? ' open' : ''}`} onClick={closeDrawer} />
      <nav className={`mobile-nav-drawer${drawerOpen ? ' open' : ''}`} aria-hidden={!drawerOpen}>
        <button className="mobile-nav-close" aria-label="Close navigation menu" onClick={closeDrawer}>
          <span>&times;</span>
        </button>
        <div className="mobile-nav-links">
          <Link to="/"           className={`nav-item nav-link${isActive('/')            ? " active" : ""}`}           onClick={closeDrawer}>Home</Link>
          <Link to="/about"      className={`nav-item nav-link${isActive('/about')       ? " active" : ""}`}           onClick={closeDrawer}>About</Link>
          <Link to="/news"       className={`nav-item nav-link${isActive('/news')        ? " active" : ""}`}           onClick={closeDrawer}>News</Link>
          <Link to="/gallery"    className={`nav-item nav-link${isActive('/gallery')     ? " active" : ""}`}           onClick={closeDrawer}>Gallery</Link>
          <Link to="/services"   className={`nav-item nav-link${isActive('/services')    ? " active" : ""}`}           onClick={closeDrawer}>Services</Link>
          <Link to="/team"       className={`nav-item nav-link${isActive('/team')        ? " active" : ""}`}           onClick={closeDrawer}>Team</Link>
          <Link to="/testimonials" className={`nav-item nav-link${isActive('/testimonials') ? " active" : ""}`}        onClick={closeDrawer}>Testimonials</Link>
          <Link to="/contact"    className={`nav-item nav-link${isActive('/contact')     ? " active" : ""}`}           onClick={closeDrawer}>Contact</Link>
          {/* Donate Button for Mobile */}
          <Link
            to="/donate"
            className="btn btn-primary w-100 mt-3 fw-bold"
            style={{ fontSize: "1.1rem" }}
            onClick={closeDrawer}
          >
            <i className="bi bi-heart-fill me-2"></i> Donate
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Nav;
