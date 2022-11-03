CREATE TABLE IF NOT EXISTS publicación (
    s3_key VARCHAR(255) NOT NULL,
    texto VARCHAR(500),
    fecha_de_publicación DATETIME,
    usuario INT,
    PRIMARY KEY (s3_key),
    FOREIGN KEY (usuario) REFERENCES usuarios (id)
);

CREATE TABLE IF NOT EXISTS etiqueta (
    publicación VARCHAR(255) NOT NULL,
    texto_etiqueta VARCHAR(255) NOT NULL,
    PRIMARY KEY (publicación, texto_etiqueta),
    FOREIGN KEY (publicación) REFERENCES publicación (s3_key)
);

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS
    crear_publicación (llave VARCHAR(255), texto_pub VARCHAR(500), usuario_id INT)
BEGIN
    INSERT INTO publicación (s3_key, texto, fecha_de_publicación, usuario) VALUES ( llave, texto_pub, NOW(), \
                                                                                   usuario_id);
    COMMIT;
END;
//
CREATE PROCEDURE IF NOT EXISTS
    insertar_etiqueta (pub VARCHAR(255), texto VARCHAR(255))
BEGIN
    INSERT INTO etiqueta (publicación, texto_etiqueta) VALUES (pub, texto);
    COMMIT;
END;
//
CREATE PROCEDURE IF NOT EXISTS
    obtener_publicaciones (usuario_consulta INT)
BEGIN
    SELECT s3_key, texto, fecha_de_publicación, usuarios.usuario
    FROM
        usuarios
    JOIN
        ((SELECT s3_key, texto, fecha_de_publicación, usuario
            FROM publicación
            JOIN (SELECT IF(usuario1 = usuario_consulta, usuario2, usuario1) amigo
                    FROM amistad
                    WHERE (usuario1 = usuario_consulta OR usuario2 = usuario_consulta) AND estado = 1) amigos_míos
            ON usuario = amigo)
        UNION ALL
        (SELECT s3_key, texto, fecha_de_publicación, usuario
            FROM publicación WHERE usuario = usuario_consulta)) pubs
    ON id = pubs.usuario ORDER BY fecha_de_publicación DESC;
END;
//
CREATE PROCEDURE IF NOT EXISTS
    obtener_publicaciones_con_etiqueta (usuario_consulta INT, etiqueta_consulta VARCHAR(255))
BEGIN
    SELECT s3_key, texto, fecha_de_publicación, usuarios.usuario
    FROM
        usuarios
    JOIN
        ((SELECT s3_key, texto, fecha_de_publicación, usuario
            FROM publicación
            JOIN (SELECT IF(usuario1 = usuario_consulta, usuario2, usuario1) amigo
                    FROM amistad
                    WHERE (usuario1 = usuario_consulta OR usuario2 = usuario_consulta) AND estado = 1) amigos_míos
            ON usuario = amigo)
        UNION ALL
        (SELECT s3_key, texto, fecha_de_publicación, usuario
            FROM publicación WHERE usuario = usuario_consulta)) pubs
    ON id = pubs.usuario
    JOIN etiqueta
    ON s3_key = etiqueta.publicación
    WHERE texto_etiqueta = etiqueta_consulta
    ORDER BY fecha_de_publicación DESC;
END;
//
CREATE PROCEDURE IF NOT EXISTS
    obtener_etiquetas ()
BEGIN
    SELECT DISTINCT texto_etiqueta FROM etiqueta;
END;
//
DELIMITER ;
