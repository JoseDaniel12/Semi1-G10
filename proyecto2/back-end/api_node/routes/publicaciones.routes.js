const express = require('express');
const publicaciones = require('../controllers/publicaciones.controller')

const router = express.Router();

router.post('/traducir', publicaciones.traducir);
router.post('/publicar', publicaciones.crearPublicación);
router.post('/publicaciones', publicaciones.obtenerPublicaciones);
router.post('/publicaciones-etiqueta', publicaciones.obtenerPublicacionesEtiqueta);
router.get('/etiquetas', publicaciones.obtenerEtiquetasDB);
router.post('/usuario', publicaciones.obtenerIdUsuario);

module.exports = router;
