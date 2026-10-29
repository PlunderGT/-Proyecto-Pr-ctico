# Estrategia de release

## Versionado (Semantic Versioning)
`MAJOR.MINOR.PATCH`: MAJOR = cambio incompatible, MINOR = funcionalidad compatible, PATCH = corrección.

| Versión | Contenido | Semana |
|---|---|---|
| v0.1.0 | Base: esquema BD + API de incidentes + pruebas | 1 |
| v0.2.0 | Frontend (listado, formulario, detalle, dashboard) | 1 |
| v0.3.0 | Pipeline CI en Azure + GitHub Actions + agente autohospedado | 2 |
| v0.3.1 | Corrección del fallo controlado del pipeline | 2 |
| v0.4.0 | Resolución de deuda técnica (DT-01, DT-02) y revisión de dependencias | 2 |
| v0.5.0 | Ambientes y aprobaciones de release | 3 |
| v0.9.0 | Release candidate: estabilización y documentación | 3 |
| v1.0.0 | Versión estable | 3 |

Cada versión: actualizar `backend/package.json` y `frontend/package.json` (`npm version <tipo> --no-git-tag-version`), registrar en `CHANGELOG.md`, merge a `main` y crear el tag `vX.Y.Z`.

## Ambientes y controles
| Ambiente | Propósito | Control |
|---|---|---|
| DEV (`incident-hub-dev`) | Integración continua de `main` | Automático si el pipeline pasa |
| QA (`incident-hub-qa`) | Validación funcional | Aprobación manual + checklist |
| PROD (`incident-hub-prod`) | Uso real | Aprobación de persona distinta al autor + build verde |

## Flujo
`main` → Pipeline (Build/Test/Audit/Package) → Artefacto `incident-hub` → DEV → (aprobación) QA → (aprobación) PROD → tag + release notes.

## Checklist de validación en QA
- [ ] Crear incidente, asignar técnico y recorrer los 5 estados
- [ ] Filtros por estado, prioridad, categoría y técnico
- [ ] Bitácora visible y dashboard coherente
- [ ] Pipeline en verde, sin vulnerabilidades HIGH/CRITICAL sin decisión
- [ ] Sin secretos en repo, logs ni capturas

## Rollback
Redesplegar el artefacto de la versión anterior desde Pipelines (cada versión conserva su zip `incident-hub-<versión>-b<build>.zip`) y registrar el incidente con un Work Item `fix`.
