import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, doc, getDocs, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import CustomEditor from "../Components/CustomTexteditor";
export default function AboutManager() {
  // --- Stats ---
  const [stats, setStats] = useState({
    studentsHelped: 0,
    treesPlanted: 0,
    pondsRestored: 0,
    communitiesServed: 0,
  });

  // --- Main content ---
  const [content, setContent] = useState({
    orgProfile: "",
    vision: "",
  });

  // --- Dynamic sections ---
  const [sections, setSections] = useState([]);

  // --- Messages & loading ---
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // --- Fetch all data ---
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      try {
        // Stats
        const statsSnap = await getDoc(doc(db, "stats", "about"));
        if (isMounted && statsSnap.exists()) setStats(statsSnap.data());

        // Main content
        const contentSnap = await getDoc(doc(db, "aboutContent", "main"));
        if (isMounted && contentSnap.exists()) setContent(contentSnap.data());

        // Dynamic sections
        const secSnap = await getDocs(collection(db, "aboutSections"));
        if (isMounted)
          setSections(
            secSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
      } catch (err) {
        console.error("Error fetching About data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // --- Handlers ---
  const handleStatsChange = (e) => {
    setStats((s) => ({
      ...s,
      [e.target.name]: parseInt(e.target.value, 10) || 0,
    }));
  };
  const handleSectionChange = (index, field, value) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    setSections(newSections);
  };

  const handleAddSection = () => {
    const newId = `temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setSections([
      ...sections,
      { id: newId, title: "", content: "", category: "" },
    ]);
  };

  const handleDeleteSection = async (id, index) => {
    if (!window.confirm("Are you sure to delete this section?")) return;
    try {
      if (!id.startsWith("temp-")) await deleteDoc(doc(db, "aboutSections", id));
      setSections(sections.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error deleting section:", err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Save stats
      await setDoc(doc(db, "stats", "about"), stats, { merge: true });

      // Save main content
      await setDoc(doc(db, "aboutContent", "main"), content, { merge: true });

      // Save sections (category stored as CSV)
      for (const sec of sections) {
        const dataToSave = {
          ...sec,
          category: (sec.category || "")
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
            .join(", "), // normalize spacing
        };
        await setDoc(doc(db, "aboutSections", sec.id), dataToSave, { merge: true });
      }

      setMsg("About page updated!");
    } catch (err) {
      console.error("Save error:", err);
      setMsg("Failed to update. Try again.");
    }
    setSaving(false);
    setTimeout(() => setMsg(""), 2000);
  };

  if (loading) return <div>Loading About Manager...</div>;

  return (
    <form onSubmit={handleSave} style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h3>Edit About Page</h3>

      {/* Stats */}
      <h5 className="mt-3">Stats</h5>
      {["studentsHelped", "treesPlanted", "pondsRestored", "communitiesServed"].map(
        (key) => (
          <label key={key} className="d-block mb-2 ">
            {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
            <input
              type="number"
              name={key}
              value={stats[key]}
              onChange={handleStatsChange}
              className="form-control textarea-secondary "
            />
          </label>
        )
      )}

      {/* Main Content */}
      <h5 className="mt-3">Organization Profile</h5>
      <CustomEditor
      value={content.orgProfile}
      setValue={(val) => setContent(prev => ({ ...prev, orgProfile: val }))}
      />

      <h5 className="mt-3">Vision</h5>
      <CustomEditor
      value={content.vision}
      setValue={(val) => setContent(prev => ({ ...prev, vision: val }))}
      />


      {/* Dynamic Sections */}
      <h5 className="mt-4">Sections</h5>
      {sections.map((sec, idx) => (
        <div key={sec.id} className="mb-3 p-3 border rounded">
          <input
            type="text"
            placeholder="Section Title"
            value={sec.title}
            onChange={(e) => handleSectionChange(idx, "title", e.target.value)}
            className="form-control mb-2 textarea-secondary "
          />
          <CustomEditor
          value={sec.content}
          setValue={(newValue) => handleSectionChange(idx, "content", newValue)}
          />

          <input
            type="text"
            placeholder="Gallery Categories (comma separated)"
            value={sec.category}
            onChange={(e) => handleSectionChange(idx, "category", e.target.value)}
            className="form-control mb-2 textarea-secondary "
          />
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => handleDeleteSection(sec.id, idx)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={handleAddSection}
      >
        Add New Section
      </button>

      {/* Save Button */}
      <div>
        <button type="submit" className="btn btn-success" disabled={saving}>
          {saving ? "Saving..." : "Save All"}
        </button>
        <div className="mt-2 text-success">{msg}</div>
      </div>
    </form>
  );
}
