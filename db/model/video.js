const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  title: String,
  videoId: String,
  channelId: String
});

const Video = mongoose.model('Video', videoSchema);
module.exports.model = Video;

module.exports.add = vidobj => {
  const vid = new Video();
  vid.title = vidobj.title;
  vid.videoId = vidobj.videoId;
  vid.channelId = vidobj.channelId;
  return vid.save();
}

module.exports.findByVideoId = videoId => {
  return Video.find({ videoId })
}
