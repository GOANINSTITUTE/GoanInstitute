import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import GoogleDriveImage from "./GoogleDriveImage";

function Notification({ message, type, onClose }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 2000,
        minWidth: 220,
        padding: "12px 24px",
        borderRadius: 8,
        background: type === "success" ? "#28a745" : "#dc3545",
        color: "#fff",
        fontWeight: 600,
        boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
        fontSize: 16,
        transition: "opacity 0.3s",
      }}
      role="alert"
    >
      {message}
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          marginLeft: 16,
          fontSize: 18,
          cursor: "pointer",
        }}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
}

function VisionImageManager() {
  const [image, setImage] = useState(null);
  const [notification, setNotification] = useState({ message: "", type: "success" });
  const [imageSource, setImageSource] = useState("cloudinary"); // 'cloudinary' or 'url'
  const [imageUrl, setImageUrl] = useState(""); // Final URL from GoogleDriveImage
  const docRef = doc(db, "visionImages", "visionImage"); // single document

  useEffect(() => {
    fetchVisionImage();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type }), 2500);
  };

  const fetchVisionImage = async () => {
    try {
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) setImage(snapshot.data().imageUrl);
      else setImage(null);
    } catch (error) {
      console.error("Error fetching image:", error);
      showNotification("Error fetching image", "error");
    }
  };

  const saveImageToFirestore = async (finalImageUrl) => {
    try {
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        await updateDoc(docRef, {
          imageUrl: finalImageUrl,
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(docRef, {
          imageUrl: finalImageUrl,
          uploadedAt: serverTimestamp(),
        });
      }

      showNotification("Image uploaded successfully!", "success");
      setImage(finalImageUrl);
      setImageUrl("");
    } catch (err) {
      console.error("Error saving image:", err);
      showNotification("Failed to save image", "error");
    }
  };

  const handleUpload = async () => {
    // 🔹 GOOGLE DRIVE (URL)
    if (imageSource === "url") {
      if (!imageUrl) {
        showNotification("Please provide a valid Google Drive image", "error");
        return;
      }
      saveImageToFirestore(imageUrl);
      return;
    }

    // 🔹 CLOUDINARY
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dqjcejidw",
        uploadPreset: "goanins",
      },
      async (error, result) => {
        if (!error && result && result.event === "success") {
          saveImageToFirestore(result.info.secure_url);
        } else if (error) {
          console.error("Cloudinary error:", error);
          showNotification("Upload failed!", "error");
        }
      }
    );
    myWidget.open();
  };

  return (
    <div className="container mt-4">
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: notification.type })}
      />

      <h3 className="mb-3">Vision Mission Background Image Manager</h3>

      {/* 🔹 Choose Image Source */}
      <div className="mb-3">
        <select
          className="form-select mb-2"
          value={imageSource}
          onChange={(e) => setImageSource(e.target.value)}
        >
          <option value="cloudinary">Use Cloudinary Upload</option>
          <option value="url">Use Google Drive Image</option>
        </select>

        {/* 🔹 Google Drive Component */}
        {imageSource === "url" && (
          <GoogleDriveImage onImageReady={(url) => setImageUrl(url)} />
        )}

        <button className="btn btn-success mt-2" onClick={handleUpload}>
          {image ? "Change Background Image" : "Upload Background Image"}
        </button>
      </div>

      <div className="mt-4 mb-5 text-center">
        {image ? (
          <div className="card mx-auto" style={{ maxWidth: "400px" }}>
            <img
              src={image}
              className="card-img-top"
              alt="Vision"
              style={{ maxHeight: "300px", objectFit: "cover" }}
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/400x300?text=Image+Unavailable";
              }}
            />
            <div className="card-body">
              <p className="card-text">Current Background Image</p>
            </div>
          </div>
        ) : (
          <p>No Vision image uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default VisionImageManager;