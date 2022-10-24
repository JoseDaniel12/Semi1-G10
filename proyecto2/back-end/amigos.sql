USE proyecto2;

SELECT * FROM usuarios;

CREATE TABLE amistad (
	id_amistad INT PRIMARY KEY AUTO_INCREMENT,
	usuario1 INT,
	usuario2 INT,
	estado BOOL DEFAULT FALSE, -- 0 pendiente, 1 aceptada
	FOREIGN KEY (usuario1) REFERENCES usuarios(id) ON DELETE CASCADE,
	FOREIGN KEY (usuario2) REFERENCES usuarios(id) ON DELETE CASCADE 
);



SELECT * FROM amistad;

DELETE FROM amistad WHERE id_amistad = 1;
DELETE FROM usuarios WHERE id > 1;

-- para obtener no amigos
SELECT * FROM usuarios us1
WHERE id <> 1
AND NOT EXISTS (
	SELECT * FROM amistad am WHERE am.usuario1 = 1 AND am.usuario2 = us1.id
) AND NOT EXISTS (
	SELECT * FROM amistad am WHERE am.usuario2 = 1 AND am.usuario1 = us1.id
);

-- para obtener solicitudes enviadas
SELECT * FROM usuarios us1
WHERE id <> 1
AND EXISTS (
	SELECT * FROM amistad am WHERE am.usuario1 = 1 AND am.usuario2 = us1.id AND am.estado = 0
);

-- para obtener solicitudes recibidas
SELECT * FROM usuarios us1
WHERE id <> 7
AND EXISTS (
	SELECT * FROM amistad am WHERE am.usuario2 = 7 AND am.usuario1 = us1.id AND am.estado = 0
);

-- para obtener amigos
SELECT * FROM usuarios us1
WHERE id <> 4
AND EXISTS (
	SELECT * FROM amistad am WHERE am.usuario1 = 4 AND am.usuario2 = us1.id AND am.estado = 1
)OR EXISTS (
	SELECT * FROM amistad am WHERE am.usuario2 = 4 AND am.usuario1 = us1.id AND am.estado = 1
);

-- enviar solicitud: usuario1 = remitente, usuario2 = receptor
INSERT INTO amistad(usuario1, usuario2, estado) VALUES(1,4,FALSE);

-- aceptar solicitud: usuario1 = remitente, usuario2 = receptor
UPDATE amistad SET estado = 1 WHERE(usuario1 = 4 AND usuario2 = 1) OR (usuario1 = 1 AND usuario2 = 4);

-- rechazar solicitud o eliminar amistad
DELETE FROM amistad WHERE(usuario1 = 4 AND usuario2 = 1) OR (usuario1 = 1 AND usuario2 = 4);

SELECT id FROM usuarios WHERE correo='mjeffryemanuel@gmail.com' AND usuario='jmengt';
SELECT * FROM usuarios;

UPDATE amistad SET estado = 0;
SELECT * FROM amistad;


