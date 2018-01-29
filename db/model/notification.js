const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  videoId: String,
  notificationTime: Date
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports.model = Notification;

module.exports.add = notificationObj => {
  const notification = new Notification();
  notification.videoId = notificationObj.videoId || notificationObj.toString();
  notification.notificationTime = new Date();
  return notification.save();
}

module.exports.exists = videoId => {
  return Notification.find({ videoId });
}