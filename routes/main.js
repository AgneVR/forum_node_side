const express = require('express');
const router = express.Router();
const { validateRegistration } = require('../middleware/main');
const {
  register,
  login,
  getUser,
  logout,
  createTopic,
  topics,
  createComment,
} = require('../controllers/main');

router.post('/register', validateRegistration, register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/get-user', getUser);
router.get('/topics', topics);
router.post('/create-topic', createTopic);
router.post('/create-comment', createComment);

module.exports = router;
