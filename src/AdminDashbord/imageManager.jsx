import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

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
      }}
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
      >
        &times;
      </button>
    </div>
  );
}

function ImageManager() {
  const [type, setType] = useState(""); // 'background' or 'competence'
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [items, setItems] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "success" });
  const [editingId, setEditingId] = useState(null);

  const headingRef = useRef(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type }), 2500);
  };

  const fetchItems = async () => {
    try {
      const snapshot = await getDocs(collection(db, "competenceImages"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  // Editing text/type only
  const handleSaveEdit = async () => {
    if (!type) {
      showNotification("Please select image type!", "error");
      return;
    }
    if (type === "competence" && (!title || !desc)) {
      showNotification("Please enter title and description for competence!", "error");
      return;
    }
    try {
      const ref = doc(db, "competenceImages", editingId);
      await updateDoc(ref, {
        type,
        title,
        desc,
        link,
        updatedAt: serverTimestamp(),
        // imageUrl is not changed here, preserves original
      });
      showNotification("Image info updated!", "success");
      setEditingId(null);
      resetFields();
      fetchItems();
    } catch (err) {
      console.error("Firestore error:", err);
      showNotification("Failed to update!", "error");
    }
  };

  // Upload or update image (with Cloudinary)
  const handleUpload = async () => {
    if (!type) {
      showNotification("Please select image type!", "error");
      return;
    }
    if (type === "competence" && (!title || !desc)) {
      showNotification("Please enter title and description for competence!", "error");
      return;
    }

    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dgxhp09em",
        uploadPreset: "unsigned_preset",
      },
      async (error, result) => {
        if (!error && result && result.event === "success") {
          try {
            if (editingId) {
              // Update existing document with new image
              const ref = doc(db, "competenceImages", editingId);
              await updateDoc(ref, {
                type,
                title,
                desc,
                link,
                imageUrl: result.info.secure_url,
                updatedAt: serverTimestamp(),
              });

              showNotification("Image updated successfully!", "success");
              setEditingId(null);
            } else {
              // Add new document
              await addDoc(collection(db, "competenceImages"), {
                type,
                title,
                desc,
                link,
                imageUrl: result.info.secure_url,
                createdAt: serverTimestamp(),
              });

              showNotification("Image uploaded successfully!", "success");
            }
            resetFields();
            fetchItems();
          } catch (err) {
            console.error("Firestore error:", err);
            showNotification("Failed to save image!", "error");
          }
        } else if (error) {
          console.error("Cloudinary error:", error);
          showNotification("Upload failed!", "error");
        }
      }
    );
    myWidget.open();
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "competenceImages", id));
      fetchItems();
      showNotification("Deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting:", error);
      showNotification("Delete failed!", "error");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setType(item.type);
    setTitle(item.title || "");
    setDesc(item.desc || "");
    setImageUrl(item.imageUrl || "");
    setLink(item.link || "");
    if (headingRef.current) {
      const y = headingRef.current.getBoundingClientRect().top + window.pageYOffset - 200;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const resetFields = () => {
    setType("");
    setTitle("");
    setDesc("");
    setImageUrl("");
    setEditingId(null);
  };

  return (
    <div className="container mt-4" ref={headingRef}>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: notification.type })}
      />

      <h3 className="mb-3">Educational Services Image Manager</h3>

      {/* Form Section */}
      <div className="mb-3">
        <select
          className="form-select mb-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">Select Image Type</option>
          <option value="background">Background</option>
          <option value="competence">Image</option>
        </select>

        {type === "competence" && (
          <>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control mb-2"
            />
            <input
              type="text"
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="form-control mb-2"
            />

            <input
              type="text"
              placeholder="Redirect Link (ex: /services/regular-skill-development)"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="form-control mb-2"
            />

          </>
        )}

        {editingId ? (
          <>
            <button className="btn btn-primary me-2" onClick={handleSaveEdit}>
              Save Changes
            </button>
            <button className="btn btn-success me-2" onClick={handleUpload}>
              Change Image
            </button>
            <button className="btn btn-secondary" onClick={resetFields}>
              Cancel Edit
            </button>
          </>
        ) : (
          <button className="btn btn-success" onClick={handleUpload}>
            Upload Image
          </button>
        )}
      </div>

      {/* Display Section */}
      <div className="row mt-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card shadow-sm border-0">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="card-img-top"
                  style={{ maxHeight: "250px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h6 className="text-uppercase text-secondary">
                    {item.type === "background" ? "Background Image" : "Educational Services Image"}
                  </h6>
                  {item.title && <h5>{item.title}</h5>}
                  {item.desc && <p className="small mb-2">{item.desc}</p>}
                  {item.link && <p className="small mb-2 text-primary">{item.link}</p>}

                  <div className="d-flex justify-content-between">
                    <button className="btn btn-warning btn-sm" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No images found.</p>
        )}
      </div>
    </div>
  );
}

export default ImageManager;
