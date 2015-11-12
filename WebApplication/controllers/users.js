/* http://timstermatic.github.io/blog/2013/08/17/a-simple-mvc-framework-with-node-and-express/ */

var express = require('express')
	, router = express.Router()
	, path = require('path')
	, bodyParser = require('body-parser')
	, Parse = require('parse/node').Parse

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}));



router.get('/event/:user_id', function(req, res) {
	console.log(req.params.user_id);
	/*var obj = { 
  		title: "My New Post", 
  		body: req.user_id
	}
	res.sendFile(path.join(__dirname, '../views/profile.html'))*/
})

router.get('/profile', function(req, res) {
	
	var currentUser = Parse.User.current();
	if (currentUser) {
	    var obj = { 
  		title: "My New Post", 
  		body: req.user_id
		}
		res.render('profile', data)
	} else {
	    res.render('index')
	}
	
})

router.post('/login', function(req, res) {
	console.log(req.body.action);
	if (req.body.action == "login") {
		Parse.User.logIn(req.body.email, req.body.password, {
		  success: function(user) {
		  	// set user as current user
		  	
		    res.render('index', {email: user.get('email')})

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
			res.send('You were successfully registered!')
		  },
		  error: function(user, error) {
		    // Show the error message somewhere and let the user try again.
		    res.render('404', {message: "Error: " + error.code + " " + error.message})
		  }
		});
	}
	
	// TODO: add in userRegister(req)
	// userRegister(req);
})

module.exports = router