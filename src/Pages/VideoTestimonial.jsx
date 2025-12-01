import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

export default function VideoTestimonial() {
  const [videos, setVideos] = useState([]);

  const getEmbedUrl = (url) => {
    try {
      const u = new URL(url);
      if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
        return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
      }
      if (u.hostname.includes("youtu.be")) {
        return `https://www.youtube.com/embed/${u.pathname.substring(1)}`;
      }
      return url;
    } catch {
      return url;
    }
  };

  useEffect(() => {
    const fetchVideos = async () => {
      const querySnapshot = await getDocs(collection(db, "videoTestimonials"));
      const videoList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVideos(videoList);
    };

    fetchVideos();
  }, []);

  return (
    <div style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "grid",
          gap: "25px",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        }}
      >
        {videos.map((video) => (
          <div
            key={video.id}
            style={{
              background: "var(--secondary-light-opaced)",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              overflow: "hidden",
              paddingBottom: "20px",
            }}
          >
            {/* Video Container (keeps perfect 16:9) */}
            <div
              style={{
                width: "100%",
                position: "relative",
                paddingBottom: "56.25%", // 16:9 ratio
                background: "#000",
              }}
            >
              <iframe
                src={getEmbedUrl(video.url)}
                title={video.title}
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              ></iframe>
            </div>

            {/* Title */}
            <h4
              style={{
                fontWeight: "600",
                marginTop: "15px",
                textAlign: "center",
                fontSize: "18px",
              }}
            >
              {video.title}
            </h4>
          </div>
        ))}
      </div>
    </div>
  );
}
