const {uploadToBucket, removeFromBucket} = require('../helpers/s3');
const db_exec = require('../database/db_exec');
const encryptor = require("../encriptacion");


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
        res.status(400).json({err: `No existe algun usuario con el id ${userId}.`});
        return;
    }

    // Si la contrasñea ingresada no es igual a la encriptada
    const dbEncryptedPassword = outcome.result[0].encrypt_password;
    if (!encryptor.comparacion(password, dbEncryptedPassword)) {
        res.status(400).json({err: 'La contrseña ingresada es incorrecta.'});
        return;
    }


    // Se guarda la referencia del arhcivo en la base de datos
    const extension = file.name.split(".")[1];
    const key = "user-" + userId + "/" + fileName + "." + extension;
    query = `
        INSERT INTO archivo 
        (nombre, visibilidad, usuario) 
        VALUES ('${key}', ${visibility}, ${userId});
    `;

    try {
        outcome = await db_exec.execute(query);
    } catch(err) {
        return {err};
    };


    const result = await uploadToBucket(userId, file, fileName);
    res.status(200).json(result);
};


const borrarArchivo = async (req, res) => {
    const {userId, password,  fileName} = req.body;

    // get paswword from de db
    const query = `SELECT contrasenia AS encrypt_password FROM usuario WHERE id = ${userId};`
    let outcome;
    try {
        outcome = await db_exec.execute(query);
    } catch(err) {
        return {err};
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

    removeFromBucket(userId, fileName);
    res.status(200).json({msg: 'File errased.'});
};

module.exports = {
    subirArchivo,
    borrarArchivo
};