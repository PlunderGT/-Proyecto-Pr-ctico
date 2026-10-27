<<<<<<< HEAD
<<<<<<< HEAD
# IT Incident Hub

Aplicación web para registrar, asignar y dar seguimiento a incidentes de TI, construida como proyecto integrador DevOps (Azure Boards → Git → PR → CI → Artefacto → Release).

## Requisitos
- Node.js 20 o superior y npm
- Git
- Docker Desktop (opcional, para PostgreSQL / ejecución completa)

## Ejecución rápida (sin base de datos, modo demo en memoria)
```bash
# Terminal 1 - API
cd backend && npm install && npm start        # http://localhost:3000

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev     # http://localhost:5173
```

## Ejecución completa con PostgreSQL (Docker)
```bash
cp .env.example .env        # edita DB_PASSWORD
docker compose up --build   # App: http://localhost:8080  |  API: http://localhost:3000
```
En PowerShell usa `Copy-Item .env.example .env`.

## API con PostgreSQL sin Docker del backend
Define `DATABASE_URL=postgres://usuario:clave@localhost:5432/incidenthub` (los scripts de `database/` crean el esquema).

## Pruebas y calidad
```bash
cd backend
npm run lint
npm test                    # genera coverage/ y junit.xml
node ../devops/scripts/smoke-test.js
```

## Estructura
```
incident-hub/
  backend/    API REST (Express)        frontend/   React + Vite
  database/   Esquema y datos semilla   tests/      Pruebas de integración
  devops/     Scripts, backlog CSV, guía de agente
  docs/       Arquitectura, branching, deuda técnica, seguridad, dependencias, release
  .github/workflows/  GitHub Actions    azure-pipelines.yml  Azure Pipelines
```

## Documentación
[Arquitectura](docs/architecture.md) · [API](docs/api.md) · [Ramas](docs/branching.md) · [Deuda técnica](docs/technical-debt.md) · [Seguridad](docs/security.md) · [Dependencias](docs/dependencies.md) · [Estrategia de release](docs/release-strategy.md) · [Backlog](docs/backlog.md) · [Guía paso a paso](docs/guia-paso-a-paso.md)

## Equipo y responsables
| Usuario | Rol | Responsabilidad |
|---|---|---|
| José (cuenta principal) | Desarrollador / Product Owner | Backend, planificación, release |
| (usuario 2) | Desarrollador / Revisor | Frontend, code review de PR de backend |
| (usuario 3) | DevOps / Revisor | Pipelines, seguridad, code review de PR de frontend |

*(Reemplaza por los nombres reales de las cuentas que uses en Azure DevOps.)*

## Versión
Ver [CHANGELOG.md](CHANGELOG.md). Versionado SemVer.
=======
# -Proyecto-Pr-ctico
>>>>>>> 7d4ac18a1383a1b12f4e7e1b865cb79898d05414
=======
# Introduction 
TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project. 

# Getting Started
TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:
1.	Installation process
2.	Software dependencies
3.	Latest releases
4.	API references

# Build and Test
TODO: Describe and show how to build your code and run the tests. 

# Contribute
TODO: Explain how other users and developers can contribute to make your code better. 

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)
>>>>>>> 4f8f42c7ceacadbfdf883a745361d9d792f0a855
