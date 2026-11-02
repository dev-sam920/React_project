const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
	createNote,
	getNotes,
	updateNote,
	deleteNote,
} = require('../controllers/noteController');

router.post('/', protect, upload.single('image'), createNote);
router.get('/', protect, getNotes);
router.put('/:id', protect, updateNote);
router.delete('/:id', protect, deleteNote);

module.exports = router;
