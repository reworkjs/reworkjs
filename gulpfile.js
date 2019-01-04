/* eslint-disable import/no-commonjs */

const gulp = require('gulp');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const del = require('del');

const FRAMEWORK_BABEL_PRESET = `${__dirname}/src/internals/babel/internal-babel-preset`;

// ====== Lib build ======
// Transpile to ES5

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
    .pipe(babel({
      presets: [
        [FRAMEWORK_BABEL_PRESET, { buildEsModules: true }],
      ],
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest('./lib'));
});

// ====== ES  build ======
// Like Lib but doesn't transform import statements.

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
    .pipe(babel({
      presets: [
        [FRAMEWORK_BABEL_PRESET, { buildEsModules: false }],
      ],
    }))
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
