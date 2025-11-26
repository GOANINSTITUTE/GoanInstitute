import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Error = () => {
  useEffect(() => {
    // set navbar background when on Error page
    const navbar = document.querySelector(".navbar"); // adjust to your navbar class
    if (navbar) {
      navbar.style.backgroundColor = "var(--primary)";
      navbar.style.color = "var(--text-eggshell)";
    }

    // cleanup: reset when leaving this page
    return () => {
      if (navbar) {
        navbar.style.backgroundColor = "";
        navbar.style.color = "";
      }
    };
  }, []);

  return (
    <div
      className="fade-in"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "var(--background)",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      {/* Error Number */}
      <h1
        style={{
          fontSize: "6rem",
          fontWeight: "bold",
          color: "var(--primary)",
          marginBottom: "1rem",
          letterSpacing: "2px",
          marginTop: "6rem", // keeps it below fixed navbar
        }}
      >
        404
      </h1>

      {/* Error Message */}
      <h2 className="text-secondary" style={{ marginBottom: "1rem" }}>
        Oops! Page not found
      </h2>

      <p
        className="text-dark"
        style={{ maxWidth: "600px", marginBottom: "2rem" }}
      >
        It looks like the page you’re looking for doesn’t exist or has been moved.
        Please check the URL, or return to the homepage.
      </p>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "1rem" }}>
        <Link to="/" className="btn-primary">
          Go Back Home
        </Link>
        <Link to="/contact" className="btn-outline">
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default Error;
