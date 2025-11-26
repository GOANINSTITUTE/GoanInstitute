import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import AnimatedHero from "../Components/AnimatedHero";
import PageTransition from "../Components/PageTransition";

import { Link, useLocation } from "react-router-dom";
// Loader Component
const ModernLoader = () => (
  <div className="text-center py-5">
    <div className="spinner-border text-primary" role="status"></div>
    <p className="mt-3 text-secondary">Loading Services...</p>
  </div>
);

const Services = () => {
  const [services, setServices] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState([]);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch Services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "services"));
        setServices(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Fetch Benefits
  useEffect(() => {
    const fetchBenefits = async () => {
      try {
        const snap = await getDocs(collection(db, "benefits"));
        setBenefits(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching benefits:", error);
      }
    };
    fetchBenefits();
  }, []);

  // Fetch Stats (Optional Section)
  useEffect(() => {
    let mounted = true;

    async function fetchStats() {
      try {
        const snap = await getDoc(doc(db, "stats", "about"));
        if (mounted) setStats(snap.exists() ? snap.data() : {});
      } catch {
        if (mounted) setStats({});
      } finally {
        if (mounted) setStatsLoading(false);
      }
    }

    fetchStats();
    return () => (mounted = false);
  }, []);

  // Animation Fade-in for cards
  useEffect(() => {
    if (loading) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.dataset.index);
          if (entry.isIntersecting && !visibleCards.includes(index)) {
            setVisibleCards((prev) => [...prev, index]);
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll(".service-card").forEach((card) => observer.observe(card));
    document.querySelectorAll(".benefit-card").forEach((card) => observer.observe(card));
    document.querySelectorAll(".smart-card").forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [loading, benefits, visibleCards]);

  return (
    <PageTransition className="services-page">
      {/* Hero Section */}
      <div className="hero-parallax">
        <AnimatedHero
          title="Our Services"
          subtitle="Empowering communities through education, environmental conservation, sustainable agriculture, and cultural preservation."
          className="services-hero"
          overlayColor="rgba(102,126,234,0.1)"
        />
      </div>

      {/* CONTENT START */}
      <section className="py-5 bg-light">
        <div className="container-fluid">

          {/* Header */}
          <div className="text-center mb-5">
            <span className="badge bg-accent text-dark mb-2">Edu. Programmes & Services</span>
            <h2 className="text-dark">
              GICE’s <span className="text-dark">Regular Skill Development Programme</span>
            </h2>
            <p className="text-dark">
              We are on a mission to prepare students for the future by improving their language skills, soft skills, and life skills.
            </p>
          </div>

<div className="d-flex flex-column flex-md-row justify-content-center gap-3 mb-5">

      {/* Button 1 */}
      <Link
        to="/services/regular-skill-development"
        className="btn btn-primary px-5 py-4 fw-semibold"
       
      >
        1. Regular Skill Development
      </Link>

      {/* Button 2 */}
      <Link
        to="/services/smart-scholar"
        className="btn btn-primary px-5 py-4 fw-semibold"
      >
        2. Smart Scholar Mission
      </Link>

    </div>


          {/* Image + At a Glance */}


{/* Main Section */}
<div className="container">
  <div className="row gx-2 mb-5">

    {/* Text */}
    <div className="col-md-8 col-lg-7 text-center text-md-start">
      <h4 className="fw-bold mb-3">
        Skill Development Programme – At a Glance
      </h4>

      <p className="text-muted">
        Our trained in-house faculty works full-time on campus, helping students
        build strong language, soft, and life skills inside and outside the classroom.
      </p>

      <p className="text-muted">
        The programme focuses on personality and behaviour development, blending
        smoothly with the school syllabus.
      </p>

      <p className="text-muted mb-3">
        Every year, the curriculum is updated to keep sessions fresh and engaging.
      </p>
<ul className="list-unstyled mt-3">
  <li className="d-flex align-items-center mb-3 p-2 bg-light rounded-3">
    <i className="bi bi-check2-circle text-primary fs-5 me-3"></i>
    Improve English & soft skills
  </li>

  <li className="d-flex align-items-center mb-3 p-2 bg-light rounded-3">
    <i className="bi bi-check2-circle text-primary fs-5 me-3"></i>
    Activity-based scientific learning
  </li>

  <li className="d-flex align-items-center mb-3 p-2 bg-light rounded-3">
    <i className="bi bi-check2-circle text-primary fs-5 me-3"></i>
    Updated yearly for freshness
  </li>

  <li className="d-flex align-items-center mb-3 p-2 bg-light rounded-3">
    <i className="bi bi-check2-circle text-primary fs-5 me-3"></i>
    Experienced & engaging faculty
  </li>
</ul>

    </div>

  </div>
</div>


{/* Objectives Section */}
<section className="">
  <div className="container">

    <h2
      className="fw-bold text-center mb-3"
      style={{ fontSize: "28px", color: "#1a1a1a" }}
    >
      Objectives of the Programme
    </h2>

    <p
      className="text-center mb-5"
      style={{ maxWidth: "750px", margin: "auto", color: "#555" }}
    >
      These objectives help students grow with confidence while improving their
      communication, personality, and readiness for the future.
    </p>

    <div className="row g-4 justify-content-center">
      {[
        "Improve English proficiency, soft skills, and life skills.",
        "Learn and develop these skills along with regular academics.",
        "Enhance Listening, Speaking, Reading, Writing (LSRW).",
        "Reduce mother tongue influence and improve accent clarity.",
        "Lower inhibitions and build confidence in group & individual tasks.",
        "Promote lifelong learning — training ends, but learning continues.",
      ].map((item, index) => (
        <div
          key={index}
          className="col-12 col-sm-6 col-lg-4 objective-card"
          data-index={index}
        >
          <div
            className="p-4 rounded shadow-sm h-100"
            style={{
              background: "var(--bg-back)",
              border: "1px solid #e6e9ee",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0px 12px 22px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0px 6px 12px rgba(0,0,0,0.06)";
            }}
          >
            <div className="d-flex align-items-start">
              <div
                className="me-3 d-flex align-items-center justify-content-center fw-bold text-primary"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(102, 126, 234, 0.12)",
                  fontSize: "18px",
                }}
              >
                {index + 1}
              </div>

              <p className="fw-semibold mb-0" style={{ color: "#333", fontSize: "15px" }}>
                {item}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

<section
  style={{
    padding: "70px 20px",
    background: "bg-back",
  }}
>
  <div className="container">
    {/* Heading */}
    <h2
      className="fw-bold text-center mb-3"
      style={{ fontSize: "28px", letterSpacing: "0.6px", color: "#1a1a1a" }}
    >
      Why Soft Skills & Life Skills Matter
    </h2>

    <p
      className="text-center mb-5"
      style={{
        maxWidth: "750px",
        margin: "auto",
        fontSize: "16px",
        color: "#444",
        lineHeight: "1.7",
      }}
    >
      Soft skills are not just extra skills — they are essential for success in education, career, and personal life.
    </p>

    {/* Cards */}
    <div className="row g-4 justify-content-center">
      {[
        {
          icon: "bi-graph-up-arrow",
          stat: "85%",
          text: "of job success comes from soft skills (Stanford & Harvard)",
        },
        {
          icon: "bi-hand-thumbs-up-fill",
          stat: "67%",
          text: "of companies prefer strong communicators (Skill Survey)",
        },
        {
          icon: "bi-lightbulb-fill",
          stat: "30–40%",
          text: "of future jobs rely on social-emotional skills (Microsoft)",
        },
      ].map((item, index) => (
        <div key={index} className="col-12 col-md-6 col-lg-4 b">
          <div
            className="text-center p-4 h-100 rounded shadow-sm "
            style={{
              background: "var(--bg-back)",
              border: "1px solid #e6e9ee",
              transition: "0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0px 12px 22px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0px 6px 12px rgba(0,0,0,0.06)";
            }}
          >
            {/* Icon */}
            <i
              className={`bi ${item.icon}`}
              style={{
                fontSize: "38px",
                color: "var(--primary)",
                marginBottom: "12px",
              }}
            ></i>

            {/* Stat */}
            <h3
              className="fw-bold"
              style={{ fontSize: "32px", color: "var(--primary)" }}
            >
              {item.stat}
            </h3>

            {/* Text */}
            <p
              style={{
                marginTop: "10px",
                fontSize: "15px",
                color: "#333",
                lineHeight: "1.6",
              }}
            >
              {item.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

{/* Our Distinction Section */}
<section className="py-5" >
  <div className="container">

    <h2
      className="fw-bold text-center mb-3"
      style={{ fontSize: "28px", color: "#1a1a1a" }}
    >
      Our Distinction
    </h2>

    <p
      className="text-center mb-5"
      style={{ maxWidth: "750px", margin: "auto", color: "#555" }}
    >
      What makes our programme unique and impactful for students and institutions.
    </p>

    <div className="row g-4 justify-content-center">
      {[
        "Well-Structured Curriculum — research-backed & ever-evolving.",
        "Strong Training Methodology — helps students set goals & grow.",
        "Personal Touch — every student is valued equally.",
        "Continuous Evaluation — multiple tools to measure progress.",
        "Activity-Based Learning — high engagement, better results.",
        "Real-World Contextual Learning — preparing students for life.",
      ].map((text, index) => (
        <div key={index} className="col-12 col-sm-6 col-lg-4">
          <div
            className="p-4 rounded shadow-sm h-100 text-center"
            style={{
              background: "var(--bg-light)",
              border: "1px solid #e6e9ee",
              transition: "0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow =
                "0px 12px 22px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0px 6px 12px rgba(0,0,0,0.06)";
            }}
          >
            {/* Circular Number Icon */}
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                backgroundColor: "var(--secondary)",
                color: "white",
                fontWeight: "bold",
                fontSize: "1.2rem",
              }}
            >
              {index + 1}
            </div>

            {/* Text */}
            <p
              className="fw-semibold mb-0"
              style={{ color: "#333", lineHeight: "1.6", fontSize: "15px" }}
            >
              {text}
            </p>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>

{/* Benefits for Students */}
<section className="py-5" >
  <div className="container">

    <h2 className="fw-bold text-center mb-3" style={{ fontSize: "28px", color: "#1a1a1a" }}>
      Benefits for the Students
    </h2>

    <p className="text-center mb-5" style={{ maxWidth: "750px", margin: "auto", color: "#555" }}>
      These benefits help students grow academically, mentally, and socially while building confidence for their future.
    </p>

    <div className="row g-4 justify-content-center">
      {[
        "Enhanced motivation & participation",
        "Improved academic performance",
        "Increased student engagement",
        "Teacher confidence & effectiveness",
        "Stronger school community & reputation",
        "Monthly competitions, prizes & certificates",
        "Course completion certificates",
      ].map((item, index) => (
        <div
          key={index}
          className="col-12 col-sm-6 col-lg-4 benefit-card "
          data-index={index}
        >
          <div
            className="p-4 text-center rounded shadow-sm h-100"
            style={{
              background: "var(--bg-light)",
              border: "1px solid #e6e9ee",
              transition: "0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0px 12px 22px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0px 6px 12px rgba(0,0,0,0.06)";
            }}
          >
            <div
              className="mx-auto mb-3 d-flex align-items-center justify-content-center"
              style={{
                width: "55px",
                height: "55px",
                background: "rgba(102, 126, 234, 0.12)",
                borderRadius: "50%",
              }}
            >
              <i className="bi-check-lg  text-primary"></i>
            </div>

            <p className="fw-semibold mb-0" style={{ color: "#333", fontSize: "15px" }}>
              {item}
            </p>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>


          

          
          {/* What We Do */}
<section 
  style={{
    borderRadius: "10px",
  }}
  className="wow-section "
>
  <div className="container">

    <h2 className="mt-5 mb-4"
      style={{
        fontWeight: "bold",
        fontSize: "26px",
        textAlign: "center",
        marginBottom: "10px",
      }}
    >
      What Do We Do in Schools?
    </h2>

    <p style={{ textAlign: "center", marginBottom: "40px" }}>
      The programme runs from June to March and includes:
    </p>

    <div className="row g-4">

      <div className="col-md-4">
        <div className="service-box text-center p-4 shadow-sm"
          style={{
            background: "var(--bg-light)",
            borderRadius: "12px",
            transition: "0.4s",
          }}
        >
          <i className="bi bi-easel fs-1 text-primary"></i>
          <h5 className="mt-3 fw-bold">Classroom Training</h5>
          <p style={{ fontSize: "14px" }}>
            Activity-based lessons using GICE’s structured curriculum.
          </p>
        </div>
      </div>

      <div className="col-md-4">
        <div className="service-box text-center p-4 shadow-sm"
          style={{
            background: "var(--bg-light)",
            borderRadius: "12px",
            transition: "0.4s",
          }}
        >
          <i className="bi bi-people-fill fs-1 text-primary"></i>
          <h5 className="mt-3 fw-bold">Campus Activities</h5>
          <p style={{ fontSize: "14px" }}>
            Fun linguistic games, public speaking & confidence-boosting tasks.
          </p>
        </div>
      </div>

      <div className="col-md-4">
        <div className="service-box text-center p-4 shadow-sm"
          style={{
            background: "var(--bg-light)",
            borderRadius: "12px",
            transition: "0.4s",
          }}
        >
          <i className="bi bi-bar-chart-line fs-1 text-primary"></i>
          <h5 className="mt-3 fw-bold">Assessment</h5>
          <p style={{ fontSize: "14px" }}>
            Continuous evaluations shared with schools and parents.
          </p>
        </div>
      </div>

    </div>
  </div>

  
</section>















 
          

        </div>
      </section>
    </PageTransition>
  );
};

export default Services;
