var gulp = require('gulp');
var mocha = require('gulp-mocha');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

var outDir = 'lib';
var tsSources = 'src/**/*.ts';

gulp.task('clean', function () {
  return del([outDir + '/**/*']);
});

gulp.task('tslint', function () {
  var tslint = require('gulp-tslint');
  return gulp.src(tsSources)
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
});

var tsProject;

gulp.task('build', function () {
  var typescript = require('gulp-typescript');
  if (!tsProject) {
    tsProject = typescript.createProject('src/tsconfig.json', {
      noExternalResolve: true,
      sortOutput: true
    });
  }
  return gulp.src([tsSources])
    .pipe(sourcemaps.init())
    .pipe(typescript(tsProject))
    .js
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(outDir));
});

gulp.task('watch', ['build'], function () {
  gulp.watch(tsSources, ['build']);
});

function handleError(err) {
  this.emit('end');
}

gulp.task('test', ['build'], function () {
  return gulp.src('lib/specs/*.js')
    .pipe(mocha({
      reporter: 'tap',
      require: ['source-map-support/register']
    }))
    .on('error', handleError);
});

gulp.task('bdd', ['test'], function () {
  gulp.watch(tsSources, ['test']);
});