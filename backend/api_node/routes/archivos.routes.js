const express = require('express');
const archivos = require('../controllers/archivos.controller')
const {verifyFile} = require('../middlewares/verifyFiles.js')

const router = express.Router();

router.post('/subirArchivo', verifyFile, archivos.subirArchivo);

module.exports = router;