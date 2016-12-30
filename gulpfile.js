const browserify = require('gulp-browserify');
const cssimport = require('postcss-import');
const cssmqpacker = require('css-mqpacker');
const cssnano = require('gulp-cssnano');
const cssnext = require('postcss-cssnext');
const data = require('gulp-data');
const gulp = require('gulp');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const pug = require('gulp-pug');

const paths = require('./src/config/paths');
const pageLocals = require('./src/config/page-locals');

const { basename, join, relative } = require('path');

const getCurrentPage = file => basename(relative(paths.pagesSrc, file.path), '.pug');
const getURL = file => '/'+ (getCurrentPage(file) + '.html').replace('index.html', '');

gulp.task('pages', () =>
  gulp
    .src(join(paths.pagesSrc, '**/*.pug'))
    .pipe(data(file => ({ currentPage: getCurrentPage(file), url: getURL(file) })))
    .pipe(pug({ self: true, locals: pageLocals }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(paths.pagesDest))
);

gulp.task('scripts', () =>
  gulp
    .src(join(paths.scriptsSrc, 'main.js'))
    .pipe(browserify())
    .pipe(gulp.dest(paths.scriptsDest))
);

gulp.task('styles', () =>
  gulp
    .src(join(paths.stylesSrc, 'main.css'))
    .pipe(postcss([
      cssimport({ path: './src' }),
      cssnext({ browsers: ['last 2 chrome versions', 'last 2 ff versions'] }),
      cssmqpacker({ sort: true }),
    ]))
    .pipe(gulp.dest(paths.stylesDest))
    .pipe(cssnano())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest(paths.stylesDest))
);

gulp.task('watch', () => {
  gulp.watch(join(paths.pagesSrc, '**/*.pug'), ['pages']);
  gulp.watch(join(paths.scriptsSrc, '**/*.js'), ['scripts']);
  gulp.watch(join(paths.stylesSrc, '**/*.css'), ['styles']);
});

gulp.task('default', ['pages', 'scripts', 'styles']);

gulp.task('dev', ['default', 'watch']);
