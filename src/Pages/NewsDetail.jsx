import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import "./CSS/NewsDetail.css";
import PageTransition from '../Components/PageTransition';

const formatDate = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.seconds
    ? new Date(timestamp.seconds * 1000)
    : new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const relativeTime = (timestamp) => {
  if (!timestamp) return "";
  const date = timestamp.seconds
    ? new Date(timestamp.seconds * 1000)
    : new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay > 7) return formatDate(timestamp);
  if (diffDay >= 1) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
  if (diffHr >= 1) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
  if (diffMin >= 1) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
  return 'Just now';
};

function CustomImageModal({ src, alt, caption, onClose }) {
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [start, setStart] = useState({ x: 0, y: 0 });
  const [imgOffset, setImgOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=' || e.key.toLowerCase() === 'i') {
        setZoomLevel(z => Math.min(z + 0.5, 3));
      }
      if (e.key === '-' || e.key === '_' || e.key.toLowerCase() === 'o') {
        setZoomLevel(z => {
          const newZ = Math.max(z - 0.5, 1);
          if (newZ === 1) setOffset({ x: 0, y: 0 });
          return newZ;
        });
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleMouseDown = e => {
    if (zoomLevel <= 1) return;
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
    setImgOffset(offset);
    document.body.style.cursor = "grabbing";
  };
  const handleMouseMove = e => {
    if (zoomLevel <= 1 || !dragging) return;
    setOffset({
      x: imgOffset.x + (e.clientX - start.x),
      y: imgOffset.y + (e.clientY - start.y),
    });
  };
  const handleMouseUp = () => {
    setDragging(false);
    document.body.style.cursor = "";
  };
  const handleTouchStart = e => {
    if (zoomLevel <= 1) return;
    const touch = e.touches[0];
    setDragging(true);
    setStart({ x: touch.clientX, y: touch.clientY });
    setImgOffset(offset);
  };
  const handleTouchMove = e => {
    if (zoomLevel <= 1 || !dragging) return;
    const touch = e.touches[0];
    setOffset({
      x: imgOffset.x + (touch.clientX - start.x),
      y: imgOffset.y + (touch.clientY - start.y),
    });
  };
  const handleTouchEnd = () => setDragging(false);

  const zoomIn = () => setZoomLevel(z => Math.min(z + 0.5, 3));
  const zoomOut = () => setZoomLevel(z => {
    const newZ = Math.max(z - 0.5, 1);
    if (newZ === 1) setOffset({ x: 0, y: 0 });
    return newZ;
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="custom-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" tabIndex={-1}>
      <div className="custom-modal-content" onClick={e => e.stopPropagation()}>
        <button className="custom-modal-close" onClick={onClose} aria-label="Close image viewer">&times;</button>

        {loading && <div className="custom-modal-loader" aria-label="Loading image"><div className="spinner" /></div>}

        <img
          src={src}
          alt={alt}
          className={`custom-modal-image ${loading ? 'hidden' : 'visible'}`}
          onLoad={() => setLoading(false)}
          onError={() => setLoading(false)}
          draggable={false}
          style={{
            transform: `scale(${zoomLevel}) translate(${offset.x / zoomLevel}px,${offset.y / zoomLevel}px)`,
            cursor: zoomLevel > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in',
            transition: dragging ? 'none' : 'transform 0.18s cubic-bezier(.29,1.04,.6,.87)',
          }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          tabIndex={0}
          title={`Zoom level: ${zoomLevel.toFixed(1)}x`}
        />
        {caption && <div className="custom-modal-caption">{caption}</div>}

        <div className="custom-zoom-controls" aria-label="Zoom controls">
          <button
            className="zoom-btn"
            onClick={zoomIn}
            disabled={zoomLevel >= 3}
            aria-label="Zoom In"
            type="button"
            tabIndex={0}
          >＋</button>
          <button
            className="zoom-btn"
            onClick={zoomOut}
            disabled={zoomLevel <= 1}
            aria-label="Zoom Out"
            type="button"
            tabIndex={0}
          >－</button>
        </div>
      </div>
    </div>
  );
}

const NewsDetail = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        setLoading(true);
        setError(null);
        setNewsItem(null);
        const docRef = doc(db, "news", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setNewsItem({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("News article not found");
        }
      } catch (err) {
        console.error("Error fetching news item:", err);
        setError("Failed to load news article");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container-fluid py-5 d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '70vh' }}>
        <div className="alert alert-danger w-100 mw-100" style={{ maxWidth: 480 }}>
          <h3>{error}</h3>
          <Link to="/news" className="btn btn-primary mt-3">Back to News</Link>
        </div>
      </div>
    );
  }
  if (!newsItem) {
    return (
      <div className="container-fluid py-5 d-flex flex-column align-items-center justify-content-center text-center" style={{ minHeight: '70vh' }}>
        <div className="alert alert-warning w-100 mw-100" style={{ maxWidth: 480 }}>
          <h3>News article not found</h3>
          <Link to="/news" className="btn btn-primary mt-3">Back to News</Link>
        </div>
      </div>
    );
  }
  return (
    <PageTransition>
      <main className="news-detail-page" role="main">
        <article className="news-detail-wrapper">
          <header className="news-header">
            <Link to="/news" className="btn btn-outline-primary back-btn" aria-label="Back to News List">
              <i className="bi bi-arrow-left"></i> Back to News
            </Link>
            <div className="news-published" aria-label="Published date">
              <time dateTime={newsItem.timestamp ? new Date(newsItem.timestamp.seconds * 1000).toISOString() : ''}>
                {relativeTime(newsItem.timestamp)}
              </time>
            </div>
          </header>
          <h1 className="news-title">{newsItem.title}</h1>
          <section className="news-meta">
            {newsItem.author && (
              <div className="news-author" aria-label="Author">
                <i className="bi bi-person-circle"></i> By <strong>{newsItem.author}</strong>
              </div>
            )}
            {newsItem.tags && newsItem.tags.length > 0 && (
              <ul className="news-tags" aria-label="Tags">
                {newsItem.tags.map((tag, idx) => (
                  <li key={idx} className="badge bg-primary">{tag.toUpperCase()}</li>
                ))}
              </ul>
            )}
          </section>
          {newsItem.imageUrl && (
            <figure className="news-image-figure" tabIndex={0} aria-label="News main image. Click to open zoom viewer">
              <img
                src={newsItem.imageUrl}
                alt={newsItem.title}
                onClick={() => setModalOpen(true)}
                className="news-image loaded"
                loading="lazy"
                role="button"
                aria-pressed={modalOpen}
                title="Click to zoom"
                style={{ cursor:"zoom-in" }}
              />
              {newsItem.imageCaption && <figcaption className="image-caption">{newsItem.imageCaption}</figcaption>}
            </figure>
          )}
          {newsItem.shortDescription && (
            <p className="news-short-desc">{newsItem.shortDescription}</p>
          )}
          <section className="news-content" aria-label="News Article Content">
            {newsItem.description}
          </section>
          {newsItem.sourceUrl && (
            <footer className="news-source">
              <h2 className="source-title">Source</h2>
              <a
                href={newsItem.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary source-btn"
                aria-label="Visit source link"
              >
                <i className="bi bi-box-arrow-up-right"></i> Visit Source
              </a>
            </footer>
          )}
        </article>
        {modalOpen && newsItem.imageUrl && (
          <CustomImageModal
            src={newsItem.imageUrl}
            alt={newsItem.title}
            caption={newsItem.imageCaption}
            onClose={() => setModalOpen(false)}
          />
        )}
      </main>
    </PageTransition>
  );
};

export default NewsDetail;
