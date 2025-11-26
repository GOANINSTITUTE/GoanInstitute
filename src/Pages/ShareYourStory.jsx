import React, { useState } from "react";
import { db } from "../firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Default profile icon URLs (icons stored as URLs)
const PROFILE_ICONS = {
  male: "https://res.cloudinary.com/dgxhp09em/image/upload/v1754493587/man_yuwvpt.png",
  female: "https://res.cloudinary.com/dgxhp09em/image/upload/v1754494022/woman_xlnrsu.png",
  other: "https://res.cloudinary.com/dgxhp09em/image/upload/v1754493586/transgender_kqty3z.png",
};

const GENDERS = [
  { key: "male", label: "Male", icon: PROFILE_ICONS.male },
  { key: "female", label: "Female", icon: PROFILE_ICONS.female },
  { key: "other", label: "Other", icon: PROFILE_ICONS.other },
];

const ShareYourStory = ({ onSubmitted }) => {
  const [form, setForm] = useState({
    name: "",
    title: "",
    text: "",
    stars: 5,
    gender: "",  // Keep gender for info or later use
    imageUrl: "", // Always store avatar or icon link here
  });

  const [showImageDialog, setShowImageDialog] = useState(null); // null | "ask" | "choose-gender" | "upload"
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Called when user clicks "Add/Change Photo"
  const handleProfilePrompt = () => setShowImageDialog("ask");

  // Chooses upload or icon selection
  const handleProfileChoice = (response) => {
    if (response === "yes") setShowImageDialog("upload");
    else setShowImageDialog("choose-gender");
  };

  // When user picks a gender icon
  const handleGenderSelect = (key) => {
    setForm(form => ({
      ...form,
      gender: key,
      imageUrl: PROFILE_ICONS[key],
    }));
    setShowImageDialog(null);
  };

  // Cloudinary upload handler
  const handleUploadImg = () => {
    setUploading(true);
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dgxhp09em',
        uploadPreset: 'unsigned_preset'
      },
      (error, result) => {
        setUploading(false);
        if (!error && result && result.event === "success") {
          setForm(f => ({
            ...f,
            imageUrl: result.info.secure_url,
            gender: "", // clear gender since uploaded photo overrides
          }));
          setShowImageDialog(null);
        }
      }
    );
    myWidget.open();
  };

  const setStarValue = (val) => setForm((f) => ({ ...f, stars: val }));

  // Submit the testimonial
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addDoc(collection(db, "testimonials"), {
        name: form.name,
        title: form.title,
        text: form.text,
        stars: form.stars,
        gender: form.gender,
        imageUrl: form.imageUrl || "",  // Always a single imageUrl field
        createdAt: serverTimestamp(),
        pending: true,
      });
      setDone(true);
      if (onSubmitted) onSubmitted();
    } catch {
      alert("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 p-4 mb-5" style={{ borderRadius: "1.2rem" }}>
      <h4 className="mb-2" style={{ color: "#0d6efd", fontWeight: 700 }}>Share Your Story</h4>
      <p className="mb-4 text-muted">How has Darvik Foundation touched your life or community? Let us know below!</p>

      {done ? (
        <div className="alert alert-success shadow-sm text-center" role="alert">
          <i className="bi bi-check-circle me-2"></i>
          Thank you for sharing your story! We value your voice.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="row g-3 px-md-3 px-1">
          {/* Profile */}
          <div className="col-12 text-center mb-3">
            <div className="d-flex flex-column align-items-center position-relative" style={{ width: 92, height: 92, margin: "0 auto" }}>
              {form.imageUrl ? (
                <img src={form.imageUrl} alt={form.name || "profile"} 
                  className="img-fluid rounded-circle"
                  style={{ width: 88, height: 88, objectFit: "cover" }}
                />
              ) : (
                <span role="img" aria-label="avatar-placeholder" className="d-flex justify-content-center align-items-center rounded-circle bg-light" 
                  style={{ width: 88, height: 88, fontSize: 48, color: "#adb5bd" }}>
                  <i className="bi bi-person-fill"></i>
                </span>
              )}

              <button
                type="button"
                className="btn btn-primary btn-sm position-absolute bottom-0 end-0 mb-1 me-1 p-1 rounded-circle"
                style={{ width: 32, height: 32, fontSize: 14, display: "flex", justifyContent: "center", alignItems: "center" }}
                onClick={handleProfilePrompt}
                disabled={uploading || submitting}
                aria-label="Choose profile photo"
              >
                <i className="bi bi-camera"></i>
              </button>
            </div>
            <small className="text-muted">
              {!form.imageUrl ? "Add a profile photo or pick a gender." : "Profile photo set."}
            </small>
          </div>

          {/* Modal logic */}
          {showImageDialog === "ask" && (
            <div className="mb-2 d-flex flex-column align-items-center w-100">
              <div className="bg-light rounded-3 border p-3 mb-2 mt-1 shadow-sm" style={{ maxWidth: 340 }}>
                <div style={{ fontWeight: 500 }}>Would you like to add your real profile photo?</div>
                <div className="d-flex gap-2 mt-2 justify-content-center">
                  <button className="btn btn-outline-primary" type="button" onClick={() => handleProfileChoice("yes")}>Yes</button>
                  <button className="btn btn-outline-secondary" type="button" onClick={() => handleProfileChoice("no")}>No</button>
                </div>
                <button className="btn btn-link text-danger p-0 mt-2" type="button" onClick={() => setShowImageDialog(null)} style={{ fontSize: 13 }}>Cancel</button>
              </div>
            </div>
          )}

          {showImageDialog === "choose-gender" && (
            <div className="mb-3 d-flex flex-column align-items-center w-100">
              <div className="bg-light rounded-3 border p-3 mb-2 shadow-sm" style={{ maxWidth: 360 }}>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>Which profile icon best fits you?</div>
                <div className="d-flex gap-3 justify-content-center align-items-center">
                  {GENDERS.map(g => (
                    <button
                      key={g.key}
                      type="button"
                      className={`btn d-flex flex-column align-items-center px-3 py-2 ${form.gender === g.key ? 'btn-primary' : 'btn-outline-primary'}`}
                      style={{ borderRadius: '1rem', minWidth: 78, transition: '0.2s' }}
                      onClick={() => handleGenderSelect(g.key)}
                    >
                      <img src={g.icon} alt={g.label} width={38} height={38} className="mb-1" />
                      <span style={{ fontSize: 14, fontWeight: 600 }}>{g.label}</span>
                    </button>
                  ))}
                </div>
                <button className="btn btn-link text-danger mt-2 p-0" type="button" onClick={() => setShowImageDialog(null)} style={{ fontSize: 13 }}>Cancel</button>
              </div>
            </div>
          )}

          {showImageDialog === "upload" && (
            <div className="mb-3 d-flex flex-column align-items-center w-100">
              <div className="bg-light rounded-3 border p-4 mb-2 shadow-sm text-center" style={{ maxWidth: 340 }}>
                <div style={{ fontWeight: 500, marginBottom: 8 }}>Upload Profile Photo</div>
                <button
                  type="button"
                  className="btn btn-success px-4"
                  style={{ borderRadius: "3rem" }}
                  onClick={handleUploadImg}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
                <button className="btn btn-link text-danger mt-2" type="button" onClick={() => setShowImageDialog(null)} style={{ fontSize: 13 }}>Cancel</button>
              </div>
            </div>
          )}

          {/* Inputs */}
          <div className="col-sm-6">
            <label className="form-label">Your Name</label>
            <input
              required
              name="name"
              className="form-control"
              placeholder="Full Name"
              maxLength={44}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              disabled={submitting}
            />
          </div>
          <div className="col-sm-6">
            <label className="form-label">Your Designation / Connection</label>
            <input
              required
              name="title"
              className="form-control"
              maxLength={54}
              placeholder="Eg. Parent, Volunteer, Software Engineer…"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              disabled={submitting}
            />
          </div>
          <div className="col-sm-12">
            <label className="form-label">Your Testimonial</label>
            <textarea
              required
              name="text"
              className="form-control"
              rows={4}
              maxLength={600}
              placeholder="Share your experience..."
              value={form.text}
              onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
              disabled={submitting}
            />
            <small className="text-muted">{form.text.length}/600 characters</small>
          </div>

          {/* Stars */}
          <div className="col-12 text-center mb-1">
            <StarRating value={form.stars} onChange={setStarValue} />
          </div>

          <div className="col-12 text-end mt-2">
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={submitting}
            >
              {submitting ? "Sending..." : "Submit Testimonial"}
            </button>
          </div>

          <div className="col-12 mt-1 text-muted text-center" style={{ fontSize: "0.97rem" }}>
            <span>
              <i className="bi bi-shield-check me-1" />
              All stories are reviewed before being published.
            </span>
          </div>
        </form>
      )}
      <style>{`
        .star-btn-user {
          font-size: 1.7rem;
          cursor: pointer;
          color: #ffbf00;
          transition: transform 0.15s;
          user-select: none;
        }
        .star-btn-user.inactive {
          color: #dee2e6;
        }
        .star-btn-user:active {
          transform: scale(1.18);
        }
        .card {
          background: #fafbfc;
        }
      `}</style>
    </div>
  );
};

// StarRating for users
function StarRating({ value = 0, onChange }) {
  return (
    <div style={{ fontSize: 24 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star-btn-user${star <= value ? "" : " inactive"}`}
          onClick={onChange ? () => onChange(star) : undefined}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default ShareYourStory;
