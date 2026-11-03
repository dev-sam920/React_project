import React, { useEffect, useRef, useState } from 'react';
import './NoteEditModal.css';

const palette = [
	['#FFF8F1', 'cream'],
	['#C1673D', 'terracotta'],
	['#6B7A4F', 'olive'],
	['#F0DFAF', 'mustard'],
	['#8FA8A3', 'dusty teal'],
	['#D9A5A0', 'faded rose'],
];

export default function NoteEditModal({ note, onClose, onSave }) {
	const [title, setTitle] = useState(note.title || '');
	const [body, setBody] = useState(note.body || '');
	const [color, setColor] = useState(note.color || '#FFF8F1');
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState('');
	const bodyRef = useRef(null);

	useEffect(() => {
		function handleKeyDown(event) {
			if (event.key === 'Escape' && !isSaving) onClose();
		}

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isSaving, onClose]);

	useEffect(() => {
		if (!bodyRef.current) return;
		bodyRef.current.style.height = 'auto';
		bodyRef.current.style.height = `${bodyRef.current.scrollHeight}px`;
	}, [body]);

	async function handleSave() {
		if (isSaving) return;
		setIsSaving(true);
		setError('');
		try {
			await onSave(note._id, { title, body, color });
			onClose();
		} catch (saveError) {
			console.error('Failed to save note', saveError);
			setError(saveError.response?.data?.message || saveError.message || 'Failed to save note. Please try again.');
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<div
			className="note-edit-backdrop"
			onClick={(event) => {
				if (event.target === event.currentTarget && !isSaving) onClose();
			}}
		>
			<section
				className="note-edit-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="note-edit-title"
				style={{ backgroundColor: color }}
			>
				{note.imageUrl && (
					<div className="note-edit-image">
						<img src={note.imageUrl} alt="note" />
					</div>
				)}
				<div className="note-edit-fields">
					<input
						id="note-edit-title"
						className="note-edit-title"
						type="text"
						value={title}
						onChange={(event) => setTitle(event.target.value)}
						placeholder="Title"
					/>
					<textarea
						ref={bodyRef}
						className="note-edit-body"
						value={body}
						onChange={(event) => setBody(event.target.value)}
						placeholder="Note"
					/>
				</div>
				{error && <p className="note-edit-error" role="alert">{error}</p>}
				<div className="note-edit-footer">
					<div className="note-edit-swatches" aria-label="Note color">
						{palette.map(([swatchColor, name]) => (
							<button
								key={swatchColor}
								className={`note-edit-swatch${color === swatchColor ? ' is-selected' : ''}`}
								type="button"
								title={name}
								aria-label={`Set color to ${name}`}
								aria-pressed={color === swatchColor}
								style={{ backgroundColor: swatchColor }}
								onClick={() => setColor(swatchColor)}
							/>
						))}
					</div>
					<div className="note-edit-buttons">
						<button className="note-edit-cancel" type="button" onClick={onClose} disabled={isSaving}>
							Cancel
						</button>
						<button className="note-edit-save" type="button" onClick={handleSave} disabled={isSaving}>
							{isSaving ? 'Saving...' : 'Save'}
						</button>
					</div>
				</div>
			</section>
		</div>
	);
}
