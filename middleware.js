module.exports = function (db) {

	return {
		// next allows private code to be run where the middleware is called
		requireAuthentication: function (req, res, next) {
			var token = req.get('Auth');

			db.user.findByToken(token).then(function(user) {
				req.user = user;
				next();
			}, function () {
				res.status(401).send();
			});
		}
	};

};