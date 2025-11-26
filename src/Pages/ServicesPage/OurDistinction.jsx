import React, { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";

const OurDistinction = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snap = await getDocs(collection(db, "services"));

        const allItems = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setItems(allItems);
      } catch (error) {
        console.error("Error loading distinctions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  return (
    <section className="py-5" style={{ background: "var(--bg-back)" }}>
      <div className="container">

        {/* Heading */}
        <h2
          className="fw-bold text-center mb-3"
          style={{ fontSize: "28px", color: "#1a1a1a" }}
        >
          Our Distinction
        </h2>

        <p
          className="text-center mb-5"
          style={{ maxWidth: "750px", margin: "auto", color: "#555" }}
        >
          What makes our programmes stand out from the rest.
        </p>

        <div className="row g-4">
          {items.map((item) => (
            <div key={item.id} className="col-12">

              <div
                className="rounded shadow-sm overflow-hidden distinction-card d-flex flex-column flex-md-row"
                style={{
                  background: "#ffffff",
                  border: "1px solid #e6e9ee",
                  transition: "0.35s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow =
                    "0px 14px 24px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0px 6px 14px rgba(0,0,0,0.06)";
                }}
              >
                {/* Image Left (or top on mobile) */}
                <div
                  className="distinction-image"
                  style={{
                    flex: "0 0 40%",
                    minHeight: "200px",
                    backgroundImage: `url(${item.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>

                {/* Content Right */}
                <div
                  className="p-4 d-flex flex-column justify-content-center bg-light"
                  style={{ flex: "1" }}
                >
                  {/* Icon */}
                  <div
                    className="d-flex align-items-center justify-content-center mb-3"
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: item.color || "rgba(102,126,234,0.1)",
                    }}
                  >
                    <i
                      className={`bi ${item.icon}`}
                      style={{ fontSize: "28px", color: "#fff" }}
                    ></i>
                  </div>

                  {/* Title */}
                  <h4 className="fw-bold mb-2">{item.title}</h4>

                  {/* Description */}
                  <p style={{ fontSize: "15px", color: "#555" }}>
                    {item.description}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Mobile Responsive Styles */}
      <style>
        {`
          @media (max-width: 768px) {
            .distinction-card {
              flex-direction: column !important;
            }

            .distinction-image {
              width: 100% !important;
              height: 200px !important;
            }
          }

          @media (min-width: 992px) {
            .distinction-card {
              min-height: 240px;
            }
          }
        `}
      </style>
    </section>
  );
};

export default OurDistinction;
