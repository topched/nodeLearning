// load the things we need
var mongoose = require('mongoose');


var playerSchema = mongoose.Schema({

	firstname : String,
	lastname : String,
	birthdate : {type: Date},
	userId : {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
	username : {type: String, ref: 'User', default: null}
});

module.exports = mongoose.model('Player', playerSchema);