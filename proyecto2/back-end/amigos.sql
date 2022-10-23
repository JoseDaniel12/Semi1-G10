USE proyecto2;

SELECT * FROM usuarios;

INSERT INTO usuarios(sub_cognito, nombre, usuario, contraseña, correo, ext_foto, modo_bot)
VALUES("anonimo1", "william1", "william1", "1234", "wiliamborrayo1@gmail.com", "png", 1);

CREATE TABLE amistad (
	id_amistad INT PRIMARY KEY AUTO_INCREMENT,
	usuario1 INT,
	usuario2 INT,
	estado BOOL DEFAULT FALSE, -- 0 pendiente, 1 aceptada
	FOREIGN KEY (usuario1) REFERENCES usuarios(id) ON DELETE CASCADE,
	FOREIGN KEY (usuario2) REFERENCES usuarios(id) ON DELETE CASCADE 
);

INSERT INTO amistad(usuario1, usuario2, estado) VALUES(1,2,FALSE);

SELECT * FROM amistad;

DELETE FROM amistad WHERE id_amistad = 1;


-- para obtener no amigos
SELECT * FROM usuarios us1
WHERE id <> 1
AND NOT EXISTS (
	SELECT * FROM amistad am WHERE am.usuario1 = 1 AND am.usuario2 = us1.id
) AND NOT EXISTS (
	SELECT * FROM amistad am WHERE am.usuario2 = 1 AND am.usuario1 = us1.id
)

-- para obtener solicitudes recibidas
SELECT * FROM usuarios us1
WHERE id <> 1
AND EXISTS (
	SELECT * FROM amistad am WHERE am.usuario2 = 1 AND am.usuario1 = us1.id AND am.estado = 0
)

-- para obtener solicitudes enviadas
SELECT * FROM usuarios us1
WHERE id <> 1
AND EXISTS (
	SELECT * FROM amistad am WHERE am.usuario1 = 1 AND am.usuario2 = us1.id AND am.estado = 0
)


-- para obtener amigos
SELECT * FROM usuarios us1
WHERE id <> 1
AND EXISTS (
	SELECT * FROM amistad am WHERE am.usuario1 = 1 AND am.usuario2 = us1.id AND am.estado = 1
) OR EXISTS (
	SELECT * FROM amistad am WHERE am.usuario2 = 1 AND am.usuario1 = us1.id AND am.estado = 1
)

