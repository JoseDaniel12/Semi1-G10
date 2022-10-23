const express = require('express');
const amigos = require('../controllers/amigos.controller')
const {verifyFile} = require('../middlewares/verifyFiles.js')

const router = express.Router();

router.post('/personas-disponibles', amigos.personasDisponibles);
router.post('/agregar-amistad', amigos.agregarAmistad);

router.post('/getNoAmigos', amigos.getNoAmigos);
router.post('/getEnviadas', amigos.getEnviadas);
router.post('/getRecibidas', amigos.getRecibidas);
router.post('/getAmigos', amigos.getAmigos);

module.exports = router;
