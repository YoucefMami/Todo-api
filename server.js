var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
// process.env.PORT is an ENV variable provided by Heroku
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

// middleware, everytime a JSON request comes in, express will parse it and we'll access it
// via request.body
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10); //req.params.id is a string
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send('Todo with id of ' + req.params.id + ' does not exist!');	
	}
});

// POST
app.post('/todos', function (req, res) {
	// Filter user JSON to only have description and completed keys
	var body = _.pick(req.body, ['description', 'completed']);

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return res.status(400).send('Bad data was provided');
	}
	
	body.description = body.description.trim();
	body.id = todoNextId++; //incrementation after current value is assigned to body.id
	
	todos.push(body);
	
	res.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10); //req.params.id is a string
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (matchedTodo) {
		todos = _.without(todos, matchedTodo);
		// By default res.json sets the status to 200
		res.json(matchedTodo);
	} else {
		res.status(404).json({"error": "no todo found with that id"});	
	}
});

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id, 10); //req.params.id is a string
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (!matchedTodo) {
		return res.status(404).json({"error": "no todo found with that id"});
	}
	// Filter user JSON to only have description and completed keys
	var body = _.pick(req.body, ['description', 'completed']);
	var validAttributes = {};

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send('The completed attribute needs to be a boolean!');
	}

	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description.trim();
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send('The description attribute needs to be a string of length greater than 0!');
	}

	// matchedTodo is passed by reference (like objects)
	_.extend(matchedTodo, validAttributes);
	// Automatically sends back a 200
	res.json(matchedTodo);
});


// Callback
app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + '!');
})