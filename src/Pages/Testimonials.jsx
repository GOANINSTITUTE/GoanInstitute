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
import { motion } from "framer-motion";

const Loader = () => (
  <div className="loader-wrap">
    <div className="loader" />
  </div>
);

const getAvatar = (name, imageUrl) => {
  if (imageUrl) return imageUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name
  )}&size=128&background=${encodeURIComponent(
    getComputedStyle(document.documentElement).getPropertyValue("--background").trim() ||
      "e2dbc9"
  )}&color=${encodeURIComponent(
    getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() ||
      "302728"
  )}&rounded=true`;
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [principalTestimonials, setPrincipalTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIds, setExpandedIds] = useState(new Set());

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);

        // Student & faculty testimonials
        const snap1 = await getDocs(collection(db, "testimonials"));
        const data1 = snap1.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTestimonials(data1);

        // Principal / Client Institution Testimonials
        const snap2 = await getDocs(collection(db, "clientTestimonials"));
        const data2 = snap2.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPrincipalTestimonials(data2);

      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const approvedTestimonials = testimonials.filter((t) => !t.pending);
  const students = approvedTestimonials.filter((t) => t.type === "student");
  const faculty = approvedTestimonials.filter((t) => t.type === "faculty");

  const renderTestimonials = (title, list, type) => (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="section-title">{title}</h2>
      <p className="section-subtitle">
        {type === "student"
          ? "Here's what our students have to say."
          : "Hear from our dedicated faculty members."}
      </p>

      {list.length === 0 ? (
        <p className="text-center text-muted mb-5">
          ....
        </p>
      ) : (
        <Swiper
          modules={[Pagination, Autoplay]}
          loop={list.length > 1}
          speed={700}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          slidesPerView={1}
          spaceBetween={20}
          pagination={{ clickable: true, dynamicBullets: true }}
          style={{ paddingBottom: 48 }}
          breakpoints={{
            768: { slidesPerView: 2, spaceBetween: 32 },
            1200: { slidesPerView: 3, spaceBetween: 40 },
          }}
        >
          {list.map((item, i) => {
            const isExpanded = expandedIds.has(item.id);
            return (
              <SwiperSlide key={item.id || i}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  viewport={{ once: true }}
                  className="testimonial-card"
                >
                  <img
                    src={getAvatar(item.name || "Member", item.imageUrl)}
                    alt={item.name || "Member"}
                    className="testimonial-avatar"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        item.name || "Member"
                      )}&size=128&background=e2dbc9&color=302728&rounded=true`;
                    }}
                  />

                  <div className="testimonial-body">
                    <h3 className="testimonial-name">{item.name}</h3>
                    <h4 className="testimonial-role">{item.title}</h4>

                    <div
                      id={`testimonial-text-${item.id || i}`}
                      className={`testimonial-text ${
                        isExpanded ? "expanded" : ""
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: item.text || "<i>No message provided.</i>",
                      }}
                    />

                    {item.text && item.text.length > 140 && (
                      <button
                        className="readmore-btn"
                        onClick={() => toggleExpand(item.id)}
                        aria-expanded={isExpanded}
                        aria-controls={`testimonial-text-${item.id || i}`}
                      >
                        {isExpanded ? "Show Less" : "Read More"}
                      </button>
                    )}

                    <div className="testimonial-stars" aria-hidden>
                      {Array.from({ length: item.stars || 5 }).map(
                        (_, idx) => (
                          <i key={idx} className="bi bi-star-fill" />
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </motion.div>
  );

  return (
    <PageTransition
      className="testimonials-page"
      style={{
        background:
          "linear-gradient(135deg, var(--background) 0%, var(--bg-light) 100%)",
      }}
    >
      <AnimatedHero
        title="Our Testimonials"
        subtitle="The pursuit of excellence can lead to the accomplishment of wonders."
        className="testimonial-hero"
        overlayColor="rgba(220,53,69,0.08)"
      />

      <section className="container intro-section" style={{ maxWidth: 1150 }}>
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="intro-title"
        >
          OUR CLIENTS’ TESTIMONIALS
        </motion.h2>

        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="intro-text"> “Where Learning Thrives and Futures Rise!” Commendation from Our Patrons </motion.p>  

        <p className="mt-3"> The commendations our institution receives are a testament to a journey defined by dedication, hard work, and a deep commitment to educational excellence. Each heartfelt endorsement reflects the trust and impact we’ve cultivated over the past 17 years, highlighting the lives we’ve touched and the dreams we’ve helped others achieve. It hasn’t been an easy road; we’ve faced countless obstacles, made difficult choices, and tirelessly refined our vision and services. Yet, the satisfaction of knowing we’ve made a meaningful difference makes every step worthwhile. Our clients’ warm words of appreciation inspire us to strive for improvement every day. </p>
      </section>

      {/* Video Section */}
      <section className="py-5 honourable-section">
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-md-6">
              <div className="video-wrap">
                <iframe
                  title="YouTube Video"
                  src="https://www.youtube.com/embed/TVKLVOHXtys?si=Y585_I_Rx1Td6F3d"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div className="col-md-6 text-center text-md-start">
              <h3 className="honourable-title">Words from</h3>
              <div className="honourable-content">
                <div className="honourable-large">HONOURABLE</div>
                <div className="honourable-sub">School Principal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="py-5 clients-section">
        <div className="container" style={{ maxWidth: 1150 }}>
          <h2 className="section-title mb-3">Client Institutions Speak</h2>
          <p className="section-subtitle">
            Hear What Our Client Institutions Have To Say
          </p>

          <div className="clients-grid">
            {principalTestimonials.length === 0 ? (
              <p className="text-center text-muted">
                No client testimonials available.
              </p>
            ) : (
              principalTestimonials.map((t, idx) => (
                <motion.article
                  key={t.id}
                  className="client-card bg-transparent"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: idx * 0.02 }}
                  viewport={{ once: true }}
                >
                  <h1 className="client-heading">{t.heading}</h1>
                  <p className="client-text">{t.text}</p>
                  <div className="client-meta">
                    <div className="client-author">{t.author}</div>
                    <div className="client-school">{t.school}</div>
                  </div>
                </motion.article>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="container py-5">
        
      </section>
    </PageTransition>
  );
};

export default Testimonials;
