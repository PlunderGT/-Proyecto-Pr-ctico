import { useState } from 'react';
import { api } from '../api.js';
import { sounds } from '../sound.js';
import { CATEGORIES, PRIORITIES } from '../constants.js';

const empty = { title: '', description: '', category: 'SOFTWARE', priority: 'MEDIA', reporter: '' };

export default function IncidentForm({ onCreated }) {
  const [form, setForm] = useState(empty);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const incident = await api.createIncident(form);
      setForm(empty);
      sounds.success();
      onCreated(incident);
    } catch (err) {
      sounds.error();
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="card form" onSubmit={submit}>
      <h2>Nuevo incidente</h2>
      <label>Título<input value={form.title} onChange={set('title')} required minLength={5} maxLength={120} /></label>
      <label>Descripción<textarea value={form.description} onChange={set('description')} required minLength={10} rows={4} /></label>
      <div className="row">
        <label>Categoría
          <select value={form.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
        </label>
        <label>Prioridad
          <select value={form.priority} onChange={set('priority')}>{PRIORITIES.map((p) => <option key={p}>{p}</option>)}</select>
        </label>
        <label>Usuario que reporta<input value={form.reporter} onChange={set('reporter')} required minLength={2} /></label>
      </div>
      {error && <p className="error">{error}</p>}
      <button className="primary" disabled={saving}>{saving ? 'Guardando…' : 'Crear incidente'}</button>
    </form>
  );
}
