import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

// 🔹 Default Profile Icons
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

const ShareYourStory = ({ onSubmitted, editData = null, onCancelEdit }) => {
  const [form, setForm] = useState({
    name: "",
    title: "",
    text: "",
    stars: 5,
    gender: "",
    imageUrl: "",
    type: "student",
  });

  const [showImageDialog, setShowImageDialog] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // 🟦 Prefill when editing
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        title: editData.title || "",
        text: editData.text || "",
        stars: editData.stars || 5,
        gender: editData.gender || "",
        imageUrl: editData.imageUrl || "",
        type: editData.type || "student",
      });
    } else {
      setForm({
        name: "",
        title: "",
        text: "",
        stars: 5,
        gender: "",
        imageUrl: "",
        type: "student",
      });
      setDone(false);
    }
  }, [editData]);

  // 🟨 Handle "Add Photo" prompt
  const handleProfilePrompt = () => setShowImageDialog("ask");

  const handleProfileChoice = (response) => {
    setShowImageDialog(response === "yes" ? "upload" : "choose-gender");
  };

  const handleGenderSelect = (key) => {
    setForm((f) => ({
      ...f,
      gender: key,
      imageUrl: PROFILE_ICONS[key],
    }));
    setShowImageDialog(null);
  };

  const handleUploadImg = () => {
    setUploading(true);
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dqjcejidw",
        uploadPreset: "goanins",
      },
      (error, result) => {
        setUploading(false);
        if (!error && result && result.event === "success") {
          setForm((f) => ({
            ...f,
            imageUrl: result.info.secure_url,
            gender: "",
          }));
          setShowImageDialog(null);
        }
      }
    );
    widget.open();
  };

  const setStarValue = (val) => setForm((f) => ({ ...f, stars: val }));

  // 🟩 Submit new or edit existing
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.title || !form.text)
      return alert("Please fill all required fields.");

    setSubmitting(true);
    try {
      if (editData?.id) {
        // ✏️ Update existing testimonial
        await updateDoc(doc(db, "testimonials", editData.id), {
          name: form.name.trim(),
          title: form.title.trim(),
          text: form.text.trim(),
          stars: form.stars,
          gender: form.gender,
          imageUrl: form.imageUrl || "",
          type: form.type || "student",
          updatedAt: serverTimestamp(),
        });
      } else {
        // 🆕 Add new testimonial
        await addDoc(collection(db, "testimonials"), {
          name: form.name.trim(),
          title: form.title.trim(),
          text: form.text.trim(),
          stars: form.stars,
          gender: form.gender,
          imageUrl: form.imageUrl || "",
          type: form.type || "student",
          createdAt: serverTimestamp(),
          pending: true,
        });
      }

      setDone(true);
      if (onSubmitted) onSubmitted();
    } catch (err) {
      console.error("Error submitting testimonial:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="card shadow-sm border-0 p-4 mb-5 bg-light"
      style={{ borderRadius: "1.2rem" }}
    >
      <h4 className="mb-2 fw-bold" style={{ color: "var(--secondary)" }}>
        {editData ? "Edit Testimonial" : "Share Your Story"}
      </h4>

      <p className="mb-4 text-muted">
        {editData
          ? "Update your testimonial details below."
          : "How has GICE Institution touched your life or community? Let us know below!"}
      </p>

      {done && !editData ? (
        <div className="alert alert-success text-center shadow-sm">
          <i className="bi bi-check-circle me-2"></i>
          Thank you for sharing your story! We value your voice.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="row g-3 px-md-3 px-1">
          {/* Profile Photo */}
          <div className="col-12 text-center mb-3">
            <div
              className="d-flex flex-column align-items-center position-relative"
              style={{ width: 92, height: 92, margin: "0 auto" }}
            >
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt="profile"
                  className="img-fluid rounded-circle"
                  style={{ width: 88, height: 88, objectFit: "cover" }}
                />
              ) : (
                <div
                  className="d-flex justify-content-center align-items-center rounded-circle bg-light"
                  style={{
                    width: 88,
                    height: 88,
                    fontSize: 48,
                    color: "#888",
                  }}
                >
                  <i className="bi bi-person-fill"></i>
                </div>
              )}

              <button
                type="button"
                className="btn btn-secondary btn-sm position-absolute bottom-0 end-0 mb-1 me-1 p-1 rounded-circle"
                style={{
                  width: 32,
                  height: 32,
                  fontSize: 14,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={handleProfilePrompt}
                disabled={uploading || submitting}
              >
                <i className="bi bi-camera"></i>
              </button>
            </div>
            <small className="text-secondary">
              {!form.imageUrl
                ? "Add a profile photo or pick a gender."
                : "Profile photo set."}
            </small>
          </div>

          {/* Dialogs */}
          {showImageDialog === "ask" && (
            <div className="text-center">
              <div
                className="bg-light rounded-3 border p-3 mb-2 shadow-sm"
                style={{ maxWidth: 340, margin: "0 auto" }}
              >
                <p className="mb-2 fw-semibold">
                  Would you like to upload your real profile photo?
                </p>
                <div className="d-flex gap-2 justify-content-center">
                  <button
                    type="button"
                    className="btn btn-accent px-3"
                    onClick={() => handleProfileChoice("yes")}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className="btn btn-accent px-3"
                    onClick={() => handleProfileChoice("no")}
                  >
                    No
                  </button>
                </div>
                <button
                  className="btn btn-link text-danger mt-2"
                  type="button"
                  onClick={() => setShowImageDialog(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {showImageDialog === "choose-gender" && (
            <div className="text-center">
              <div
                className="bg-light rounded-3 border p-3 shadow-sm"
                style={{ maxWidth: 360, margin: "0 auto" }}
              >
                <p className="fw-semibold mb-2">
                  Which profile icon fits you best?
                </p>
                <div className="d-flex gap-3 justify-content-center">
                  {GENDERS.map((g) => (
                    <button
                      key={g.key}
                      type="button"
                      className={`border-0 bg-transparent text-center ${
                        form.gender === g.key ? "opacity-100" : "opacity-75"
                      }`}
                      onClick={() => handleGenderSelect(g.key)}
                    >
                      <img
                        src={g.icon}
                        alt={g.label}
                        width={42}
                        height={42}
                        className="mb-1"
                      />
                      <div style={{ fontSize: 14, fontWeight: 600 }}>
                        {g.label}
                      </div>
                    </button>
                  ))}
                </div>
                <button
                  className="btn btn-link text-danger mt-2"
                  type="button"
                  onClick={() => setShowImageDialog(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {showImageDialog === "upload" && (
            <div className="text-center">
              <div
                className="bg-light rounded-3 border p-4 shadow-sm"
                style={{ maxWidth: 340, margin: "0 auto" }}
              >
                <p className="fw-semibold mb-3">Upload Profile Photo</p>
                <button
                  type="button"
                  className="btn btn-accent px-4"
                  onClick={handleUploadImg}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
                <button
                  className="btn btn-link text-danger mt-2"
                  type="button"
                  onClick={() => setShowImageDialog(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Input Fields */}
          <div className="col-sm-6">
            <label className="form-label">Your Name</label>
            <input
              required
              className="form-control"
              placeholder="Full Name"
              maxLength={44}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={submitting}
            />
          </div>

          <div className="col-sm-6">
            <label className="form-label">Your Designation / Connection</label>
            <input
              required
              className="form-control"
              placeholder="Eg. Parent, Volunteer, Software Engineer…"
              maxLength={54}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              disabled={submitting}
            />
          </div>

          <div className="col-sm-6">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              disabled={submitting}
            >
              <option value="student">Student</option>
              <option value="faculty">Faculty</option>
              <option value="officestaff">Office Staff</option>
            </select>
          </div>

          <div className="col-12">
            <label className="form-label">Your Testimonial</label>
            <textarea
              required
              className="form-control"
              rows={4}
              maxLength={600}
              placeholder="Share your experience..."
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              disabled={submitting}
            />
            <small className="text-muted">{form.text.length}/600 characters</small>
          </div>

          {/* Star Rating */}
          <div className="col-12 text-center mt-2">
            <StarRating value={form.stars} onChange={setStarValue} />
          </div>

          {/* Buttons */}
          <div className="col-12 d-flex justify-content-between align-items-center">
            {editData && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancelEdit}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : editData
                ? "Update Testimonial"
                : "Submit Testimonial"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// ⭐ Star Rating
function StarRating({ value = 0, onChange }) {
  return (
    <div style={{ fontSize: 24 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange && onChange(star)}
          style={{
            cursor: "pointer",
            color: star <= value ? "var(--accent)" : "#ccc",
            transition: "transform 0.15s",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default ShareYourStory;
