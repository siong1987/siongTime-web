var path = require('path');
var fs = require('fs');
var pump = require('pump');

module.exports = function (req, res, file) {
  var ffmpeg = require('fluent-ffmpeg');

  function remux() {
    res.type('application/x-mpegURL');
    var command = ffmpeg(file.createReadStream())
      .videoCodec('copy').audioCodec('aac').format('mp4')
      .outputOptions('-movflags frag_keyframe+empty_moov')
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
