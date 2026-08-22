const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) return null; // DELETE returns no body

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  return data;
}

export const authApi = {
  register: (email, password) => request('/auth/register', { method: 'POST', body: { email, password } }),
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
};

export const applicationsApi = {
  list: (token, status) => request(`/applications${status ? `?status=${status}` : ''}`, { token }),
  stats: (token) => request('/applications/stats', { token }),
  create: (token, application) => request('/applications', { method: 'POST', body: application, token }),
  update: (token, id, application) => request(`/applications/${id}`, { method: 'PUT', body: application, token }),
  remove: (token, id) => request(`/applications/${id}`, { method: 'DELETE', token }),
};
