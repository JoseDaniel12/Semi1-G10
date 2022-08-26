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