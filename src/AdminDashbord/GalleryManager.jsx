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
import Notification from "./Notification";
import SectionAssigner from "./SectionAssigner";
import GoogleDriveImage from "./GoogleDriveImage";


/* 🔹 Main Gallery Manager Component */
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
  const [updatingImageId, setUpdatingImageId] = useState(null);


  // 🔹 Image source: 'cloudinary' or 'url' (Google Drive)
  const [imageSource, setImageSource] = useState("cloudinary");
  const [imageUrl, setImageUrl] = useState(""); // Final URL from GoogleDriveImage

  // Edit mode states for images
  const [editingImageUrl, setEditingImageUrl] = useState("");
  const [editingImageSource, setEditingImageSource] = useState("cloudinary");
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);


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
      showNotification("Failed to fetch gallery items!", "error");
    }
  };


  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("");
    setImageUrl("");
    setImageSource("cloudinary");
    setEditingItemId(null);
    setEditingImageUrl("");
    setEditingImageSource("cloudinary");
  };


  // Promise-based Cloudinary widget
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


  // 🔹 Save to Firestore (used by both Cloudinary and Google Drive flows)
  const saveToFirestore = async (finalImageUrl) => {
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
      } catch (error) {
        console.error("Error updating item:", error);
        showNotification("Failed to update item!", "error");
      }
    } else {
      try {
        await addDoc(collection(db, "gallery"), {
          title: title || "",
          description: description || "",
          category: categoryArray,
          imageUrl: finalImageUrl,
          uploadedAt: serverTimestamp(),
        });
        showNotification("Uploaded successfully!", "success");
      } catch (error) {
        console.error("Error saving to Firestore:", error);
        showNotification("Failed to save to Firestore!", "error");
      }
    }


    resetForm();
    fetchItems();
  };


  const handleUpload = async () => {
    // Validation
    if (!title || !description || !category) {
      showNotification("Fill all fields", "error");
      return;
    }


    // 🔹 GOOGLE DRIVE (URL)
    if (imageSource === "url") {
      if (!imageUrl) {
        showNotification("Please provide a valid Google Drive image", "error");
        return;
      }
      saveToFirestore(imageUrl);
      return;
    }


    // 🔹 CLOUDINARY
    if (editingItemId) {
      // Edit mode: only update text/category (don't open Cloudinary)
      saveToFirestore(null);
      return;
    }


    // Add mode: open Cloudinary widget
    try {
      const result = await openCloudinaryWidget();
      if (result.uploaded) {
        saveToFirestore(result.url);
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      showNotification("Upload failed, please try again!", "error");
    }
  };


  // NEW: Handle image update while in edit mode (supports both Cloudinary and Google Drive)
  const handleUpdateImageInEdit = async () => {
    if (!editingItemId) return;

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
      const itemRef = doc(db, "gallery", editingItemId);
      await updateDoc(itemRef, {
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


  // Update image only (from item buttons - Cloudinary only)
  const handleUpdateImage = async (itemId) => {
    setUpdatingImageId(itemId);

    try {
      const result = await openCloudinaryWidget();

      if (result.uploaded) {
        const itemRef = doc(db, "gallery", itemId);
        await updateDoc(itemRef, {
          imageUrl: result.url,
          updatedAt: serverTimestamp(),
        });
        showNotification("Image updated successfully!", "success");
        fetchItems();
      }
    } catch (error) {
      console.error("Error updating image:", error);
      showNotification("Failed to update image!", "error");
    } finally {
      setUpdatingImageId(null);
    }
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
    setTitle(item.title || "");
    setDescription(item.description || "");
    setCategory(
      Array.isArray(item.category) ? item.category.join(", ") : item.category || ""
    );
    // Reset image source to cloudinary (editing doesn't change image)
    setImageSource("cloudinary");
    setImageUrl("");

    // Initialize editing image fields
    setEditingImageUrl("");
    setEditingImageSource("cloudinary");

    if (headingRef.current) {
      const y =
        headingRef.current.getBoundingClientRect().top + window.pageYOffset - 200;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };


  // NEW: Cancel edit mode
  const handleCancelEdit = () => {
    resetForm();
  };


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
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Categories (comma separated)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-control mb-2"
        />


        {/* 🔹 Choose Image Source - NOW ALWAYS VISIBLE */}
        <select
          className="form-select mb-3"
          value={imageSource}
          onChange={(e) => setImageSource(e.target.value)}
        >
          <option value="cloudinary">Use Cloudinary Upload</option>
          <option value="url">Use Google Drive Image</option>
        </select>


        {/* 🔹 Google Drive Component (only when not editing) */}
        {imageSource === "url" && !editingItemId && (
          <GoogleDriveImage onImageReady={(url) => setImageUrl(url)} />
        )}

        {imageUrl && !editingItemId && (
          <img src={imageUrl} style={{ width: 160, borderRadius: 8, marginTop: 8, marginBottom: 8 }} alt="Preview" />
        )}


        <button className="btn btn-success mt-2" onClick={handleUpload}>
          {editingItemId ? "Update Details" : "Add Item"}
        </button>


        {editingItemId && (
          <button
            className="btn btn-secondary ms-2"
            onClick={handleCancelEdit}
            disabled={isUpdatingImage}
          >
            Cancel Edit
          </button>
        )}
      </div>


      {/* EDIT MODE: Show separate image update section */}
      {editingItemId && (
        <div className="card p-3 mb-4 border-warning">
          <h6 className="mb-3">Change Image for this gallery item</h6>

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
            <img
              src={editingImageUrl}
              style={{
                width: "100%",
                maxHeight: "200px",
                borderRadius: 8,
                marginTop: 8,
                marginBottom: 8,
                objectFit: "cover",
              }}
              alt="Preview"
            />
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


      {/* 🔹 Display All Gallery Items */}
      <div className="row mt-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4">
              <div className="card my-2">
                <div className="position-relative">
                  <img
                    src={item.imageUrl}
                    loading="lazy"
                    alt={item.title || "Untitled"}
                    style={{ maxHeight: "250px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=Image+Unavailable";
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
                  <div className="d-flex flex-wrap justify-content-between gap-2">
                    <div className="d-flex gap-2">
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
                    </div>
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
          <p>No gallery items found.</p>
        )}
      </div>


      {/* 🔹 Section Assigner Component */}
      <SectionAssigner
        items={items}
        showNotification={showNotification}
      />
    </div>
  );
}


export default GalleryManager;