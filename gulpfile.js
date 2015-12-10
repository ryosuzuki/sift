var gulp = require('gulp');
var browserify = require('gulp-browserify');


gulp.task('watch', function () {
  gulp.task('default')
  var watcher = gulp.watch('js/*.js', ['default']);
  watcher.on('change', function(event) {
    console.log('File was ' + event.type + ', running tasks...');
  });
})

gulp.task('default', function() {
  // Single entry point to browserify
  gulp.src('js/app.js')
    .pipe(browserify({
      insertGlobals : true,
      debug : !gulp.env.production
    }))
    .pipe(gulp.dest('./build'))
});
