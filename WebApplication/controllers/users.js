/* http://timstermatic.github.io/blog/2013/08/17/a-simple-mvc-framework-with-node-and-express/ */

var express = require('express')
	, router = express.Router()
	, path = require('path')
	, bodyParser = require('body-parser')
	, Parse = require('parse/node').Parse;

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}));


router.get('/profile', function(req, res) {
	
        var currentUser = Parse.User.current();
		if (currentUser) {
		    var data = { 
		  		email: currentUser.get('email'), 
		  		password: currentUser.get('password')
			}
			res.render('profile', data)
		} else {
		    res.render('index')
		}
	
	
})

router.get('/logout', function(req, res) {
	Parse.User.logOut();
	req.session = null;
	res.render('index');
})

router.post('/login', function(req, res) {
	if (req.body.action == "login") {
		Parse.User.logIn(req.body.email, req.body.password, {
		  	success: function(user) {
		  		//Parse.User.become(req.session.token ? req.session.token : "no_token").then(function(user) { // If null is passed to .become() it will assume current(), which we don't want
				  // The current user is now set to user.
				  res.render('dashboard', {email: user.get('email')});
		
		    	//})
		  	},
		  	error: function(user, error) {
				res.render('404', {message:"Your credentials were incorrect. Please try again."})
		  	}
		});

	}
	else if (req.body.action == "register") {
		var user = new Parse.User();

		user.set("username", req.body.email);
		user.set("email", req.body.email);
		user.set("password", req.body.password);

		user.signUp(null, {
		  	success: function(user) {
		    	// Hooray! Let them use the app now.
				res.render('dashboard', {email: user.get('email')})
		  	},
		  	error: function(user, error) {
		    	// Show the error message somewhere and let the user try again.
		    	res.render('404', {message: "Error: " + error.code + " " + error.message})
		  	}
		});
	}
	
})

module.exports = router