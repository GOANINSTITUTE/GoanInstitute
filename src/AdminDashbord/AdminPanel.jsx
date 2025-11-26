// AdminPanel.jsx
import React, { useState, useEffect } from "react";
import GalleryManager from "./GalleryManager";
import ServicesManager from "./ServicesManager";
import NewsManager from "./NewsManager";
import HeroImagesManager from "./HeroImagesManager";
import TestimonialsManager from "./TestimonialsManager";
import AddAdminUser from "./AddAdminUser";
import TeamManager from "./TeamManager";
import DonationList from "./DonationList";
import AboutManager from "./AboutManager";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import ProfileModal from "./ProfileModal"; // <--- FIXED: import added
import "./AdminPanel.css";
const options = [
  { key: "gallery", label: "Gallery Management", icon: "🖼️" },
  { key: "services", label: "Services Management", icon: "🛠️" },
  { key: "news", label: "News Management", icon: "📰" },
  { key: "hero", label: "Hero Images", icon: "🌄" },
  { key: "testimonials", label: "Testimonials", icon: "💬" },
  { key: "addadmin", label: "Add Admin User", icon: "➕" },
  { key: "team", label: "Team Management", icon: "👥" },
  { key: "donations", label: "Donations", icon: "🎁" },
  { key: "about", label: "About Management", icon: "ℹ️" }
];

const defaultAvatar = "/default-avatar.png";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState(null);
  const [adminName, setAdminName] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [loadingName, setLoadingName] = useState(true);
  const [errorName, setErrorName] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false); // ADDED

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchAdminName = async () => {
      setLoadingName(true);
      setErrorName("");
      if (user) {
        try {
          const db = getFirestore();
          const adminDocRef = doc(db, "adminUsers", user.uid);
          const adminDoc = await getDoc(adminDocRef);
          if (adminDoc.exists()) {
            const data = adminDoc.data();
            setAdminName(data.name || "Admin");
            setProfileImageUrl(data.profileImageUrl || "");
          } else {
            setAdminName("Admin");
            setProfileImageUrl("");
          }
        } catch (err) {
          setErrorName("Error fetching admin info");
          setAdminName("Admin");
          setProfileImageUrl("");
        }
      }
      setLoadingName(false);
    };

    fetchAdminName();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  return (
    <div className="container py-4" style={{ marginTop: 80 }}>
      {/* Header */}
      <div
        className="d-flex justify-content-between align-items-center mb-4 sticky-top "
       
      >
        <h2>Admin Dashboard</h2>
        <div className="d-flex align-items-center">
          <div
            className="d-flex align-items-center me-3"
            style={{ cursor: "pointer" }}
            onClick={() => setShowProfileModal(true)}
            title="Edit profile icon"
          >
            <img
              src={profileImageUrl || defaultAvatar}
              alt="Profile"
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                objectFit: "cover",
                marginRight: 8,
                border: "1.5px solid #bbb",
              }}
            />
            <span style={{ fontWeight: "bold" }}>
              {user
                ? loadingName
                  ? "Loading..."
                  : errorName
                  ? "Admin"
                  : adminName || "Admin"
                : "Admin"}
            </span>
          </div>
          <button className="btn btn-danger" onClick={handleLogout} style={{ zIndex: 1200 }}>
            Logout
          </button>
        </div>
      </div>

      {/* Profile modal */}
      <ProfileModal
        show={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentImage={profileImageUrl}
        onUpdate={(url) => setProfileImageUrl(url)}
        userId={user?.uid}
      />

      {/* Greeting */}
      <div className="mb-4">
        <p className="lead">
          {user
            ? loadingName
              ? "Hi, ... Loading user name ..."
              : errorName
              ? `Hi, Admin! (${errorName})`
              : `Hi, ${adminName}! Welcome to your admin panel.`
            : "Hi, Admin! Welcome to your admin panel."}
        </p>
      </div>

      {/* Options grid */}
      <div className="row g-4 mb-4">
        {options.map((option) => (
          <div className="col-12 col-sm-6 col-md-4" key={option.key}>
            <div
              className={`card h-100 shadow text-center p-4 option-card ${activeTab === option.key ? "border-primary" : ""}`}
              style={{
                cursor: "pointer",
                transition: "transform 0.2s",
                borderWidth: activeTab === option.key ? 2 : 1,
              }}
              onClick={() => setActiveTab(option.key)}
            >
              <div style={{ fontSize: 40 }}>{option.icon}</div>
              <h5 className="mt-3">{option.label}</h5>
            </div>
          </div>
        ))}
      </div>

      {/* Render active tab */}
      {activeTab === "gallery" && <GalleryManager />}
      {activeTab === "services" && <ServicesManager />}
      {activeTab === "news" && <NewsManager />}
      {activeTab === "hero" && <HeroImagesManager />}
      {activeTab === "testimonials" && <TestimonialsManager />}
      {activeTab === "addadmin" && user && <AddAdminUser />}
      {activeTab === "team" && <TeamManager />}
      {activeTab === "about" && <AboutManager />}
      {activeTab === "donations" && <DonationList />}

      {!activeTab && (
        <div className="text-center text-muted mt-5">
          <h4>Select an option above to manage content.</h4>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
