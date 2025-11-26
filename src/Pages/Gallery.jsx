import React, { useEffect, useState, useRef } from "react";
import {
  collection,
  getDocs,
  query,
  limit,
  startAfter,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase-config";
import AnimatedHero from "../Components/AnimatedHero";
import PageTransition from "../Components/PageTransition";
import "./CSS/Gallery.css";

const PAGE_SIZE = 12;

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);

  const observerRef = useRef(null);
  const isFetchingRef = useRef(false); // 🔥 prevents double fetch

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    if (loading || allLoaded || isFetchingRef.current) return;

    isFetchingRef.current = true; // block re-entry
    setLoading(true);

    const ref = collection(db, "giceGallery");

    let q = query(ref, orderBy("createdAt", "desc"), limit(PAGE_SIZE));

    if (lastDoc) {
      q = query(
        ref,
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
    }

    const snap = await getDocs(q);

    if (snap.empty) {
      setAllLoaded(true);
      setLoading(false);
      isFetchingRef.current = false;
      return;
    }

    let newImages = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 🔥 Remove duplicates based on ID
    newImages = newImages.filter(
      (item) => !images.some((img) => img.id === item.id)
    );

    setImages((prev) => [...prev, ...newImages]);
    setLastDoc(snap.docs[snap.docs.length - 1]);

    setLoading(false);
    isFetchingRef.current = false;
  };

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading) {
        loadImages();
      }
    });

    const target = document.getElementById("loadMore");
    if (target) observerRef.current.observe(target);

    return () => observerRef.current.disconnect();
  }, [lastDoc, loading]);

  return (
    <PageTransition className="gallery-page">
      <div className="hero-parallax">
        <AnimatedHero
          title="GICE Family"
          subtitle="A family that grows together stays together."
          overlayColor="rgba(102,126,234,0.1)"
        />
      </div>

      <div className="container py-5">
        <h2 className="text-center mb-4 fw-bold">Our Gallery</h2>

        <div className="gallery-grid">
          {images.map((img) => (
            <div key={img.id} className="gallery-item">
              <img src={img.imageUrl} alt={img.title} loading="lazy" />
              <div className="overlay">
                <h5>{img.title}</h5>
              </div>
            </div>
          ))}
        </div>

        <div id="loadMore" style={{ height: "40px" }} />

        {loading && <p className="text-center mt-3">Loading...</p>}
        {allLoaded && <p className="text-center mt-3">No more images</p>}
      </div>
    </PageTransition>
  );
};

export default Gallery;
