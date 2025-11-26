import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

/* 🔔 Simple Notification */
function Notification({ message, type }) {
  if (!message) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        background: type === "success" ? "#28a745" : "#dc3545",
        color: "white",
        padding: "12px 20px",
        borderRadius: 6,
        zIndex: 999,
        fontWeight: "600",
      }}
    >
      {message}
    </div>
  );
}

export default function GICEProfileManager() {
  const [category, setCategory] = useState("");
  const [items, setItems] = useState([]);
  const [notification, setNotification] = useState({
    message: "",
    type: "success",
  });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type }), 2500);
  };

  /* Fetch All Profile Images */
  const fetchItems = async () => {
    try {
      const snapshot = await getDocs(collection(db, "giceProfiles"));
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(data);
    } catch (error) {
      console.log("Error fetching:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* Upload to Cloudinary + Store in Firestore */
  const handleUpload = async () => {
    if (!category) return showNotification("Select a category!", "error");

    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dgxhp09em",
        uploadPreset: "unsigned_preset",
      },
      async (error, result) => {
        if (!error && result && result.event === "success") {
          const imageUrl = result.info.secure_url;

          try {
            // Check if category already has image
            const q = query(
              collection(db, "giceProfiles"),
              where("category", "==", category)
            );
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
              // Update existing document
              const docId = snapshot.docs[0].id;
              const docRef = doc(db, "giceProfiles", docId);
              await updateDoc(docRef, {
                imageUrl,
                updatedAt: serverTimestamp(),
              });
              showNotification("Image updated!", "success");
            } else {
              // Add new document
              await addDoc(collection(db, "giceProfiles"), {
                category,
                imageUrl,
                createdAt: serverTimestamp(),
              });
              showNotification("Image uploaded!", "success");
            }

            fetchItems();
          } catch (err) {
            console.log("Firestore save error:", err);
            showNotification("Failed to save!", "error");
          }
        }
      }
    );

    myWidget.open();
  };

  /* Delete image */
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "giceProfiles", id));
      showNotification("Image deleted!", "success");
      fetchItems();
    } catch (error) {
      console.log("Delete error:", error);
      showNotification("Delete failed!", "error");
    }
  };

  /* Categories Only 3 */
  const categories = [
    "eduservicesbackground",
    "operationsbackground",
    "footerbackground",
  ];

  return (
    <div className="container mt-4">
      <Notification message={notification.message} type={notification.type} />

      <h3 className="mb-3">GICE Profile Manager</h3>

      {/* Upload Area */}
      <div className="card p-3 mb-4">
        <select
          className="form-select mb-3"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <button className="btn btn-primary" onClick={handleUpload}>
          Upload Image
        </button>
      </div>

      {/* Display Existing Images */}
      <div className="row">
        {categories.map((cat) => {
          const item = items.find((i) => i.category === cat);
          return (
            <div className="col-md-4 mb-4" key={cat}>
              <div className="card shadow-sm h-100">
                <div className="card-body text-center">
                  <h5 className="text-primary">{cat}</h5>

                  {item ? (
                    <>
                      <img
                        src={item.imageUrl}
                        alt={cat}
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                          borderRadius: 8,
                          marginTop: 10,
                        }}
                      />

                      <button
                        className="btn btn-danger mt-3"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <p className="text-muted mt-3">No image uploaded yet.</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
