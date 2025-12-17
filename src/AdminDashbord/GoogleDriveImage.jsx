// src/components/GoogleDriveImage.jsx
import React, { useState, useEffect } from "react";

/* ---------------- Helper: Convert Drive URL ---------------- */
const convertGoogleDriveUrl = (url) => {
  if (!url) return "";

  // match /d/FILE_ID
  let match = url.match(/\/d\/([^/]+)/);

  // match ?id=FILE_ID
  if (!match) {
    match = url.match(/[?&]id=([^&]+)/);
  }

  if (match && match[1]) {
    // ✅ Google image CDN (most reliable)
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }

  return "";
};

/* ---------------- Component ---------------- */
export default function GoogleDriveImage({ onImageReady }) {
  const [inputUrl, setInputUrl] = useState("");
  const [finalUrl, setFinalUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!inputUrl) {
      setFinalUrl("");
      setError("");
      return;
    }

    const converted = convertGoogleDriveUrl(inputUrl);

    if (!converted) {
      setError("Invalid Google Drive link");
      setFinalUrl("");
      return;
    }

    setError("");
    setFinalUrl(converted);
    onImageReady(converted); // 🔥 send to parent
  }, [inputUrl, onImageReady]);

  return (
    <div className="mb-3">
      <input
        type="text"
        className="form-control mb-2"
        placeholder="Paste Google Drive image link"
        value={inputUrl}
        onChange={(e) => setInputUrl(e.target.value)}
      />

      {error && <small className="text-danger">{error}</small>}

      {finalUrl && (
        <div className="mt-2">
          <p className="mb-1 text-success">Image Preview:</p>
          <img
            src={finalUrl}
            alt="Preview"
            style={{
              width: "100%",
              maxHeight: 220,
              objectFit: "cover",
              borderRadius: 8,
              border: "1px solid #ddd",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://via.placeholder.com/400x300?text=Invalid+Image";
            }}
          />
        </div>
      )}
    </div>
  );
}
