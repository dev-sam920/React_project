import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const navigationItems = [
	{
		label: "Notes",
		to: "/notes",
		icon: <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M8.2 14.5a7 7 0 1 1 7.6 0c-.9.6-1.4 1.5-1.5 2.5h-4.6c-.1-1-.6-1.9-1.5-2.5Z" /></>,
	},
	{
		label: "Reminders",
		to: "/reminders",
		icon: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
	},
	{
		label: "Edit labels",
		to: "/labels",
		icon: <><path d="m14 5 5 5" /><path d="M4 20l4.4-.9L19 8a2.1 2.1 0 0 0-3-3L5.4 15.6 4 20Z" /></>,
	},
	{
		label: "Archive",
		to: "/archive",
		icon: <><path d="M4 5h16l1 4H3l1-4Z" /><path d="M5 9v10h14V9" /><path d="M10 13h4" /></>,
	},
	{
		label: "Bin",
		to: "/bin",
		icon: <><path d="M4 7h16" /><path d="M10 11v6M14 11v6" /><path d="m5 7 1 13h12l1-13" /><path d="M9 7V4h6v3" /></>,
	},
];

export default function Sidebar({ isOpen, onToggle }) {
	const { pathname } = useLocation();

	return (
		<aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
			<button className="collapse-btn" type="button" onClick={onToggle} aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}>
				<svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
					<path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
				</svg>
				<span className="collapse-label">Menu</span>
			</button>

			<nav className="nav-list" aria-label="Main navigation">
				{navigationItems.map(({ label, to, icon }) => (
					<NavLink
						key={label}
						to={to}
						end={to === "/notes"}
						className={({ isActive }) => `nav-item${isActive || (to === "/notes" && pathname === "/note") ? " active" : ""}`}
					>
						<svg className="nav-item-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
							{icon}
						</svg>
						<span className="nav-label">{label}</span>
					</NavLink>
				))}
			</nav>
		</aside>
	);
}
