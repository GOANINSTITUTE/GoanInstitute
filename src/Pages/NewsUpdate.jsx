import React, { useState, useEffect } from 'react';
import { db } from "../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import "./CSS/NewsUpdate.css";

// Date formatting function included directly
const formatDate = (timestamp) => {
  if (!timestamp) return "";
  
  // Handle Firebase timestamp objects
  const date = timestamp.seconds 
    ? new Date(timestamp.seconds * 1000)
    : new Date(timestamp);
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const NewsUpdate = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "news"));
        let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort by timestamp descending
        data = data.sort((a, b) => {
          const timeA = a.timestamp?.seconds || 0;
          const timeB = b.timestamp?.seconds || 0;
          return timeB - timeA;
        });
        
        setNews(data);
        setFilteredNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Filter news when tag changes
  useEffect(() => {
    if (selectedTag === "all") {
      setFilteredNews(news);
    } else {
      setFilteredNews(news.filter(item => 
        item.tags && item.tags.includes(selectedTag)
      ));
    }
    setCurrentPage(1);
  }, [selectedTag, news]);

  // Extract unique tags
  const allTags = [...new Set(news.flatMap(item => item.tags || []))];
  
  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  // Featured news (first 2 featured items)
  const featuredNews = news.filter(item => item.featured).slice(0, 2);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="news-page bg-light">
      {/* Hero Section */}
      <section className="news-hero py-5 text-center text-white position-relative">
        <div className="overlay position-absolute top-0 start-0 w-100 h-100"></div>
        <div className="container position-relative py-5">
          <h1 className="display-4 fw-bold mb-3">Making a Difference</h1>
          <p className="lead mb-4 mx-auto" style={{maxWidth: "700px"}}>
            Stay updated with our latest initiatives, success stories, and community impact
          </p>
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <button 
              className={`btn ${selectedTag === "all" ? "btn-primary" : "btn-outline-light"}`}
              onClick={() => setSelectedTag("all")}
            >
              All News
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                className={`btn ${selectedTag === tag ? "btn-primary" : "btn-outline-light"}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="py-5 bg-white">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="fw-bold text-primary">Featured Stories</h2>
              <span className="badge bg-primary rounded-pill p-2">Highlighted</span>
            </div>
            
            <div className="row g-4">
              {featuredNews.map(item => (
                <div key={item.id} className="col-lg-6">
                  <div className="card border-0 shadow-lg h-100 overflow-hidden">
                    <div className="row g-0 h-100">
                      <div className="col-md-6">
                        {item.imageUrl && (
                          <div 
                            className="h-100 bg-cover"
                            style={{
                              backgroundImage: `url(${item.imageUrl})`,
                              minHeight: '300px'
                            }}
                          ></div>
                        )}
                      </div>
                      <div className="col-md-6">
                        <div className="card-body p-4 d-flex flex-column h-100">
                          <div>
                            <div className="d-flex gap-2 mb-3">
                              {item.tags?.map((tag, i) => (
                                <span key={i} className="badge bg-info">{tag}</span>
                              ))}
                            </div>
                            <h3 className="card-title fw-bold">{item.title}</h3>
                            <p className="card-text text-muted">{item.shortDescription}</p>
                          </div>
                          
                          <div className="mt-auto pt-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <small className="d-block text-muted">
                                  {formatDate(item.timestamp)}
                                </small>
                                {item.author && (
                                  <small className="text-muted">By {item.author}</small>
                                )}
                              </div>
                              {item.sourceUrl && (
                                <a 
                                  href={item.sourceUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  Read More
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All News */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-primary">Latest Updates</h2>
            <div className="text-muted">
              Showing {Math.min(itemsPerPage, currentItems.length)} of {filteredNews.length} stories
            </div>
          </div>
          
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {currentItems.length > 0 ? (
              currentItems.map(item => (
                <div key={item.id} className="col">
                  <div className="card h-100 border-0 shadow-sm overflow-hidden">
                    {item.imageUrl && (
                      <div 
                        className="news-card-img"
                        style={{
                          backgroundImage: `url(${item.imageUrl})`,
                          height: '200px'
                        }}
                      ></div>
                    )}
                    
                    <div className="card-body p-4 d-flex flex-column">
                      <div>
                        {item.featured && (
                          <span className="badge bg-warning text-dark mb-2">Featured</span>
                        )}
                        <h5 className="card-title fw-bold">{item.title}</h5>
                        
                        <div className="d-flex gap-1 mb-3">
                          {item.tags?.map((tag, i) => (
                            <span key={i} className="badge bg-light text-dark border">{tag}</span>
                          ))}
                        </div>
                        
                        <p className="card-text text-muted">
                          {item.shortDescription || 
                          `${item.description.substring(0, 120)}${item.description.length > 120 ? "..." : ""}`}
                        </p>
                      </div>
                      
                      <div className="mt-auto pt-3">
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-muted">
                            {formatDate(item.timestamp)}
                          </small>
                          <a 
                            href={`/news/${item.id}`} 
                            className="btn btn-sm btn-outline-primary"
                          >
                            View Details
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 py-5 text-center">
                <div className="bg-white p-5 rounded-3 shadow-sm">
                  <i className="bi bi-newspaper display-1 text-muted mb-4"></i>
                  <h3 className="mb-3">No News Found</h3>
                  <p className="text-muted mb-4">
                    There are no news items matching your selection
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setSelectedTag("all")}
                  >
                    View All News
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-5 d-flex justify-content-center">
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                </li>
                
                {[...Array(totalPages).keys()].map(num => (
                  <li 
                    key={num} 
                    className={`page-item ${currentPage === num + 1 ? "active" : ""}`}
                  >
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(num + 1)}
                    >
                      {num + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <h3 className="fw-bold">Stay Connected</h3>
              <p className="mb-0">
                Subscribe to our newsletter for regular updates on our initiatives
              </p>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <input 
                  type="email" 
                  className="form-control form-control-lg" 
                  placeholder="Your email address"
                />
                <button className="btn btn-light btn-lg" type="button">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsUpdate;