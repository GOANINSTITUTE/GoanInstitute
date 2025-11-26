import React from "react";

// If you use create-react-app, make sure to include Bootstrap Icons in your index.html or as a package (npm install bootstrap-icons)
const COMPETENCIES = [
  {
    key: "linguistic",
    icon: "bi-journal-text",
    title: "Linguistic Competence",
    desc: "Students learn to handle the English language effectively and without errors, acquiring the art of brevity and clarity.",
  },
  {
    key: "personal",
    icon: "bi-person-bounding-box",
    title: "Personal Competence",
    desc: "We focus on enhancing mental, emotional, physical, social, and spiritual attributes, empowering students to harness their own strengths to overcome challenges.",
  },
  {
    key: "intellectual",
    icon: "bi-lightbulb",
    title: "Intellectual Competence",
    desc: "Our training in soft skills and life skills significantly improves students' cognitive capabilities, helping them advance in both academic and personal pursuits.",
  },
  {
    key: "interpersonal",
    icon: "bi-people",
    title: "Interpersonal Competence",
    desc: "Through individual and group activities, students gain self-awareness and develop better communication skills. This is crucial for teamwork in today’s corporate environment.",
  },
  {
    key: "societal",
    icon: "bi-globe-americas",
    title: "Societal Competence",
    desc: "Adolescence can be a challenging period marked by questions and self-focused behavior. Our program provides the care and training necessary to nurture students into responsible citizens who respect societal norms and contribute positively to their communities.",
  },
];
// Use your branded background image here

export default function CompetenceSection() {
  // Inline animation with fade/scale, no external CSS
  React.useEffect(() => {
    const cards = document.querySelectorAll(".competence-card");
    cards.forEach((card, idx) => {
      setTimeout(() => {
        card.style.opacity = 1;
        card.style.transform = "translateY(0)";
      }, idx * 180);
    });
  }, []);

  return (
    <section className="mt-5 mb-5">
  <div className="container py-4">

    <h2
      className="fw-bold mb-4 text-center"
      style={{
        color: "var(--text-dark)",
        fontSize: "1.9rem",
        letterSpacing: "0.5px",
      }}
    >
      WE TRAIN STUDENTS TO EXCEL IN:
    </h2>

    <div className="row justify-content-center gy-3">
      {COMPETENCIES.map((c) => (
        <div
          key={c.key}
          className="col-12 col-md-6 col-lg-4 d-flex align-items-center gap-3"
          style={{
            padding: "10px 5px",
            transition: "all 0.3s ease",
          }}
        >
          {/* Icon */}
          <span
            className={`bi ${c.icon}`}
            style={{
              fontSize: 30,
              color: "var(--primary)",
              marginRight: 8,
            }}
          />

          {/* Title */}
          <div
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "var(--primary)",
              lineHeight: 1.4,
            }}
          >
            {c.title}
          </div>
        </div>
      ))}
    </div>

  </div>
</section>


  );
}
