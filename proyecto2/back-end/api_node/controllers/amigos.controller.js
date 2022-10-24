const db_exec = require('../database/db_exec');

const getNoAmigos = async (req, res) => {
    const { email, username } = req.body;
    let id = -1;
    let query1 = `SELECT id FROM usuarios WHERE correo='${email}' AND usuario='${username}';`
    try {
        id = await db_exec.execute(query1);
        id = id.result[0].id;
    } catch (err) {
        res.status(400).json(err);
        return;
    };
    let query2 =
   `SELECT * FROM usuarios us1
    WHERE id <> ${id}
    AND NOT EXISTS (
        SELECT * FROM amistad am WHERE am.usuario1 = ${id} AND am.usuario2 = us1.id
    ) AND NOT EXISTS (
        SELECT * FROM amistad am WHERE am.usuario2 = ${id} AND am.usuario1 = us1.id
    )
    `

    try {
        usuarios = await db_exec.execute(query2);
        res.status(200).json(usuarios.result);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
        return;
    };
};

const getEnviadas = async (req, res) => {
    const { email, username } = req.body;
    let id = -1;
    let query1 = `SELECT id FROM usuarios WHERE correo='${email}' AND usuario='${username}';`
    try {
        id = await db_exec.execute(query1);
        id = id.result[0].id;
    } catch (err) {
        res.status(400).json(err);
        return;
    };
    let query2 = 
   `SELECT * FROM usuarios us1
    WHERE id <> ${id}
    AND EXISTS (
        SELECT * FROM amistad am WHERE am.usuario1 = ${id}
        AND am.usuario2 = us1.id AND am.estado = 0
    )`

    try {
        usuarios = await db_exec.execute(query2);
        res.status(200).json(usuarios.result);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
        return;
    };
};

const getRecibidas = async (req, res) => {
    const { email, username } = req.body;
    let id = -1;
    let query1 = `SELECT id FROM usuarios WHERE correo='${email}' AND usuario='${username}';`
    try {
        id = await db_exec.execute(query1);
        id = id.result[0].id;
    } catch (err) {
        res.status(400).json(err);
        return;
    };
    let query2 =
    `SELECT * FROM usuarios us1
    WHERE id <> ${id}
    AND EXISTS (
        SELECT * FROM amistad am WHERE am.usuario2 = ${id}
        AND am.usuario1 = us1.id AND am.estado = 0
    )`

    try {
        usuarios = await db_exec.execute(query2);
        res.status(200).json(usuarios.result);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
        return;
    };
};

const getAmigos = async (req, res) => {
    const { email, username } = req.body;
    let id = -1;
    let query1 = `SELECT id FROM usuarios WHERE correo='${email}' AND usuario='${username}';`
    try {
        id = await db_exec.execute(query1);
        id = id.result[0].id;
    } catch (err) {
        res.status(400).json(err);
        return;
    };
    let query2 = `SELECT * FROM usuarios us1
                    WHERE id <> ${id}
                    AND EXISTS (
                        SELECT * FROM amistad am WHERE am.usuario1 = ${id}
                        AND am.usuario2 = us1.id AND am.estado = 1
                    )OR EXISTS (
                        SELECT * FROM amistad am WHERE am.usuario2 = ${id}
                        AND am.usuario1 = us1.id AND am.estado = 1
                    );`

    try {
        usuarios = await db_exec.execute(query2);
        res.status(200).json(usuarios.result);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
        return;
    };
};

const enviarSolicitud = async (req, res) => {
    const { usuario, destino } = req.body;
    const { email, username } = usuario;
    const { id } = destino;
    
    let id_usuario = -1;
    let id_destino = id;
    let query1 = `SELECT id FROM usuarios WHERE correo='${email}' AND usuario='${username}';`
    try {
        id_usuario = await db_exec.execute(query1);
        id_usuario = id_usuario.result[0].id;
    } catch (err) {
        res.status(400).json(err);
        return;
    };
    let query2 = `INSERT INTO amistad(usuario1, usuario2, estado)
                  VALUES(${id_usuario}, ${id_destino}, FALSE);`

    try {
        await db_exec.execute(query2);
        res.status(200).json('OK');
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
        return;
    };
};

const aceptarSolicitud = async (req, res) => {
    const { usuario, destino } = req.body;
    const { email, username } = usuario;
    const { id } = destino;
    
    let id_usuario = -1;
    let id_destino = id;
    let query1 = `SELECT id FROM usuarios WHERE correo='${email}' AND usuario='${username}';`
    try {
        id_usuario = await db_exec.execute(query1);
        id_usuario = id_usuario.result[0].id;
    } catch (err) {
        res.status(400).json(err);
        return;
    };
    let query2 = `UPDATE amistad SET estado = 1
                  WHERE usuario1 = ${id_destino} AND usuario2 = ${id_usuario};`

    try {
        await db_exec.execute(query2);
        res.status(200).json('OK');
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
        return;
    };
};

module.exports = {
    getNoAmigos,
    getEnviadas,
    getRecibidas,
    getAmigos,
    enviarSolicitud,
    aceptarSolicitud
};
