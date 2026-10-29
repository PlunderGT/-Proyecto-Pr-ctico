# Registro de deuda técnica

| ID | Deuda | Impacto | Severidad | Estado | Work Item |
|---|---|---|---|---|---|
| DT-01 | El dashboard se calcula en memoria de la aplicación (trae todos los incidentes) | No escala; consultas innecesarias | Media | **A resolver (Semana 2)** | AB#__ |
| DT-02 | CORS abierto a cualquier origen (`cors()` sin configuración) | Riesgo de seguridad | Alta | **A resolver (Semana 2)** | AB#__ |
| DT-03 | Sin autenticación ni roles; el usuario/autor es texto libre | Sin control de acceso ni auditoría real | Alta | Pendiente (post v1.0.0) | AB#__ |
| DT-04 | Listado de incidentes sin paginación | Rendimiento con muchos registros | Media | Pendiente | AB#__ |
| DT-05 | Sin pruebas automatizadas en el frontend y sin pruebas del repositorio PostgreSQL | Cobertura incompleta | Media | Pendiente | AB#__ |
| DT-06 | Esquema SQL sin herramienta de migraciones | Cambios de esquema manuales | Baja | Pendiente | AB#__ |

Mínimo exigido: 5 deudas identificadas y 2 resueltas con trabajo trazable (DT-01 y DT-02).

## Propuesta de solución

### DT-01 — Agregación SQL (rama `refactor/dashboard-sql`)
Agregar a `PgRepository` un método `dashboardStats()` con consultas `GROUP BY`:
```sql
SELECT COUNT(*) AS total,
       COUNT(*) FILTER (WHERE status <> 'CERRADO') AS abiertos,
       COUNT(*) FILTER (WHERE status = 'CERRADO') AS cerrados,
       COUNT(*) FILTER (WHERE status <> 'CERRADO' AND priority = 'CRITICA') AS criticos
FROM incidents;
SELECT category AS name, COUNT(*)::int AS count FROM incidents GROUP BY category;
SELECT COALESCE(t.name,'Sin asignar') AS name, COUNT(*)::int AS count
FROM incidents i LEFT JOIN technicians t ON t.id = i.technician_id GROUP BY 1;
```
Implementar el mismo método en `MemoryRepository` y que `IncidentService.dashboard()` delegue en el repositorio. Las pruebas existentes de dashboard deben seguir pasando.

### DT-02 — CORS restringido (rama `fix/cors-config`)
En `config.js` agregar `corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173'` y en `app.js` usar `app.use(cors({ origin: config.corsOrigin }))`. Documentar `CORS_ORIGIN` en `.env.example` y agregar una prueba que verifique la cabecera `access-control-allow-origin`.
