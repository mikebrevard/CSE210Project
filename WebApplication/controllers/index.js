/* http://timstermatic.github.io/blog/2013/08/17/a-simple-mvc-framework-with-node-and-express/ */

var express = require('express')
	, router = express.Router()
	, path = require('path')
	, bodyParser = require('body-parser')
	, Parse = require('parse/node').Parse
	, user = require('../models/user')

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
		// do the post to models Parse
		// failure:
			res.send('Login attempt')
		// success : res.send("profile.html", jsonobject)

	}
	else if (req.body.action == "register") {
		res.send('Register attempt')
	}
	console.log(req.body.email);
	console.log(req.body.inputPassword);
	
	// TODO: add in userRegister(req)
	// userRegister(req);
})

module.exports = router