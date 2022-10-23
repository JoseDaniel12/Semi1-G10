const express = require('express');
const chat = require('../controllers/chat.controller');

const router = express.Router();
router.post('/prueba', chat.prueba);

module.exports = router;
