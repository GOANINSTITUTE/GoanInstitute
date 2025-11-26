import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./CSS/About.css";
import AnimatedHero from "../Components/AnimatedHero";
import PageTransition from "../Components/PageTransition";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Core values
const values = [
  { icon: "bi-heart", label: "Compassion" },
  { icon: "bi-people-fill", label: "Community" },
  { icon: "bi-lightbulb-fill", label: "Innovation" },
  { icon: "bi-globe", label: "Inclusivity" }
];

// Section category settings
const SCHOOL_LIST = [
  "Sree Narayana Public School, Elappully",
  "Nilgiri Public School, Elappully",
  "Guardian International School, Elappully"
];
const EDUCATION_CATEGORIES = [
  "schools", "education", "student", "learning", "classroom",
  ...SCHOOL_LIST.map(s => s.toLowerCase())
];
const AGRICULTURE_CATEGORIES = [
  "agriculture", "farming", "irrigation", "organic", "farmland", "farm", "seed", "plantation", "crops", "cultivation"
];

// Slideshow Component
function Slideshow({ images, height = 260, delay = 2900, rounded = 14 }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (images.length < 2) return;
    const timer = setTimeout(() => setIndex(i => (i + 1) % images.length), delay);
    return () => clearTimeout(timer);
  }, [index, images, delay]);
  if (!images || images.length === 0) return null;
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: height,
        maxWidth: 380,
        margin: "0 auto"
      }}
    >
      {images.map((img, i) => (
        <img
          key={img.id || i}
          src={img.imageUrl}
          alt={img.title || ""}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height,
            objectFit: "cover",
            boxShadow: "0 2px 10px #0d6efd22",
            opacity: i === index ? 1 : 0,
            transition: "opacity 0.9s"
          }}
        />
      ))}
    </div>
  );
}

// Normalizes a category string for robust matching
const normalize = str => (str || "").toLowerCase().replace(/\s+/g, " ").replace(/,/g, "");

// Fetch images matching any category in list
async function fetchImagesByCategories(categoryList) {
  const snapshot = await getDocs(collection(db, "gallery"));
  const cats = categoryList.map(normalize);
  return snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(item =>
      typeof item.category === "string" &&
      cats.includes(normalize(item.category))
    );
}

