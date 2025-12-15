import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

function HeroMediaManager() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  // 🔹 Fetch hero media
  const fetchItems = async () => {
    try {
      const snapshot = await getDocs(collection(db, "hero-backgrounds"));
      const data = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setItems(data);
    } catch (error) {
      console.error("Error fetching media:", error);
    }
  };

  // 🔹 Upload new media
  const handleUpload = () => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dqjcejidw",
        uploadPreset: "goanins",
        resourceType: "auto",
        multiple: false,
      },
      async (error, result) => {
        if (!error && result?.event === "success") {
          await addDoc(collection(db, "hero-backgrounds"), {
            url: result.info.secure_url,
            type: result.info.resource_type,
            uploadedAt: new Date(),
          });
          alert("Media added!");
          fetchItems();
        }
      }
    );
    widget.open();
  };

  // 🔹 UPDATE media
  const handleUpdate = (id) => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dqjcejidw",
        uploadPreset: "goanins",
        resourceType: "auto",
        multiple: false,
      },
      async (error, result) => {
        if (!error && result?.event === "success") {
          await updateDoc(doc(db, "hero-backgrounds", id), {
            url: result.info.secure_url,
            type: result.info.resource_type,
            updatedAt: new Date(),
          });
          alert("Media updated!");
          fetchItems();
        }
      }
    );
    widget.open();
  };

  // 🔹 Delete media
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "hero-backgrounds", id));
    alert("Media deleted!");
    fetchItems();
  };

  return (
    <div className="container mt-4">
      <h3 className="fw-bold text-primary mb-3">Hero Background Media</h3>

      <button className="btn btn-success mb-4" onClick={handleUpload}>
        Upload Image / Video
      </button>

      <div className="row">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="col-md-4 col-lg-3 mb-4">
              <div className="card shadow-sm border-0">
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
                    alt="Hero"
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                )}

                <div className="card-body d-flex justify-content-between">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleUpdate(item.id)}
                  >
                    Update
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted">No media added yet</p>
        )}
      </div>
    </div>
  );
}

export default HeroMediaManager;
