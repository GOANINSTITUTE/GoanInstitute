import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import ShareYourStory from "../Pages/ShareYourStory";

const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [editing, setEditing] = useState(null); // currently editing testimonial
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  // 🔹 Fetch testimonials
  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTestimonials(data);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [refresh]);

  // 🔹 Approve testimonial
  const handleApprove = async (id) => {
    await updateDoc(doc(db, "testimonials", id), { pending: false });
    fetchTestimonials();
  };

  // 🔹 Delete testimonial
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;
    await deleteDoc(doc(db, "testimonials", id));
    fetchTestimonials();
  };

  // 🔹 Start editing
  const handleEdit = (item) => {
    setEditing(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔹 Cancel editing
  const cancelEdit = () => setEditing(null);

  // 🔹 After submit (new or edited)
  const handleSubmitted = () => {
    fetchTestimonials();
    setEditing(null);
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4 fw-bold">Testimonials Manager</h3>

      {/* Add or Edit Form */}
      <div className="card shadow-sm p-4 mb-4" style={{ borderRadius: "16px" }}>
        <ShareYourStory
          onSubmitted={handleSubmitted}
          editData={editing}
          onCancelEdit={cancelEdit}
        />
      </div>

      {/* Testimonials List */}
      <div className="card shadow-sm p-3" style={{ borderRadius: "16px" }}>
        <h5 className="fw-bold mb-3">All Testimonials</h5>
        {loading ? (
          <p>Loading testimonials...</p>
        ) : testimonials.length === 0 ? (
          <p className="text-secondary">No testimonials yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Title</th>
                  <th>Role</th>
                  <th>Stars</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <img
                        src={
                          t.imageUrl ||
                          "https://res.cloudinary.com/dgxhp09em/image/upload/v1754493587/man_yuwvpt.png"
                        }
                        alt={t.name}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>{t.name}</td>
                    <td>{t.title}</td>
                    <td>{t.type || "—"}</td>
                    <td>
                      {"★".repeat(t.stars || 5)}
                      {"☆".repeat(5 - (t.stars || 5))}
                    </td>
                    <td>
                      {t.pending ? (
                        <span className="badge bg-warning text-dark">Pending</span>
                      ) : (
                        <span className="badge bg-success">Approved</span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => handleEdit(t)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger me-2"
                        onClick={() => handleDelete(t.id)}
                      >
                        Delete
                      </button>
                      {t.pending && (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleApprove(t.id)}
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsManager;