export default function About() {
  // TEAM FETCH
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Agriculture images
  const [agriImages, setAgriImages] = useState([]);
  const [agriLoading, setAgriLoading] = useState(true);

  // Education (school) images
  const [eduImages, setEduImages] = useState([]);
  const [eduLoading, setEduLoading] = useState(true);

  // Effect: Fetch Team
  useEffect(() => {
    let isMounted = true;
    const fetchTeam = async () => {
      try {
        const snapshot = await getDocs(collection(db, "team"));
        let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        data.sort((a, b) => {
          const aSNo = a.sNo !== undefined && a.sNo !== null ? Number(a.sNo) : Number.MAX_SAFE_INTEGER;
          const bSNo = b.sNo !== undefined && b.sNo !== null ? Number(b.sNo) : Number.MAX_SAFE_INTEGER;
          return aSNo - bSNo;
        });
        if (isMounted) setTeam(data);
      } catch (err) {
        console.error("Error fetching team:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchTeam();
    return () => { isMounted = false; };
  }, []);

  // Effect: Fetch agriculture images
  useEffect(() => {
    let isMounted = true;
    (async () => {
      setAgriLoading(true);
      try {
        const imgs = await fetchImagesByCategories(AGRICULTURE_CATEGORIES);
        if (isMounted) setAgriImages(imgs);
      } catch (err) {
        console.error("Error fetching agriculture images:", err);
        if (isMounted) setAgriImages([]);
      } finally {
        if (isMounted) setAgriLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Effect: Fetch education images
  useEffect(() => {
    let isMounted = true;
    (async () => {
      setEduLoading(true);
      try {
        const imgs = await fetchImagesByCategories(EDUCATION_CATEGORIES);
        if (isMounted) setEduImages(imgs);
      } catch (err) {
        console.error("Error fetching education images:", err);
        if (isMounted) setEduImages([]);
      } finally {
        if (isMounted) setEduLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // --- Render ---
  return (
    <PageTransition className="about-page bg-light">
      {/* Hero */}
      <AnimatedHero
        title="About Darvik Foundation"
        subtitle="Empowering communities, nurturing nature, and preserving culture for a sustainable future."
        className="about-hero"
        overlayColor="rgba(13,110,253,0.15)"
      />

      {/* Profile */}
      <section className="container py-5">
        <div className="row g-5 align-items-center">
          <div className="col-md-7">
            <h2 className="fw-bold mb-3 text-primary">Organization Profile</h2>
            <ul className="list-unstyled mb-3">
              <li><strong>Registered on:</strong> 21.09.2022</li>
              <li>
                <strong>Address:</strong><br />
                GRJ BUILDING,<br />
                Neithala,<br />
                Erattakulam (PO),<br />
                Para, Elappully,<br />
                Palakkad – 678622
              </li>
            </ul>
            <p className="fs-5">
              Darvik Foundation is a social initiative founded with a mission to empower underprivileged communities and protect our environment for future generations. Established in 2022, the foundation has focused on holistic development by blending education, agriculture, environmental conservation, and cultural preservation.
            </p>
            <p className="fs-5">
              Since its inception, Darvik Foundation has served over 20 underprivileged students, offering them continuous support and opportunities to learn and grow. Our work is deeply rooted in the local community, and we aim to bring sustainable, long-term change.
            </p>
          </div>
          <div className="col-md-5 text-center">
            <img src="/logodarvik.png" alt="Darvik Foundation Logo" className="img-fluid rounded shadow" style={{ maxWidth: 320, background: "#fff" }} />
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="bg-white py-5">
        <div className="container">
          <h2 className="fw-bold mb-4 text-center">Our Vision</h2>
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <p className="fs-5 text-center">
                To build a society where every student has access to education, youth feel connected to nature and agriculture, local ecosystems are protected, and cultural heritage is preserved for the future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container py-5">
        <h2 className="fw-bold mb-4 text-center">Our Core Values</h2>
        <div className="row justify-content-center g-4">
          {values.map((val, idx) => (
            <div className="col-6 col-md-3 text-center" key={idx}>
              <div className="p-4 bg-white rounded shadow-sm h-100 d-flex flex-column align-items-center">
                {/* ...SVG rendering just as your code... */}
                <div className="icon-circle mb-2" style={{ fontSize: 36, color: "#0d6efd" }}>
                  {val.icon === "bi-heart" ? (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="#0d6efd" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  ) : val.icon === "bi-people-fill" ? (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="#0d6efd" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="7" cy="7" r="3" />
                      <circle cx="17" cy="7" r="3" />
                      <path d="M2 20c0-3 4-5 10-5s10 2 10 5v2H2v-2z" />
                    </svg>
                  ) : val.icon === "bi-lightbulb-fill" ? (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="#0d6efd" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 21h6v-1H9v1zm3-19C7.03 2 3 6.03 3 11c0 3.07 1.64 5.64 4.5 6.32V19a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-1.68C19.36 16.64 21 14.07 21 11c0-4.97-4.03-9-9-9zm0 16c-2.76 0-5-2.24-5-5 0-3.31 2.69-6 6-6s6 2.69 6 6c0 2.76-2.24 5-5 5z"/>
                    </svg>
                  ) : val.icon === "bi-globe" ? (
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="#0d6efd" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="12" r="10" fill="#e3f2fd" />
                      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm0-14c-3.31 0-6 2.69-6 6 0 2.76 2.24 5 5 5h2c2.76 0 5-2.24 5-5 0-3.31-2.69-6-6-6z" fill="#0d6efd" />
                      <path d="M12 6a6 6 0 0 1 6 6c0 2.21-1.79 4-4 4h-4c-2.21 0-4-1.79-4-4a6 6 0 0 1 6-6z" fill="#90caf9" />
                    </svg>
                  ) : (
                    <svg width="36" height="36" fill="#0d6efd" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="#e3f2fd" />
                      <text x="12" y="16" textAnchor="middle" fontSize="14" fill="#0d6efd">?</text>
                    </svg>
                  )}
                </div>
                <span className="fw-semibold fs-5">{val.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education & Learning Initiatives */}
      <section className="bg-white py-5">
        <div className="container">
          <h2 className="fw-bold mb-4 text-primary">Education & Learning Initiatives</h2>
          <div className="row">
            <div className="col-lg-7">
              <ul className="fs-5 mb-3">
                <li>Free tuition center for underprivileged students.</li>
                <li>Study space and library facilities.</li>
                <li>Special sessions on yoga to promote mental health and well-being.</li>
                <li>Support and therapy sessions for students with learning disabilities.</li>
                <li>Guidance and mentorship to help students progress academically and emotionally.</li>
              </ul>
              <p className="fs-5">
                We have also tied up with three local schools to run eco clubs, helping students develop awareness and responsibility towards nature:
              </p>
              <ul className="fs-5 mb-3">
                {SCHOOL_LIST.map((school, idx) => (
                  <li key={idx}>{school}</li>
                ))}
              </ul>
              <p className="fs-5">
                Through these partnerships, we conduct awareness sessions, activities, and campaigns to instill environmental values in young minds.
              </p>
            </div>
            <div className="col-lg-5 text-center">
              {eduLoading ? (
                <div style={{ minHeight: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : eduImages.length === 0 ? (
                <div className="text-muted">No education images found.</div>
              ) : (
                <Slideshow images={eduImages} height={260} rounded={14} delay={3200} />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Farming and Sustainable Agriculture */}
      <section className="container py-5">
        <h2 className="fw-bold mb-4 text-success">Farming & Sustainable Agriculture</h2>
        <div className="row align-items-center">
          <div className="col-lg-7">
            <ul className="fs-5 mb-3">
              <li>Promote organic farming and sustainable practices.</li>
              <li>Preserve and distribute indigenous seeds like vegetable seeds and rice seeds.</li>
              <li>Encourage afforestation and tree planting.</li>
              <li>Support the creation of small forests within limited spaces (e.g., 10 cents of land).</li>
              <li>Conduct training and motivational sessions to inspire the next generation of farmers.</li>
            </ul>
            <p className="fs-5">
              We organize awareness programs and special classes led by experts such as agricultural officers, forest officers, and environmentalists to bring youth closer to farming and nature.
            </p>
          </div>
          <div className="col-lg-5 text-center">
            {agriLoading ? (
              <div style={{ minHeight: 180, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="spinner-border text-success" role="status"></div>
              </div>
            ) : agriImages.length === 0 ? (
              <div className="text-muted">No agriculture images found.</div>
            ) : (
              <Slideshow images={agriImages} height={260} rounded={14} delay={2900} />
            )}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container py-5">
        <h2 className="fw-bold mb-4 text-center">Meet Our Team</h2>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <div style={{
              width: 48, height: 48,
              border: '5px solid #eee',
              borderTop: '5px solid #0d6efd',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
          </div>
        ) : (
          <div className="row justify-content-center g-4">
            {team.map((member, idx) => (
              <div className="col-12 col-sm-6 col-lg-3" key={member.id || idx}>
                <div
                  className="bg-white rounded shadow-sm p-4 text-center h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/team/${encodeURIComponent(member.name)}`, { state: { member } })}
                >
                  <img
                    src={member.img}
                    alt={member.name}
                    className="rounded-circle mb-3"
                    style={{
                      width: 90,
                      height: 90,
                      objectFit: "cover",
                      border: "3px solid #0d6efd"
                    }}
                  />
                  <h5 className="mb-1">{member.name}</h5>
                  <div className="text-primary mb-2">{member.role}</div>
                  <p className="small text-muted mb-0">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Call to Action */}
      <section className="py-5 bg-pink text-white text-center position-relative" style={{ background: "linear-gradient(90deg, #f3268c 60%, #0d6efd 100%)" }}>
        <div className="container position-relative z-2">
          <h2 className="fw-bold mb-3">Join Us in Making a Difference</h2>
          <p className="lead mb-4">
            Darvik Foundation invites individuals, volunteers, schools, and organizations to collaborate and strengthen our efforts. Together, we can create meaningful and lasting change.
          </p>
          <a href="/contact" className="btn btn-light btn-lg px-4 py-2 fw-semibold shadow">Contact Us</a>
        </div>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ opacity: 0.07, background: "url('/logodarvik.png') center/contain no-repeat" }}></div>
      </section>
    </PageTransition>
  );
}
