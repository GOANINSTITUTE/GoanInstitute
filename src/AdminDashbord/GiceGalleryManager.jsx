import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
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

export default function GiceGalleryManager() {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [notification, setNotification] = useState({
    message: "",
    type: "success",
  });

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type }), 2500);
  };

  /* 🔹 Fetch All Gallery Items */
  const fetchItems = async () => {
    try {
      const snapshot = await getDocs(collection(db, "giceGallery"));
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* 🔹 Upload Image → Cloudinary → Save title + URL */
  const handleUpload = async () => {
    if (!title) return showNotification("Enter title!", "error");

    // If editing → just update the title
    if (editingId) {
      try {
        const ref = doc(db, "giceGallery", editingId);
        await updateDoc(ref, { title });
        showNotification("Title updated!", "success");
        setEditingId(null);
        setTitle("");
        fetchItems();
      } catch (err) {
        console.log(err);
        showNotification("Update failed!", "error");
      }
      return;
    }

    // New Upload (Image + Title)
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dgxhp09em",
        uploadPreset: "unsigned_preset",
      },
      async (error, result) => {
        if (!error && result && result.event === "success") {
          try {
            await addDoc(collection(db, "giceGallery"), {
              title,
              imageUrl: result.info.secure_url,
              createdAt: serverTimestamp(),
            });

            showNotification("Image uploaded!", "success");
            setTitle("");
            fetchItems();
          } catch (err) {
            console.log(err);
            showNotification("Failed to save!", "error");
          }
        }
      }
    );

    widget.open();
  };

  /* 🔹 Delete Item */
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "giceGallery", id));
      showNotification("Deleted!", "success");
      fetchItems();
    } catch (err) {
      console.log("Delete error:", err);
      showNotification("Delete failed!", "error");
    }
  };

  /* 🔹 Edit Title */
  const handleEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mt-4">
      <Notification message={notification.message} type={notification.type} />

      <h3 className="mb-3">GICE Gallery Manager</h3>

      {/* Upload Form */}
      <div className="card p-3 mb-4">
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Enter image title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button className="btn btn-primary" onClick={handleUpload}>
          {editingId ? "Update Title" : "Upload Image"}
        </button>

        {editingId && (
          <button
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditingId(null);
              setTitle("");
            }}
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Gallery Items */}
      <div className="row">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="col-md-4 mb-4">
              <div className="card shadow-sm h-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{
                    width: "100%",
                    height: "220px",
                    objectFit: "cover",
                  }}
                />

                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>

                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No items found.</p>
        )}
      </div>
    </div>
  );
}
