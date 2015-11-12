/* http://timstermatic.github.io/blog/2013/08/17/a-simple-mvc-framework-with-node-and-express/ */

var express = require('express')
	, router = express.Router()
	, path = require('path')
	, bodyParser = require('body-parser')
	, Parse = require('parse/node').Parse

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}));

router.get('/test', function(req, res) {
	res.sendFile(path.join(__dirname, '../views/index.html'))
})

router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '../views/login.html'))
})

router.get('/profile', function(req, res) {
	res.sendFile(path.join(__dirname, '../views/profile.html'))
})

router.post('/login', function(req, res) {
	console.log(req.body.action);
	if (req.body.action == "login") {
		Parse.User.logIn(req.body.email, req.body.password, {
		  success: function(user) {
		    res.send("You were successfully logged in!")
		  },
		  error: function(user, error) {
		    res.send("Your credentials were incorrect. Please try again.")
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
		    res.send("Error: " + error.code + " " + error.message)
		  }
		});
	}
	
	// TODO: add in userRegister(req)
	// userRegister(req);
})

module.exports = router