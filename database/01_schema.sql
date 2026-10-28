-- IT Incident Hub - esquema PostgreSQL
CREATE TABLE IF NOT EXISTS technicians (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS incidents (
  id            SERIAL PRIMARY KEY,
  title         VARCHAR(120) NOT NULL,
  description   TEXT NOT NULL,
  category      VARCHAR(20) NOT NULL CHECK (category IN ('HARDWARE','SOFTWARE','RED','ACCESO','OTRO')),
  priority      VARCHAR(20) NOT NULL CHECK (priority IN ('BAJA','MEDIA','ALTA','CRITICA')),
  reporter      VARCHAR(100) NOT NULL,
  status        VARCHAR(20) NOT NULL DEFAULT 'NUEVO'
                CHECK (status IN ('NUEVO','ASIGNADO','EN_PROCESO','RESUELTO','CERRADO')),
  technician_id INT REFERENCES technicians(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id          SERIAL PRIMARY KEY,
  incident_id INT NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  author      VARCHAR(100) NOT NULL,
  text        TEXT NOT NULL,
  type        VARCHAR(20) NOT NULL DEFAULT 'COMENTARIO' CHECK (type IN ('COMENTARIO','SISTEMA')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incidents_status     ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_priority   ON incidents(priority);
CREATE INDEX IF NOT EXISTS idx_incidents_category   ON incidents(category);
CREATE INDEX IF NOT EXISTS idx_incidents_technician ON incidents(technician_id);
CREATE INDEX IF NOT EXISTS idx_comments_incident    ON comments(incident_id);
