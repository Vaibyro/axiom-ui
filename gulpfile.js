let gulp = require('gulp');
let sass = require('gulp-sass');
let postcss = require('gulp-postcss');
let sourcemaps = require('gulp-sourcemaps');
let autoprefixer = require('autoprefixer');
let cleanCSS = require('gulp-clean-css');
let browserSync = require('browser-sync');
let gulpCopy = require('gulp-copy');
var rename = require('gulp-rename');

gulp.task('sass', function () {
    return gulp.src('./scss/axiom-ui.scss')
        .pipe(sass())
        .pipe(gulp.dest('./build/css/'))
});

gulp.task('autoprefixer', ['sass'], function () {
    return gulp.src('./build/css/*.css')
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('minify', ['autoprefixer'], function () {
    return gulp.src('./dist/css/*.css')
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./dist/css/'));
});

gulp.task('copy', ['minify'], function () {
    return gulp
        .src("./dist/css/*")
        .pipe(gulpCopy('./test/html/', { prefix: 1 }))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'test/html'
        },
    })
});

gulp.task('refresh', function () {
    browserSync.reload({
        stream: true
    })
});


gulp.task('watch', ['copy', 'browserSync'], function() {
    gulp.watch('./scss/**/*.scss', ['sass', 'autoprefixer', 'minify', 'copy']);
    //gulp.watch('./test/html/*.html', ['refresh']);
});