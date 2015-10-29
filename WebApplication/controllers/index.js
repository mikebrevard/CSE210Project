var express = require('express'), router = express.Router(), path = require('path'), bodyParser = require('body-parser')

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
	if (req.body.action == "login")
		res.send('Login attempt')
	else if (req.body.action == "register")
		res.send('Register attempt')
	console.log(req.body.email);
	console.log(req.body.inputPassword);
	
	// TODO: add in userRegister(req)
	// userRegister(req);
})

module.exports = router