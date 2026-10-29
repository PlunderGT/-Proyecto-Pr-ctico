# Análisis de dependencias

Comandos (ejecutar y pegar el resultado real):
```bash
cd backend  && npm audit && npm outdated
cd frontend && npm audit && npm outdated
```

## Inventario principal
| Paquete | Uso | Componente |
|---|---|---|
| express, cors, pg | API y acceso a datos | backend |
| jest, supertest, jest-junit, eslint | Pruebas y calidad (solo desarrollo) | backend |
| react, react-dom | Interfaz | frontend |
| vite, @vitejs/plugin-react | Build (solo desarrollo) | frontend |

## Registro de vulnerabilidades (completar con la salida de `npm audit`)
| Fecha | Paquete | Versión | Severidad | Tipo (directa/transitiva) | Decisión | Responsable | Work Item |
|---|---|---|---|---|---|---|---|
| | | | | | Actualizar / Mitigar / Aceptar (con justificación) / Reemplazar | | AB#__ |

## Criterios de decisión
- **Critical/High**: corregir antes del release (`npm audit fix` o actualización manual) o justificar por escrito.
- **Moderate**: planificar en el siguiente sprint.
- **Low**: aceptar y registrar.
- Una dependencia solo de desarrollo (no llega al artefacto) reduce el riesgo, pero se documenta igual.
