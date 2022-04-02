const userModel = require('../models/userSchema');
const topicModel = require('../models/topicSchema');
const commentModel = require('../models/commentSchema');
const userNotificationModel = require('../models/userNotificationSchema');
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
      const notSeenNotifications = await userNotificationModel.find({
        user: oneUser._id,
        seen: false,
      });
      console.log(req.session.user);
      res.send({ success: true, oneUser, notSeenNotifications });
    } else {
      res.send({ success: false, message: 'bad creadentials' });
    }
  },
  getUser: async (req, res) => {
    const { user } = req.session;
    if (user) {
      const userInfo = await userModel.findOne({ email: user.email });
      const notSeenNotifications = await userNotificationModel.find({
        user: user._id,
        seen: false,
      });
      res.send({ success: true, userInfo, notSeenNotifications });
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
    const { title, shortDescription, description, commentsCount, viewsCount, currentUser } =
      req.body;

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
    const { comment, currentUser, currentTopic } = req.body;

    if (user) {
      const commentNew = new commentModel();
      commentNew.comment = comment;
      commentNew.createdAt = new Date();
      commentNew.user = currentUser;
      commentNew.topic = currentTopic;

      await commentNew.save();

      const topic = await topicModel.findOne({ _id: currentTopic._id });
      let newCommentsCount = Number(topic.commentsCount) + 1;
      await topicModel.findOneAndUpdate(
        { _id: currentTopic._id },
        { $set: { commentsCount: newCommentsCount } },
      );

      res.send({ success: true, message: 'Comment succesfull send', commentNew });
    } else {
      res.send({ success: false });
    }
  },
  singleTopic: async (req, res) => {
    const { topicID } = req.params;
    const topic = await topicModel.findOne({ _id: topicID }).populate('user');
    let newViewCount = Number(topic.viewsCount) + 1;
    await topicModel.findOneAndUpdate({ _id: topicID }, { $set: { viewsCount: newViewCount } });
    res.send({ success: true, topic });
  },
  userTopics: async (req, res) => {
    const { user } = req.session;
    if (user) {
      let myTopic = await topicModel.find({ user: user._id }).populate('user');
      res.send({ success: true, myTopic });
    } else {
      res.send({ success: false, message: 'No  tipic found' });
    }
  },
  userComments: async (req, res) => {
    let limit = 10;
    let skipIndex = 0;
    const { id, pageIndex } = req.params;
    if (pageIndex > 1) {
      skipIndex = (Number(pageIndex) - 1) * limit;
    }

    const { user } = req.session;
    if (user) {
      let myCommentsAll = await commentModel.count({ user: user._id });

      let myComment = await commentModel
        .find({ user: user._id })
        .populate('user')
        .skip(skipIndex)
        .limit(limit);

      res.send({ success: true, myComment, myCommentsAll });
    } else {
      res.send({ success: false, message: 'No  comment found' });
    }
  },
  allTopicComments: async (req, res) => {
    let limit = 10;
    let skipIndex = 0;
    const { id, pageIndex } = req.params;
    if (pageIndex > 1) {
      skipIndex = (Number(pageIndex) - 1) * limit;
    }

    let topicCommentsAll = await commentModel.count({ topic: id });

    let lastPage = 1;

    if (topicCommentsAll / limit > 1) {
      if (topicCommentsAll % limit !== 0) {
        let floor = Math.floor(topicCommentsAll / limit);
        lastPage = floor + 1;
      } else {
        lastPage = topicCommentsAll / limit;
      }
    }

    let topicComments = await commentModel
      .find({ topic: id })
      .populate('user')
      .sort({ createdAt: 'asc' })
      .skip(skipIndex)
      .limit(limit);

    res.send({ success: true, topicComments, totalCommentsCount: topicCommentsAll, lastPage });
  },
  createNotification: async (req, res) => {
    const { user } = req.session;
    const { content, destinationUrl, currentUser } = req.body;

    if (user) {
      const userNotification = new userNotificationModel();
      userNotification.content = content;
      userNotification.destinationUrl = destinationUrl;
      userNotification.seen = false;
      userNotification.createdAt = new Date();
      userNotification.user = currentUser;

      await userNotification.save();
      res.send({ success: true, userNotification });
    } else {
      res.send({ success: false });
    }
  },
  notificationIsSeen: async (req, res) => {
    const { user } = req.session;
    const { notificationID } = req.params;
    if (user) {
      await userNotificationModel.findOneAndUpdate(
        { _id: notificationID },
        { $set: { seen: true } },
      );
      const notSeenNotifications = await userNotificationModel.find({
        user: user._id,
        seen: false,
      });
      res.send({ success: true, notSeenNotifications });
    }
  },
  changeUserPhoto: async (req, res) => {
    const { user } = req.session;
    const { imageUrl } = req.body;
    if (user) {
      await userModel.findOneAndUpdate({ _id: user._id }, { $set: { imageUrl } });
      const userInfo = await userModel.findOne({ _id: user._id });
      res.send({ success: true, userInfo });
    }
  },
};
