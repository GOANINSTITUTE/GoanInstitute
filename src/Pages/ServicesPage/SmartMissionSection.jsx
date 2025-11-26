import React, { useEffect } from "react";

const SmartMissionSection = () => {

  // Trigger animation
  useEffect(() => {
    const cards = document.querySelectorAll(".smart-card");
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("show");
      }, index * 200);
    });
  }, []);

  return (
    <section
      style={{
        padding: "70px 20px",
        backgroundColor: "var(--bg-light)",
      }}
    >
      <div className="container">

        {/* Title */}
        <h2
          style={{
            fontWeight: "bold",
            textAlign: "center",
            color: "var(--text-primary)",
            marginBottom: "30px",
            fontSize: "28px",
          }}
        >
          Smart Scholar Mission
        </h2>

        <p
          style={{
            textAlign: "center",
            maxWidth: "800px",
            margin: "0 auto 50px",
            color: "var(--text-secondary)",
            fontSize: "16px",
          }}
        >
          This mission supports students from government schools—especially those from financially
          weaker backgrounds—by helping them develop communication skills, life skills, and personal
          growth habits.
        </p>

        {/* Layout Row: Image Left + All Cards Right */}
        <div className="row g-4 align-items-center">
          
          {/* Image */}
          <div className="col-md-5 d-flex justify-content-center">
            <img
              src="https://res.cloudinary.com/dcfpgz4x8/image/upload/v1763877854/SSm_Programme_Allocation-01_yo8tdi.png"
              alt="Skill Development Programme"
              className="img-fluid"
              style={{ maxHeight: "400px", width: "100%", objectFit: "contain" }}
            />
          </div>

          {/* Cards */}
          <div className="col-md-7">
            {[
              {
                icon: "bi-clipboard2-check-fill",
                title: "Programme Allocation",
                text: "Education: 80% • Health: 10% • Environment: 10%",
              },
              {
                icon: "bi-chat-right-quote-fill",
                title: "Personality & English Enhancement",
                text: "Debates, role plays, discussions, reading, writing & vocabulary-building activities.",
              },
              {
                icon: "bi-heart-fill",
                title: "Mental Health & Wellness",
                text: "Emotional support, discipline, fitness, nutrition and preventive health practices.",
              },
              {
                icon: "bi-tree-fill",
                title: "Green Awareness Project",
                text: "Environmental responsibility and herbal gardening through practical learning.",
              },
            ].map((item, index) => (
              <div className="smart-card shadow-sm mb-3" key={index}
                style={{
                  backgroundColor: "var(--bg-back)",
                  borderRadius: "14px",
                  padding: "20px",
                  display: "flex",
                  gap: "18px",
                  opacity: 0,
                  transform: "translateY(25px)",
                  transition: "all 0.6s ease",
                }}
              >
                <i
                  className={`bi ${item.icon}`}
                  style={{
                    fontSize: "36px",
                    color: "var(--text-primary)",
                    flexShrink: 0,
                  }}
                ></i>

                <div>
                  <h5 style={{ fontWeight: "600", color: "var(--text-primary)", marginBottom: "6px" }}>
                    {item.title}
                  </h5>
                  <p style={{ margin: 0, color: "var(--text-secondary)" }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          .smart-card.show {
            opacity: 1 !important;
            transform: translateY(0) !important;
          }
          .smart-card:hover {
            transform: translateY(-6px) scale(1.01) !important;
          }
        `}
      </style>
    </section>
  );
};

export default SmartMissionSection;
