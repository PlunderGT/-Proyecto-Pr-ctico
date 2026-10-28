const config = require('./config');
const { createApp } = require('./app');
const { IncidentService } = require('./services/incidentService');
const { MemoryRepository } = require('./repositories/memoryRepository');
const { PgRepository } = require('./repositories/pgRepository');

let repo;
if (config.databaseUrl) {
  repo = new PgRepository(config.databaseUrl);
  console.log('Persistencia: PostgreSQL');
} else {
  repo = new MemoryRepository();
  console.warn('DATABASE_URL no definida: usando repositorio EN MEMORIA (solo demo).');
}

const app = createApp(new IncidentService(repo));
app.listen(config.port, () => console.log(`IT Incident Hub API escuchando en el puerto ${config.port}`));
