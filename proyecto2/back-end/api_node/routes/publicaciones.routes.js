const express = require('express');
const publicaciones = require('../controllers/publicaciones.controller')

const router = express.Router();

router.post('/traducir', publicaciones.traducir);

module.exports = router;
