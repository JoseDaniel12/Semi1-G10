const express = require('express');
const chat = require('../controllers/chat.controller');

const router = express.Router();
router.post('/prueba', chat.prueba);
router.get('/amigos', chat.amigos);
router.get('/mensajes', chat.mensajes);

module.exports = router;
