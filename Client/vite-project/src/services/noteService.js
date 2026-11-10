import api from './api';

export async function createNote(formData) {
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: token ? `Bearer ${token}` : undefined,
  };


  const response = await api.post('/notes', formData, { headers });
  return response.data;
}

export async function getNotes(view = 'notes') {
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: token ? `Bearer ${token}` : undefined,
  };

  const response = await api.get(`/notes?view=${encodeURIComponent(view)}`, { headers });
  return response.data;
}

export async function updateNote(id, updates) {
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: token ? `Bearer ${token}` : undefined,
  };

  const response = await api.put(`/notes/${id}`, updates, { headers });
  return response.data;
}

export async function deleteNote(id) {
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: token ? `Bearer ${token}` : undefined,
  };

  const response = await api.delete(`/notes/${id}`, { headers });
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

export default { createNote, getNotes, updateNote, deleteNote };

