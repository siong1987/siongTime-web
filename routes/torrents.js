var express = require('express');
var router = express.Router();
var torrentStream = require('torrent-stream');
var ffmpeg = require('../helpers/ffmpeg');
var underscore = require('underscore');
var cache = require('../helpers/cache');

var torrents = {};

router.get('/:id/:torrent_id', function (req, res) {
  var torrent = torrents[req.params.torrent_id];
  if (!underscore.isUndefined(torrent)) {
    // select the largest file
    var file = torrent.files.reduce(function (a, b) {
      return a.length > b.length ? a : b;
    });

    return ffmpeg(req, res, file);
  } else {
    var cachedMoviesList = cache.get();
    var movie = underscore.find(cachedMoviesList, function(movie) {
      return movie.id == req.params.id;
    });
    var item = underscore.find(movie.items, function(link) {
      return link.id == req.params.torrent_id;
    });

    torrent = torrentStream(item.torrent_magnet);
    torrent.on('ready', function() {
      torrents[req.params.torrent_id] = torrent;

      // select the largest file
      var file = torrent.files.reduce(function (a, b) {
        return a.length > b.length ? a : b;
      });
      file.select();

      return ffmpeg(req, res, file);
    });
  }
});

router.get('/:id/:torrent_id/delete', function (req, res) {
  var torrent = torrents[req.params.torrent_id];
  if (!underscore.isUndefined(torrent)) {
    torrents[req.params.torrent_id] = undefined;

    // select the largest file
    var file = torrent.files.reduce(function (a, b) {
      return a.length > b.length ? a : b;
    });
    file.deselect();

    torrent.destroy();
    torrent.remove(function() {
      res.send('OK');
    });
  } else {
    res.send('OK');
  }
});

module.exports = router;
