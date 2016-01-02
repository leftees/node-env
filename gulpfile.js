/*
 |
 | Importing some gulp plugins
 |
 */
var Gulp = require('gulp');
var Less = require('gulp-less');
var Path = require('path');
var Nano = require('gulp-cssnano');
var Sourcemaps = require('gulp-sourcemaps');
var Concat = require('gulp-concat');
var Browserify = require('gulp-browserify');
var Uglify = require('gulp-uglify');
var Watch = require('gulp-watch');


/*
 |
 | Gulp structure based on app being developed
 |
 */
var App = {
	config: {
		bowerDir: '',
		npmDir: '',
		sourcemaps: false
	}
};

App.config.bowerDir = './bower_components/';
App.config.npmDir = './node_modules/';
App.config.sourcemaps = true;

/*
 |
 | Gulp Tasks
 |
 */

Gulp.task('less', function () {
	return Gulp.src('./app-build/app/less/**/*.less')
		.pipe(Sourcemaps.init())
		.pipe(Less({
			paths: [
				App.config.bowerDir + 'bootstrap/less/',
				'./app-build/app/less/pages.less'
			]
		}))
		.pipe(Concat('app.css'))
		.pipe(Nano())
		.pipe(Sourcemaps.write())
		.pipe(Gulp.dest('./public/app/css'));
});

Gulp.task('watch-less', function(){
	Gulp.watch('./app-build/app/less/**/*.less', ['less']);
});

// var lessStarterTask = function(){
	
// }

Gulp.task('js', function(){
	return Gulp.src('./app-build/app/js/**/*.js')
		.pipe(Browserify(
		{
			// insertGlobals: true,
			shim: {
				jquery: {
					path: App.config.bowerDir + 'jquery/dist/jquery.js',
					exports: '$'
				},
				bootstrap: {
					path: App.config.bowerDir + 'bootstrap/dist/js/bootstrap.js',
					exports: 'bootstrap',
					depends: {
						jquery: '$'
					}
				},
				vue: {
					path: App.config.npmDir + 'vue/dist/vue.js',
					exports: 'vue'
				}
			}
		}
		))
		.pipe(Uglify())
		.pipe(Concat('app.js'))
		.pipe(Gulp.dest('./public/app/js'))
});

Gulp.task('watch-javascript', function(){
	Gulp.watch('./app-build/app/js/**/*.js', ['js']);
});

// var javascriptStarterTask = function(){
	
// }


/*
 |
 | Gulp default task
 |
 */
Gulp.task('default',['less','js']);