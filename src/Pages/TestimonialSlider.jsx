import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TestimonialSlider = ({ type }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const snapshot = await getDocs(collection(db, "testimonials"));
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => item.type === type && !item.pending);

      setItems(data);
    };

    fetchTestimonials();
  }, [type]);

  const cleanText = (text) => {
    if (!text) return "";
    return text
      .replace(/<snap[^>]*>/gi, "")
      .replace(/<\/snap>/gi, "")
      .replace(/<[^>]+>/g, "")
      .trim();
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="py-5" style={{ background: "transparent" }}>
      <div className="container">
        <h2 className="fw-bold mb-4 text-center">
  {type === "student"
    ? "What our faculty says !"
    : type === "faculty"
    ? "Words from few Former GICEians"
    : "From the desk of our office team members"}
</h2>


        <Slider {...settings} className="testimonial-slider">
          {items.map((item) => (
            <div className="testimonial-item" key={item.id}>
              <div className="testimonial-card mx-auto p-4 shadow-sm">
                <div className="text-center">
                  <div className="position-relative d-inline-block mb-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "5px solid var(--secondary-light)",
                      }}
                    />

                    <div
                      className="position-absolute"
                      style={{
                        bottom: 0,
                        right: 0,
                        background: "var(--secondary)",
                        color: "white",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <i className="bi bi-quote"></i>
                    </div>
                  </div>

                  <h5 className="fw-bold mb-0">{item.name}</h5>

                  {/* Scrollable text box */}
                  <div className="testimonial-text-box mt-3 px-3">
                    {cleanText(item.text)}
                  </div>

                  <div className="mt-3">
                    {[...Array(item.stars)].map((_, i) => (
                      <i
                        key={i}
                        className="bi bi-star-fill text-eggshell me-1"
                      ></i>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default TestimonialSlider;
