/*
 |
 | Importing some gulp plugins
 |
 */
var Gulp = require('gulp');
var Less = require('gulp-less');
var Nano = require('gulp-cssnano');
var Sourcemaps = require('gulp-sourcemaps');
var Concat = require('gulp-concat');
// var Browserify = require('gulp-browserify');
var Browserify = require('browserify');
var Source = require('vinyl-source-stream');
var Uglify = require('gulp-uglify');
var Notify = require('gulp-notify');
var GulpUtil = require('gulp-util');
var Plumber = require('gulp-plumber');
var Buffer = require('vinyl-buffer');

/*
 |
 | Gulp structure based on app being developed
 |
 */
var ProjectGulp = {
	config: {
		bowerDir: './bower_components/',
		npmDir: './node_modules/',
		sourcemaps: true
	},
	notify: {
		success: {
			browserify: 'Browserify: Success!',
			less: 'Less: Success!'
		},
		error: {
			browserify: 'Browserify: Error. Fuck!',
			Less: 'Browserify: Error. Fuck!'
		}
	},
	taskNames: {
		app: {
			less: 'app-less',
			js: 'app-js',
			font: 'app-font',
			img: 'app-img',
		},
		nodeserver: {
			js: 'nodeserver-js'
		}
	},
	watchTaskNames: {
		app: {
			less: 'app-watch-less',
			js: 'app-watch-js',
			all: 'app-watch'
		},
		nodeserver: {
			js: 'nodeserver-js'
		}
	}
};

var ProjectLess = {
	app: {
		sourcePath: './app-build/app/less/**/*.less',
		destinationPath: './public/app/css',
		externalPaths: [
				ProjectGulp.config.bowerDir + 'bootstrap/less/',
				'./app-build/app/less/pages.less'
			],
		outputName:'app.css'
	}
}

var ProjectJavascript = {
	app: {
		// sourcePath: './app-build/app/js/**/*.js',
		sourcePath: './app-build/app/js/app.js',
		sourcePath2: [
			ProjectGulp.config.npmDir + 'vue/dist/vue.js',
			// ProjectGulp.config.bowerDir + 'bootstrap/dist/js/bootstrap.js',
			'./app-build/app/js/app.js'
		],
		destinationPath: './public/app/js',
		shimRequired: {
				jquery: {
					path: ProjectGulp.config.bowerDir + 'jquery/dist/jquery.js',
					exports: '$'
				},
				bootstrap: {
					path: ProjectGulp.config.bowerDir + 'bootstrap/dist/js/bootstrap.js',
					exports: 'bootstrap',
					depends: {
						jquery: '$'
					}
				},
				vue: {
					path: ProjectGulp.config.npmDir + 'vue/dist/vue.js',
					exports: 'vue'
				}
			},
		outputName:'app.js'
	},
	nodeserver: {
		sourcePath: [
			'./routes/**/*.js',
			'./app.js',
			'./bin/www'
		],
		destinationPath: './bin/server',
		outputName: 'www-c'
	}
}

/*
 |
 | Gulp Tasks
 |
 */

// Gulp.task(ProjectGulp.taskNames.nodeserver.js, function(){
// 	return Gulp.src(ProjectJavascript.nodeserver.sourcePath)
// 		.pipe(Browserify())
// 		.pipe(Uglify())
// 		.pipe(Concat(ProjectJavascript.nodeserver.outputName))
// 		.pipe(Gulp.dest(ProjectJavascript.nodeserver.destinationPath));
// });

Gulp.task(ProjectGulp.taskNames.app.less, function(){
	return Gulp.src(ProjectLess.app.sourcePath)
		.pipe(Plumber())
		.pipe(Sourcemaps.init())
		.pipe(Less({
			paths: ProjectLess.app.externalPaths
		}))
		.pipe(Concat(ProjectLess.app.outputName))
		.pipe(Nano())
		.pipe(Sourcemaps.write())
		.pipe(Gulp.dest(ProjectLess.app.destinationPath))
		.pipe(Notify(ProjectGulp.notify.success.less));
});

Gulp.task(ProjectGulp.taskNames.app.js, function(){
	return Browserify(ProjectJavascript.app.sourcePath)
		.bundle()
		.on('error', function (e) {
			GulpUtil.log(e);
			Notify(ProjectGulp.notify.error.browserify);
		})
		.pipe(Plumber())
		.pipe(Source(ProjectJavascript.app.outputName))
		.pipe(Buffer())
		.pipe(Uglify())
		.pipe(Gulp.dest(ProjectJavascript.app.destinationPath))
		.pipe(Notify(ProjectGulp.notify.success.browserify));
});

Gulp.task(ProjectGulp.taskNames.nodeserver.js, function(){
	return Browserify('./app.js')
		.bundle()
		.on('error', function (e) {
			GulpUtil.log(e);
			Notify(ProjectGulp.notify.error.browserify);
		})
		.pipe(Plumber())
		.pipe(Source(ProjectJavascript.nodeserver.outputName))
		// .pipe(Buffer())
		// .pipe(Uglify())
		.pipe(Gulp.dest(ProjectJavascript.nodeserver.destinationPath))
		.pipe(Notify(ProjectGulp.notify.success.browserify));
});


Gulp.task(ProjectGulp.watchTaskNames.app.less, function(){
	Gulp.watch(ProjectLess.app.sourcePath,[ProjectGulp.taskNames.app.less]);
	Notify('Watch Started: ' + ProjectGulp.watchTaskNames.app.less);
});

Gulp.task(ProjectGulp.watchTaskNames.app.js, function(){
	Gulp.watch(ProjectJavascript.app.sourcePath,[ProjectGulp.taskNames.app.js]);
	Notify('Watch Started: ' + ProjectGulp.watchTaskNames.app.js);
});

Gulp.task(ProjectGulp.watchTaskNames.app.all, function(){
	Gulp.watch(ProjectLess.app.sourcePath,[ProjectGulp.taskNames.app.less]);
	Gulp.watch(ProjectJavascript.app.sourcePath,[ProjectGulp.taskNames.app.js]);
});


/*
 |
 | Gulp default task
 |
 */
Gulp.task('default',[ProjectGulp.taskNames.app.less,ProjectGulp.taskNames.app.js]);