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

		'url' : 'mongodb://localhost/test'
}
require('./highscores')