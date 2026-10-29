# Estrategia de ramas y trazabilidad

## Ramas
- `main`: siempre estable y desplegable. **Protegida**: solo se cambia por Pull Request.
- `feature/<tema>`: funcionalidad nueva (ej. `feature/backend-api`).
- `fix/<tema>`: corrección de errores (ej. `fix/pipeline-test-assertion`).
- `refactor/<tema>`: mejoras internas y deuda técnica (ej. `refactor/dashboard-sql`).
- Etiquetas de versión: `vMAJOR.MINOR.PATCH` sobre `main`.

## Política de `main` (Azure Repos > Branches > main > Branch policies)
- Mínimo 1 revisor (distinto del autor).
- Build validation con `azure-pipelines.yml`.
- Resolución de comentarios obligatoria y vínculo con Work Item obligatorio.

## Commits (Conventional Commits + Work Item)
```
feat(api): agrega filtros de incidentes AB#12
fix(pipeline): corrige ruta de resultados de prueba AB#31
refactor(dashboard): agrega agregación SQL AB#40
docs: documenta estrategia de release AB#44
```
`AB#<ID>` enlaza el commit/PR con el Work Item en Azure Boards.

## Flujo
Task (Azure Boards) → rama `feature/*` → commits con `AB#ID` → Pull Request → revisión → merge a `main` → Pipeline → Artefacto → Release.

## Pull Request
Usar la plantilla (`.github/` y `.azuredevops/`): descripción, `AB#ID`, evidencia de validación y revisor distinto del autor. Merge recomendado: *squash* o *no fast-forward*, conservando la referencia al Work Item.
