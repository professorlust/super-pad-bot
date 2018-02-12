const util = require('../util');
const { videoInfo } = require('../google');
const { VideoExistsError } = require('../db/model/video');

const youtubeRegEx = new RegExp(/youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([a-zA-Z0-9-_]{11})/);
const parseYoutubeId = str => {
  if (str.length == 11 && str.indexOf('youtu') < 0) { //it's already an id
    return str;
  }
  const matches = str.match(youtubeRegEx);

  if(matches && matches.length == 2) {
    const videoId = matches[1];
    if (videoId && typeof videoId === 'string' && videoId.trim() !== '') {
      return videoId;
    }
  }

  return null;
}

const timeRegEx = new RegExp(/[?&]t=([^&?]+?)(?:$|&|\?)/);
const parseYoutubeTime = str => {
 const matches = str.match(timeRegEx);

 if (matches && matches.length == 2) {
  const time = matches[1];
  if (time && typeof time === 'string' && time.trim() !== '') {
    return time;
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
  const { title, channelId, videoId, time } = videoData;
  const vidobj = { title, channelId, videoId, time };

  return add(vidobj);
}

module.exports = msg => {
  const args = util.getArgs(msg);

  if (args) {
    msg.reply(`Trying to add video:... :thinking:`);

    const videoId = parseYoutubeId(args);
    const time = parseYoutubeTime(args);

    if (!videoId) {
      msg.reply(`Can't get the video id out of what you sent: ("${args}") :confused:`);
      return;
    }

    return fetchVideoInfo(videoId)
      .then(videoData => {
        return addVideo({...videoData, time});
      }, errData => {
        console.error("=== (add) ERROR: YOUTUBE ===");
        console.error(errData);
        return msg.reply('Sorry! I couldn\'t find that video! I\'m dumb! :upside_down:');
      })
      .then(added => {
        if (added && added.videoId) {
          return msg.reply(`Successfully added ${added.title} (${added.videoId}). Woohoo! :grin:`);
        } else {
          console.error("=== (add) ERROR: MONGOOSE ===");
          console.error(added);
          return msg.reply('I had some trouble adding your video to the database. Sorry. :sob:');
        }
      })
      .catch(err => {
        console.error("=== (add) ERROR ===")
        console.error(err);
        if (err instanceof VideoExistsError) {
          return msg.reply('Whoops! I already have that video in the database! :flushed:');
        } else {
          return msg.reply(`Whoops. I broke while getting the video info. :flushed:`);
        }
      })
      
  } else {
    return msg.reply(`Uh...did you mean to add a URL in there? :rolling_eyes:`);
  }
}