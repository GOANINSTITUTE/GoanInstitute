import React, { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";

function AdminManager() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [admins, setAdmins] = useState([]);
  const [fetching, setFetching] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", phone: "", email: "" });

  const db = getFirestore();

  // Fetch all admins (defined inside useEffect to avoid ESLint warning)
  useEffect(() => {
    const fetchAdmins = async () => {
      setFetching(true);
      try {
        const snapshot = await getDocs(collection(db, "adminUsers"));
        const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setAdmins(list);
      } catch (err) {
        console.error("Error fetching admins:", err);
      }
      setFetching(false);
    };

    fetchAdmins();
  }, [db]);

  // Handle adding new admin
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const auth = getAuth();

      // Create new Firebase Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save admin details in Firestore
      await setDoc(doc(db, "adminUsers", user.uid), {
        name,
        phone,
        email: user.email,
        role: "admin",
        createdAt: new Date().toISOString(),
      });

      setSuccess("✅ Admin user added successfully!");
      setName("");
      setPhone("");
      setEmail("");
      setPassword("");

      // Refresh list
      const snapshot = await getDocs(collection(db, "adminUsers"));
      setAdmins(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered as an admin.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else {
        setError(err.message);
      }
    }

    setLoading(false);
  };

  // Start editing
  const startEdit = (admin) => {
    setEditingId(admin.id);
    setEditForm({ name: admin.name, phone: admin.phone, email: admin.email });
  };

  // Cancel editing
  const cancelEdit = (e) => {
    if (e) e.preventDefault();
    setEditingId(null);
    setEditForm({ name: "", phone: "", email: "" });
  };

  // Save edits
  const saveEdit = async (e, id) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "adminUsers", id), {
        name: editForm.name,
        phone: editForm.phone,
        email: editForm.email,
      });
      setAdmins(admins.map((admin) => (admin.id === id ? { ...admin, ...editForm } : admin)));
      cancelEdit();
    } catch (err) {
      alert("Error updating admin: " + err.message);
    }
  };

  return (
    <div className="container py-4">
      {/* Add Admin Form */}
      <div className="card shadow p-4 mb-4" style={{ maxWidth: 420, margin: "0 auto" }}>
        <h4 className="mb-3">Add New Admin User</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-control textarea-secondary" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Admin Name" />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone Number</label>
            <input type="tel" className="form-control textarea-secondary" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="Phone Number" />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control textarea-secondary" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@email.com" />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control textarea-secondary" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Password (min 6 chars)" />
          </div>
          {error && <div className="alert alert-danger py-2">{error}</div>}
          {success && <div className="alert alert-success py-2">{success}</div>}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? "Adding..." : "Add Admin User"}</button>
        </form>
      </div>

      {/* Admin List */}
      <div className="card shadow p-4">
        <h4 className="mb-3">All Admin Users</h4>
        {fetching ? (
          <p>Loading admins...</p>
        ) : admins.length === 0 ? (
          <p>No admins found.</p>
        ) : (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>
                    {editingId === admin.id ? (
                      <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                    ) : admin.name}
                  </td>
                  <td>
                    {/* Email is no longer editable */}
                    {admin.email}
                  </td>
                  <td>
                    {editingId === admin.id ? (
                      <input type="tel" value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                    ) : admin.phone}
                  </td>
                  <td>{new Date(admin.createdAt).toLocaleString()}</td>
                  <td>
                    {editingId === admin.id ? (
                      <>
                        <button className="btn btn-accent btn-sm me-2" onClick={(e) => saveEdit(e, admin.id)}>Save</button>
                        <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <button className="btn btn-accent btn-sm" onClick={() => startEdit(admin)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminManager;
