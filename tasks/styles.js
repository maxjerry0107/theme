const gulp = require('gulp');
const rename = require('gulp-rename');
const uglifyCSS = require('gulp-uglifycss');
const stylelint = require('gulp-stylelint');
const cache = require('gulp-cached');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');

const stylesEntryGlob = 'src/styles/theme.scss';
const stylesDest = 'dist/assets';

const sassSettings = {
  includePaths: ['node_modules'],
};

gulp.task('styles:dev', () => {
  return gulp
    .src(stylesEntryGlob)
    .pipe(sourcemaps.init())
    .pipe(sass(sassSettings).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write())
    .pipe(rename('bvaccel.css.liquid'))
    .pipe(gulp.dest(stylesDest));
});

gulp.task('styles:prod', () => {
  return gulp
    .src(stylesEntryGlob)
    .pipe(sass(sassSettings).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(uglifyCSS())
    .pipe(rename('bvaccel.css'))
    .pipe(gulp.dest(stylesDest));
});

gulp.task('styles:watch', (done) => {
  const lintingOptions = {
    failAfterError: false,
    reporters: [
      {
        formatter: 'string',
        console: true,
      },
    ],
  };

  gulp.watch('src/styles/**/*', gulp.series('styles:dev')).on('change', (path) => {
    return gulp
      .src(path)
      .pipe(cache('linting'))
      .pipe(stylelint(lintingOptions));
  });

  done();
});
