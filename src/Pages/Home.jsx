import React, { useEffect, useState, useCallback, useRef } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import {  query, orderBy, limit } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Link  } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import GrowthSkillsSection from "../Pages/GrowthSkillsSection.jsx";
import Hero from "../Components/Hero.jsx";
import SmallContact from "../Components/Contact_home.jsx";
import PageTransition from "../Components/PageTransition";
import OperationsSection from "./OperationsSection.jsx";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./CSS/Home.css";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";
import Impact from "../Components/Home/Impact.jsx";
function Home() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [services, setServices] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [visionImage, setVisionImage] = useState("");
  const isMobile = window.innerWidth <= 768;
  const navigate = useNavigate();
  // 🔹 Competence section states
  const [competences, setCompetences] = useState([]);
  const [competenceBg, setCompetenceBg] = useState("");

  const storage = getStorage();

  const fadeUpAnimation = {
    animationName: "fadeUp",
    animationDuration: "1.2s",
    animationTimingFunction: "ease-out",
    animationFillMode: "forwards",
    opacity: 0,
    transform: "translateY(20px)",
    animationPlayState: "paused",
  };

  const fadeUpAnimationSubtitle = { ...fadeUpAnimation, animationDuration: "1.6s" };

  const fadeUpCardAnimation = (delay) => ({
    animationName: "fadeUpCards",
    animationDuration: "1.2s",
    animationTimingFunction: "ease-out",
    animationFillMode: "forwards",
    animationDelay: delay,
    opacity: 0,
    transform: "translateY(30px)",
    animationPlayState: "paused",
  });

  // 🔹 Reusable Fetcher for Collections
  const fetchData = useCallback(
    async (colName, orderField = "uploadedAt", limitCount = 6) => {
      try {
        const q = query(collection(db, colName), orderBy(orderField, "desc"), limit(limitCount));
        const snap = await getDocs(q);

        return Promise.all(
          snap.docs.map(async (doc) => {
            const data = doc.data();
            let imageUrl = data.imageUrl || "";

            if (imageUrl && !imageUrl.startsWith("http")) {
              try {
                imageUrl = await getDownloadURL(ref(storage, imageUrl));
              } catch {
                imageUrl = "";
              }
            }
            return { id: doc.id, ...data, imageUrl };
          })
        );
      } catch (err) {
        console.error(`Error fetching ${colName}:`, err);
        return [];
      }
    },
    [storage]
  );

  // 🔹 Updated useEffect with proper Vision image fetching (Single document)
  useEffect(() => {
    const loadAll = async () => {
      try {
        const [
          galleryData,
          servicesData,
          newsData,
          competenceImagesData,
        ] = await Promise.all([
          fetchData("gallery", "uploadedAt", 6),
          fetchData("services", "createdAt", 6),
          fetchData("news", "updatedAt", 3),
          fetchData("competenceImages", "createdAt", 20),
        ]);

        setGalleryItems(galleryData);
        setServices(servicesData);
        setLatestNews(newsData);

        // 🔹 Fetch single Vision Image
        const visionRef = doc(db, "visionImages", "visionImage");
        const visionSnap = await getDoc(visionRef);
        if (visionSnap.exists()) {
          setVisionImage(visionSnap.data().imageUrl);
        }

        // 🔹 Split competence data
        const bgImage = competenceImagesData.find((img) => img.type === "background");
        const compImages = competenceImagesData.filter((img) => img.type === "competence");

        if (bgImage) setCompetenceBg(bgImage.imageUrl);
        setCompetences(compImages);

      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadAll();
  }, [fetchData]);

  // 🔹 Scroll + Bubble Logic
  const scrollRef = useRef(null);
  const [activeBubble, setActiveBubble] = useState(0);
  const [bubbleCount, setBubbleCount] = useState(0);

  useEffect(() => {
    if (scrollRef.current) {
      const totalCards = competences.length;
      const cardsPerView = Math.floor(scrollRef.current.offsetWidth / 320) || 1;
      setBubbleCount(Math.ceil(totalCards / cardsPerView));
    }
  }, [competences]);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      container.scrollBy({
        left: direction === "left" ? -380 : 380,
        behavior: "smooth",
      });
    }
  };

  const handleScrollEvent = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.offsetWidth;
      setActiveBubble(Math.round(scrollLeft / width));
    }
  };

  return (
    <PageTransition>
      <div className="home-page bg-background ">
        {/* 🔹 Hero Section */}
        <Hero />
        <section 
  style={{
    backgroundImage: `
      linear-gradient(
        rgba(0,0,0,0.65),
        rgba(0,0,0,0.8)
      ),
      url("${visionImage || 'https://res.cloudinary.com/dgxhp09em/image/upload/v1763572510/wwxtqpc1lok1fkrlnyjf.jpg'}")
    `,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    paddingBottom: "30px",
    marginBottom: "20px",
    
  }}
>
<div
    style={{
      position: "absolute",
      inset: 0,
      background: "rgba(0,0,0,0.5)", // change 0.5 to adjust opacity
      backdropFilter: "none",
      zIndex: 1,
    }}
  />

        {/* Mission & Vision Cards */}
<div
  className="container hero-cards-wrapper mt-5 mb-5"
  style={{ position: "relative", zIndex: 9999 }}
>
  <div className="row g-4 justify-content-center mb-5">

    {/* Vision */}
    <div className="col-12 col-md-5 ">
      <div
        className="p-4 shadow-lg h-100 hero-card"
        style={{
          background: "rgba(30, 30, 30, 0.65)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          backdropFilter: "blur(14px)",
          transition: "0.3s",
          borderRadius: "16px",
          cursor: "default",
          ...fadeUpCardAnimation("2s"),
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        <h3
          className="text-warning fw-bold text-center mb-3"
          style={{ letterSpacing: "1.5px", fontSize: isMobile ? "1.1rem" : "1.3rem" }}
        >
          OUR VISION
        </h3>

        <p className="text-light text-center" style={{ fontSize: isMobile ? "0.9rem" : "1rem", lineHeight: 1.65 }}>
          To Guide, Inspire, Challenge, Empower young minds by imparting knowledge, values,
          and skills that shape character and prepare them to become responsible and visionary citizens.
        </p>

        <div
          style={{
            height: "1px",
            margin: "15px auto",
            width: "60%",
            background: "linear-gradient(90deg, transparent, #ffc107, transparent)",
          }}
        />

        <p className="text-warning text-center fw-semibold small mb-0">
           Guide • Inspire • Challenge • Empower
        </p>
      </div>
    </div>

    {/* Mission */}
    <div className="col-12 col-md-5 ">
      <div
        className="p-4 shadow-lg h-100 hero-card"
        style={{
          background: "rgba(30, 30, 30, 0.65)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          backdropFilter: "blur(14px)",
          transition: "0.3s",
          borderRadius: "16px",
          cursor: "default",
          ...fadeUpCardAnimation("2.3s"),
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-8px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        <h3
          className="text-warning fw-bold text-center mb-3"
          style={{ letterSpacing: "1.5px", fontSize: isMobile ? "1.1rem" : "1.3rem" }}
        >
          OUR MISSION
        </h3>

        <p className="text-light text-center" style={{ fontSize: isMobile ? "0.9rem" : "1rem", lineHeight: 1.65 }}>
          To implement advanced learning programs that develop communication skills, improve employability,
          and build environmental and social awareness in students.
        </p>

        <div
          style={{
            height: "1px",
            margin: "15px auto",
            width: "60%",
            background: "linear-gradient(90deg, transparent, #ffc107, transparent)",
          }}
        />

        <p className="text-warning text-center fw-semibold small mb-0">
          Educate
        </p>
      </div>
    </div>
  </div>


  {/* Moto — Centered */}
  <div className="row justify-content-center mt-4 mb-4">
    <div className="col-12 col-md-6">
      <div
        className="p-4 shadow-lg h-100 hero-card"
        style={{
          background: "rgba(35, 35, 35, 0.75)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          backdropFilter: "blur(16px)",
          transition: "0.3s",
          borderRadius: "18px",
          cursor: "default",
          boxShadow: "0 0 20px rgba(255, 193, 7, 0.3)",
          ...fadeUpCardAnimation("2.6s"),
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        <h3
          className="text-warning fw-bold text-center mb-3"
          style={{ letterSpacing: "1.8px", fontSize: isMobile ? "1.15rem" : "1.35rem" }}
        >
          OUR MOTO
        </h3>

        <p
          className="text-light text-center"
          style={{
            fontSize: isMobile ? "1rem" : "1.3rem",
            fontWeight: "600",
            letterSpacing: "1.2px",
          }}
        >
          Literacy & Employability
        </p>
      </div>
    </div>
  </div>
</div>
</section>


  <OperationsSection/>   
        

  <GrowthSkillsSection />

<section
  className="py-5 text-light moving-bg"
  style={{
    background: competenceBg
      ? `linear-gradient(rgba(39, 26, 15, 0.66), rgba(0, 0, 0, 0.16)), url(${competenceBg}) center bottom / cover no-repeat`
      : "linear-gradient(135deg, #1214177c, #1b1f25)",
    minHeight: "70vh",
    overflow: "hidden",
    paddingTop: "80px",
    display: "flex",
    flexDirection: "column",
  }}
>

  {/* Heading stays at the top */}
<h3 className="fw-bold text-warning mb-5 text-center display-6">
  EDUCATIONAL SERVICES WE PROVIDE
</h3>


  {/* Cards container — ONLY this pushes items to bottom */}
<div
  className="container-fluid px-4 position-relative"
  style={{
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    flex: 1,               // 👈 THIS pushes cards to bottom
  }}
>


    {/* PC View – Horizontal Row */}
    <div
      className="d-none d-md-flex"
      style={{
        gap: "20px",
        overflowX: "auto",
        paddingBottom: "10px",
        paddingTop: "10px",
        scrollBehavior: "smooth",
        width: "100%",
      }}
    >
      {competences.map((item, i) => (
        <div
          key={item.id || i}
          className="card border-0 shadow-lg text-start"
          style={{
            minWidth: "600px",
            background: "rgba(30, 30, 30, 0.65)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            cursor: "pointer",
          }}
          onClick={() => item.link && navigate(item.link)}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 10px 20px #332020e3";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 5px 15px #4b2e2e9f";
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              padding: "20px",
              height: "220px",
            }}
          >
            {/* Left Image */}
            <div
              style={{
                width: "45%",
                height: "100%",
                background: `url(${item.imageUrl}) center/cover no-repeat`,
                borderRadius: "10px",
              }}
            ></div>

            {/* Right Content */}
            <div
              style={{
                width: "55%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <h5 className="text-warning fw-bold mb-3" style={{ fontSize: "1.7rem" }}>
                {item.title || "Untitled Skill"}
              </h5>

              <p className="text-light" style={{ fontSize: "1rem" }}>
                {item.desc || "No description available."}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Mobile View */}
    <div className="d-md-none">
      {competences.map((item, i) => (
        <div
          key={item.id || i}
          className="card border-0 shadow-lg mb-4"
          style={{
            width: "100%",
            background: "rgba(30, 30, 30, 0.65)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            cursor: "pointer",
          }}
          onClick={() => item.link && navigate(item.link)}
        >
          {/* Image */}
          <div
            style={{
              width: "100%",
              height: "200px",
              background: `url(${item.imageUrl}) center/cover no-repeat`,
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          ></div>

          {/* Content */}
          <div style={{ padding: "15px" }}>
            <h5 className="text-warning fw-bold mb-2" style={{ fontSize: "1.2rem" }}>
              {item.title || "Untitled Skill"}
            </h5>

            <p className="text-light" style={{ fontSize: "0.95rem" }}>
              {item.desc || "No description available."}
            </p>
          </div>
        </div>
      ))}
    </div>

  </div>
</section>






<Impact/>


        {/* 🔹 Testimonials Section */}
        <section className="py-5 bg-light text-center text-dark">
          <div className="container">
            <h3 className="fw-bold mb-4 text-dark">OUR CLIENTS' TESTIMONIALS</h3>
            <div className="row justify-content-center g-4">
              {[
                {
                  name: "Ms.Mercy George",
                  title: "Commendable collaboration",
                  quote:
                    "It was indeed a fine decision taken up by our school to collaborate with GICE..........",
                  designation: "Devamatha CMI Public School, Thrissur",
                  },
                {
                  name: "Ms.Subha P M ",
                  title: "Evident Changes !",
                  quote:
                    "We are very happy and satisfied with the GICE faculty member.......",
                  designation: "Sree Narayana Public School , Kottayam",
                },
                {
                  name: "Rev.Sr.Saphalya CMC ",
                  title: "Dedicated for the upliftment ",
                  quote:
                    "GICE faculty members are creative, dedicated, spending time.......",
                  designation: "Carmel High School, Pen,Maharashtra",
                },
                {
                  name: "Rev.Fr.Arun Painedath CMI ",
                  title: "Leisure time activities ",
                  quote:
                    "I would like to specially mention PLT ( Pleasure in Leisure Time) activity arranged during the lunch break......",
                  designation: "St.Xaviers CMI School , Thrissur",
                },
                {
                  name: "Ms.Carthika S",
                  title: "Painstaking efforts",
                  quote:
                    "The GICE faculty member moulds our students exceptionally through her painstaking efforts .......",
                  designation: "Gayathri Central School, Kottayam",
                },
                {
                  name: "Rev.Sr.Savitha",
                  title: "Comprehensive English Learning ",
                  quote:
                    "The GICE faculty member teaches all aspects of English—reading, writing, listening, and speaking....",
                  designation: "St.Teresa’s convent girls L.P School , Ernakulam",
                }
              ].map((t, i) => (
                <div className="col-12 col-md-5" key={i}>
                  <div className="card border-0 shadow-sm p-4 h-100">
                    <i
                      className="bi bi-chat-right-quote text-primary mb-3"
                      style={{ fontSize: "2rem" }}
                    ></i>
                    <h5 className="fw-bold text-dark">{t.title}</h5>
                    <p className="fst-italic small">"{t.quote}"</p>
                    <h6 className="text-muted small">- {t.name}</h6>
                    <h6 className="text-muted small">{t.designation}</h6>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <Link to="/testimonials" className="btn btn-primary btn-lg">
                View More Testimonials
              </Link>
            </div>
            <h3 className="fw-bold mt-4 mb-4 text-dark">REVIEWS FROM GICE FAMILY MEMBERS</h3>
            <div className="row justify-content-center g-4 mt-3">
              {[
                {
                  name: "Benila",
                  title: "Skill Development!",
                  quote:
                    "I have dedicated 14 years to GICE as a Faculty member specialising in skill development. During this time .......",
                  designation: "Faculty Member, GICE",
                },
                {
                  name: "Jismi Raj",
                  title: "Public Speaking into Reality!",
                  quote:
                    "Teaching is my passion, and GICE has helped me grow while inspiring others. It turned my dream of anchoring and public speaking .......",
                  designation: "Faculty Member, GICE",
                },
                {
                  name: "Sruthy",
                  title: " Interacting with students!",
                  quote:
                    "Being a Skill Development Faculty brings me joy every day. Interacting with students energizes me and sparks my creativity. .......",
                  designation: "Faculty Member, GICE",
                },
                {
                  name: "Akash D",
                  title: "Work with the students!",
                  quote:
                    "I have been working at GICE for the last two years, and so far, the journey has been memorable .......",
                  designation: "Faculty Member, GICE",
                },
                {
                  name: "Anjitha",
                  title: "Skill Based Learning!",
                  quote:
                    "Being a part of GICE as a skill development faculty member has been a truly rewarding journey. The platform has not only enhanced my teaching skills.......",
                  designation: "Faculty Member, GICE",
                },
                {
                  name: "Arindam Saha",
                  title: "Future of students!",
                  quote:
                    "Shaping the future of students has always been on my bucket list, and GICE provided me with a platform .......",
                  designation: "Faculty Member, GICE",
                }
              ].map((t, i) => (
                <div className="col-12 col-md-5 " key={i}>
                  <div className="card border-0 shadow-sm p-4 h-100 " style={{background: "var(--secondary-light-opaced, #5c443381)",}}>
                    <i
                      className="bi bi-chat-right-quote text-eggshel mb-3"
                      style={{ fontSize: "2rem" }}
                    ></i>
                    <h5 className="fw-bold text-dark">{t.title}</h5>
                    <p className="fst-italic small">"{t.quote}"</p>
                    <h6 className="text-muted small">- {t.name}</h6>
                    <h6 className="text-muted small">{t.designation}</h6>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link to="/GICEFamily" className="btn btn-accent btn-lg">
                View More Reviews
              </Link>
            </div>
          </div>
        </section>

 <section
      className="py-5"
      style={{
        background: "linear-gradient(90deg,#4b2e2e55 60%,#ffd70015 100%)",
        color: "#fff",
        minHeight: "320px",
      }}
    >
      <div className="container">
        <div className="row align-items-center gy-4">
          {/* Video Left */}
          <div className="col-md-6">
            <div
              style={{
                position: "relative",
                paddingBottom: "56.25%", // 16:9 aspect ratio
                height: 0,
                overflow: "hidden",
                borderRadius: 16,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
              }}
            >
              <iframe
                title="Motivational Video"
                src="https://www.youtube.com/embed/GMh0TL7YGyk?si=Xsb_OimLgtsFHXQs" // Replace with actual video ID
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: 16,
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {/* Content Right */}
          <div className="col-md-6 text-center text-md-start">
            <h3
              className="mb-1"
              style={{
                color: "var(--accent, #ffd700)",
                fontWeight: "700",
                fontSize: "3rem",
                letterSpacing: "1px",
                textShadow: "0 2px 8px #4b2e2e80",
              }}
            >
              Dream & Frame<br />
              
            </h3>
            <span style={{ color: "#fff",fontWeight: "700",
                fontSize: "2.3rem",
                letterSpacing: "1px",
                textShadow: "0 2px 8px #4b2e2e80",}}>Your Future</span>
          </div>
        </div>
      </div>
    </section>

        {/* 🔹 Contact Section */}
        <SmallContact />
      </div>
    </PageTransition>
  );
}

export default Home;
