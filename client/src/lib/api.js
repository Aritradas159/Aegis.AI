// Always same-origin: in production the frontend and API share one Vercel
// domain, and in dev the Vite proxy (see vite.config.js) forwards /api to
// the local server. No VITE_API_URL / separate backend URL needed.
export async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed.');
  return data;
}
