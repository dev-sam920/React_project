import React, { useState } from 'react';
import { Archive, Edit3, Palette, RotateCcw, Trash2 } from 'lucide-react';
import './NoteCard.css';

const palette = [
	['#FFF8F1', 'cream'],
	['#C1673D', 'terracotta'],
	['#6B7A4F', 'olive'],
	['#F0DFAF', 'mustard'],
	['#8FA8A3', 'dusty teal'],
	['#D9A5A0', 'faded rose'],
];

export default function NoteCard({
	note,
	view = 'notes',
	onEdit,
	onDelete,
	onArchive,
	onUnarchive,
	onRestore,
	onDeleteForever,
	onColorChange,
}) {
	const [showSwatches, setShowSwatches] = useState(false);
	const { _id, title, body, color, imageUrl } = note;

	return (
		<article
			className="note-card"
			style={{ backgroundColor: color || '#FFF8F1', border: color ? 'none' : undefined }}
		>
			{imageUrl && (
				<div className="note-image">
					<img src={imageUrl} alt="note" />
				</div>
			)}

			<div
				className="note-content"
				onClick={() => {
					if (view !== 'bin' && typeof onEdit === 'function') onEdit(note);
				}}
				role={view !== 'bin' ? 'button' : undefined}
				tabIndex={view !== 'bin' ? 0 : undefined}
				onKeyDown={(event) => {
					if (view !== 'bin' && (event.key === 'Enter' || event.key === ' ')) {
						event.preventDefault();
						if (typeof onEdit === 'function') onEdit(note);
					}
				}}
			>
				{title && <h3 className="note-title">{title}</h3>}
				{body && <p className="note-body">{body}</p>}
			</div>

			<div className="note-actions" onClick={(event) => event.stopPropagation()}>
				{view !== 'bin' && showSwatches && (
					<div className="swatches-row">
						{palette.map(([swatchColor, name]) => (
							<button
								key={swatchColor}
								className="swatch"
								type="button"
								title={name}
								aria-label={`Change color to ${name}`}
								style={{ backgroundColor: swatchColor }}
								onClick={() => {
									if (typeof onColorChange === 'function') onColorChange(_id, swatchColor);
									setShowSwatches(false);
								}}
							/>
						))}
					</div>
				)}
				<div className="actions-left">
					{view === 'bin' ? (
						<>
							<button className="action-btn" type="button" title="Restore" onClick={() => {
								if (typeof onRestore === 'function') onRestore(note);
							}}>
								<RotateCcw size={18} />
							</button>
							<button className="action-btn" type="button" title="Delete forever" onClick={() => {
								if (typeof onDeleteForever === 'function') onDeleteForever(note);
							}}>
								<Trash2 size={18} />
							</button>
						</>
					) : (
						<>
							<button className="action-btn" type="button" title="Edit" onClick={() => {
								if (typeof onEdit === 'function') onEdit(note);
							}}>
								<Edit3 size={18} />
							</button>
							<button className="action-btn" type="button" title="Delete" onClick={() => {
								if (typeof onDelete === 'function') onDelete(note);
							}}>
								<Trash2 size={18} />
							</button>
							<button className="action-btn" type="button" title={view === 'archive' ? 'Unarchive' : 'Archive'} onClick={() => {
								const handler = view === 'archive' ? onUnarchive : onArchive;
								if (typeof handler === 'function') handler(note);
							}}>
								<Archive size={18} />
							</button>
							<button
								className="action-btn"
								type="button"
								title="Change color"
								onClick={() => setShowSwatches((visible) => !visible)}
							>
								<Palette size={18} />
							</button>
						</>
					)}
				</div>
			</div>
		</article>
	);
}
