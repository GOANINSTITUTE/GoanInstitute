// src/components/TeamMemberDetails.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import "./CSS/Home.css";

const READ_MORE_CHAR_LIMIT = 600;

export default function TeamMemberDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const member = location.state?.member;

  const [isExpanded, setIsExpanded] = useState(false);
  const [truncatedHTML, setTruncatedHTML] = useState("");
  const [fullHTML, setFullHTML] = useState("");

  // Parse bigParagraph: convert Draft.js raw content JSON to HTML
  useEffect(() => {
    let bigParagraphHTML = "";
    try {
      if (member?.bigParagraph) {
        const contentState = convertFromRaw(JSON.parse(member.bigParagraph));
        bigParagraphHTML = stateToHTML(contentState);
      }
    } catch {
      // fallback: replace line breaks with <br> tags
      bigParagraphHTML = member?.bigParagraph
        ? member.bigParagraph.replace(/\n/g, "<br />")
        : "";
    }
    setFullHTML(bigParagraphHTML);

    // Create truncated version by extracting text and truncating safely
    if (bigParagraphHTML) {
      // Strip HTML tags to get plain text length
      const tmpDiv = document.createElement("div");
      tmpDiv.innerHTML = bigParagraphHTML;
      const plainText = tmpDiv.textContent || tmpDiv.innerText || "";
      if (plainText.length > READ_MORE_CHAR_LIMIT) {
        const truncated = plainText.slice(0, READ_MORE_CHAR_LIMIT) + "...";
        // Convert truncated plain text newlines to <br>
        const truncatedWithBreaks = truncated.replace(/\n/g, "<br />");
        setTruncatedHTML(truncatedWithBreaks);
      } else {
        setTruncatedHTML(bigParagraphHTML);
      }
    } else {
      setTruncatedHTML("");
    }
  }, [member]);

  // Social links: only show if present and valid
  const social = member?.social || {};
  const socialLinks = [
    { key: "facebook", icon: "bi-facebook", color: "#0d6efd" },
    { key: "twitter", icon: "bi-twitter", color: "#1da1f2" },
    { key: "linkedin", icon: "bi-linkedin", color: "#0077b5" },
    { key: "instagram", icon: "bi-instagram", color: "#e1306c" },
  ].filter(
    (link) =>
      social[link.key] && social[link.key].trim() && social[link.key] !== "#"
  );

  // Gallery photos: only show if present and non-empty
  const photos = Array.isArray(member?.photos) ? member.photos.filter(Boolean) : [];

  // YouTube links: support comma separated or array, only show if valid
  let youtubeLinks = [];
  if (member?.youtube) {
    if (Array.isArray(member.youtube)) {
      youtubeLinks = member.youtube.filter(Boolean);
    } else if (typeof member.youtube === "string") {
      youtubeLinks = member.youtube
        .split(",")
        .map((link) => link.trim())
        .filter(Boolean);
    }
  }

  if (!member) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-4">No member data found.</h2>
        <button className="btn btn-primary" onClick={() => navigate("/team")}>
          Go Back
        </button>
      </div>
    );
  }

  // Style for image sticky position, shifted more left on large screens
  const stickyImgStyle =
    window.innerWidth >= 992
      ? {
          position: "sticky",
          top: 100,
          alignSelf: "flex-start",
          zIndex: 2,
          display: "flex",
          flexDirection: "column", // Adjusted to column for stacking
          alignItems: "center",    // Center horizontally
          marginLeft: "-32px", // shift image more to the left
        }
      : undefined;

  return (
    <div
      className="team-details-page bg-light min-vh-100 position-relative"
      style={{ marginTop: "80px" }}
    >
      <div className="container py-5">
        <motion.div
          className="row g-5 justify-content-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {/* Image Section */}
          <motion.div
            className="col-12 col-lg-4 d-flex flex-column align-items-center"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={stickyImgStyle}
          >
            <img
              src={member.img}
              alt={member.name}
              className="shadow mb-3"
              style={{
                width: "100%",
                maxWidth: 400,
                height: "auto",
                objectFit: "cover",
                borderRadius: "2rem",
                border: "6px solid #f3268c",
              }}
            />

            {/* Name and Role for mobile below image */}
            <div className="d-lg-none text-center">
              <h1 className="fw-bold text-primary mb-2" style={{ fontSize: "2rem" }}>
                {member.name}
              </h1>
              <h3
                className="mb-3"
                style={{ color: "#f3268c", fontWeight: 600, fontSize: "1.3rem" }}
              >
                {member.role}
              </h3>
            </div>
          </motion.div>

          {/* Details Content */}
          <motion.div
            className="col-12 col-lg-8"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* Name and role for desktop */}
            <motion.div
              className="mb-4 d-none d-lg-block text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <h1
                className="fw-bold text-primary mb-2"
                style={{ fontSize: "2.8rem" }}
              >
                {member.name}
              </h1>
              <h3 className="mb-3" style={{ color: "#f3268c", fontWeight: 600 }}>
                {member.role}
              </h3>
            </motion.div>

            {/* Rich formatted big paragraph with Read More/Less */}
            <motion.div
              className="fs-4 mb-4"
              style={{ lineHeight: 1.8, maxWidth: "700px", margin: "0 auto", color: "#222" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
            >
              <div
                dangerouslySetInnerHTML={{ __html: isExpanded ? fullHTML : truncatedHTML }}
              />
              {/* Show Read More/Less toggle only if text truncated */}
              {fullHTML && truncatedHTML && fullHTML !== truncatedHTML && (
                <button
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="btn btn-link p-0 mt-2"
                  style={{ fontWeight: "600", color: "#f3268c", cursor: "pointer" }}
                  type="button"
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </button>
              )}
            </motion.div>

            {/* Bio */}
            <motion.div
              className="mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              <span className="badge bg-primary me-2">Bio</span>
              <span className="text-muted fs-5">{member.bio}</span>
            </motion.div>

            {/* Gallery Photos */}
            {photos.length > 0 && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.8 }}
              >
                <h4 className="fw-bold mb-3">Gallery</h4>
                <div className="d-flex flex-wrap gap-3">
                  {photos.map((photo, idx) => (
                    <motion.img
                      key={idx}
                      src={photo}
                      alt={`${member.name} gallery`}
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: "cover",
                        borderRadius: 16,
                        border: "2px solid #eee",
                      }}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.9 + idx * 0.1 }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* YouTube Videos */}
            {youtubeLinks.length > 0 && (
              <motion.div
                className="mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.85 }}
              >
                <h4 className="fw-bold mb-3">Videos</h4>
                <div className="d-flex flex-wrap gap-3">
                  {youtubeLinks.map((yt, idx) => {
                    let videoId = "";
                    try {
                      const url = new URL(yt);
                      if (url.hostname.includes("youtu.be")) {
                        videoId = url.pathname.slice(1);
                      } else if (url.hostname.includes("youtube.com")) {
                        videoId = url.searchParams.get("v");
                      }
                    } catch {
                      const match = yt.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
                      videoId = match ? match[1] : "";
                    }
                    return videoId ? (
                      <iframe
                        key={idx}
                        width="220"
                        height="124"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={`YouTube video ${idx + 1}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ borderRadius: 12, border: "2px solid #eee" }}
                      />
                    ) : null;
                  })}
                </div>
              </motion.div>
            )}

            {/* Social Media Handles */}
            {socialLinks.length > 0 && (
              <motion.div
                className="mb-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 1 }}
              >
                <h5 className="mb-3">Connect with {member.name}</h5>
                <div className="d-flex justify-content-center gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.key}
                      href={social[link.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                    >
                      <i
                        className={`bi ${link.icon}`}
                        style={{
                          fontSize: 32,
                          color: link.color,
                          transition: "transform 0.2s",
                          cursor: "pointer",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.transform = "scale(1.2)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      />
                    </a>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Back Button */}
            <motion.div
              className="d-flex justify-content-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.1 }}
            >
              <button
                className="btn btn-outline-primary px-4 py-2 fw-semibold"
                style={{ cursor: "pointer" }}
                type="button"
                onClick={() => navigate("/team")}
              >
                Back to Team
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background watermark */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          opacity: 0.07,
          background: "url('/logodarvik.png') center/contain no-repeat",
          zIndex: -1,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
