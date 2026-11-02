const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
	try {
		const auth = req.headers.authorization;
		if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authorized' });

		const token = auth.split(' ')[1];
		const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
		req.user = { id: decoded.id };
		return next();
	} catch (err) {
		console.error(err);
		return res.status(401).json({ message: 'Not authorized' });
	}
};
