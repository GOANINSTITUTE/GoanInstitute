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
import GoogleDriveImage from "./GoogleDriveImage";


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
  const [updatingCategory, setUpdatingCategory] = useState(null);
  const [imageSource, setImageSource] = useState("cloudinary"); // 'cloudinary' or 'url' (Google Drive)
  const [imageUrl, setImageUrl] = useState(""); // Google Drive URL

  // Edit mode states
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingImageUrl, setEditingImageUrl] = useState("");
  const [editingImageSource, setEditingImageSource] = useState("cloudinary");
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);


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


  const saveImageToFirestore = async (finalImageUrl) => {
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
          imageUrl: finalImageUrl,
          updatedAt: serverTimestamp(),
        });
        showNotification("Image updated!", "success");
      } else {
        // Add new document
        await addDoc(collection(db, "giceProfiles"), {
          category,
          imageUrl: finalImageUrl,
          createdAt: serverTimestamp(),
        });
        showNotification("Image uploaded!", "success");
      }


      setImageUrl("");
      setImageSource("cloudinary");
      fetchItems();
    } catch (err) {
      console.log("Firestore save error:", err);
      showNotification("Failed to save!", "error");
    }
  };


  // NEW: Handle image update while in edit mode (supports both Cloudinary and Google Drive)
  const handleUpdateImageInEdit = async () => {
    if (!editingCategory) return;

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

      // Find and update the document for this category
      const q = query(
        collection(db, "giceProfiles"),
        where("category", "==", editingCategory)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id;
        const docRef = doc(db, "giceProfiles", docId);
        await updateDoc(docRef, {
          imageUrl: finalImageUrl,
          updatedAt: serverTimestamp(),
        });
        showNotification("Image updated successfully!", "success");
        setEditingImageUrl("");
        setEditingImageSource("cloudinary");
        setEditingCategory(null);
        fetchItems();
      }
    } catch (err) {
      console.error("Error updating image:", err);
      showNotification("Failed to update image!", "error");
    } finally {
      setIsUpdatingImage(false);
    }
  };


  /* Function to update image for a specific category */
  const handleUpdateImage = async (cat) => {
    if (!cat) return;

    setUpdatingCategory(cat);

    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dqjcejidw",
        uploadPreset: "goanins",
      },
      async (error, result) => {
        if (!error && result && result.event === "success") {
          const imageUrl = result.info.secure_url;

          try {
            // Check if category already has image
            const q = query(
              collection(db, "giceProfiles"),
              where("category", "==", cat)
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
              showNotification(`Image for "${cat}" updated!`, "success");
            } else {
              // Add new document if doesn't exist (shouldn't happen but just in case)
              await addDoc(collection(db, "giceProfiles"), {
                category: cat,
                imageUrl,
                createdAt: serverTimestamp(),
              });
              showNotification(`Image for "${cat}" uploaded!`, "success");
            }

            fetchItems();
          } catch (err) {
            console.log("Firestore save error:", err);
            showNotification("Failed to update image!", "error");
          } finally {
            setUpdatingCategory(null);
          }
        } else if (error) {
          console.log("Cloudinary error:", error);
          showNotification("Upload failed!", "error");
          setUpdatingCategory(null);
        } else if (result && result.event === "close") {
          setUpdatingCategory(null);
        }
      }
    );

    myWidget.open();
  };


  // NEW: Enter edit mode for a specific category
  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setEditingImageUrl("");
    setEditingImageSource("cloudinary");
  };


  // NEW: Cancel edit mode
  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditingImageUrl("");
    setEditingImageSource("cloudinary");
  };


  /* Upload to Cloudinary + Store in Firestore */
  const handleUpload = async () => {
    if (!category) return showNotification("Select a category!", "error");

    // 🔹 GOOGLE DRIVE (URL)
    if (imageSource === "url") {
      if (!imageUrl) {
        showNotification("Please provide a valid Google Drive image", "error");
        return;
      }
      await saveImageToFirestore(imageUrl);
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
          const imageUrl = result.info.secure_url;
          await saveImageToFirestore(imageUrl);
        } else if (error) {
          console.log("Cloudinary error:", error);
          showNotification("Upload failed!", "error");
        }
      }
    );

    myWidget.open();
  };


  /* Delete image */
  const handleDelete = async (id, categoryName) => {
    if (!window.confirm(`Are you sure you want to delete the image for "${categoryName}"?`)) {
      return;
    }

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

        {/* 🔹 Choose Image Source */}
        <select
          className="form-select mb-3"
          value={imageSource}
          onChange={(e) => setImageSource(e.target.value)}
        >
          <option value="cloudinary">Use Cloudinary Upload</option>
          <option value="url">Use Google Drive Image</option>
        </select>

        {/* 🔹 Google Drive Component */}
        {imageSource === "url" && (
          <GoogleDriveImage onImageReady={(url) => setImageUrl(url)} />
        )}

        <button className="btn btn-primary" onClick={handleUpload}>
          Upload/Update Image
        </button>
        <p className="text-muted small mt-2">
          Select a category and upload an image. If a category already has an image, it will be replaced.
        </p>
      </div>

      {/* Display Existing Images */}
      <div className="row">
        {categories.map((cat) => {
          const item = items.find((i) => i.category === cat);
          const isUpdating = updatingCategory === cat;
          const isEditing = editingCategory === cat;

          return (
            <div className="col-md-4 mb-4" key={cat}>
              <div className="card shadow-sm h-100">
                <div className="card-body text-center">
                  <h5 className="text-primary">{cat}</h5>

                  {item ? (
                    <>
                      <div className="position-relative">
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
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/400x300?text=Image+Unavailable";
                          }}
                        />
                        {isUpdating && (
                          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded">
                            <div className="spinner-border text-light" role="status">
                              <span className="visually-hidden">Updating...</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="d-flex flex-wrap justify-content-center gap-2 mt-3">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(cat)}
                          disabled={isUpdating || isEditing}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => handleUpdateImage(cat)}
                          disabled={isUpdating || isEditing}
                        >
                          {isUpdating ? (
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
                          onClick={() => handleDelete(item.id, cat)}
                          disabled={isUpdating || isEditing}
                        >
                          Delete
                        </button>
                      </div>

                      {/* EDIT MODE: Show separate image update section */}
                      {isEditing && (
                        <div className="card p-3 mt-3 border-warning">
                          <h6 className="mb-3">Change Image for {cat}</h6>

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
                                maxHeight: "150px",
                                borderRadius: 6,
                                marginTop: 8,
                                marginBottom: 8,
                                objectFit: "cover",
                              }}
                              alt="Preview"
                            />
                          )}

                          <div className="d-flex gap-2">
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
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={handleCancelEdit}
                              disabled={isUpdatingImage}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-muted mt-3">No image uploaded yet.</p>
                      <button
                        className="btn btn-primary btn-sm mt-2"
                        onClick={() => handleUpdateImage(cat)}
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1"></span>
                            Uploading...
                          </>
                        ) : (
                          "Upload Image"
                        )}
                      </button>
                    </>
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