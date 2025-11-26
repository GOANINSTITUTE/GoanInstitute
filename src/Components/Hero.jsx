import React, { useEffect, useState } from 'react';
import "./Hero.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { Carousel } from 'react-responsive-carousel';

const Hero = () => {
  const HeroLoader = () => (
    <div style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <div style={{
          position: 'absolute',
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: '6px solid #0d6efd',
          borderTop: '6px solid #f3268c',
          animation: 'hero-spin 1.2s linear infinite',
        }} />
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: 'linear-gradient(90deg, #0d6efd 60%, #f3268c 100%)',
          boxShadow: '0 0 24px #0d6efd44',
          animation: 'hero-pulse 1.2s ease-in-out infinite',
        }} />
        <style>{`
          @keyframes hero-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes hero-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.15); opacity: 0.7; }
          }
        `}</style>
      </div>
    </div>
  );
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroBg, setHeroBg] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        // Fetch hero images
        const snapshot = await getDocs(collection(db, "hero_images"));
        const data = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(item => item.imageUrl && typeof item.imageUrl === "string" && item.imageUrl.trim() !== "");
        setImages(data);
        // Fetch hero background
        const bgSnapshot = await getDocs(collection(db, "hero-background"));
        // Use the first document's url field if available
        const bgUrl = bgSnapshot.docs.length > 0 ? bgSnapshot.docs[0].data().url : "";
        setHeroBg(bgUrl);
      } catch (error) {
        console.error("Error fetching hero images/background:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <section
      className="hero-header position-relative d-flex align-items-center justify-content-center"
      style={heroBg ? { background: `url(${heroBg}) center center/cover no-repeat` } : undefined}
    >
      <div className="hero-overlay position-absolute w-100 h-100"></div>
      <div className="container py-5 position-relative z-2">
        <div className="row g-5 align-items-center mb-4">
          <div className="col-lg-6 text-light">
            <h1 className="display-3 fw-bold mb-3 hero-title">
              KIND HEARTS IGNITE <span className="text-primary">TRUE</span> COMPASSION
            </h1>
            <h5 className="mb-4 hero-subtitle">
              We serve meals to many.
            </h5>
            <a href="about" className="btn btn-primary btn-lg shadow hero-cta">Learn More</a>
          </div>
          <div className="col-lg-6">
            <Carousel
              autoPlay
              infiniteLoop
              showThumbs={false}
              showStatus={false}
              showArrows={false}
              className="header-carousel animated fadeIn"
            >
              {loading ? (
                <HeroLoader />
              ) : images.length > 0 ? (
                images.map((item, idx) => (
                  <div key={item.id || idx}>
                    <img
                      className="img-fluid hero-fadein"
                      src={item.imageUrl}
                      alt={item.title || `Slide ${idx + 1}`}
                      style={{ opacity: 0, transition: 'opacity 0.7s cubic-bezier(.4,2,.6,1)' }}
                      onLoad={e => { e.target.style.opacity = 1; }}
                      onError={e => {
                        e.target.onerror = null;
                        e.target.src = "/logo.svg";
                        e.target.alt = "Image not found";
                        e.target.style.objectFit = "contain";
                        e.target.style.background = "#f8d7da";
                        e.target.style.opacity = 1;
                      }}
                    />
                    {item.title && <h5 className="mt-2 text-center text-dark">{item.title}</h5>}
                    {item.description && <p className="text-center text-muted small">{item.description}</p>}
                  </div>
                ))
              ) : (
                <div>
                  <img className="img-fluid" src="/logo.svg" alt="No images found" />
                </div>
              )}
            </Carousel>
          </div>
        </div>
        <div className="row g-4 hero-info-row">
          <div className="col-6 col-md-3">
            <div className="hero-info-card d-flex flex-column align-items-center p-3">
              <div className="icon-circle mb-2"><i className="bi bi-heart-fill"></i></div>
              <span>Serving Humanity</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="hero-info-card d-flex flex-column align-items-center p-3">
              <div className="icon-circle mb-2"><i className="bi bi-people-fill"></i></div>
              <span>Empowering Communities</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="hero-info-card d-flex flex-column align-items-center p-3">
              <div className="icon-circle mb-2"><i className="bi bi-person-heart"></i></div>
              <span>Spreading Kindness</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="hero-info-card d-flex flex-column align-items-center p-3">
              <div className="icon-circle mb-2"><i className="bi bi-book-fill"></i></div>
              <span>Hope for All</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
