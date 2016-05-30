var request = require('request');


var apiSettings = {
	server: 'http://bacterialbattles.herokuapp.com'
};

var renderScorePage = function(req,res, responseBody){
	var errmessage;

	res.render('highscorepage', {
		highscores: responseBody,
		ErrorMessage: errmessage});
}


module.exports.scorelist = function(req, res) {
	var requestObject, path;
		path = '/api/highscores'
	requestObject={
		url: apiSettings.server+path,
		method : 'GET',
		json: {},
		qs:{}
	};
	request(requestObject, function (error, response, body) {
	if (!error && response.statusCode == 200) {
    	renderScorePage(req,res,body);
		} else {
		message = 'Error finding data'
		renderHomepage(req,res, message);
	}
})
}


	


