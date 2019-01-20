// Gulp
const gulp = require('gulp')

// CSS
const cleanCss = require('gulp-clean-css')
const sourceMaps = require('gulp-sourcemaps')
const postcss = require('gulp-postcss')
const sourceMaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')

// Image minifier
const imagemin = require('gulp-imagemin')

// Real time preview
const browserSync = require('browser-sync').create();

// GH Pages deploy
const ghpages = require('gh-pages')



gulp.task("css", function() {
	return gulp.src([
		"src/css/reset.css",
		"src/css/typography.css",
		"src/css/app.css"
	])
		.pipe(sourceMaps.init())
		.pipe(
			postcss([
				require("autoprefixer"),
				require("postcss-preset-env")({
					stage: 1,
					browsers: ["IE 11", "last 2 versions"]
				})
			])
		)
		.pipe(concat("app.css"))
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
	gulp.watch("src/css/*", gulp.series("css"))
	gulp.watch("src/fonts/*", gulp.series("fonts"))
	gulp.watch("src/img/*", gulp.series("images"))
})

gulp.task("deploy", function (done) {
	ghpages.publish("dist")
	done()
})

gulp.task('default', gulp.parallel("html", "css", "fonts", "images", "watch"))