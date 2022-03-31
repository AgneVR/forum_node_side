const userModel = require('../models/userSchema');
const bcrypt = require('bcrypt');

module.exports = {
  register: async (req, res) => {
    const { username, passwordOne } = req.body;
    const passwordFirst = passwordOne;
    const hash = await bcrypt.hash(passwordFirst, 10);

    const userExist = await userModel.findOne({ username });
    if (userExist) return res.send({ success: false, message: 'username is taken' });
    const user = new userModel();
    user.username = username;
    user.passwordOne = hash;

    await user.save();
    res.send({ success: true, message: 'user created', user });
  },

  login: async (req, res) => {
    const data = req.body;
    const oneUser = await userModel.findOne({ username: data.username });
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
};
