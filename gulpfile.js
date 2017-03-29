/* eslint-disable import/no-commonjs */

const fs = require('fs');
const gulp = require('gulp');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const del = require('del');

// ====== Lib build ======
// Transpile to ES5

const libBabelRc = JSON.parse(fs.readFileSync('./.lib.babelrc'));

gulp.task('clean-lib', () => {
  return del(['./lib']);
});

gulp.task('copy-lib', ['clean-lib'], () => {
  return gulp
    .src('./src/**/*')
    .pipe(gulp.dest('./lib'));
});

gulp.task('build-lib', ['copy-lib'], () => {
  return gulp.src('./src/**/*.js')
    .pipe(plumber())
    .pipe(babel(libBabelRc))
    .pipe(plumber.stop())
    .pipe(gulp.dest('./lib'));
});

// ====== ES  build ======
// Like Lib but doesn't transform import statements.

const esBabelRc = JSON.parse(fs.readFileSync('./.es.babelrc'));

gulp.task('clean-es', () => {
  return del(['./es']);
});

gulp.task('copy-es', ['clean-es'], () => {
  return gulp
    .src('./src/**/*')
    .pipe(gulp.dest('./es'));
});

gulp.task('build-es', ['copy-es'], () => {
  return gulp.src('./src/**/*.js')
    .pipe(plumber())
    .pipe(babel(esBabelRc))
    .pipe(plumber.stop())
    .pipe(gulp.dest('./es'));
});

// ====== Common ======

gulp.task('build', ['build-lib', 'build-es']);

gulp.task('build:watch', ['build'], () => {
  return watch('./src/**/*', () => {
    gulp.start('build-es');
    gulp.start('build-lib');
  });
});
