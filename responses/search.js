const util = require('../util');

module.exports = msg => {
  const query = util.getArgs(msg);

  if (query) {
    msg.reply(`You searched for ${query}!`);
    msg.reply('However, I can\'t actually search stuff yet. Try again in a little while');
  } else {
    msg.reply('You didn\'t search for anything!');
  }
}