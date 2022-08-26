const {uploadToBucket, removeFromBucket} = require('../helpers/s3');
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

module.exports = {
    subirArchivo,
    borrarArchivo
};