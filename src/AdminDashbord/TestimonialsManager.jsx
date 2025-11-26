import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";
import CustomEditor from "../Components/CustomTexteditor";

// Avatars (these are urls and will be used directly as imageUrl)
const PROFILE_ICONS = {
  male: "https://res.cloudinary.com/dgxhp09em/image/upload/v1754493587/man_yuwvpt.png",
  female: "https://res.cloudinary.com/dgxhp09em/image/upload/v1754494022/woman_xlnrsu.png",
  other: "https://res.cloudinary.com/dgxhp09em/image/upload/v1754493586/transgender_kqty3z.png",
};
const GENDERS = [
  { key: "male", label: "Male", imageUrl: PROFILE_ICONS.male },
  { key: "female", label: "Female", imageUrl: PROFILE_ICONS.female },
  { key: "other", label: "Other", imageUrl: PROFILE_ICONS.other },
];

function Toast({ show, message, type, onClose }) {
  if (!show) return null;
  return (
    <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 9999, minWidth: 250 }}>
      <div className={`toast align-items-center text-white border-0 show ${type === "success" ? "bg-success" : "bg-danger"}`} role="alert" aria-live="assertive" aria-atomic="true">
        <div className="d-flex">
          <div className="toast-body">{message}</div>
          <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={onClose}></button>
        </div>
      </div>
    </div>
  );
}

// For fallback if image fails (always fallback to neutral icon)
function handleImageError(e) {
  if (!e.target.dataset.fallback) {
    e.target.src = PROFILE_ICONS.other;
    e.target.dataset.fallback = "1";
    e.target.style.objectFit = "contain";
    e.target.style.background = "#f8f9fa";
    e.target.style.padding = "12px";
  } else {
    e.target.style.display = "none";
  }
}

function StarRating({ value = 0, onChange }) {
  return (
    <div style={{ fontSize: 24 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={star <= value ? 'star-filled' : 'star-empty'}
          style={{
            cursor: onChange ? "pointer" : "default",
            color: star <= value ? "#ffc107" : "#dee2e6",
            transition: "transform 0.1s"
          }}
          onClick={onChange ? () => onChange(star) : undefined}
        >★</span>
      ))}
    </div>
  );
}

function ConfirmPhotoModal({ show, onClose, onEditType, onKeep }) {
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', left: 0, top: 0, width: '100vw', height: '100vh', zIndex: 2001, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: 10, padding: 32, maxWidth: 350, width: '95vw', textAlign: 'center', boxShadow: '0 8px 36px rgba(0,0,0,0.09)' }}>
        <div style={{ fontSize: 19, fontWeight: 600, marginBottom: 17 }}>Change Testimonial Avatar</div>
        <div className="mb-3">Would you like to upload a new photo or set a gender icon?</div>
        <div className="d-flex gap-2 justify-content-center flex-wrap">
          <button className="btn btn-primary" onClick={() => onEditType("image")}>Upload Photo</button>
          <button className="btn btn-outline-secondary" onClick={() => onEditType("icon")}>Use Gender Icon</button>
          <button className="btn btn-secondary" onClick={onKeep}>Keep Existing</button>
        </div>
        <button className="btn btn-link text-danger small mt-3" onClick={onClose} style={{ fontSize: 13 }}>Cancel</button>
      </div>
    </div>
  );
}

function TestimonialsManager() {
  const [items, setItems] = useState([]);
  // All users—whether icon or photo—just have imageUrl for display!
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    title: "",
    text: "",
    stars: 5,
    gender: "male",
    imageUrl: PROFILE_ICONS.male // default to male icon
  });
  const [showCreateType, setShowCreateType] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showToast, setShowToast] = useState({ show: false, message: "", type: "success" });
