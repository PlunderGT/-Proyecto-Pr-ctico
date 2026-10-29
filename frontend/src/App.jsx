import { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import IncidentForm from './components/IncidentForm.jsx';
import IncidentList from './components/IncidentList.jsx';
import IncidentDetail from './components/IncidentDetail.jsx';
import { isMuted, setMuted, sounds } from './sound.js';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [selectedId, setSelectedId] = useState(null);
  const [version, setVersion] = useState(0);
  const [muted, setMutedState] = useState(isMuted());
  const refresh = () => setVersion((v) => v + 1);

  const go = (next) => {
    sounds.click();
    setView(next);
  };
  const open = (id) => {
    setSelectedId(id);
    setView('detail');
  };
  const toggleSound = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
    if (!next) sounds.click();
  };

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <img src="/assets/personajes.png" alt="" className="avatar" />
          <div>
            <h1>IT Incident Hub</h1>
            <span className="tagline">Gestión de incidentes de TI</span>
          </div>
        </div>
        <nav>
          <button className={view === 'dashboard' ? 'active' : ''} onClick={() => go('dashboard')}>Dashboard</button>
          <button className={view === 'list' || view === 'detail' ? 'active' : ''} onClick={() => go('list')}>Incidentes</button>
          <button className={view === 'new' ? 'active' : ''} onClick={() => go('new')}>Nuevo incidente</button>
          <button className="icon" onClick={toggleSound} title={muted ? 'Activar sonido' : 'Silenciar'} aria-label="Sonido">
            {muted ? '🔇' : '🔊'}
          </button>
        </nav>
      </header>
      <main>
        {view === 'dashboard' && <Dashboard refreshKey={version} />}
        {view === 'new' && (
          <IncidentForm onCreated={(incident) => { refresh(); open(incident.id); }} />
        )}
        {view === 'list' && <IncidentList refreshKey={version} onSelect={open} />}
        {view === 'detail' && (
          <IncidentDetail id={selectedId} onBack={() => go('list')} onChanged={refresh} />
        )}
      </main>
    </div>
  );
}
