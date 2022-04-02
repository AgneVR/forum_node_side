const express = require('express');
const router = express.Router();
const {
  validateRegistration,
  validateTopicCreation,
  validateCommentCreation,
} = require('../middleware/main');
const {
  register,
  login,
  getUser,
  logout,
  createTopic,
  topics,
  createComment,
  singleTopic,
  userTopics,
  allTopicComments,
  userComments,
  createNotification,
  notificationIsSeen,
  changeUserPhoto,
} = require('../controllers/main');

router.post('/register', validateRegistration, register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/get-user', getUser);
router.get('/topics', topics);

router.get('/topics/my-topics', userTopics);
router.get('/topics/:topicID', singleTopic);
router.get('/my-comments/:pageIndex', userComments);
router.get('/all-topic-comments/:id/:pageIndex', allTopicComments);
router.get('/notification-is-seen/:notificationID', notificationIsSeen);
router.post('/create-topic', validateTopicCreation, createTopic);
router.post('/create-comment', validateCommentCreation, createComment);
router.post('/create-notification', createNotification);
router.post('/change-user-photo', changeUserPhoto);

module.exports = router;
