const express = require('express');
const amigos = require('../controllers/amigos.controller')
const {verifyFile} = require('../middlewares/verifyFiles.js')

const router = express.Router();

router.post('/getNoAmigos', amigos.getNoAmigos);
router.post('/getEnviadas', amigos.getEnviadas);
router.post('/getRecibidas', amigos.getRecibidas);
router.post('/getAmigos', amigos.getAmigos);
router.post('/enviarSolicitud', amigos.enviarSolicitud);
router.post('/aceptarSolicitud', amigos.aceptarSolicitud);

module.exports = router;
