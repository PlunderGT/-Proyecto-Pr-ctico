# Fallo controlado de pipeline (plantilla de evidencia)

| Campo | Valor |
|---|---|
| Run fallido (URL) | |
| Paso que falló | |
| Causa raíz | |
| Diagnóstico (logs/pasos) | |
| Corrección (PR + commit, `AB#`) | |
| Run exitoso (URL) | |

## Cómo provocar un fallo real y trazable
**Opción A (recomendada):** en una rama `fix/pipeline-test-assertion`, cambiar temporalmente una aserción en `tests/incidents.test.js` (por ejemplo `expect(res.status).toBe(201)` → `toBe(200)`), subir y dejar que el pipeline falle en el paso de pruebas. Diagnosticar en los logs, corregir en un commit posterior y volver a ejecutar.

**Opción B:** ejecutar el pipeline manualmente con el parámetro `forzarFallo = true` (falla en el paso `[DEMO] Fallo controlado`), y luego ejecutarlo con `false`.

Conserva ambas ejecuciones (fallida y exitosa) sin borrarlas.
