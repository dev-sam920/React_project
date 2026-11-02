import React, { useState, useRef, useEffect } from 'react';
import './NoteCard.css';
import { Edit3, Trash2, Archive, Palette } from 'lucide-react';

export default function NoteCard({ note, onUpdate, onDelete, onArchive }) {
	const { _id, title: initialTitle, body: initialBody, color, imageUrl } = note;
	const [editing, setEditing] = useState(false);
	const [title, setTitle] = useState(initialTitle || '');
	const [body, setBody] = useState(initialBody || '');
	const [showSwatches, setShowSwatches] = useState(false);

	const wrapperRef = useRef(null);

	useEffect(() => {
		setTitle(initialTitle || '');
		setBody(initialBody || '');
	}, [initialTitle, initialBody]);

	useEffect(() => {
		function handleDocClick(e) {
			if (editing && wrapperRef.current && !wrapperRef.current.contains(e.target)) {
				handleSave();
			}
		}
		document.addEventListener('mousedown', handleDocClick);
		return () => document.removeEventListener('mousedown', handleDocClick);
	}, [editing, title, body]);

	const handleSave = () => {
		setEditing(false);
		if ((title !== initialTitle) || (body !== initialBody)) {
			if (typeof onUpdate === 'function') onUpdate(_id, { title, body });
		}
	};

	const handleDelete = () => {
		if (!window.confirm('Delete this note?')) return;
		if (typeof onDelete === 'function') onDelete(_id);
	};

	const handleArchive = () => {
		if (typeof onArchive === 'function') onArchive(_id);
	};

	const palette = [
		['#FFFBF5', 'cream'],
		['#C1673D', 'terracotta'],
		['#6B7A4F', 'olive'],
		['#F0DFAF', 'mustard'],
		['#8DA6A0', 'teal'],
		['#D9A3A1', 'rose'],
	];

	const cardStyle = {
		background: color || '#FFF8F1',
		border: color ? 'none' : '1px solid #D8C4B0',
		borderRadius: 8,
	};

	return (
		<article className="note-card" style={cardStyle} ref={wrapperRef}>
			{imageUrl && (
				<div className="note-image">
					<img src={imageUrl} alt="note" />
				</div>
			)}

			<div className="note-content" onClick={() => setEditing(true)}>
				{editing ? (
					<input className="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
				) : (
					<h3 className="note-title">{title}</h3>
				)}

				{editing ? (
					<textarea className="edit-body" value={body} onChange={(e) => setBody(e.target.value)} />
				) : (
					<p className="note-body">{body}</p>
				)}
			</div>

			<div className="note-actions">
				<div className="actions-left">
					<button
						className="action-btn"
						title="Edit"
						onClick={(e) => { e.stopPropagation(); setEditing(true); }}
					>
						<Edit3 size={16} />
					</button>

					<button
						className="action-btn"
						title="Delete"
						onClick={(e) => { e.stopPropagation(); handleDelete(); }}
					>
						<Trash2 size={16} />
					</button>

					<button
						className="action-btn"
						title="Archive"
						onClick={(e) => { e.stopPropagation(); handleArchive(); }}
					>
						<Archive size={16} />
					</button>

					<div className="palette-wrapper">
						<button
							className="action-btn"
							title="Color"
							onClick={(e) => { e.stopPropagation(); setShowSwatches((s) => !s); }}
						>
							<Palette size={16} />
						</button>
						{showSwatches && (
							<div className="swatches-pop" onClick={(e) => e.stopPropagation()}>
								{palette.map((p) => (
									<button
										key={p[0]}
										className="swatch"
										style={{ background: p[0] }}
										onClick={() => { if (typeof onUpdate === 'function') onUpdate(_id, { color: p[0] }); setShowSwatches(false); }}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</article>
	);
}
