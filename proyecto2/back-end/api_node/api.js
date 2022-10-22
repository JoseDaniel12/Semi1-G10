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


const AwsCognito = require('./aws/cognito');

app.post('/registrar', function (req, res) {
        var nombre = req.body.nombre;
        var usuario = req.body.usuario;
        var correo = req.body.correo;
        var contrasenia = req.body.contrasenia;
        const { foto, webcam } = req.files;
        
        var imgSubir = (foto !== undefined) ? foto : webcam;  
        var extensionFoto = imgSubir.name.split(".")[1];

        AwsCognito.initAWS();
        AwsCognito.setCognitoAttributeList(nombre, correo, extensionFoto);
        AwsCognito.getUserPool().signUp(usuario, contrasenia, AwsCognito.getCognitoAttributeList(), null, function(err, result){
                if (err) {   
                        res.status(422).json(err);
                } else {
                        const resUser = {
                                uid: result.userSub,
                                username: result.user.username,
                                email: correo,
                                ext_foto: extensionFoto,
                                name: nombre
                        }
                        // result.user.username
                        // result.userSub
                        // const subirFoto = await uploadToBucket('fotos', imgSubir, result.user.username);
                        // console.log(result);
                        res.status(201).json(resUser);
                }
        });
})

app.post('/login', function (req, res) {
        var usuario_correo = req.body.usuario_correo;
        var contrasenia = req.body.contrasenia;

        AwsCognito.getCognitoUser(usuario_correo).authenticateUser(AwsCognito.getAuthDetails(usuario_correo, contrasenia), {
                onSuccess: (result) => {
                        const token = {
                                accessToken: result.getAccessToken().getJwtToken(),
                                idToken: result.getIdToken().getJwtToken(),
                                refreshToken: result.getRefreshToken().getToken(),
                        }  
                        res.status(200).json(AwsCognito.decodeJWTToken(token));
                },
                onFailure: (err) => {    
                        res.status(400).json(err.message || JSON.stringify(err));
                }
        });
})

app.post('/allFiles', function (req, res) {
        var userId = req.body.userId;

        var query = "CALL AllFiles(" + userId + ");";
        conexion.query(query, async function (err, result) {
                if (err) {
                        throw err;
                } else {
                        var resultado = result[0];
                        if (resultado != undefined) {
                                res.status(200).json({ "archivos": resultado })
                        } else {
                                res.status(400).json({ "archivos": [] })
                        }
                }
        });
})

app.post('/archivosAmigos', function (req, res) {
        var userId = req.body.userId;

        var query = "CALL ArchivosAmigos(" + userId + ");";
        conexion.query(query, async function (err, result) {
                if (err) {
                        throw err;
                } else {
                        var resultado = result[0];
                        if (resultado != undefined) {
                                res.status(200).json({ "archivos": resultado })
                        } else {
                                res.status(400).json({ "archivos": [] })
                        }
                }
        });
})


app.use('/archivos', require('./routes/archivos.routes'));
app.use('/amigos', require('./routes/amigos.routes'));

app.listen(port);
console.log("Escuchando en el puerto", port);