const {exec_proc, exec_query} = require('../database/db_exec_v2');
const {uploadToBucket, removeFromBucket, copyObject} = require('../aws/s3');


const prueba = async (req, res) => {
    const { file_name} = req.body;
    const { file } = req.files;

    //const result = await uploadToBucket( file, file_name, 'prueba');
    //const result = await removeFromBucket('prueba/petronilo.jpg');
    const result = await copyObject('prueba/petronilo.jpg', 'prueba');
    //const result = await copyObject('/prueba/petronilo.jpg', '/vecino');
    res.status(200).json(result);
};


const id_usuario = async (req, res) => {
    const { usuario } = req.body;

    const result = await exec_proc('id_usuario', [usuario]);
    if (result.err) {
        res.status(400).json(err);
        return;
    } else if (result.length === 0) {
        res.status(400).json({err: 'No hay usuarios con ese usarname.'});
        return;
    }

    res.status(200).json({id_usuario: result[0].id_usuario});
};


const amigos = async (req, res) => {
    const { id_usuario } = req.body;

    const result = await exec_proc('amigos', [id_usuario]);
    if (result.err) {
        res.status(400).json(result.err);
        return;
    }

    res.status(200).json({amigos: result});
};

const mensajes = async (req, res) => {
    const { id_usuario, id_amigo } = req.body;

    const result = await exec_proc('mensajes', [id_usuario, id_amigo]);
    if (result.err) {
        res.status(400).json(result.err);
        return;
    }

    res.status(200).json(result);
};




module.exports = {
    id_usuario,
    prueba,
    amigos,
    mensajes
};
