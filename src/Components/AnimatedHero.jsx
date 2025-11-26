import React from 'react';
import { motion } from 'framer-motion';

const AnimatedHero = ({ 
  title, 
  subtitle, 
  className = "gallery-hero", 
  overlayColor = "rgba(13,110,253,0.15)",
  titleDelay = 0.2,
  subtitleDelay = 0.4
}) => {
  // Animation variants for the hero container
  const containerVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  // Animation variants for text elements
  const textVariants = {
    hidden: { 
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Animation variants for the overlay
  const overlayVariants = {
    hidden: { 
      opacity: 0,
      scale: 1.1
    },
    visible: { 
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  // Floating animation for background elements
  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.section 
      className={`${className} d-flex align-items-center justify-content-center text-center position-relative overflow-hidden animated-hero-section-fix`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ minHeight: '40vh', paddingTop: '90px' }}
    >
      {/* Animated background elements */}
      <motion.div
        className="position-absolute"
        variants={floatingVariants}
        animate="animate"
        style={{
          top: '10%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'linear-gradient(45deg, rgba(13,110,253,0.1), rgba(243,38,140,0.1))',
          borderRadius: '50%',
          zIndex: 1
        }}
      />
      <motion.div
        className="position-absolute"
        variants={floatingVariants}
        animate="animate"
        style={{
          top: '20%',
          right: '15%',
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, rgba(243,38,140,0.1), rgba(25,135,84,0.1))',
          borderRadius: '50%',
          zIndex: 1,
          animationDelay: '2s'
        }}
      />
      <motion.div
        className="position-absolute"
        variants={floatingVariants}
        animate="animate"
        style={{
          bottom: '15%',
          left: '20%',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(225deg, rgba(25,135,84,0.1), rgba(13,110,253,0.1))',
          borderRadius: '50%',
          zIndex: 1,
          animationDelay: '4s'
        }}
      />

      {/* Main content container */}
      <motion.div 
        className="container position-relative z-2 py-5"
        variants={containerVariants}
      >
        <motion.h1 
          className="display-3 fw-bold mb-3"
          variants={textVariants}
          custom={titleDelay}
          style={{
            background: 'linear-gradient(45deg, #0d6efd, #f3df26ff, #198754)',
            backgroundSize: '200% 200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'gradientShift 3s ease-in-out infinite'
          }}
        >
          {title}
        </motion.h1>
        
        <motion.p 
          className="lead mb-4"
          variants={textVariants}
          custom={subtitleDelay}
          style={{ 
            color: '#495057',
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          {subtitle}
        </motion.p>

        {/* Animated decorative line */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ 
            width: '100px', 
            opacity: 1,
            transition: { 
              delay: 0.8, 
              duration: 0.8,
              ease: "easeOut"
            }
          }}
          style={{
            height: '4px',
            background: 'linear-gradient(90deg, #0d6efd, #f3df26ff)',
            margin: '0 auto',
            borderRadius: '2px'
          }}
        />
      </motion.div>

      {/* Animated overlay */}
      <motion.div 
        className="position-absolute w-100 h-100 top-0 start-0" 
        variants={overlayVariants}
        style={{ 
          background: overlayColor,
          zIndex: 0
        }}
      />

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animated-hero-section-fix {
          padding-top: 90px;
        }
        @media (max-width: 767px) {
          .animated-hero-section-fix {
            padding-top: 70px;
          }
        }
      `}</style>
    </motion.section>
  );
};

export default AnimatedHero;
