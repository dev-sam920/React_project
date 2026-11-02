const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) return res.status(400).json({ message: 'No file provided' });
    const result = await uploadToCloudinary(req.file.buffer);
    return res.json({ secure_url: result.secure_url, public_id: result.public_id });
  } catch (err) {
    console.error('upload error', err);
    return res.status(500).json({ message: 'Upload failed' });
  }
});

module.exports = router;
