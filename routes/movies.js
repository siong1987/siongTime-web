var express = require('express');
var router = express.Router();
var http = require('http');
var underscore = require('underscore');
var cache = require('../helpers/cache');

router.get('/:id', function(req, res, next) {
  var cachedMoviesList = cache.get();
  var movie = underscore.find(cachedMoviesList, function(movie) {
    return movie.id == req.params.id;
  });

  http.get("http://www.omdbapi.com/?i=" + movie.imdb + "&plot=short&r=json", function(response) {
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      var movieData = JSON.parse(body.toString());
      var directors = movieData.Director.split(", ");
      var actors = movieData.Actors.split(", ");
      var goodLinks = underscore.filter(movie.items, function(link) {
        return link.quality == "1080p" || link.quality == "720p";
      });
      var downloadLinks = underscore.map(goodLinks, function(link) {
        return {
          id: link.id,
          file: link.file,
          quality: link.quality,
          seeds: link.torrent_seeds,
          size: link.size_bytes >= 1000000000 ? (link.size_bytes / 1000000000).toFixed(3) + "GB" : (link.size_bytes / 1000000).toFixed(3) + "MB"
        }
      });
      res.render('movie', {
        movieData: movieData,
        cachedMovieData: movie,
        directors: directors,
        actors: actors,
        links: downloadLinks
      });
    });
  });
});

module.exports = router;
