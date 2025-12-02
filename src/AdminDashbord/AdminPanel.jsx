// AdminPanel.jsx
import React, { useState, useEffect } from "react";
import HeroImagesManager from "./HeroImagesManager";
import TestimonialsManager from "./TestimonialsManager";
import VideoTestimonialsManager from "./VideoTestimonialManager";
import AddAdminUser from "./AddAdminUser";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import ProfileModal from "./ProfileModal"; // <--- FIXED: import added
import AnimatedHero from "../Components/AnimatedHero";
import VisionImageManager from "./VisionImageManager";
import ServiceManager from "./ServiceManager";
import ImageManager from "./imageManager";
import PrincipalTestimonialsManager from "./PrincipalsTestimonialsManager";
import GICEProfileManager from "./GICEProfileManager";
import GalleryManager from "./GalleryManager";
const options = [
  { key: "gicegallery", label: "Gallery Management", icon: <i class="bi bi-card-image" aria-hidden="true"></i> },
  { key: "hero", label: "Hero Section Image/Video", icon: <i class="bi bi-camera-video" aria-hidden="true"></i> },
  { key: "testimonials", label: "Testimonials", icon: <i class="bi bi-chat-square-quote" aria-hidden="true"></i> },
  { key: "videotestimonials", label: "Video Testimonials", icon:<i class="bi bi-camera-video-fill" aria-hidden="true"></i> },
  { key: "Ptestimonial", label: "Principals Testimonials", icon: <i class="bi bi-person-badge"></i>  },
  { key: "addadmin", label: "Add Admin User", icon: <i class="bi bi-person-plus" aria-hidden="true"></i> },
  { key: "vision", label: "Vision Mission", icon: <i class="bi bi-eye" aria-hidden="true"></i> },
  { key: "service", label: "Services", icon: <i class="bi bi-building" aria-hidden="true"></i> },
  { key: "image", label: "Educational Services Management", icon: <i class="bi bi-mortarboard" aria-hidden="true"></i> },
  { key: "giceprofile", label: "Profile Management", icon: <i class="bi bi-person" aria-hidden="true"></i> }
];


const defaultAvatar = "https://i.pinimg.com/originals/cd/ab/b1/cdabb1166392917d0af72e23fac2445e.png";

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
    <div >
      <AnimatedHero
  title="Admin Dashboard"
  subtitle="Manage content, users, and settings"
  className="admin-dashboard-hero"
  overlayColor="rgba(14,77,109,0.15)"
>
  {/* Right-side controls */}
  <div className="d-flex align-items-center justify-content-center flex-wrap gap-3 mt-3">
    {/* Profile */}
    <div
      className="d-flex align-items-center"
      style={{ cursor: "pointer" }}
      onClick={() => setShowProfileModal(true)}
      title="Edit profile"
    >
      <img
        src={profileImageUrl || defaultAvatar}
        alt="Profile"
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          objectFit: "cover",
          marginRight: 10,
          border: "2px solid var(--text-accent)",
        }}
      />
      <span style={{ fontWeight: "bold", color: "white" }}>
        {user
          ? loadingName
            ? "Loading..."
            : errorName
            ? "Admin"
            : adminName || "Admin"
          : "Admin"}
      </span>
    </div>

    {/* Logout button */}
    <button
      className="btn btn-danger"
      onClick={handleLogout}
      style={{ zIndex: 1200 }}
    >
      Logout
    </button>
  </div>
</AnimatedHero>


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
  {options.map((option) => {
    const isActive = activeTab === option.key;
    return (
      <div className="col-12 col-sm-6 col-md-4" key={option.key}>
        <div
          className={`card h-100 shadow text-center p-4 option-card ${
            isActive ? "active-option" : ""
          }`}
          onClick={() => setActiveTab(option.key)}
        >
          <div style={{ fontSize: 40 }}>{option.icon}</div>
          <h5 className="mt-3">{option.label}</h5>
        </div>
      </div>
    );
  })}
</div>



      {/* Render active tab */}

      {activeTab === "gicegallery" && <GalleryManager />}
      {activeTab === "hero" && <HeroImagesManager />}
      {activeTab === "testimonials" && <TestimonialsManager />}
      {activeTab === "videotestimonials" && <VideoTestimonialsManager />}
      {activeTab === "Ptestimonial" && <PrincipalTestimonialsManager />}
      {activeTab === "giceprofile" && <GICEProfileManager />}
      {activeTab === "addadmin" && user && <AddAdminUser />}
      {activeTab === "service" && user && <ServiceManager />}
      {activeTab === "vision" && <VisionImageManager />}
      {activeTab === "image" && <ImageManager />}
      {!activeTab && (
        <div className="text-center text-muted mt-5">
          <h4>Select an option above to manage content.</h4>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
