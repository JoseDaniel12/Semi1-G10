var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');
require('dotenv').config();

const cors = require('cors');

var corsOptions = { origin: true, optionSuccessStatus: 200 };
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const port = process.env.API_PUERTO
const conexion = mysql.createConnection({
        host: process.env.BASE_HOST,
        user: process.env.BASE_USER,
        password: process.env.BASE_PASSWORD,
        database: process.env.BASE_NOMBRE
});

app.get('/', function (req, res) {
        res.json({ message: 'Semi1_Grupo10' })
})

app.post('/registrar', function (req, res) {
        var usuario = req.body.usuario;
        var correo = req.body.correo;
        var contrasenia = req.body.contrasenia;

        var query = "CALL Registrar('"+ usuario + "', '" + correo + "','" + contrasenia + "');";
        console.log(query)
        conexion.query(query, async function (err, result) {
                if (err) {
                        throw err;
                } else {
                        var resultado = result[0][0];
                        res.status(resultado.codigo).json(resultado.mensaje)
                }
        });
})

app.post('/login', function (req, res) {
        var usuario_correo = req.body.usuario_correo;
        var contrasenia = req.body.contrasenia;

        var query = "CALL Login('"+ usuario_correo + "', '" + contrasenia + "');";
        console.log(query)
        conexion.query(query, async function (err, result) {
                if (err) {
                        throw err;
                } else {
                        var resultado = result[0][0];
                        //console.log(resultado);
                        if(resultado != undefined){
                                res.status(200).json(resultado)
                        }else{
                                res.status(400).json({})
                        }
                }
        });
})

app.listen(port);
console.log("Escuchando en el puerto", port);