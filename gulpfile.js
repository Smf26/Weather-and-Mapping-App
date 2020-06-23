const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify-es').default;
sass.compiler = require('node-sass');

// Minify html files
function mHtml() {
  return gulp
  .src('*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
}
gulp.task(mHtml);

// Compile SCSS TO CSS
function sassc() {
  return gulp
  .src('*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest('css'));
}
gulp.task(sassc);

// CSS TO Clean CSS
function mCss() {
  return gulp
    .src('css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('build/css'));
}
gulp.task(mCss);

// Optimize images
function imageMin() {
  return gulp
    .src('images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/images'))
}
gulp.task(imageMin);

// Minify JS files
function mJs() {
  return gulp
    .src('*.js')
    .pipe(uglify())
    .pipe(gulp.dest('build'))
}
gulp.task(mJs);

// Watch files for changes
function watch() {
  gulp.watch('*.html', mHtml);
  gulp.watch('*.scss', sassc);
  gulp.watch('*.css', mCss);
  gulp.watch('images/*', imageMin);
  gulp.watch('*.js', mJs);
}
gulp.task(watch)

// Build deployment folder
gulp.task('build', gulp.series(mHtml, sassc, mCss, imageMin, mJs));