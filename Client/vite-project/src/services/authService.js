import api from './api';

export async function signup({ name, email, password }) {
	try {
		const res = await api.post('/auth/signup', { name, email, password });
		return res.data;
	} catch (err) {
		throw err;
	}
}

export async function login({ email, password }) {
	try {
		const res = await api.post('/auth/login', { email, password });
		return res.data;
	} catch (err) {
		throw err;
	}
}
