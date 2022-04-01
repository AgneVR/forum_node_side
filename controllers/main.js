const userModel = require('../models/userSchema');
const topicModel = require('../models/topicSchema');
const commentModel = require('../models/commentSchema');
const bcrypt = require('bcrypt');

module.exports = {
  register: async (req, res) => {
    const { email, username, passwordOne, imageUrl } = req.body;
    const passwordFirst = passwordOne;
    const hash = await bcrypt.hash(passwordFirst, 10);

    const userExist = await userModel.findOne({ username });
    if (userExist) return res.send({ success: false, message: 'username is taken' });
    const userEmailExist = await userModel.findOne({ email });
    if (userEmailExist) return res.send({ success: false, message: 'email is taken' });
    const user = new userModel();
    user.email = email;
    user.username = username;
    user.passwordOne = hash;
    user.imageUrl = imageUrl;
    user.createdAt = new Date();

    await user.save();
    res.send({ success: true, message: 'user created', user });
  },

  login: async (req, res) => {
    const data = req.body;
    const oneUser = await userModel.findOne({ email: data.email });
    if (!oneUser) return res.send({ success: false, message: 'bad creadentials' });
    const compare = await bcrypt.compare(data.passwordOne, oneUser.passwordOne);
    if (compare) {
      req.session.user = oneUser;
      console.log(req.session.user);
      res.send({ success: true, oneUser });
    } else {
      res.send({ success: false, message: 'bad creadentials' });
    }
  },
  getUser: async (req, res) => {
    const { user } = req.session;
    if (user) {
      const userInfo = await userModel.findOne({ email: user.email });
      res.send({ success: true, userInfo });
    } else {
      res.send({ success: false, message: 'you are not logged in' });
    }
  },
  logout: (req, res) => {
    req.session.destroy(null);
    res.send({ success: true });
  },
  createTopic: async (req, res) => {
    const { user } = req.session;
    const {
      title,
      shortDescription,
      description,
      commentsCount,
      viewsCount,
      createdAt,
      currentUser,
    } = req.body;

    if (user) {
      const topic = new topicModel();
      topic.title = title;
      topic.shortDescription = shortDescription;
      topic.description = description;
      topic.commentsCount = commentsCount;
      topic.viewsCount = viewsCount;
      topic.createdAt = new Date();
      topic.user = currentUser;

      await topic.save();
      res.send({ success: true, message: 'Topic succesfull created', topic });
    } else {
      res.send({ success: false });
    }
  },
  topics: async (req, res) => {
    let topics = await topicModel.find({}).sort({ createdAt: 'desc' }).populate('user');
    res.send({ success: true, topics });
  },
  createComment: async (req, res) => {
    const { user } = req.session;
    const { comment, createdAt, currentUser, currentTopic } = req.body;

    if (user) {
      const commentNew = new topicModel();
      commentNew.comment = comment;
      commentNew.createdAt = new Date();
      commentNew.user = currentUser;
      commentNew.topic = currentTopic;

      await commentNew.save();
      res.send({ success: true, message: 'Comment succesfull send', commentNew });
    } else {
      res.send({ success: false });
    }
  },
};
