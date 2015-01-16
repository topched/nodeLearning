
var Player = require('../app/models/player');
var User       = require('../app/models/user');
var Team = require('../app/models/team');

module.exports = function(app, passport){

	//GET index page with login links
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
			successRedirect : '/staff/playerlist', 
			failureRedirect : '/staff/createplayer', 
			failureFlash : true 
		})(req, res);
	});

	//GET create player page
	app.get('/staff/createplayer', isLoggedIn, isStaff, function(req, res) {
		res.render('createPlayer.ejs', {
			user: req.user,
			path: req.route.path,
			message: req.flash('flashMessage')

		});
	});

	//GET edit player page for staff
	app.get('/staff/editplayer/:userId', isLoggedIn, isStaff, function(req, res) {

		var userId = req.params.userId;

		Player
		.findOne({userId: userId})
		.populate('userId')
		.populate('teamId')
		.exec(function (err, player) {

			//TODO: handle error properly
			//if(err)

			res.render('editPlayer.ejs', {
				user: req.user,
				player: player,
				path: req.route.path
			});

		})

	})

	//POST to edit player for staff
	app.post('/staff/editplayer', isLoggedIn, isStaff, function(req, res) {

		//console.log(req.body);
		var playerId = req.body.playerId;


		Player
		.findOne({_id: playerId})
		.exec(function (err, player) {

			//TODO: handle error properly
			//if(err)

			//never want to update the id
			//TODO: update the user stuff once thats implemented
			player.firstname = req.body.playerFirstName;
			player.lastname = req.body.playerLastName;
			//+1 fixes losing a day bug
			player.birthdate = req.body.playerBirthDate+1;

			player.save(function(err) {

				//TODO: handle the error properly
				if(err) res.redirect('/staff');

				req.flash('flashMessage', 'Player Successfully Changed');

				res.redirect('/staff/playerlist');

			});
		})
	})

	//Pretty greasy to delete on a GET
	//Deletes the player and user linked to the player
	app.get('/staff/deletePlayer/:userId', isLoggedIn, isStaff, function(req, res) {

		var userId = req.params.userId;

		Player.remove({userId: userId}, function(err){

			//TODO: handle error properly
			//if(err)

		})

		User.remove({_id: userId}, function(err) {

			//TODO: handle error properly
			//if(err)
		})

		req.flash('flashMessage', 'Player Successfully Deleted');


		res.redirect('/staff/playerlist');
		
	});

	//A list of all the players
	app.get('/staff/playerlist', isLoggedIn, isStaff, function(req, res) {

		Player
		.find({})
		.populate('teamId')
		.populate('userId')
		.exec(function (err, players) {

			//TODO: handle error properly
			//if(err)

			res.render('playerList.ejs', {
			user: req.user,
			players: players,
			path: req.route.path,
			message: req.flash('flashMessage')
			});

		})

	});

	app.get('/staff/createteam', isLoggedIn, isStaff, function(req, res) {

		Player
		.find({})
		.exec(function (err, players) {

			//TODO: handle error properly
			//if(err)

			res.render('createTeam.ejs', {
			user: req.user,
			path: req.route.path,
			players: players
			});
		
		})		


	});

	//creates a new team and updates all the selected players teamId
	app.post('/staff/createteam', isLoggedIn, isStaff, function(req, res) {

		//ids to be added to the team
		var ids = req.body.id;
		var teamName = req.body.teamName;

		//create the team		
		var newTeam = new Team();

		newTeam.name = teamName;
		newTeam.players = ids;

		newTeam.save(function(err) {
			//TODO handle error
			//if(err)
		});

		//check needed because a single element could be returned and 
		//that throws off the length of ids
		if(ids instanceof Array) {
			
			//update for a list of ids
			for(var i=0; i<ids.length; i++) {

				var q = {userId: ids[i]};
				Player.update(q, {teamId: newTeam._id}, function(err){
					//TODO handle error
					//if(err)
				});
			}

		}else{

			//only need to update a single id
			var q = {userId: ids};
			Player.update(q, {teamId: newTeam._id}, function(err){
				//TODO handle error
				//if(err)
			});

		}

		req.flash('flashMessage', 'Team Created');
		res.redirect('/staff/teamlist');
	});

	app.get('/staff/teamlist', isLoggedIn, isStaff, function(req, res) {

		Team
		.find({})
		.exec(function(err, teams) {

			res.render('teamList.ejs', {
				user: req.user,
				teams: teams,
				message: req.flash('flashMessage'),
				path: req.route.path
			});

		});


	})

	//return JSON representation of a player
	app.get('/staff/player/:userId', isLoggedIn, isStaff, function(req, res) {

		//console.log(req.params.userId);

		Player
		.findOne({userId: req.params.userId})
		.exec(function (err, player) {

			//TODO: handle error properly
			//if(err)
			//console.log(player);
			res.json(player);

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
		res.render('login.ejs', { message: req.flash('flashMessage') });
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
		res.render('signup.ejs', { message: req.flash('flashMessage') });
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
		if(req.user.admin === true){
			return next();
		}else{
			return res.redirect('/');
		}
	});
}
