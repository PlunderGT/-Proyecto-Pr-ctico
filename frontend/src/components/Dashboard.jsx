import { useEffect, useState } from 'react';
import { api } from '../api.js';

function Bars({ title, items }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <section className="card">
      <h3>{title}</h3>
      {items.length === 0 && <p className="muted">Sin datos</p>}
      {items.map((item) => (
        <div className="bar-row" key={item.name}>
          <span>{item.name}</span>
          <div className="bar"><div style={{ width: `${(item.count / max) * 100}%` }} /></div>
          <strong>{item.count}</strong>
        </div>
      ))}
    </section>
  );
}

export default function Dashboard({ refreshKey }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.dashboard().then(setData).catch((e) => setError(e.message));
  }, [refreshKey]);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p>Cargando…</p>;

  return (
    <>
      <section className="hero">
        <div>
          <h2>Panel de control</h2>
          <p>Resumen en tiempo real de los incidentes de TI: qué está abierto, qué es crítico y quién tiene la carga.</p>
        </div>
        <img src="/assets/personajes.png" alt="Personajes de la aplicación" />
      </section>
      <div className="kpis">
        <div className="kpi"><span>Abiertos</span><strong>{data.abiertos}</strong></div>
        <div className="kpi"><span>Cerrados</span><strong>{data.cerrados}</strong></div>
        <div className="kpi critical"><span>Críticos abiertos</span><strong>{data.criticos}</strong></div>
        <div className="kpi"><span>Total</span><strong>{data.total}</strong></div>
      </div>
      <div className="grid-2">
        <Bars title="Por categoría" items={data.porCategoria} />
        <Bars title="Por técnico" items={data.porTecnico} />
      </div>
    </>
  );
}
