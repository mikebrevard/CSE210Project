/* http://timstermatic.github.io/blog/2013/08/17/a-simple-mvc-framework-with-node-and-express/ */

var express = require('express')
	, router = express.Router()
	, path = require('path')
	, bodyParser = require('body-parser')
	, Parse = require('parse/node').Parse;

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}));

router.get('/', function (req, res) {
    var currentUser = Parse.User.current();
	if (currentUser) {
		res.redirect('dashboard')
	} else {
	    res.redirect('login')
	}
    
})

router.get('/dashboard', function (req, res) {
    var currentUser = Parse.User.current();
	if (currentUser) {
		var Event = Parse.Object.extend("Event");
		var query = new Parse.Query(Event);
		query.find({
		  success: function(results) {
		    // Do something with the returned Parse.Object values
		    var arr = [];
		    for (var i = 0; i < results.length; i++) {
		      	var temp = {
		      		objectId: results[i].id, 
		      		name: results[i].get('name'),
					LocationCity: results[i].get('LocationCity')
			  	}
		      	arr.push(temp);
    		}
		    res.render('dashboard', {allEvents: arr, email: currentUser.get('email')})
		  },
		  error: function(error) {
		    console.log("Error: " + error.code + " " + error.message);
			res.render('dashboard', {email: currentUser.get('email')})
		  }
		});
	} else {
	    res.redirect('login')
	}
    
})

// event form
router.get('/event_form', function (req, res) {
	var currentUser = Parse.User.current();
	if (currentUser) {
		res.render('event_form')
	} else {
	    res.redirect('login')
	}
})

// api post
router.post('/create_event', function (req, res) {
	var currentUser = Parse.User.current();
	if (currentUser) {
		var user = new Parse.User();
		var Event = Parse.Object.extend("Event");
		var newEvent = new Event();

		console.log(req.body.event_name);
		newEvent.set("name", req.body.event_name);
		newEvent.set("LocationCity", req.body.location);
		// need to add relation for host

		newEvent.save(null, {
		  success: function(event) {
		    // Execute any logic that should take place after the object is saved.
		    console.log('New object created with objectId: ' + event.id);

			res.redirect('event/' + event.id);
		  },
		  error: function(event, error) {
		    // Execute any logic that should take place if the save fails.
		    // error is a Parse.Error with an error code and message.
		    console.log('Failed to create new object, with error code: ' + error.message);
		  }
		});

	} else {
	    res.redirect('login')
	}
})

// get all the events
router.get('/events', function (req, res) {
	console.log("return all the events");
	var currentUser = Parse.User.current();
	if (currentUser) {
		res.render('event_form')
	} else {
	    res.redirect('login')
	}
})

// fetch an event
router.get('/event/:_id', function (req, res) {
	console.log(req.params._id);
	var currentUser = Parse.User.current();
	if (currentUser) {
		var Event = Parse.Object.extend("Event");
		var query = new Parse.Query(Event);
		query.get(req.params._id, {
		  success: function(event) {
		    // The object was retrieved successfully.
				var data = {
		      		objectId: event.id, 
		      		name: event.get('name'),
					LocationCity: event.get('LocationCity')
			  	}
				res.render('event', data)
		  },
		  error: function(event, error) {
			res.render('404', {message: "Error: " + error.code + " " + error.message})
		  }
		});

	} else {
	    res.redirect('login')
	}
})


router.get('/test', function (req, res) {
	var data = { 
  		title: "My New Post", 
 		body: "This is my first post!"
	}
	res.render('test', data)
})


module.exports = router