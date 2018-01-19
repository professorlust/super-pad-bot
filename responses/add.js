const util = require('../util');
const { videoInfo } = require('../google');

const youtubeRegEx = new RegExp(/youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([a-zA-Z0-9-_]{11})/);
const parseYoutubeId = str => {
  if (str.length == 11 && str.indexOf('youtu') < 0) { //it's already an id
    return str;
  }
  const matches = str.match(youtubeRegEx);

  if(matches && matches.length == 2) {
    const videoId = matches[1];
    if (videoId && typeof videoId == 'string' && videoId.trim() !== '') {
      return videoId;
    }
  }

  return null;
}

const fetchVideoInfo = videoId => {
  const videoInfoOpts = {
    part:'id, snippet',
    id:videoId
  };

  return videoInfo(videoInfoOpts)
    .then(videoData => {
      if (videoData.items && videoData.items.length > 0) {
        const vid = videoData.items[0];
        return {
          channelId:vid.snippet.channelId,
          title:vid.snippet.title,
          videoId:vid.id
        }
      } else {
        return Promise.reject(videoData);
      }
    })
}

const addVideo = videoData => {
  const { add } = require('../db/model/video');
  const { title, channelId, videoId } = videoData;
  const vidobj = { title, channelId, videoId };

  return add(vidobj);
}

module.exports = msg => {
  const args = util.getArgs(msg);

  if (args) {
    msg.reply(`Trying to add video:... :thinking:`);

    const videoId = parseYoutubeId(args);

    if (!videoId) {
      msg.reply(`Can't get the video id out of what you sent: ("${args}") :confused:`);
      return;
    }

    fetchVideoInfo(videoId)
      .then(videoData => {
        return addVideo(videoData);
      }, errData => {
        console.error("=== ERROR: YOUTUBE ===")
        msg.reply('Sorry! I couldn\'t find that video! I\'m dumb! :upside_down:');
        return Promise.reject(errData);
      })
      .then(added => {
        if (added) {
          msg.reply(`Successfully added ${added.title} (${added.videoId}). Woohoo! :grin:`);
        } else {
          console.error("=== ERROR: MONGOOSE ===");
          msg.reply('I had some trouble adding your video. Sorry. :sob:');
        }
      })
      .catch(err => {
        console.error(JSON.stringify(err, null ,1));
      });
  }
}