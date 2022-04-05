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
    } else if (user.passwordOne !== user.passwordTwo) {
      res.send({ success: false, message: `pasword  do not match` });
    } else if (data.username.length > 15 || data.username.length === 0) {
      res.send({ success: false, message: `username is not valid` });
    } else if (!emailValid.validate(data.email)) {
      res.send({ success: false, message: `email is not valid` });
    } else {
      next();
    }
  },
  validateTopicCreation: (req, res, next) => {
    const data = req.body;
    const topic = {
      title: data.title,
      shortDescription: data.shortDescription,
      description: data.description,
    };

    if (topic.title.length < 10 || topic.title.length > 50) {
      res.send({ success: false, message: `Title should be between 10 and 50 characters` });
    } else if (topic.shortDescription.length < 10 || topic.shortDescription.length > 100) {
      res.send({
        success: false,
        message: `Short description should be between 10 and 100 characters`,
      });
    } else if (topic.description.length < 10 || topic.description.length > 500) {
      res.send({ success: false, message: `Description should be between 10 and 300 characters` });
    } else {
      next();
    }
  },
  validateCommentCreation: (req, res, next) => {
    const data = req.body;

    const userComment = {
      comment: data.comment,
    };

    if (userComment.comment.length > 500) {
      res.send({
        success: false,
        message: `Comment shouldn 't be greater then 500 characters long`,
      });
    } else if (userComment.comment.length === 0) {
      res.send({
        success: false,
        message: `Comment is required`,
      });
    } else {
      next();
    }
  },
  validateUserImgUpload: (req, res, next) => {
    const data = req.body;
    let urlReg = /\b(http|https)/;

    const userPhoto = {
      imageUrl: data.imageUrl,
    };

    if (!urlReg.test(userPhoto.imageUrl)) {
      res.send({
        success: false,
        message: `Wrong image url`,
      });
    } else {
      next();
    }
  },
};