useEffect(() => {
  async function fetchTestimonials () {
    try {
      const snapshot = await getDocs(collection(db, "testimonials"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      // Handle error if needed
    }
  }
  fetchTestimonials();
}, []);


  const fireToast = (message, type = "success") => {
    setShowToast({ show: true, message, type });
    setTimeout(() => setShowToast({ show: false, message: "", type }), 2400);
  };

  async function fetchTestimonials() {
    try {
      const snapshot = await getDocs(collection(db, "testimonials"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      fireToast("Failed to load testimonials", "danger");
    }
  }

  // For gender icon selection
  const handleChooseIcon = key => {
    setNewTestimonial(nt => ({
      ...nt,
      gender: key,
      imageUrl: PROFILE_ICONS[key]
    }));
    setShowCreateType(false);
  };

  // Photo upload
  const handleCreatePhoto = () => {
    setUploading(true);
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dgxhp09em',
        uploadPreset: 'unsigned_preset'
      },
      async (error, result) => {
        setUploading(false);
        if (!error && result && result.event === "success") {
          setNewTestimonial(nt => ({
            ...nt,
            imageUrl: result.info.secure_url
          }));
          setShowCreateType(false);
        } else if (error) {
          fireToast("Upload failed. Please try again.", "danger");
        }
      }
    );
    myWidget.open();
  };

  // Add new testimony
  async function handleAdd(e) {
    e.preventDefault();
    const { name, title, text, stars, gender, imageUrl } = newTestimonial;
    if (!name || !title || !text) { fireToast("Fill all fields", "danger"); return; }
    try {
      await addDoc(collection(db, "testimonials"), {
        name,
        title,
        text,
        stars,
        gender,
        imageUrl, // always valid!
        pending: true
      });
      fireToast("Testimonial added", "success");
      setNewTestimonial({
        name: "", title: "", text: "", stars: 5, gender: "male", imageUrl: PROFILE_ICONS.male
      });
      setShowCreateType(false);
      fetchTestimonials();
    } catch (error) {
      fireToast("Failed to add. Try again.", "danger");
    }
  }

  // Begin edit
  const beginEdit = item => {
    setNewTestimonial({
      name: item.name || "",
      title: item.title || "",
      text: item.text || "",
      stars: item.stars || 5,
      gender: item.gender || "male",
      imageUrl: item.imageUrl || PROFILE_ICONS.male
    });
    setEditingId(item.id);
  };

  // Avatar change modal for edit
  const handleEditModal = e => {
    e.preventDefault();
    setShowEditModal(true);
  };

  function handleEditType(type) {
    setShowEditModal(false);
    if (type === "image") handleEditPhoto();
    if (type === "icon") setShowCreateType("edit-icon-choice");
  }
  function handleEditPhoto() {
    setUploading(true);
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dgxhp09em',
        uploadPreset: 'unsigned_preset'
      },
      async (error, result) => {
        setUploading(false);
        if (!error && result && result.event === "success") {
          adminEditSubmit({ imageUrl: result.info.secure_url });
        } else if (error) {
          fireToast("Upload failed. Please try again.", "danger");
        }
      }
    );
    myWidget.open();
  }
  function handleEditIconChoice(key) {
    adminEditSubmit({
      gender: key,
      imageUrl: PROFILE_ICONS[key]
    });
    setShowCreateType(false);
  }
  async function adminEditSubmit(overrideFields = {}) {
    const { name, title, text, stars, gender, imageUrl } = { ...newTestimonial, ...overrideFields };
    try {
      await updateDoc(doc(db, "testimonials", editingId), {
        name, title, text, stars, gender, imageUrl
      });
      fireToast("Testimonial updated", "success");
      setEditingId(null);
      setNewTestimonial({
        name: "", title: "", text: "", stars: 5, gender: "male", imageUrl: PROFILE_ICONS.male
      });
      fetchTestimonials();
      setShowCreateType(false);
    } catch (error) {
      fireToast("Failed to save.", "danger");
    }
  }
  function handleEditKeep() {
    setShowEditModal(false);
    adminEditSubmit();
  }

  const handleApprove = async id => {
    try {
      await updateDoc(doc(db, "testimonials", id), { pending: false });
      fireToast("Approved", "success");
      fetchTestimonials();
    } catch {
      fireToast("Failed to approve", "danger");
    }
  };

  const handleDelete = async id => {
    try {
      await deleteDoc(doc(db, "testimonials", id));
      fireToast("Deleted", "success");
      fetchTestimonials();
      if (editingId === id) setEditingId(null);
    } catch {
      fireToast("Failed to delete", "danger");
    }
  };

  return (
    <div className="container py-3" style={{ maxWidth: '1200px', minHeight: '100vh' }}>
      <Toast {...showToast} onClose={() => setShowToast({ ...showToast, show: false })} />
      <ConfirmPhotoModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEditType={handleEditType}
        onKeep={handleEditKeep}
      />
      <h3 className="mb-4">Testimonials Manager</h3>
      <div className="card p-4 mb-4 shadow-sm" style={{ borderRadius: '16px' }}>
        <form onSubmit={editingId ? handleEditModal : handleAdd}>
          <div className="row g-3">
            <div className="col-sm-5 col-md-4 text-center position-relative">
              <div className="d-flex flex-column align-items-center py-1">
                <div
                  className="mb-2"
                  style={{
                    width: 88, height: 88, borderRadius: "50%", border: "4px solid #dee2e6", background: "#f8f9fa",
                    display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 3px 18px #0d6efd14",
                    fontSize: 54, overflow: "hidden"
                  }}
                >
                  <img 
                    src={newTestimonial.imageUrl}
                    className="img-fluid"
                    style={{ width: '100%', height: '100%', objectFit: "cover" }}
                    alt="Profile"
                    onError={handleImageError}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  style={{ borderRadius: 14, fontSize: 14, width: "75%" }}
                  disabled={uploading}
                  onClick={() => editingId ? setShowEditModal(true) : setShowCreateType(!showCreateType)}
                >
                  {showCreateType ? "Hide Options" : "Set Avatar"}
                </button>
                <div className="text-muted small mt-1">{editingId ? "Edit avatar" : "Choose avatar"}</div>
              </div>
              {(showCreateType === true || showCreateType === "edit-icon-choice") && (
                <div
                  className="mt-3 border-top pt-3"
                  style={{
                    position: 'relative',
                    zIndex: 10,
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    padding: '12px',
                    width: '100%'
                  }}
                >
                  <div className="mb-2 fw-bold">Choose Avatar</div>
                  <div className="d-flex flex-wrap gap-2 justify-content-center">
                    {GENDERS.map(g => (
                      <button
                        key={g.key}
                        className={`btn d-flex flex-column align-items-center px-2 py-1 ${newTestimonial.gender === g.key && showCreateType === "edit-icon-choice" ? 'btn-primary' : 'btn-outline-primary'}`}
                        style={{ borderRadius: '0.8rem', minWidth: 70, transition: '0.2s' }}
                        onClick={() => showCreateType === "edit-icon-choice"
                          ? handleEditIconChoice(g.key)
                          : handleChooseIcon(g.key)}
                      >
                        <img
                          src={g.imageUrl}
                          alt={g.label}
                          width={24}
                          height={24}
                          className="mb-1"
                          onError={handleImageError}
                        />
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{g.label}</span>
                      </button>
                    ))}
                    {(!editingId || showCreateType !== "edit-icon-choice") && (
                      <button
                        className="btn btn-success d-flex align-items-center px-3 py-1"
                        style={{ borderRadius: '0.8rem', fontSize: 14 }}
                        onClick={editingId ? handleEditPhoto : handleCreatePhoto}
                      >
                        <i className="bi bi-upload me-1"></i> Upload
                      </button>
                    )}
                    <button
                      className="btn btn-secondary py-1"
                      style={{ borderRadius: '0.8rem' }}
                      onClick={() => setShowCreateType(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="col-sm-7 col-md-8">
              <div className="form-floating mb-3">
                <input
                  type="text"
                  id="testimonialName"
                  name="name"
                  placeholder="Name"
                  value={newTestimonial.name}
                  onChange={e => setNewTestimonial(v => ({ ...v, name: e.target.value }))}
                  className="form-control"
                  required
                />
                <label htmlFor="testimonialName"><i className="bi bi-person"></i> Name</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  id="testimonialTitle"
                  name="title"
                  placeholder="Title"
                  value={newTestimonial.title}
                  onChange={e => setNewTestimonial(v => ({ ...v, title: e.target.value }))}
                  className="form-control"
                  required
                />
                <label htmlFor="testimonialTitle"><i className="bi bi-person-workspace"></i> Designation</label>
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <CustomEditor
                  value={newTestimonial.text}
                  setValue={val => setNewTestimonial(v => ({ ...v, text: val }))}
                />
              </div>
              <div className="mb-2">
                <label className="form-label">Stars</label>
                <StarRating
                  value={newTestimonial.stars}
                  onChange={stars => setNewTestimonial(v => ({ ...v, stars }))}
                />
              </div>
              <div className="d-flex gap-2 mt-3">
                <button
                  className="btn btn-success"
                  type="submit"
                  disabled={uploading}
                  style={{ minWidth: 130 }}
                >
                  {editingId ? "Save Changes" : "Add Testimonial"}
                </button>
                {editingId && (
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setNewTestimonial({ name: "", title: "", text: "", stars: 5, gender: "male", imageUrl: PROFILE_ICONS.male });
                      setShowCreateType(false);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
      
      {/* Testimonials grid */}
      <div className="row">
        {items.length === 0 ? (
          <div className="col-12 text-center py-5">
            <div className="display-4 text-muted mb-3">
              <i className="bi bi-chat-square-quote"></i>
            </div>
            <h4 className="mb-3">No Testimonials Yet</h4>
            <p className="text-muted">Add your first testimonial using the form above</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="col-md-4 col-sm-6 mb-4 d-flex">
              <div className={`card h-100 shadow w-100 ${item.pending ? "border-warning border-2" : "border-0"}`} style={{ borderRadius: '16px', display: "flex", flexDirection: "column" }}>
                <div className="position-relative w-100" style={{ height: '200px', background: "#f8f9fa" }}>
                  <img
                    src={item.imageUrl}
                    className="card-img-top"
                    alt={item.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: "cover",
                      backgroundColor: "#f8f9fa",
                      borderTopLeftRadius: '16px',
                      borderTopRightRadius: '16px'
                    }}
                    onError={handleImageError}
                  />
                  {item.pending && (
                    <span className="position-absolute top-0 start-0 m-2 badge rounded-pill bg-warning text-dark" style={{ fontSize: 13 }}>
                      <i className="bi bi-hourglass-split me-1"></i> Pending
                    </span>
                  )}
                </div>
                <div className="card-body d-flex flex-column">
                  <div>
                    <h5 className="fw-bold mb-0">{item.name}</h5>
                    <div className="text-muted mb-1">{item.title}</div>
                    <div className="mb-2" aria-label={`Rated ${item.stars || 5} stars`}>
                      {[1,2,3,4,5].map(star => (
                        <span
                          key={star}
                          className={star <= (item.stars || 0) ? 'star-filled' : 'star-empty'}
                          style={{
                            color: star <= (item.stars || 0) ? '#ffc107' : '#dee2e6',
                            fontSize: 20
                          }}
                        >★</span>
                      ))}
                    </div>
                    <div
                      className="card-text"
                      style={{ fontSize: 15, color: "#323232", maxHeight: '86px', overflow: 'hidden' }}
                      dangerouslySetInnerHTML={{
                        __html: item.text?.slice(0, 320) + (item.text && item.text.length > 320 ? "..." : "")
                      }}
                    />
                  </div>
                  <div className="d-flex gap-2 flex-wrap mt-auto pt-3">
                    <button className="btn btn-primary btn-sm" onClick={() => beginEdit(item)}>
                      Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                    {item.pending && (
                      <button className="btn btn-success btn-sm" onClick={() => handleApprove(item.id)}>
                        <i className="bi bi-check-circle me-1"></i>Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        .star-filled {
          text-shadow: 0 0 2px rgba(0,0,0,0.2), 0 1px 1px rgba(0,0,0,0.2);
        }
        .star-empty {
          color: #dee2e6;
        }
        .card {
          border-radius: 1rem;
          background: #fafbfc;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.09);
        }
        .card-img-top {
          border-top-left-radius: 1rem !important;
          border-top-right-radius: 1rem !important;
        }
        .btn-sm {
          border-radius: 0.7rem;
        }
        @media (max-width: 767px) {
          .col-md-4, .col-sm-6 {
            max-width: 100% !important;
            flex: 0 0 100% !important;
          }
        }
      `}</style>
    </div>
  );
}

export default TestimonialsManager;
