/* http://timstermatic.github.io/blog/2013/08/17/a-simple-mvc-framework-with-node-and-express/ */

var express = require('express')
	, router = express.Router()
	, path = require('path')
	, bodyParser = require('body-parser')
	, Parse = require('parse/node').Parse;

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}));

router.get('/', function(req, res) {
	
        var currentUser = Parse.User.current();
		if (currentUser) {
		    var data = { 
		  		email: currentUser.get('email'), 
		  		password: currentUser.get('password')
			}
			res.render('dashboard', data)
		} else {
		    res.render('index')
		}
    
})

router.get('/dashboard', function(req, res) {
	
        var currentUser = Parse.User.current();
		if (currentUser) {
		    var data = { 
		  		email: currentUser.get('email'), 
		  		password: currentUser.get('password')
			}
			res.render('dashboard', data)
		} else {
		    res.render('index')
		}
    
})

router.get('/event/:_id', function(req, res) {
	console.log(req.params._id);
	/*var obj = { 
  		title: "My New Post", 
  		body: req.user_id
	}
	res.sendFile(path.join(__dirname, '../views/profile.html'))*/
})

router.get('/test', function(req, res) {
	var data = { 
  		title: "My New Post", 
 		body: "This is my first post!"
	}
	res.render('test', data)
})


module.exports = router