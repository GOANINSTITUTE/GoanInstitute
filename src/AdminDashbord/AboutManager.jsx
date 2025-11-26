import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function AboutManager() {
  const [stats, setStats] = useState({
    studentsHelped: "",
    treesPlanted: "",
    pondsRestored: "",
    communitiesServed: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, "stats", "about"));
        if (isMounted && snap.exists()) setStats(snap.data());
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchStats();
    return () => { isMounted = false; };
  }, []);

  const handleChange = e => {
    setStats(s => ({ ...s, [e.target.name]: parseInt(e.target.value, 10) || 0 }));
  };

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, "stats", "about"), stats, { merge: true });
      setMsg("Stats updated!");
    } catch {
      setMsg("Failed to update. Try again.");
    }
    setSaving(false);
    setTimeout(() => setMsg(""), 2000);
  };

  if (loading) return <div>Loading admin panel...</div>;
  
  return (
    <form onSubmit={handleSave} style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h3>Edit About Page Stats</h3>
      <label>
        Students Helped
        <input type="number" name="studentsHelped" value={stats.studentsHelped} onChange={handleChange} className="form-control mb-2" />
      </label>
      <label>
        Trees Planted
        <input type="number" name="treesPlanted" value={stats.treesPlanted} onChange={handleChange} className="form-control mb-2" />
      </label>
      <label>
        Ponds Restored
        <input type="number" name="pondsRestored" value={stats.pondsRestored} onChange={handleChange} className="form-control mb-2" />
      </label>
      <label>
        Communities Served
        <input type="number" name="communitiesServed" value={stats.communitiesServed} onChange={handleChange} className="form-control mb-2" />
      </label>
      <button type="submit" className="btn btn-primary mt-2" disabled={saving}>
        {saving ? "Saving..." : "Save"}
      </button>
      <div className="mt-2 text-success">{msg}</div>
    </form>
  );
}
