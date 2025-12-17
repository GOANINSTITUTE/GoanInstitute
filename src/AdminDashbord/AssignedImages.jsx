import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

/* 🔹 Show & Manage Assigned Images for Each Section */
function AssignedImages({ categoryName, onDeleteSuccess, firestoreCollection }) {
  const [assigned, setAssigned] = useState([]);

  const fetchAssigned = async () => {
    try {
      const snapshot = await getDocs(collection(db, firestoreCollection));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const filtered = data.filter(
        (item) => item.category === categoryName.toLowerCase()
      );
      setAssigned(filtered);
    } catch (error) {
      console.error("Error fetching assigned images:", error);
    }
  };

  useEffect(() => {
    fetchAssigned();
  }, [categoryName]);

  const handleDeleteAssigned = async (id) => {
    try {
      await deleteDoc(doc(db, firestoreCollection, id));
      setAssigned((prev) => prev.filter((item) => item.id !== id));
      onDeleteSuccess(`Image removed from "${categoryName}"!`);
    } catch (error) {
      console.error("Error deleting assigned image:", error);
      onDeleteSuccess("Failed to remove image!", "error");
    }
  };

  return (
    <div>
      {assigned.length > 0 ? (
        <div className="d-flex flex-wrap gap-2">
          {assigned.map((img) => (
            <div
              key={img.id}
              className="position-relative"
              style={{ display: "inline-block" }}
            >
              <img
                src={img.imageUrl}
                alt={img.title || "Untitled"}
                style={{
                  width: "100px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "2px solid #ddd",
                }}
              />
              <button
                onClick={() => handleDeleteAssigned(img.id)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "rgba(0,0,0,0.6)",
                  color: "white",
                  border: "none",
                  borderRadius: "0 4px 0 4px",
                  cursor: "pointer",
                  fontSize: "14px",
                  lineHeight: "1",
                  padding: "2px 6px",
                }}
                title="Remove image"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted small">No images assigned yet.</p>
      )}
    </div>
  );
}

export default AssignedImages;