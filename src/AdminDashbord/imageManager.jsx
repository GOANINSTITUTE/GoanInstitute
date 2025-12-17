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
  const [imageSource, setImageSource] = useState("cloudinary"); // 'cloudinary' or 'url' (Google Drive)

  // For editing images separately
  const [editingImageUrl, setEditingImageUrl] = useState("");
  const [editingImageSource, setEditingImageSource] = useState("cloudinary");
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);

  const [items, setItems] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "success" });
  const [editingId, setEditingId] = useState(null);
  const [updatingImageId, setUpdatingImageId] = useState(null);


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


  // NEW: Promise-based Cloudinary widget for edit mode
  const openCloudinaryWidget = () => {
    return new Promise((resolve, reject) => {
      try {
        const widget = window.cloudinary.createUploadWidget(
          {
            cloudName: "dqjcejidw",
            uploadPreset: "goanins",
          },
          (error, result) => {
            if (error) return reject(error);
            if (result?.event === "success") return resolve({ uploaded: true, url: result.info.secure_url });
            if (result?.event === "close") return resolve({ uploaded: false });
          }
        );
        widget.open();
      } catch (err) {
        reject(err);
      }
    });
  };


  // NEW: Handle image update while in edit mode (supports both Cloudinary and Google Drive)
  const handleUpdateImageInEdit = async () => {
    if (!editingId) return;

    setIsUpdatingImage(true);

    try {
      let finalImageUrl = editingImageUrl;

      // If using Cloudinary, open widget
      if (editingImageSource === "cloudinary") {
        const result = await openCloudinaryWidget();
        if (!result.uploaded) {
          showNotification("Upload cancelled or failed", "error");
          setIsUpdatingImage(false);
          return;
        }
        finalImageUrl = result.url;
      } else {
        // Using Google Drive URL
        if (!editingImageUrl) {
          showNotification("Please provide a Google Drive image URL", "error");
          setIsUpdatingImage(false);
          return;
        }
      }

      // Update ONLY the imageUrl
      const ref = doc(db, "competenceImages", editingId);
      await updateDoc(ref, {
        imageUrl: finalImageUrl,
        updatedAt: serverTimestamp(),
      });

      showNotification("Image updated successfully!", "success");
      setEditingImageUrl("");
      setEditingImageSource("cloudinary");
      fetchItems();
    } catch (err) {
      console.error("Error updating image:", err);
      showNotification("Failed to update image!", "error");
    } finally {
      setIsUpdatingImage(false);
    }
  };


  // Function to update only the image (from item buttons)
  const handleUpdateImage = async (itemId) => {
    if (!itemId) return;

    setUpdatingImageId(itemId);

    try {
      const result = await openCloudinaryWidget();

      if (result.uploaded) {
        const ref = doc(db, "competenceImages", itemId);
        await updateDoc(ref, {
          imageUrl: result.url,
          updatedAt: serverTimestamp(),
        });

        showNotification("Image updated successfully!", "success");
        fetchItems(); // Refresh the list
      }
    } catch (err) {
      console.error("Error updating image:", err);
      showNotification("Failed to update image!", "error");
    } finally {
      setUpdatingImageId(null);
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


  const saveToFirestore = async (finalImageUrl) => {
    try {
      if (editingId) {
        // Update existing document
        const ref = doc(db, "competenceImages", editingId);
        await updateDoc(ref, {
          type,
          title,
          desc,
          link,
          imageUrl: finalImageUrl,
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
          imageUrl: finalImageUrl,
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
  };


  // Upload or update image
  const handleUpload = async () => {
    if (!type) {
      showNotification("Please select image type!", "error");
      return;
    }
    if (type === "competence" && (!title || !desc)) {
      showNotification("Please enter title and description for competence!", "error");
      return;
    }

    // 🔹 GOOGLE DRIVE (URL)
    if (imageSource === "url") {
      if (!imageUrl) {
        showNotification("Please provide a valid Google Drive image", "error");
        return;
      }
      await saveToFirestore(imageUrl);
      return;
    }

    // 🔹 CLOUDINARY
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dgxhp09em",
        uploadPreset: "unsigned_preset",
      },
      async (error, result) => {
        if (!error && result && result.event === "success") {
          await saveToFirestore(result.info.secure_url);
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
    setImageSource("cloudinary");

    // Initialize editing image fields
    setEditingImageUrl("");
    setEditingImageSource("cloudinary");

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
    setLink("");
    setImageSource("cloudinary");
    setEditingId(null);
    setEditingImageUrl("");
    setEditingImageSource("cloudinary");
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


        {/* 🔹 Choose Image Source - NOW ALWAYS VISIBLE */}
        <select
          className="form-select mb-2"
          value={imageSource}
          onChange={(e) => setImageSource(e.target.value)}
        >
          <option value="cloudinary">Use Cloudinary Upload</option>
          <option value="url">Use Google Drive Image</option>
        </select>


        {/* 🔹 Google Drive Component - NOW VISIBLE WHEN NOT EDITING */}
        {imageSource === "url" && !editingId && (
          <GoogleDriveImage onImageReady={(url) => setImageUrl(url)} />
        )}

        {imageUrl && !editingId && (
          <img src={imageUrl} style={{ width: 160, borderRadius: 8, marginTop: 8, marginBottom: 8 }} alt="Preview" />
        )}


        {editingId ? (
          <>
            <button
              className="btn btn-primary me-2"
              onClick={handleSaveEdit}
              disabled={isUpdatingImage}
            >
              Save Text Changes
            </button>
            <button
              className="btn btn-secondary"
              onClick={resetFields}
              disabled={isUpdatingImage}
            >
              Cancel Edit
            </button>
          </>
        ) : (
          <button className="btn btn-success" onClick={handleUpload}>
            Upload New Image
          </button>
        )}
      </div>


      {/* EDIT MODE: Show separate image update section */}
      {editingId && (
        <div className="card p-3 mb-4 border-warning">
          <h6 className="mb-3">Change Image for this item</h6>

          <select
            className="form-select mb-2"
            value={editingImageSource}
            onChange={(e) => setEditingImageSource(e.target.value)}
          >
            <option value="cloudinary">Upload from Cloudinary</option>
            <option value="url">Use Google Drive Image</option>
          </select>

          {/* Google Drive URL input for editing */}
          {editingImageSource === "url" && (
            <GoogleDriveImage onImageReady={(url) => setEditingImageUrl(url)} />
          )}

          {editingImageUrl && editingImageSource === "url" && (
            <img src={editingImageUrl} style={{ width: 160, borderRadius: 8, marginTop: 8, marginBottom: 8 }} alt="Preview" />
          )}

          <button
            className="btn btn-warning btn-sm"
            onClick={handleUpdateImageInEdit}
            disabled={isUpdatingImage}
          >
            {isUpdatingImage ? (
              <>
                <span className="spinner-border spinner-border-sm me-1"></span>
                Updating...
              </>
            ) : (
              "Update Image"
            )}
          </button>
        </div>
      )}


      {/* Display Section */}
      <div className="row mt-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4 mb-3">
              <div className="card shadow-sm border-0">
                <div className="position-relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="card-img-top"
                    style={{ maxHeight: "250px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x300?text=Image+Unavailable";
                    }}
                  />
                  {updatingImageId === item.id && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
                      <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Updating image...</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="card-body">
                  <h6 className="text-uppercase text-secondary">
                    {item.type === "background" ? "Background Image" : "Educational Services Image"}
                  </h6>
                  {item.title && <h5>{item.title}</h5>}
                  {item.desc && <p className="small mb-2">{item.desc}</p>}
                  {item.link && <p className="small mb-2 text-primary">{item.link}</p>}


                  <div className="d-flex flex-wrap justify-content-between gap-2">
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(item)}
                      disabled={updatingImageId === item.id}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleUpdateImage(item.id)}
                      disabled={updatingImageId === item.id}
                    >
                      {updatingImageId === item.id ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-1"></span>
                          Updating...
                        </>
                      ) : (
                        "Update Image"
                      )}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={updatingImageId === item.id}
                    >
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