const util = require('../util');

module.exports = msg => {
  const query = util.getArgs(msg);

  if (query) {
    msg.reply(`You searched for ${query}!`);
  } else {
    msg.reply('You didn\'t search for anything!');
  }
}