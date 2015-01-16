var LocalStrategy = require('passport-local').Strategy;
// load up the user model
var User       = require('../app/models/user');
var Player = require('../app/models/player');



module.exports = function(passport, moment) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, username, password, done) {


        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'username' :  username }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('flashMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('flashMessage', 'Error logging in'));

                // all is well, return user
                else
                    return done(null, user);
            });
        });

    }));



    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, username, password, done) {

        console.log("creating user %s %s", username, password);
        console.log("creating player %s %s", req.body.playerFirstName, req.body.playerLastName)

        User.findOne({ 'username': username}, function(err, user) {


            if (err) return done(err);

            //check to see if that user exists
            if(user) {
                
                return done(null, false, req.flash('flashMessage', 'Username already exists'));
            
            }else{

                //create the new user first (cant have username collisions but OK with player names)
                var newUser = new User();

                newUser.username = username;
                newUser.password = newUser.generateHash(password);
                //admin is set by default -- all users should be 'players' until changed

                newUser.save(function(err) {

                    if(err) return done(err);

                });

                //create the new player
                var newPlayer = new Player();

                newPlayer.firstname = req.body.playerFirstName;
                newPlayer.lastname = req.body.playerLastName;
                newPlayer.birthdate = req.body.playerBirthDate;

                //link to the players user profile
                newPlayer.userId = newUser._id;
                newPlayer.username = username;

                //console.log(newUser._id);

                newPlayer.save(function(err) {

                    if(err) return done(err);
                });


                return done(null, req.user), req.flash('flashMessage', 'Player Created');
            }

        });

    }));

};