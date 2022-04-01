const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userModel',
  },
  topic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'topicModel',
  },
});
module.exports = mongoose.model('commentModel', commentSchema);
