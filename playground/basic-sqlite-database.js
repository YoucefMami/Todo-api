var Sequelize = require('sequelize');
// instance of Sequelize
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

var User = sequelize.define('user', {
	email: Sequelize.STRING //if more attributes, needs to be an object
});

Todo.belongsTo(User);
User.hasMany(Todo);

// Promise
// If you add force: true into sync, it wipes out all tables from database and recreates them
sequelize.sync({
	//force: true
}).then(function () {
	console.log('Everything is synced');
	var where = {
		completed: true
	};
	User.findById(1).then(function (user) {
		// getTodos is created by sequelize
		user.getTodos({
			where: where
		}).then(function (todos) {
			todos.forEach(function (todo) {
				console.log(todo.toJSON());
			});
		});
	});

	// User.create({
	// 	email: 'youcef.mami@gmail.com'
	// }).then(function () {
	// 	return Todo.create({
	// 		description: 'Clean yard'
	// 	});
	// }).then(function (todo) {
	// 	User.findById(1).then(function (user) {
	//		//addTodo is created by sequelize
	// 		user.addTodo(todo);
	// 	});
	// });

	// Todo.findById(2).then(function(todo) {
	// 	if (todo) {
	// 		console.log(todo.toJSON());
	// 	} else {
	// 		console.log('No todo for that id');
	// 	}
	// });
});

			// Todo.create({
			// 	description: 'Walk dog'
			// }).then(function(todo) {
			// 	return Todo.create({
			// 		description: 'Clean office'
			// 	});
			// }).then(function() {
			// 	return Todo.findAll({
			// 		where: {
			// 			description: {
			// 				$like: '%off%'
			// 			}
			// 		}
			// 	});
			// }).then(function(todos){
			// 	if(todos) {
			// 		todos.forEach(function(todo){
			// 			console.log(todo.toJSON());	
			// 		});
			// 	} else {
			// 		console.log('no todos found!');
			// 	}
			// }).catch(function(e) {
			// 	console.log(e);
			// });