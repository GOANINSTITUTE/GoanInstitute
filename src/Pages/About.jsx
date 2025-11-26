import React from "react";
import PageTransition from "../Components/PageTransition";
import AnimatedHero from "../Components/AnimatedHero";

// About.jsx - GICE Profile (Bootstrap + inline styles)
export default function About() {
  const phone = "+91 6238 818 885";
  const tel = phone.split(" ").join("");

  return (
    <PageTransition>
      <AnimatedHero
        title="GICE Profile"
        subtitle="We are on a mission for literacy & employability"
        className="services-hero-modern"
        overlayColor="rgba(0,0,0,0.25)"
      />

      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8">
            <p>
              <strong>We are on a mission for Literacy & Employability.</strong> Transforming students by:
            </p>

            <ul>
              <li>Guiding</li>
              <li>Inspiring</li>
              <li>Challenging</li>
              <li>Empowering</li>
            </ul>

            <p>
              For the past eighteen years, we have been at the forefront of Personal Skill Training in India, spanning
              more than seven states. Our training services are designed for school and college students to enhance their
              professional and social skills, significantly improving their employability.
            </p>

            <h5 className="mt-4">School Programmes</h5>
            <p>
              We conduct our Skill Development Programme in schools for students from Kindergarten to Higher Secondary.
              The program focuses on life skills, soft skills, and English language proficiency from the ground up through
              engaging, entertaining, and interactive activities — different from traditional teaching methods.
            </p>
            <p>
              Our experienced and well-trained faculty use modern tools such as smart classrooms and audio-visual
              linguistics to ensure every student is cared for and valued.
            </p>

            <h5 className="mt-4">College Programmes</h5>
            <p>
              For college students we offer Interview Preparatory Training and Placement Programmes. We help students
              develop essential skills to stand out in recruitment processes. We also run counselling sessions to help
              students overcome inhibitions, conduct placement drives, and participate in job fairs nationwide.
            </p>

            <h5 className="mt-4">Internships</h5>
            <p>
              Our internship programmes provide professional work experience with roles such as HR, Marketing, and
              Training — giving students real-world learning opportunities.
            </p>

            <h5 className="mt-4">Aims & Objectives</h5>
            <ul>
              <li>Provide value-added training to schools across India.</li>
              <li>Provide educational assistance and skill development to marginalized and underprivileged students.</li>
              <li>Influence youth to develop interpersonal skills, creative thinking, leadership, emotional maturity,
                decision-making, and problem-solving.</li>
              <li>Deter students from negative influences like alcohol, tobacco, drugs and other addictions.</li>
            </ul>

            <h5 className="mt-3">Objectives (summary)</h5>
            <ul>
              <li>Train students in Soft Skills, Life Skills and English through full-time on-campus faculty.</li>
              <li>Offer free training to government schools in underprivileged areas in partnership with brands.</li>
              <li>Focus on literacy and employability by providing superior training and job opportunities.</li>
            </ul>

            <h5 className="mt-4">Competencies we build</h5>
            <div className="row g-2">
              <div className="col-6 col-md-4">Linguistic Competence</div>
              <div className="col-6 col-md-4">Personal Competence</div>
              <div className="col-6 col-md-4">Intellectual Competence</div>
              <div className="col-6 col-md-4">Interpersonal Competence</div>
              <div className="col-6 col-md-4">Societal Competence</div>
            </div>

            <p className="mt-3">Students learn to handle English effectively, with brevity and clarity.</p>

            <h5 className="mt-4">Educational Services We Provide</h5>
            <ul>
              <li>Regular Full-Time Training Programme in Schools – Advanced Skill and Knowledge Development Programme</li>
              <li>Free Training Programme for Underprivileged Students through our Smart Scholar Mission</li>
              <li>Interview Preparatory Training & Placement Programme for College Students</li>
            </ul>

            <p className="text-muted small mt-3">GICE, with its decade-long legacy, offers value-oriented skill development programs nationwide. Our focus is to enhance life & soft skills for global competitiveness and to lay foundations for future leaders.</p>
          </div>

          <aside className="col-lg-4">
            <div className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">Our operations</h5>
                <p className="mb-1"><strong>18 years of journey</strong></p>
                <p className="mb-1">Reached to over 500+ schools &amp; 200+ colleges</p>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-body">
                <h6 className="fw-semibold">Who we help</h6>
                <p className="mb-0">School students (KG to Higher Secondary), College students, Underprivileged youth and Internship seekers.</p>
              </div>
            </div>

            <div className="card mb-3">
              <div className="card-body">
                <h6 className="fw-semibold">Contact</h6>
                <p className="mb-0">Phone: <a href={"tel:" + tel}>{phone}</a></p>
                <p className="mb-0">Email: info@gice.example (replace with real contact)</p>
              </div>
            </div>

            <div className="mt-3">
              <img src="https://res.cloudinary.com/dgxhp09em/image/upload/v1763573114/huf72qedebvhsu9xqk4s.jpg" alt="students" style={{width: '100%', height: 160, objectFit: 'cover', borderRadius: 6}} />
            </div>
          </aside>
        </div>

        <div className="row mt-4">
          <div className="col-12">
            <div className="p-4 rounded-3 text-center" style={{background: '#f8f9fa'}}>
              <h4 className="mb-2">Ready to transform your students?</h4>
              <p className="mb-3 text-muted">Enquire today to bring skill development and employability training to your institution.</p>
              <a href={"tel:" + tel} className="btn btn-primary btn-lg">Enquire {phone}</a>
            </div>
          </div>
        </div>

        <footer className="mt-4 text-center small text-muted">GICE — building literacy and employability, one student at a time.</footer>
      </div>
    </PageTransition>
  );
}
