require('dotenv').config({ path: './.env' });
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const encriptacion = require("./encriptacion");
const mysql = require('mysql');
const { exec_proc } = require('./database/db_exec_v2')
const { Server } = require('socket.io');
const { talk_to_bot } = require('./aws/amazon_lex')
const { uploadToBucket, removeFromBucket } = require('./aws/s3');
const prueba = require('./aws/amazon_lex')

const app = express();
const server = http.createServer(app);
const corsOptions = { origin: true, optionSuccessStatus: 200 };

// Midlewares
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Database
const port = process.env.NODE_PUERTO
const conexion = mysql.createConnection({
        host: process.env.BASE_HOST,
        user: process.env.BASE_USER,
        password: process.env.BASE_PASSWORD,
        database: process.env.BASE_NOMBRE
});


// Sockets
const io = new Server(server, {
        cors: {
                origin: process.env.FRONTEND,
                methods: ['GET', 'POST']
        }
});


io.on("connection",  (socket_client) => {
        socket_client.on("joining_room", (room) => {
                socket_client.join(room);
        });

        socket_client.on("sending_message", async (data) => {
                const { contenido, id_usuario, id_amigo } = data.m;
                socket_client.to(data.room).emit("relaying_message", data.m);
                await exec_proc('almacenar_mensaje', [contenido, id_usuario, id_amigo]);

                const {modo_bot} = (await exec_proc('get_modo_bot', [id_amigo]))[0];
                if (modo_bot === 1) {
                        const message_contents = await talk_to_bot(contenido);
                        message_contents.map(async mb => {
                                const m = {
                                        contenido: mb.content,
                                        id_usuario: id_amigo,
                                        id_amigo: id_usuario
                                }
                                io.in(data.room).emit("relaying_message", m);
                                await exec_proc('almacenar_mensaje', [mb.content, id_amigo, id_usuario]);
                        })
                }
        });
})



// Rutas
app.get('/', function (req, res) {
        res.json({ message: 'Semi1_Grupo10' });
})

const exphbrs = require('express-handlebars');
const fileUpload = require('express-fileupload');
app.use(fileUpload({
        useTempFiles: true,
        tempFileDir: '/temp/'
}));

const AwsCognito = require('./aws/cognito');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { cognito } = require('./aws/keys');
const { RDS } = require('aws-sdk');
const { accessSync } = require('fs');

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
                                name: nombre,
                                modo_bot: 0
                        }
            
                        // Guardar en Mysql
                        var query = `CALL Registrar('${resUser.uid}', '${resUser.name}', '${resUser.username}', '${encriptacion.encriptar(contrasenia)}','${resUser.email}','${resUser.ext_foto}');`
                        conexion.query(query, async function (err, result) {
                                if (err) {
                                        res.status(400).json(err);
                                } else {
                                        await uploadToBucket(imgSubir, resUser.uid, 'fotos');
                                        res.status(201).json(resUser);
                                }       
                        });
                        // const subirFoto = await uploadToBucket('fotos', imgSubir, result.user.username);
                }
        });
});

app.post('/login', function (req, res) {
        var usuario_correo = req.body.usuario_correo;
        var contrasenia = req.body.contrasenia;

        AwsCognito.initAWS();
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

app.put('/editar', function (req, res) {
        var subuser = req.body.subuser;
        var usuario = req.body.usuario;
        var nombre = req.body.nombre;
        var modobot = req.body.modobot;
        var correo = req.body.correo;
        var contrasenia = req.body.contrasenia;
        var extensionFoto = "";
        var foto = null;

        if (req.files) { 
                foto = req.files.foto;
                extensionFoto = foto.name.split(".")[1]; 
        }
        
        // Comprobar contraseña
        var query = `SELECT contraseña FROM usuarios WHERE sub_cognito = '${subuser}'`;
        conexion.query(query, async function (err, result) {
                if (err) {
                        res.status(400).json(err);
                } else {
                        var resultado = result[0];
                        if (resultado != undefined) {
                                if (encriptacion.comparacion(contrasenia, resultado.contraseña)) {
                                        var cognitoUser = new AmazonCognitoIdentity.CognitoUser({Username: usuario, Pool: AwsCognito.getUserPool()})
                                        cognitoUser.authenticateUser(AwsCognito.getAuthDetails(usuario, contrasenia), {
                                                onSuccess: (result) => {
                                                        // Actualizar en Cognito
                                                        var updateAttList = [];
                                                        var attrList = [
                                                                {
                                                                        Name: 'name',
                                                                        Value: nombre
                                                                },
                                                                {
                                                                        Name: 'custom:modo_bot',
                                                                        Value: `${modobot}`
                                                                }       
                                                        ]

                                                        if (foto) {
                                                                attrList.push({
                                                                        Name: 'picture',
                                                                        Value: extensionFoto
                                                                }) 
                                                        }

                                                        attrList.forEach(attr => {
                                                                updateAttList.push(new AmazonCognitoIdentity.CognitoUserAttribute(attr));
                                                        })

                                                        cognitoUser.updateAttributes(updateAttList, (err, result) => {
                                                                if (err) {
                                                                        console.log(err);
                                                                        return;
                                                                }
                                                                
                                                                var query = "";
                                                                if (foto) {
                                                                        query = `UPDATE usuarios 
                                                                                SET nombre='${nombre}', ext_foto='${extensionFoto}', modo_bot='${modobot}'
                                                                                WHERE sub_cognito='${subuser}'`;
                                                                } else {
                                                                        query = `UPDATE usuarios 
                                                                                SET nombre='${nombre}', modo_bot='${modobot}'
                                                                                WHERE sub_cognito='${subuser}'`;
                                                                }
                                                                
                                                                //Actualizar en DB
                                                                conexion.query(query, async function (err, result) {
                                                                        if (err) { console.log(err); res.status(400).json(err); }
                                                                        else {
                                                                                if (foto) {
                                                                                        await uploadToBucket(foto, subuser, 'fotos');
                                                                                }
                                                                                res.status(200).json(result);
                                                                        }
                                                                });
                                                        })
                                                },
                                                onFailure: (err) => {    
                                                        console.log(err, "ke");
                                                        res.status(400).json(err.message || JSON.stringify(err));
                                                }
                                        });
                                } else {
                                        console.log("alv")
                                        res.status(400).json('contraseña incorrecta')
                                }
                        } else {
                                console.log("alv 2")
                                res.status(400).json('correo o usuario no existe')
                        }
                }
        });
});

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
app.use('/chat', require('./routes/chat.routes'));


server.listen(port, () => {
        console.log("Escuchando en el puerto", port);
})
