const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

function uploadToCloudinary(fileBuffer) {
	return new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream((error, result) => {
			if (error) return reject(error);
			return resolve({ secure_url: result.secure_url, public_id: result.public_id });
		});

		streamifier.createReadStream(fileBuffer).pipe(uploadStream);
	});
}

module.exports = { uploadToCloudinary };
