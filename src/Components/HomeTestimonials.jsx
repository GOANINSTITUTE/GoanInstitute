import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import ShareYourStory from "../Pages/ShareYourStory";  // Adjust path if needed
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../Pages/CSS/Testimonials.css"; // Update CSS path accordingly
import { Link } from "react-router-dom";

const getAvatar = (name, imageUrl) =>
  imageUrl
    ? imageUrl
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=128&background=dee2e6&color=495057&rounded=true`;

const HomeTestimonials = () => {
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

  const approvedTestimonials = testimonials.filter(
    (t) => t.pending === false || t.pending === undefined
  );

  if (!loading && approvedTestimonials.length === 0) {
    return (
      <section className="container py-5" style={{ maxWidth: 1100 }}>
        <ShareYourStory />
      </section>
    );
  }

  if (loading) {
    return null; // Or add a loader here
  }

  return (
    <section className="home-testimonials-section py-5">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="section-title mb-0">Testimonials</h2>
          <Link to="/testimonials" className="btn btn-outline-primary btn-sm">
            Read All
          </Link>
        </div>
        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          loop
          speed={700}
          autoplay={{ delay: 4000 }}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          className="home-testimonials-swiper"
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 24 },
            1200: { slidesPerView: 3, spaceBetween: 30 }
          }}
        >
          {approvedTestimonials.slice(0, 10).map((item, idx) => (
            <SwiperSlide key={item.id}>
              <div
                className="testimonial-item card home-card p-4 text-center animate-fade-slide"
                style={{
                  animationDelay: `${idx * 0.12}s`,
                  minHeight: "350px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  boxShadow: "0 4px 12px rgba(13, 110, 253, 0.1)",
                  borderRadius: "1rem",
                  transition: "box-shadow 0.3s ease"
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 10px 30px rgba(13, 110, 253, 0.15)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(13, 110, 253, 0.1)"}
              >
                <img
                  src={getAvatar(item.name, item.imageUrl)}
                  alt={item.name}
                  className="testimonial-img"
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    objectFit: "cover",
                    boxShadow: "0 4px 8px rgba(13, 110, 253, 0.3)",
                    margin: "0 auto 1rem",
                    border: "4px solid #0d6efd"
                  }}
                  onError={e => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getAvatar(item.name, "");
                  }}
                />
                <h5 style={{ fontWeight: 700, fontSize: "1.3rem", marginBottom: "4px" }}>{item.name}</h5>
                <div className="text-muted small mb-3" style={{ fontWeight: 500 }}>
                  {item.title}
                </div>
                <div
                  className="stars mb-4"
                  aria-label={`Rated ${item.stars || 5} stars`}
                  role="img"
                  aria-live="polite"
                  style={{ fontSize: "1.3rem" }}
                >
                  {Array.from({ length: item.stars || 5 }).map((_, i) => (
                    <i
                      key={i}
                      className="bi bi-star-fill"
                      style={{ color: "#ffc107", margin: "0 2px" }}
                    />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#333",
                    flexGrow: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    textAlign: "center",
                    lineHeight: "1.5",
                    marginBottom: 0,
                    maxHeight: "5.4em", // approx 3-4 lines
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    wordBreak: "break-word"
                  }}
                  title={item.text}
                >
                  {item.text}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HomeTestimonials;
