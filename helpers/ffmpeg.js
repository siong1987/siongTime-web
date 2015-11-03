var path = require('path');
var fs = require('fs');
var pump = require('pump');

module.exports = function (req, res, file) {
  var ffmpeg = require('fluent-ffmpeg');

  function remux() {
    res.type('application/x-mpegURL');
    var command = ffmpeg(file.createReadStream())
      .outputOptions([
        '-vcodec libx264',
        '-pix_fmt yuv420p',
        '-segment_list_type m3u8',
        '-map 0:v',
        '-map 0:a:0',
        '-c:a mp3',
        '-ar 44100',
        '-f hls',
        '-hls_time 10',
        '-hls_list_size 6',
        '-hls_wrap 18',
        '-start_number 1',
        '-deinterlace',
        '-threads 0',
        '-loglevel quiet',
        '-ac 2',
        '-b:a 160000'
      ])
      .on('start', function (cmd) {
        console.log(cmd);
      })
      .on('error', function (err) {
        console.error(err);
      });
    pump(command, res);
  }

  return remux();
};
