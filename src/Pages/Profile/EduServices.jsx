import React, { useEffect, useRef, useState } from "react";
import {
  FaSchool,
  FaHandsHelping,
  FaUserTie,
} from "react-icons/fa";
import { db } from "../../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";

const EduServices = () => {
  const sectionRef = useRef(null);
  const [bgImage, setBgImage] = useState("");

  /* 🔹 Fetch background image for Edu Services */
  const fetchBackground = async () => {
    try {
      const q = query(
        collection(db, "giceProfiles"),
        where("category", "==", "eduservicesbackground")
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setBgImage(data.imageUrl);
      } else {
        // Default fallback image
        setBgImage(
          "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
        );
      }
    } catch (error) {
      console.log("Error loading background:", error);
      setBgImage(
        "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
      );
    }
  };

  useEffect(() => {
    fetchBackground();

    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll(".service-card");

    cards.forEach((card, i) => {
      setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      }, i * 300);
    });
  }, []);
  return (
 <section
      ref={sectionRef}
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "80px 20px",
        position: "relative",
        color: "white",
        transition: "background-image 0.5s ease",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          background: "rgba(0, 0, 0, 0.65)",
          padding: "60px 20px",
          borderRadius: "10px",
          maxWidth: "1200px",
          margin: "auto",
          textAlign: "center",
        }}
      >
        <h2 className="text-eggshell"
          style={{
            fontSize: "2.3rem",
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          Educational Services We Provide
        </h2>

        <p  style={{ fontSize: "1rem", marginBottom: "40px", opacity: "0.8" }}>
          We deliver training programs that help students grow with confidence and skills.
        </p>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gap: "30px",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {/* Card 1 */}
          <div
            className="service-card"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "25px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              transition: "0.3s",
              opacity: 0,
              transform: "translateY(30px)",
            }}
          >
            <FaSchool className="text-accent" size={50} style={{ marginBottom: "15px" }} />
            <h4 className="text-eggshell" style={{ marginBottom: "10px", fontWeight: "600" }}>
              School Training Programme
            </h4>
            <p style={{ opacity: "0.9" }}>
              Regular full-time Advanced Skill and Knowledge Development Programme designed for school students.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="service-card"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "25px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              transition: "0.3s",
              opacity: 0,
              transform: "translateY(30px)",
            }}
          >
            <FaHandsHelping className="text-accent" size={50} style={{ marginBottom: "15px" }} />
            <h4 className="text-eggshell" style={{ marginBottom: "10px", fontWeight: "600" }}>
              Social Responsibility Programme
            </h4>
            <p style={{ opacity: "0.9" }}>
              Free training for underprivileged students through our Smart Scholar Mission.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="service-card"
            style={{
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "25px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              transition: "0.3s",
              opacity: 0,
              transform: "translateY(30px)",
            }}
          >
            <FaUserTie className="text-accent" size={50} style={{ marginBottom: "15px" }} />
            <h4 className="text-eggshell" style={{ marginBottom: "10px", fontWeight: "600" }}>
              College Placement & Interview Training
            </h4>
            <p style={{ opacity: "0.9" }}>
              A complete interview and placement preparation track for college students.
            </p>
          </div>
        </div>
      </div>
    </section>

  )
}

export default EduServices