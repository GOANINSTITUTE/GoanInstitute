import React, { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";

const PrincipalVideoTestimonials = () => {
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    const querySnapshot = await getDocs(collection(db, "principalVideos"));
    const list = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setVideos(list);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <section className="py-5 honourable-section">
      <div className="container">
        {videos.map((video, index) => {
          const isReverse = index % 2 !== 0;

          return (
            <div
              key={video.id}
              className={`row align-items-center gy-4 mb-5 ${
                isReverse ? "flex-md-row-reverse" : ""
              }`}
            >
              {/* Video */}
              <div className="col-md-6">
                <div className="video-wrap shadow rounded overflow-hidden">
                  <iframe
                    title={video.title}
                    src={video.url}
                    width="100%"
                    height="315"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: "none" }}
                  ></iframe>
                </div>
              </div>

              {/* Content */}
              <div className="col-md-6 text-center text-md-start">
                <h3 className="honourable-title mb-3">
                  {video.title}
                </h3>

                <div className="honourable-content">
                  <div className="honourable-large">
                    HONOURABLE
                  </div>
                  <div className="honourable-sub">
                    School Principal
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PrincipalVideoTestimonials;