import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
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


const missionCategories = [
  "hero",
  "overview",
  "education",
  "benefits",
  "framework"
];


function ServiceManager() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("#302728");
  const [icon, setIcon] = useState("bi-star");
  const [imageUrl, setImageUrl] = useState("");
  const [imageSource, setImageSource] = useState("cloudinary"); // 'cloudinary' or 'url' (Google Drive)

  // For editing images separately
  const [editingImageUrl, setEditingImageUrl] = useState("");
  const [editingImageSource, setEditingImageSource] = useState("cloudinary");
  const [isUpdatingImage, setIsUpdatingImage] = useState(false);

  const [missionImages, setMissionImages] = useState([]);
  const [services, setServices] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [operationsBackground, setOperationsBackground] = useState("");


  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState("service");
  const [notification, setNotification] = useState({ message: "", type: "success" });
  const [isUploading, setIsUploading] = useState(false);
  const [updatingImageId, setUpdatingImageId] = useState(null);
  const [updatingImageType, setUpdatingImageType] = useState(null);
  const [operationsImageSource, setOperationsImageSource] = useState("cloudinary");
  const [operationsDriveUrl, setOperationsDriveUrl] = useState("");


  const formRef = useRef(null);


  useEffect(() => {
    fetchData();
  }, []);


  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type }), 2500);
  };


  const fetchData = async () => {
    try {
      const serviceSnap = await getDocs(collection(db, "services"));
      const benefitSnap = await getDocs(collection(db, "benefits"));
      const missionSnap = await getDocs(collection(db, "missionImages"));

      setServices(serviceSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setBenefits(benefitSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setMissionImages(missionSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

      // Fetch operations background
      const operationsQuery = await getDocs(
        collection(db, "sectionBackgrounds")
      );
      const opBg = operationsQuery.docs.find(
        (d) => d.data().section === "operations"
      );
      if (opBg) {
        setOperationsBackground(opBg.data().imageUrl || "");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      showNotification("Failed to fetch content", "error");
    }
  };


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


  // Function to update only the image
  const handleUpdateImage = async (itemId, type) => {
    setUpdatingImageId(itemId);
    setUpdatingImageType(type);

    try {
      const result = await openCloudinaryWidget();

      if (result.uploaded) {
        // Determine the Firestore collection based on type
        const collectionName =
          type === "service" ? "services" :
            type === "benefit" ? "benefits" :
              "missionImages";

        // Update only the imageUrl in Firestore
        await updateDoc(doc(db, collectionName, itemId), {
          imageUrl: result.url,
          updatedAt: serverTimestamp(),
        });

        showNotification("Image updated successfully!", "success");
        fetchData(); // Refresh the data
      }
    } catch (err) {
      console.error("Error updating image:", err);
      showNotification("Failed to update image!", "error");
    } finally {
      setUpdatingImageId(null);
      setUpdatingImageType(null);
    }
  };


  // NEW: Handle image update while in edit mode
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

      // Determine the Firestore collection based on type
      const collectionName =
        editingType === "service" ? "services" :
          editingType === "benefit" ? "benefits" :
            "missionImages";

      // Update ONLY the imageUrl
      await updateDoc(doc(db, collectionName, editingId), {
        imageUrl: finalImageUrl,
        updatedAt: serverTimestamp(),
      });

      showNotification("Image updated successfully!", "success");
      setEditingImageUrl("");
      setEditingImageSource("cloudinary");
      fetchData();
    } catch (err) {
      console.error("Error updating image:", err);
      showNotification("Failed to update image!", "error");
    } finally {
      setIsUpdatingImage(false);
    }
  };


  const saveToFirestore = async (finalImageUrl) => {
    try {
      const path =
        editingType === "service"
          ? "services"
          : editingType === "benefit"
            ? "benefits"
            : "missionImages";


      if (editingId) {
        await updateDoc(doc(db, path, editingId), {
          title,
          ...(editingType !== "mission" && { description, icon, color }),
          ...(editingType === "mission" && { category }),
          imageUrl: finalImageUrl,
          updatedAt: serverTimestamp(),
        });


        showNotification(`${editingType} updated!`);
      } else {
        await addDoc(collection(db, path), {
          title,
          ...(editingType !== "mission" && { description, icon, color }),
          ...(editingType === "mission" && { category }),
          imageUrl: finalImageUrl,
          createdAt: serverTimestamp(),
        });


        showNotification(`${editingType} added!`);
      }


      resetFields();
      fetchData();
    } catch (err) {
      console.error(err);
      showNotification("Save failed!", "error");
    }


    setIsUploading(false);
  };


  const handleUpload = async () => {
    if (!title.trim()) {
      showNotification("Please fill all fields", "error");
      return;
    }

    // Only require image when adding new items (not when editing)
    if (!editingId && !imageUrl && imageSource !== "cloudinary") {
      showNotification("Please provide an image", "error");
      return;
    }

    // 🔹 GOOGLE DRIVE (URL)
    if (imageSource === "url") {
      if (!imageUrl) {
        showNotification("Please provide a valid Google Drive image", "error");
        return;
      }
      setIsUploading(true);
      await saveToFirestore(imageUrl);
      return;
    }


    // 🔹 CLOUDINARY
    setIsUploading(true);


    try {
      const result = await openCloudinaryWidget();
      const finalImageUrl = result.uploaded ? result.url : imageUrl || "";


      if (!result.uploaded && !imageUrl && !editingId) {
        showNotification("No image provided!", "error");
        setIsUploading(false);
        return;
      }

      // When editing, if no new image, keep the old one
      if (editingId && !result.uploaded && !imageUrl) {
        // Just update text fields, keep existing image
        const path =
          editingType === "service"
            ? "services"
            : editingType === "benefit"
              ? "benefits"
              : "missionImages";

        await updateDoc(doc(db, path, editingId), {
          title,
          ...(editingType !== "mission" && { description, icon, color }),
          ...(editingType === "mission" && { category }),
          updatedAt: serverTimestamp(),
        });

        showNotification(`${editingType} updated!`);
        resetFields();
        fetchData();
        setIsUploading(false);
        return;
      }

      await saveToFirestore(finalImageUrl);
    } catch (err) {
      console.error(err);
      showNotification("Upload failed!", "error");
      setIsUploading(false);
    }
  };


  // Operations Background Functions
  const saveOperationsBackground = async (finalImageUrl) => {
    try {
      const operationsQuery = await getDocs(
        collection(db, "sectionBackgrounds")
      );
      const opBg = operationsQuery.docs.find(
        (d) => d.data().section === "operations"
      );

      if (opBg) {
        // Update existing
        await updateDoc(doc(db, "sectionBackgrounds", opBg.id), {
          imageUrl: finalImageUrl,
          updatedAt: serverTimestamp(),
        });
        showNotification("Operations background updated!", "success");
      } else {
        // Create new
        await addDoc(collection(db, "sectionBackgrounds"), {
          section: "operations",
          imageUrl: finalImageUrl,
          createdAt: serverTimestamp(),
        });
        showNotification("Operations background uploaded!", "success");
      }

      setOperationsDriveUrl("");
      setOperationsImageSource("cloudinary");
      fetchData();
    } catch (err) {
      console.error("Error saving operations background:", err);
      showNotification("Failed to save operations background!", "error");
    }
  };


  const handleOperationsUpload = async () => {
    // 🔹 GOOGLE DRIVE (URL)
    if (operationsImageSource === "url") {
      if (!operationsDriveUrl) {
        showNotification("Please provide a valid Google Drive image", "error");
        return;
      }
      await saveOperationsBackground(operationsDriveUrl);
      return;
    }

    // 🔹 CLOUDINARY
    try {
      const result = await openCloudinaryWidget();
      if (result.uploaded) {
        await saveOperationsBackground(result.url);
      }
    } catch (err) {
      console.error("Error uploading operations background:", err);
      showNotification("Upload failed!", "error");
    }
  };

  const handleDeleteOperationsBackground = async () => {
    if (!window.confirm("Are you sure you want to delete the operations background?")) {
      return;
    }

    try {
      const operationsQuery = await getDocs(
        collection(db, "sectionBackgrounds")
      );
      const opBg = operationsQuery.docs.find(
        (d) => d.data().section === "operations"
      );

      if (opBg) {
        await deleteDoc(doc(db, "sectionBackgrounds", opBg.id));
        showNotification("Operations background deleted!", "success");
        setOperationsBackground("");
        fetchData();
      }
    } catch (err) {
      console.error("Error deleting operations background:", err);
      showNotification("Delete failed!", "error");
    }
  };


  const handleEdit = (item, type) => {
    setEditingId(item.id);
    setEditingType(type);

    setTitle(item.title || "");
    setDescription(item.description || "");
    setCategory(item.category || "");

    setIcon(item.icon || "");
    setColor(item.color || "#302728");
    setImageUrl(item.imageUrl || "");
    setImageSource("cloudinary");

    // Initialize editing image fields
    setEditingImageUrl("");
    setEditingImageSource("cloudinary");

    window.scrollTo({ top: formRef.current.offsetTop - 80, behavior: "smooth" });
  };


  const handleDelete = async (id, type) => {
    try {
      await deleteDoc(
        doc(
          db,
          type === "service"
            ? "services"
            : type === "benefit"
              ? "benefits"
              : "missionImages",
          id
        )
      );


      showNotification(`${type} deleted!`);
      fetchData();
    } catch {
      showNotification("Delete failed!", "error");
    }
  };


  const resetFields = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setIcon("bi-star");
    setColor("#302728");
    setImageUrl("");
    setImageSource("cloudinary");
    setEditingImageUrl("");
    setEditingImageSource("cloudinary");
  };


  return (
    <div className="container mt-4" ref={formRef}>
      <Notification {...notification} onClose={() => setNotification({ message: "", type: notification.type })} />


      {/* Fix heading based on editor mode */}
      <h3 className="mb-3">
        {editingType === "service"
          ? "Service Editor"
          : editingType === "benefit"
            ? "Benefits Editor"
            : editingType === "mission"
              ? "Mission Image Editor"
              : "Operations Background Editor"}
      </h3>


      {/* SWITCH BUTTONS */}
      <div className="mb-3">
        <button className="btn btn-outline-primary me-2" onClick={() => { resetFields(); setEditingType("service"); }}>
          Manage Services
        </button>


        <button className="btn btn-outline-success me-2" onClick={() => { resetFields(); setEditingType("benefit"); }}>
          Manage Benefits
        </button>


        <button className="btn btn-outline-dark me-2" onClick={() => { resetFields(); setEditingType("mission"); }}>
          Manage Mission Images
        </button>

        <button className="btn btn-outline-info" onClick={() => { resetFields(); setEditingType("operations"); }}>
          Manage Operations Background
        </button>
      </div>


      {/* OPERATIONS BACKGROUND SECTION */}
      {editingType === "operations" && (
        <div className="card p-4 mb-4 border-info">
          <h5 className="mb-3">Operations Background Image</h5>

          {/* 🔹 Choose Image Source */}
          <select
            className="form-select mb-3"
            value={operationsImageSource}
            onChange={(e) => setOperationsImageSource(e.target.value)}
          >
            <option value="cloudinary">Use Cloudinary Upload</option>
            <option value="url">Use Google Drive Image</option>
          </select>

          {/* 🔹 Google Drive Component */}
          {operationsImageSource === "url" && (
            <GoogleDriveImage onImageReady={(url) => setOperationsDriveUrl(url)} />
          )}

          <button className="btn btn-info" onClick={handleOperationsUpload}>
            {operationsBackground ? "Update Background" : "Upload Background"}
          </button>

          {/* Current Background Preview */}
          {operationsBackground && (
            <div className="mt-4">
              <h6 className="mb-2">Current Background:</h6>
              <img
                src={operationsBackground}
                alt="Operations Background"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  borderRadius: "8px",
                  objectFit: "cover",
                }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/800x400?text=Image+Unavailable";
                }}
              />
              <div className="mt-2">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleDeleteOperationsBackground}
                >
                  Delete Background
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* FORM (for services, benefits, mission images) */}
      {editingType !== "operations" && (
        <>
          <input
            className="form-control mb-2"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />


          {/* Description only for service/benefit */}
          {editingType !== "mission" && (
            <>
              <input
                className="form-control mb-2"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />


              <input
                className="form-control mb-2"
                placeholder="Bootstrap Icon (bi-star)"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
              />


              <div className="mb-2">
                <input
                  type="color"
                  className="form-control-color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            </>
          )}


          {/* CATEGORY only for mission images */}
          {editingType === "mission" && (
            <select
              className="form-control mb-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              {missionCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
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


          {/* 🔹 Google Drive Component */}
          {imageSource === "url" && !editingId && (
            <GoogleDriveImage onImageReady={(url) => setImageUrl(url)} />
          )}


          {imageUrl && !editingId && (
            <img src={imageUrl} style={{ width: 160, borderRadius: 8, marginTop: 8 }} alt="Preview" />
          )}


          <button className="btn btn-dark mt-2" onClick={handleUpload} disabled={isUploading}>
            {editingId ? "Update Details" : "Add"} {editingType}
          </button>


          {/* EDIT MODE: Show separate image update section */}
          {editingId && (
            <div className="card p-3 mt-3 mb-3 border-warning">
              <h6 className="mb-3">Change Image for this {editingType}</h6>

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


          {editingId && (
            <button
              className="btn btn-secondary"
              onClick={resetFields}
            >
              Cancel Edit
            </button>
          )}
        </>
      )}


      {/* SERVICE LIST */}
      {editingType === "service" && (
        <>
          <h4 className="mt-4">Services</h4>
          <div className="row">
            {services.map((item) => (
              <div key={item.id} className="col-md-4">
                <div className="card p-2 shadow-sm mt-2">
                  {item.imageUrl && (
                    <div className="position-relative">
                      <img
                        src={item.imageUrl}
                        className="card-img-top"
                        style={{ height: 180, objectFit: "cover" }}
                        alt={item.title}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300?text=Image+Unavailable";
                        }}
                      />
                      {updatingImageId === item.id && updatingImageType === "service" && (
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
                          <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Updating...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-center p-2">
                    <h6>{item.title}</h6>
                    <p>{item.description}</p>
                    <i className={`${item.icon}`} style={{ color: item.color, fontSize: 22 }}></i>


                    <div className="mt-2 d-flex flex-wrap justify-content-center gap-1">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(item, "service")}
                        disabled={updatingImageId === item.id && updatingImageType === "service"}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => handleUpdateImage(item.id, "service")}
                        disabled={updatingImageId === item.id && updatingImageType === "service"}
                      >
                        {updatingImageId === item.id && updatingImageType === "service" ? (
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
                        onClick={() => handleDelete(item.id, "service")}
                        disabled={updatingImageId === item.id && updatingImageType === "service"}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}


      {/* BENEFITS LIST */}
      {editingType === "benefit" && (
        <>
          <h4 className="mt-5 text-success fw-bold">Benefits</h4>
          <div className="row">
            {benefits.map((item) => (
              <div key={item.id} className="col-md-4">
                <div className="card p-2 shadow-sm mt-2 border-success">
                  {item.imageUrl && (
                    <div className="position-relative">
                      <img
                        src={item.imageUrl}
                        className="card-img-top"
                        style={{ height: 180, objectFit: "cover" }}
                        alt={item.title}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300?text=Image+Unavailable";
                        }}
                      />
                      {updatingImageId === item.id && updatingImageType === "benefit" && (
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
                          <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Updating...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-center p-2">
                    <h6>{item.title}</h6>
                    <p>{item.description}</p>
                    <i className={`${item.icon}`} style={{ color: item.color, fontSize: 22 }}></i>


                    <div className="mt-2 d-flex flex-wrap justify-content-center gap-1">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(item, "benefit")}
                        disabled={updatingImageId === item.id && updatingImageType === "benefit"}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => handleUpdateImage(item.id, "benefit")}
                        disabled={updatingImageId === item.id && updatingImageType === "benefit"}
                      >
                        {updatingImageId === item.id && updatingImageType === "benefit" ? (
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
                        onClick={() => handleDelete(item.id, "benefit")}
                        disabled={updatingImageId === item.id && updatingImageType === "benefit"}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}


      {/* MISSION IMAGES LIST */}
      {editingType === "mission" && (
        <>
          <h4 className="mt-5 text-primary fw-bold">Mission Images</h4>
          <div className="row">
            {missionImages.map((item) => (
              <div key={item.id} className="col-md-4">
                <div className="card p-2 shadow-sm mt-2 border-primary">
                  {item.imageUrl && (
                    <div className="position-relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="card-img-top"
                        style={{ height: 180, objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/400x300?text=Image+Unavailable";
                        }}
                      />
                      {updatingImageId === item.id && updatingImageType === "mission" && (
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50">
                          <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Updating...</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}


                  <div className="text-center p-2">
                    <h6>{item.title}</h6>
                    <p className="text-muted">{item.category}</p>


                    <div className="mt-2 d-flex flex-wrap justify-content-center gap-1">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => handleEdit(item, "mission")}
                        disabled={updatingImageId === item.id && updatingImageType === "mission"}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-info btn-sm"
                        onClick={() => handleUpdateImage(item.id, "mission")}
                        disabled={updatingImageId === item.id && updatingImageType === "mission"}
                      >
                        {updatingImageId === item.id && updatingImageType === "mission" ? (
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
                        onClick={() => handleDelete(item.id, "mission")}
                        disabled={updatingImageId === item.id && updatingImageType === "mission"}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}


export default ServiceManager;