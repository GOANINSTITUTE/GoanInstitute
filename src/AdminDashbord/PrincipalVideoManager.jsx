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

export default function PrincipalVideoManager() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [videos, setVideos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch videos
  const fetchVideos = async () => {
    const querySnapshot = await getDocs(collection(db, "principalVideos"));
    const list = querySnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setVideos(list);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Convert YouTube URL to embed format
  const convertToEmbed = (url) => {
    if (!url) return "";

    if (url.includes("youtu.be")) {
      const id = url.split("/").pop();
      return `https://www.youtube.com/embed/${id}`;
    }

    if (url.includes("watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }

    return url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const embedUrl = convertToEmbed(url);

    if (editingId) {
      const videoRef = doc(db, "principalVideos", editingId);
      await updateDoc(videoRef, { title, url: embedUrl });
      alert("Video updated!");
      setEditingId(null);
    } else {
      await addDoc(collection(db, "principalVideos"), {
        title,
        url: embedUrl,
      });
      alert("Video added!");
    }

    setTitle("");
    setUrl("");
    fetchVideos();
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this video?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "principalVideos", id));
    fetchVideos();
  };

  const handleEdit = (video) => {
    setTitle(video.title);
    setUrl(video.url);
    setEditingId(video.id);
  };

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <h2>{editingId ? "Edit Principal Video" : "Add Principal Video"}</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          type="text"
          placeholder="Video Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
          required
        />

        <input
          type="text"
          placeholder="Paste YouTube link here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
          required
        />

        <button className="btn btn-primary" type="submit">
          {editingId ? "Update Video" : "Add Video"}
        </button>

        {editingId && (
          <button
            type="button"
            className="btn btn-danger ms-2"
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

      <h3>All Principal Videos</h3>

      {videos.length === 0 ? (
        <p>No videos added yet.</p>
      ) : (
        videos.map((video) => (
          <div
            key={video.id}
            style={{
              padding: 15,
              border: "1px solid #ddd",
              borderRadius: 8,
              marginBottom: 15,
            }}
          >
            <h4>{video.title}</h4>

            <button
              className="btn btn-primary me-2"
              onClick={() => handleEdit(video)}
            >
              Edit
            </button>

            <button
              className="btn btn-danger"
              onClick={() => handleDelete(video.id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}