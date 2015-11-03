var express = require('express');
var router = express.Router();
var http = require('http');
var underscore = require('underscore');
var cache = require('../helpers/cache');

/* GET home page. */
router.get('/', function(req, res, next) {
  http.get("[API]", function(response) {
    var body = '';
    response.on('data', function(d) {
      body += d;
    });
    response.on('end', function() {
      var moviesList = JSON.parse(body.toString())['MovieList'];
      cache.set(moviesList);

      var movies = underscore.map(moviesList, function(movie) {
        return {
          id: movie.id,
          title: movie.title + " (" + movie.rating + ")",
          poster: movie.poster_big
        }
      });
      res.render('index', { movies: movies });
    });
  });
});

module.exports = router;
