const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const videoSchema = new Schema({
  title: String,
  videoId: String
});

const Video = mongoose.model('Video', videoSchema);
module.exports.model = Video;

module.exports.add = vidobj => {
  const vid = new Video();
  vid.title = vidobj.title;
  vid.videoId = vidobj.videoId;
  return vid.save();
}

module.exports.findByVideoId = videoId => {
  return Video.find({ videoId })
}
