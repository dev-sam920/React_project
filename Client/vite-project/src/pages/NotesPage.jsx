import React, { useState, useEffect } from "react";
import "../styles/pages/NotesPage.css";
import NoteInput from "../components/Notes/NoteInput";
import * as noteService from "../services/noteService";

export default function NotesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [takeFocused, setTakeFocused] = useState(false);

  const [notes, setNotes] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function fetchNotes() {
      try {
        const data = await noteService.getNotes();
        if (mounted) setNotes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load notes', err);
      }
    }
    fetchNotes();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="notes-page">
      <aside className={`sidebar ${sidebarOpen ? "open" : "collapsed"}`}>
        <button className="collapse-btn" onClick={() => setSidebarOpen((s) => !s)} aria-label="Toggle sidebar">☰</button>
        <nav className="nav-list">
          <button className="nav-item active"><span className="dot"/>Notes</button>
          <button className="nav-item"><span className="dot"/>Reminders</button>
          <button className="nav-item"><span className="dot"/>Edit labels</button>
          <button className="nav-item"><span className="dot"/>Archive</button>
          <button className="nav-item"><span className="dot"/>Bin</button>
        </nav>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="left-controls">
            <button className="hamburger" aria-label="menu">☰</button>
            <div className="brand"><span className="brand-logo">Keepy</span></div>
          </div>

          <div className="search-wrap">
            <div className="search-box">
              <svg className="icon" viewBox="0 0 24 24" width="18" height="18"><path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
            </div>
          </div>

          <div className="right-controls">
            <button className="icon-btn" aria-label="refresh">⟳</button>
            <button className="icon-btn" aria-label="toggle view">▦</button>
            <button className="icon-btn" aria-label="settings">⚙</button>
            <div className="avatar" aria-hidden>U</div>
          </div>
        </header>

        <section className="take-note-area">
          <NoteInput onNoteCreated={(newNote) => setNotes((prev) => [newNote, ...prev])} />
        </section>

        <section className="notes-grid">
          {notes.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18h6v1a1 1 0 01-1 1H10a1 1 0 01-1-1v-1z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M7 10a5 5 0 1110 0c0 1.657-1 3-2 4H9c-1-1-2-2.343-2-4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <p className="empty-text">Notes that you add appear here</p>
            </div>
          ) : (
            <div className="grid-inner">
              {notes.map((n) => (
                <article
                  key={n._id || n.id}
                  className="note-card"
                  style={{ background: n.color || undefined, color: 'var(--text)' }}
                >
                  {n.imageUrl && (
                    <div style={{ width: '100%', height: 140, overflow: 'hidden', borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                      <img src={n.imageUrl} alt="note" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                  )}
                  {n.title && <h3 className="note-title" style={{ margin: 0 }}>{n.title}</h3>}
                  {n.body && <p className="note-body" style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>{n.body}</p>}
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
// Placeholder: Notes page displaying user's notes
