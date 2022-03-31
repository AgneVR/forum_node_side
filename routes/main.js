const express = require('express');
const router = express.Router();
const { validateRegistration } = require('../middleware/main');
const { register, login, getUser, logout } = require('../controllers/main');

router.post('/register', validateRegistration, register);
router.post('/login', login);
router.get('/get-user', getUser);
router.get('/logout', logout);

module.exports = router;
