const gulpif = require('gulp-if');
const gulp = require('gulp');
const flatten = require('gulp-flatten');
const changed = require('gulp-changed');
const watch = require('gulp-watch');

function isAccountTemplate(file) {
  return file.path.includes('templates/customers');
}

gulp.task('copy', () => {
  return gulp
    .src(['src/liquid/**/*', '!src/liquid/config/settings_data.json'])
    .pipe(gulpif(isAccountTemplate, flatten({ includeParents: 2 }), flatten({ includeParents: 1 })))
    .pipe(changed('dist/', { hasChanged: changed.compareContents }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('copy:watch', (done) => {
  watch(['src/liquid/**/*', '!src/liquid/config/settings_data.json'])
    .pipe(gulpif(isAccountTemplate, flatten({ includeParents: 2 }), flatten({ includeParents: 1 })))
    .pipe(changed('dist/', { hasChanged: changed.compareContents }))
    .pipe(gulp.dest('dist/'));

  done();
});
