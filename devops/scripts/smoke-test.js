// Prueba de humo: levanta la API en memoria en un puerto libre y valida los endpoints clave.
// Uso (desde la raíz del repo, con backend/node_modules instalado): node devops/scripts/smoke-test.js
const { createApp } = require('../../backend/src/app');
const { IncidentService } = require('../../backend/src/services/incidentService');
const { MemoryRepository } = require('../../backend/src/repositories/memoryRepository');

async function main() {
  const server = createApp(new IncidentService(new MemoryRepository())).listen(0);
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const health = await fetch(`${base}/health`);
    if (health.status !== 200) throw new Error(`/health devolvió ${health.status}`);

    const created = await fetch(`${base}/api/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Prueba de humo',
        description: 'Incidente creado por el smoke test del pipeline.',
        category: 'OTRO',
        priority: 'BAJA',
        reporter: 'pipeline',
      }),
    });
    if (created.status !== 201) throw new Error(`POST /api/incidents devolvió ${created.status}`);

    const dash = await (await fetch(`${base}/api/dashboard`)).json();
    if (dash.total !== 1) throw new Error('El dashboard no refleja el incidente creado');
    console.log('SMOKE TEST OK');
  } finally {
    server.close();
  }
}

main().catch((err) => {
  console.error('SMOKE TEST FALLÓ:', err.message);
  process.exit(1);
});
