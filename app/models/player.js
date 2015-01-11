// load the things we need
var mongoose = require('mongoose');

var playerSchema = mongoose.Schema({

	firstname : String,
	lastname : String,
	birthdate : {type: Date}
});

module.exports = mongoose.model('Player', playerSchema);