import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { sounds } from '../sound.js';
import { NEXT_STATUS } from '../constants.js';

export default function IncidentDetail({ id, onBack, onChanged }) {
  const [incident, setIncident] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [error, setError] = useState('');
  const [comment, setComment] = useState({ author: '', text: '' });

  const load = () => api.getIncident(id).then(setIncident).catch((e) => setError(e.message));

  useEffect(() => {
    load();
    api.technicians().then(setTechnicians);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const run = async (action, sound = 'click') => {
    setError('');
    try {
      await action();
      await load();
      onChanged();
      sounds[sound]();
    } catch (err) {
      sounds.error();
      setError(err.message);
    }
  };

  if (!incident) return <p>{error || 'Cargando…'}</p>;
  const closed = ['RESUELTO', 'CERRADO'].includes(incident.status);

  return (
    <section className="card">
      <button onClick={onBack}>← Volver</button>
      <h2>#{incident.id} — {incident.title}</h2>
      <p>{incident.description}</p>
      <p className="muted">
        {incident.category} · <span className={`badge p-${incident.priority}`}>{incident.priority}</span> · Reportado por {incident.reporter} · {new Date(incident.createdAt).toLocaleString()}
      </p>
      <p><strong>Estado:</strong> {incident.status} · <strong>Técnico:</strong> {incident.technicianName || 'Sin asignar'}</p>
      {error && <p className="error">{error}</p>}

      <div className="row">
        {!closed && (
          <label>Asignar técnico
            <select value={incident.technicianId || ''} onChange={(e) => run(() => api.assign(id, Number(e.target.value), 'operador'), 'assign')}>
              <option value="" disabled>Selecciona…</option>
              {technicians.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </label>
        )}
        {NEXT_STATUS[incident.status].map((s) => (
          <button key={s} className="primary" onClick={() => run(() => api.changeStatus(id, s, 'operador'), ['RESUELTO', 'CERRADO'].includes(s) ? 'success' : 'status')}>Pasar a {s}</button>
        ))}
      </div>

      <h3>Bitácora</h3>
      <ul className="log">
        {incident.comments.map((c) => (
          <li key={c.id} className={c.type === 'SISTEMA' ? 'system' : ''}>
            <small>{new Date(c.createdAt).toLocaleString()} · {c.author}</small>
            <div>{c.text}</div>
          </li>
        ))}
      </ul>
      <form className="row" onSubmit={(e) => { e.preventDefault(); run(async () => { await api.addComment(id, comment.author, comment.text); setComment({ ...comment, text: '' }); }, 'comment'); }}>
        <input placeholder="Tu usuario" value={comment.author} onChange={(e) => setComment({ ...comment, author: e.target.value })} required />
        <input placeholder="Escribe un comentario" value={comment.text} onChange={(e) => setComment({ ...comment, text: e.target.value })} required style={{ flex: 1 }} />
        <button className="primary">Comentar</button>
      </form>
    </section>
  );
}
