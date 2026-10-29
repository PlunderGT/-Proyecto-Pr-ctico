# Backlog (Azure Boards)

Importable desde `devops/backlog-import.csv` (Boards > Work items > Import Work Items). Asigna responsables (tus usuarios) y estados después de importar.

- **Epic**: Gestión de incidentes TI — prioridad 1
  - **Feature**: Registro y consulta de incidentes — prioridad 1
    - **User Story**: Registrar un incidente — prioridad 1, SP 3
      - **Task**: Diseñar esquema PostgreSQL y datos semilla — prioridad 1, 3 h
      - **Task**: Implementar POST /api/incidents con validaciones — prioridad 1, 4 h
    - **User Story**: Consultar y filtrar incidentes — prioridad 1, SP 5
      - **Task**: Implementar GET /api/incidents con filtros — prioridad 2, 3 h
      - **Task**: Crear listado y filtros en el frontend React — prioridad 2, 5 h
  - **Feature**: Operación seguimiento e indicadores — prioridad 1
    - **User Story**: Asignar técnico y cambiar estado — prioridad 1, SP 5
      - **Task**: Implementar asignación y máquina de estados — prioridad 1, 5 h
      - **Task**: Crear vista de detalle con acciones de estado — prioridad 2, 4 h
    - **User Story**: Bitácora y dashboard de indicadores — prioridad 2, SP 5
      - **Task**: Implementar comentarios y bitácora automática — prioridad 2, 3 h
      - **Task**: Crear dashboard con indicadores — prioridad 2, 4 h
- **Epic**: Entrega continua DevOps — prioridad 1
  - **Feature**: Pipeline CI y calidad — prioridad 1
    - **User Story**: Pipeline de CI en Azure Pipelines con agente autohospedado — prioridad 1, SP 5
      - **Task**: Registrar agente autohospedado y crear azure-pipelines.yml — prioridad 1, 5 h
      - **Task**: Publicar pruebas cobertura y artefacto — prioridad 2, 3 h
    - **User Story**: Workflow complementario en GitHub Actions — prioridad 2, SP 3
      - **Task**: Crear workflow de PR con lint y pruebas — prioridad 2, 2 h
      - **Task**: Configurar revisión de dependencias — prioridad 2, 2 h
  - **Feature**: Seguridad y release — prioridad 1
    - **User Story**: Gestión de secretos y dependencias — prioridad 1, SP 3
      - **Task**: Configurar Variable Group con secretos protegidos — prioridad 1, 2 h
      - **Task**: Analizar npm audit y documentar decisiones — prioridad 2, 3 h
    - **User Story**: Estrategia de release y versionado hasta v1.0.0 — prioridad 1, SP 5
      - **Task**: Configurar ambientes DEV/QA/PROD con aprobaciones — prioridad 1, 3 h
      - **Task**: Etiquetar versiones SemVer y publicar release v1.0.0 — prioridad 1, 2 h
