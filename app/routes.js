
var Player = require('../app/models/player');
var User       = require('../app/models/user');

module.exports = function(app, passport, moment){

	//home page with login links
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	//GET staff home page
	app.get('/staff', isLoggedIn, isStaff, function(req, res) {

		res.render('staff.ejs', {
		user: req.user,
		path: req.route.path
		});
			
	});

	//POST to create a player. Must be loogedIn and Staff
	app.post('/staff/createplayer', isLoggedIn, isStaff, function(req, res){
		passport.authenticate('local-signup', {
			successRedirect : '/staff', 
			failureRedirect : '/staff', 
			failureFlash : true 
		})(req, res);
	});

	//GET create player page
	app.get('/staff/createplayer', isLoggedIn, isStaff, function(req, res) {
		res.render('createPlayer.ejs', {
			user: req.user,
			path: req.route.path
		});
	});

	//GET edit player page for staff
	app.get('/staff/editplayer/:userId', isLoggedIn, isStaff, function(req, res) {

		var userId = req.params.userId;

		Player
		.findOne({userId: userId})
		.exec(function (err, player) {

			//console.log(player);

			res.render('editPlayer.ejs', {
				user: req.user,
				player: player,
				path: req.route.path
			});

		})

	})

	app.post('/staff/editplayer', isLoggedIn, isStaff, function(req, res) {

		console.log(req.body);
		var playerId = req.body.playerId;

		var tmpPlayer = new Player();
		tmpPlayer.firstname = req.body.firstname;


		Player
		.findOne({_id: playerId})
		.exec(function (err, player) {

			//console.log(player);
			//never want to update the id
			//TODO: update the user stuff once thats implemented
			player.firstname = req.body.playerFirstName;
			player.lastname = req.body.playerLastName;
			player.birthdate = req.body.playerBirthDate;

			player.save(function(err) {

				//TODO: handle the error properly
				if(err) res.redirect('/staff');

				res.redirect('/staff/playerlist');

			});

			
		})



	})

	app.post('/staff/deletePlayer', isLoggedIn, isStaff, function(req, res) {

		
	});

	app.get('/staff/playerlist', isLoggedIn, isStaff, function(req, res) {

		//console.log(req.route.path);

		Player
		.find({})
		.exec(function (err, players) {

			res.render('playerList.ejs', {
			user: req.user,
			players: players,
			path: req.route.path
			});			
		})

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


	//only used to initially create a user
	app.get('/signup', function(req, res) {
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});

	//only used to initially create a user
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/player', 
		failureRedirect : '/signup', 
		failureFlash : true // allow flash messages
	}));

	//no matching urls
	app.use(function(req, res) {
		//redirect to staff because it will fall through to '/' if the user checks fail
		res.redirect('/staff');

	});

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}

// ensure the user is staff
function isStaff(req, res, next) {

	req.logIn(req.user, function(err) {

		//console.log(req.user.admin);
		if(req.user.admin === true){
			return next();
		}else{
			return res.redirect('/');
		}
	});
}
