# SuperPaddyBot

Discord bot for serving up Youtube videos.

## Add to Server

https://discordapp.com/oauth2/authorize?client_id=403746447453061120&scope=bot

## Commands

```
!add [YOUTUBE_VIDEO_URL]
```

Add a video to the database. If there's a timestamp (`&t=[time]`), this is taken into account as well

```
!random
```

Serves up a random video from the database

## Features

Will post the most recent Youtube video for a specified channel (currently hardcoded to esaevian on dev, or The D-Pad on prod)

## Upcoming Commands

```
!changelog // OR !lastupdate
```

Reads the last update notes from `./changlog.txt` (Or something).

```
!remove [YOUTUBE_VIDEO_URL]
```

Removes a video from the database

```
!search [QUERY]
```

Searches the database.

```
!poll [QUESTION]
```

Creates a poll where people vote with reactions.

```
!dustin
```

Random dustin video

```
!bestof
```

Alias for `!random`...unless we want to have vids in the db that _aren't_ bestof.

## Upcoming Features / Bugfixes

- ~~Verify `youtubeNotify` response for `created` event, so bot doesn't post for `update` events.~~
  - ~~Can either try to clean this from atom feed, or on first post add it to the database, and check db before posting 'new' video.~~
  - ~~First method is preferred.~~
  - This is using a notification database. Notifications are still slow occasionally.   
- ~~`!add` takes note of timecodes in the URL, and saves that info into the database as well.~~ **added 2/12/2018**  
- ~~`!add` checking db for existing videos.~~
- Tagging videos
- `!search` actually doing something. Perhaps searching by name to return an ID, which can be used for tagging.
- Limiting videos added to a specific channel ID.

## Setup

1. Clone this repo
2. `yarn install`
3. Create `.env` file:
```
  MLAB_URI=[Mongo connection URI]
  BOT_TOKEN=[Bot user token from Discord]
  YOUTUBE_API_KEY=[API key from Google Developer Console]
  NODE_ENV=[production on server, anything else in dev]
  PSHB_CALLBACK_URL=[Url for PubSubHubBub to call when a notification happens]
```    
4. `yarn start` / `yarn dev` for auto-restart when files are updated.

### Local setup

After running the steps above, do this to expose your local server to the web for Pubsubhubbub to work.

1. Install [ngrok](http://ngrok.com)
2. Run `ngrok http 1337`, or whatever port you set in `.env` (use `PORT`, also works on command line).
3. Copy the URL given in the command line and paste it in `PSHB_CALLBACK_URL` in `.env`
