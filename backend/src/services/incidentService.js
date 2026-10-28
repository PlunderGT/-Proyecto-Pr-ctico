const { CATEGORIES, PRIORITIES, STATUSES, TRANSITIONS } = require('../config');
const { HttpError } = require('../errors');

const isText = (value, min, max) =>
  typeof value === 'string' && value.trim().length >= min && value.trim().length <= max;

class IncidentService {
  constructor(repo) {
    this.repo = repo;
  }

  async create(input = {}) {
    const errors = [];
    if (!isText(input.title, 5, 120)) errors.push('title debe tener entre 5 y 120 caracteres');
    if (!isText(input.description, 10, 2000)) errors.push('description debe tener entre 10 y 2000 caracteres');
    if (!CATEGORIES.includes(input.category)) errors.push(`category debe ser una de: ${CATEGORIES.join(', ')}`);
    if (!PRIORITIES.includes(input.priority)) errors.push(`priority debe ser una de: ${PRIORITIES.join(', ')}`);
    if (!isText(input.reporter, 2, 100)) errors.push('reporter (usuario) es obligatorio');
    if (errors.length) throw new HttpError(400, errors.join('; '));

    const incident = await this.repo.createIncident({
      title: input.title.trim(),
      description: input.description.trim(),
      category: input.category,
      priority: input.priority,
      reporter: input.reporter.trim(),
      status: 'NUEVO',
    });
    await this.repo.addComment(incident.id, 'sistema', `Incidente creado por ${incident.reporter}`, 'SISTEMA');
    return incident;
  }

  async list(filters = {}) {
    const clean = {};
    if (filters.status) {
      if (!STATUSES.includes(filters.status)) throw new HttpError(400, 'status inválido');
      clean.status = filters.status;
    }
    if (filters.priority) {
      if (!PRIORITIES.includes(filters.priority)) throw new HttpError(400, 'priority inválida');
      clean.priority = filters.priority;
    }
    if (filters.category) {
      if (!CATEGORIES.includes(filters.category)) throw new HttpError(400, 'category inválida');
      clean.category = filters.category;
    }
    if (filters.technicianId) {
      const id = Number(filters.technicianId);
      if (!Number.isInteger(id)) throw new HttpError(400, 'technicianId inválido');
      clean.technicianId = id;
    }
    return this.repo.listIncidents(clean);
  }

  async _require(id) {
    const incident = await this.repo.getIncident(id);
    if (!incident) throw new HttpError(404, `Incidente ${id} no encontrado`);
    return incident;
  }

  async get(id) {
    const incident = await this._require(id);
    const comments = await this.repo.listComments(id);
    return { ...incident, comments };
  }

  async assign(id, technicianId, actor = 'sistema') {
    const incident = await this._require(id);
    if (['RESUELTO', 'CERRADO'].includes(incident.status)) {
      throw new HttpError(409, `No se puede asignar un incidente en estado ${incident.status}`);
    }
    const tech = Number.isInteger(technicianId) ? await this.repo.getTechnician(technicianId) : null;
    if (!tech) throw new HttpError(404, 'Técnico no encontrado');

    const nextStatus = incident.status === 'NUEVO' ? 'ASIGNADO' : undefined;
    const updated = await this.repo.updateIncident(id, { technicianId: tech.id, status: nextStatus });
    await this.repo.addComment(id, actor, `Asignado a ${tech.name}`, 'SISTEMA');
    return updated;
  }

  async changeStatus(id, status, actor = 'sistema') {
    if (!STATUSES.includes(status)) throw new HttpError(400, `status debe ser uno de: ${STATUSES.join(', ')}`);
    const incident = await this._require(id);
    if (!TRANSITIONS[incident.status].includes(status)) {
      throw new HttpError(409, `Transición no permitida: ${incident.status} → ${status}`);
    }
    if (status === 'ASIGNADO' && !incident.technicianId) {
      throw new HttpError(409, 'Asigna un técnico antes de pasar a ASIGNADO');
    }
    const updated = await this.repo.updateIncident(id, { status });
    await this.repo.addComment(id, actor, `Estado: ${incident.status} → ${status}`, 'SISTEMA');
    return updated;
  }

  async addComment(id, author, text) {
    await this._require(id);
    if (!isText(author, 2, 100)) throw new HttpError(400, 'author es obligatorio');
    if (!isText(text, 1, 1000)) throw new HttpError(400, 'text es obligatorio (máx. 1000 caracteres)');
    return this.repo.addComment(id, author.trim(), text.trim());
  }

  async technicians() {
    return this.repo.listTechnicians();
  }

  // DT-01: el dashboard se calcula en memoria de la aplicación (ver docs/technical-debt.md)
  async dashboard() {
    const incidents = await this.repo.listIncidents({});
    const open = incidents.filter((i) => i.status !== 'CERRADO');
    const tally = (items, keyFn) => {
      const map = new Map();
      items.forEach((i) => map.set(keyFn(i), (map.get(keyFn(i)) || 0) + 1));
      return [...map.entries()].map(([name, count]) => ({ name, count }));
    };
    return {
      total: incidents.length,
      abiertos: open.length,
      cerrados: incidents.length - open.length,
      criticos: open.filter((i) => i.priority === 'CRITICA').length,
      porCategoria: tally(incidents, (i) => i.category),
      porTecnico: tally(incidents, (i) => i.technicianName || 'Sin asignar'),
    };
  }
}

module.exports = { IncidentService };
