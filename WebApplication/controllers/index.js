/* http://timstermatic.github.io/blog/2013/08/17/a-simple-mvc-framework-with-node-and-express/ */

var express = require('express')
	, router = express.Router()
	, path = require('path')
	, bodyParser = require('body-parser')
	, Parse = require('parse/node').Parse
	, fs = require('fs')
	, handlebars = require('express-handlebars');

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}));

router.get('/', function(req, res) {
	res.render('login')
})


router.get('/test', function(req, res) {
	var data = { 
  		title: "My New Post", 
 		body: "This is my first post!"
	}
	res.render('profile_test', data)
})


module.exports = router