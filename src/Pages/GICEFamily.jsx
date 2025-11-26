import React from "react";
import PageTransition from "../Components/PageTransition";
import AnimatedHero from "../Components/AnimatedHero";
import TestimonialSlider from "./TestimonialSlider";
import ShareYourStory from "./ShareYourStory";
import { Container, Row, Col, Card, CardBody } from "react-bootstrap";
import {
  CheckCircleFill,
  PeopleFill,
  BriefcaseFill,
  CashStack,
  ShieldFillCheck,
  MegaphoneFill,
  PersonBadgeFill,
  JournalBookmarkFill,
  MicFill,
} from "react-bootstrap-icons";

// Department data for dynamic rendering
const departments = [
  {
    title: "Administrative Department",
    icon: <PeopleFill className="me-2 text-primary" />,
    description:
      "GICE’s administrative officers oversee all the departments to ensure smooth functioning and make sure employees feel valued while meeting client institution needs.",
  },
  {
    title: "Principal Strategist",
    icon: <JournalBookmarkFill className="me-2 text-primary" />,
    description:
      "Develops long-term strategies, analyzes market trends, and collaborates with department heads to align with GICE’s mission.",
  },
  {
    title: "Accounts Department",
    icon: <CashStack className="me-2 text-primary" />,
    description:
      "Handles all financial operations, prepares reports, and supports budgeting and resource planning.",
  },
  {
    title: "Human Resources Department",
    icon: <PersonBadgeFill className="me-2 text-primary" />,
    description:
      "Manages recruitment, training, and employee relations while supporting skill and career development.",
  },
  {
    title: "Academics Department",
    icon: <CheckCircleFill className="me-2 text-primary" />,
    description:
      "Oversees academic content, faculty performance, and professional development for educators.",
  },
  {
    title: "Client Relations",
    icon: <BriefcaseFill className="me-2 text-primary" />,
    description:
      "Works closely with schools, gathers feedback, supports faculty, and strengthens institutional relationships.",
  },
  {
    title: "Promotion Department",
    icon: <MegaphoneFill className="me-2 text-primary" />,
    description:
      "Handles marketing, promotions, and outreach activities with academic institutions.",
  },
  {
    title: "Legal Department",
    icon: <ShieldFillCheck className="me-2 text-primary" />,
    description:
      "Manages compliance, legal documentation, contracts, and dispute resolution for GICE.",
  },
];

// Stories data
const stories = [
  {
    title: "Voices of experience: Reflection from those who have walked our path",
    icon: <PeopleFill className="me-2 text-primary" />,
    description:
      "At GICE , every employee becomes part of a warm and supportive family. We value teamwork, empathy, and respect which creates a friendly and growth- oriented environment.  Employees often describe their time at GICE as a meaningful journey. Supportive leadership, strong values and growth opportunities helped them build skills and confidence that stay with them wherever they go.",
  }
];

const GICEFamily = () => {
  return (
    <PageTransition>
      {/* Hero Section */}
      <AnimatedHero
        title="GICE FAMILY"
        subtitle="A family needs to work as a team, supporting each other's individual aims and aspirations."
        className="services-hero-modern"
        overlayColor="rgba(102,126,234,0.1)"
      />

      <div className="container-fluid px-0 py-5">


        {/* Departments Section */}
        <section className="departments mb-5">
  <h2 className="text-center mb-5 fw-semibold fs-2">Departments of GICE</h2>

  <Row className="g-4 justify-content-center">

    {departments.map((dept, index) => (
      <Col md={4} sm={6} key={index}>
        <div
          className="department-card p-4 text-center shadow-sm h-100"
          style={{
            borderRadius: "18px",
            background: "var(--background-light)",
            transition: "all 0.3s ease",
            animation: "fadeUp 0.6s ease forwards",
            opacity: 0,
            animationDelay: `${index * 0.15}s`,
          }}
        >
          {/* Big Icon */}
          <div
            style={{
              fontSize: "50px",
              color: "var(--secondary)",
              marginBottom: "15px",
            }}
          >
            {dept.icon}
          </div>

          <h4 className="fw-bold mb-2">{dept.title}</h4>

          <p className="text-muted" style={{ fontSize: "15px" }}>
            {dept.description}
          </p>
        </div>
      </Col>
    ))}
  </Row>

  {/* Animation CSS */}
  <style>
    {`
      .department-card:hover {
        transform: translateY(-8px) scale(1.03);
        box-shadow: 0 12px 22px rgba(0,0,0,0.12);
      }

      @keyframes fadeUp {
        from {
          transform: translateY(20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `}
  </style>
</section>
{/* Stories Section */}
        <section className="stories-at-work mt-5 mb-5">
          <h2 className="text-center mb-4 fw-semibold fs-2">‘Proud to Share – Our Stories at Work!’</h2>
          {stories.map((story, index) => (
            <Card key={index} className="shadow-sm border-0 mb-4">
              <CardBody className="p-4">
                {story.icon && (
                  <h4 className="mb-3">
                    {story.icon}
                    {story.title}
                  </h4>
                )}
                {!story.icon && <h4 className="text-primary mb-3">{story.title}</h4>}
                <p className="text-muted">{story.description}</p>
              </CardBody>
            </Card>
          ))}
        </section>
<TestimonialSlider type="student" />
<TestimonialSlider type="officestaff" />
<section
      className="py-5"
      style={{
        backgroundColor: "var(--secondary-light-opaced, #5c443381)",
        color: "#fff",
        minHeight: "320px",
      }}
    >
      <div className="container">
        <div className="row align-items-center gy-4">
          
          {/* Video Left */}
          <div className="col-md-6">
            <div
              style={{
                position: "relative",
                paddingBottom: "56.25%", // 16:9 ratio
                height: 0,
                overflow: "hidden",
                borderRadius: 16,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              }}
            >
              <iframe
                title="YouTube Video"
                src="https://www.youtube.com/embed/_N-_xU0SxEc?si=aCC8sbrRgF4dQG8Y" // Replace with actual video ID
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: 16,
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Content Right */}
          <div className="col-md-6 text-center text-md-start">
            <h1 style={{
                    color: "var(--accent, #ffd700)",
                    fontSize: "3rem",
                    fontWeight: "900",
                    lineHeight: 1,
                  }}>TRUST</h1>
                  <br/>
            <h3
              className=""
              style={{
                color: "var(--accent, #ffd700)",
                fontWeight: "700",
                fontSize: "2.4rem",
                letterSpacing: "1px",
              }}
            >
              Words from our
            </h3>
            <div
              className="d-flex flex-column flex-sm-row justify-content-center justify-content-md-start gap-4"
              style={{ fontWeight: 600, fontSize: "1.4rem" }}
            >
                <div>Faculty Member</div>
              
              
            </div>
          </div>
        </div>
      </div>
    </section>


        
      </div>

      


<ShareYourStory />
    </PageTransition>
  );
};

export default GICEFamily;
