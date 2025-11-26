import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase-config";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import CustomEditor from "../Components/CustomTexteditor";

// Simple Custom Modal
function ConfirmPhotoModal({ show, onClose, onChangePhoto, onKeepPhoto }) {
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed', left:0, top:0, width:'100vw', height:'100vh', zIndex:3000,
      background: 'rgba(0,0,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center'
    }}>
      <div style={{
        background:'#fff', borderRadius:10, padding:32, boxShadow:'0 6px 30px rgba(0,0,0,0.13)',
        maxWidth:320, width:'90%', textAlign:'center'
      }}>
        <div style={{fontSize:20, fontWeight:600, marginBottom:24}}>Change Service Photo?</div>
        <div className="d-flex gap-2 justify-content-center">
          <button className="btn btn-primary" onClick={onChangePhoto}>Change Photo</button>
          <button className="btn btn-secondary" onClick={onKeepPhoto}>Keep Old Photo</button>
        </div>
      </div>
    </div>
  );
}

// --- Notification component as before

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
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          marginLeft: 16,
          fontSize: 18,
          cursor: "pointer"
        }}
      >
        &times;
      </button>
    </div>
  );
}

function ServicesManager() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "success" });

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editImageUrl, setEditImageUrl] = useState("");
  const maxDescriptionLength = 150;

  // Modal state
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [setPendingUpdate] = useState(null);

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
      const snapshot = await getDocs(collection(db, "services"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Add or Update Service
  const handleUpload = async () => {
    if (!title || !description) {
      showNotification("Please enter title and description!", "error");
      return;
    }

    if (isEditing) {
      // Open custom modal, save pending info
      setShowPhotoModal(true);
      setPendingUpdate({ title, description, editImageUrl, editingId });
    } else {
      // Adding new: open cloudinary
      const myWidget = window.cloudinary.createUploadWidget(
        {
          cloudName: "dgxhp09em",
          uploadPreset: "unsigned_preset",
        },
        async (error, result) => {
          if (!error && result && result.event === "success") {
            const uploadedImageUrl = result.info.secure_url;
            await saveService(uploadedImageUrl);
          } else if (!error && result && result.event === "close") {
            // User closed widget: save without image
            await saveService("");
          }
        }
      );
      myWidget.open();
    }
  };

  // Called from modal if user wants to change photo
  const handleChangePhoto = () => {
    setShowPhotoModal(false); // close modal
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dgxhp09em",
        uploadPreset: "unsigned_preset",
      },
      async (error, result) => {
        if (!error && result && result.event === "success") {
          const uploadedImageUrl = result.info.secure_url;
          await saveService(uploadedImageUrl);
        } else if (!error && result && result.event === "close") {
          // User closed without uploading, keep old image
          await saveService(editImageUrl || "");
        }
      }
    );
    myWidget.open();
  };

  // Called from modal to retain current photo
  const handleKeepPhoto = async () => {
    setShowPhotoModal(false);
    await saveService(editImageUrl || "");
  };

  const saveService = async (uploadedImageUrl) => {
    try {
      if (isEditing && editingId) {
        await updateDoc(doc(db, "services", editingId), {
          title,
          description,
          imageUrl: uploadedImageUrl || editImageUrl || "",
        });
        showNotification("Service updated!", "success");
      } else {
        await addDoc(collection(db, "services"), {
          title,
          description,
          imageUrl: uploadedImageUrl || "",
        });
        showNotification("Service added!", "success");
      }
      setTitle("");
      setDescription("");
      setEditImageUrl("");
      setIsEditing(false);
      setEditingId(null);
      setPendingUpdate(null);
      fetchItems();
    } catch (error) {
      console.error("Error saving service:", error);
      showNotification("Failed to save service!", "error");
    }
  };

  // Edit Handler
  const handleEdit = (item) => {
    setIsEditing(true);
    setEditingId(item.id);
    setTitle(item.title || "");
    setDescription(item.description || "");
    setEditImageUrl(item.imageUrl || "");
    setPendingUpdate(null);

    if (headingRef.current) {
      const yOffset = -156;
      const y = headingRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Cancel edit
  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setEditImageUrl("");
    setPendingUpdate(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "services", id));
      fetchItems();
      showNotification("Service deleted!", "success");
      if (editingId === id) handleCancel();
    } catch (error) {
      console.error("Error deleting service:", error);
      showNotification("Failed to delete service!", "error");
    }
  };

  return (
    <div className="container mt-4">
      <ConfirmPhotoModal
        show={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
        onChangePhoto={handleChangePhoto}
        onKeepPhoto={handleKeepPhoto}
      />
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification({ message: "", type: notification.type })}
      />
      <h3 className="mb-3" ref={headingRef}>Services Manager</h3>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control mb-2"
        />
        <CustomEditor
          value={description}
          setValue={setDescription}
        />
        <small className="text-muted" style={{ display: "block" }}>
          {description.replace(/<[^>]+>/g, '').length} / {maxDescriptionLength} characters
        </small>
        {isEditing ? (
          <div>
            <button className="btn btn-primary mt-2 me-2" onClick={handleUpload}>
              Update Service
            </button>
            <button className="btn btn-secondary mt-2" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        ) : (
          <button className="btn btn-success mt-2" onClick={handleUpload}>
            Add Service
          </button>
        )}
      </div>
      <div className="row mt-4">
        {items.map((item) => (
          <div key={item.id} className="col-md-6 col-lg-4">
            <div className="card my-2">
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  className="card-img-top"
                  alt={item.title}
                  style={{ maxHeight: "250px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <div
                  className="card-text"
                  style={{ minHeight: 60, maxHeight: 200, overflow: "hidden" }}
                  dangerouslySetInnerHTML={{
                    __html: item.description?.slice(0, 500) + (item.description && item.description.length > 500 ? "..." : "")
                  }}
                />
                <div className="d-flex gap-2 mt-3">
                  <button
                    className="btn btn-outline-primary btn-sm"
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
        ))}
      </div>
    </div>
  );
}

export default ServicesManager;
