const express = require('express');
const { HttpError } = require('../errors');

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const parseId = (value) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new HttpError(400, 'id inválido');
  return id;
};

function buildRouter(service) {
  const router = express.Router();

  router.get('/technicians', wrap(async (_req, res) => res.json(await service.technicians())));
  router.get('/dashboard', wrap(async (_req, res) => res.json(await service.dashboard())));

  router.get('/incidents', wrap(async (req, res) => res.json(await service.list(req.query))));
  router.post('/incidents', wrap(async (req, res) => res.status(201).json(await service.create(req.body))));
  router.get('/incidents/:id', wrap(async (req, res) => res.json(await service.get(parseId(req.params.id)))));

  router.patch('/incidents/:id/assign', wrap(async (req, res) => {
    const { technicianId, actor } = req.body || {};
    res.json(await service.assign(parseId(req.params.id), technicianId, actor));
  }));

  router.patch('/incidents/:id/status', wrap(async (req, res) => {
    const { status, actor } = req.body || {};
    res.json(await service.changeStatus(parseId(req.params.id), status, actor));
  }));

  router.get('/incidents/:id/comments', wrap(async (req, res) => {
    const incident = await service.get(parseId(req.params.id));
    res.json(incident.comments);
  }));

  router.post('/incidents/:id/comments', wrap(async (req, res) => {
    const { author, text } = req.body || {};
    res.status(201).json(await service.addComment(parseId(req.params.id), author, text));
  }));

  return router;
}

module.exports = { buildRouter };
