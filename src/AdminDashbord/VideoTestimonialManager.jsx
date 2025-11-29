import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function VideoTestimonialManager() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [videos, setVideos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch all videos
  const fetchVideos = async () => {
    const querySnapshot = await getDocs(collection(db, "videoTestimonials"));
    const list = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    setVideos(list);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Add or Update Video
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      // Update existing video
      const videoRef = doc(db, "videoTestimonials", editingId);
      await updateDoc(videoRef, { title, url });
      alert("Video updated!");
      setEditingId(null);
    } else {
      // Add new video
      await addDoc(collection(db, "videoTestimonials"), { title, url });
      alert("Video added!");
    }

    setTitle("");
    setUrl("");
    fetchVideos();
  };

  // Delete Video
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "videoTestimonials", id));
    fetchVideos();
  };

  // Load data into form for editing
  const handleEdit = (video) => {
    setTitle(video.title);
    setUrl(video.url);
    setEditingId(video.id);
  };

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <h2>{editingId ? "Edit Video" : "Add Video Testimonial"}</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <input
        className=""
          type="text"
          placeholder="YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <button  className="btn btn-primary" type="submit" style={{ padding: "8px 16px" }}>
          {editingId ? "Update Video" : "Add Video"}
        </button>

        {editingId && (
          <button
          className="btn btn-danger px-4"
            type="button"
            onClick={() => {
              setEditingId(null);
              setTitle("");
              setUrl("");
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h3>All Video Testimonials</h3>

      {/* List */}
      {videos.length === 0 ? (
        <p>No videos added yet.</p>
      ) : (
        <div>
          {videos.map((video) => (
            <div
              key={video.id}
              style={{
                padding: 15,
                border: "1px solid #ddd",
                borderRadius: 8,
                marginBottom: 15,
              }}
            >
              <h4 style={{ margin: "0 0 10px 0" }}>{video.title}</h4>

              <button
              className="btn btn-primary px-4"
                onClick={() => handleEdit(video)}
                style={{
                  padding: "5px 10px",
                  marginRight: 10,
                }}
              >
                Edit
              </button>

              <button
              className="btn btn-danger px-4"
                onClick={() => handleDelete(video.id)}
                
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
