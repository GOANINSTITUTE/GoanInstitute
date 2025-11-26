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

/* 🔹 Notification Toast */
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

/* 🔹 Show & Manage Assigned Images for Each Section */
function AssignedImages({ categoryName, onDeleteSuccess, firestoreCollection }) {
  const [assigned, setAssigned] = useState([]);

  const fetchAssigned = async () => {
    try {
      const snapshot = await getDocs(collection(db, firestoreCollection));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const filtered = data.filter(
        (item) => item.category === categoryName.toLowerCase()
      );
      setAssigned(filtered);
    } catch (error) {
      console.error("Error fetching assigned images:", error);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, [categoryName]);

  const handleDeleteAssigned = async (id) => {
    try {
      await deleteDoc(doc(db, firestoreCollection, id));
      setAssigned((prev) => prev.filter((item) => item.id !== id));
      onDeleteSuccess(`Image removed from "${categoryName}"!`);
    } catch (error) {
      console.error("Error deleting assigned image:", error);
      onDeleteSuccess("Failed to remove image!", "error");
    }
  };

  return (
    <div>
      {assigned.length > 0 ? (
        <div className="d-flex flex-wrap gap-2">
          {assigned.map((img) => (
            <div
              key={img.id}
              className="position-relative"
              style={{ display: "inline-block" }}
            >
              <img
                src={img.imageUrl}
                alt={img.title || "Untitled"}
                style={{
                  width: "100px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "2px solid #ddd",
                }}
              />
              <button
                onClick={() => handleDeleteAssigned(img.id)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "rgba(0,0,0,0.6)",
                  color: "white",
                  border: "none",
                  borderRadius: "0 4px 0 4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  lineHeight: "1",
                  padding: "2px 6px",
                }}
                title="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted small">No images assigned yet.</p>
      )}
    </div>
  );
}

/* 🔹 Main Gallery Manager */
function GalleryManager() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [items, setItems] = useState([]);
  const [notification, setNotification] = useState({
    message: "",
    type: "success",
  });
  const [editingItemId, setEditingItemId] = useState(null);
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
      const snapshot = await getDocs(collection(db, "gallery"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
    }
  };

  const handleUpload = async () => {
    const categoryArray =
      category
        ?.split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat) || [];

    if (editingItemId) {
      try {
        const itemRef = doc(db, "gallery", editingItemId);
        await updateDoc(itemRef, {
          title,
          description,
          category: categoryArray,
          updatedAt: serverTimestamp(),
        });
        showNotification("Gallery item updated!", "success");
        setEditingItemId(null);
        setTitle("");
        setDescription("");
        setCategory("");
        fetchItems();
      } catch (error) {
        console.error("Error updating item:", error);
        showNotification("Failed to update item!", "error");
      }
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
            await addDoc(collection(db, "gallery"), {
              title: title || "",
              description: description || "",
              category: categoryArray,
              imageUrl: result.info.secure_url,
              uploadedAt: serverTimestamp(),
            });
            showNotification("Uploaded successfully!", "success");
            setTitle("");
            setDescription("");
            setCategory("");
            fetchItems();
          } catch (error) {
            console.error("Error saving to Firestore:", error);
            showNotification("Failed to save to Firestore!", "error");
          }
        } else if (error) {
          console.error("Cloudinary upload error:", error);
          showNotification("Upload failed, please try again!", "error");
        }
      }
    );
    myWidget.open();
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "gallery", id));
      fetchItems();
      showNotification("Gallery item deleted!", "success");
    } catch (error) {
      console.error("Error deleting item:", error);
      showNotification("Failed to delete item!", "error");
    }
  };

  const handleEdit = (item) => {
    setEditingItemId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(
      Array.isArray(item.category) ? item.category.join(", ") : item.category
    );
    if (headingRef.current) {
      const y =
        headingRef.current.getBoundingClientRect().top + window.pageYOffset - 200;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  /* 🔹 Operations Categories */
  const operationsCategories = [
    "Schools",
    "Students",
  ];

  return (
    <div className="container mt-4" ref={headingRef}>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() =>
          setNotification({ message: "", type: notification.type })
        }
      />

      <h3 className="mb-3">Gallery Manager</h3>

      {/* 🔹 Upload Form */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Categories (optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-control mb-2"
        />
        <button className="btn btn-success" onClick={handleUpload}>
          {editingItemId ? "Update Item" : "Upload Image"}
        </button>
        {editingItemId && (
          <button
            className="btn btn-secondary ms-2"
            onClick={() => {
              setEditingItemId(null);
              setTitle("");
              setDescription("");
              setCategory("");
            }}
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* 🔹 Display All Gallery Items */}
      <div className="row mt-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4">
              <div className="card my-2">
                <img
                  src={item.imageUrl}
                  loading="lazy"
                  alt={item.title || "Untitled"}
                  style={{ maxHeight: "250px", objectFit: "cover" }}
                />

                <div className="card-body">
                  <h5 className="card-title">{item.title || "Untitled"}</h5>
                  <p className="card-text">
                    {item.description || "No description"}
                  </p>
                  <div className="mb-2">
                    {Array.isArray(item.category) && item.category.length > 0 ? (
                      item.category.map((cat, idx) => (
                        <span
                          key={idx}
                          className="badge me-1 bg-secondary text-light"
                        >
                          {cat}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted small">No category</span>
                    )}
                  </div>
                  <div className="d-flex justify-content-between">
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
          <p>No gallery items found.</p>
        )}
      </div>

      {/* 🔹 Operations Gallery Section */}
      <div className="mt-5">
        <h4 className="mb-3">Assign Images for Operations Section</h4>
        <p className="text-muted">Select images for each operations card below:</p>

        <div className="row">
          {operationsCategories.map((categoryName, i) => (
            <div className="col-md-6 mb-4" key={i}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-primary mb-3">
                    {categoryName}
                  </h5>
                  <div className="mb-3">
                    <select
                      className="form-select"
                      onChange={async (e) => {
                        const selectedId = e.target.value;
                        if (!selectedId) return;
                        try {
                          const item = items.find((it) => it.id === selectedId);
                          if (!item) return alert("Invalid selection!");
                          await addDoc(collection(db, "operationsGallery"), {
                            category: categoryName.toLowerCase(),
                            imageUrl: item.imageUrl,
                            title: item.title || "",
                            createdAt: serverTimestamp(),
                          });
                          showNotification(
                            `Image assigned to "${categoryName}"!`,
                            "success"
                          );
                        } catch (error) {
                          console.error("Error assigning image:", error);
                          showNotification("Failed to assign image!", "error");
                        }
                      }}
                    >
                      <option value="">-- Select an image --</option>
                      {items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title || "Untitled"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <AssignedImages
                    categoryName={categoryName}
                    firestoreCollection="operationsGallery"
                    onDeleteSuccess={(msg, type) =>
                      showNotification(msg, type || "success")
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Careers Gallery Section */}
      <div className="mt-5">
        <h4 className="mb-3">Assign Images for Careers Section</h4>
        <p className="text-muted">All careers images will be stored in one collection.</p>

        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title text-success mb-3">Careers Gallery</h5>
            <div className="mb-3">
              <select
                className="form-select"
                onChange={async (e) => {
                  const selectedId = e.target.value;
                  if (!selectedId) return;
                  try {
                    const item = items.find((it) => it.id === selectedId);
                    if (!item) return alert("Invalid selection!");
                    await addDoc(collection(db, "careersGallery"), {
                      category: "careers",
                      imageUrl: item.imageUrl,
                      title: item.title || "",
                      createdAt: serverTimestamp(),
                    });
                    showNotification(
                      `Image assigned to Careers Gallery!`,
                      "success"
                    );
                  } catch (error) {
                    console.error("Error assigning image:", error);
                    showNotification("Failed to assign image!", "error");
                  }
                }}
              >
                <option value="">-- Select an image --</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title || "Untitled"}
                  </option>
                ))}
              </select>
            </div>
            <AssignedImages
              categoryName="careers"
              firestoreCollection="careersGallery"
              onDeleteSuccess={(msg, type) =>
                showNotification(msg, type || "success")
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GalleryManager;
