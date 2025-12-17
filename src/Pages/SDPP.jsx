import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import PageTransition from "../Components/PageTransition";
import AnimatedHero from "../Components/AnimatedHero";
import { Container, Row, Col, Card } from "react-bootstrap";
import BenefitsSection from "./ServicesPage/BenifitsSection.jsx";
import OurDistinction from "./ServicesPage/OurDistinction.jsx";


export default function SkillDevelopmentProgramme() {
  const [benefits, setBenefits] = useState([]);
  const [operationsBackground, setOperationsBackground] = useState("");
  const [heroBackground, setHeroBackground] = useState("");
  const [loading, setLoading] = useState(true);

  // Common styles for consistency
  const cardStyles = {
    background: "rgba(255,255,255,0.92)",
    border: "none",
    borderRadius: "14px",
  };

  const backgroundSectionStyle = {
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  };

  // Reusable card component
  const FeatureCard = ({ children, className = "", variant = "default" }) => (
    <Card 
      className={`p-3 shadow-sm mb-3 ${className}`}
      style={{
        ...cardStyles,
        background: variant === "highlight" ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.92)",
        borderRadius: variant === "highlight" ? "14px" : "12px",
        height: "100%",
        transition: "transform 0.2s ease-in-out",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {children}
    </Card>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch benefits
        const benefitsSnap = await getDocs(collection(db, "benefits"));
        setBenefits(benefitsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));

        // Fetch operations background image
        const operationsQuery = query(
          collection(db, "sectionBackgrounds"),
          where("section", "==", "operations")
        );
        const operationsSnap = await getDocs(operationsQuery);
        if (!operationsSnap.empty) {
          setOperationsBackground(operationsSnap.docs[0].data().imageUrl || "");
        }

        // Fetch hero background image
        const heroQuery = query(
          collection(db, "sectionBackgrounds"),
          where("section", "==", "hero")
        );
        const heroSnap = await getDocs(heroQuery);
        if (!heroSnap.empty) {
          setHeroBackground(heroSnap.docs[0].data().imageUrl || "");
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Section header component
  const SectionHeader = ({ title, subtitle, className = "" }) => (
    <Row className={`mb-5 ${className}`}>
      <Col>
        <h2 className="text-center fw-bold mb-3">{title}</h2>
        {subtitle && <p className="lead text-center text-muted">{subtitle}</p>}
      </Col>
    </Row>
  );

  if (loading) {
    return (
      <PageTransition>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      {/* Hero Section */}
      <AnimatedHero
        title="GICE Skill Development Programme"
        subtitle="Making Students Ready for the Future"
        className="services-hero-modern"
        backgroundImage={heroBackground}
      />

      {/* Main Content Section */}
      <section className="py-5" style={backgroundSectionStyle}>
        <Container fluid>

          {/* Heading Section */}
          <SectionHeader
            title="Skill Development Programme – At a Glance"
            subtitle="We are on a mission to make Students' future-ready through language, soft skills, and life skills training."
          />

          {/* Main Overview */}
          <Row className="mb-5">
            <Col lg={10} className="mx-auto ">
              <FeatureCard className="p-4 bg-light">
                <div className="text-center mb-4 text-dark">
                  <div 
                    style={{
                      width: "60px",
                      height: "4px",
                      backgroundColor: "var(--primary)",
                      margin: "0 auto 1rem",
                      borderRadius: "2px"
                    }}
                  />
                </div>
                <p className="fs-6 lh-base ">
                  <strong >Skill Development Programme</strong> is our flagship service for schools and colleges. Our trained in-house faculty work directly inside the school campus, engaging students both inside and outside classrooms to build language, soft skills, and life skills.
                </p>
                <p className="fs-6 lh-base">
                  Our curriculum is designed with strong focus on behavioral development and personality shaping. It works alongside the school syllabus without affecting academic time and is built on scientifically proven activities that increase engagement and improve retention.
                </p>
                <p className="fs-6 lh-base">
                  The programme is refreshed every year to avoid monotony. Faculty members are chosen based on qualification, teaching experience, and charisma—which plays a big role in motivating and influencing students positively.
                </p>
              </FeatureCard>
            </Col>
          </Row>

          {/* Objectives Section with Dynamic Background */}
          <section
            style={{
              padding: "80px 20px",
              backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url('${operationsBackground}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              position: "relative",
              transition: "background-image 0.5s ease-in-out",
            }}
          >
            <div className="container">
              {/* Title */}
              <h2
                className="fw-bold text-center mb-5"
                style={{
                  fontSize: "34px",
                  letterSpacing: "0.7px",
                  color: "white",
                  animation: "fadeDown 1s ease forwards",
                }}
              >
                Objectives of the Programme
              </h2>

              {/* Card Grid */}
              <div className="row g-4 justify-content-center">
                {[
                  "Improve English proficiency, soft skills, and life skills",
                  "Develop Listening, Speaking, Reading, and Writing (LSRW)",
                  "Reduce mother-tongue influence in English",
                  "Increase confidence and participation",
                  "Promote lifelong learning",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="col-12 col-md-6 col-lg-4"
                    style={{
                      animation: `fadeUp 0.8s ease forwards`,
                      animationDelay: `${index * 0.2}s`,
                      opacity: 0,
                    }}
                  >
                    <div
                      className="p-4 rounded glass-card shadow-sm h-100"
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.3)",
                        transition: "all 0.35s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
                        e.currentTarget.style.boxShadow = "0px 12px 30px rgba(0,0,0,0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0) scale(1)";
                        e.currentTarget.style.boxShadow = "0px 6px 16px rgba(0,0,0,0.12)";
                      }}
                    >
                      <i
                        className="bi bi-check-circle-fill"
                        style={{
                          fontSize: "30px",
                          marginBottom: "8px",
                          color: "var(--text-eggshell)",
                        }}
                      ></i>

                      <p
                        style={{
                          fontSize: "17px",
                          lineHeight: "1.6",
                          fontWeight: "500",
                          color: "#ffffff",
                        }}
                      >
                        {item}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Animations */}
            <style>
              {`
                @keyframes fadeUp {
                  from { transform: translateY(30px); opacity: 0; }
                  to { transform: translateY(0); opacity: 1; }
                }

                @keyframes fadeDown {
                  from { transform: translateY(-20px); opacity: 0; }
                  to { transform: translateY(0); opacity: 1; }
                }

                .glass-card:hover {
                  backdrop-filter: blur(15px);
                }
              `}
            </style>
          </section>

          {/* What We Do Section */}
          <SectionHeader title="What Do We Do in Schools?" className="mt-5" />

          <Row className="justify-content-center">
            <Col lg={10}>
              <FeatureCard className="p-4 bg-light shadow-sm rounded">
                <p className="fs-6 lh-base">
                  The programme runs from June to March. Faculty are handpicked after studying each school's needs. They focus on three major areas:
                </p>

                {/* Feature Boxes */}
                <Row className="g-3 mb-4">
                  <Col md={4} sm={6} xs={12}>
                    <div className="text-center p-4 bg-back rounded shadow-sm h-100">
                      <h5 className="fw-bold text-primary mb-2">Classroom Training</h5>
                      <p className="small mb-0">
                        Activity-based lessons aligned to GICE's curriculum.
                      </p>
                    </div>
                  </Col>

                  <Col md={4} sm={6} xs={12}>
                    <div className="text-center p-4 bg-back rounded shadow-sm h-100">
                      <h5 className="fw-bold text-primary mb-2">Campus Activities</h5>
                      <p className="small mb-0">
                        Fun language games and interactive tasks to build confidence.
                      </p>
                    </div>
                  </Col>

                  <Col md={4} sm={6} xs={12}>
                    <div className="text-center p-4 bg-back rounded shadow-sm h-100">
                      <h5 className="fw-bold text-primary mb-2">Assembly Activities</h5>
                      <p className="small mb-0">
                        A platform for students to practice English and showcase skills.
                      </p>
                    </div>
                  </Col>
                </Row>

                {/* Detailed Paragraphs */}
                <p className="fs-6 lh-base">
                  <strong>Classroom training</strong> involves activity-based lessons aligned with GICE's curriculum. Students' performance is assessed through structured tools.
                </p>
                <p className="fs-6 lh-base">
                  <strong>Campus activities</strong> include fun language games and interactive tasks that help reduce stage fear, build confidence, and improve learning impact.
                </p>
                <p className="fs-6 lh-base">
                  <strong>Assembly activities</strong> give students a platform to use English, build confidence, and work in teams while showcasing their skills.
                </p>
              </FeatureCard>
            </Col>
          </Row>

          <OurDistinction />
          
          {/* Benefits for Students Section */}
          <BenefitsSection benefits={benefits} />

        </Container>
      </section>
    </PageTransition>
  );
}