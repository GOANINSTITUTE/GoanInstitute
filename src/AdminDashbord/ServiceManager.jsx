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

  const [missionImages, setMissionImages] = useState([]);
  const [services, setServices] = useState([]);
  const [benefits, setBenefits] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editingType, setEditingType] = useState("service");
  const [notification, setNotification] = useState({ message: "", type: "success" });
  const [isUploading, setIsUploading] = useState(false);
  const [updatingImageId, setUpdatingImageId] = useState(null);
  const [updatingImageType, setUpdatingImageType] = useState(null);

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

  const handleUpload = async () => {
    if (!title.trim()) {
      showNotification("Please fill all fields", "error");
      return;
    }

    setIsUploading(true);

    try {
      const result = await openCloudinaryWidget();
      const path =
        editingType === "service"
          ? "services"
          : editingType === "benefit"
          ? "benefits"
          : "missionImages";

      const newImage = result.uploaded ? result.url : imageUrl || "";

      if (editingId) {
        await updateDoc(doc(db, path, editingId), {
          title,
          ...(editingType !== "mission" && { description, icon, color }),
          ...(editingType === "mission" && { category }),
          imageUrl: newImage,
          updatedAt: serverTimestamp(),
        });

        showNotification(`${editingType} updated!`);
      } else {
        await addDoc(collection(db, path), {
          title,
          ...(editingType !== "mission" && { description, icon, color }),
          ...(editingType === "mission" && { category }),
          imageUrl: newImage,
          createdAt: serverTimestamp(),
        });

        showNotification(`${editingType} added!`);
      }

      resetFields();
      fetchData();
    } catch (err) {
      console.error(err);
      showNotification("Upload failed!", "error");
    }

    setIsUploading(false);
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
          : "Mission Image Editor"}
      </h3>

      {/* SWITCH BUTTONS */}
      <div className="mb-3">
        <button className="btn btn-outline-primary me-2" onClick={() => { resetFields(); setEditingType("service"); }}>
          Manage Services
        </button>

        <button className="btn btn-outline-success me-2" onClick={() => { resetFields(); setEditingType("benefit"); }}>
          Manage Benefits
        </button>

        <button className="btn btn-outline-dark" onClick={() => { resetFields(); setEditingType("mission"); }}>
          Manage Mission Images
        </button>
      </div>

      {/* FORM */}
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

      {imageUrl && (
        <img src={imageUrl} style={{ width: 160, borderRadius: 8 }} alt="Preview" />
      )}

      <button className="btn btn-dark mt-2" onClick={handleUpload} disabled={isUploading}>
        {editingId ? "Update" : "Add"} {editingType}
      </button>

      {/* SERVICE LIST */}
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
                    Edit Details
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

      {/* BENEFITS LIST */}
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
                    Edit Details
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

      {/* MISSION IMAGES LIST */}
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
                    Edit Details
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
    </div>
  );
}

export default ServiceManager;