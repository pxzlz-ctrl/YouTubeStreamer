const express = require('express');
const ytdl = require('ytdl-core');
const app = express();
const port = process.env.PORT || 8080;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/uptime', (req, res) => {
  res.send('Hello World!');
});

app.get('/video', async (req, res) => {
  const videoUrl = req.query.url;

  try {
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'no-cache');

    const info = await ytdl.getInfo(videoUrl);
    const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });

    ytdl(videoUrl, {
      format: videoFormat
    }).pipe(res);
  } catch (error) {
    res.status(500).send('Error streaming video');
  }
});

app.get('/audio', async (req, res) => {
  const videoUrl = req.query.url;

  try {
    res.setHeader('Content-Type', 'audio/mp3');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'no-cache');

    const info = await ytdl.getInfo(videoUrl);
    const audioFormat = ytdl.filterFormats(info.formats, 'audioonly')[0];

    const audioStream = ytdl.downloadFromInfo(info, { format: audioFormat });

    audioStream.pipe(res);
  } catch (error) {
    res.status(500).send('Error streaming audio');
  }
});

app.get('/videoInfo', async (req, res) => {
  const videoUrl = req.query.url;

  try {
    const info = await ytdl.getInfo(videoUrl);

    const videoInfo = {
      title: info.videoDetails.title,
      uploader: info.videoDetails.author.name,
      viewCount: info.videoDetails.viewCount
    };

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    res.json(videoInfo);
  } catch (error) {
    res.status(500).send('Error retrieving video information');
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
