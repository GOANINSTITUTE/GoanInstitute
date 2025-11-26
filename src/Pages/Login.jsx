import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';



function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-bg d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow" style={{ maxWidth: 400, width: '100%', borderRadius: 18, border: 'none' }}>
        <div className="text-center mb-4">
          <img src="/logodarvik.png" alt="Darvik Foundation" style={{ width: 64, height: 64, borderRadius: 12, marginBottom: 8 }} />
          <h2 className="mb-1" style={{ color: "#cdf326ff", fontWeight: 700 }}>Admin Login</h2>
          <div className="mb-2" style={{ color: "#0d6efd", fontWeight: 500, fontSize: 18 }}>Darvik Foundation</div>
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#0d6efd", fontWeight: 600 }}>Email</label>
            <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#0d6efd", fontWeight: 600 }}>Password</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ borderRight: 0 }}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                style={{ borderLeft: 0, background: "#fff" }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye-off SVG
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#f3268c" strokeWidth="2" d="M3 3l18 18M10.7 10.7a3 3 0 104.6 4.6M6.53 6.53C4.13 8.36 2.5 11 2.5 12c0 1 .97 2.7 2.97 4.3C8.47 18.1 11.23 19 12 19c.77 0 3.53-.9 6.53-2.7C21.03 14.7 22 13 22 12c0-.77-.9-3.53-2.7-6.53C17.3 4.97 16 4 15 4c-1 0-2.7.97-4.3 2.97"></path></svg>
                ) : (
                  // Eye SVG
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" stroke="#0d6efd" strokeWidth="2"/><path stroke="#0d6efd" strokeWidth="2" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/></svg>
                )}
              </button>
            </div>
          </div>
          <button type="submit" className="btn w-100" style={{ background: "linear-gradient(90deg, #cdf326ff 60%, #0d6efd 100%)", color: "#fff", fontWeight: 600, borderRadius: 8, border: "none" }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;