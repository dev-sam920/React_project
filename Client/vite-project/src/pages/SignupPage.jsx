import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/pages/SignupPage.css";
import * as authService from "../services/authService";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    authService.signup({ name: fullName, email, password })
      .then((data) => {
        // Do not auto-login after signup. Redirect user to login with a success message.
        navigate('/login', { state: { message: 'Account created! Please log in.' } });
      })
      .catch((err) => {
        setError(err?.response?.data?.message || 'Signup failed');
      })
      .finally(() => setIsSubmitting(false));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  return (
    <div className="signup-page">
      <div className="card">
        <div className="logo">Keepy</div>
        <h1 className="title">Create account</h1>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-row">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="button" className="toggle" onClick={() => setShowPassword((s) => !s)} aria-label="Toggle password">
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a20.96 20.96 0 015.06-6.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </button>
            </div>
          </div>

          <label className="checkbox-row">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            <span>I agree to Terms</span>
          </label>

          <button className="primary-btn" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create account'}</button>
        </form>

        {error && <p className="form-error" style={{color: 'crimson', marginTop: 12}}>{error}</p>}

        <div className="switch-link">Already have an account? <Link to="/login">Login</Link></div>
      </div>
    </div>
  );
}
