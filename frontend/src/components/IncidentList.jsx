import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { sounds } from '../sound.js';
import { CATEGORIES, PRIORITIES, STATUSES } from '../constants.js';

export default function IncidentList({ refreshKey, onSelect }) {
  const [filters, setFilters] = useState({ status: '', priority: '', category: '', technicianId: '' });
  const [incidents, setIncidents] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.technicians().then(setTechnicians).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    api.listIncidents(filters).then(setIncidents).catch((e) => setError(e.message));
  }, [filters, refreshKey]);

  const set = (key) => (e) => {
    sounds.filter();
    setFilters({ ...filters, [key]: e.target.value });
  };

  return (
    <section className="card">
      <h2>Incidentes</h2>
      <div className="filters">
        <select value={filters.status} onChange={set('status')}><option value="">Estado: todos</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <select value={filters.priority} onChange={set('priority')}><option value="">Prioridad: todas</option>{PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select>
        <select value={filters.category} onChange={set('category')}><option value="">Categoría: todas</option>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        <select value={filters.technicianId} onChange={set('technicianId')}><option value="">Técnico: todos</option>{technicians.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
      </div>
      {error && <p className="error">{error}</p>}
      <table>
        <thead><tr><th>#</th><th>Título</th><th>Categoría</th><th>Prioridad</th><th>Estado</th><th>Técnico</th><th>Fecha</th></tr></thead>
        <tbody>
          {incidents.map((i) => (
            <tr key={i.id} onClick={() => { sounds.click(); onSelect(i.id); }}>
              <td>{i.id}</td><td>{i.title}</td><td>{i.category}</td>
              <td><span className={`badge p-${i.priority}`}>{i.priority}</span></td>
              <td>{i.status}</td><td>{i.technicianName || '—'}</td>
              <td>{new Date(i.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {incidents.length === 0 && <p className="muted">No hay incidentes con esos filtros.</p>}
    </section>
  );
}
