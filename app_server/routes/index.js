var express = require('express');
var router = express.Router();
var ctrlHome = require('../controllers/home');
var ctrlAbout = require('../controllers/about');
var ctrlGame = require('../controllers/game');
var ctrlHighscore = require('../controllers/scorepage');
var ctrlComment = require('../controllers/commentpage')
var ctrlReferences = require('../controllers/references');
var ctrlAuthors = require('../controllers/authors');
var ctrlDesign = require('../controllers/design');
var ctrlTesting = require('../controllers/testing');


var express = require('express');
var router = express.Router();

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

	/* GET login page. */
	router.get('/signin', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',	// correct details
		failureRedirect: '/signin',	//incorrect details - stay on same page
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home', 	//correct details
		failureRedirect: '/signup',	// incorrect details - stay on same page
		failureFlash : true  
	}));

	/* GET Home Page */
	// Check to make sure user is authenticated/logged 
	// in before they can access the gamne page
	router.get('/game', isAuthenticated, function(req, res){
		res.render('game', { user: req.user.username });
	});

	/* GET Add Comment */
	router.get('/comment/new', isAuthenticated, function(req, res){
		ctrlComment.addComment(req,res, req.user.username)
	});

	/* GET Home page. */
	router.get('/home', ctrlHome.home);

	/* GET Home page. */
	router.get('/', ctrlHome.home);

	/* GET Highscore Page. */
	router.get('/highscores', ctrlHighscore.scorelist);

	/* GET Comments Page. */
	router.get('/comments', ctrlComment.commentsList)

	/* GET About page*/
	router.get('/about', ctrlAbout.about);

	/* GET Authors Page. */
	router.get('/authors', ctrlAuthors.authors);

	/* GET Design Page. */
	router.get('/design', ctrlDesign.design);

		/* GET Design Page. */
	router.get('/testing', ctrlTesting.testing);

	/* GET Reference page*/
	router.get('/references', ctrlReferences.references);

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		req.flash('message', 'Successfuly logged out');
		res.redirect('/signin');		//once logged out, sent back to login screen
	});

	return router;
}
