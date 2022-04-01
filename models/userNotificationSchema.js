const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userNotificationSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  destinationUrl: {
    type: String,
    required: false,
  },
  seen: {
    type: Boolean,
    required: false,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userModel',
  },
});
module.exports = mongoose.model('userNotificationModel', userNotificationSchema);
