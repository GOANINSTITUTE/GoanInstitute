import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { convertFromRaw } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import PageTransition from "../Components/PageTransition";
import AnimatedHero from "../Components/AnimatedHero";

const READ_MORE_CHAR_LIMIT = 500;

export default function TeamMemberDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const member = location.state?.member;
  const fromPage = location.state?.from || "team"; // default fallback

  const [isExpanded, setIsExpanded] = useState(false);
  const [truncatedHTML, setTruncatedHTML] = useState("");
  const [fullHTML, setFullHTML] = useState("");

  useEffect(() => {
    let htmlContent = "";
    try {
      if (member?.bigParagraph) {
        const contentState = convertFromRaw(JSON.parse(member.bigParagraph));
        htmlContent = stateToHTML(contentState);
      }
    } catch {
      htmlContent = member?.bigParagraph
        ? member.bigParagraph.replace(/\n/g, "<br />")
        : "";
    }
    setFullHTML(htmlContent);

    if (htmlContent) {
      const tmpDiv = document.createElement("div");
      tmpDiv.innerHTML = htmlContent;
      const plainText = tmpDiv.textContent || tmpDiv.innerText || "";
      const truncated =
        plainText.length > READ_MORE_CHAR_LIMIT
          ? plainText.slice(0, READ_MORE_CHAR_LIMIT) + "..."
          : plainText;
      setTruncatedHTML(truncated.replace(/\n/g, "<br />"));
    }
  }, [member]);

  if (!member) {
    return (
      <div className="container py-5 text-center">
        <h2 className="mb-4">No member data found.</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/team")}
        >
          Go Back
        </button>
      </div>
    );
  }

  const social = member?.social || {};
  const socialLinks = [
    { key: "facebook", icon: "bi-facebook" },
    { key: "twitter", icon: "bi-twitter" },
    { key: "linkedin", icon: "bi-linkedin" },
    { key: "instagram", icon: "bi-instagram" },
  ].filter((link) => social[link.key]);

  const photos = Array.isArray(member?.photos) ? member.photos.filter(Boolean) : [];

  let youtubeLinks = [];
  if (member?.youtube) {
    if (Array.isArray(member.youtube)) {
      youtubeLinks = member.youtube.filter(Boolean);
    } else if (typeof member.youtube === "string") {
      youtubeLinks = member.youtube
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);
    }
  }

  // Compute button text and back destination based on origin
  const backButtonText = fromPage === "about" ? "Back to About" : "Back to Team";
  const backDestination = fromPage === "about" ? "/about" : "/team";

  const handleBack = () => {
    navigate(backDestination);
  };

  return (
    <PageTransition className="team-page bg-light">
      {/* Hero Section */}
      <AnimatedHero className="team-hero" overlayColor="var(--secondary-opaced)">
        <div className="container py-5">
          <div className="d-flex flex-column flex-lg-row align-items-center gap-4">
            {/* Profile Image */}
            <img
              src={member.img}
              alt={member.name}
              style={{
                width: 180,
                height: 180,
                borderRadius: "50%",
                objectFit: "cover",
                border: "4px solid var(--primary)",
              }}
            />

            {/* Name + Role + Bio */}
            <div className="text-center text-lg-start">
              <h1 className="text-accent fw-bold mb-2">{member.name}</h1>
              <h4 className="text-accent bg-primary text-light mb-3 d-inline-block px-3 py-1 rounded">
                {member.role}
              </h4>

              {member.bio && (
                <p className="text-light mt-3 mb-0">
                  <span className="badge bg-primary me-2">Bio</span>
                  {member.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </AnimatedHero>

      <div className="container py-4">
        {/* Description */}
        {fullHTML && (
          <div className="mt-4 text-dark" style={{ lineHeight: 1.7 }}>
            <div
              dangerouslySetInnerHTML={{
                __html: isExpanded ? fullHTML : truncatedHTML,
              }}
            />
            {fullHTML !== truncatedHTML && (
              <button
                className="btn btn-link text-accent p-0 mt-2"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            )}
          </div>
        )}

        {/* Gallery */}
        {photos.length > 0 && (
          <div className="mt-4">
            <h5 className="text-primary mb-3">Gallery</h5>
            <div className="d-flex flex-wrap gap-3">
              {photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`${member.name} gallery`}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "var(--radius-md)",
                    border: "2px solid var(--secondary-light-opaced)",
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* YouTube Videos */}
        {youtubeLinks.length > 0 && (
          <div className="mt-4">
            <h5 className="text-primary mb-3">Videos</h5>
            <div className="d-flex flex-wrap gap-3">
              {youtubeLinks.map((yt, idx) => {
                let videoId = "";
                try {
                  const url = new URL(yt);
                  if (url.hostname.includes("youtu.be")) videoId = url.pathname.slice(1);
                  else if (url.hostname.includes("youtube.com"))
                    videoId = url.searchParams.get("v");
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
                    allowFullScreen
                    style={{
                      borderRadius: "var(--radius-md)",
                      border: "2px solid var(--secondary-light-opaced)",
                    }}
                  />
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <div className="mt-4 text-center">
            <h6 className="mb-2 text-dark-light">Connect with {member.name}</h6>
            <div className="d-flex justify-content-center gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.key}
                  href={social[link.key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary fs-4"
                >
                  <i className={`bi ${link.icon}`} />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-4 text-end">
          <button
            className="btn btn-outline px-4 py-2 fw-semibold"
            style={{ borderColor: "var(--primary)", color: "var(--primary)" }}
            onClick={handleBack}
          >
            {backButtonText}
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
