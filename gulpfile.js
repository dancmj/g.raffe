var gulp        = require('gulp');
var watch       = require('gulp-watch');
var concat      = require('gulp-concat');
var mochaPhantomJS = require('gulp-mocha-phantomjs');
var notify      = require('gulp-notify');
var nodemon     = require('gulp-nodemon');

require('gulp-help')(gulp, {
  description: 'Help listing.'
});

gulp.task('test', 'Runs all unit tests.', function () {
  gulp.src(['test/_testRunner.html'])
    .pipe(mochaPhantomJS({
      reporter: 'nyan',
      phantomjs: {
        useColors: true
      }
    }));
});

gulp.task('default', ['test'], function(){
  nodemon({ script: 'server.js'})
    .on('restart', ['test']);
});
