var express = require('express');
var router = express.Router();
var ctrlHighscores = require('../controllers/highscores');
var ctrlComments = require('../controllers/comments');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/signin');
}
module.exports = function(passport){
	/* Score Routes for API. */
	router.get('/highscores', ctrlHighscores.highscoresListByScore);
	router.post('/highscores', isAuthenticated, ctrlHighscores.createHighScore);
	router.get('/highscores/:usernameid', ctrlHighscores.getSingleScore);
	router.put('/highscores/:usernameid', isAuthenticated, ctrlHighscores.updateHighScore);

	/* Comment Routes for API*/
	router.get('/comments', ctrlComments.commentsListByDate);
	router.post('/comments',isAuthenticated, ctrlComments.createComment);
	router.get('/comments/:commentid', ctrlComments.getComment);
	router.delete('/comments/:commentid',isAuthenticated, ctrlComments.deleteComment);

	//Ussr info route
	router.get('/user_data', function(req,res){

		if (req.user === undefined) {
			//The user is not logged in
			res.json({});
		}
		else {
			res.json({
				username: req.user.username
			})
		}
	});

	return router;
}