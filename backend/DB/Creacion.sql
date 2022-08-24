DROP DATABASE IF EXISTS semi1_grupo10;
CREATE DATABASE semi1_grupo10;

USE semi1_grupo10;

-- Eliminar tablas si existen
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS usuario;
DROP TABLE IF EXISTS archivo;
DROP TABLE IF EXISTS amistad;
SET FOREIGN_KEY_CHECKS = 1;

-- Creacion de tablas
CREATE TABLE usuario (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nombre_usuario VARCHAR(250),
	correo VARCHAR(250),
	contrasenia VARCHAR(250),
	formatoFoto VARCHAR(5)
);

CREATE TABLE archivo (
	usuario INT,
	s3_key VARCHAR(250),
	visibilidad BIT,
	PRIMARY KEY (usuario, s3_key),
	FOREIGN KEY (usuario) REFERENCES usuario (id) ON DELETE CASCADE  
);

CREATE TABLE amistad (
	id INT PRIMARY KEY AUTO_INCREMENT,
	usuario1 INT,
	usuario2 INT,
	FOREIGN KEY (usuario1) REFERENCES usuario (id) ON DELETE CASCADE,
	FOREIGN KEY (usuario2) REFERENCES usuario (id) ON DELETE CASCADE 
);

-- Ejemplos de insercion
INSERT INTO usuario(nombre_usuario, correo, contrasenia) VALUES('William', 'correo@gmail.com', '12a34', 'png');
INSERT INTO usuario(nombre_usuario, correo, contrasenia) VALUES('Alejandro', 'correo1@gmail.com', '4321', 'png');
INSERT INTO amistad(usuario1, usuario2) VALUES(1, 2);

-- Ver tablas
SELECT * FROM usuario;
SELECT * FROM archivo;
SELECT * FROM amistad;

-- Limpiar tablas
DELETE FROM usuario;
DELETE FROM archivo;
DELETE FROM amistad;

-- Reiniciar autoincrementales
SET  @num := 0;
UPDATE usuario SET id = @num := (@num+1);
ALTER TABLE usuario AUTO_INCREMENT =1;

SET  @num := 0;
UPDATE amistad SET id = @num := (@num+1);
ALTER TABLE amistad AUTO_INCREMENT =1;