var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var moment = require('moment');


var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


//setting up the db
mongoose.connect('mongodb://localhost:27017/nodeLearning');

//configure passport
require('./config/passport')(passport, moment);


// template engine setup
app.set('view engine', 'ejs');


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//required for passport
//diff session key should probably be used
app.use(session({secret:'thisisalongsecret1234morewords1234'}));
app.use(passport.initialize());
//persistent login sessions
app.use(passport.session());
app.use(flash());


//load routes + pass in app, passport, moment
require('./app/routes')(app, passport, moment);


//TODO: add in proper error handlers

//launch app
app.listen(port);
console.log("app on port " + port);


