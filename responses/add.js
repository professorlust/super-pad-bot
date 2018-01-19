const util = require('../util');

module.exports = msg => {
  const args = util.getArgs(msg);

  if (args) {
    msg.reply(`Trying to add video with title: '${args}'...`);
    const { add } = require('../db/model/video');
    add({
      title:args,
      videoId:'[VIDEO ID HERE]'
    })
      .then(added => {
        msg.reply(`You just added the video '${added.title}' (video id: ${added.videoId})`);
      })
  }
}