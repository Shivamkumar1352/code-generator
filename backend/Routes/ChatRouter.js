const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../Middlewares/Auth');
const { generateComponent, getChatHistory } = require('../Controllers/ChatController');

router.post('/generate', ensureAuthenticated, generateComponent);
router.get('/history/:sessionId', ensureAuthenticated, getChatHistory);

module.exports = router;