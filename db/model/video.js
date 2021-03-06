const mongoose = require('mongoose');
const Schema = mongoose.Schema;

class VideoExistsError extends Error {}
module.exports.VideoExistsError = VideoExistsError;

const videoSchema = new Schema({
  title: String,
  videoId: String,
  channelId: String,
  time: String,
});

const Video = mongoose.model('Video', videoSchema);
module.exports.model = Video;

module.exports.add = vidobj => {
  const vid = new Video();
  vid.title = vidobj.title;
  vid.videoId = vidobj.videoId;
  vid.channelId = vidobj.channelId;
  vid.time = vidobj.time;

  return Video.find({ videoId:vidobj.videoId })
    .then(results => {
      if (!results || !results.length) return vid.save();
      else throw new VideoExistsError('Video Exists');
    })

  return vid.save();
}

module.exports.findByVideoId = videoId => {
  return Video.find({ videoId })
}

module.exports.randomVideo = () => {
  return Video.count().exec()
    .then(count => {
      if (isNaN(count)) return Promise.reject(count);

      const skip = Math.floor(Math.random() * count);

      return Video.findOne().skip(skip)
    })
}
