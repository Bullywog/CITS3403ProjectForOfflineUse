var mongoose = require('mongoose');
var DB = mongoose.model('Comment');

var sendJsonResponse = function (res, status, content){
	res.status(status);
	res.json(content);
}

module.exports.commentsListByDate=function(req, res) {
	DB
	.find()
	.sort({'posted':-1})
	.exec(function(err, highscores){
			sendJsonResponse(res,200,highscores);
		});

};
module.exports.createComment = function(req, res) {
	postdate = new Date();
	DB.create({
		user:req.user.username,
		comment:req.body.comment,
		posted:postdate.toUTCString()
	}, function(err,highscore){
		if (err) {
			sendJsonResponse(res,400, err);
		} else {
			res.redirect('/comments');
		}
	}
	);
};
module.exports.getComment = function(req, res) {
	DB
	.findById(req.params.commentid)
	.exec(function(err, highscore){
			sendJsonResponse(res,200,highscore);
		});
};
module.exports.deleteComment = function(req, res) {
	var commentid = req.params.commentid;
	if(commentid){
		DB
		.findByIdAndRemove(commentid)
		.exec(function(err,highscore){
			if(err){
				sendJsonResponse(res, 404, err);
				return
			} else {
				sendJsonResponse(res, 204, null);
			}
		})
	} else {
		sendJsonResponse(res, 404, 'No Location')
	}

};