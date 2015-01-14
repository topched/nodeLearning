// load the things we need
var mongoose = require('mongoose');
var moment = require('moment');

var playerSchema = mongoose.Schema({

	firstname : String,
	lastname : String,
	birthdate : {type: Date},
	userId : {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
	username : {type: String, ref: 'User', default: null}
});

playerSchema.methods.updateField = function(field, data) {



};

module.exports = mongoose.model('Player', playerSchema);