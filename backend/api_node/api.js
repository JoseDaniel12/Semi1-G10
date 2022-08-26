var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');

require('dotenv').config({ path: './.env' });

const cors = require('cors');
const encriptacion = require("./encriptacion");
const { uploadToBucket, removeFromBucket } = require('./helpers/s3');


var corsOptions = { origin: true, optionSuccessStatus: 200 };
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const port = process.env.NODE_PUERTO
const conexion = mysql.createConnection({
        host: process.env.BASE_HOST,
        user: process.env.BASE_USER,
        password: process.env.BASE_PASSWORD,
        database: process.env.BASE_NOMBRE
});

app.get('/', function (req, res) {
        res.json({ message: 'Semi1_Grupo10' })
})

const exphbrs = require('express-handlebars');
const fileUpload = require('express-fileupload');
app.use(fileUpload({
        useTempFiles: true,
        tempFileDir: '/temp/'
}));


app.post('/registrar', function (req, res) {
        var usuario = req.body.usuario;
        var correo = req.body.correo;
        var contrasenia = encriptacion.encriptar(req.body.contrasenia);
        const { foto } = req.files;
        var extensionFoto = foto.name.split(".")[1];

        var query = "CALL Registrar('" + usuario + "','" + correo + "','" + contrasenia + "','" + extensionFoto + "');";
        console.log(query)
        conexion.query(query, async function (err, result) {
                if (err) {
                        throw err;
                } else {
                        var resultado = result[0][0];
                        console.log(resultado);

                        // guardar la foto de perfil
                        const subirFoto = await uploadToBucket('fotos', foto, resultado.id);

                        res.status(resultado.codigo).json(resultado);
                }
        });
})

app.post('/login', function (req, res) {
        var usuario_correo = req.body.usuario_correo;
        var contrasenia = req.body.contrasenia;

        var query = "CALL Login('" + usuario_correo + "');";
        console.log(query)
        conexion.query(query, async function (err, result) {
                if (err) {
                        throw err;
                } else {
                        var resultado = result[0][0];
                        if (resultado != undefined) {
                                if (encriptacion.comparacion(contrasenia, resultado.contrasenia)) {
                                        res.status(200).json(resultado)
                                } else {
                                        res.status(400).json({ caso: 2, mensaje: 'contrasenia incorrecta' })
                                }
                        } else {
                                res.status(400).json({ caso: 1, mensaje: 'correo o usuario no existe' })
                        }
                }
        });
})

app.use('/archivos', require('./routes/archivos.routes'));

app.listen(port);
console.log("Escuchando en el puerto", port);