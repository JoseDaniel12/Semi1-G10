const express = require('express');
const amigos = require('../controllers/amigos.controller')
const {verifyFile} = require('../middlewares/verifyFiles.js')

const router = express.Router();

router.get('/personas-disponibles', amigos.personasDisponibles);
router.post('/agregar-amistad', amigos.agregarAmistad);

module.exports = router;
