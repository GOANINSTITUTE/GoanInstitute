import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../Components/CSS/Header.css";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [headerState, setHeaderState] = useState("transparent");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [logoClicked, setLogoClicked] = useState(false);
  const location = useLocation();
  const scrollTimeout = useRef(null);
  const lastScrollY = useRef(0);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "GICE Profile", path: "/profile" },
    { name: "GICE Family", path: "/GICEFamily" },
  
    { name: "Our Testimonials", path: "/testimonials" },
    {
    name: "Programmes & Services",
    path: "/services",
    dropdown: [
      { name: "Regular Skill Development ", path: "/services/regular-skill-development" },
      { name: "Smart Scholar Mission", path: "/services/smart-scholar" },
    ],
  },
    { name: "Career Opportunities", path: "/careers" },
    { name: "Contact", path: "/contact" },
  ];

  // 🔹 Scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
        setHeaderState(currentScrollY > 50 ? "sticky" : "transparent");
        setScrolled(currentScrollY > 50);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 200) {
        setHeaderState("hidden");
      }

      lastScrollY.current = currentScrollY;

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        if (currentScrollY > 200) setHeaderState("hidden");
      }, 3000);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  // 🔹 Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const activeIndex = navItems.findIndex((item) => item.path === location.pathname);
  const currentIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  const getHeaderStyles = () => {
    const baseStyles = {
      left: 0,
      zIndex: 10,
      transition: "background-color 0.3s ease, transform 0.4s ease, opacity 0.4s ease",
    };

    switch (headerState) {
      case "transparent":
        return { ...baseStyles, backgroundColor: "rgba(255, 255, 255, 0)", position: "absolute", transform: "translateY(0)", opacity: 1 };
      case "sticky":
        return { ...baseStyles, backgroundColor: "var(--background)", position: "fixed", top: "40px", transform: "translateY(0)", opacity: 1, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" };
      case "hidden":
        return { ...baseStyles, backgroundColor: "var(--background)", position: "fixed", top: "40px", transform: "translateY(-100%)", opacity: 0 };
      default:
        return baseStyles;
    }
  };

  const getTopHeaderStyles = () => {
    const baseStyles = {
      left: 0,
      zIndex: 11,
      transition: "transform 0.4s ease, opacity 0.4s ease",
      width: "100%",
    };

    switch (headerState) {
      case "transparent":
        return { ...baseStyles, position: "relative", transform: "translateY(0)", opacity: 1 };
      case "sticky":
        return { ...baseStyles, position: "fixed", top: "0", transform: "translateY(0)", opacity: 1 };
      case "hidden":
        return { ...baseStyles, position: "fixed", top: "0", transform: "translateY(-100%)", opacity: 0 };
      default:
        return baseStyles;
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogoClick = () => {
    setLogoClicked(true);
    setTimeout(() => setLogoClicked(false), 500);
  };

  return (
    <>
      {/* 🔹 Top Contact Bar */}
      <div className="bg-dark py-2 text-light d-flex justify-content-between align-items-center px-3 px-md-5 w-100 top-header-top" style={getTopHeaderStyles()}>
        <div className="mx-auto d-flex align-items-center">
          <span className="me-3 cursor-pointer d-none d-md-inline top-hover"><i className="bi bi-telephone-fill me-1 "></i> +91 92077 00930</span>
          <span className="me-3 cursor-pointer d-none d-md-inline top-hover"><i className="bi bi-phone-fill me-1 "></i> +91 6238 818 885</span>
          <span className="me-3 cursor-pointer d-none d-md-inline top-hover">
            <i className="bi bi-envelope-fill me-1 top-hover"></i>{" "}
            <a href="mailto:gicecouncil@gmail.com" className="text-light text-decoration-none top-hover ">gicecouncil@gmail.com</a>
          </span>

          {/* Mobile Icons */}
          <div className="d-flex d-md-none gap-3">
            <a href="tel:+919207700930" className="text-light"><i className="bi bi-telephone-fill top-hover"></i></a>
            <a href="tel:+916238818885" className="text-light"><i className="bi bi-phone-fill top-hover"></i></a>
            <a href="mailto:gicecouncil@gmail.com" className="text-light"><i className="bi bi-envelope-fill top-hover"></i></a>
          </div>
        </div>


        <div className="mx-auto d-flex align-items-center ">
         




          {/* Mobile Icons */}
          <div className="d-flex d-md-none gap-3">
           
            
          </div>
        </div>

      </div>

      {/* 🔹 Navbar */}
      <div
  className="py-3 px-3 px-md-4 d-flex justify-content-between align-items-center text-dark w-100 header-z"
  style={getHeaderStyles()}
>


        {/* ✅ Logo */}
        <div className="logo-container">
          <Link to="/" onClick={handleLogoClick}>
            <img
              src="https://res.cloudinary.com/dcfpgz4x8/image/upload/v1762753746/cropped-Untitled-design-18_zgjahh.png"
              alt="Goan Institute Logo"
              className={`logo-img ${logoClicked ? "pop" : ""}`}
              style={{ height: "100px", width: "auto" }}
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="position-relative d-none d-md-flex gap-4 fw-semibold nav-container mx-auto">
          {navItems.map((item, index) => (
  <div
    key={index}
    className="nav-item-wrapper position-relative"
    onMouseEnter={() => setHoveredIndex(index)}
    onMouseLeave={() => setHoveredIndex(null)}
  >
    <Link
      to={item.path}
      className={`nav-link-item text-decoration-none ${
        location.pathname === item.path ? "active" : ""
      } ${headerState === "sticky" ? "text-dark" : ""}`}
    >
      {item.name}
    </Link>

    {/* Dropdown for desktop */}
    {item.dropdown && (
      <div className={`dropdown-menu-custom ${hoveredIndex === index ? "show" : ""}`}>
        {item.dropdown.map((sub, i) => (
          <Link key={i} to={sub.path} className="dropdown-item-custom">
            {sub.name}
          </Link>
        ))}
      </div>
    )}
  </div>
))}

{currentIndex !== -1 && (
  <div
    className="nav-underline"
    style={{
      transform: `translateX(${currentIndex * 100}%)`,
      width: `${100 / navItems.length}%`,
    }}
  ></div>
)}

        </div>

        {/* Mobile Button */}
<button
  className={`d-md-none btn btn-outline-nav border-0 mobile-menu-btn ${
    isMobileMenuOpen ? "open" : ""
  }`}
  onClick={toggleMobileMenu}
>
  <i className={`bi ${isMobileMenuOpen ? "bi-x" : "bi-list"}`} style={{ fontSize: "1.5rem" }}></i>
</button>

      </div>

      {/* 🔹 Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)} style={{zIndex:"99999999"}}>
        <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
          <div className="mobile-menu-header">
          </div>
          <div className="mobile-nav-items">
            {navItems.map((item, index) => (
  <div key={index}>
    {!item.dropdown ? (
      <Link
        to={item.path}
        className={`mobile-nav-item text-decoration-none ${
          location.pathname === item.path ? "active" : ""
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        {item.name}
      </Link>
    ) : (
      <>
        <div className="mobile-nav-item d-flex justify-content-between align-items-center">
  <Link
    to={item.path}
    className="text-decoration-none"
    onClick={() => setIsMobileMenuOpen(false)}
  >
    {item.name}
  </Link>

  <i
    className={`bi ${hoveredIndex === index ? "bi-chevron-up" : "bi-chevron-down"}`}
    onClick={() => setHoveredIndex(hoveredIndex === index ? null : index)}
    style={{ fontSize: "1.2rem", padding: "8px" }}
  ></i>
</div>


        {hoveredIndex === index && (
          <div className="mobile-submenu">
            {item.dropdown.map((sub, i) => (
              <Link
                key={i}
                to={sub.path}
                className="mobile-submenu-item"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {sub.name}
              </Link>
            ))}
          </div>
        )}
      </>
    )}
  </div>
))}

          </div>
        </div>
      </div>

      {/* ✅ Inline CSS */}
      <style>{`

        .logo-container {
          display: flex;
          align-items: center;
        }

        .logo-img {
          height: 100px;
          width: auto;
          transition: transform 0.3s ease, filter 0.3s ease;
        }

        .logo-img:hover {
          transform: scale(1.05);
          filter: brightness(1.2);
        }

        .pop {
          animation: popAnimation 0.5s ease forwards;
        }

        @keyframes popAnimation {
          0% {
            transform: scale(1);
            filter: brightness(1);
          }
          50% {
            transform: scale(1.3);
            filter: brightness(1.5);
          }
          100% {
            transform: scale(1);
            filter: brightness(1);
          }
        }

        @media (max-width: 768px) {
          .logo-container {
            justify-content: flex-start !important;
          }
          .logo-img {
            height: 55px !important;
          }
          .mobile-menu-btn {
            margin-left: auto;
          }
        }

        .nav-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          height: 40px;
        }

        .nav-link-item {
          color: var(--text-eggshell);
          font-weight: 500;
          position: relative;
          padding-bottom: 4px;
          transition: color 0.3s ease;
          white-space: nowrap;
        }

        .nav-link-item:hover, .nav-link-item.active {
          color: var(--accent);
        }

        .nav-underline {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background-color: var(--accent);
          transition: transform 0.4s ease, width 0.4s ease;
          border-radius: 2px;
        }
/* Before opening (default) */
.mobile-menu-btn i {
  color: white !important;

}

/* After opening */
.mobile-menu-btn.open i {
  color: black !important;
}

        .mobile-menu-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .mobile-menu-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .mobile-menu-content {
          position: absolute;
          top: 0;
          right: 0;
          width: 80%;
          max-width: 300px;
          height: 100%;
          background: white;
          transform: translateX(100%);
          transition: transform 0.3s ease;
          padding: 20px;
          overflow-y: auto;
        }

        .mobile-menu-overlay.active .mobile-menu-content {
          transform: translateX(0);
        }

        .mobile-menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #eee;
        }

        .mobile-nav-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .mobile-nav-item {
          color: var(--text-dark);
          font-weight: 500;
          padding: 0.75rem 0;
          border-bottom: 1px solid #f0f0f0;
          transition: color 0.3s ease;
        }

        .mobile-nav-item:hover,
        .mobile-nav-item.active {
          color: var(--accent);
        }
      `}</style>
    </>
  );
};

export default Header;
