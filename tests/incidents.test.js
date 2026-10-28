const request = require('supertest');
const { createApp } = require('../backend/src/app');
const { IncidentService } = require('../backend/src/services/incidentService');
const { MemoryRepository } = require('../backend/src/repositories/memoryRepository');

const valid = {
  title: 'No funciona el correo',
  description: 'Outlook no sincroniza desde esta mañana en todo el departamento.',
  category: 'SOFTWARE',
  priority: 'ALTA',
  reporter: 'jose',
};

let app;
beforeEach(() => {
  app = createApp(new IncidentService(new MemoryRepository()));
});

const create = (overrides = {}) => request(app).post('/api/incidents').send({ ...valid, ...overrides });

describe('Salud y rutas', () => {
  test('GET /health responde ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  test('ruta desconocida responde 404', async () => {
    const res = await request(app).get('/nada');
    expect(res.status).toBe(404);
  });

  test('JSON inválido responde 400', async () => {
    const res = await request(app).post('/api/incidents').set('Content-Type', 'application/json').send('{malo');
    expect(res.status).toBe(400);
  });
});

describe('Crear y consultar incidentes', () => {
  test('crea un incidente en estado NUEVO', async () => {
    const res = await create();
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, status: 'NUEVO', priority: 'ALTA', reporter: 'jose' });
    expect(res.body.createdAt).toBeDefined();
  });

  test('rechaza datos inválidos con 400', async () => {
    const res = await create({ title: 'x', category: 'MAGIA', priority: 'YA' });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/title/);
    expect(res.body.error).toMatch(/category/);
  });

  test('consulta el detalle con bitácora inicial', async () => {
    await create();
    const res = await request(app).get('/api/incidents/1');
    expect(res.status).toBe(200);
    expect(res.body.comments).toHaveLength(1);
    expect(res.body.comments[0].type).toBe('SISTEMA');
  });

  test('id inexistente responde 404 e id inválido 400', async () => {
    expect((await request(app).get('/api/incidents/99')).status).toBe(404);
    expect((await request(app).get('/api/incidents/abc')).status).toBe(400);
  });
});

describe('Filtros', () => {
  beforeEach(async () => {
    await create({ priority: 'CRITICA', category: 'RED' });
    await create({ priority: 'BAJA', category: 'HARDWARE' });
    await create({ priority: 'BAJA', category: 'RED' });
  });

  test('filtra por prioridad', async () => {
    const res = await request(app).get('/api/incidents?priority=BAJA');
    expect(res.body).toHaveLength(2);
  });

  test('combina categoría y prioridad', async () => {
    const res = await request(app).get('/api/incidents?priority=BAJA&category=RED');
    expect(res.body).toHaveLength(1);
  });

  test('filtra por estado y técnico', async () => {
    await request(app).patch('/api/incidents/1/assign').send({ technicianId: 2 });
    expect((await request(app).get('/api/incidents?status=ASIGNADO')).body).toHaveLength(1);
    expect((await request(app).get('/api/incidents?technicianId=2')).body).toHaveLength(1);
    expect((await request(app).get('/api/incidents?technicianId=3')).body).toHaveLength(0);
  });

  test('filtro inválido responde 400', async () => {
    expect((await request(app).get('/api/incidents?status=XX')).status).toBe(400);
    expect((await request(app).get('/api/incidents?priority=XX')).status).toBe(400);
    expect((await request(app).get('/api/incidents?category=XX')).status).toBe(400);
    expect((await request(app).get('/api/incidents?technicianId=zz')).status).toBe(400);
  });
});

