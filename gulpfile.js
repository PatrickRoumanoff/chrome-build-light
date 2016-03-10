const gulp = require('gulp');
const zip = require('gulp-zip');
 
gulp.task('default', () => {
	return gulp.src(['src/**', '!src/assets/*.jpg', '!src/assets/screenshot*'])
		.pipe(zip('delcom-build-light.zip'))
		.pipe(gulp.dest('dist'));
});
