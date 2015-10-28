var express = require('express')
  , router = express.Router()
  , path = require('path')
  , bodyParser = require('body-parser')


router.use(bodyParser.json())
router.use(bodyParser.urlencoded())

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
	if(req.body.action == "login")
		res.send('test')
    console.log(req.body.email);
})

module.exports = router