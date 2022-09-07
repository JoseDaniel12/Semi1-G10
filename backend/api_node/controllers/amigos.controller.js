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
    } catch(err) {
        res.status(400).json(err);
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
    } catch(err) {
        res.status(400).json(err);
        return;
    };

    res.status(200).json({ "mensaje" : "¡Somos amigos! :D" });
};

module.exports = {
    personasDisponibles,
    agregarAmistad
};
