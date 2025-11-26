import React, { useEffect, useState } from "react";
import PageTransition from "../Components/PageTransition";
import AnimatedHero from "../Components/AnimatedHero";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import SmartMissionSection from "./ServicesPage/SmartMissionSection.jsx";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

export default function SmartScholarMission() {
  const [missionImages, setMissionImages] = useState([]);

  useEffect(() => {
    getDocs(collection(db, "missionImages")).then((snap) => {
      setMissionImages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
  }, []);

  // Function to get first image matching a category
  const byCategory = (cat) =>
    missionImages.find((img) => img.category?.toLowerCase() === cat)?.imageUrl || "";

  return (
    <PageTransition>

      {/* Hero Section */}
      <AnimatedHero
        title="Smart Scholar Mission"
        subtitle="Education and opportunities for every child"
        className="scholar-hero"
      />

      <SmartMissionSection />

      {/* Main Content */}
      <section className="py-5">
        <Container>

          {/* Heading */}
          <Row className="mb-5">
            <Col md={12} className="text-center">
              <h2 className="fw-bold mb-3">Smart Scholar Mission – At a Glance</h2>
              <p className="lead">
                We believe literacy and employability are the keys for a developed India.
              </p>

              <Image
                src={byCategory("hero")}
                alt="Smart Mission Preview"
                fluid
                rounded
                className="mt-3 shadow-sm"
              />
            </Col>
          </Row>

          {/* Main Overview */}
          <Row className="gy-4">
            <Col md={12}>
              <Card className="p-4 shadow-sm bg-light border-0">
                <Row>
                  <Col md={8}>
                    <h4 className="fw-bold mb-3">Smart Scholar Mission Programme – Overview</h4>
                    <p>
                      Smart Scholar Mission provides world-class academic tools to the
                      underprivileged sections of society, free of cost...
                    </p>

                    <p>
                      Many students lack exposure to soft skills & life skills. This mission
                      solves that gap with a structured, practical approach.
                    </p>
                  </Col>

                  <Col md={4} className="text-center">
                    <Image
                      src={byCategory("overview")}
                      alt="Education Illustration"
                      fluid
                      rounded
                      className="shadow-sm"
                    />
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Education for All */}
            <Col md={12}>
              <Card className="p-4 shadow-sm bg-light border-0">
                <Row className="align-items-center">
                  <Col md={4} className="text-center mb-3 mb-md-0">
                    <Image
                      src={byCategory("education")}
                      alt="Education for All"
                      fluid
                      rounded
                      className="shadow-sm"
                    />
                  </Col>

                  <Col md={8}>
                    <h4 className="fw-bold mb-3">Smart Scholar Mission – Education for All</h4>
                    <p>
                      Through this mission, GICE Foundation provides premium educational
                      tools to financially backward communities…
                    </p>
                    <p>
                      Our faculty engages with students like in privately aided schools,
                      ensuring equal learning opportunities.
                    </p>
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* Benefits Heading */}
            <Col md={12}>
              <h3 className="fw-bold text-center mt-5 mb-4">Benefits of Smart Scholar Mission</h3>

              <div className="text-center mb-4">
                <Image
                  src={byCategory("benefits")}
                  alt="Benefits"
                  fluid
                  rounded
                  className="shadow-sm"
                />
              </div>
            </Col>

            {/* Benefit Cards */}
            {[
              "Enhanced confidence and self-esteem",
              "Improved employment opportunities",
              "Reduced social inequality",
              "Community development",
              "Better academic performance",
            ].map((benefit, index) => (
              <Col md={4} key={index}>
                <Card
                  className="p-4 text-center shadow-sm bg-light"
                  style={{
                    border: "none",
                    background: "var(--bg-light)",
                    height: "100%",
                    borderRadius: "14px",
                  }}
                >
                  <p className="fw-semibold fs-5">{benefit}</p>
                </Card>
              </Col>
            ))}

            {/* Framework */}
            <Col md={12} className="mt-5">
              <Card className="p-4 shadow-sm bg-light border-0">
                <Row>
                  <Col md={8}>
                    <h4 className="fw-bold mb-3">Framework of Smart Scholar Mission</h4>

                    <h5 className="fw-bold">Programme Design</h5>
                    <p>
                      The programme was originally created for privately aided schools, but
                      has been adapted for government school environments…
                    </p>

                    <h5 className="fw-bold mt-4">Programme Delivery</h5>
                    <p>
                      Students receive the same quality training as our partner schools,
                      including communication skills, vocabulary, personality development…
                    </p>

                    <h5 className="fw-bold mt-4">Impact & Sustainability</h5>
                    <p>
                      The mission is built to be long-term. Regular evaluation ensures
                      measurable improvements and responsible resource use.
                    </p>
                  </Col>

                  <Col md={4} className="text-center">
                    <Image
                      src={byCategory("framework")}
                      alt="Mission Framework"
                      fluid
                      rounded
                      className="shadow-sm mt-4 mt-md-0"
                    />
                  </Col>
                </Row>
              </Card>
            </Col>

          </Row>
        </Container>
      </section>
    </PageTransition>
  );
}
