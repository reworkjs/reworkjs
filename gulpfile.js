/* eslint-disable import/no-commonjs */

const fs = require('fs');
const gulp = require('gulp');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const del = require('del');

const babelRc = JSON.parse(fs.readFileSync('./.babelrc.node'));

gulp.task('clean', () => {
  return del(['./lib']);
});

gulp.task('copy', ['clean'], () => {
  return gulp
    .src('./src/**/*')
    .pipe(gulp.dest('./lib'));
});

gulp.task('build', ['copy'], () => {
  return gulp.src('./src/**/*.js')
    .pipe(plumber())
    .pipe(babel(babelRc))
    .pipe(plumber.stop())
    .pipe(gulp.dest('./lib'));
});

gulp.task('build:watch', ['build'], () => {
  return watch('./src/**/*', () => gulp.start('build'));
});
