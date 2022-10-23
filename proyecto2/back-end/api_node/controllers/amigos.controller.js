const db_exec = require('../database/db_exec');

const personasDisponibles = async (req, res) => {
    const { userId } = req.body;
    let query = `
SELECT noamigos.id, noamigos.nombre_usuario, noamigos.formatofoto, noamigos.archivos_publicos
    FROM (SELECT *
             FROM (SELECT u.id, u.nombre_usuario, u.formatofoto, a.archivos_publicos
                      FROM usuario u
                      LEFT JOIN
                      (SELECT usuario id, count(*) archivos_publicos
                          FROM archivo WHERE visibilidad = B'1'
                          GROUP BY usuario) a
                      ON u.id = a.id) publicos
             LEFT JOIN
             (SELECT usuario2
                 FROM amistad
                 WHERE usuario1 = ${userId}) ami
             ON publicos.id = ami.usuario2) noamigos
    WHERE noamigos.usuario2 IS NULL AND noamigos.id != ${userId};`
    let relación_resultante;
    try {
        relación_resultante = await db_exec.execute(query);
    } catch (err) {
        res.status(400).json(err);
        return;
    };

    const resultado = relación_resultante.result;
    res.status(200).json(resultado);
};

const agregarAmistad = async (req, res) => {
    const { userIdA, userIdB } = req.body;
    let queryA = `INSERT INTO amistad (usuario1, usuario2) VALUES (${userIdA}, ${userIdB});`
    let queryB = `INSERT INTO amistad (usuario2, usuario1) VALUES (${userIdA}, ${userIdB});`
    try {
        await db_exec.execute(queryA);
        await db_exec.execute(queryB);
    } catch (err) {
        res.status(400).json(err);
        return;
    };

    res.status(200).json({ "mensaje": "¡Somos amigos! :D" });
};

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
    let query2 = `SELECT * FROM usuarios us1 WHERE id <> ${id}
                    AND NOT EXISTS (
                        SELECT * FROM amistad am WHERE am.usuario1 = ${id} AND am.usuario2 = us1.id
                    ) AND NOT EXISTS (
                        SELECT * FROM amistad am WHERE am.usuario2 = ${id} AND am.usuario1 = us1.id
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
    let query2 = `SELECT * FROM usuarios us1 WHERE id <> ${id}
                    AND EXISTS (
                        SELECT * FROM amistad am WHERE am.usuario1 = ${id} AND am.usuario2 = us1.id
                    ) OR EXISTS (
                        SELECT * FROM amistad am WHERE am.usuario2 = ${id} AND am.usuario1 = us1.id
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
    let query2 = `SELECT * FROM usuarios us1 WHERE id <> ${id}
                    AND EXISTS (
                        SELECT * FROM amistad am WHERE am.usuario1 = ${id} AND am.usuario2 = us1.id
                    ) OR EXISTS (
                        SELECT * FROM amistad am WHERE am.usuario2 = ${id} AND am.usuario1 = us1.id
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
    let query2 = `SELECT * FROM usuarios us1 WHERE id <> ${id}
                    AND EXISTS (
                        SELECT * FROM amistad am WHERE am.usuario1 = ${id} AND am.usuario2 = us1.id
                    ) OR EXISTS (
                        SELECT * FROM amistad am WHERE am.usuario2 = ${id} AND am.usuario1 = us1.id
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

module.exports = {
    personasDisponibles,
    agregarAmistad,
    getNoAmigos,
    getEnviadas,
    getRecibidas,
    getAmigos
};
