const Note = require('../models/Note');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');
const cloudinary = require('../config/cloudinary');

exports.createNote = async (req, res) => {
	try {
		console.log('createNote req.body:', req.body);
		const { title = '', body = '', color = '#FFF8F1', imageUrl: bodyImageUrl = null, imagePublicId: bodyImagePublicId = null } = req.body;
		let imageUrl = null;
		let imagePublicId = null;

		if (req.file && req.file.buffer) { 
			const result = await uploadToCloudinary(req.file.buffer);
			imageUrl = result.secure_url;
			imagePublicId = result.public_id;
		}

		 
		if (!imageUrl && bodyImageUrl) imageUrl = bodyImageUrl;
		if (!imagePublicId && bodyImagePublicId) imagePublicId = bodyImagePublicId;

		const note = await Note.create({
			user: req.user.id,
			title,
			body,
			color,
			imageUrl,
			imagePublicId,
		});

		console.log('created note:', note);

		return res.status(201).json(note);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.getNotes = async (req, res) => {
	try {
		const view = req.query.view;
		const viewFilter = view === 'archive'
			? { archived: true, trashed: false }
			: view === 'bin'
				? { trashed: true }
				: { archived: false, trashed: false };
		const notes = await Note.find({ user: req.user.id, ...viewFilter }).sort({ createdAt: -1 });
		return res.json(notes);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.updateNote = async (req, res) => {
	try {
		const { id } = req.params;
		const note = await Note.findOne({ _id: id, user: req.user.id });
		if (!note) return res.status(404).json({ message: 'Note not found' });

		const updatable = ['title', 'body', 'color', 'archived', 'trashed'];
		updatable.forEach((key) => {
			if (Object.prototype.hasOwnProperty.call(req.body, key)) note[key] = req.body[key];
		});

		await note.save();
		return res.json(note);
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
};

exports.deleteNote = async (req, res) => {
	try {
		const { id } = req.params;
		const note = await Note.findOne({ _id: id, user: req.user.id });
		if (!note) return res.status(404).json({ message: 'Note not found' });

		if (note.imagePublicId) {
			try {
				await cloudinary.uploader.destroy(note.imagePublicId);
			} catch (err) {
				console.error('Failed to delete image from Cloudinary', err);
			}
		}

		await Note.deleteOne({ _id: req.params.id, user: req.user.id });
		return res.json({ message: 'Note deleted' });
	} catch (err) {
		console.error(err);
		return res.status(500).json({ message: 'Server error' });
	}
};
