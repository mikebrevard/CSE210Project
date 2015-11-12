var express = require('express');

var app = express();
var fs = require('fs');

//------------------------------
// SERVE PUBLIC FOLDER
//------------------------------
app.use(express.static(__dirname + '/public'));

// set up Parse
var Parse = require('parse/node').Parse;

Parse.initialize("TAqW6JABm2HvOp28LtglzAaCOXvg0hqYhLTnqHV7",
		"1dBZMfjDznjLx2Dw4OXlL1Ah5dNbj2QEN5sTFXCW");


// dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      app.use(require('./controllers/' + file))
  }
});

// choose a port
app.listen(process.env.PORT || 8000);

console.log('Server is now running on port 8000')