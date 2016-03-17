var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');

var app = express();
// process.env.PORT is an ENV variable provided by Heroku
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

// middleware, everytime a JSON request comes in, express will parse it and we'll access it
// via request.body
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function(req, res) {
	var queryParams = req.query;

	var where = {};
	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		where.completed = true;
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		where.completed = false;
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
		where.description = { 
			$like: '%' + queryParams.q + '%'  
		};
	}

	db.todo.findAll({where: where}).then(function(todos){
		res.json(todos);
	}, function(e) {
		res.status(500).send('Something went wrong on the server!');
	});

	// var filteredTodos = todos;

	// if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: true
	// 	});
	// } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
	// 	filteredTodos = _.where(filteredTodos, {
	// 		completed: false
	// 	});
	// }

	// if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
	// 	filteredTodos = _.filter(filteredTodos, function(todo) {
	// 		return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
	// 	});
	// }

	// res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10); //req.params.id is a string
	
	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			res.json(todo.toJSON());
		} else {
			res.status(404).send('Todo with id of ' + req.params.id + ' does not exist!');
		}
	}, function(e) {
		res.status(500).send('Something went wrong on the server!');
	});

	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// });

	// if (matchedTodo) {
	// 	res.json(matchedTodo);
	// } else {
	// 	res.status(404).send('Todo with id of ' + req.params.id + ' does not exist!');
	// }
});

// POST
app.post('/todos', function(req, res) {
	// Filter user JSON to only have description and completed keys
	var body = _.pick(req.body, ['description', 'completed']);

	db.todo.create(body).then(function (todo) {
		res.json(todo.toJSON());
	}, function (e) {
		res.status(400).json(e);
	});

	// if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
	// 	return res.status(400).send('Bad data was provided');
	// }

	// body.description = body.description.trim();
	// body.id = todoNextId++; //incrementation after current value is assigned to body.id

	// todos.push(body);

	// res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10); //req.params.id is a string

	db.todo.destroy({where: { id: todoId }}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				"error": "no todo found with that id"
			});
		} else {
			// 204: everything went well and nothing to return
			res.status(204).send();
		}
	}, function(e) {
		res.status(500).send('Something went wrong on the server!');
	});

	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// });

	// if (matchedTodo) {
	// 	todos = _.without(todos, matchedTodo);
	// 	// By default res.json sets the status to 200
	// 	res.json(matchedTodo);
	// } else {
	// 	res.status(404).json({
	// 		"error": "no todo found with that id"
	// 	});
	// }
});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10); //req.params.id is a string
	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// });

	// if (!matchedTodo) {
	// 	return res.status(404).json({
	// 		"error": "no todo found with that id"
	// 	});
	// }
	// Filter user JSON to only have description and completed keys
	var body = _.pick(req.body, ['description', 'completed']);
	//var validAttributes = {};
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	// if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
	// 	validAttributes.completed = body.completed;
	// } else if (body.hasOwnProperty('completed')) {
	// 	return res.status(400).send('The completed attribute needs to be a boolean!');
	// }

	// if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
	// 	validAttributes.description = body.description.trim();
	// } else if (body.hasOwnProperty('description')) {
	// 	return res.status(400).send('The description attribute needs to be a string of length greater than 0!');
	// }

	db.todo.findById(todoId).then(function (todo) {
		if (!!todo) {
			// this is an instance method on a fetched model
			todo.update(attributes).then(function (todo) {
				//Update success
				res.json(todo.toJSON());
			}, function (e) {
				// Update error
				res.status(400).json(e);
			});
		} else {
			return res.status(404).json({
				"error": "no todo found with that id"
			});
		}
	}, function (e) {
			res.status(500).send('Something went wrong on the server!');
	});

	// matchedTodo is passed by reference (like objects)
	// _.extend(matchedTodo, validAttributes);
	// Automatically sends back a 200
	// res.json(matchedTodo);
});

// POST
app.post('/users', function(req, res) {
	// Filter user JSON to only have email and password keys
	var body = _.pick(req.body, ['email', 'password']);

	db.user.create(body).then(function (user) {
		res.json(user.toPublicJSON());
	}, function (e) {
		res.status(400).json(e);
	});
});

// POST
app.post('/users/login', function(req, res) {
	// Filter user JSON to only have email and password keys
	var body = _.pick(req.body, ['email', 'password']);

	db.user.authenticate(body).then(function (user) {
		var token = user.generateToken('authenticate');

		if (token) {
			res.header('Auth', token).json(user.toPublicJSON());
		} else {
			res.status(401).send();
		}	
	}, function () {
		res.status(401).send();
	});
});

db.sequelize.sync({force: true}).then(function () {
	// Callback
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});

