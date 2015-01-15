//load the things we need
var mongoose = require('mongoose');

var teamSchema = mongoose.Schema({

	name: String,
	players: [{type: mongoose.Schema.Types.ObjectId, ref: 'Player'}]

});

module.exports = mongoose.model('Team', teamSchema);

