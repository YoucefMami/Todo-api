var express = require('express');
var bodyParser = require('body-parser');

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
	var matchedTodo;

	for (var i = 0; i < todos.length; i++) {
		if (todos[i].id === todoId) {
			matchedTodo = todos[i];
			break;
		}
	}

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send('Todo with id of ' + req.params.id + ' does not exist!');	
	}
});

// POST
app.post('/todos', function (req, res) {
	var body = req.body;
	
	body.id = todoNextId++; //incrementation after current value is assigned to body.id
	
	todos.push(body);
	
	res.json(body);
});


// Callback
app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + '!');
})