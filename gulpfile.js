var gulp = require('gulp'),
    react = require('gulp-react'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch');


gulp.task('react', function () {
    return gulp.src('src/*')
        .pipe(react())
        .pipe(gulp.dest('static/js'))
        .pipe(livereload());
});


gulp.task('watch', function() {

    livereload.listen();

    // trigger the react task when src js files are changed
    gulp.watch('src/*', ['react']);

    gulp.watch('index.html').on('change', livereload.changed);

});

gulp.task('default', ['watch']);
