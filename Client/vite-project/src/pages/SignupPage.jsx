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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    authService.signup({ name: fullName, email, password })
      .then(() => {
        navigate('/login', { state: { message: 'Account created! Please log in.' } });
      })
      .catch((err) => {
        setError(err?.response?.data?.message || 'Signup failed');
      })
      .finally(() => setIsSubmitting(false));
  };

  return (
    <main className="auth-page">
      <section className="signup-story" aria-label="About Keepy">
        <div className="signup-brand">
          <span className="brand-mark" aria-hidden="true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M7 4.75h8.5L19 8.25v11H7z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M15 4.75v4h4M10 12h6M10 15h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>Keepy</span>
        </div>

        <div className="memory-stack" aria-hidden="true">
          <article className="memory-card memory-card-one">
            <span className="memory-label">Little reminder</span>
            <p>Pick up fresh flowers</p>
          </article>
          <article className="memory-card memory-card-two">
            <span className="memory-label">An idea to keep</span>
            <p>Make room for slow mornings</p>
          </article>
          <article className="memory-card memory-card-three">
            <span className="memory-label">Today</span>
            <p>One thing at a time.</p>
          </article>
        </div>

        <div className="story-copy">
          <h2>Start keeping what<br />matters.</h2>
          <p>Create your free account and never lose an idea again.</p>
        </div>
      </section>

      <section className="signup-panel">
        <div className="signup-form-shell">
          <h1>Create your account</h1>
          <p className="signup-intro">It only takes a minute.</p>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="signup-field">
              <label htmlFor="signup-name">Full Name</label>
              <input id="signup-name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>

            <div className="signup-field">
              <label htmlFor="signup-email">Email</label>
              <input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="signup-field">
              <label htmlFor="signup-password">Password</label>
              <div className="signup-password-row">
                <input id="signup-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
                <button type="button" className="signup-password-toggle" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a20.96 20.96 0 015.06-6.06" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M1 1l22 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                </button>
              </div>
              <span className="signup-hint">At least 8 characters.</span>
            </div>

            <label className="signup-terms">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} required />
              <span>I agree to the Terms</span>
            </label>

            <button className="signup-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create account'}
            </button>
          </form>

          {error && <p className="signup-error" role="alert">{error}</p>}

          <p className="signup-switch">Already have an account? <Link to="/login">Log in</Link></p>
        </div>
      </section>
    </main>
  );
}
