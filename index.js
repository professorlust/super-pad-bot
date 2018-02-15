const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const path = require('path');
require('dotenv').config();
require('./db');
const { youtubeNotify, default_channel_id, esaevian_channel_id } = require('./google/youtube-notify');

const prod = process.env.NODE_ENV === 'production';

let dev_react = "\u2692"; //hammerpick

const target_channel = prod ? default_channel_id : esaevian_channel_id;

const guildIsDev = guild => guild && guild.name.indexOf('dev') >= 0;

const shouldProcessMessage = guild => (prod && !guildIsDev(guild)) || (!prod && guildIsDev(guild));

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);

  console.log(client.guilds);

  // TODO: here, client.guilds has channel references, but later in the 
  // youtubeNotify callback it doesn't. So we should shave the channel refs
  // immediately, and just call out to them later

  youtubeNotify(target_channel, data => {
    if (!data || !data.videoId) {
      console.log("Bot: No notification.");
      return;
    }

    client.guilds.forEach(guild => {
      if (shouldProcessMessage(guild)) {
        const botChannels = guild.channels.filter(c => c.name.toLowerCase().indexOf('bot') >= 0 || c.name.toLowerCase().indexOf('videos') >= 0);
        const targetChannel = botChannels.length ? botChannels[0] :null;

        console.log(JSON.stringify({guildChannels:guild.channels, guild, botChannels}, null, 1));

        if (targetChannel) {
          targetChannel.send(`Yo! Check this out! http://youtube.com/watch?v=${data.videoId}`)
            .then(message => {
              if (!prod) {
                message.react(dev_react)
              }
            });
        } else {
          guild.owner.send('Uhh...where am I supposed to post? Make a channel that has \'bot\' in the name.');
        }
      }
    });
  });
});

client.on('debug', msg => {
  if (msg.indexOf('token') >= 0)
    msg = "Message including 'token' [REDACTED]";

  console.log("=== DISCORD DEBUG === "+JSON.stringify(msg, null, 1));
})

client.on('message', msg => {
  if (!shouldProcessMessage(msg.guild)) return;

  const content = msg.content;
  const matches = content.match(/^!(\S*?)(?:$|\s)/);

  if (matches && matches.length >= 2) {
    const command = matches[1];
    fs.stat(path.resolve('./responses', `${command}.js`), (err, stats) => {
      if (!err && stats) {
        const msg_promise = require(`./responses/${command}.js`)(msg);
        if (msg_promise && msg_promise.then) {
          msg_promise.then(message => {
            if (!prod) message.react(dev_react)
          })
        }
      } else {
        msg.reply(`I don\'t understand the command: ${command}`)
          .then(message => {
            if (!prod) message.react(dev_react);
          });
      }
    });
  }
});

client.login(process.env.BOT_TOKEN);
