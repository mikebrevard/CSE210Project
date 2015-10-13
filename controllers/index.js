var express = require('express')
  , router = express.Router()
  , path = require('path')


router.get('/test', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/index.html'))
})

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/login.html'))
})

module.exports = router