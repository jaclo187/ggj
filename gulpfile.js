let gulp = require('gulp');
let notify = require('gulp-notify');
let stylus = require('gulp-stylus');

gulp.task('stylus', function () {
    return gulp.src('./01_Grid/styles/*.styl')
      .pipe(stylus())
      .pipe(notify("Stylus was compiled correctly!"))
      .pipe(gulp.dest('./01_Grid/styles/css/'));
});

gulp.task('watch', function () {
    gulp.watch('./01_Grid/styles/*.styl', gulp.series('stylus'));
});

