var express = require('express');
var morgan = require('morgan');
var compress = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var passport = require('passport');

var config = require('./config');

module.exports = function(){
	var app = express();

	if (process.env.NODE_ENV === 'development'){
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json);
	app.use(methodOverride());

	//config. session app
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
	}));

	app.set('views', './app/views');
	app.set('view engine', 'ejs');

	app.use(passport.initialize()); //responsible for bootstrapping the Passport module
	app.use(passport.session()); //which is using the Express session to keep track of your user's session

	require('../app/routes/index.server.routes')(app);
	require('../app/routes/users.server.routes')(app);

	//config. for serving content static
	app.use(express.static('./public'));

	return app;
};