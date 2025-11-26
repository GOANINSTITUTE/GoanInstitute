import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

function HeroMediaManager() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  // 🔹 Fetch all hero background media
  const fetchItems = async () => {
    try {
      const snapshot = await getDocs(collection(db, "hero-backgrounds"));
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setItems(data);
    } catch (error) {
      console.error("❌ Error fetching hero media:", error);
    }
  };

  // 🔹 Upload new hero background (image or video)
  const handleUpload = () => {
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dgxhp09em",
        uploadPreset: "unsigned_preset",
        sources: ["local", "url", "camera"],
        multiple: false,
        maxFileSize: 50000000, // 50MB
        resourceType: "auto", // <--- allows both image and video
      },
      async (error, result) => {
        if (!error && result && result.event === "success") {
          try {
            const newUrl = result.info.secure_url;
            const mediaType = result.info.resource_type; // "image" or "video"
            await addDoc(collection(db, "hero-backgrounds"), {
              url: newUrl,
              type: mediaType,
              uploadedAt: new Date(),
            });
            alert("✅ Media added successfully!");
            fetchItems();
          } catch (err) {
            console.error("🔥 Firestore error:", err);
            alert("Failed to save media. Check console for details.");
          }
        } else if (error) {
          console.error("❌ Cloudinary upload error:", error);
        }
      }
    );
    myWidget.open();
  };

  // 🔹 Delete hero media
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "hero-backgrounds", id));
      fetchItems();
      alert("🗑️ Media deleted!");
    } catch (error) {
      console.error("❌ Error deleting hero media:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3 fw-bold text-primary">Hero Background Media</h3>

      {/* Upload button */}
      <button
        className="btn btn-success mb-4 px-4 py-2"
        style={{ borderRadius: "10px" }}
        onClick={handleUpload}
      >
        <i className="bi bi-cloud-upload me-2"></i> Upload Image / Video
      </button>

      {/* Media Grid */}
      <div className="row">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="col-md-4 col-lg-3 mb-4">
              <div
                className="card shadow-sm border-0"
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  backgroundColor: "#f8f9fa",
                }}
              >
                {item.type === "video" ? (
                  <video
                    src={item.url}
                    className="card-img-top"
                    controls
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                ) : (
                  <img
                    src={item.url}
                    className="card-img-top"
                    alt="Hero Background"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body text-center">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <i className="bi bi-trash me-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-muted text-center mt-4">
            <p>No media added yet. Upload some!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HeroMediaManager;
