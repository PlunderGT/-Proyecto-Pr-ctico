# Guía paso a paso (3 semanas)

> Regla de oro: **todo cambio nace de un Task de Azure Boards, va en una rama, con commits `AB#ID`, entra por PR revisado.** Así el historial es real y reconstruible.

## Cuentas y repos
- Crea 2 cuentas adicionales (correos Microsoft/Outlook distintos) y agrégalas al proyecto de Azure DevOps como *Contributor*. Úsalas para **revisar/aprobar PR** y para algunos commits (`git config user.name/email` por repo o `git commit --author="Nombre <correo>"`). Las contribuciones deben ser reales.
- Entregas parciales: crea 3 repos (`incident-hub-s1`, `incident-hub-s2`, `incident-hub-s3`). Trabaja en un repo local y al cerrar cada semana súbelo al repo de esa semana: `git remote add s2 <url>` y `git push s2 --all --tags`. Confirma con tu docente si prefiere repos vacíos por semana.

---
## Preparación (una vez)
1. Descomprime el proyecto y prueba que corre: `README.md` → *Ejecución rápida*. Verifica `npm test` en `backend/`.
2. Azure DevOps: crea la organización y el proyecto **IT-Incident-Hub** (proceso **Agile**, Git).
3. Boards > Work items > **Import Work Items** con `devops/backlog-import.csv` (2 Epics, 4 Features, 8 Stories, 16 Tasks). Revisa la jerarquía, asigna responsables y pasa el sprint 1 al tablero.
4. Crea Iteraciones: Semana 1, 2, 3.

## SEMANA 1 — Planificación + desarrollo
**Repositorio vacío + `main` inicial**
1. `git init` en una carpeta nueva `incident-hub/`; copia **solo**: `README.md`, `.gitignore`, `.env.example`, `CHANGELOG.md`, `docs/` (sin `guia-paso-a-paso.md` si prefieres) y las carpetas vacías con `.gitkeep`. Commit: `chore: estructura inicial AB#<ID de la task>` y `git push -u origin main`.
2. Protege `main`: Repos > Branches > ⋯ > Branch policies: 1 revisor mínimo, vínculo con Work Item obligatorio, resolución de comentarios.

**Ciclo por cada PR** (repite):
```bash
git checkout main && git pull
git checkout -b feature/<tema>
# copia los archivos del grupo, luego:
git add . && git commit -m "feat(<área>): <qué> AB#<ID>"
git push -u origin feature/<tema>
```
Crea el PR en Azure Repos (usa la plantilla), vincula el Work Item, **otra cuenta lo revisa y aprueba** (deja al menos 1 comentario real), pasa la Task a *Done* y haz merge (squash).

**Plan de PR de la Semana 1**
| PR | Rama | Archivos | Task relacionada |
|---|---|---|---|
| 1 | `feature/database-schema` | `database/`, `docker-compose.yml` | Diseñar esquema PostgreSQL |
| 2 | `feature/backend-api` | `backend/` (sin node_modules), `tests/`, `devops/scripts/` | Endpoints, asignación/estados, comentarios |
| 3 | `feature/frontend-ui` | `frontend/` | Listado, detalle, dashboard |
| 4 | `feature/docs-architecture` | resto de `docs/` | Documentación inicial |

Reserva **para la Semana 2**: `azure-pipelines.yml`, `.github/workflows/`, `.github/` y `.azuredevops/` plantillas de PR (estas últimas puedes subirlas ya en el PR 4), `devops/self-hosted-agent.md`.

Cierre S1: tag `v0.1.0` tras el PR 2 y `v0.2.0` tras el PR 3 (`git tag -a v0.2.0 -m "Frontend" && git push origin v0.2.0`). Sube el estado a `incident-hub-s1`.

