import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function getProfileInitial() {
	try {
		const user = JSON.parse(localStorage.getItem("user") || "null");
		const identity = user?.name || user?.fullName || user?.email;
		return typeof identity === "string" && identity.trim() ? identity.trim()[0].toUpperCase() : "U";
	} catch {
		return "U";
	}
}

export default function Navbar({ searchValue, onSearchChange, onMenuClick }) {
	const profileRef = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		const closeOnOutsideClick = (event) => {
			if (profileRef.current && !profileRef.current.contains(event.target)) {
				profileRef.current.open = false;
			}
		};

		document.addEventListener("pointerdown", closeOnOutsideClick);
		return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		navigate("/login");
	};

	return (
		<header className="topbar">
			<div className="left-controls">
				<button className="hamburger" type="button" onClick={onMenuClick} aria-label="Toggle sidebar">
					<svg viewBox="0 0 24 24" width="21" height="21" fill="none" aria-hidden="true">
						<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
					</svg>
				</button>
				<div className="brand" aria-label="Keepy">
					<svg className="brand-notebook" viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
						<path d="M5.5 4.5h10L19 8v12H5.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
						<path d="M15.5 4.5V8H19M8.5 12h7M8.5 15h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					<span className="brand-logo">Keepy</span>
				</div>
			</div>

			<div className="search-wrap">
				<label className="search-box">
					<svg className="search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
						<circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.6" />
						<path d="m15.5 15.5 4.2 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
					</svg>
					<input value={searchValue} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search your notes" aria-label="Search your notes" />
				</label>
			</div>

			<div className="right-controls">
				<details className="profile-menu" ref={profileRef}>
					<summary className="avatar" aria-label="Open profile menu">{getProfileInitial()}</summary>
					<div className="profile-dropdown">
						<button type="button" onClick={handleLogout}>Log out</button>
					</div>
				</details>
			</div>
		</header>
	);
}
