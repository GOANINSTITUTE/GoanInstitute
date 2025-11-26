import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./CSS/Testimonials.css";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import AnimatedHero from "../Components/AnimatedHero";
import PageTransition from "../Components/PageTransition";
import ShareYourStory from "./ShareYourStory";


const Loader = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
    <div
      style={{
        width: 48,
        height: 48,
        border: "5px solid #eee",
        borderTop: "5px solid #0d6efd",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <style>
      {`
          @keyframes spin {
            0% { transform: rotate(0);}
            100% { transform: rotate(360deg);}
          }
        `}
    </style>
  </div>
);

const getAvatar = (name, imageUrl) => {
  if (imageUrl) return imageUrl;
  // Return generated avatar URL if no image
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=dee2e6&color=495057&rounded=true`;
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "testimonials"));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Filter approved testimonials only
  const approvedTestimonials = testimonials.filter((t) => !t.pending);

  // If no approved testimonials and not loading, show only ShareYourStory
  if (!loading && approvedTestimonials.length === 0) {
    return (
      <PageTransition className="testimonials-page bg-light">
        <AnimatedHero
          title="Testimonials"
          subtitle="Hear from the communities and individuals who have been touched by Darvik Foundation."
          className="testimonial-hero"
          overlayColor="rgba(220,53,69,0.15)"
        />
        <section className="container py-5" style={{ maxWidth: 1100 }}>
          <ShareYourStory />
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="testimonials-page bg-light">
      <AnimatedHero
        title="Testimonials"
        subtitle="Hear from the communities and individuals who have been touched by Darvik Foundation."
        className="testimonial-hero"
        overlayColor="rgba(220,53,69,0.15)"
      />
      <section className="container py-5" style={{ maxWidth: 1100 }}>
        <div data-aos="fade-up" data-aos-delay={80}>
          <h2 style={{ fontWeight: 900, letterSpacing: 1 }} className="mb-3 mt-2 text-center">
            What Our Community Says
          </h2>
          <div className="mb-4 text-center text-muted" style={{ fontSize: "1.1rem" }}>
            These stories fuel our mission every day.
          </div>

          {loading ? (
            <Loader />
          ) : (
            <Swiper
              modules={[Pagination, Autoplay]}
              loop={true}
              speed={700}
              autoplay={{ delay: 5000 }}
              slidesPerView={1}
              pagination={{ clickable: true }}
              style={{ paddingBottom: 48 }}
              breakpoints={{
                768: { slidesPerView: 2, spaceBetween: 32 },
                1200: { slidesPerView: 3, spaceBetween: 40 },
              }}
            >
              {approvedTestimonials.map((item) => (
                <SwiperSlide key={item.id}>
                  <div
                    className="testimonial-item shadow-sm"
                    style={{
                      background: "#fff",
                      borderRadius: 18,
                      boxShadow: "0 4px 24px rgba(20,30,48,0.10)",
                      padding: "2.2rem 1.5rem 2rem 1.5rem",
                      margin: "1.5rem 0",
                      minHeight: 420,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      transition: "box-shadow 0.3s",
                    }}
                  >
                    <img
                      src={getAvatar(item.name, item.imageUrl)}
                      alt={item.name}
                      className="testimonial-img mb-3"
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "3px solid #0d6efd",
                        boxShadow: "0 2px 8px #0d6efd22",
                        background: "#f8f9fa",
                      }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = getAvatar(item.name, "");
                      }}
                    />
                    <h3 style={{ fontWeight: 700, fontSize: "1.25rem", marginBottom: 2 }}>{item.name}</h3>
                    <h4 style={{ color: "#0d6efd", fontSize: "1.05rem", marginBottom: 8 }}>{item.title}</h4>
                    <div className="stars mb-2" aria-label={`Rating: ${item.stars} stars`}>
                      {Array.from({ length: item.stars }).map((_, idx) => (
                        <i key={idx} className="bi bi-star-fill text-warning" style={{ fontSize: 18 }}></i>
                      ))}
                    </div>
                    <blockquote
                      style={{
                        fontSize: "1.15rem",
                        color: "#333",
                        fontStyle: "italic",
                        margin: 0,
                        marginTop: 12,
                        lineHeight: 1.7,
                        textAlign: "center",
                        position: "relative",
                      }}
                    >
                      <i className="bi bi-quote quote-icon-left" style={{ color: "#0d6efd", fontSize: 22, verticalAlign: "middle", marginRight: 6 }}></i>
                      {item.text}
                      <i className="bi bi-quote quote-icon-right" style={{ color: "#0d6efd", fontSize: 22, verticalAlign: "middle", marginLeft: 6 }}></i>
                    </blockquote>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {/* Show ShareYourStory form always below carousel */}
          <div className="mt-5">
            <ShareYourStory />
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Testimonials;
