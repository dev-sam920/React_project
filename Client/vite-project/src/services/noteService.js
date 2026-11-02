import api from './api';

export async function createNote(formData) {
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: token ? `Bearer ${token}` : undefined,
  };

  // Let the browser/axios set the Content-Type (with boundary) for multipart/form-data
  const response = await api.post('/notes', formData, { headers });
  return response.data;
}

export async function getNotes() {
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: token ? `Bearer ${token}` : undefined,
  };

  const response = await api.get('/notes', { headers });
  return response.data;
}

export async function uploadImage(file) {
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: token ? `Bearer ${token}` : undefined,
  };

  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/upload', formData, { headers });
  return response.data; // { secure_url, public_id }
}

export default { createNote, getNotes };
// Placeholder: note-related API calls
