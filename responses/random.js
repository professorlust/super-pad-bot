const { randomVideo } = require('../db/model/video');

module.exports = msg => {
  return randomVideo()
    .then(result => {
      const vidLink = `https://youtube.com/watch?v=${result.videoId}`;
      return msg.reply(`Check this one out! ${vidLink}`);
    })
    .catch(err => {
      console.error(err);
      return msg.reply('Whoops! I had trouble grabbing that. :confounded:');
    })
}