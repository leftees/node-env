var $ = require('jquery');
var bootstrap = require('bootstrap');

var Tasks = require('./tasks');

var Main = {
	init: function(){
		console.log('hello world!');
		window.init_tasks = Tasks;
	}
}

module.exports = Main;