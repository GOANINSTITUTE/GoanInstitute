import React from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/Team.css";
import AnimatedHero from "../Components/AnimatedHero";
import PageTransition from "../Components/PageTransition";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

export default function Team() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [team, setTeam] = React.useState([]);

  React.useEffect(() => {
    const fetchTeam = async () => {
      try {
        const snapshot = await getDocs(collection(db, "team"));
        let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort by sNo ascending, members missing sNo go to end
        data.sort((a, b) => {
          const aSNo = a.sNo !== undefined && a.sNo !== null ? Number(a.sNo) : Number.MAX_SAFE_INTEGER;
          const bSNo = b.sNo !== undefined && b.sNo !== null ? Number(b.sNo) : Number.MAX_SAFE_INTEGER;
          return aSNo - bSNo;
        });
        setTeam(data);
      } catch (err) {
        console.error("Error fetching team:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <PageTransition className="team-page bg-light">
      {/* Animated Hero Section */}
      <AnimatedHero 
        title="Meet Our Team"
        subtitle="The passionate people behind Darvik Foundation's mission and impact."
        className="team-hero"
        overlayColor="rgba(255,193,7,0.15)"
      />

      {/* Team Grid (shows loader until ready) */}
      <section className="container py-5">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <div style={{ width: 48, height: 48, border: '5px solid #eee', borderTop: '5px solid #0d6efd', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <style>{`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}</style>
          </div>
        ) : (
          <div className="row justify-content-center g-4">
            {team.map((member, idx) => (
              <div className="col-12 col-sm-6 col-lg-3" key={member.id || idx}>
                <div
                  className="bg-white rounded shadow-sm p-4 text-center h-100 team-card-hover"
                  style={{ cursor: "pointer", transition: "box-shadow 0.2s" }}
                  onClick={() => navigate(`/team/${encodeURIComponent(member.name)}`, { state: { member } })}
                >
                  <img src={member.img} alt={member.name} className="rounded-circle mb-3" style={{ width: 110, height: 110, objectFit: "cover", border: "3px solid #0d6efd" }} />
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
          <h2 className="fw-bold mb-3">Want to Join Our Team?</h2>
          <p className="lead mb-4">We're always looking for passionate individuals to help us make a difference. Reach out to learn more about volunteering or partnering with us!</p>
          <a href="/contact" className="btn btn-light btn-lg px-4 py-2 fw-semibold shadow">Contact Us</a>
        </div>
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ opacity: 0.07, background: "url('/logodarvik.png') center/contain no-repeat" }}></div>
      </section>
    </PageTransition>
  );
}
