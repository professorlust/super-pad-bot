const pubsubhubbub = require('pubsubhubbub');
const { parseString } = require('xml2js');
require('dotenv').config();

const esaevian_channel_id = "UC-axOOcVezH71BqO9zYw_OQ"; 
const dpad_channel_id = "UC_fsb-5q3QH-CXJ79YgrWfg";
const topic_base = `https://www.youtube.com/xml/feeds/videos.xml?channel_id=`;
const hub = "https://pubsubhubbub.appspot.com/subscribe";

const port = process.env.PORT || 1337;
const callback_url = process.env.PSHB_CALLBACK_URL;

const opts = {
  callbackUrl:`${callback_url}`
};

let subscriber = null;

const doSubscribe = topic => {
  if (subscriber.subscribe) {
    subscriber.subscribe(topic, hub, err => {
      if (err) console.error(JSON.stringify(data, null, 1));
    })
  }
}

module.exports.default_channel_id = module.exports.dpad_channel_id = dpad_channel_id;
module.exports.esaevian_channel_id = esaevian_channel_id;

module.exports.youtubeNotify = (channel_id, cb) => {
  const topic = `${topic_base}${channel_id}`;

  if (!subscriber) {
    subscriber = pubsubhubbub.createServer(opts);
    subscriber.listen(port);

    subscriber.on('error', data => {
      console.log('error');
      console.log(JSON.stringify(data, null, 1));
    });

    subscriber.on('subscribe', data => {
      console.log('subscribe start');
      console.log(JSON.stringify(data, null, 1));
    });

    subscriber.on('listen', () => { console.log(`listening on:${JSON.stringify(subscriber.server.address())}`); doSubscribe(topic) });
  } else {
    doSubscribe(topic);
  }

  subscriber.on('feed', data => {
    if (cb) {
      if (data && data.feed && data.feed.toString) {
        parseString(data.feed.toString(), (err, result) => {
          if (err || !result) cb(null);
          const vidobj = {
            title:result.feed.entry[0].title[0],
            channelId:result.feed.entry[0]['yt:channelId'][0],
            videoId:result.feed.entry[0]['yt:videoId'][0]
          }
          cb(vidobj);
        });
      } else {
        cb(null);
      }
    }
  })
}

