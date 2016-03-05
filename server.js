var express = require('express');
var app = express();
// process.env.PORT is an ENV variable provided by Heroku
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: 'Meet mom for lunch',
	completed: false
}, {
	id: 2,
	description: 'Go to market',
	completed: false
}, {
	id: 3,
	description: 'Clean apartment',
	completed: true
}];

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

// Callback
app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + '!');
})