describe('Asignación y ciclo de vida', () => {
  beforeEach(async () => {
    await create();
  });

  test('asignar técnico cambia NUEVO a ASIGNADO', async () => {
    const res = await request(app).patch('/api/incidents/1/assign').send({ technicianId: 1 });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ASIGNADO', technicianId: 1, technicianName: 'Ana Torres' });
  });

  test('técnico inexistente responde 404', async () => {
    const res = await request(app).patch('/api/incidents/1/assign').send({ technicianId: 99 });
    expect(res.status).toBe(404);
  });

  test('no permite saltar estados', async () => {
    const res = await request(app).patch('/api/incidents/1/status').send({ status: 'RESUELTO' });
    expect(res.status).toBe(409);
  });

  test('no permite pasar a ASIGNADO sin técnico', async () => {
    const res = await request(app).patch('/api/incidents/1/status').send({ status: 'ASIGNADO' });
    expect(res.status).toBe(409);
  });

  test('estado inválido responde 400', async () => {
    const res = await request(app).patch('/api/incidents/1/status').send({ status: 'LOCO' });
    expect(res.status).toBe(400);
  });

  test('recorre todo el flujo hasta CERRADO y registra la bitácora', async () => {
    await request(app).patch('/api/incidents/1/assign').send({ technicianId: 1 });
    for (const status of ['EN_PROCESO', 'RESUELTO', 'CERRADO']) {
      const res = await request(app).patch('/api/incidents/1/status').send({ status });
      expect(res.status).toBe(200);
      expect(res.body.status).toBe(status);
    }
    const detail = await request(app).get('/api/incidents/1');
    expect(detail.body.comments.length).toBe(5); // creado + asignado + 3 cambios
    expect((await request(app).patch('/api/incidents/1/status').send({ status: 'EN_PROCESO' })).status).toBe(409);
  });

  test('no se puede asignar un incidente cerrado', async () => {
    await request(app).patch('/api/incidents/1/assign').send({ technicianId: 1 });
    for (const status of ['EN_PROCESO', 'RESUELTO', 'CERRADO']) {
      await request(app).patch('/api/incidents/1/status').send({ status });
    }
    const res = await request(app).patch('/api/incidents/1/assign').send({ technicianId: 2 });
    expect(res.status).toBe(409);
  });

  test('un incidente RESUELTO puede reabrirse a EN_PROCESO', async () => {
    await request(app).patch('/api/incidents/1/assign').send({ technicianId: 1 });
    await request(app).patch('/api/incidents/1/status').send({ status: 'EN_PROCESO' });
    await request(app).patch('/api/incidents/1/status').send({ status: 'RESUELTO' });
    const res = await request(app).patch('/api/incidents/1/status').send({ status: 'EN_PROCESO' });
    expect(res.status).toBe(200);
  });
});

describe('Comentarios', () => {
  beforeEach(async () => {
    await create();
  });

  test('agrega y lista comentarios', async () => {
    const created = await request(app).post('/api/incidents/1/comments').send({ author: 'ana', text: 'Revisando el servidor' });
    expect(created.status).toBe(201);
    const list = await request(app).get('/api/incidents/1/comments');
    expect(list.body.map((c) => c.text)).toContain('Revisando el servidor');
  });

  test('valida autor y texto', async () => {
    expect((await request(app).post('/api/incidents/1/comments').send({ author: '', text: 'hola' })).status).toBe(400);
    expect((await request(app).post('/api/incidents/1/comments').send({ author: 'ana', text: '' })).status).toBe(400);
  });

  test('comentar un incidente inexistente responde 404', async () => {
    const res = await request(app).post('/api/incidents/50/comments').send({ author: 'ana', text: 'hola' });
    expect(res.status).toBe(404);
  });
});

describe('Dashboard y técnicos', () => {
  test('calcula indicadores', async () => {
    await create({ priority: 'CRITICA', category: 'RED' });
    await create({ priority: 'BAJA', category: 'HARDWARE' });
    await request(app).patch('/api/incidents/2/assign').send({ technicianId: 1 });
    for (const status of ['EN_PROCESO', 'RESUELTO', 'CERRADO']) {
      await request(app).patch('/api/incidents/2/status').send({ status });
    }
    const res = await request(app).get('/api/dashboard');
    expect(res.body).toMatchObject({ total: 2, abiertos: 1, cerrados: 1, criticos: 1 });
    expect(res.body.porCategoria).toEqual(expect.arrayContaining([{ name: 'RED', count: 1 }, { name: 'HARDWARE', count: 1 }]));
    expect(res.body.porTecnico).toEqual(expect.arrayContaining([{ name: 'Sin asignar', count: 1 }, { name: 'Ana Torres', count: 1 }]));
  });

  test('lista técnicos', async () => {
    const res = await request(app).get('/api/technicians');
    expect(res.body).toHaveLength(3);
  });
});
