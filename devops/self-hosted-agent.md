# Agente autohospedado (self-hosted agent)

1. Azure DevOps > **Organization settings > Pipelines > Agent pools > Add pool** (tipo *Self-hosted*) o usa el pool `Default`.
2. Crea un **PAT**: User settings > Personal access tokens > New token, alcance *Agent Pools (Read & manage)*, caducidad corta. **No lo guardes en el repo.**
3. En el pool: **New agent** > descarga el zip para tu sistema operativo.
4. Windows (PowerShell):
   ```powershell
   mkdir C:\agent; cd C:\agent
   Expand-Archive ~\Downloads\vsts-agent-win-x64-*.zip .
   .\config.cmd      # URL de la organización, PAT, pool, nombre del agente
   .\run.cmd         # ejecutar en primer plano (o instalar como servicio cuando pregunte)
   ```
   Linux/macOS: `./config.sh` y `./run.sh`.
5. Requisitos en el equipo del agente: Git y acceso a internet (la tarea `NodeTool@0` descarga Node 20). Docker es opcional.
6. Verifica en el pool que el agente aparece **Online**. El `azure-pipelines.yml` ya usa `pool: name: Default`; cambia el nombre si creaste otro pool.
7. Evidencia: captura del agente Online y del run mostrando el nombre del agente en "Job > Agent".
