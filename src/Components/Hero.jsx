import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

const Hero = () => {
  const [heroMedia, setHeroMedia] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "hero-backgrounds"));
        const mediaList = querySnapshot.docs
          .map((doc) => doc.data())
          .filter((item) => item.url);
        setHeroMedia(mediaList);
      } catch (error) {
        console.error("❌ Error fetching hero media:", error);
      }
    };
    fetchMedia();
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (heroMedia.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroMedia.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroMedia]);

  // Trigger animations on load
  useEffect(() => {
    document.querySelectorAll(".hero-title, .hero-subtitle, .hero-card")
      .forEach(el => el.style.animationPlayState = "running");
  }, []);

  // Keyframe animation objects
  const fadeUpAnimation = {
    animationName: "fadeUp",
    animationDuration: "1.2s",
    animationTimingFunction: "ease-out",
    animationFillMode: "forwards",
    opacity: 0,
    transform: "translateY(20px)",
    animationPlayState: "paused",
  };

  const fadeUpAnimationSubtitle = { ...fadeUpAnimation, animationDuration: "1.6s" };
  const fadeUpCardAnimation = (delay) => ({
    animationName: "fadeUpCards",
    animationDuration: "1.2s",
    animationTimingFunction: "ease-out",
    animationFillMode: "forwards",
    animationDelay: delay,
    opacity: 0,
    transform: "translateY(30px)",
    animationPlayState: "paused",
  });

  // Keyframes globally
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeUp {
        0% { opacity: 0; transform: translateY(25px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeUpCards {
        0% { opacity: 0; transform: translateY(40px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Detect screen width for responsive styles
  const isMobile = window.innerWidth <= 768;

  return (
    <section
      className="position-relative d-flex align-items-center justify-content-center text-light hero-section"
      style={{
        height: isMobile ? "auto" : "100vh",
        minHeight: "550px",
        overflow: "hidden",
        paddingTop: isMobile ? "80px" : "0",
        paddingBottom: isMobile ? "80px" : "0",
      }}
    >
      {/* Background */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ zIndex: 1 }}>
        {heroMedia.map((item, i) => (
          <div
            key={i}
            className="position-absolute w-100 h-100"
            style={{
              opacity: i === currentIndex ? 1 : 0,
              transition: "opacity 2s ease-in-out",
            }}
          >
            {item.type === "video" ? (
            <video
  src={item.url}
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  poster={item.posterUrl || 'https://res.cloudinary.com/dgxhp09em/image/upload/v1763817654/xseg5az746etyjfuwsho.jpg'}  // optional poster image URL
  className="w-100 h-100"
  style={{ objectFit: "cover" }}
/>


            ) : (
              <div
                style={{
                  backgroundImage: `url(${item.url})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "100%",
                  height: "100%",
                }}
              ></div>
            )}
          </div>
        ))}
      </div>

      {/* Overlay */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100 " 
        style={{
          background: "rgba(0, 0, 0, 0.61)",
          backdropFilter: "blur(0.5px)",
          zIndex: 2,
        }}
      ></div>

      {/* Content */}
      <div
        className="container position-relative text-center text-md-start px-3 px-md-5 hero-content "
        style={{
          zIndex: 3,
        }}
      >
        {/* Titles */}
        <div className="row align-items-center mb-5">
          <div className="col-12 text-center ">
            <h1
              className="fw-bold mb-5 hero-title text-eggshell"
              style={{
                fontFamily: "'Plus Jakarta Sans', serif",
                fontSize: isMobile ? "1.0rem" : "clamp(0.5rem, 4vw, 1.5rem)",
                lineHeight: 1.3,
                letterSpacing: "0.1em",
                ...fadeUpAnimation,
              }}
            >
              GOAN INSTITUTE INTERNATIONAL CONSOCIATION OF EDUCATION
            </h1>
            <div
  style={{
    height: "1px",
    margin: "1px auto",
    width: "60%",
    background: "linear-gradient(90deg, transparent, #ffc107, transparent)",
  }}
/>

            <h2
  className="fw-bold mb-3 text-accent hero-subtitle"
  style={{
    fontFamily: "'Roboto Slab', serif",
    fontSize: isMobile ? "0.95rem" : "clamp(1.75rem, 5vw, 2.5rem)",
    lineHeight: 1.3,
    letterSpacing: "0.08em",
    position: "relative",
    ...fadeUpAnimationSubtitle,
  }}
>
<div
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    color: "var(--text-accent)"
  }}
>
  <span>Be the Leading Light to Lead</span>
</div>

</h2>
</div>
        </div>


      </div>
    </section>
  );
};

export default Hero;
