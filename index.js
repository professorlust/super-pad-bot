const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const path = require('path');
require('dotenv').config();
require('./db');
const { youtubeNotify, default_channel_id, esaevian_channel_id } = require('./google/youtube-notify');

const prod = process.end.NODE_ENV === 'production';

const guildIsDev = guild => guild.name.indexOf('dev') >= 0;

const shouldProcessMessage = guild => (prod && !guildIsDev(guild)) || (!prod && guildIsDev(guild));

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);

  youtubeNotify(default_channel_id, data => {
    client.guilds.forEach(guild => {
      if (shouldProcessMessage(guild)) 
        guild.systemChannel.send(`Yo! Check this out! http://youtube.com/watch?v=${data.videoId}`);
    });
  });
});

client.on('message', msg => {
  if (!shouldProcessMessage(guild)) return;

  const content = msg.content;
  const matches = content.match(/^!(\S*?)(?:$|\s)/);

  if (matches && matches.length >= 2) {
    const command = matches[1];
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
