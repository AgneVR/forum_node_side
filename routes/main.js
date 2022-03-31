const express = require('express');
const router = express.Router();
const { validateRegistration } = require('../middleware/main');
const { register, login } = require('../controllers/main');

router.post('/register', validateRegistration, register);
router.post('/login', login);

module.exports = router;
