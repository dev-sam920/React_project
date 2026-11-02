import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/pages/LoginPage.css";
import * as authService from "../services/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
	e.preventDefault();
	setError("");
	setIsSubmitting(true);
	authService.login({ email, password })
		.then((data) => {
			localStorage.setItem('token', data.token);
			localStorage.setItem('user', JSON.stringify(data.user));
			navigate('/notes');
		})
		.catch((err) => setError(err?.response?.data?.message || 'Login failed'))
		.finally(() => setIsSubmitting(false));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
	const location = useLocation();

  return (
	<div className="login-page">
	  <div className="card">
		<div className="logo">Keepy</div>
		<h1 className="title">Welcome back</h1>

		{location?.state?.message && (
		  <div className="success-banner" style={{background:'#e6f7ea',color:'#1b5e20',padding:'8px',borderRadius:6,marginBottom:8}}>
			{location.state.message}
		  </div>
		)}
		<form className="form" onSubmit={handleSubmit}>
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

					<button className="primary-btn" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Logging in...' : 'Log in'}</button>
		</form>

				{error && <p className="form-error" style={{color: 'crimson', marginTop: 12}}>{error}</p>}

				<div className="switch-link">New here? <Link to="/">Create account</Link></div>
	  </div>
	</div>
  );
}
