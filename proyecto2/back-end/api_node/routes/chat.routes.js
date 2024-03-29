const express = require('express');
const chat = require('../controllers/chat.controller');

const router = express.Router();
router.post('/id_usuario', chat.id_usuario);
router.post('/set_modo_bot', chat.set_modo_bot);
router.post('/prueba', chat.prueba);
router.post('/amigos', chat.amigos);
router.post('/mensajes', chat.mensajes);

module.exports = router;
