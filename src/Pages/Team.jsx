import React from "react";
import { useNavigate } from "react-router-dom";
import AnimatedHero from "../Components/AnimatedHero";
import PageTransition from "../Components/PageTransition";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import "./CSS/Team.css";
import clsx from 'clsx';
const SOCIAL_ICONS = {
  facebook: { icon: "bi bi-facebook", color: "text-primary" },
  instagram: { icon: "bi bi-instagram", color: "text-danger" },
  linkedin: { icon: "bi bi-linkedin", color: "text-primary" },
  twitter: { icon: "bi bi-twitter", color: "text-info" },
  youtube: { icon: "bi bi-youtube", color: "text-danger" }
};

export default function Team() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [teamRows, setTeamRows] = React.useState([]);

  React.useEffect(() => {
    const fetchTeam = async () => {
      try {
        const snapshot = await getDocs(collection(db, "team"));
        let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        data.sort((a, b) => {
          if ((a.rNo ?? 99) !== (b.rNo ?? 99)) return (a.rNo ?? 99) - (b.rNo ?? 99);
          return (a.cNo ?? 99) - (b.cNo ?? 99);
        });

        const grouped = data.reduce((acc, member) => {
          const rowKey = member.rNo ?? "others";
          if (!acc[rowKey]) acc[rowKey] = [];
          acc[rowKey].push(member);
          return acc;
        }, {});

        const sortedRows = Object.keys(grouped)
          .sort((a, b) => Number(a) - Number(b))
          .map(rowNum => ({
            rowNumber: Number(rowNum),
            members: grouped[rowNum]
          }));

        setTeamRows(sortedRows);
      } catch (err) {
        console.error("Error fetching team:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const TeamCard = ({ member, big }) => (
      <div
    className={clsx(
  "team-card",
  big && "team-card-lg"
)}
    onClick={() => navigate(`/team/${encodeURIComponent(member.name)}`, { state: { member } })}
  >

      <div className="team-card-inner">
        <img src={member.img} alt={member.name} className="team-img mb-3" />
        <h6 className="team-name mb-1">{member.name}</h6>
        <div className="team-role mb-2">{member.role}</div>
        <div className="team-social d-flex justify-content-center gap-3">
          {Object.entries(SOCIAL_ICONS).map(([key, { icon, color }]) =>
            member.social?.[key] ? (
              <a
                key={key}
                href={member.social[key]}
                target="_blank"
                rel="noopener noreferrer"
                className={`team-social-link ${color}`}
                onClick={e => e.stopPropagation()}
              >
                <i className={icon}></i>
              </a>
            ) : null
          )}
        </div>
      </div>
    </div>
  );

  return (
    <PageTransition className="team-page">
      <AnimatedHero
        title="Meet Our Team"
        subtitle="The passionate people behind Darvik Foundation's mission and impact."
        className="team-hero"
        overlayColor="rgba(255,193,7,0.15)"
      />

      <section className="team-section py-5">
        <div className="container-fluid px-4"> {/* Full width with some padding */}
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 600 }}>
              <div
                className="spinner"
                style={{
                  width: 48,
                  height: 48,
                  borderTop: "5px solid var(--primary)",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite"
                }}
              />
            </div>
          ) : (
            teamRows.map((row, idx) => (
              <div key={idx} className={`team-row team-row-${row.rowNumber} mb-5`}>
                <div className="row g-4 justify-content-center"> {/* Centered content */}
                  {row.members.map(m => (
                    <div
                      key={m.id}
                      className={`${row.rowNumber === 1
                        ? "col-12 col-sm-8 col-md-6 col-lg-4"
                        : row.rowNumber === 2
                        ? "col-6 col-sm-4 col-md-3 col-lg-2"
                        : row.rowNumber === 3
                        ? "col-6 col-sm-4 col-md-3"
                        : "col-6 col-md-4 col-lg-3"
                      }`}
                    >
                      <TeamCard member={m} big={row.rowNumber === 1} />
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="team-cta py-5 text-white text-center position-relative">
        <div className="container-fluid position-relative z-2">
          <h2 className="fw-bold mb-3">Want to Join Our Team?</h2>
          <p className="lead mb-4 text-primary">
            We're always looking for passionate individuals to help us make a
            difference. Reach out to learn more about volunteering or partnering
            with us!
          </p>
          <a
            href="/contact"
            className="btn btn-primary btn-lg px-4 py-2 fw-semibold shadow"
          >
            Contact Us
          </a>
        </div>
        <div className="team-cta-overlay" />
      </section>
    </PageTransition>
  );
}