const emailValid = require('email-validator');

module.exports = {
  validateRegistration: (req, res, next) => {
    const data = req.body;
    const user = {
      email: data.email,
      username: data.username,
      passwordOne: data.passwordOne,
      passwordTwo: data.passwordTwo,
      imageUrl: data.imageUrl,
      createdAt: data.createdAt,
    };
    if (
      (user.passwordOne.length < 4 || user.passwordOne.length > 20) &&
      (user.passwordTwo.length < 4 || user.passwordTwo.length > 20)
    ) {
      res.send({ success: false, message: `pasword don't have enought symbols` });
    } else if (user.passwordOne.length !== user.passwordTwo.length) {
      res.send({ success: false, message: `pasword  do not match` });
    } else if (data.username.length > 15) {
      res.send({ success: false, message: `username is not valid` });
    } else if (!emailValid.validate(data.email)) {
      res.send({ success: false, message: `email is not valid` });
    } else {
      next();
    }
  },
};
