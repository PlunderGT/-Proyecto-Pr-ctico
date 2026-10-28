const { Pool } = require('pg');

const SELECT_INCIDENT = `
  SELECT i.id, i.title, i.description, i.category, i.priority, i.reporter, i.status,
         i.technician_id AS "technicianId", t.name AS "technicianName",
         i.created_at AS "createdAt", i.updated_at AS "updatedAt"
  FROM incidents i
  LEFT JOIN technicians t ON t.id = i.technician_id`;

const SELECT_COMMENT = `
  SELECT id, incident_id AS "incidentId", author, text, type, created_at AS "createdAt"
  FROM comments`;

class PgRepository {
  constructor(connectionString) {
    this.pool = new Pool({ connectionString });
  }

  async listTechnicians() {
    const { rows } = await this.pool.query('SELECT id, name FROM technicians ORDER BY name');
    return rows;
  }

  async getTechnician(id) {
    const { rows } = await this.pool.query('SELECT id, name FROM technicians WHERE id = $1', [id]);
    return rows[0] || null;
  }

  async createIncident({ title, description, category, priority, reporter, status }) {
    const { rows } = await this.pool.query(
      `INSERT INTO incidents (title, description, category, priority, reporter, status)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [title, description, category, priority, reporter, status]
    );
    return this.getIncident(rows[0].id);
  }

  async listIncidents(filters = {}) {
    const where = [];
    const params = [];
    const add = (column, value) => {
      params.push(value);
      where.push(`${column} = $${params.length}`);
    };
    if (filters.status) add('i.status', filters.status);
    if (filters.priority) add('i.priority', filters.priority);
    if (filters.category) add('i.category', filters.category);
    if (filters.technicianId) add('i.technician_id', filters.technicianId);
    const clause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const { rows } = await this.pool.query(`${SELECT_INCIDENT} ${clause} ORDER BY i.created_at DESC, i.id DESC`, params);
    return rows;
  }

  async getIncident(id) {
    const { rows } = await this.pool.query(`${SELECT_INCIDENT} WHERE i.id = $1`, [id]);
    return rows[0] || null;
  }

  async updateIncident(id, { status, technicianId }) {
    await this.pool.query(
      `UPDATE incidents
         SET status = COALESCE($2, status),
             technician_id = COALESCE($3, technician_id),
             updated_at = NOW()
       WHERE id = $1`,
      [id, status ?? null, technicianId ?? null]
    );
    return this.getIncident(id);
  }

  async addComment(incidentId, author, text, type = 'COMENTARIO') {
    const { rows } = await this.pool.query(
      `INSERT INTO comments (incident_id, author, text, type) VALUES ($1, $2, $3, $4)
       RETURNING id, incident_id AS "incidentId", author, text, type, created_at AS "createdAt"`,
      [incidentId, author, text, type]
    );
    return rows[0];
  }

  async listComments(incidentId) {
    const { rows } = await this.pool.query(`${SELECT_COMMENT} WHERE incident_id = $1 ORDER BY created_at, id`, [incidentId]);
    return rows;
  }
}

module.exports = { PgRepository };
