import React, { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";

const Profilefooter = () => {
  const [bgImage, setBgImage] = useState("");

  /* 🔹 Fetch footer background */
  const fetchBackground = async () => {
    try {
      const q = query(
        collection(db, "giceProfiles"),
        where("category", "==", "footerbackground")
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        setBgImage(snapshot.docs[0].data().imageUrl);
      } else {
        // fallback image
        setBgImage(
          "https://res.cloudinary.com/dgxhp09em/image/upload/v1763573106/x4hjmc2sy2pyhce6odmf.jpg"
        );
      }
    } catch (error) {
      console.log("Error fetching footer background:", error);
      setBgImage(
        "https://res.cloudinary.com/dgxhp09em/image/upload/v1763573106/x4hjmc2sy2pyhce6odmf.jpg"
      );
    }
  };

  useEffect(() => {
    fetchBackground();
  }, []);

  return (
    <section
      aria-labelledby="gice-heading"
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "60px 20px",
        color: "#ffffff",
        transition: "background-image 0.4s ease",
      }}
    >


      {/* dark overlay for readability */}
      <div
        style={{
          background: "rgba(0,0,0,0.55)",
          borderRadius: "12px",
          maxWidth: "1100px",
          margin: "auto",
          padding: "28px",
          display: "flex",
          alignItems: "center",
          gap: "24px",
          flexWrap: "wrap",
        }}
      >
        <div  style={{ flex: "1 1 320px", minWidth: 280 }}>
          <h3 className="text-eggshell"
            id="gice-heading"
            style={{
              margin: 0,
              fontSize: "20px",
              letterSpacing: "0.4px",
              opacity: 0.95,
            }}
          >
            GICE — Skill Development for a Global Future
          </h3>

          <p style={{ marginTop: "12px", lineHeight: 1.6, fontSize: "15px" }}>
            GICE, with its decade-long legacy, offers value-oriented skill
            development programs nationwide. Our objectives include enhancing
            life & soft skills for global competitiveness and laying
            foundations for future leaders.
          </p>

          <div style={{ marginTop: "16px" }}>
            <a
              href="/services"
              style={{
                display: "inline-block",
                padding: "10px 18px",
                borderRadius: "8px",
                background: "#ffd166",
                color: "#111827",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Explore Programs
            </a>
          </div>
        </div>

        {/* small decorative block or logo area */}
        <div
          style={{
            width: 160,
            minWidth: 120,
            textAlign: "center",
          }}
        >
          
        </div>
      </div>
    </section>
  )
}

export default Profilefooter