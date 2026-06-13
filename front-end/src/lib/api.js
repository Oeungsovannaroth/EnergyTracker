const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const TOKEN_KEY = 'solarops_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function buildHeaders(includeJson = false) {
  const headers = { Accept: 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (includeJson) headers['Content-Type'] = 'application/json';
  return headers;
}

async function parseResponse(response) {
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(payload?.message || 'API request failed');
  }

  return payload?.data ?? payload;
}

export async function fetchApi(path) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: buildHeaders(),
  });
  return parseResponse(response);
}

export async function postApi(path, body) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify(body),
  });
  return parseResponse(response);
}

export async function authApi(method, path, body = null) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    method,
    headers: buildHeaders(body != null),
    ...(body != null ? { body: JSON.stringify(body) } : {}),
  });
  return parseResponse(response);
}

export async function loginApi(email, password) {
  const data = await postApi('/auth/login', { email, password });
  setToken(data.access_token);
  return data;
}

export async function logoutApi() {
  try {
    await authApi('POST', '/auth/logout');
  } finally {
    clearToken();
  }
}

export async function getMeApi() {
  return authApi('GET', '/auth/me');
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${apiBaseUrl}/upload`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload?.message || 'Upload failed');
  }

  return payload.data;
}
