var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost/test'

var highscoredb = mongoose.connect(dbURI);

mongoose.connection.on('connected', function(){
	console.log('Mongoose connected to ' + dbURI)
});
mongoose.connection.on('error', function(err){
	console.log('Mongoose connected error ' + err)
});
mongoose.connection.on('disconnected', function(){
	console.log('Mongoose disconnected ')
});


module.exports = {
	//'url' : 'mongodb://<dbuser>:<dbpassword>@novus.modulusmongo.net:27017/<dbName>'
	'url' : 'mongodb://localhost/test'
}

require('./highscores')