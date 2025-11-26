import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

// Counter Component
const Counter = ({ end, startCounting }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startCounting) return;

    let current = 0;
    let increment = Math.floor(end / 120);
    if (increment < 1) increment = 1;

    const timer = setInterval(() => {
      current += increment;

      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, 15);

    return () => clearInterval(timer);
  }, [end, startCounting]);

  return <span>{count.toLocaleString()}</span>;
};

const OperationsSection = () => {
  const [images, setImages] = useState({ schools: [], students: [] });
  const [startCount, setStartCount] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const sectionRef = useRef(null);

  // Load images only when section becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting) {
          setStartCount(true);

          if (images.schools.length === 0 && images.students.length === 0) {
            try {
              const snapshot = await getDocs(collection(db, "operationsGallery"));
              const data = snapshot.docs.map((doc) => doc.data());

              const schools = data.filter((item) =>
                item.category.includes("schools")
              );
              const students = data.filter((item) =>
                item.category.includes("students")
              );

              setImages({ schools, students });
            } catch (error) {
              console.error("Error fetching operations images:", error);
            }
          }
        }
      },
      { threshold: 0.4 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => observer.disconnect();
  }, [images]);

  // Refresh Swiper when images load
  useEffect(() => {
    if (swiperInstance && (images.schools.length > 0 || images.students.length > 0)) {
      setTimeout(() => {
        swiperInstance.update();
        swiperInstance.slideToLoop(0);
      }, 200);
    }
  }, [images, swiperInstance]);

  const operations = [
    {
      icon: "bi-building",
      number: 1500,
      starttext: "Reached Over ",
      text: "Schools & Colleges",
      category: "schools",
    },
    {
      icon: "bi-people-fill",
      number: 3500000,
      text: "Happy Students",
      category: "students",
    },
  ];

  return (
    <section ref={sectionRef} className="py-5 text-center bg-light">
      <div className="container">
        <h3 className="fw-bold mb-4 text-dark">OUR OPERATIONS</h3>
        <div className="row justify-content-center g-4">
          {operations.map((item, i) => (
            <div className="col-12 col-md-6 col-lg-5" key={i}>
              <div
                className="card border-0 shadow-sm p-0 h-100 position-relative overflow-hidden mx-auto"
                style={{
                  borderRadius: "5px",
                  minHeight: "320px",
                  maxWidth: "650px",
                  width: "100%",
                  aspectRatio: "2/1",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <Swiper
                  key={images[item.category].length} // Force re-render when images change
                  modules={[Autoplay, EffectFade]}
                  effect="fade"
                  autoplay={{ delay: 1000, disableOnInteraction: false }}
                  loop
                  observer={true}
                  observeParents={true}
                  onSwiper={(swiper) => setSwiperInstance(swiper)}
                  className="h-100 w-100 position-absolute top-0 start-0"
                >
                  {(images[item.category] || []).map((img, index) => (
                    <SwiperSlide key={index}>
                      <div
                        style={{
                          backgroundImage: `url(${img.imageUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          width: "100%",
                          height: "100%",
                          filter: "brightness(0.5)",
                        }}
                      ></div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                <div
                  className="p-4 position-relative d-flex flex-column align-items-center justify-content-center"
                  style={{ zIndex: 2, color: "white", minHeight: "320px" }}
                >
                  <i
                    className={`bi ${item.icon} mb-3`}
                    style={{ fontSize: "2.5rem", color: "var(--text-eggshell)" }}
                  ></i>

                  <h5 className="fw-bold text-eggshell">
                    {item.starttext}
                    <Counter end={item.number} startCounting={startCount} />+ <br /> {item.text}
                  </h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OperationsSection;
