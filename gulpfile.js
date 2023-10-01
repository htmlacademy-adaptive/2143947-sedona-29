import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import autoprefixer from 'autoprefixer';
import rename from 'gulp-rename';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import del from 'del';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//Html

export const minify = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest('build'))
}

//Scripts

export const scripts = () => {
  return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(rename('scripts.min.js'))
  .pipe(gulp.dest('build/js'))
}

//Images

export const optimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img/'))
}

export const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img/'))
}

//Webp

export const createWebpFromJpg = () => {
  return gulp.src('source/img/jpg/*.jpg')
  .pipe(squoosh({
    webp: {},
  }))
  .pipe(gulp.dest('build/img/webp'))
}

export const createWebpFromPng = () => {
  return gulp.src('source/img/png/*.png')
  .pipe(squoosh({
    webp: {},
  }))
  .pipe(gulp.dest('build/img/webp'))
}

//Svg

export const optimizeSvg = () => {
  return gulp.src('source/img/svg/*.svg')
  .pipe(svgo())
  .pipe(gulp.dest('build/img/svg'))
}

export const sprite = () => {
  return gulp.src('source/img/svg/sprite-source/*.svg')
  .pipe(svgo())
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img/svg'))
}

// Copy

const copy = (done) => {
  gulp.src([
  'source/fonts/*.{woff2,woff}',
  'source/*.ico',
  'source/*.webmanifest',
  'source/*.xml',
  ], {
  base: 'source'
  })
  .pipe(gulp.dest('build'))
  done();
  }

// Clean

const clean = () => {
  return del('build');
  };

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
    browser: "chrome"
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
  }

  // Watcher

  const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/*.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(minify, reload));
  gulp.watch('source/css/*.css', gulp.series(styles, reload));
  }

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    minify,
    scripts,
    optimizeSvg,
    sprite,
    createWebpFromJpg,
    createWebpFromPng
  ));

// Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    minify,
    scripts,
    optimizeSvg,
    sprite,
    createWebpFromJpg,
    createWebpFromPng
  ),
  gulp.series(
    server,
    watcher
  ));
