const { exec } = require('child_process');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const cssimport = require('postcss-import');
const cssnano = require('cssnano');
const postcssPresetEnv = require('postcss-preset-env');
const data = require('gulp-data');
const gulp = require('gulp');
const log = require('gulplog');
const pageLocals = require('./src/config/page-locals');
const paths = require('./src/config/paths');
const postcss = require('gulp-postcss');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');

const { join, relative } = require('path');

const getCurrentPage = file =>
  relative(paths.pagesSrc, file.path).replace(/\.pug$/, '');
const getURL = file =>
  '/' + (getCurrentPage(file) + '.html').replace('index.html', '');

gulp.task('gallery', cb => {
  exec('node src/modules/gallery-generator/index.js', (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('pages', () =>
  gulp
    .src(join(paths.pagesSrc, '**/*.pug'))
    .pipe(
      data(file => ({ currentPage: getCurrentPage(file), url: getURL(file) }))
    )
    .pipe(pug({ self: true, locals: pageLocals }))
    .pipe(rename({ extname: '.html' }))
    .pipe(gulp.dest(paths.pagesDest))
);

gulp.task('scripts', () => {
  // set up the browserify instance on a task basis
  const bundler = browserify({
    entries: join(paths.scriptsSrc, 'main.js'),
  });

  return bundler
    .bundle()
    .pipe(source('main.js'))
    .pipe(buffer())
    .on('error', log.error)
    .pipe(gulp.dest(paths.scriptsDest));
});

gulp.task('styles', () =>
  gulp
    .src(join(paths.stylesSrc, 'main.css'))
    .pipe(
      postcss([
        cssimport({ path: './src' }),
        postcssPresetEnv({
          browsers: ['last 2 chrome versions', 'last 2 safari versions'],
          features: { 'custom-media-queries': true, 'nesting-rules': true },
        }),
        cssnano(),
      ])
    )
    .pipe(gulp.dest(paths.stylesDest))
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest(paths.stylesDest))
);

gulp.task('watch', () => {
  gulp.watch(
    join(paths.templatesSrc, '**/*.pug'),
    gulp.parallel('gallery', 'pages')
  );
  gulp.watch(join(paths.pagesSrc, '**/*.pug'), gulp.series('pages'));
  gulp.watch(join(paths.scriptsSrc, '**/*.js'), gulp.series('scripts'));
  gulp.watch(join(paths.stylesSrc, '**/*.css'), gulp.series('styles'));
});

gulp.task('default', gulp.parallel('gallery', 'pages', 'scripts', 'styles'));

gulp.task('dev', gulp.series('default', 'watch'));
