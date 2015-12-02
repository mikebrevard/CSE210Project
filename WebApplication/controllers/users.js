/* http://timstermatic.github.io/blog/2013/08/17/a-simple-mvc-framework-with-node-and-express/ */

var express = require('express')
	, router = express.Router()
	, path = require('path')
	, bodyParser = require('body-parser')
	, Parse = require('parse/node').Parse;

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}));

// gets the current profile information
router.get('/profile', function(req, res) {
    var currentUser = Parse.User.current();
	if (currentUser) {
	    var data = { 
	  		email: currentUser.get('email')
		}
		res.render('profile', data)
	} else {
	    res.redirect('login')
	}	
})

// update the profile
router.post('/profile', function(req, res) {
	var currentUser = Parse.User.current();
	if (currentUser) {
		currentUser.set("password", req.body.password);
	
		// TODO: doesnt seem to work
		currentUser.save(null, {
	        success: function(user) {
	        	var data = { 
			  		email: currentUser.get('email'),
			  		message: "Your profile has been updated."
				}
	            res.render('profile', data);
	        },
	        error: function(user, error) {
	            // Show the error message somewhere and let the user try again.
	            var data = { 
			  		email: currentUser.get('email'),
			  		message: "Error: " + error.code + " " + error.message
				}
	            res.render('profile', data);
	        }
    	});
	}
})


router.get('/logout', function (req, res) {
	Parse.User.logOut();
	req.session = null;
	res.redirect('login');
})

router.get('/login', function (req, res) {
	res.render('login')
})

router.post('/login', function (req, res) {
	if (req.body.action == "login") {
		Parse.User.logIn(req.body.email, req.body.password, {
		  	success: function (user) {
		  		//Parse.User.become(req.session.token ? req.session.token : "no_token").then(function(user) { // If null is passed to .become() it will assume current(), which we don't want
				  // The current user is now set to user.
				  res.redirect('dashboard');
		
		    	//})
		  	},
		  	error: function (user, error) {
				res.render('login', {message:"Your credentials were incorrect. Please try again."})
		  	}
		});
	}
	else if (req.body.action == "register") {
		var user = new Parse.User();

		user.set("username", req.body.email);
		user.set("email", req.body.email);
		user.set("password", req.body.password);

		user.signUp(null, {
		  	success: function (user) {
		    	// Hooray! Let them use the app now.
				res.redirect('dashboard')
		  	},
		  	error: function (user, error) {
		    	// Show the error message somewhere and let the user try again.
		    	res.render('login', {message: "Error: " + error.code + " " + error.message})
		  	}
		});
	}
	
})

module.exports = router