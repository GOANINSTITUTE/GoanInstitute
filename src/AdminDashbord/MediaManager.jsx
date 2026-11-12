
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

export default function MediaManager() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [videos, setVideos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Identify video platform
  const getVideoType = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return "youtube";
    }

    if (url.includes("instagram.com")) {
      return "instagram";
    }

    return null;
  };

  // Validate and convert URL
  const convertToEmbed = (url) => {
    try {
      const parsedUrl = new URL(url);
      const type = getVideoType(url);

      if (type === "youtube") {
        let videoId = "";

        if (parsedUrl.hostname.includes("youtu.be")) {
          videoId = parsedUrl.pathname.substring(1).split("/")[0];
        } else if (parsedUrl.pathname.includes("/shorts/")) {
          videoId = parsedUrl.pathname.split("/shorts/")[1].split("/")[0];
        } else {
          videoId = parsedUrl.searchParams.get("v");
        }

        if (!videoId) return null;

        return `https://www.youtube.com/embed/${videoId}`;
      }

      if (type === "instagram") {
        const match = parsedUrl.pathname.match(
          /^\/(p|reel|tv)\/([^/]+)/
        );

        if (!match) return null;

        return `https://www.instagram.com/${match[1]}/${match[2]}/`;
      }

      return null;
    } catch {
      return null;
    }
  };

  // Fetch all media
  const fetchVideos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "mediaItems"));

      const list = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setVideos(list);
    } catch (error) {
      console.error("Error fetching media:", error);
      alert("Failed to load media.");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Reset form
  const resetForm = () => {
    setTitle("");
    setUrl("");
    setDescription("");
    setEditingId(null);
  };

  // Add or update media
  const handleSubmit = async (e) => {
    e.preventDefault();

    const type = getVideoType(url);
    const embedUrl = convertToEmbed(url);

    if (!embedUrl || !type) {
      alert("Please enter a valid YouTube or Instagram video URL.");
      return;
    }

    try {
      setLoading(true);

      const mediaData = {
        title: title.trim(),
        url: embedUrl,
        description: description.trim(),
        type,
        isPublished: true,
        updatedAt: new Date(),
      };

      if (editingId) {
        await updateDoc(doc(db, "mediaItems", editingId), mediaData);
        alert("Media updated successfully!");
      } else {
        await addDoc(collection(db, "mediaItems"), {
          ...mediaData,
          order: videos.length + 1,
          createdAt: new Date(),
        });

        alert("Media added successfully!");
      }

      resetForm();
      await fetchVideos();
    } catch (error) {
      console.error("Error saving media:", error);
      alert("Failed to save media. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Edit media
  const handleEdit = (video) => {
    setTitle(video.title || "");
    setDescription(video.description || "");

    // Convert stored embed URL back into a normal URL
    if (video.type === "youtube") {
      const videoId = video.url.split("/embed/")[1]?.split("?")[0];
      setUrl(videoId ? `https://www.youtube.com/watch?v=${videoId}` : video.url);
    } else {
      setUrl(video.url);
    }

    setEditingId(video.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Delete media
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this media?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "mediaItems", id));
      alert("Media deleted successfully!");
      await fetchVideos();

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error("Error deleting media:", error);
      alert("Failed to delete media.");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>

      <h2 style={{ marginBottom: 25 }}>
        {editingId ? "Edit Media" : "Add New Media"}
      </h2>

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: 20,
          border: "1px solid #ddd",
          borderRadius: 10,
          marginBottom: 35,
        }}
      >
        <label className="form-label">Video Title</label>

        <input
          type="text"
          className="form-control"
          placeholder="Enter video title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ marginBottom: 15 }}
        />

        <label className="form-label">Video URL</label>

        <input
          type="url"
          className="form-control"
          placeholder="Paste YouTube or Instagram URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ marginBottom: 15 }}
        />

        <label className="form-label">Description (Optional)</label>

        <textarea
          className="form-control"
          placeholder="Enter video description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          style={{ marginBottom: 20 }}
        />

        <button
          className="btn btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : editingId
            ? "Update Media"
            : "Add Media"}
        </button>

        {editingId && (
          <button
            type="button"
            className="btn btn-danger ms-2"
            onClick={resetForm}
          >
            Cancel
          </button>
        )}
      </form>

      {/* Existing Media */}
      <h3 style={{ marginBottom: 20 }}>All Media</h3>

      {videos.length === 0 ? (
        <p>No media added yet.</p>
      ) : (
        videos.map((video) => (
          <div
            key={video.id}
            style={{
              padding: 18,
              border: "1px solid #ddd",
              borderRadius: 10,
              marginBottom: 15,
              background: "#fff",
            }}
          >
            <h5>{video.title}</h5>

            <p style={{ marginBottom: 8 }}>
              <strong>Platform:</strong>{" "}
              {video.type === "youtube" ? "YouTube" : "Instagram"}
            </p>

            <p style={{ fontSize: 14, color: "#666" }}>
              {video.description}
            </p>

            <p style={{ fontSize: 13, wordBreak: "break-all" }}>
              {video.url}
            </p>

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
