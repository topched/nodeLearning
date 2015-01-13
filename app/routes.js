
var Player = require('../app/models/player');
//var User       = require('../app/models/user');

module.exports = function(app, passport){

	//home page with login links
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	//profile section
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

	//staff section
	app.get('/staff', isLoggedIn, function(req, res) {
		res.render('staff.ejs', {
			user: req.user,
			message: req.flash('createMessage') 
		});
	});

	//player section
	app.get('/player', isLoggedIn, function(req, res) {
		res.render('player.ejs', {
			user: req.user
		});
	});

	//logout
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	app.post('/staff/createplayer', isLoggedIn, function(req, res){

		passport.authenticate('local-signup', {
			successRedirect : '/staff', // redirect to the secure profile section
			failureRedirect : '/staff', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		})(req, res);
	});



	//retrive JSON representation of all the players
	app.get('/players/playerlist', isLoggedIn, function(req, res) {

		//find all the players and exec the query
		var q = Player.find({});
		q.exec(function(err, players){

			//console.log("Player %s", players.length);
			res.json(players);
		});
	});


	//==================================
	//local authentication
	//==============================

	app.get('/login', function(req, res) {
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	app.post('/login', function(req, res, next) {
		passport.authenticate('local-login', function(err, user, info) {
	    	if (err) { return next(err); }

	    	//invalid login credentials
	   		if (!user) { return res.redirect('/login'); }

	    	req.logIn(user, function(err) {
	      		if (err) { return next(err); }

			    //redirect to player or admin/staff
			    if(req.user.admin === false){
			    	return res.redirect('/player')
			    }else{
			    	return res.redirect('/staff');
			    }
	    });
	  })(req, res, next);
	});


	// show the signup form
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/player', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));



};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}