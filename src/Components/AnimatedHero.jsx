import React from "react";
import { motion } from "framer-motion";

const AnimatedHero = ({
  title,
  subtitle,
  className = "",
  overlayColor = "rgba(0,0,0,0.45)",
  children,
}) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut", when: "beforeChildren" },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay, duration: 0.6, ease: "easeOut" },
    }),
  };

  return (
    <motion.section
      className={`${className} position-relative d-flex flex-column justify-content-center align-items-center text-center overflow-hidden`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        minHeight: "50vh",
        background:
          "linear-gradient(135deg, var(--primary) 20%, var(--secondary) 80%)",
        color: "#fff",
        padding: "100px 20px 80px",
      }}
    >
      {/* Background glow dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="position-absolute rounded-circle"
          style={{
            width: 60,
            height: 60,
            background: "radial-gradient(circle, rgba(255,255,255,0.3), transparent)",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            zIndex: 0,
            opacity: 0.2,
          }}
          animate={{
            y: [0, 15, 0],
            x: [0, 10, 0],
            transition: { duration: 6 + i, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      ))}

      {/* Frosted Glass Overlay */}
      <motion.div
        className="position-absolute w-100 h-100 top-0 start-0"
        style={{
          backdropFilter: "blur(8px)",
          background: overlayColor,
          zIndex: 1,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 1.5 } }}
      />

      {/* Text Section */}
      <motion.div
        className="position-relative z-2 container"
        style={{ maxWidth: "900px" }}
      >
        <motion.h1
          variants={textVariants}
          custom={0.2}
          className="fw-bold display-5 mb-3"
          style={{
            textTransform: "capitalize",
            background: "linear-gradient(90deg, #fff, #ffd700)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: "1px",
          }}
        >
          {title}
        </motion.h1>

        <motion.p
          variants={textVariants}
          custom={0.4}
          className="lead mb-4"
          style={{
            color: "rgba(255,255,255,0.9)",
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: "120px",
            opacity: 1,
            transition: { delay: 0.6, duration: 0.7 },
          }}
          style={{
            height: "3px",
            background: "linear-gradient(90deg, #fff, #ffd700)",
            margin: "0 auto 10px",
            borderRadius: "2px",
          }}
        />

        {children}
      </motion.div>
    </motion.section>
  );
};

export default AnimatedHero;
