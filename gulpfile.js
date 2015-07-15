var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var mochaPhantomJS = require('gulp-mocha-phantomjs')

gulp.task('default', ['test'], function(){
  nodemon({ script: 'server.js'})
    .on('restart', ['test']);
});

gulp.task('test', function () {
  gulp
    .src(['./test/helpers/*.js','./test/**/*.test.js'])
    .pipe(mocha({reporter: 'spec'}))
  // gulp
  //   .src(['test/_testRunner.html'])
  //   .pipe(mochaPhantomJS({reporter: 'spec'}));
});
