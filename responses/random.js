const { randomVideo } = require('../db/model/video');

module.exports = msg => {
  return randomVideo()
    .then(result => {
      const vidLink = `https://youtube.com/watch?v=${result.videoId}${result.time ? `&t=${result.time}` : ``}`;
      return msg.channel.send(`Check this one out! ${vidLink} :popcorn: (requested by: <@${msg.author.id}>)`);
    })
    .catch(err => {
      console.error("=== (random) ERROR ===");
      console.error(err);
      return msg.reply('Whoops! I had trouble grabbing that. :confounded:');
    })
}