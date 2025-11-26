// src/components/GalleryManager.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";  // Firestore config only
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from "firebase/firestore";


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
        transition: "opacity 0.3s"
      }}
      role="alert"
    >
      {message}
      <button 
        onClick={onClose} 
        style={{ background: "none", border: "none", color: "#fff", marginLeft: 16, fontSize: 18, cursor: "pointer" }}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
}


function GalleryManager() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(""); // New category state
  const [items, setItems] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "success" });


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
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      console.error("Error fetching gallery items:", error);
    }
  };


  const handleUpload = async () => {
    if (!title || !description || !category) {
      showNotification("Please enter title, description, and category!", "error");
      return;
    }


    // Create the Cloudinary upload widget
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dgxhp09em',
        uploadPreset: 'unsigned_preset'
      },
      async (error, result) => {
        if (!error && result && result.event === "success") {
          try {
            // Save the image URL with title, description, category, and uploadedAt timestamp to Firestore
            await addDoc(collection(db, "gallery"), {
              title,
              description,
              category, // Save category to Firestore
              imageUrl: result.info.secure_url,
              uploadedAt: serverTimestamp() // <-- Add upload time here
            });
            showNotification("Uploaded successfully!", "success");
            // Clear form
            setTitle("");
            setDescription("");
            setCategory(""); // Clear category
            // Refresh gallery list
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
    // Open the widget
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


  return (
    <div className="container mt-4">
      <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: "", type: notification.type })} />
      <h3 className="mb-3">Gallery Manager</h3>
      <div className="mb-3">
        <input 
          type="text" 
          placeholder="Title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          className="form-control mb-2" 
          aria-label="Gallery item title"
        />
        <input 
          type="text" 
          placeholder="Description" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
          className="form-control mb-2" 
          aria-label="Gallery item description"
        />
        <input 
          type="text" 
          placeholder="Category" 
          value={category} 
          onChange={e => setCategory(e.target.value)} 
          className="form-control mb-2" 
          aria-label="Gallery item category"
        />
        <button className="btn btn-success" onClick={handleUpload}>
          Add to Gallery
        </button>
      </div>
      <div className="row mt-4">
        {items.length > 0 ? (
          items.map(item => (
            <div key={item.id} className="col-md-6 col-lg-4">
              <div className="card my-2">
                <img 
                  src={item.imageUrl} 
                  className="card-img-top" 
                  alt={item.title} 
                  style={{ maxHeight: "250px", objectFit: "cover" }} 
                />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">{item.description}</p>
                  <span className="badge bg-primary mb-2">{item.category}</span>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No gallery items found.</p>
        )}
      </div>
    </div>
  );
}


export default GalleryManager;
