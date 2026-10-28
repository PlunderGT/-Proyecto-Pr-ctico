-- Datos de ejemplo (solo desarrollo)
INSERT INTO technicians (name) VALUES ('Ana Torres'), ('Luis Pérez'), ('María Gómez')
ON CONFLICT (name) DO NOTHING;

INSERT INTO incidents (title, description, category, priority, reporter, status, technician_id) VALUES
 ('Sin acceso a la VPN', 'Varios usuarios de contabilidad no pueden conectarse a la VPN desde las 8:00.', 'RED', 'CRITICA', 'carlos.ruiz', 'EN_PROCESO', 1),
 ('Impresora del 2.º piso atascada', 'La impresora compartida muestra error de papel atascado.', 'HARDWARE', 'BAJA', 'lucia.mendez', 'NUEVO', NULL),
 ('Licencia de Office expirada', 'El equipo de ventas recibe aviso de licencia vencida.', 'SOFTWARE', 'ALTA', 'pedro.salas', 'ASIGNADO', 2);

INSERT INTO comments (incident_id, author, text, type) VALUES
 (1, 'sistema', 'Incidente creado por carlos.ruiz', 'SISTEMA'),
 (2, 'sistema', 'Incidente creado por lucia.mendez', 'SISTEMA'),
 (3, 'sistema', 'Incidente creado por pedro.salas', 'SISTEMA');
