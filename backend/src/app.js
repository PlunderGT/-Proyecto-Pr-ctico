const express = require('express');
const cors = require('cors');
const { buildRouter } = require('./routes/incidents');

function createApp(service) {
  const app = express();
  app.use(cors()); // DT-02: CORS abierto (ver docs/technical-debt.md)
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api', buildRouter(service));

  app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
  app.use((err, _req, res, _next) => {
    if (err.status) return res.status(err.status).json({ error: err.message });
    if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'JSON inválido' });
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  });
  return app;
}

module.exports = { createApp };
