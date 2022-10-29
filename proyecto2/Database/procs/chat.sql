USE proyecto2;

-- Obtener modo bot de usuario
DROP PROCEDURE get_modo_bot;
CREATE PROCEDURE get_modo_bot (
	p_id_usuario INT
)
BEGIN
	SELECT modo_bot FROM usuarios WHERE id = p_id_usuario;
END;
CALL get_modo_bot(1);



-- Activar o desactivar modo bot en usuario
DROP PROCEDURE set_modo_bot;
CREATE PROCEDURE set_modo_bot (
	p_id_usuario INT,
	p_modo_bot INT
)
BEGIN
	UPDATE usuarios 
	SET modo_bot = p_modo_bot
	WHERE id = p_id_usuario;
END;
CALL set_modo_bot(4, 0);


-- Obtener id de usuario
DROP PROCEDURE id_usuario;
CREATE PROCEDURE id_usuario (
	p_usuario VARCHAR(250)
)
BEGIN
	SELECT
	u.id AS id_usuario
	FROM usuarios u
	WHERE u.usuario = p_usuario;
END;
CALL id_usuario('serga');



-- Obtener amigos
DROP PROCEDURE amigos;
CREATE PROCEDURE amigos (
	p_id_usuario INT
)
BEGIN
	SELECT 
	amigo.id AS id_usuario,
	usuario
	FROM usuarios amigo
	WHERE id <> p_id_usuario AND 
	EXISTS (
		SELECT * 
		FROM amistad am 
		WHERE ( 
			am.usuario1 = p_id_usuario AND 
			am.usuario2 = amigo.id AND 
			am.estado = 1
		)
	) OR EXISTS (
		SELECT * 
		FROM amistad am 
		WHERE (
			am.usuario2 = p_id_usuario AND 
			am.usuario1 = amigo.id AND 
			am.estado = 1
		)
	);
END;
CALL amigos(1);


-- Almacena un mensaje en una conversasion de 2 personas
DROP PROCEDURE almacenar_mensaje;
CREATE PROCEDURE almacenar_mensaje (
	p_contenido VARCHAR(500),
	p_id_usuario INT,
	p_id_amigo INT
)
BEGIN
	INSERT INTO mensaje 
	(contenido, fecha, id_usuario, id_amigo)
	VALUES (p_contenido, NOW(), p_id_usuario, p_id_amigo);
END;
CALL almacenar_mensaje('hola x2', 1, 2);



-- Obtener mensajes de conversasion
DROP PROCEDURE mensajes;
CREATE PROCEDURE mensajes (
	p_id_usuario INT,
	p_id_amigo INT
)
BEGIN
	SELECT *
	FROM mensaje m
	WHERE (
		(m.id_usuario = p_id_usuario AND m.id_amigo = p_id_amigo) OR 
		(m.id_amigo = p_id_usuario AND m.id_usuario = p_id_amigo)
	)
	ORDER BY m.fecha;
END;
CALL mensajes(1, 2);


SELECT * FROM usuarios u 
SELECT * FROM amistad a 
SELECT * FROM mensaje m 
DELETE FROM mensaje 

INSERT INTO amistad (usuario1, usuario2, estado)
VALUES (1,4,1)

INSERT INTO mensaje (contenido, fecha, id_usuario, id_amigo)
VALUES ('hola', NOW(), 1, 4);

INSERT INTO mensaje (contenido, fecha, id_usuario, id_amigo)
VALUES ('hola', NOW(), 4, 1);
