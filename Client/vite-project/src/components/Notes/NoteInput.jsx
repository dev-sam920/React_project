import React, { useState, useRef, useEffect } from "react";
import "../../styles/pages/NoteInput.css";
import * as noteService from "../../services/noteService";
import { Image as ImageIcon } from 'lucide-react';

export default function NoteInput({ onNoteCreated }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [color, setColor] = useState("#FFFBF5");
  const [image, setImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imagePublicId, setImagePublicId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showSwatches, setShowSwatches] = useState(false);

  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    function handleDocClick(e) {
      if (isExpanded && containerRef.current && !containerRef.current.contains(e.target)) {
        handleClose();
      }
    }
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [isExpanded, title, body, color, image]);

  const handleFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setImage(f);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreviewUrl(ev.target.result);
      reader.readAsDataURL(f);

     
      (async () => {
        try {
          setUploadingImage(true);
          setImageUrl(null);
          setImagePublicId(null);
          const res = await noteService.uploadImage(f);
          if (res && (res.secure_url || res.secureUrl)) {
            setImageUrl(res.secure_url || res.secureUrl);
            setImagePublicId(res.public_id || res.publicId || res.public_id);
          }
        } catch (err) {
          console.error('Image upload failed', err);
          setError('Image upload failed');
        } finally {
          setUploadingImage(false);
        }
      })();
    }
  };

  const handleClose = async () => {
    setError(null);
    // nothing to save — just collapse
    if (!title.trim() && !body.trim() && !image) {
      setIsExpanded(false);
      return;
    }

    try {
      setSaving(true);
      console.log('Creating note payload', { title, body, color, hasImage: !!image, imageUrl, imagePublicId });

      let newNote;
      if (imageUrl) {
        // send JSON payload with image metadata
        const payload = { title, body, color, imageUrl, imagePublicId };
        newNote = await noteService.createNote(payload);
      } else if (image) {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', body);
        formData.append('color', color);
        formData.append('image', image);
        newNote = await noteService.createNote(formData);
      } else {
        const payload = { title, body, color };
        newNote = await noteService.createNote(payload);
      }

      // reset fields
      setTitle("");
      setBody("");
      setImage(null);
      setImagePreviewUrl(null);
      setColor("#FFFBF5");
      setIsExpanded(false);

      if (typeof onNoteCreated === 'function') onNoteCreated(newNote);
    } catch (err) {
      console.error(err);
      setError('Failed to save note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="note-input-wrapper" ref={containerRef}>
      <div className={`note-input-card ${isExpanded ? "expanded" : "collapsed"}`} style={{ background: color }}>
        {isExpanded && (
          <input
            className="note-title"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        )}

        {isExpanded ? (
          <textarea
            className="note-body"
            placeholder="Take a note..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            autoFocus
          />
        ) : (
          <input
            className="note-placeholder"
            placeholder="Take a note..."
            onFocus={() => setIsExpanded(true)}
            readOnly
          />
        )}

        {imagePreviewUrl && (
          <div className="image-preview">
            <img src={imageUrl || imagePreviewUrl} alt="preview" />
          </div>
        )}

        <div className="note-toolbar">
          <div className="left-tools">
            <div className="color-picker">
              <button
                className="color-btn"
                title="Choose color"
                onClick={(e) => { e.stopPropagation(); setShowSwatches((s) => !s); }}
              >
                🎨
              </button>
              {showSwatches && (
                <div className="swatches" onClick={(e) => e.stopPropagation()}>
                  {[
                    ["#FFFBF5", "cream"],
                    ["#C1673D", "terracotta"],
                    ["#6B7A4F", "olive"],
                    ["#F0DFAF", "mustard"],
                    ["#8DA6A0", "teal"],
                    ["#D9A3A1", "rose"],
                  ].map((s) => (
                    <button
                      key={s[0]}
                      className="swatch"
                      style={{ background: s[0] }}
                      onClick={() => { setColor(s[0]); setShowSwatches(false); }}
                      aria-label={s[1]}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="image-upload">
              <button
                onClick={(e) => { e.stopPropagation(); fileInputRef.current && fileInputRef.current.click(); }}
                aria-label="Upload image"
              >
                {uploadingImage ? 'Uploading...' : <ImageIcon size={18} />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
            </div>

            <button className="icon-btn" aria-label="More">⋯</button>
          </div>

          <div className="right-tools">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {error && <div className="inline-error" style={{ color: 'var(--danger)', fontSize: 12 }}>{error}</div>}
              <button className="close-btn" onClick={handleClose} disabled={saving}>
                {saving ? 'Saving...' : (isExpanded ? 'Close' : '')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

