import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import AboutUs from './Pages/About.jsx';
import Contact from './Pages/Contact.jsx';
import NewsUpdates from './Pages/NewsUpdate.jsx';
import Gallery from './Pages/Gallery.jsx';
import AdminPanel from './AdminDashbord/AdminPanel.jsx';
import Team from './Pages/Team.jsx';
import TeamMemberDetails from './Pages/TeamMemberDetails.jsx';
import Nav from './Components/Nav.jsx';
import Footer from './Components/Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Services from './Pages/Services.jsx';
import Testimonials from './Pages/Testimonials.jsx';
import Login from './Pages/Login.jsx';
import ThankYou from './Pages/Thankyou.jsx';
import Donation from './Pages/donation.jsx';
import NewsDetail from './Pages/NewsDetail.jsx';

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';

function PrivateRoute({ children }) {
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);
  if (user === undefined) return <div>Loading...</div>;
  return user ? children : <Login />;
}

// ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Nav />
      <div style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/news" element={<NewsUpdates />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/:name" element={<TeamMemberDetails />} />
          <Route path="/services" element={<Services />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/login" element={<Login />} />
          <Route path="/donate" element={<Donation />} />
          <Route path="/thank-you" element={<ThankYou />} />
          <Route path="/news/:id" element={<NewsDetail />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
