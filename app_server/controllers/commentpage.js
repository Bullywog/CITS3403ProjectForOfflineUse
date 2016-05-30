var request = require('request');

var apiSettings = {
	server: 'http://bacterialbattles.herokuapp.com'
};

var renderCommentsPage = function(req, res, responseBody){
	var errmessage
	console.log(req.user)

	res.render('comments', {
		comments: responseBody,
		ErrorMessage: errmessage});
}

var renderAddCommentsPage = function(req,res,responseBody){
	var errmessage

	res.render('addcomments', {
	});
}

module.exports.commentsList = function(req, res){
	var requestObject, path;
		path = '/api/comments'
	requestObject={
		url: apiSettings.server+path,
		method : 'GET',
		json: {},
		qs:{}
	};
	request(requestObject, function (error, response, body) {
	if (!error && response.statusCode == 200) {
    	renderCommentsPage(req,res,body);
		} else {
		message = 'Error finding data'
		renderCommentsPage(req,res, message);
	}
})
}

module.exports.addComment =function(req,res){
	renderAddCommentsPage(req,res);

}
	


