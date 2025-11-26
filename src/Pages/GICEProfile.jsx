import React, { useEffect, useRef } from "react";
import PageTransition from "../Components/PageTransition";
import AnimatedHero from "../Components/AnimatedHero";
import GoalsSection from "./Profile/GoalSection";
import TrainSection from "./Profile/TrainSection"
import { FaPenNib, FaUserCheck, FaBrain, FaGlobeAsia } from "react-icons/fa";

import Profilefooter from "./Profile/Profilefooter.jsx";

import {
  FaCheckCircle,
  FaUsers,
  FaLightbulb,
  FaGraduationCap,
  FaSchool,
  FaClock,
} from "react-icons/fa";
import EduServices from "./Profile/EduServices.jsx";
import Operations from "./Profile/Operations.jsx";

const GICEProfile = () => {
  const title = "We Are on a Mission for Literacy & Employability";
  const subtitle = "Transforming Students By:";
  const items = ["Guiding", "Inspiring", "Challenging", "Empowering"];
  const items2 = [
  { label: "Linguistic Competence", icon: <FaPenNib size={40} /> },
  { label: "Personal Competence", icon: <FaUserCheck size={40} /> },
  { label: "Intellectual Competence", icon: <FaBrain size={40} /> },
  { label: "Interpersonal Competence", icon: <FaUsers size={40} /> },
  { label: "Societal Competence", icon: <FaGlobeAsia size={40} /> },
];

  
  return (
    <PageTransition>
      {/* Hero Section */}
      <AnimatedHero
        title="GICE Profile"
        subtitle="A family needs to work as a team, supporting each other's individual aims and aspirations."
        className="services-hero-modern"
        overlayColor="rgba(102,126,234,0.1)"
      />

      <section
        className="mission-section py-5"
        aria-labelledby="mission-heading"
        style={{
          background: "linear-gradient(180deg, var(--primary) 0%, var(--secondary) 100%)",
          color: "#f8fafc",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-md-8">
              <h2
                id="mission-heading"
                className="fw-bold mb-2"
                style={{
                  fontFamily: "'Roboto Slab', serif",
                  fontSize: "1.75rem",
                  color: "var(--bg-light)",
                }}
              >
                {title}
              </h2>

              <p className="lead mb-3" style={{ opacity: 0.9 }}>
                {subtitle}
              </p>

              <ul
                className="list-unstyled"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "0.75rem 1rem",
                  paddingLeft: 0,
                  marginBottom: 0,
                }}
              >
                {items.map((item, i) => (
                  <li
                    key={i}
                    className="d-flex align-items-center p-2 rounded"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.04)",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        display: "inline-flex",
                        width: 36,
                        height: 36,
                        borderRadius: "999px",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                        background: "rgba(255,255,255,0.06)",
                        fontWeight: 700,
                      }}
                    >
                      {item.charAt(0)}
                    </span>
                    <span style={{ fontSize: "1rem" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-12 col-md-4 mt-4 mt-md-0">
              <div
                className="p-3 rounded"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <p style={{ margin: 0, fontSize: "0.95rem", lineHeight: 1.4 }}>
                  For the past eighteen years, we have been at the forefront of
                  Personal Skill Training across multiple states—helping
                  students gain confidence, skills and career readiness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      <section
      className="py-5 fade-in-section"
      style={{
        background: "linear-gradient(180deg, var(--bg-light), var(--bg-back))",
        color: "#f8fafc",
      }}
    >
      <div className="container">
        <h2
          className="fw-bold mb-4 fade-up"
          style={{ fontFamily: "'Roboto Slab', serif", fontSize: "1.9rem" }}
        >
          Our Commitment
        </h2>

        {/* Feature Row */}
        <div className="row gy-4">

          {/* Block 1 */}
          <div className="col-12 d-flex fade-up" style={{ animationDelay: "0.2s" }}>
            <FaCheckCircle className="text-primary" size={32} style={{ marginRight: "15px" }} />
            <p className="text-primary" style={{ lineHeight: "1.6" }}>
              For the past eighteen years, we have been at the forefront of Personal Skill Training in India, operating across more than seven states.
            </p>
          </div>

          {/* Block 2 */}
          <div className="col-12 d-flex fade-up" style={{ animationDelay: "0.35s" }}>
            <FaUsers className="text-primary" size={32} style={{ marginRight: "15px" }} />
            <p className="text-primary" style={{ lineHeight: "1.6" }}>
              Our services help school and college students build professional and social skills, greatly improving their employability.
            </p>
          </div>

          {/* Block 3 */}
          <div className="col-12 d-flex fade-up" style={{ animationDelay: "0.5s" }}>
            <FaLightbulb className="text-primary" size={32} style={{ marginRight: "15px" }} />
            <p className="text-primary" style={{ lineHeight: "1.6" }}>
              Our Skill Development Programs are engaging and activity-based—unlike traditional classroom teaching—focusing on life skills, soft skills, and English development.
            </p>
          </div>

          {/* Block 4 */}
          <div className="col-12 d-flex fade-up" style={{ animationDelay: "0.65s" }}>
            <FaGraduationCap className="text-primary" size={32} style={{ marginRight: "15px" }} />
            <p className="text-primary" style={{ lineHeight: "1.6" }}>
              We offer Interview Training, Placement Programs, counselling, and internships in HR, Marketing, and Training—helping students step confidently into the real world.
            </p>
          </div>

        </div>
      </div>

      {/* Inline Animation CSS */}
      <style>{`
        .fade-in-section {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeIn 1.5s ease-out forwards;
        }

        .fade-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeUp 1.2s ease-out forwards;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
    <GoalsSection />

        
<Operations/>
<EduServices/>


<TrainSection/>

<Profilefooter/>
    </PageTransition>
  );
};

export default GICEProfile;
