const gulp = require('gulp');
const rename = require('gulp-rename');
const eslint = require('gulp-eslint');
const cache = require('gulp-cached');
const webpack = require('webpack-stream');

const webpackDev = require('../webpack.dev.js');
const webpackProd = require('../webpack.prod.js');

const scriptsEntryGlob = 'src/scripts/bvaccel.js';
const scriptsWatchGlob = ['src/scripts/**/*', 'src/styles/theme.scss', 'src/styles/functions/*.scss', 'src/styles/settings/*.scss', 'src/styles/utilities/*.scss'];
const scriptsDest = 'dist/assets';

function clearCacheString(file) {
  if (file.extname.indexOf('?') !== -1) {
    /* eslint-disable no-param-reassign */
    [file.extname] = file.extname.split('?');
    /* eslint-enable no-param-reassign */
  }

  return file;
}

gulp.task('scripts:dev', (done) => {
  return gulp
    .src(scriptsEntryGlob)
    .pipe(webpack(webpackDev))
    .pipe(rename((file) => clearCacheString(file)))
    .on('error', (err) => done(err))
    .pipe(gulp.dest(scriptsDest))
    .on('end', () => done());
});

gulp.task('scripts:prod', (done) => {
  gulp
    .src(scriptsEntryGlob)
    .pipe(webpack(webpackProd))
    .pipe(rename((file) => clearCacheString(file)))
    .on('error', (err) => done(err))
    .pipe(gulp.dest(scriptsDest))
    .on('end', () => done());
});

gulp.task('scripts:watch', (done) => {
  gulp.watch(scriptsWatchGlob, gulp.series('scripts:dev')).on('change', (path) => {
    return gulp
      .src(path)
      .pipe(cache('linting'))
      .pipe(eslint())
      .pipe(eslint.format());
  });

  done();
});
