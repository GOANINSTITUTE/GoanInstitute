import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import AboutUs from './Pages/About.jsx';
import Contact from './Pages/Contact.jsx';
import Gallery from './Pages/Gallery.jsx';
import AdminPanel from './AdminDashbord/AdminPanel.jsx';
import Team from './Pages/Team.jsx';
import TeamMemberDetails from './Pages/TeamMemberDetails.jsx';
import Careers from './Pages/Careers.jsx';
import Footer from './Components/Footer.jsx';
import Services from './Pages/Services.jsx';
import Testimonials from './Pages/Testimonials.jsx';
import Login from './Pages/Login.jsx';
import Error from "./Pages/Error.jsx";
import Offline from './Components/Offline.jsx';  
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import Header from './Components/Header.jsx';
import GICEProfile from './Pages/GICEProfile.jsx';
import GICEFamily from './Pages/GICEFamily.jsx';
import SSDP from './Pages/SDPP.jsx';
import SSMO from './Pages/SSMO.jsx';
// PrivateRoute component remains unchanged
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

// ScrollToTop remains unchanged
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Router>
      {isOnline ? (
        <>
          <ScrollToTop />
          <Header />
          <div style={{ minHeight: '80vh' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
              <Route path="/team" element={<Team />} />
              <Route path="/team/:name" element={<TeamMemberDetails />} />
              <Route path="/services" element={<Services />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/profile" element={<GICEProfile />} />
              <Route path="/GICEFamily" element={<GICEFamily />} />
              <Route path="/services/smart-scholar" element={<SSMO />} />
              <Route path="/services/regular-skill-development" element={<SSDP />} />
              <Route path="*" element={<Error />} />
            </Routes>
          </div>
          <Footer />
        </>
      ) : (
        <Offline />
      )}
    </Router>
  );
}

export default App;
