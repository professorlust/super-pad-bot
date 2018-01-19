const google = require('googleapis');
require('dotenv').config();

const youtube = google.youtube({
  version:'v3',
  auth:process.env.YOUTUBE_API_KEY
});

const convertToPromise = fn => {
  return opts => {
    return new Promise((resolve, reject) => {
      fn(opts, (err, data) => {
        if (err || !data) return reject(err);
        return resolve(data);
      })
    })
  }
}

module.exports.videoInfo = convertToPromise(youtube.videos.list)