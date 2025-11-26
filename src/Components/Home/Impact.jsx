import React from 'react';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

const Impact = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3, // Adjust depending on when you want animation to start
  });

  return (
    <div ref={ref}>
      <section
        className="py-5"
        style={{
          backgroundColor: "var(--secondary-light-opaced, #5c443381)",
          color: "#fff",
          minHeight: "320px",
        }}
      >
        <div className="container">
          <div className="row align-items-center gy-4">
            {/* Video Left */}
            <div className="col-md-6">
              <div
                style={{
                  position: "relative",
                  paddingBottom: "56.25%", // 16:9 ratio
                  height: 0,
                  overflow: "hidden",
                  borderRadius: 16,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                }}
              >
                <iframe
                  title="YouTube Video"
                  src="https://www.youtube.com/embed/R9sZohMSptU?si=ucvTfmtfY6FiKY--"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                    borderRadius: 16,
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Content Right */}
            <div className="col-md-6 text-center text-md-start">
              <h3
                className="mb-4"
                style={{
                  color: "var(--accent, #ffd700)",
                  fontWeight: "700",
                  fontSize: "2.4rem",
                  letterSpacing: "1px",
                }}
              >
                Our Impact
              </h3>

              <div
                className="d-flex flex-column flex-sm-row justify-content-center justify-content-md-start gap-4"
                style={{ fontWeight: 600, fontSize: "1.4rem" }}
              >
                <div>
                  <div
                    style={{
                      color: "var(--accent, #ffd700)",
                      fontSize: "3rem",
                      fontWeight: "900",
                      lineHeight: 1,
                    }}
                  >
                    {inView ? <CountUp end={1500} duration={4} suffix="+" /> : 0}
                  </div>
                  <div>School & Colleges</div>
                </div>
                <div>
                  <div
                    style={{
                      color: "var(--accent, #ffd700)",
                      fontSize: "3rem",
                      fontWeight: "900",
                      lineHeight: 1,
                    }}
                  >
                    {inView ? <CountUp end={35} duration={4} separator="," /> : 0} Lakhs
                  </div>
                  <div>Happy Students</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Impact;
