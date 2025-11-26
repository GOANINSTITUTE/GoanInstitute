import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import AnimatedHero from '../Components/AnimatedHero';
import PageTransition from '../Components/PageTransition';

function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const navigate = useNavigate();
  const auth = getAuth();

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  // Helper function to get email from identifier (name or email)
  const getEmailFromIdentifier = async (identifier) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (emailRegex.test(identifier)) {
      // Identifier is an email, check if it exists in Firestore
      const q = query(collection(db, "adminUsers"), where("email", "==", identifier));
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : identifier;
    } else {
      // Identifier is a name, look up email in Firestore
      const q = query(collection(db, "adminUsers"), where("name", "==", identifier));
      const snapshot = await getDocs(q);
      return snapshot.empty ? null : snapshot.docs[0].data().email;
    }
  };

  // Handle login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const emailToUse = await getEmailFromIdentifier(identifier);
      
      if (!emailToUse) {
        showToast("You are not an authenticated user of Darvik Foundation. Please contact admin.", "error");
        return;
      }

      await signInWithEmailAndPassword(auth, emailToUse, password);
      showToast("Logged in successfully!", "success");
      navigate('/admin');
    } catch (err) {
      if (err.code === "auth/invalid-credential" || err.code === "auth/invalid-login-credentials") {
        showToast("Invalid login credentials. Please try again.", "error");
      } else {
        showToast(err.message, "error");
      }
    }
  };

  // Handle forgot password - FIXED VERSION
  const handleForgotPassword = async () => {
    if (!identifier) {
      showToast("Please enter your email or name first.", "error");
      return;
    }

    try {
      const emailToUse = await getEmailFromIdentifier(identifier);
      
      if (!emailToUse) {
        showToast("You are not an authenticated user of Darvik Foundation. Please contact admin.", "error");
        return;
      }

      // Send password reset email only if user is authenticated
      await sendPasswordResetEmail(auth, emailToUse);
      showToast(`Password reset link has been sent to ${emailToUse}. Check your inbox.`, "success");
    } catch (err) {
      showToast("Something went wrong. Please try again later.", "error");
    }
  };

  return (
    <PageTransition className="contact-page bg-light">
      <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
        <AnimatedHero
          title="Login"
          subtitle="Secure admin access to manage GOAN INSTITUTE's content and initiatives."
          className="services-hero-modern"
          overlayColor="rgba(102,126,234,0.1)"
        />

        <div className="flex-grow-1 d-flex align-items-center justify-content-center" style={{ padding: "2rem" }}>
          <div className="card p-4 shadow" style={{ maxWidth: 400, width: "100%", borderRadius: 18, border: "none" }}>
            <div className="text-center mb-4">
              <img src="https://res.cloudinary.com/dcfpgz4x8/image/upload/v1762753746/cropped-Untitled-design-18_zgjahh.png" alt="Darvik Foundation" style={{ width: 64, height: 64, borderRadius: 12, marginBottom: 8 }} />
              <h2 className="mb-1" style={{ color: "var(--secondary)", fontWeight: 700 }}>Admin Login</h2>
              <div className="mb-2" style={{ color: "var(--secondary-light)", fontWeight: 500, fontSize: 18 }}>Goan Institute</div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" style={{ color: "var(--secondary)", fontWeight: 600 }}>Email or Name</label>
                <input
                  type="text"
                  className="form-control textarea-secondary"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="Enter email or your name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label" style={{ color: "var(--secondary)", fontWeight: 600 }}>Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control textarea-secondary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ borderRight: 0 }}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    className="btn btn-outline textarea-secondary"
                    tabIndex={-1}
                    onClick={() => setShowPassword(v => !v)}
                    style={{ borderLeft: 0 }}
                  >
                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                  </button>
                </div>
              </div>

              <div className="mb-3 text-end">
                <button
                  type="button"
                  className="btn btn-link p-0"
                  style={{ fontSize: 14 }}
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="btn-accent w-100">Login</button>
            </form>
          </div>
        </div>

        {/* Toast container */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="position-fixed bottom-0 end-0 p-3"
          style={{ zIndex: 9999 }}
        >
          {toast.message && (
            <div className={`toast align-items-center text-white bg-${toast.type === 'error' ? 'danger' : 'success'} border-0 show`} role="alert">
              <div className="d-flex">
                <div className="toast-body">{toast.message}</div>
                <button type="button" className="btn-close btn-close-white me-2 m-auto" onClick={() => setToast({ message: '', type: '' })}></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default Login;