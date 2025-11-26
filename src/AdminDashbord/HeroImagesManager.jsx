import React, { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

function HeroImagesManager() {
  const [items, setItems] = useState([]);
  const [heroBg, setHeroBg] = useState("");

  useEffect(() => {
    fetchItems();
    fetchHeroBg();
  }, []);

  const fetchItems = async () => {
    try {
      const snapshot = await getDocs(collection(db, "hero_images"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(data);
    } catch (error) {
      console.error("Error fetching hero images:", error);
    }
  };

  const fetchHeroBg = async () => {
    try {
      const snapshot = await getDocs(collection(db, "hero-background"));
      const bgUrl = snapshot.docs.length > 0 ? snapshot.docs[0].data().url : "";
      setHeroBg(bgUrl);
    } catch (error) {
      console.error("Error fetching hero background:", error);
    }
  };

  const handleUpload = () => {
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dgxhp09em',
        uploadPreset: 'unsigned_preset'
      },
      async (error, result) => {
        if (!error && result && result.event === "success") {
          try {
            await addDoc(collection(db, "hero_images"), {
              imageUrl: result.info.secure_url
            });
            alert("Image added!");
            fetchItems();
          } catch (error) {
            console.error("Error saving hero image:", error);
            alert("Failed to save!");
          }
        }
      }
    );
    myWidget.open();
  };

  // Upload/change hero background
  const handleBgUpload = () => {
    const myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dgxhp09em',
        uploadPreset: 'unsigned_preset'
      },
      async (error, result) => {
        if (!error && result && result.event === "success") {
          try {
            // Remove previous background if exists
            const snapshot = await getDocs(collection(db, "hero-background"));
            if (snapshot.docs.length > 0) {
              await Promise.all(snapshot.docs.map(docSnap => docSnap.ref.delete()));
            }
            // Add new background
            await addDoc(collection(db, "hero-background"), {
              url: result.info.secure_url
            });
            alert("Hero background updated!");
            fetchHeroBg();
          } catch (error) {
            console.error("Error saving hero background:", error);
            alert("Failed to save background!");
          }
        }
      }
    );
    myWidget.open();
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "hero_images", id));
      fetchItems();
    } catch (error) {
      console.error("Error deleting hero image:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Hero Images Manager</h3>
      <button className="btn btn-success mb-3" onClick={handleUpload}>Upload New Image</button>

      <div className="row">
        {items.map(item => (
          <div key={item.id} className="col-md-4 mb-3">
            <div className="card">
              <img src={item.imageUrl} className="card-img-top" alt="Hero" />
              <div className="card-body">
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <hr className="my-4" />
      <h4 className="mb-3">Hero Background Manager</h4>
      <div className="mb-3">
        <button className="btn btn-primary" onClick={handleBgUpload}>Change Hero Background</button>
      </div>
      {heroBg && (
        <div className="mb-3">
          <img src={heroBg} alt="Hero Background" style={{ maxWidth: 480, borderRadius: 12, boxShadow: "0 2px 12px #0d6efd22" }} />
        </div>
      )}
    </div>
  );
}

export default HeroImagesManager;
