import React, { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FaSchool, FaClock } from "react-icons/fa";

const Operations = () => {
  const [bgImage, setBgImage] = useState("");

  /* 🔹 Fetch operations background */
  const fetchBackground = async () => {
    try {
      const q = query(
        collection(db, "giceProfiles"),
        where("category", "==", "operationsbackground")
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setBgImage(snapshot.docs[0].data().imageUrl);
      } else {
        // fallback if not uploaded yet
        setBgImage(
          "https://res.cloudinary.com/dgxhp09em/image/upload/v1763572510/wwxtqpc1lok1fkrlnyjf.jpg"
        );
      }
    } catch (error) {
      console.log("Error loading operations background:", error);
      setBgImage(
        "https://res.cloudinary.com/dgxhp09em/image/upload/v1763572510/wwxtqpc1lok1fkrlnyjf.jpg"
      );
    }
  };

  useEffect(() => {
    fetchBackground();
  }, []);
  return (
     <section
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.8)), url("${bgImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "90px 0",
        color: "#ffffff",
        transition: "background-image 0.4s ease-in-out",
      }}
      className="operations-hero"
    >
      <div className="container text-center ">
        <h2
          className="fw-bold fade-up text-eggshell"
          style={{
            fontFamily: "'Roboto Slab', serif",
            fontSize: "2.3rem",
            marginBottom: "40px",
          }}
        >
          OUR OPERATIONS
        </h2>

        <div className="row justify-content-center g-4">

          {/* YEARS */}
          <div
            className="col-12 col-md-4 fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "15px",
                padding: "25px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="hover-box"
            >
              <FaClock size={40} style={{ marginBottom: "10px" }} />
              <h3 className="fw-bold text-eggshell" style={{ fontSize: "1.5rem" }}>18 YEARS</h3>
              <p className="text-eggshell" style={{ opacity: 0.9 }}>OF IMPACTFUL JOURNEY</p>
            </div>
          </div>

          {/* SCHOOLS */}
          <div
            className="col-12 col-md-4 fade-up"
            style={{ animationDelay: "0.35s" }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "15px",
                padding: "25px",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="hover-box"
            >
              <FaSchool size={40} style={{ marginBottom: "10px" }} />
              <h3 className="fw-bold text-eggshell" style={{ fontSize: "1.5rem" }}>1500+ SCHOOLS & COLLEGES</h3>
              <p className="text-eggshell" style={{ opacity: 0.9 }}>SUCCESSFULLY REACHED</p>
            </div>
          </div>

          

        </div>
      </div>

      {/* Animation + Hover Effects */}
      <style>{`
        .fade-up {
          opacity: 0;
          transform: translateY(30px);
          animation: fadeUp 1.3s ease forwards;
        }

        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hover-box:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);
        }

      `}</style>
    </section>
  )
}

export default Operations