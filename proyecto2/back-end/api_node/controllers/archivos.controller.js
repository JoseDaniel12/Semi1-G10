const {uploadToBucket, removeFromBucket, copiarObjeto} = require('../aws/s3');
const db_exec = require('../database/db_exec');
const encryptor = require("../encriptacion");
const date = require('../helpers/time');

const subirArchivo = async (req, res) => {
    const {userId, password, fileName, visibility} = req.body;
    const { file } = req.files;

    // get paswword from de db
    let query = `SELECT contrasenia AS encrypt_password FROM usuario WHERE id = ${userId};`
    let outcome;
    try {
        outcome = await db_exec.execute(query);
    } catch(err) {
        return {err};
    };

    // Si no hay usario con esa contrasña retornar error
    if (outcome.result.length === 0) {
        res.status(400).json({err: `No existe algun usuario con el id = ${userId}.`});
        return;
    }

    // Si la contrasñea ingresada no es igual a la encriptada
    const dbEncryptedPassword = outcome.result[0].encrypt_password;
    if (!encryptor.comparacion(password, dbEncryptedPassword)) {
        res.status(400).json({err: 'La contrseña ingresada es incorrecta.'});
        return;
    }

    // Se verifica si el usuario ya un archivo con ese nombre 
    const extension = file.name.split(".")[1];
    const key = userId + "/" + fileName + "." + extension;
    query = `
        SELECT * FROM archivo
        WHERE (
            s3_key = '${key}' AND
            usuario = ${userId}
        );
    `;

    try {
        outcome = await db_exec.execute(query);
    } catch(err) {
        return {err};
    };


    // Se guarda la referencia del arhcivo en la base de datos si no existia
    if (outcome.result.length === 0) {
        query = `
            INSERT INTO archivo 
            (s3_key, visibilidad, usuario, fecha) 
            VALUES ('${key}', ${visibility}, ${userId}, '${date()}');
        `;

        try {
            outcome = await db_exec.execute(query);
        } catch(err) {
            res.status(400).json({err});
            return;
        };

    }

    const result = await uploadToBucket(userId, file, fileName);
    res.status(200).json(result);
};


const borrarArchivo = async (req, res) => {
    const {userId, password,  fileName} = req.body;

    // get paswword from de db
    let query = `SELECT contrasenia AS encrypt_password FROM usuario WHERE id = ${userId};`
    let outcome;
    try {
        outcome = await db_exec.execute(query);
    } catch(err) {
        res.status(400).json({err});
        return;
    };

    // Si no hay usario con esa contrasña retornar error
    if (outcome.result.length === 0) {
        res.status(400).json({err: `No existe algun usuario con el id ${userId}.`});
        return;
    }

    // Si la contrasñea ingresada no es igual a la encriptada
    const dbEncryptedPassword = outcome.result[0].encrypt_password;
    if (!encryptor.comparacion(password, dbEncryptedPassword)) {
        res.status(400).json({err: 'La contrseña ingresada es incorrecta.'});
        return;
    }


    // Borra el registor del archivo en la base de datos
    const key = userId + "/" + fileName;
    query = `
    DELETE FROM archivo 
    WHERE (
        s3_key = '${key}' AND
        usuario = ${userId}
    );
    `
    try {
        outcome = await db_exec.execute(query);
    } catch(err) {
        res.status(400).json({err});
        return;
    };


    removeFromBucket(userId, fileName);
    res.status(200).json({msg: 'File errased.'});
};

const editarArchivo = async (req, res) => {
    const {userId, password, fileNameOriginal, fileNameDestino, visibilidad} = req.body;

    if (visibilidad !== 1 && visibilidad !== 0) {
        res.status(400).json({ err : "El valor de visibilidad debe ser solamente los números 0 o 1." });
        return;
    }

    // get paswword from de db
    let query = `SELECT contrasenia AS encrypt_password FROM usuario WHERE id = ${userId};`
    let outcome;
    try {
        outcome = await db_exec.execute(query);
    } catch(err) {
        return {err};
    };

    // Si no hay usario con esa contrasña retornar error
    if (outcome.result.length === 0) {
        res.status(400).json({err: `No existe algun usuario con el id = ${userId}.`});
        return;
    }

    // Si la contrasñea ingresada no es igual a la encriptada
    const dbEncryptedPassword = outcome.result[0].encrypt_password;
    if (!encryptor.comparacion(password, dbEncryptedPassword)) {
        res.status(400).json({err: 'La contrseña ingresada es incorrecta.'});
        return;
    }
    // Si fileNameDestino es vacío o nulo solo modificar la visibilidad en la base de datos.
    if (fileNameDestino == null || fileNameDestino === "") {
        query = `UPDATE archivo SET visibilidad = b'${visibilidad}' WHERE usuario = ${userId} AND
                                                                          s3_key = '${userId}/${fileNameOriginal}';`
        try {
            await db_exec.execute(query);
            res.status(200).json({ mensaje : "Archivo actualizado." });
        } catch (err) {
            console.log(err)
            res.status(400).json({ err : `Falló la actualización del archivo.` });
        }
        return;
    }

    let existeArchivoEnDb = false;
    let existíaAntes = true;
    // Se verifica si el usuario tiene un archivo con ese nombre
    const keyAnterior = userId + "/" + fileNameOriginal;
    query = `
        SELECT * FROM archivo
        WHERE (
            s3_key = '${keyAnterior}' AND
            usuario = ${userId}
        );
    `;

    try {
        outcome = await db_exec.execute(query);
    } catch(err) {
        return {err};
    };
    if (outcome.result.length === 1) { existeArchivoEnDb = true };

    // Se verifica si el usuario no tenía un archivo con ese nombre.
    const keyNueva = userId + "/" + fileNameDestino;
    query = `
        SELECT * FROM archivo
        WHERE (
            s3_key = '${keyNueva}' AND
            usuario = ${userId}
        );
    `;

    try {
        outcome = await db_exec.execute(query);
    } catch(err) {
        return {err};
    };
    if (outcome.result.length === 0) { existíaAntes = false };


    // Se guarda en la base de datos si es verdad qué existeArchivoEnDb && !existíaAntes.
    if (existeArchivoEnDb && !existíaAntes) {
        query = `
            UPDATE archivo
            SET
                s3_key = '${keyNueva}',
                visibilidad = b'${visibilidad}'
            WHERE
                usuario = ${userId} AND s3_key = '${keyAnterior}';
        `;

        try {
            outcome = await db_exec.execute(query);
        } catch(err) {
            res.status(400).json({err});
            return;
        };

    } else {
        res.status(400).json({ err : "Error al actualizar el archivo, revisar los parámetros." });
        return;
    }

    copiarObjeto(userId, fileNameOriginal, fileNameDestino);
    removeFromBucket(userId, fileNameOriginal);
    res.status(200).json({ mensaje : "Archivo actualizado." });
};

module.exports = {
    subirArchivo,
    editarArchivo,
    borrarArchivo
};
