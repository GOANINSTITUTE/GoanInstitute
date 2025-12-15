// ProfileModal.jsx
import React, { useState, useEffect } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const defaultAvatar = "/default-avatar.png";

export default function ProfileModal({ show, onClose, currentImage, onUpdate, userId }) {
  const [previewUrl, setPreviewUrl] = useState(currentImage || defaultAvatar);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setPreviewUrl(currentImage || defaultAvatar);
  }, [currentImage]);

  const openUploadWidget = () => {
    if (!window.cloudinary) {
      setError("Cloudinary widget is not loaded.");
      return;
    }
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dqjcejidw",
  uploadPreset: "goanins",
        multiple: false,
        cropping: false,
        folder: "adminProfileIcons",
        sources: ["local", "url", "camera"],
        maxFileSize: 2000000, // 2MB
        clientAllowedFormats: ["png", "jpg", "jpeg", "gif"]
      },
      async (error, result) => {
        if (error) {
          setError("Upload error: " + error.message);
          setUploading(false);
          return;
        }
        if (result.event === "success") {
          try {
            setUploading(true);
            const imageUrl = result.info.secure_url;

            const db = getFirestore();
            await setDoc(
              doc(db, "adminUsers", userId),
              { profileImageUrl: imageUrl },
              { merge: true }
            );

            onUpdate(imageUrl);
            setPreviewUrl(imageUrl);
            setError("");
            onClose();
          } catch (e) {
            setError("Error saving profile image URL.");
          } finally {
            setUploading(false);
          }
        }
      }
    );

    widget.open();
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{
        display: "block",
        position: "fixed",
        zIndex: 2000,
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.3)",
        overflowY: "auto",
      }}
    >
      <div
        className="modal-dialog"
        role="document"
        style={{ marginTop: "10vh", maxWidth: 400 }}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Change Profile Icon</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => {
                setError("");
                onClose();
              }}
              disabled={uploading}
            />
          </div>
          <div className="modal-body text-center">
            <img
              src={previewUrl}
              alt="Profile Preview"
              style={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ddd",
                marginBottom: 16,
              }}
            />
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <button
              className="btn btn-primary w-100"
              onClick={openUploadWidget}
              disabled={uploading}
              title="Click to select and upload a new profile icon"
            >
              {uploading ? "Uploading..." : "Upload New Profile Icon"}
            </button>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setError("");
                onClose();
              }}
              disabled={uploading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
