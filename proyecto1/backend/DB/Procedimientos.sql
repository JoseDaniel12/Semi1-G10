#-------------------------------------------
# Procedimiento para registrar usuarios
#-------------------------------------------
DROP PROCEDURE IF EXISTS Registrar;
CREATE PROCEDURE Registrar (
	IN in_usuario VARCHAR(250),
	IN in_correo VARCHAR(250),
	IN in_contrasenia VARCHAR(250),
	IN in_formatoFoto VARCHAR(5)
)
BEGIN
	IF EXISTS (SELECT id FROM usuario WHERE correo = in_correo) THEN
		SELECT 400 AS codigo, 'Correo ya en uso' AS mensaje;
	ELSEIF EXISTS (SELECT id FROM usuario WHERE nombre_usuario = in_usuario) THEN
		SELECT 400 AS codigo, 'Usuario ya en uso' AS mensaje;
	ELSE
		INSERT INTO usuario(nombre_usuario, correo, contrasenia, formatoFoto) 
			VALUES(in_usuario, in_correo, in_contrasenia, in_formatoFoto);
		SELECT 200 AS codigo, 'Se registro usuario' AS mensaje, u.* FROM usuario u WHERE id = (SELECT MAX(id) FROM usuario);
		COMMIT;
	END IF;
END;

CALL Registrar('William2', 'corre45o@gmail.com', '12a34', 'png');
SELECT * FROM usuario;

#-------------------------------------------
# Procedimiento para login
#-------------------------------------------
DROP PROCEDURE IF EXISTS Login;
CREATE PROCEDURE Login (
	IN in_usuario_correo VARCHAR(250)
)
BEGIN
	SELECT * FROM usuario
	WHERE ((correo = in_usuario_correo) OR (nombre_usuario = in_usuario_correo));
END;

CALL Login('William2');
CALL Login('corre45o@gmail.com');
SELECT * FROM usuario;

#---------------------------------------------------------
# Procedimiento para ver todos los archivos de un usuario
#---------------------------------------------------------
DROP PROCEDURE IF EXISTS AllFiles;
CREATE PROCEDURE AllFiles (
	IN in_id_usuario INT
)
BEGIN
	SELECT usuario, s3_key, CAST(visibilidad AS SIGNED) AS visibilidad, 
	DATE_FORMAT(fecha, "%d-%m-%Y %H:%i:%s") as fecha FROM archivo WHERE usuario = in_id_usuario;
END;

CALL AllFiles(2);
CALL AllFiles(1);
SELECT * FROM archivo;

#---------------------------------------------------------
# Procedimiento para ver archivos de amigos
#---------------------------------------------------------
DROP PROCEDURE IF EXISTS ArchivosAmigos;
CREATE PROCEDURE ArchivosAmigos (
	IN in_id_usuario INT
)
BEGIN
	SELECT u.nombre_usuario, ar.usuario, ar.s3_key, CAST(ar.visibilidad AS SIGNED) AS visibilidad, 
	DATE_FORMAT(ar.fecha, "%d-%m-%Y %H:%i:%s") as fecha FROM archivo ar
	INNER JOIN amistad am
	ON ar.usuario = am.usuario2
	INNER JOIN usuario u
	ON ar.usuario = u.id
	WHERE (am.usuario1 = in_id_usuario) AND ar.visibilidad = 1;
END;

CALL ArchivosAmigos(2);
CALL ArchivosAmigos(1);
SELECT * FROM archivo;
SELECT * FROM amistad;
SELECT * FROM usuario;
