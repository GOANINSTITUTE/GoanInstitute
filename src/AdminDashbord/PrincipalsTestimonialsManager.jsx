import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function PrincipalTestimonialsManager() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ text: "",heading:"", author: "", school: ""  });
  const [editId, setEditId] = useState(null);

  const colRef = collection(db, "clientTestimonials");

  const loadData = async () => {
    const snap = await getDocs(colRef);
    setList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await updateDoc(doc(db, "clientTestimonials", editId), form);
      setEditId(null);
    } else {
      await addDoc(colRef, form);
    }

    setForm({ text: "",heading:"", author: "", school: "" });
    loadData();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "clientTestimonials", id));
    loadData();
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setForm({
      text: item.text,
      heading: item.heading,
      author: item.author,
      school: item.school,
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Principal Testimonials Manager</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          className="bg-light rounded"
          type="text"
          placeholder="Heading"
          value={form.heading}
          onChange={(e) => setForm({ ...form, heading: e.target.value })}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />
        <textarea
        className="bg-light rounded"
          placeholder="Testimonial text"
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          required
          style={{ width: "100%", minHeight: 80, marginBottom: 10 }}
        />


        <input
        className="bg-light rounded "
          type="text"
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <input
        className="bg-light rounded"
          type="text"
          placeholder="School"
          value={form.school}
          onChange={(e) => setForm({ ...form, school: e.target.value })}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />

        <button type="submit" className="btn btn-primary">
          {editId ? "Update" : "Add"} Testimonial
        </button>
      </form>

      <h3>All Testimonials</h3>
      {list.map((item) => (
        <div
          key={item.id}
          style={{
            padding: 15,
            border: "1px solid #ccc",
            borderRadius: 8,
            marginBottom: 12,
          }}
        ><h1>{item.heading}</h1>
          <p>{item.text}</p>
          <strong>{item.author}</strong> — {item.school}
          <br />
          <button
            onClick={() => startEdit(item)}
            className="btn btn-sm btn-warning me-2 mt-2"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="btn btn-sm btn-danger mt-2"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
