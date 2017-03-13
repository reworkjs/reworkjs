/* eslint-disable import/no-commonjs */

const fs = require('fs');
const gulp = require('gulp');
const babel = require('gulp-babel');

const babelRc = JSON.parse(fs.readFileSync('./.babelrc.node'));

gulp.task('copy', () => {
  return gulp
    .src('./src/**/*')
    .pipe(gulp.dest('./lib'));
});

gulp.task('build', ['copy'], () => {
  return gulp.src('./src/**/*.js')
    .pipe(babel(babelRc))
    .pipe(gulp.dest('./lib'));
});

gulp.task('build:watch', ['build'], () => {
  return gulp.watch('./src/**/*', ['build']);
});
