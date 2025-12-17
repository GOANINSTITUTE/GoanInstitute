import React, { useState } from "react";
import { db } from "../firebase-config";
import { collection, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
import AssignedImages from "./AssignedImages";

function SectionAssigner({ items, showNotification }) {
  const operationsCategories = [
    "Schools",
    "Students",
  ];

  const handleAssignImage = async (selectedId, categoryName, collectionName) => {
    if (!selectedId) return;
    try {
      const item = items.find((it) => it.id === selectedId);
      if (!item) {
        showNotification("Invalid selection!", "error");
        return;
      }
      await addDoc(collection(db, collectionName), {
        category: categoryName.toLowerCase(),
        imageUrl: item.imageUrl,
        title: item.title || "",
        createdAt: serverTimestamp(),
      });
      showNotification(
        `Image assigned to "${categoryName}"!`,
        "success"
      );
    } catch (error) {
      console.error("Error assigning image:", error);
      showNotification("Failed to assign image!", "error");
    }
  };

  return (
    <>
      {/* 🔹 Operations Gallery Section */}
      <div className="mt-5">
        <h4 className="mb-3">Assign Images for Operations Section</h4>
        <p className="text-muted">Select images for each operations card below:</p>

        <div className="row">
          {operationsCategories.map((categoryName, i) => (
            <div className="col-md-6 mb-4" key={i}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-primary mb-3">
                    {categoryName}
                  </h5>
                  <div className="mb-3">
                    <select
                      className="form-select"
                      onChange={(e) => handleAssignImage(
                        e.target.value, 
                        categoryName, 
                        "operationsGallery"
                      )}
                    >
                      <option value="">-- Select an image --</option>
                      {items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.title || "Untitled"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <AssignedImages
                    categoryName={categoryName}
                    firestoreCollection="operationsGallery"
                    onDeleteSuccess={(msg, type) =>
                      showNotification(msg, type || "success")
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔹 Careers Gallery Section */}
      <div className="mt-5">
        <h4 className="mb-3">Assign Images for Careers Section</h4>
        <p className="text-muted">All careers images will be stored in one collection.</p>

        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title text-success mb-3">Careers Gallery</h5>
            <div className="mb-3">
              <select
                className="form-select"
                onChange={(e) => handleAssignImage(
                  e.target.value, 
                  "careers", 
                  "careersGallery"
                )}
              >
                <option value="">-- Select an image --</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title || "Untitled"}
                  </option>
                ))}
              </select>
            </div>
            <AssignedImages
              categoryName="careers"
              firestoreCollection="careersGallery"
              onDeleteSuccess={(msg, type) =>
                showNotification(msg, type || "success")
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default SectionAssigner;