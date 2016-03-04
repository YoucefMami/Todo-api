var express = require('express');
var app = express();
// process.env.PORT is an ENV variable provided by Heroku
var PORT = process.env.PORT || 3000;

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// Callback
app.listen(PORT, function() {
	console.log('Express listening on port ' + PORT + '!');
})