import React, { useEffect, useState } from "react";
import "./CSS/Testimonials.css";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import AnimatedHero from "../Components/AnimatedHero";
import PageTransition from "../Components/PageTransition";
import { motion } from "framer-motion";
import PrincipalVideoTestimonials from "./PrincipalVideoTestimonials";

const Loader = () => (
  <div className="loader-wrap">
    <div className="loader" />
  </div>
);

const Testimonials = () => {
  const [principalTestimonials, setPrincipalTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);

        const snap = await getDocs(collection(db, "clientTestimonials"));
        const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPrincipalTestimonials(data);

      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) return <Loader />;

  return (
    <PageTransition className="testimonials-page">
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

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="intro-text"
        >
          “Where Learning Thrives and Futures Rise!”
        </motion.p>

        <p className="mt-3">
          The commendations our institution receives are a testament to a journey
          defined by dedication, hard work, and a deep commitment to educational
          excellence. Each heartfelt endorsement reflects the trust and impact
          we’ve cultivated over the past years.
        </p>
      </section>

      {/* Video Testimonials */}
      <PrincipalVideoTestimonials />

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
    </PageTransition>
  );
};

export default Testimonials;