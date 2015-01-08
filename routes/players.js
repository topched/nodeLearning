var express = require('express');
var router = express.Router();

/*
 * GET playerlist.
 */
router.get('/playerlist', function(req, res) {
    var db = req.db;
    db.collection('playercollection').find().toArray(function (err, items) {
        res.json(items);
    });
});

module.exports = router;