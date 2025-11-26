import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebase-config";
import CustomEditor from "../Components/CustomTexteditor";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore";

// Notification
function Notification({ message, type, onClose }) {
  if (!message) return null;
  return (
    <div className={`alert alert-${type === "error" ? "danger" : "success"} alert-dismissible`} role="alert">
      {message}
      <button type="button" className="btn-close" onClick={onClose}></button>
    </div>
  );
}

const formatDate = (ts) => {
  if (!ts) return "";
  const date = ts.seconds
    ? new Date(ts.seconds * 1000)
    : new Date(ts);
  return date.toLocaleString(undefined, {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
};

function NewsManager({ defaultAuthor = "Admin" }) {
  // Form fields
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState(defaultAuthor);
  const [sourceUrl, setSourceUrl] = useState("");
  const [featured, setFeatured] = useState(false);

  const [items, setItems] = useState([]);
  const [notification, setNotification] = useState({ message: "", type: "success" });
  const uploadSuccess = useRef(false);

  // Edit state:
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editImageUrl, setEditImageUrl] = useState("");

  // Heading ref for scrolling with offset
  const headingRef = useRef(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type }), 2500);
  };

  const fetchItems = async () => {
    try {
      const snapshot = await getDocs(collection(db, "news"));
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data = data.sort((a, b) => {
        const timeA = a.timestamp?.seconds || 0;
        const timeB = b.timestamp?.seconds || 0;
        return timeB - timeA;
      });
      setItems(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  // ADD or UPDATE
  const handleUpload = () => {
    if (!title || !description) {
      showNotification("Please enter title and description!", "error");
      return;
    }

    uploadSuccess.current = false;
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dgxhp09em',
        uploadPreset: 'unsigned_preset',
        maxFiles: 1
      },
      async (error, result) => {
        if (!error && result && result.event === "success") {
          uploadSuccess.current = true;
          const uploadedImageUrl = result.info.secure_url;
          await saveNews(uploadedImageUrl);
        } else if (!error && result && result.event === "close") {
          if (!uploadSuccess.current) {
            if (isEditing) {
              await saveNews(editImageUrl || "");
            } else {
              await saveNews("");
            }
          }
        }
      }
    );
    myWidget.open();
  };

  // Save: handles both Add and Edit
  const saveNews = async (uploadedImageUrl) => {
    const postData = {
      title,
      shortDescription,
      description,
      imageUrl: uploadedImageUrl || editImageUrl || "",
      tags: tags.split(",").map(t => t.trim()).filter(t => t),
      author: author || "Admin",
      sourceUrl,
      featured,
      updatedAt: serverTimestamp()
    };
    try {
      if (isEditing && editId) {
        // update
        await updateDoc(doc(db, "news", editId), postData);
        showNotification("News updated successfully!", "success");
      } else {
        // add new
        await addDoc(collection(db, "news"), {
          ...postData,
          timestamp: serverTimestamp()
        });
        showNotification("News added successfully!", "success");
      }
      resetForm();
      fetchItems();
    } catch (error) {
      console.error("Error saving news:", error);
      showNotification("Failed to save news!", "error");
    }
  };

  // Populate form for editing
  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id);
    setEditImageUrl(item.imageUrl || "");
    setTitle(item.title || "");
    setShortDescription(item.shortDescription || "");
    setDescription(item.description || "");
    setTags((item.tags || []).join(", "));
    setAuthor(item.author || "Admin");
    setSourceUrl(item.sourceUrl || "");
    setFeatured(item.featured || false);

    // Scroll to heading with offset for sticky header!
    if (headingRef.current) {
      const yOffset = -156; // Change this to your header height + extra gap if you want
      const y = headingRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Cancel edit and reset
  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setEditImageUrl("");
    setTitle("");
    setShortDescription("");
    setDescription("");
    setTags("");
    setAuthor(defaultAuthor);
    setSourceUrl("");
    setFeatured(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteDoc(doc(db, "news", id));
      fetchItems();
      showNotification("News deleted!", "success");
      if (editId === id) resetForm();
    } catch (error) {
      console.error("Error deleting news:", error);
      showNotification("Failed to delete news!", "error");
    }
  };

  return (
    <div className="container mt-4">
      <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: "", type: notification.type })} />
      <h3 className="mb-3" ref={headingRef}>News Manager</h3>
      <div className="mb-3 card p-3 shadow-sm">
        <input type="text" placeholder="Title" value={title} maxLength={100} onChange={e => setTitle(e.target.value)} className="form-control mb-2" />
        <input type="text" placeholder="Short description (optional, max 130 chars)" value={shortDescription} maxLength={130} onChange={e => setShortDescription(e.target.value)} className="form-control mb-2" />

        {/* Replace textarea with your CustomEditor for the form */}
        <CustomEditor
          value={description}
          setValue={setDescription}
        />

        <input type="text" placeholder="Tags (comma-separated, eg. project,impact,event)" value={tags} onChange={e => setTags(e.target.value)} className="form-control mb-2" />
        <input type="text" placeholder="Author (optional, default: Admin)" value={author} onChange={e => setAuthor(e.target.value)} className="form-control mb-2" />
        <input type="text" placeholder="Source URL (optional, eg. https://...)" value={sourceUrl} onChange={e => setSourceUrl(e.target.value)} className="form-control mb-2" />
        <label className="form-check mb-2">
          <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} /> Mark as Featured Story
        </label>
        <div>
          {!isEditing && (
            <button className="btn btn-success" onClick={handleUpload}>Add News (with Image)</button>
          )}
          {isEditing && (
            <>
              <button className="btn btn-primary me-2" onClick={handleUpload}>Update News</button>
              <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>
            </>
          )}
        </div>
      </div>
      <div className="row mt-4">
        {items.map(item => (
          <div key={item.id} className="col-md-6 col-lg-4">
            <div className={`card my-2 shadow-sm border-${item.featured ? "primary" : "light"}`}>
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  className="card-img-top"
                  alt={item.title}
                  style={{ maxHeight: "210px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5 className="card-title mb-0">{item.title}</h5>
                  {item.featured && <span className="badge bg-primary">Featured</span>}
                </div>
                <div className="small text-muted mb-1">
                  {formatDate(item.timestamp)}
                  {item.author && <span> &middot; {item.author}</span>}
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="mb-2">
                    {item.tags.map((tag, i) => (
                      <span key={i} className="badge bg-secondary me-1">{tag}</span>
                    ))}
                  </div>
                )}
                <div className="mb-1">
                  <span className="fw-semibold">{item.shortDescription || ""}</span>
                </div>
                {/* Only render description as HTML in the list */}
                <div
                  className="card-text"
                  style={{whiteSpace: "pre-line", fontSize: "1rem", minHeight: 60, maxHeight: 200, overflow: "hidden"}}
                  dangerouslySetInnerHTML={{
                    __html: item.description?.slice(0, 250) + (item.description?.length > 250 ? "..." : "")
                  }}
                />
                {item.sourceUrl && (
                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="card-link small">
                    Source
                  </a>
                )}
                <div className="d-flex justify-content-end gap-1">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(item)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NewsManager;
