import React, { useState, useEffect } from 'react';
import { db } from "../firebase-config";
import { collection, getDocs, getDoc, doc } from "firebase/firestore"; // <-- ADDED getDoc, doc
import "./CSS/Services.css";
import AnimatedHero from "../Components/AnimatedHero";
import PageTransition from "../Components/PageTransition";
import { useNavigate } from 'react-router-dom';

// Modern Loader
const ModernLoader = () => (
  <div className="modern-loader-container">
    <div className="loader-wrapper">
      <div className="modern-spinner"></div>
      <div className="loader-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
    <p className="loader-text">Loading Services...</p>
  </div>
);

// Stats Counter
const StatsCounter = ({ number, label }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Reset count if number prop changes
    setCount(0);
  }, [number]);

  useEffect(() => {
    if (typeof number !== "number" || count >= number) return;

    // Adaptive step size and interval
    let diff = number - count;
    let increment, timeout;
    if (number < 50) {
      increment = 1;
      timeout = 25;
    } else if (number < 300) {
      increment = Math.ceil(diff / 8);
      timeout = 18;
    } else if (number < 2000) {
      increment = Math.ceil(diff / 5);
      timeout = 8;
    } else {
      increment = Math.ceil(diff / 3);
      timeout = 2;
    }

    const timer = setTimeout(() => {
      setCount(prev => {
        let next = prev + increment;
        return next > number ? number : next;
      });
    }, timeout);
    return () => clearTimeout(timer);
  }, [count, number]);

  return (
    <div className="stat-item">
      <div className="stat-number">{count}+</div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

// Enhanced Service Card
const ServiceCard = ({ service, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={`service-card-modern ${isVisible ? 'fade-in' : ''}`}
      style={{
        "--delay": `${index * 0.1}s`,
        "--color": service.color || '#4facfe'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-index={index}
    >
      <div className="glass-background"></div>
      <div className={`icon-container ${isHovered ? 'hovered' : ''}`}>
        <div className="icon-background"></div>
        <i className={`bi ${service.icon}`}></i>
        <div className="icon-shine"></div>
      </div>
      <div className="card-content">
        <h3 className="service-title">{service.title}</h3>
        <p className="service-description">{service.description}</p>
        <button className="learn-more-btn">
          <span>Learn More</span>
          <i className="bi bi-arrow-right"></i>
        </button>
      </div>
      <div className="card-decoration">
        <div className="decoration-circle"></div>
        <div className="decoration-line"></div>
      </div>
      <div className={`hover-overlay ${isHovered ? 'active' : ''}`}></div>
    </div>
  );
};

// ---- MAIN COMPONENT ----

const coreServices = [
  {
    icon: "bi-book",
    title: "Free Tuition & Learning Space",
    description: "A free tuition center for underprivileged students, with dedicated study areas and a small library. Special sessions on yoga and support for students with learning disabilities.",
    color: "#667eea"
  },
  {
    icon: "bi-tree",
    title: "Eco Clubs & School Partnerships",
    description: "Eco clubs in partnership with local schools to promote environmental awareness and responsibility among students through activities and campaigns.",
    color: "#f093fb"
  },
  {
    icon: "bi-flower2",
    title: "Farming & Sustainable Agriculture",
    description: "Awareness programs and training for youth on organic farming, seed preservation, and sustainable practices. Led by experts in agriculture and environment.",
    color: "#4facfe"
  },
  {
    icon: "bi-droplet-half",
    title: "Pond Restoration & Water Conservation",
    description: "Cleaning and restoring local ponds to support biodiversity and water conservation in the community.",
    color: "#43e97b"
  },
  {
    icon: "bi-tree-fill",
    title: "Afforestation & Green Spaces",
    description: "Tree planting in schools, community areas, and private lands. Creation of mini forests and green spaces for a healthier environment.",
    color: "#fa709a"
  },
  {
    icon: "bi-journal-richtext",
    title: "Cultural Documentation",
    description: "Documenting and archiving the stories and performances of local folk artists to preserve cultural heritage.",
    color: "#ffecd2"
  }
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState([]);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch stats from Firestore
  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      setStatsLoading(true);
      try {
        const snap = await getDoc(doc(db, "stats", "about"));
        if (isMounted) setStats(snap.exists() ? snap.data() : {});
      } catch (err) {
        console.error("Error fetching stats:", err);
        if (isMounted) setStats({});
      } finally {
        if (isMounted) setStatsLoading(false);
      }
    }
    fetchStats();
    return () => { isMounted = false; };
  }, []);

  // Fetch community services from Firestore
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "services"));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Animate cards on scroll (intersection observer)
  useEffect(() => {
    if (loading) return;

    const observer = new window.IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.dataset.index, 10);
          if (entry.isIntersecting && !visibleCards.includes(index)) {
            setVisibleCards((prev) => [...prev, index]);
          }
        });
      },
      { threshold: 0.1 }
    );
    const cards = document.querySelectorAll('.service-card-modern');
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
    // eslint-disable-next-line
  }, [loading]);

  return (
    <PageTransition className="services-page-modern">
      {/* Enhanced Hero Section with Parallax */}
      <div className="hero-parallax">
        <AnimatedHero
          title="Our Services"
          subtitle="Darvik Foundation empowers communities through education, environmental action, sustainable agriculture, and cultural preservation. Explore our transformative initiatives below."
          className="services-hero-modern"
          overlayColor="rgba(102,126,234,0.1)"
        />
        {/* Floating elements */}
        <div className="floating-elements">
          <div className="float-element element-1"></div>
          <div className="float-element element-2"></div>
          <div className="float-element element-3"></div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {statsLoading ? (
              <div className="text-muted py-5">Loading stats...</div>
            ) : (
              <>
                <StatsCounter number={stats?.studentsHelped || 0} label="Students Helped" />
                <StatsCounter number={stats?.treesPlanted || 0} label="Trees Planted" />
                <StatsCounter number={stats?.pondsRestored || 0} label="Ponds Restored" />
                <StatsCounter number={stats?.communitiesServed || 0} label="Communities Served" />
              </>
            )}
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="services-section-modern">
        {loading ? (
          <ModernLoader />
        ) : (
          <div className="container">
            {/* Section Header */}
            <div className="section-header">
              <span className="section-badge">What We Do</span>
              <h2 className="section-title">
                Transforming Communities Through
                <span className="gradient-text"> Meaningful Impact</span>
              </h2>
              <p className="section-subtitle">
                Our comprehensive services are designed to create lasting positive change 
                in communities through education, environmental conservation, and cultural preservation.
              </p>
            </div>
            {/* Services Grid */}
            <div className="services-grid-modern">
              {coreServices.map((service, index) => (
                <ServiceCard
                  key={service.title}
                  service={service}
                  index={index}
                  isVisible={visibleCards.includes(index)}
                />
              ))}
            </div>
            {/* Additional Services from Firestore */}
            {services.length > 0 && (
              <div className="additional-services">
                <h3 className="additional-title">Community Initiatives</h3>
                <div className="additional-grid">
                  {services.map((service, index) => (
                    <div key={service.id || index} className="additional-card">
                      <div className="additional-content">
                        <h4>{service.title}</h4>
                        <p>{service.description}</p>
                        {service.imageUrl && (
                          <img
                            src={service.imageUrl}
                            alt={service.title}
                            className="additional-image"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join us in our mission to create positive change in communities</p>
            <button className="cta-button" onClick={() => navigate('/donate')}>
              <span>Get Involved</span>
              <i className="bi bi-heart-fill"></i>
            </button>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default Services;
