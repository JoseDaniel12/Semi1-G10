DROP TABLE usuarios;
CREATE TABLE usuarios (
	id int PRIMARY KEY AUTO_INCREMENT,
	sub_cognito VARCHAR(255),
	nombre VARCHAR(255),
	usuario VARCHAR(250),
	contraseña VARCHAR(255),
	correo VARCHAR(250),
	ext_foto VARCHAR(5),
)

#-------------------------------------------
# Procedimiento para registrar usuarios
#-------------------------------------------
DROP PROCEDURE IF EXISTS Registrar;
CREATE PROCEDURE Registrar (
	IN in_sub VARCHAR(255),
	IN in_nombre VARCHAR(250),
	IN in_usuario VARCHAR(250),
	IN in_contrasenia VARCHAR(255),
	IN in_correo VARCHAR(250),
	IN in_extension VARCHAR(5),
)
BEGIN
		INSERT INTO usuarios (sub_cognito, nombre, usuario, correo, ext_foto) 
			VALUES(in_sub, in_nombre, in_usuario, in_correo, in_extension);
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
