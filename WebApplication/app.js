var express = require('express');
var app = express();

//------------------------------
// SERVE PUBLIC FOLDER
//------------------------------
app.use(express.static(__dirname + '/public'));

// set up routes
app.use(require('./controllers'));

// choose a port
app.listen(process.env.PORT || 8000);

console.log('Server is now running on port 8000');