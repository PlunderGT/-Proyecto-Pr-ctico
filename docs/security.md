# Seguridad

## Gestión de secretos
- Ningún secreto se guarda en el repositorio: `.env` está en `.gitignore`; solo se versiona `.env.example` con valores de ejemplo.
- Azure Pipelines: usar un **Variable Group** (`incident-hub-secrets`) con valores marcados como secretos (candado) o Azure Key Vault. Los secretos se pasan a los pasos solo por `env:` explícito.
- GitHub Actions: usar **Repository/Environment secrets** (`${{ secrets.NOMBRE }}`).
- Docker Compose exige `DB_PASSWORD` (falla si no está definido).
- Si un secreto se filtra: revocarlo/rotarlo de inmediato y limpiar el historial; no basta con borrarlo en un commit nuevo.
- Capturas y documentación: ocultar siempre tokens y claves.

## Controles aplicados
| Control | Dónde |
|---|---|
| Validación de entradas | `incidentService.js` |
| Consultas parametrizadas (anti SQL injection) | `pgRepository.js` |
| Restricciones CHECK en la base de datos | `01_schema.sql` |
| Contenedor backend sin root (`USER node`) | `backend/Dockerfile` |
| Revisión de dependencias | `npm audit` en ambos pipelines + Dependency Review |
| Aprobaciones antes de QA/PROD | Environments de Azure DevOps |
| Rama `main` protegida | Branch policies |

## Riesgos conocidos
Ver `docs/technical-debt.md` (DT-02 CORS, DT-03 sin autenticación).

## Token / PAT del agente autohospedado
El PAT usado para registrar el agente solo se escribe en el asistente `config`; no se guarda en archivos del repo. Usar alcance mínimo (*Agent Pools: Read & manage*) y caducidad corta.
