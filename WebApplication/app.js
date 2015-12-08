var express = require('express')
	, app = express()
	, rouer = express.Router()
	, fs = require('fs')
	, bodyParser = require('body-parser')
	, cookieParser = require('cookie-parser')
	, session = require('cookie-session')
	, flash = require('connect-flash')
	, handlebars = require('express-handlebars');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));


//------------------------------
// SERVE PUBLIC FOLDER
//------------------------------
app.use(express.static(__dirname + '/public'));

// set up Parse
var Parse = require('parse/node').Parse;

Parse.initialize("TAqW6JABm2HvOp28LtglzAaCOXvg0hqYhLTnqHV7",
		"1dBZMfjDznjLx2Dw4OXlL1Ah5dNbj2QEN5sTFXCW");
Parse.User.enableRevocableSession();

passport.use(new LocalStrategy({usernameField: "email", passwordField: "password"},
  function(username, password, done) {
  	Parse.User.logIn(username, password, {
	  	success: function (user) {
	  		return done(null, user);
	  	},
	  	error: function (user, error) {
			return done(null, false, { message: 'Your credentials were incorrect. Please try again.' });
	  	}
	});
  }
));


app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	var User = new Parse.Object.extend("User");
	var query = new Parse.Query(User);
	query.get(id, {
		success: function(user) {
			done(null, user);
		},
		error: function(user, err) {
			done(err, user);
		}
  });
});

//dynamically include routes (Controller)
// fs.readdirSync('./controllers').forEach(function (file) {
//   if(file.substr(-3) == '.js') {
//       app.use(require(__dirname + '/controllers/' + file))
//   }
// });



// for the views
app.engine('html', handlebars({
	extname:'html', 
	defaultLayout:'main', 
	partialsDir:"views/partials/",
	layoutsDir:"views/layouts/"}));
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

//var usersController = require(__dirname + '/controllers/users.js');
var indexController = require(__dirname + '/controllers/index.js');

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

app.get('/', loggedIn, indexController.getDashboard);
app.route('/login')
	.post(
		function(req, res, next) {
		  passport.authenticate('local', function(err, user, info) {
		    if (err) {
		      return next(err); // will generate a 500 error
		    }
		    // Generate a JSON response reflecting authentication status
		    if (!user) {
		       return res.render('login', { message: info.message })
		    }
		     req.logIn(user, function(err) {
		      if (err) { return next(err); }
		      return res.redirect('/');
		    });
		    
		  })(req, res, next);
		}
	)
	.get(indexController.renderlogIn);
app.get('/logout', indexController.logOut);
app.route('/register')
	.post(indexController.register)
	.get(indexController.renderRegister);
app.route('/profile')
	.post(loggedIn, indexController.updateProfile)
	.get(loggedIn, indexController.getProfile);
app.route('/create_event/')
	.post(loggedIn, indexController.createEvent)
	.get(loggedIn, indexController.renderCreateEvent)
app.post('/update_event/:_id', loggedIn, indexController.updateEvent)
app.get('/event/:_id', loggedIn, indexController.getEvent);
app.get('/checkin/:_eventid/:_userid', loggedIn, indexController.checkIn);
app.get('/attend/:_id', loggedIn, indexController.attend);



// choose a port
app.listen(process.env.PORT || 8000);

console.log('Server is now running on port 8000')