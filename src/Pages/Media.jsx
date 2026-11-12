
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion";

import { db } from "../firebase-config";
import AnimatedHero from "../Components/AnimatedHero";
import PageTransition from "../Components/PageTransition";

// --------------------------------------------------
// Identify Video Platform
// --------------------------------------------------

const getVideoType = (url) => {
  if (!url) return null;

  if (
    url.includes("youtube.com") ||
    url.includes("youtu.be")
  ) {
    return "youtube";
  }

  if (url.includes("instagram.com")) {
    return "instagram";
  }

  return null;
};

// --------------------------------------------------
// Convert YouTube URL into Embed URL
// --------------------------------------------------

const getEmbedUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    const type = getVideoType(url);

    if (type === "youtube") {
      let videoId = "";

      // Already an embed URL
      if (parsedUrl.pathname.includes("/embed/")) {
        videoId = parsedUrl.pathname
          .split("/embed/")[1]
          .split("/")[0];
      }

      // YouTube Shorts
      else if (parsedUrl.pathname.includes("/shorts/")) {
        videoId = parsedUrl.pathname
          .split("/shorts/")[1]
          .split("/")[0];
      }

      // Short YouTube URL
      else if (parsedUrl.hostname.includes("youtu.be")) {
        videoId = parsedUrl.pathname.substring(1).split("/")[0];
      }

      // Normal YouTube URL
      else {
        videoId = parsedUrl.searchParams.get("v");
      }

      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : null;
    }

    return null;

  } catch (error) {
    console.error("Invalid video URL:", error);
    return null;
  }
};

// --------------------------------------------------
// Instagram Embed Component
// --------------------------------------------------

function InstagramEmbed({ url }) {
  useEffect(() => {
    const processInstagram = () => {
      if (window.instgrm?.Embeds) {
        window.instgrm.Embeds.process();
      }
    };

    const scriptId = "instagram-embed-script";
    let script = document.getElementById(scriptId);

    if (window.instgrm?.Embeds) {
      processInstagram();
      return;
    }

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;

      script.onload = processInstagram;

      document.body.appendChild(script);
    } else {
      script.addEventListener("load", processInstagram);
    }

    return () => {
      script?.removeEventListener("load", processInstagram);
    };
  }, [url]);

  // Convert old Instagram embed URLs to original post URLs
  const getInstagramUrl = (url) => {
    try {
      const parsedUrl = new URL(url);

      const match = parsedUrl.pathname.match(
        /\/(p|reel|tv)\/([^/]+)/
      );

      if (!match) return null;

      return `https://www.instagram.com/${match[1]}/${match[2]}/`;
    } catch {
      return null;
    }
  };

  const instagramUrl = getInstagramUrl(url);

  if (!instagramUrl) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        Invalid Instagram URL.
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        overflow: "hidden",
      }}
    >
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={instagramUrl}
        data-instgrm-version="14"
        style={{
          background: "#fff",
          border: 0,
          borderRadius: "8px",
          margin: "0 auto",
          padding: 0,
          width: "100%",
          maxWidth: "540px",
          minWidth: 0,
        }}
      >
        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
        >
          View this Instagram post
        </a>
      </blockquote>
    </div>
  );
}

// --------------------------------------------------
// Loading Component
// --------------------------------------------------

const Loader = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "250px",
    }}
  >
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

// --------------------------------------------------
// Main Media Page
// --------------------------------------------------

export default function Media() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Media from Firestore
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError("");

        const snapshot = await getDocs(
          collection(db, "mediaItems")
        );

        const mediaList = snapshot.docs
          .map((document) => ({
            id: document.id,
            ...document.data(),
          }))
          .filter(
            (video) =>
              video.url &&
              video.isPublished !== false
          )
          .sort(
            (a, b) =>
              (a.order || 0) - (b.order || 0)
          );

        setVideos(mediaList);

      } catch (error) {
        console.error("Error fetching media:", error);
        setError(
          "Unable to load media. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, []);

  return (
    <PageTransition className="media-page">

      {/* Hero Section */}

      <AnimatedHero
        title="Our Media"
        subtitle="Explore our videos, moments, achievements and activities."
        className="media-hero"
        overlayColor="rgba(220,53,69,0.08)"
      />

      

      {/* Media Gallery */}

      <section
        style={{
          maxWidth: "1200px",
          margin: "auto",
          padding: "20px 25px 60px",
        }}
      >

        {loading ? (
          <Loader />

        ) : error ? (
          <p className="text-center text-danger">
            {error}
          </p>

        ) : videos.length === 0 ? (
          <div
            className="text-center"
            style={{ padding: "50px 20px" }}
          >
            <h4>No Media Available</h4>

            <p className="text-muted">
              Videos will appear here once they are published.
            </p>
          </div>

        ) : (

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(min(100%, 326px), 1fr))",
              gap: "30px",
              alignItems: "start",
            }}
          >

            {videos.map((video, index) => {
              const type =
                video.type || getVideoType(video.url);

              const embedUrl = getEmbedUrl(video.url);

              return (
                <motion.article
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                  }}
                  style={{
                    background: "var(--secondary-light-opaced)",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.10)",
                    height: "fit-content",
                  }}
                >

                  {/* Video Embed */}

                  {type === "instagram" ? (

                    <InstagramEmbed url={video.url} />

                  ) : type === "youtube" && embedUrl ? (

                    <div
                      style={{
                        width: "100%",
                        position: "relative",
                        paddingBottom: "56.25%",
                        background: "#000",
                      }}
                    >
                      <iframe
                        src={embedUrl}
                        title={video.title || "Media video"}
                        allowFullScreen
                        allow="autoplay; encrypted-media; picture-in-picture"
                        loading="lazy"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          border: "none",
                        }}
                      />
                    </div>

                  ) : (

                    <div
                      style={{
                        padding: "30px",
                        textAlign: "center",
                      }}
                    >
                      Unable to display this video.
                    </div>

                  )}

                  {/* Video Details */}

                  <div style={{ padding: "18px" }}>

                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "var(--primary)",
                        textTransform: "uppercase",
                      }}
                    >
                      {type === "youtube"
                        ? "YouTube"
                        : "Instagram"}
                    </span>

                    <h5
                      style={{
                        fontWeight: "700",
                        marginTop: "8px",
                        color: "var(--text-dark)",
                      }}
                    >
                      {video.title}
                    </h5>

                    {video.description && (
                      <p
                        style={{
                          fontSize: "14px",
                          color: "var(--text-dark-light)",
                          lineHeight: "1.6",
                          marginBottom: 0,
                        }}
                      >
                        {video.description}
                      </p>
                    )}

                  </div>

                </motion.article>
              );
            })}

          </div>
        )}

      </section>

    </PageTransition>
  );
}
