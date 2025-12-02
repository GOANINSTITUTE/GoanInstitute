import React, { useEffect, useRef, useState } from "react";

const BenefitsSlider = ({ benefits = [] }) => {
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [speed] = useState(0.30); // ⭐ Adjust autoplay speed (higher = faster)
  const trackRef = useRef(null);
  const bubbleIndex = useRef(0);
  const animationRef = useRef(null);
  const position = useRef(0);

  // RESPONSIVE SLIDES COUNT
  const updateSlides = () => {
    const w = window.innerWidth;
    if (w < 768) setSlidesToShow(1);
    else if (w < 992) setSlidesToShow(2);
    else setSlidesToShow(3);
  };

  useEffect(() => {
    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  // ⭐ Loop list (Infinite)
  const looped = [...benefits, ...benefits];

  // ⭐ BUBBLE AUTO-SCROLLER
  const animate = () => {
    position.current -= speed; // move left continuously

    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${position.current}px)`;

      const trackWidth = trackRef.current.scrollWidth / 2; 
      if (Math.abs(position.current) >= trackWidth) {
        position.current = 0; 
      }
    }
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (benefits.length > 0) {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [benefits.length, slidesToShow]);

  // ⭐ MANUAL ARROWS (Jump by 1 card)
  const scrollSteps = () => (trackRef.current.offsetWidth / slidesToShow);

  const scrollRight = () => {
    position.current -= scrollSteps();
  };

  const scrollLeft = () => {
    position.current += scrollSteps();
    if (position.current > 0) position.current = -trackRef.current.scrollWidth / 2;
  };

  // ⭐ BUBBLE DOTS
  const handleBubbleClick = (i) => {
    bubbleIndex.current = i;
    position.current = -(i * scrollSteps());
  };

  // BUBBLE COUNT
  const bubbleCount = Math.ceil(benefits.length / slidesToShow);

  return (
    <section className="bs-section bg-light">
      <div className="">

        <h2 class="text-dark fw-bold text-center mb-3">BENEFITS FOR STUDENTS</h2>
        <p className="bs-sub">How students grow through this programme</p>

        <div className="bs-wrapper ">

          {/* LEFT ARROW */}
          <button className="bs-arrow left bg-light" onClick={scrollLeft}>‹</button>

          <div className="bs-track-container">
            <div className="bs-track " ref={trackRef}>
              {looped.map((item, i) => (
                <div
                  key={i}
                  className="bs-card bg-light"
                  style={{
                    flex: `0 0 calc(${100 / slidesToShow}% - 20px)`
                  }}
                >
                  <div className="bs-icon text-primary bg-light ">
                    <i className={`bi ${item.icon}`}></i>
                  </div>

                  <h3 className="bs-card-title">{item.title}</h3>

                    <div
                      className="bs-image"
                      style={{ backgroundImage: `url(${item.imageUrl})` }}
                    ></div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT ARROW */}
          <button className="bs-arrow right bg-light" onClick={scrollRight}>›</button>

        </div>

        {/* ⭐ BUBBLE DOTS */}
        <div className="bs-dots  ">
          {[...Array(bubbleCount)].map((_, i) => (
            <div
              key={i}
              className="bs-dot bg-primary"
              onClick={() => handleBubbleClick(i)}
            ></div>
          ))}
        </div>

      </div>

      <style>
        {`
          .bs-section {
            padding: 70px 0;
            background: #f8faff;
            overflow: hidden;
          }

          .bs-card-title {
            word-wrap: break-word;
            overflow-wrap: break-word;
            white-space: normal;       /* text can wrap to next line */
            text-align: center;
          }
          .bs-sub {
            text-align: center;
            color: #6c757d;
            margin-bottom: 40px;
            font-size: 16px;
          }

          .bs-wrapper {
            position: relative;
            width: 100%;
          }

          .bs-track-container {
            overflow: hidden;
            width: 100%;
          }

          .bs-track {
            display: flex;
            gap: 20px;
            white-space: nowrap;
            will-change: transform;
          }

          /* CARD */
          .bs-card {
            background: white;
            border-radius: 18px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.08);
            padding: 20px;
            text-align: center;
            min-width: 240px;
          }

          .bs-icon {
            width: 70px;
            height: 70px;
            background: #e9f0ff;
            color: #0d6efd;
            border-radius: 14px;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
          }

          .bs-card-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
          }

          .bs-image {
            width: 100%;
            height: 280px;
            border-radius: 12px;
            background-position: center;
            background-size: cover;
          }

          /* ARROWS */
          .bs-arrow {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            border: none;
            width: 45px;
            height: 45px;
            border-radius: 50%;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 6px 18px rgba(0,0,0,0.15);
            z-index: 10;
          }

          .bs-arrow.left { left: -5px; }
          .bs-arrow.right { right: -5px; }

          /* BUBBLE DOTS */
          .bs-dots {
            margin-top: 20px;
            display: flex;
            gap: 10px;
            justify-content: center;
          }

          .bs-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #d0d7e1;
            cursor: pointer;
          }

          .bs-dot:hover {
            background: #0d6efd;
          }

          @media(max-width: 768px) {
            .bs-card { min-width: 85%; }
            .bs-image { height: 220px; }
          }
        `}
      </style>
    </section>
  );
};

export default BenefitsSlider;
