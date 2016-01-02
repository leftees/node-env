var Tasks = {
	init: function(){
		
		Vue.component('tasks', {
			props: ['list'],
			template: '#tasks-template',
			methods: {
				toggleStatus: function(task){
					task.completed = !task.completed;
				},
				isCompleted: function(task){
					return task.completed;
				},
				isInProgress: function(task){
					return !this.isCompleted(task);
				},
				deleteTask: function(task){
					this.list.$remove(task);
				},
				clearCompleted: function(){
					this.list = this.list.filter(this.isInProgress);
				}
			},
			computed: {
				remaining: function() {
					return this.list.filter(this.isInProgress).length;
				}
			}
		});

		return new Vue({
			el: '#app',

			data: {
				
				tasks: [
					{body: 'Go to the bank', completed: false},
					{body: 'Go to the store', completed: false},
					{body: 'Go to the doctor', completed: true},
				]

			}
		});
	}
}

module.exports = Tasks;