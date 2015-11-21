var gulp = require('gulp');
var mocha = require('gulp-mocha');
var del = require('del');
var path = require('path');

var outDir = 'out';
var sources = [
  'src/**/*.ts',
  'specs/**/*.ts'
];
var typings = [
  'typings/**/*.ts'
];
var sourcesToBuild = sources.concat(typings);
var specsToRun = outDir + '/specs/**/*.js';

var compilation;

gulp.task('clean', function () {
  return del([outDir + '/**/*']);
});

gulp.task('tslint', function () {
  var tslint = require('gulp-tslint');
  return gulp.src(sources, { base: '.' })
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

gulp.task('build', function () {
  var typescript = require('gulp-tsb');
  if (!compilation) {
    compilation = typescript.create('./tsconfig.json');
  }
  return gulp.src(sourcesToBuild, { base: '.' })
    .pipe(compilation())
    .pipe(gulp.dest(outDir));
});

gulp.task('test', ['build'], function () {
  return gulp.src(specsToRun)
    .pipe(mocha({
      reporter: 'tap',
      require: ['source-map-support/register']
    }))
    .on('error', function () {
      this.emit('end');
    });
});

gulp.task('watch', ['build'], function () {
  gulp.watch(sources, ['build']);
});

gulp.task('bdd', ['test'], function () {
  gulp.watch(sources, ['test']);
});