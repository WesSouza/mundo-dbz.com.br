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

const { basename, join, relative } = require('path');

const { version } = require('./package.json');

const paths = {
  pages: join(__dirname, 'src/pages'),
  scripts: join(__dirname, 'src/scripts'),
  styles: join(__dirname, 'src/styles'),
};

const pageLocals = {
  cdn: '/blobs',
  env: process.env.NODE_ENV || 'development',
  version: version,
};

gulp.task('pages', () =>
  gulp
    .src(join(paths.pages, '**/*.pug'))
    .pipe(data(file => ({ currentPage: basename(relative(paths.pages, file.path), '.pug') })))
    .pipe(pug({ self: true, locals: pageLocals }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest('.'))
);

gulp.task('scripts', () =>
  gulp
    .src(join(paths.scripts, 'main.js'))
    .pipe(browserify())
    .pipe(gulp.dest('./assets/scripts'))
);

gulp.task('styles', () =>
  gulp
    .src(join(paths.styles, 'main.css'))
    .pipe(postcss([
      cssimport({ path: './src' }),
      cssnext({ browsers: ['last 2 chrome versions', 'last 2 ff versions'] }),
      cssmqpacker({ sort: true }),
    ]))
    .pipe(gulp.dest('./assets/styles'))
    .pipe(cssnano())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('./assets/styles'))
);

gulp.task('watch', () => {
  gulp.watch(join(paths.pages, '**/*.pug'), ['pages']);
  gulp.watch(join(paths.scripts, '**/*.js'), ['scripts']);
  gulp.watch(join(paths.styles, '**/*.css'), ['styles']);
});

gulp.task('default', ['pages', 'scripts', 'styles']);

gulp.task('dev', ['default', 'watch']);
