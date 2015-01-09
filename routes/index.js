var express = require('express');
var router = express.Router();

// GET home page. 
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

//GET player page
router.get('/players', function(req, res) {
	res.render('players', { title: 'Players' });
});


module.exports = router;
