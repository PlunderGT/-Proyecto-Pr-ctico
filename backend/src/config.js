const CATEGORIES = ['HARDWARE', 'SOFTWARE', 'RED', 'ACCESO', 'OTRO'];
const PRIORITIES = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'];
const STATUSES = ['NUEVO', 'ASIGNADO', 'EN_PROCESO', 'RESUELTO', 'CERRADO'];

// Transiciones permitidas del ciclo de vida de un incidente
const TRANSITIONS = {
  NUEVO: ['ASIGNADO'],
  ASIGNADO: ['EN_PROCESO'],
  EN_PROCESO: ['RESUELTO'],
  RESUELTO: ['CERRADO', 'EN_PROCESO'],
  CERRADO: [],
};

module.exports = {
  CATEGORIES,
  PRIORITIES,
  STATUSES,
  TRANSITIONS,
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL || '',
};
