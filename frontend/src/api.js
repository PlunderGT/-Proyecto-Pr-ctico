async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error((data && data.error) || `Error ${res.status}`);
  return data;
}

const body = (payload) => ({ body: JSON.stringify(payload) });

export const api = {
  technicians: () => request('/technicians'),
  dashboard: () => request('/dashboard'),
  listIncidents: (filters = {}) => {
    const query = new URLSearchParams(Object.entries(filters).filter(([, v]) => v)).toString();
    return request(`/incidents${query ? `?${query}` : ''}`);
  },
  getIncident: (id) => request(`/incidents/${id}`),
  createIncident: (data) => request('/incidents', { method: 'POST', ...body(data) }),
  assign: (id, technicianId, actor) => request(`/incidents/${id}/assign`, { method: 'PATCH', ...body({ technicianId, actor }) }),
  changeStatus: (id, status, actor) => request(`/incidents/${id}/status`, { method: 'PATCH', ...body({ status, actor }) }),
  addComment: (id, author, text) => request(`/incidents/${id}/comments`, { method: 'POST', ...body({ author, text }) }),
};
