# API REST

Base: `http://localhost:3000`

| Método | Ruta | Descripción |
|---|---|---|
| GET | /health | Estado del servicio |
| GET | /api/technicians | Lista de técnicos |
| GET | /api/dashboard | Indicadores: abiertos, cerrados, críticos, por categoría y técnico |
| GET | /api/incidents?status=&priority=&category=&technicianId= | Lista con filtros |
| POST | /api/incidents | Crea incidente `{title, description, category, priority, reporter}` |
| GET | /api/incidents/:id | Detalle con bitácora |
| PATCH | /api/incidents/:id/assign | `{technicianId}` (NUEVO pasa a ASIGNADO) |
| PATCH | /api/incidents/:id/status | `{status}` según transiciones válidas |
| GET/POST | /api/incidents/:id/comments | Bitácora / nuevo comentario `{author, text}` |

Categorías: HARDWARE, SOFTWARE, RED, ACCESO, OTRO. Prioridades: BAJA, MEDIA, ALTA, CRITICA.
Errores: `{ "error": "mensaje" }` con códigos 400 (validación), 404 (no existe), 409 (transición no permitida).

Ejemplo:
```bash
curl -X POST http://localhost:3000/api/incidents -H "Content-Type: application/json" \
  -d '{"title":"VPN caída","description":"Nadie puede conectarse a la VPN","category":"RED","priority":"CRITICA","reporter":"jose"}'
```