## SEMANA 2 — CI, calidad y seguridad
1. **Agente autohospedado:** sigue `devops/self-hosted-agent.md`. Evidencia: agente *Online*.
2. **PR 5 `feature/azure-pipeline`:** agrega `azure-pipelines.yml`. Pipelines > New pipeline > Azure Repos Git > Existing YAML. Ejecuta y verifica que corre en tu agente. Agrega Build validation a la política de `main`.
3. **Secretos:** Pipelines > Library > Variable group `incident-hub-secrets`, agrega una variable (ej. `DB_PASSWORD`) con el candado. Descomenta `- group:` en el YAML (PR aparte o dentro del PR 5). No pegues valores reales en capturas.
4. **PR 6 `feature/github-actions`:** agrega `.github/workflows/ci.yml`. Crea el repo espejo en GitHub (`git remote add github <url>`, `git push github --all`) y abre un PR allí para ver el workflow correr.
5. **Fallo controlado (PR 7 `fix/pipeline-test-assertion`):** sigue `docs/pipeline-failure-evidence.md`. Conserva el run fallido, la causa, el commit de corrección y el run exitoso.
6. **Dependencias:** ejecuta `npm audit` en ambos paquetes y completa `docs/dependencies.md` (severidad y decisión). Aplica correcciones si hay HIGH/CRITICAL (`refactor`/`fix` con `AB#`).
7. **Deuda técnica:** crea Work Items (Tipo Task o Issue) para DT-01…DT-06 (completa los `AB#__` de `docs/technical-debt.md`) y **resuelve DT-01 (PR 8 `refactor/dashboard-sql`) y DT-02 (PR 9 `fix/cors-config`)** con la propuesta del documento.
8. Versiones: `v0.3.0` (pipelines), `v0.3.1` (corrección del fallo), `v0.4.0` (deuda + dependencias). Actualiza `CHANGELOG.md`. Sube a `incident-hub-s2`.

## SEMANA 3 — Estabilización y release
1. **Ambientes:** Pipelines > Environments: confirma `incident-hub-dev`, `incident-hub-qa`, `incident-hub-prod` (se crean al correr el pipeline). En `qa` y `prod`: ⋯ > **Approvals and checks** > Approvals y asigna a una cuenta distinta del autor. (PR 10 `feature/release-environments` con los ajustes de YAML y `docs/release-strategy.md`.)
2. Corrige bugs que encuentres con `fix/*` + PR + Work Item. Completa los PR de estabilización y la documentación (`docs/`).
3. Ejecuta el flujo completo con aprobaciones: DEV → QA (checklist de `docs/release-strategy.md`) → PROD. Guarda el artefacto `incident-hub-1.0.0-b<N>.zip`.
4. Sube versiones en `backend/package.json` y `frontend/package.json` (`npm version 1.0.0 --no-git-tag-version`), actualiza `CHANGELOG.md`, PR, merge, `git tag -a v1.0.0 -m "Release 1.0.0"` y `git push origin v1.0.0`. En Pipelines > Releases / GitHub Releases crea las *release notes*.
5. Sube a `incident-hub-s3`. Ensaya `docs/demo-script.md` y `docs/defense-qa.md`.

## Lista de evidencia final
- [ ] Backlog con 2/4/8/16 con responsables, prioridad, estimación y estados
- [ ] ≥ 6 PR reales con descripción, revisión y validación (planeados: 10)
- [ ] Commits con `AB#ID`; ramas `feature/*`, `fix/*`, `refactor/*`
- [ ] Pipeline con checkout, install, build, test, audit, paquete y artefacto
- [ ] Run fallido + diagnóstico + corrección + run exitoso
- [ ] Agente autohospedado usado en los runs
- [ ] Workflow de GitHub Actions ejecutado
- [ ] Secretos en Variable Group; ninguno en el repo
- [ ] 5 deudas registradas y 2 resueltas
- [ ] `docs/dependencies.md` completo
- [ ] Tags v0.1.0 … v1.0.0 y release con aprobaciones
