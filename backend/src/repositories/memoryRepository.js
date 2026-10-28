// Repositorio en memoria: usado en pruebas y como modo de demo sin base de datos.
class MemoryRepository {
  constructor() {
    this.technicians = [
      { id: 1, name: 'Ana Torres' },
      { id: 2, name: 'Luis Pérez' },
      { id: 3, name: 'María Gómez' },
    ];
    this.incidents = [];
    this.comments = [];
    this.seq = { incident: 1, comment: 1 };
  }

  async listTechnicians() {
    return [...this.technicians];
  }

  async getTechnician(id) {
    return this.technicians.find((t) => t.id === id) || null;
  }

  _view(incident) {
    const tech = this.technicians.find((t) => t.id === incident.technicianId);
    return { ...incident, technicianName: tech ? tech.name : null };
  }

  async createIncident(data) {
    const now = new Date().toISOString();
    const incident = {
      id: this.seq.incident++,
      ...data,
      technicianId: null,
      createdAt: now,
      updatedAt: now,
    };
    this.incidents.push(incident);
    return this._view(incident);
  }

  async listIncidents(filters = {}) {
    return this.incidents
      .filter((i) => !filters.status || i.status === filters.status)
      .filter((i) => !filters.priority || i.priority === filters.priority)
      .filter((i) => !filters.category || i.category === filters.category)
      .filter((i) => !filters.technicianId || i.technicianId === filters.technicianId)
      .map((i) => this._view(i))
      .sort((a, b) => b.id - a.id);
  }

  async getIncident(id) {
    const incident = this.incidents.find((i) => i.id === id);
    return incident ? this._view(incident) : null;
  }

  async updateIncident(id, { status, technicianId }) {
    const incident = this.incidents.find((i) => i.id === id);
    if (!incident) return null;
    if (status !== undefined) incident.status = status;
    if (technicianId !== undefined) incident.technicianId = technicianId;
    incident.updatedAt = new Date().toISOString();
    return this._view(incident);
  }

  async addComment(incidentId, author, text, type = 'COMENTARIO') {
    const comment = {
      id: this.seq.comment++,
      incidentId,
      author,
      text,
      type,
      createdAt: new Date().toISOString(),
    };
    this.comments.push(comment);
    return comment;
  }

  async listComments(incidentId) {
    return this.comments.filter((c) => c.incidentId === incidentId);
  }
}

module.exports = { MemoryRepository };
