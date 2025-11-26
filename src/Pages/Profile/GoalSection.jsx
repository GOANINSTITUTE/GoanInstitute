import React from "react";
import { FaBullseye, FaCheckCircle } from "react-icons/fa";

const GoalsSection = () => {
  const aims = [
    "To provide value-added training to schools across India.",
    "To provide educational assistance and skill development training to marginalized and underprivileged students.",
    "To influence the youth to develop interpersonal skills, leadership, creativity, discipline, and problem-solving.",
    "To deter students from negative influences such as alcohol, tobacco, drugs, and other addictions.",
  ];

  const objectives = [
    "To provide soft skills life skills and English language training through full- time , offline ,regular program.",
    "To offer free services to government schools through collaborations",
    "To focus on literacy and employability by offering quality training and job opportunities.",
  ];

  return (
    <section
      style={{
        padding: "70px 0",
        background: "linear-gradient(180deg, var(--primary) 0%, var(--secondary) 100%)",
        color: "#f8fafc",
      }}
    >
      <div className="container">
        <h2
          className="fw-bold text-center mb-5 text-eggshell"
          style={{ fontFamily: "'Roboto Slab', serif", fontSize: "2rem" }}
        >
          Our Direction & Purpose
        </h2>

        <div className="row g-4 justify-content-center">

          {/* CARD 1 - AIMS */}
          <div
            className="col-12 col-md-6 fade-card"
            style={{
              animationDelay: "0.2s",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "15px",
                padding: "30px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="hover-card"
            >
              <div className="d-flex align-items-center mb-3">
                <FaBullseye size={38} style={{ marginRight: "12px" }} />
                <h4 className="fw-bold m-0 text-eggshell" style={{ fontSize: "1.4rem" }}>
                  Aims
                </h4>
              </div>

              <ul style={{ paddingLeft: "15px", marginBottom: 0, lineHeight: 1.6 }}>
                {aims.map((item, i) => (
                  <li key={i} style={{ marginBottom: "10px" }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* CARD 2 - OBJECTIVES */}
          <div
            className="col-12 col-md-6 fade-card"
            style={{
              animationDelay: "0.45s",
            }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "15px",
                padding: "30px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="hover-card"
            >
              <div className="d-flex align-items-center mb-3">
                <FaCheckCircle size={38} style={{ marginRight: "12px" }} />
                <h4 className="fw-bold m-0 text-eggshell" style={{ fontSize: "1.4rem" }}>
                  Objectives
                </h4>
              </div>

              <ul style={{ paddingLeft: "15px", marginBottom: 0, lineHeight: 1.6 }}>
                {objectives.map((item, i) => (
                  <li key={i} style={{ marginBottom: "10px" }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Animation + Hover CSS */}
      <style>{`
        .fade-card {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeUp 1.2s ease forwards;
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.25);
        }
      `}</style>
    </section>
  );
};

export default GoalsSection;
