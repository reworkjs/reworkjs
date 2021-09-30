/* eslint-disable import/no-commonjs */

// @flow

const del = require('del');
const gulp = require('gulp');
const babel = require('gulp-babel');
const plumber = require('gulp-plumber');
const watch = require('gulp-watch');

const FRAMEWORK_BABEL_PRESET = `${__dirname}/src/internals/babel/internal-babel-preset`;

// ====== Lib build ======
// Transpile to ES5

function cleanLib() {
  return del(['./lib']);
}

// ['clean-lib']
function copyLib() {
  return gulp
    // copy all except ts & js files
    .src('./src/!(gatsby-theme-docz)/**/!(*.js|*.jsx|*.ts|*.tsx)')
    .pipe(gulp.dest('./lib'));
}

function compileLib() {
  // transpile & copy js/ts files to js
  return gulp.src('./src/!(gatsby-theme-docz)/**/*.{js,jsx,ts,tsx}')
    .pipe(plumber())
    .pipe(babel({
      presets: [
        [FRAMEWORK_BABEL_PRESET, { buildEsModules: true }],
      ],
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest('./lib'));
}

const buildLib = gulp.series(cleanLib, copyLib, compileLib);

// ====== ES  build ======
// Like Lib but doesn't transform import statements.

function cleanEs() {
  return del(['./es']);
}

function copyEs() {
  return gulp
    .src('./src/!(gatsby-theme-docz)/**/!(*.js|*.jsx|*.ts|*.tsx)')
    .pipe(gulp.dest('./es'));
}

function compileEs() {
  return gulp.src('./src/!(gatsby-theme-docz)/**/*.{js,jsx,ts,tsx}')
    .pipe(plumber())
    .pipe(babel({
      presets: [
        [FRAMEWORK_BABEL_PRESET, { buildEsModules: false }],
      ],
    }))
    .pipe(plumber.stop())
    .pipe(gulp.dest('./es'));
}

const buildEs = gulp.series(cleanEs, copyEs, compileEs);

// ====== Common ======

const buildAll = gulp.parallel([buildEs, buildLib]);

gulp.task('build', buildAll);

gulp.task('build:watch', gulp.series(buildAll, () => {
  return watch('./src/**/*', buildAll);
}));
