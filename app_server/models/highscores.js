var mongoose = require('mongoose');

var highscoreSchema = new mongoose.Schema({
	user: {
		type: String,
		required: true,
		unique: true
	},
	score: {
		type: Number,
		default: 0
	},
	timeset:{
		type: String
	}
});

var commentSchema = new mongoose.Schema({
	user: String,
	comment: String,
	posted: {
	type: String
	}
});

mongoose.model('Comment', commentSchema)
mongoose.model('HighScore', highscoreSchema);
