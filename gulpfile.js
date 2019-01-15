// Gulp
var gulp = require('gulp')

// CSS
var sass = require('gulp-sass')
var cleanCss = require('gulp-clean-css')
var sourceMaps = require('gulp-sourcemaps')

// Image minifier
var imagemin = require('gulp-imagemin')

// Real time preview
var browserSync = require('browser-sync').create();

// GH Pages deploy
var ghpages = require('gh-pages')

sass.compiler = require('node-sass')

gulp.task("sass", function() {
	// we want to run "sass css/app.scss app.css --watch"
	return gulp.src("src/css/app.scss")
		.pipe(sourceMaps.init())
		.pipe(sass())
		.pipe(
			cleanCss({
				compatibility: 'ie8'
			})
		)
		.pipe(sourceMaps.write())
		.pipe(gulp.dest("dist"))
		.pipe(browserSync.stream())
})

gulp.task("html", function () {
	return gulp.src("src/*.html")
		.pipe(gulp.dest("dist"))
})

gulp.task("fonts", function () {
	return gulp.src("src/fonts/*")
		.pipe(gulp.dest("dist/fonts"))
})

gulp.task("images", function () {
	return gulp.src("src/img/*")
		.pipe(imagemin()) // minifying images
		.pipe(gulp.dest("dist/img"))
})

gulp.task("watch", function () {

	browserSync.init({
		server: {
			baseDir: "dist"
		},
		notify: false
	});

	gulp.watch("src/*.html", gulp.series("html")).on('change', browserSync.reload)
	gulp.watch("src/css/app.scss", gulp.series("sass"))
	gulp.watch("src/fonts/*", gulp.series("fonts"))
	gulp.watch("src/img/*", gulp.series("images"))
})

gulp.task("deploy", function () {
	ghpages.publish("dist")
})

gulp.task('default', gulp.parallel("html", "sass", "fonts", "images", "watch"))