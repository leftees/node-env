require('jquery')
require('bootstrap')
require('vue')

var Tasks = require('./tasks');

var Main = {
	init: function(){
		console.log('hello world!');
		window.init_tasks = Tasks;
	}
}

module.exports = Main;