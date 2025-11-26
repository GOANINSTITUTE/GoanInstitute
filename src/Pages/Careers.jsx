import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import PageTransition from "../Components/PageTransition";
import SmallContact from "../Components/Contact_home";
import { motion } from "framer-motion";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import AnimatedHero from "../Components/AnimatedHero";
const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [careerGallery, setCareerGallery] = useState([]);
  const [heroImage, setHeroImage] = useState("");

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const q = query(collection(db, "careers"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCareers(data);
      } catch (error) {
        console.error("Error fetching careers:", error);
      }
    };

    const fetchCareerGallery = async () => {
      try {
        const snapshot = await getDocs(collection(db, "careersGallery"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCareerGallery(data);

        // Set first image as hero banner
        if (data.length > 0 && data[0].imageUrl) {
          setHeroImage(data[0].imageUrl);
        }
      } catch (error) {
        console.error("Error fetching career gallery:", error);
      }
    };

    fetchCareers();
    fetchCareerGallery();
  }, []);

  return (
    <PageTransition>
      <div className="careers-page bg-light text-dark">
        {/* 🔹 Hero Section */}
        <AnimatedHero
        title="Careers at GICE"
        subtitle=" Your journey starts here… Where Passion Meets Purpose"
        className="services-hero-modern"
        overlayColor="rgba(102,126,234,0.1)"
      />
        
        {/* 🔹 Gallery Slideshow Section */}
        {careerGallery.length > 0 && (
          <section className="py-4 bg-dark">
            <div className="container">
              <Swiper
                modules={[Autoplay, EffectFade]}
                slidesPerView={1}
                loop
                effect="fade"
                autoplay={{ delay: 2500, disableOnInteraction: false }}
                className="rounded shadow"
                style={{
                  height: "350px",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                {careerGallery.map((img) => (
                  <SwiperSlide key={img.id}>
                    <div
                      style={{
                        height: "350px",
                        background: `url(${img.imageUrl}) center/cover no-repeat`,
                      }}
                    ></div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
        )}


        {/* 🔹 Vacancy Details Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <h3 className="fw-bold text-center text-primary mb-5">
              Job Openings
            </h3>
            <p className="text-muted fs-6 mb-4">
              GICE offers rewarding careers for exceptional graduates and
              postgraduates from diverse fields. We provide a creative and
              fulfilling workspace where you can dream and frame your future.
              Here, you are empowered to bring your ideas to life, grow
              alongside inspiring colleagues, and make a difference every day.
              If you are ready to challenge yourself and build a purposeful
              career, explore our opportunities and discover how you can help
              shape tomorrow with us.
            </p>
            <div className="row g-4 justify-content-center">
              {[
                {
                  icon: "bi-people-fill",
                  title: "Soft Skill Trainer",
                  desc: "As a trainer, you ignite curiosity through engaging activities, helping students build confidence in expressing themselves. You develop their English communication, soft skills, and life skills, laying a foundation for success in school and beyond.",
                },
                {
                  icon: "bi-person-badge",
                  title: "HR Officer",
                  desc: "Identify candidates aligned with GICE’s values, conduct interviews, and represent GICE at job fairs. Your efforts shape a team passionate about education and excellence.",
                },
                {
                  icon: "bi-megaphone",
                  title: "Business Promotion Officer",
                  desc: "Promote GICE’s Skill Development Programme to schools, highlighting our focus on communication, critical thinking, and personality development.",
                },
                {
                  icon: "bi-chat-dots-fill",
                  title: "Student Counsellor",
                  desc: "Support students emotionally and academically through guidance sessions and workshops, helping them grow resilient and self-aware.",
                },
              ].map((job, i) => (
                <div className="col-12 col-md-6 col-lg-5" key={i}>
                  <motion.div
                    className="card border-0 shadow-sm h-100"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="card-body p-4 text-center">
                      <i
                        className={`bi ${job.icon} text-warning mb-3`}
                        style={{ fontSize: "2.5rem" }}
                      ></i>
                      <h5 className="fw-bold text-primary mb-3">
                        {job.title}
                      </h5>
                      <p className="text-muted small">{job.desc}</p>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>


 <section
      className="py-5"
      style={{
        background: "linear-gradient(90deg,#4b2e2e55 60%,#ffd70015 100%)",
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
                paddingBottom: "56.25%", // 16:9 aspect ratio
                height: 0,
                overflow: "hidden",
                borderRadius: 16,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              }}
            >
              <iframe
                title="Motivational Video"
                src="https://www.youtube.com/embed/q0BlzI0Suvs?si=_q7IWsK7OilXfnSv" // Replace with actual video ID
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
            <h3
              className="mb-4"
              style={{
                color: "var(--accent, #ffd700)",
                fontWeight: "700",
                fontSize: "2.3rem",
                letterSpacing: "1px",
                textShadow: "0 2px 8px #4b2e2e80",
              }}
            >
              GICE<br />
              <span style={{ color: "#fff" }}>BLOOMSPIRE</span>
            </h3>
          </div>
        </div>
      </div>
    </section>



        {/* 🔹 Dynamic Career Cards */}
        {careers.length > 0 && (
          <section className="py-5 bg-white">
            <div className="container">
              <h3 className="fw-bold text-primary text-center mb-4">
                Current Openings
              </h3>
              <div className="row g-4 justify-content-center">
                {careers.map((career, index) => (
                  <div className="col-12 col-md-6 col-lg-4" key={index}>
                    <motion.div
                      className="card shadow-sm border-0 h-100"
                      whileHover={{ y: -5 }}
                    >
                      {career.imageUrl && (
                        <div
                          style={{
                            height: "200px",
                            background: `url(${career.imageUrl}) center/cover no-repeat`,
                            borderTopLeftRadius: "0.5rem",
                            borderTopRightRadius: "0.5rem",
                          }}
                        ></div>
                      )}
                      <div className="card-body">
                        <h5 className="fw-bold text-primary">
                          {career.title || "Untitled Role"}
                        </h5>
                        <p className="small text-muted mb-2">
                          {career.location || "Location: Flexible"}
                        </p>
                        <p className="small text-dark">
                          {career.desc || "No description available."}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 🔹 Apply Section */}
        <section
          className="py-5 text-center text-light"
          style={{
            background: "linear-gradient(135deg, #3a2a1e, #4b2e2e)",
          }}
        >
          <div className="container">
            <h3 className="fw-bold text-warning mb-3">Join Our Team</h3>
            <p className="mb-4 fs-6">
              Interested in building your career with GICE? Send your CV to{" "}
              <b>gicerecruitment@gmail.com</b> or call{" "}
              <b>+91 92077 00930</b>.
            </p>
            <a
              href="mailto:gicerecruitment@gmail.com"
              className="btn btn-warning fw-bold text-dark px-4 py-2"
            >
              <i className="bi bi-envelope-fill me-2"></i>Send CV
            </a>
          </div>
        </section>

        {/* 🔹 Contact Footer */}
        <SmallContact />
      </div>
    </PageTransition>
  );
};

export default Careers;
