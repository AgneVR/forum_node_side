const userModel = require('../models/userSchema');
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
};
