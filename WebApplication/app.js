var express = require('express')
	, app = express()
	, fs = require('fs')
	, handlebars = require('express-handlebars');

//------------------------------
// SERVE PUBLIC FOLDER
//------------------------------
app.use(express.static(__dirname + '/public'));

// set up Parse
var Parse = require('parse/node').Parse;

Parse.initialize("TAqW6JABm2HvOp28LtglzAaCOXvg0hqYhLTnqHV7",
		"1dBZMfjDznjLx2Dw4OXlL1Ah5dNbj2QEN5sTFXCW");
Parse.User.enableRevocableSession();
Parse.User.enableUnsafeCurrentUser();


// dynamically include routes (Controller)
fs.readdirSync('./controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      app.use(require(__dirname + '/controllers/' + file))
  }
});

app.engine('html', handlebars({extname:'html', defaultLayout:'main'}));
app.set('view engine', 'html');
app.set('views', __dirname + '/views');





// choose a port
app.listen(process.env.PORT || 8000);

console.log('Server is now running on port 8000')