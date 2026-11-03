import React, { useEffect } from 'react';
import { Info, Trash2 } from 'lucide-react';
import './ConfirmModal.css';

export default function ConfirmModal({
	isOpen,
	title,
	message,
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	variant = 'default',
	isLoading = false,
	error,
	onConfirm,
	onCancel,
}) {
	useEffect(() => {
		if (!isOpen) return undefined;

		function handleKeyDown(event) {
			if (event.key === 'Escape' && !isLoading) onCancel?.();
		}

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, isLoading, onCancel]);

	if (!isOpen) return null;

	const Icon = variant === 'danger' ? Trash2 : Info;

	return (
		<div
			className="confirm-modal-backdrop"
			onClick={(event) => {
				if (event.target === event.currentTarget && !isLoading) onCancel?.();
			}}
		>
			<section
				className={`confirm-modal confirm-modal-${variant}`}
				role="dialog"
				aria-modal="true"
				aria-labelledby="confirm-modal-title"
				aria-describedby="confirm-modal-message"
			>
				<div className="confirm-modal-icon" aria-hidden="true">
					<Icon size={22} />
				</div>
				<h2 id="confirm-modal-title" className="confirm-modal-title">{title}</h2>
				<p id="confirm-modal-message" className="confirm-modal-message">{message}</p>
				{error && <p className="confirm-modal-error" role="alert">{error}</p>}
				<div className="confirm-modal-buttons">
					<button
						className="confirm-modal-cancel"
						type="button"
						onClick={onCancel}
						disabled={isLoading}
					>
						{cancelLabel}
					</button>
					<button
						className="confirm-modal-confirm"
						type="button"
						onClick={onConfirm}
						disabled={isLoading}
					>
						{isLoading ? 'Please wait...' : confirmLabel}
					</button>
				</div>
			</section>
		</div>
	);
}
