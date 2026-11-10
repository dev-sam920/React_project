import React, { useState, useEffect } from "react";
import { Archive, Bell, Tags, Trash2 } from "lucide-react";
import "../styles/pages/NotesPage.css";
import NoteInput from "../components/Notes/NoteInput";
import NoteCard from "../components/Notes/NoteCard";
import ConfirmModal from "../components/Notes/ConfirmModal";
import NoteEditModal from "../components/Notes/NoteEditModal";
import Sidebar from "../components/Layout/Sidebar";
import Navbar from "../components/Layout/Navbar";
import * as noteService from "../services/noteService";

export default function NotesPage({ view = "notes" }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");
  const [takeFocused, setTakeFocused] = useState(false);

  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [confirmState, setConfirmState] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    if (view === "reminders" || view === "labels") {
      setNotes([]);
      setIsLoading(false);
      setLoadError("");
      return undefined;
    }

    let mounted = true;
    async function fetchNotes() {
      setNotes([]);
      setIsLoading(true);
      setLoadError("");
      try {
        const data = await noteService.getNotes(view);
        if (mounted) setNotes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load notes', err);
        if (mounted) setLoadError('Failed to load notes. Please try again.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    }
    fetchNotes();
    return () => { mounted = false; };
  }, [view]);

  async function handleColorChange(id, color) {
    try {
      const updatedNote = await noteService.updateNote(id, { color });
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          (note._id || note.id) === id ? { ...note, ...updatedNote } : note
        )
      );
    } catch (err) {
      console.error('Failed to update note color', err);
    }
  }

  function handleDelete(note) {
    setDeleteError("");
    setConfirmState({ note, permanent: false });
  }

  function handleDeleteForever(note) {
    setDeleteError("");
    setConfirmState({ note, permanent: true });
  }

  async function confirmDelete() {
    if (!confirmState || isDeleting) return;

    setIsDeleting(true);
    setDeleteError("");
    try {
      if (confirmState.permanent) {
        await noteService.deleteNote(confirmState.note._id);
      } else {
        await noteService.updateNote(confirmState.note._id, { trashed: true });
      }
      setNotes((prev) => prev.filter((note) => note._id !== confirmState.note._id));
      setConfirmState(null);
    } catch (err) {
      console.error(confirmState.permanent ? 'Failed to delete note forever' : 'Failed to move note to Bin', err);
      const action = confirmState.permanent ? 'delete note' : 'move note to Bin';
      setDeleteError(err.response?.data?.message || err.message || `Failed to ${action}. Please try again.`);
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleArchive(note) {
    try {
      await noteService.updateNote(note._id, { archived: true });
      setNotes((prev) => prev.filter((currentNote) => currentNote._id !== note._id));
    } catch (err) {
      console.error('Failed to archive note', err);
    }
  }

  async function handleUnarchive(note) {
    try {
      await noteService.updateNote(note._id, { archived: false });
      setNotes((prev) => prev.filter((currentNote) => currentNote._id !== note._id));
    } catch (err) {
      console.error('Failed to unarchive note', err);
    }
  }

  async function handleRestore(note) {
    try {
      await noteService.updateNote(note._id, { trashed: false });
      setNotes((prev) => prev.filter((currentNote) => currentNote._id !== note._id));
    } catch (err) {
      console.error('Failed to restore note', err);
    }
  }

  async function handleSaveEdit(id, updates) {
    const updatedNote = await noteService.updateNote(id, updates);
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        (note._id || note.id) === id ? { ...note, ...updatedNote } : note
      )
    );
    setEditingNote(null);
  }

  const isComingSoon = view === "reminders" || view === "labels";
  const emptyState = view === "archive"
    ? { Icon: Archive, text: "Your archived notes appear here" }
    : view === "bin"
      ? { Icon: Trash2, text: "No notes in the Bin" }
      : { Icon: Archive, text: "Nothing here yet" };

  return (
    <div className="notes-page">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen((s) => !s)} />

      <div className="main-area">
        <Navbar searchValue={search} onSearchChange={setSearch} onMenuClick={() => setSidebarOpen((s) => !s)} />

        {view === "notes" && (
          <section className="take-note-area">
            <NoteInput onNoteCreated={(newNote) => setNotes((prev) => [newNote, ...prev])} />
          </section>
        )}

        <section className={`notes-grid notes-grid-${view}`}>
          {isComingSoon ? (
            <div className="coming-soon-card">
              {view === "reminders" ? <Bell size={32} aria-hidden="true" /> : <Tags size={32} aria-hidden="true" />}
              <h1>{view === "reminders" ? "Reminders are coming soon" : "Labels are coming soon"}</h1>
              <p>{view === "reminders" ? "Stay on top of the notes that matter." : "Organize your notes your way."}</p>
            </div>
          ) : (
            <>
              {(view === "archive" || view === "bin") && (
                <h1 className="notes-view-heading">{view === "archive" ? "Archive" : "Bin"}</h1>
              )}
              {view === "bin" && (
                <p className="bin-banner">Notes in the Bin can be restored or deleted forever.</p>
              )}
              {isLoading ? (
                <p className="notes-loading" role="status">Loading notes...</p>
              ) : loadError ? (
                <p className="notes-error" role="alert">{loadError}</p>
              ) : notes.length === 0 ? (
            <div className="empty-state">
              {view === "notes" ? (
                <>
                  <svg className="empty-illustration" width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
                    <path d="M34 61a22 22 0 1 1 28 0c-3.1 2.4-5 5.7-5 9H39c0-3.3-1.9-6.6-5-9Z" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M39 76h18M42 82h12M48 5v8M17 17l6 6M79 17l-6 6M8 46h9M79 46h9M25 67l-5 5M71 67l5 5" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h2 className="empty-title">Nothing here yet</h2>
                  <p className="empty-text">Notes you add will appear here.</p>
                </>
              ) : (
                <>
                  {view === "archive" ? <Archive size={48} aria-hidden="true" /> : <Trash2 size={48} aria-hidden="true" />}
                  <p className="empty-text">{emptyState.text}</p>
                </>
              )}
            </div>
          ) : (
            <div className="grid-inner">
              {notes.map((n) => (
                <NoteCard
                  key={n._id || n.id}
                  note={n}
                  view={view}
                  onEdit={view !== "bin" ? setEditingNote : undefined}
                  onColorChange={handleColorChange}
                  onDelete={handleDelete}
                  onArchive={handleArchive}
                  onUnarchive={handleUnarchive}
                  onRestore={handleRestore}
                  onDeleteForever={handleDeleteForever}
                />
              ))}
            </div>
          )}
            </>
          )}
        </section>
      </div>
      <ConfirmModal
        isOpen={Boolean(confirmState)}
        title={confirmState?.permanent ? "Delete forever?" : "Move to Bin?"}
        message={confirmState?.permanent
          ? "This note and its image will be permanently deleted. This can’t be undone."
          : "This note will be moved to the Bin. You can restore it later."}
        variant="danger"
        confirmLabel={confirmState?.permanent ? "Delete forever" : "Move to Bin"}
        isLoading={isDeleting}
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={() => {
          if (!isDeleting) {
            setConfirmState(null);
            setDeleteError("");
          }
        }}
      />
      {editingNote && (
        <NoteEditModal
          note={editingNote}
          onClose={() => setEditingNote(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

