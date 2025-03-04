const express = require('express');
const { gitController } = require('../controllers');
const verifyGitOrigin = require('../middlewares/verifyGitOrigin');

const router = express.Router();

router.post('/webhook', verifyGitOrigin, gitController.handleWebhook);

module.exports = router;