const mongoose = require('mongoose');

const { Schema } = mongoose;

const NoteSchema = new Schema(
	{
		user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
		title: { type: String, default: '' },
		body: { type: String, default: '' },
		color: { type: String, default: '#FFF8F1' },
		imageUrl: { type: String, default: null },
		imagePublicId: { type: String, default: null },
		archived: { type: Boolean, default: false },
		trashed: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Note', NoteSchema);
