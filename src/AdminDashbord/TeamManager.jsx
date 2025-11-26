// src/components/TeamManager.jsx
import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import CustomEditor from "../Components/CustomTexteditor";

const initialForm = {
  name: "",
  role: "",
  img: "",
  bio: "",
  bigParagraph: "",
  facebook: "",
  twitter: "",
  linkedin: "",
  instagram: "",
  photos: "",
  youtube: "",
  sNo: "",
};

function TeamManager() {
  const [team, setTeam] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Create a heading ref
  const headingRef = useRef(null);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "team"));
      const teamData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      teamData.sort((a, b) => {
        const aSNo = a.sNo !== undefined && a.sNo !== "" ? Number(a.sNo) : Number.MAX_SAFE_INTEGER;
        const bSNo = b.sNo !== undefined && b.sNo !== "" ? Number(b.sNo) : Number.MAX_SAFE_INTEGER;
        return aSNo - bSNo;
      });
      setTeam(teamData);
    } catch (error) {
      alert("Error fetching team members: " + error.message);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleUploadProfileImage = () => {
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dgxhp09em",
        uploadPreset: "unsigned_preset",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setForm((f) => ({ ...f, img: result.info.secure_url }));
        }
      }
    );
    myWidget.open();
  };

  const handleUploadGalleryPhoto = () => {
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: "dgxhp09em",
        uploadPreset: "unsigned_preset",
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setForm((f) => ({
            ...f,
            photos: f.photos
              ? f.photos + ", " + result.info.secure_url
              : result.info.secure_url,
          }));
        }
      }
    );
    myWidget.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (form.sNo !== "" && (isNaN(Number(form.sNo)) || Number(form.sNo) < 1)) {
      alert("S.No must be a positive number");
      setLoading(false);
      return;
    }

    const data = {
      name: form.name,
      role: form.role,
      img: form.img,
      bio: form.bio,
      bigParagraph: form.bigParagraph,
      social: {
        facebook: form.facebook,
        twitter: form.twitter,
        linkedin: form.linkedin,
        instagram: form.instagram,
      },
      photos: form.photos
        ? form.photos.split(",").map((url) => url.trim()).filter(Boolean)
        : [],
      youtube: form.youtube,
      sNo: form.sNo !== "" ? Number(form.sNo) : null,
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "team", editingId), data);
      } else {
        await addDoc(collection(db, "team"), data);
      }
      resetForm();
      fetchTeam();
    } catch (err) {
      alert("Error saving team member: " + err.message);
    }
    setLoading(false);
  };

const handleEdit = (member) => {
  setForm({
    name: member.name || "",
    role: member.role || "",
    img: member.img || "",
    bio: member.bio || "",
    bigParagraph: member.bigParagraph || "",
    facebook: member.social?.facebook || "",
    twitter: member.social?.twitter || "",
    linkedin: member.social?.linkedin || "",
    instagram: member.social?.instagram || "",
    photos: member.photos ? member.photos.join(", ") : "",
    youtube: member.youtube || "",
    sNo: member.sNo !== undefined && member.sNo !== null ? String(member.sNo) : "",
  });
  setEditingId(member.id);

  // Scroll to heading with offset
  if (headingRef.current) {
    const yOffset = -156;  // <-- adjust this value for your header height
    const y = headingRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
};

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  return (
    <div className="container my-4">
      {/* 3. Set ref on heading */}
      <h3 className="mb-3" ref={headingRef}>
        {editingId ? "Edit Team Member" : "Add Team Member"}
      </h3>
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label">Full Name</label>
          <input
            className="form-control"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Role</label>
          <input
            className="form-control"
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Enter your role"
            required
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">S.No (Order)</label>
          <input
            type="number"
            className="form-control"
            name="sNo"
            value={form.sNo}
            onChange={handleChange}
            placeholder="Order number"
            min={1}
          />
        </div>
        <div className="col-md-6 d-flex align-items-center gap-2">
          <input
            className="form-control"
            name="img"
            value={form.img}
            onChange={handleChange}
            placeholder="Profile Image URL"
            required
            readOnly
          />
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleUploadProfileImage}
          >
            Upload Image
          </button>
        </div>
        <div className="col-md-6">
          <input
            className="form-control"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Short Bio"
            required
          />
        </div>
        <div className="col-12">
          <CustomEditor
            value={form.bigParagraph}
            setValue={(val) =>
              setForm((prev) => ({ ...prev, bigParagraph: val }))
            }
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            name="facebook"
            value={form.facebook}
            onChange={handleChange}
            placeholder="Facebook URL"
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            name="twitter"
            value={form.twitter}
            onChange={handleChange}
            placeholder="Twitter URL"
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            name="linkedin"
            value={form.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn URL"
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            placeholder="Instagram URL"
          />
        </div>
        <div className="col-12">
          <input
            className="form-control"
            name="youtube"
            value={form.youtube}
            onChange={handleChange}
            placeholder="YouTube Video Links (comma separated)"
          />
        </div>
        <div className="col-12 d-flex align-items-center gap-2">
          <input
            className="form-control"
            name="photos"
            value={form.photos}
            onChange={handleChange}
            placeholder="Gallery Photo URLs (comma separated)"
          />
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleUploadGalleryPhoto}
          >
            Upload Gallery Photo
          </button>
        </div>
        <div className="col-12 d-flex gap-2">
          <button className="btn btn-success" type="submit" disabled={loading}>
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button className="btn btn-secondary" type="button" onClick={handleCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>

      <h4 className="mb-3">Team Members</h4>
      <div className="row g-3">
        {team.map((member) => (
          <div className="col-md-4" key={member.id}>
            <div className="card h-100 shadow-sm p-3">
              <div className="d-flex align-items-center mb-2">
                <img
                  src={member.img}
                  alt={member.name}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid #0d6efd",
                    marginRight: 16,
                  }}
                />
                <div>
                  <h6 className="mb-0">{member.name}</h6>
                  <div className="text-primary small">{member.role}</div>
                  {member.sNo !== undefined && member.sNo !== null && (
                    <div className="text-muted small">Order: {member.sNo}</div>
                  )}
                </div>
              </div>
              <div className="mb-2 small text-muted">{member.bio}</div>
              <div className="mb-2">
                {member.social?.facebook && (
                  <a href={member.social.facebook} target="_blank" rel="noreferrer" className="me-2">FB</a>
                )}
                {member.social?.twitter && (
                  <a href={member.social.twitter} target="_blank" rel="noreferrer" className="me-2">TW</a>
                )}
                {member.social?.linkedin && (
                  <a href={member.social.linkedin} target="_blank" rel="noreferrer" className="me-2">IN</a>
                )}
                {member.social?.instagram && (
                  <a href={member.social.instagram} target="_blank" rel="noreferrer">IG</a>
                )}
              </div>
              <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(member)}>
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamManager;
