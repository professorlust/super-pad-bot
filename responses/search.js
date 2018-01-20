const util = require('../util');

module.exports = msg => {
  const query = util.getArgs(msg);

  if (query) {
    return msg.reply(`You searched for ${query}!\nHowever, I can\'t actually search stuff yet. :upside_down: Try again in a little while`);
  } else {
    return msg.reply('You didn\'t search for anything! Dummy.');
  }
}