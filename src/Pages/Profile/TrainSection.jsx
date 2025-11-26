import { useEffect } from "react";
import {
  FaPenNib,
  FaUserCheck,
  FaBrain,
  FaUsers,
  FaGlobeAsia,
} from "react-icons/fa";

const items = [
  { label: "Linguistic Competence", icon: <FaPenNib size={40} /> },
  { label: "Personal Competence", icon: <FaUserCheck size={40} /> },
  { label: "Intellectual Competence", icon: <FaBrain size={40} /> },
  { label: "Interpersonal Competence", icon: <FaUsers size={40} /> },
  { label: "Societal Competence", icon: <FaGlobeAsia size={40} /> },
];

export default function CompetenceGrid() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    });

    const cards = document.querySelectorAll(".competence-card");
    cards.forEach((card) => observer.observe(card));
  }, []);

  const cardStyle = {
    padding: "25px",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.1)",
    transition: "all 0.6s ease",
    cursor: "pointer",
    opacity: 0,
    transform: "translateY(30px)",
    width: "250px",
  };

  return (
    <section
      style={{
        padding: "60px 20px",
        background: "linear-gradient(180deg, var(--bg-light), var(--bg-back))",
        color: "#ffffff",
      }}
    >
      <div className="text-dark" style={{ maxWidth: "1200px", margin: "auto" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "35px",
            fontSize: "28px",
            fontWeight: "bold",
            letterSpacing: "0.5px",
          }}
        >
          Skills We Build in Students
        </h2>

        {/* --- ROW 1 (Top 3 centered) --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "25px",
            marginBottom: "25px",
            flexWrap: "wrap",
          }}
        >
          {items.slice(0, 3).map((item, index) => (
            <div
              key={index}
              className="competence-card"
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
            >
              <span className="text-accent" style={{ fontSize: "40px" }}>
                {item.icon}
              </span>
              <h4 style={{ marginTop: "10px", fontWeight: "600" }}>
                {item.label}
              </h4>
            </div>
          ))}
        </div>

        {/* --- ROW 2 (Bottom 2 perfectly centered) --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "25px",
            flexWrap: "wrap",
          }}
        >
          {items.slice(3).map((item, index) => (
            <div
              key={index}
              className="competence-card"
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
            >
              <span className="text-accent" style={{ fontSize: "40px" }}>
                {item.icon}
              </span>
              <h4 style={{ marginTop: "10px", fontWeight: "600" }}>
                {item.label}
              </h4>
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: "35px",
            textAlign: "center",
            maxWidth: "800px",
            marginLeft: "auto",
            marginRight: "auto",
            fontSize: "16px",
            opacity: "0.9",
            lineHeight: "1.7",
          }}
        >
          Students learn to use English confidently, clearly, and without
          errors—building communication skills for life.
        </p>
      </div>
    </section>
  );
}
