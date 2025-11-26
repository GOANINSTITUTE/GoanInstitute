// src/pages/Home.jsx

import React, { useEffect, useState } from "react";
import { createPortal } from 'react-dom';
import { db } from "../firebase-config";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import "./CSS/Home.css";
import Hero from "../Components/Hero.jsx";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import SmallContact from "../Components/Contact_home.jsx";
import PageTransition from "../Components/PageTransition";
import HomeTestimonial from "../Components/HomeTestimonials.jsx";
// Suppress ResizeObserver loop error globally (development only)
if (process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('ResizeObserver loop completed')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
}

function Home() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [services, setServices] = useState([]);
  
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [activeNews, setActiveNews] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle ResizeObserver errors
    const handleResizeObserverError = (e) => {
      if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener('error', handleResizeObserverError);

    const fetchGallery = async () => {
      try {
        const galleryRef = collection(db, "gallery");
        // Query: order by 'uploadedAt' descending, limit 5 latest images
        const galleryQuery = query(galleryRef, orderBy("uploadedAt", "desc"), limit(6));
        const snap = await getDocs(galleryQuery);
        const storage = getStorage();

        const items = await Promise.all(
          snap.docs.map(async (doc) => {
            const data = doc.data();
            let imageUrl = data.imageUrl || '';
            if (imageUrl && !imageUrl.startsWith('http')) {
              try {
                imageUrl = await getDownloadURL(ref(storage, imageUrl));
              } catch (e) {
                console.error("Error getting download URL for", imageUrl, e);
                imageUrl = '';
              }
            }
            return { id: doc.id, ...data, imageUrl };
          })
        );
        setGalleryItems(items);
        console.log("Gallery Items:", items);
      } catch (error) {
        console.error("Error fetching gallery items:", error);
      }
    };

    const fetchNews = async () => {
      try {
        const snap = await getDocs(collection(db, "news"));
        const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNewsItems(items.slice(0, 3));
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    const fetchServices = async () => {
      try {
        const snap = await getDocs(collection(db, "services"));
        const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(items.slice(0, 3));
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

   

    fetchGallery();
    fetchNews();
    fetchServices();

    return () => {
      window.removeEventListener('error', handleResizeObserverError);
    };
  }, []);

  const handleNewsClick = (item) => {
    if (window.innerWidth < 768) {
      // Mobile: navigate to /news passing newsId
      navigate("/news", { state: { newsId: item.id } });
    } else {
      // Desktop: open modal
      setActiveNews(item);
      setNewsModalOpen(true);
    }
  };

  return (
    <PageTransition>
      <div className="home-page bg-light">
        <div className="home-landing">
          <Hero />

          {/* Home Gallery Section: Two-Column Modern Layout */}
          <section className="gallery-grid-section py-5" style={{ position: "relative", overflow: "hidden" }}>
            <div className="gallery-animated-circles">
              <div className="circle circle1"></div>
              <div className="circle circle2"></div>
              <div className="circle circle3"></div>
            </div>
            <div className="container" style={{ position: "relative", zIndex: 1 }}>
              <h2 className="section-title">Latest Gallery</h2>
              <div className="row g-4">
                {/* Now rendering maximum 5 latest images */}
                {galleryItems.map((item, index) => (
                  <div key={item.id} className="col-lg-6 col-md-6 col-12">
                    <div
                      className="gallery-card animate-fade-slide"
                      style={{ animationDelay: `${index * 0.12}s` }}
                    >
                      <img src={item.imageUrl} alt={item.title || "Gallery"} className="gallery-card-img" />
                      <div className="gallery-card-overlay">
                        <h4 className="gallery-card-title">{item.title || "Untitled"}</h4>
                        <p className="gallery-card-desc">{item.description || "No description."}</p>
                        <Link to="/gallery" className="btn btn-primary btn-sm">View More</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* News Preview - Notification Popup Style */}
          <section className="home-section news-section">
            <div className="container">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="section-title mb-0">Latest News</h2>
                <Link to="/news" className="btn btn-outline-primary btn-sm">Read More</Link>
              </div>
              <div className="row g-3">
                {newsItems.map((item, index) => (
                  <div className="col-12 col-md-6 col-lg-4" key={item.id}>
                    <div className="news-popup-card d-flex align-items-center p-3 shadow-sm animate-fade-slide" style={{ borderRadius: 18, background: '#f7f9fc', minHeight: 120, position: 'relative', border: '1px solid #e3e6ee', animationDelay: `${index * 0.12}s` }}>
                      <div className="news-img-wrapper me-3" style={{ width: 72, height: 72, borderRadius: 12, overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 8px #0d6efd22', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 12, cursor: 'pointer' }} onClick={() => handleNewsClick(item)} />
                        ) : (
                          <span className="bi bi-newspaper" style={{ fontSize: 32, color: '#0d6efd' }}></span>
                        )}
                      </div>
                      <div className="news-info flex-grow-1">
                        <h5 className="mb-1 fw-bold" style={{ color: '#0d6efd' }}>{item.title}</h5>
                        <p className="text-muted small mb-1">{item.date ? new Date(item.date).toLocaleDateString() : ""}</p>
                        <p className="mb-0" style={{ fontSize: 15, color: '#333', maxHeight: 48, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.description && item.description.length > 60 ? item.description.slice(0, 60) + '...' : item.description}
                        </p>
                        <button className="btn btn-link p-0 mt-1" style={{ color: '#0d6efd', fontWeight: 500, fontSize: 15 }} onClick={() => handleNewsClick(item)}>Read More</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* News Modal Popup */}
            {newsModalOpen && activeNews && createPortal(
              <div className="news-modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', zIndex: 2147483647, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setNewsModalOpen(false)}>
                <div className={`news-modal-content${window.innerWidth < 768 ? ' news-modal-mobile' : ''}`} style={{ background: '#fff', borderRadius: 32, maxWidth: 900, width: '96vw', minHeight: 480, padding: 0, position: 'relative', boxShadow: '0 8px 32px #0d6efd22', display: 'flex', flexDirection: 'row', overflow: 'hidden', zIndex: 2147483647 }} onClick={e => e.stopPropagation()}>
                  <button className="btn-close  bi-x news-modal-close" onClick={() => setNewsModalOpen(false)}></button>
                  {/* Left Column: Title & Description */}
                  <div className="news-modal-left p-5 d-flex flex-column justify-content-center" style={{userSelect: 'none', flex: 1, minWidth: 0 }}>
                    <h2 className="fw-bold mb-3" style={{ color: '#0d6efd', fontSize: 32, lineHeight: 1.2 }}>{activeNews.title}</h2>
                    <p className="text-muted mb-2" style={{ fontSize: 15 }}>{activeNews.date ? new Date(activeNews.date).toLocaleDateString() : ""}</p>
                    <div style={{ fontSize: 18, color: '#333', fontWeight: 400, lineHeight: 1.6, fontFamily: 'inherit', maxHeight: 320, overflowY: 'auto', letterSpacing: 0.1, fontStyle: 'normal' }}>{activeNews.description}</div>
                    <Link to="/news" className="btn btn-outline-primary mt-4 align-self-start">Go to News Page</Link>
                  </div>
                  {/* Right Column: Image with Zoom & Scroll */}
                  <div className="news-modal-right d-flex flex-column align-items-center justify-content-center bg-light" style={{ flex: 1, minWidth: 0, borderLeft: '1px solid #e3e6ee', position: 'relative', padding: 0 }}>
                    <div style={{ position: 'relative', width: '100%', height: 420, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'auto' }}>
                      {activeNews.imageUrl ? (
                        <ZoomableImage src={activeNews.imageUrl} alt={activeNews.title} />
                      ) : (
                        <span className="bi bi-newspaper" style={{ fontSize: 64, color: '#0d6efd' }}></span>
                      )}
                    </div>
                  </div>
                </div>
              </div>,
              document.body
            )}
          </section>

          {/* Services Preview */}
          <section className="home-section services-section">
            <div className="container">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="section-title mb-0">Milestones of Compassion</h2>
                <Link to="/services" className="btn btn-outline-primary btn-sm">See All</Link>
              </div>
              <div className="row">
                {services.map((item, index) => (
                  <div className="col-md-4 mb-4" key={item.id}>
                    <div className="card home-card h-100 text-center animate-fade-slide" style={{ animationDelay: `${index * 0.12}s` }}>
                      {item.imageUrl && (
                        <img src={item.imageUrl} className="card-img-top" alt={item.title} style={{ objectFit: "cover", height: "140px" }} />
                      )}
                      <div className="card-body">
                        <h5 className="card-title mb-1">{item.title}</h5>
                        <p className="card-text mb-0">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Slider */}
          <HomeTestimonial/>

          <SmallContact />
        </div>
      </div>
    </PageTransition>
  );
}

export default Home;

// ZoomableImage component for modal (must be outside Home)
function ZoomableImage({ src, alt }) {
  const [zoom, setZoom] = React.useState(1);
  const [dragging, setDragging] = React.useState(false);
  const [origin, setOrigin] = React.useState({ x: 0, y: 0 });
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  const handleZoomChange = (e) => {
    setZoom(Number(e.target.value));
    setOffset({ x: 0, y: 0 }); // Reset pan when zoom changes
  };
  const handleMouseDown = e => {
    setDragging(true);
    setOrigin({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };
  const handleMouseUp = () => setDragging(false);
  const handleMouseMove = e => {
    if (dragging) {
      setOffset({ x: e.clientX - origin.x, y: e.clientY - origin.y });
    }
  };
  React.useEffect(() => {
    if (!dragging) return;
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          width: 380,
          height: 380,
          overflow: 'hidden',
          borderRadius: 24,
          boxShadow: '0 2px 8px #0d6efd22',
          background: '#fff',
          position: 'relative',
          cursor: dragging ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
        onMouseDown={handleMouseDown}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: zoom * 380,
            height: zoom * 380,
            objectFit: 'contain',
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            transition: dragging ? 'none' : 'transform 0.2s',
            pointerEvents: 'none',
          }}
          draggable={false}
        />
      </div>
      <input
        type="range"
        min={1}
        max={4}
        step={0.01}
        value={zoom}
        onChange={handleZoomChange}
        className="zoom-slider"
        style={{ width: 200, marginTop: 16 }}
      />
      <div
        style={{
          fontSize: 15,
          color: '#0d6efd',
          fontWeight: 500,
          marginTop: 4,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        Zoom: {zoom.toFixed(2)}x
      </div>
    </div>
  );
}
