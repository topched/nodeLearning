var express = require('express');
var router = express.Router();



//GET playerlist
router.get('/playerlist', function(req, res) {
    var db = req.db;
    db.collection('playercollection').find().toArray(function (err, items) {
        res.json(items);
    });
});

//POST to addplayer
router.post('/addplayer', function(req, res) {
	var db = req.db;
	db.collection('playercollection').insert(req.body, function(err, result){
		res.send((err == null) ? {msg:''} : {msg:err});
	});
});



module.exports = router;