const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const path = require('path');
require('dotenv').config();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
  const content = msg.content;
  const matches = content.match(/^!(\S*?)(?:$|\s)/);

  console.log(`matches: ${JSON.stringify(matches)}`);

  if (matches && matches.length >= 2) {
    const command = matches[1];
    console.log(`got command: ${command}`)
    fs.stat(path.resolve('./responses', `${command}.js`), (err, stats) => {
      if (!err && stats) {
        require(`./responses/${command}.js`)(msg);
      } else {
        msg.reply(`I don\'t understand the command: ${command}`);
      }
    });
  }
});

client.login(process.env.BOT_TOKEN);
