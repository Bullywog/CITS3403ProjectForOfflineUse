var mongoose = require('mongoose');
var DB = mongoose.model('HighScore');
/*
Code for sending json response is reused the same as code in Getting Mean Text book
Api codde is derived from that but using out own data models and routes
*/
var sendJsonResponse = function (res, status, content){
	res.status(status);
	res.json(content);
};
//Finding high scores list, does a find all using mongoose from mongodb//
module.exports.highscoresListByScore=function(req, res) {
	DB
	.find()
	.sort({'score':-1})
	.exec(function(err, highscores){
		if (err) {
			sendJsonResponse(res,404, err);
		} else {
			sendJsonResponse(res, 200, highscores);
		}
		});

};

//Only used if user is logged in. Takes the users username and posts high score to database
module.exports.createHighScore = function(req, res) {
	timeOfScore = new Date();
	DB.create({
		user:req.user.username,
		score:req.body.score,
		timeset: timeOfScore.toUTCString()
	}, function(err,highscore){
		if (err) {
			sendJsonResponse(res,400, err);
		} else {
			sendJsonResponse(res, 201, highscore);
		}
	}
	);
};

//REturns the score of a sing user specified in URL parameter usernameid
module.exports.getSingleScore = function(req, res) {
	DB
	.findOne({user:req.params.usernameid})

	.exec(function(err, highscore){
			if(err || highscore==null)	{
					sendJsonResponse(res,404, err);
				} else {
					sendJsonResponse(res,200,highscore)
				}
		});
};
//Searches for existing score based on player username, updates score if found
module.exports.updateHighScore = function(req, res) {
	timeOfScoreSet = new Date();
	DB
	.findOne({user:req.user.username})
	.exec(
		function(err, highscore){
			highscore.score = req.body.score
			highscore.user = req.user.username
			highscore.timeset = timeOfScoreSet.toUTCString()
			highscore.save(function(err,highscore){
				if(err)	{
					sendJsonResponse(res,404, err);
				} else {
					sendJsonResponse(res,200,highscore)
				}
			})
		});
};