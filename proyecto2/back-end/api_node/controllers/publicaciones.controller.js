const {subirAlBucket, removeFromBucket, copiarObjeto} = require('../aws/s3');
const { obtenerEtiquetas } = require('../aws/rekognition');
const db_exec = require('../database/db_exec');
const encryptor = require("../encriptacion");
const date = require('../helpers/time');
var AWS = require('aws-sdk');

let aws_keys = {
    translate: {
        region: process.env.AWS_REGION_TRANSLATE,
        accessKeyId: process.env.AWS_ACCES_KEY_TRANSLATE,
        secretAccessKey: process.env.AWS_SECRET_KEY_TRANSLATE
    }
}

const translate = new AWS.Translate(aws_keys.translate);

const traducir = async (req, res) => {
    const { text, target } = req.body;

    let params = {
        SourceLanguageCode: 'auto',
        TargetLanguageCode: target,
        Text: text || 'Hello there'
    };
    translate.translateText(params, function (err, data) {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(data);
        }
    });
};

const crearPublicación = async (req, res) => {
    let { usuario, texto } = req.body;
    const { imagen } = req.files;
    console.log(usuario, texto);

    const fecha = date.fecha_actual_key();
    const llave_nueva = `U${usuario}F${fecha}`;

    if (!texto) {
        texto = "";
    }

    let cueri;
    let resultado;

    cueri = `SELECT id FROM usuarios WHERE id = ${usuario};`
    try {
        resultado = await db_exec.execute(cueri);
    } catch(err) {
        console.log("BBBBBB")
        res.status(400).json(err)
        return;
    };

    if (resultado.result.length === 0) {
        res.status(400).json({err: `No existe algun usuario con el id = ${usuario}.`});
        return;
    }

    cueri = `CALL crear_publicación ("${llave_nueva}", "${texto}", ${usuario});`
    try {
        resultado = await db_exec.execute(cueri);
    } catch(err) {
        console.log("AAAAAA")
        console.log(err)
        res.status(400).json(err);
        return;
    };


    resultado = await subirAlBucket(llave_nueva, imagen, 'pubs');

    let etiquetas = await obtenerEtiquetas({
        Image: {
            S3Object: {
                Bucket: process.env.BUCKET,
                Name: `pubs/${llave_nueva}`
            }
        },
        MaxLabels: 5
    });

    for(let x = 0; x < etiquetas.Labels.length; x++) {
        cueri = `CALL insertar_etiqueta ("${llave_nueva}", "${etiquetas.Labels[x].Name.toUpperCase()}");`
        try {
            resultado = await db_exec.execute(cueri);
        } catch(err) {
            console.log(err);
        }
    }

    res.status(200).json({ 'mensaje': 'Publicado.' });
};

const obtenerPublicaciones = async (req, res) => {
    const { usuario } = req.body;
    let cueri;
    let resultado;

    cueri = `CALL obtener_publicaciones (${usuario});`
    try {
        resultado = await db_exec.execute(cueri);
    } catch(err) {
        console.log("BBBBBB")
        res.status(400).json(err)
        return;
    };

    res.status(200).json(resultado.result[0]);
}

const obtenerPublicacionesEtiqueta = async (req, res) => {
    const { usuario, etiqueta } = req.body;
    let cueri;
    let resultado;

    if (!etiqueta) {
        res.status(400).json({F: "F"});
        return;
    }

    cueri = `CALL obtener_publicaciones_con_etiqueta (${usuario}, "${etiqueta.toUpperCase()}");`
    try {
        resultado = await db_exec.execute(cueri);
    } catch(err) {
        console.log("BBBBBB")
        res.status(400).json(err)
        return;
    };

    res.status(200).json(resultado.result[0]);
}

const obtenerEtiquetasDB = async (req, res) => {
    let cueri;
    let resultado;

    cueri = `CALL obtener_etiquetas ();`
    try {
        resultado = await db_exec.execute(cueri);
    } catch(err) {
        console.log("BBBBBB")
        res.status(400).json(err)
        return;
    };

    res.status(200).json(resultado.result[0]);
}

const obtenerIdUsuario = async (req, res) => {
    const { kog } = req.body;
    let cueri;
    let resultado;

    cueri = `SELECT id FROM usuarios WHERE sub_cognito = "${kog}" LIMIT 1;`
    try {
        resultado = await db_exec.execute(cueri);
    } catch(err) {
        console.log("BBBBBB")
        res.status(400).json(err)
        return;
    };

    res.status(200).json(resultado.result[0]);
}

module.exports = {
    crearPublicación,
    obtenerPublicaciones,
    obtenerPublicacionesEtiqueta,
    obtenerEtiquetasDB,
    obtenerIdUsuario,
    traducir,
};
