import React, { useEffect, useState, useCallback } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import "./CSS/Gallery.css";
import AnimatedHero from "../Components/AnimatedHero";
import PageTransition from "../Components/PageTransition";

const Loader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
    <div 
      style={{ 
        width: 48, 
        height: 48, 
        border: '5px solid #eee', 
        borderTop: '5px solid #0d6efd', 
        borderRadius: '50%', 
        animation: 'spin 1s linear infinite' 
      }} 
    />
    <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
  </div>
);

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTrack, setModalTrack] = useState([]);  // The catItems array in modal
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "gallery"));
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setItems(data);
        const cats = Array.from(new Set(data.map(item => item.category).filter(Boolean)));
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // For each row: get images in this category
  const getItemsByCategory = (cat) => items.filter(item => item.category === cat);

  // Open modal for idx in catItems of this row
  const handleImageClick = (catItems, idx) => {
    setModalTrack(catItems);
    setCurrentIndex(idx);
    setModalOpen(true);
  };

  // Memoized prevImage function to fix ESLint warning
  const prevImage = useCallback((e) => {
    e && e.stopPropagation();
    setCurrentIndex(idx => (idx - 1 + modalTrack.length) % modalTrack.length);
  }, [modalTrack.length]);

  // Memoized nextImage function to fix ESLint warning
  const nextImage = useCallback((e) => {
    e && e.stopPropagation();
    setCurrentIndex(idx => (idx + 1) % modalTrack.length);
  }, [modalTrack.length]);


  // Keyboard navigation effect depends on modalOpen, prevImage, nextImage
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prevImage();
      else if (e.key === "ArrowRight") nextImage();
      else if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, prevImage, nextImage]);

  return (
    <PageTransition className="gallery-page bg-light">
      <AnimatedHero 
        title="Gallery"
        subtitle="Empowering communities, nurturing nature, and preserving culture for a sustainable future."
        className="gallery-hero"
        overlayColor="rgba(243,38,140,0.15)"
      />
      <div className="container py-5">
        {loading ? <Loader /> : (
          <>
            {categories.length === 0 ? (
              <div className="text-center text-muted py-5">No images found.</div>
            ) : (
              categories.map((cat, idx) => {
                const catItems = getItemsByCategory(cat);
                if (catItems.length === 0) return null;
                const isReverse = idx % 2 === 1;
                return (
                  <div key={cat} className="gallery-category-section mb-5">
                    <h2 className="section-title mb-3">{cat}</h2>
                    <div className="scroller-wrapper">
                      <div
                        className={`scroller-track${isReverse ? " scroller-track-reverse" : ""}`}
                        style={{
                          animationDuration: `${100 + idx * 10}s`
                        }}
                      >
                        {[...catItems, ...catItems].map((item, i) => (
                          <div 
                            key={`${item.id}-${i}`} 
                            className="scroller-item" 
                            onClick={() => handleImageClick(catItems, i % catItems.length)}
                            style={{ cursor: 'pointer' }}
                          >
                            <img src={item.imageUrl} alt={item.title || "Gallery image"} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })
            )}

            {/* Image Modal */}
            {modalOpen && modalTrack[currentIndex] && (
              <div
                className="gallery-modal"
                style={{
                  position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                  background: 'rgba(20,30,48,0.85)', zIndex: 2000, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexDirection: 'column'
                }}
                onClick={() => setModalOpen(false)}
              >
                <button
                  aria-label="Close"
                  onClick={() => setModalOpen(false)}
                  style={{
                    position: 'absolute', top: 24, right: 32, fontSize: 32,
                    color: '#fff', background: 'none', border: 'none', zIndex: 2010, cursor: 'pointer'
                  }}
                >
                  &times;
                </button>
                <div
                  style={{
                    background: '#fff', borderRadius: 18, boxShadow: '0 8px 32px rgba(0,0,0,0.20)',
                    padding: 0, maxWidth: 920, width: '98vw', minHeight: 350, display: 'flex',
                    flexDirection: 'column', alignItems: 'center'
                  }}
                  onClick={e => e.stopPropagation()}
                >
                  <div style={{ position: 'relative', width: "100%", textAlign: 'center', background: '#222', borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
                    <img
                      src={modalTrack[currentIndex].imageUrl}
                      alt={modalTrack[currentIndex].title}
                      style={{
                        maxHeight: '60vh',
                        maxWidth: '100%',
                        objectFit: 'contain',
                        borderRadius: '18px 18px 0 0',
                        background: '#222'
                      }}
                    />
                    {/* Prev Arrow */}
                    <button
                      aria-label="Previous"
                      onClick={prevImage}
                      style={{
                        position: 'absolute', top: '50%', left: 24, transform: 'translateY(-50%)',
                        fontSize: 38, color: '#fff', background: '#0d6efdcc', border: 'none',
                        borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2010, cursor: 'pointer', boxShadow: '0 2px 8px #0d6efd33'
                      }}
                    >
                      &#8592;
                    </button>
                    {/* Next Arrow */}
                    <button
                      aria-label="Next"
                      onClick={nextImage}
                      style={{
                        position: 'absolute', top: '50%', right: 24, transform: 'translateY(-50%)',
                        fontSize: 38, color: '#fff', background: '#0d6efdcc', border: 'none',
                        borderRadius: '50%', width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2010, cursor: 'pointer', boxShadow: '0 2px 8px #0d6efd33'
                      }}
                    >
                      &#8594;
                    </button>
                  </div>
                  <div style={{ padding: '1.5rem', width: '100%', textAlign: 'center' }}>
                    <h4>{modalTrack[currentIndex].title}</h4>
                    <p className="text-muted mb-0">{modalTrack[currentIndex].description}</p>
                  </div>
                  {/* Thumbnail previews for prev/next */}
                  <div style={{
                    display: 'flex', gap: 18, justifyContent: 'center', alignItems: 'center', margin: '0 0 1.5rem 0'
                  }}>
                    {/* Smaller prev image */}
                    {modalTrack.length > 1 && (
                      <img
                        src={modalTrack[(currentIndex - 1 + modalTrack.length) % modalTrack.length].imageUrl}
                        alt="Previous"
                        onClick={prevImage}
                        style={{
                          width: 72, height: 54, objectFit: 'cover', borderRadius: 12, border: '2px solid #aaa', cursor: 'pointer', opacity: 0.8,
                          boxShadow: '0 2px 8px #aaa4'
                        }}
                      />
                    )}
                    <span style={{
                      display: 'inline-block', width: 18, fontWeight: 700, fontSize: 18, color: '#0d6efd', userSelect: "none"
                    }}>&#8596;</span>
                    {/* Smaller next image */}
                    {modalTrack.length > 1 && (
                      <img
                        src={modalTrack[(currentIndex + 1) % modalTrack.length].imageUrl}
                        alt="Next"
                        onClick={nextImage}
                        style={{
                          width: 72, height: 54, objectFit: 'cover', borderRadius: 12, border: '2px solid #aaa', cursor: 'pointer', opacity: 0.8,
                          boxShadow: '0 2px 8px #aaa4'
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default Gallery;
