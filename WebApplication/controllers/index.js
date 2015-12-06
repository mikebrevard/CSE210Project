/* http://timstermatic.github.io/blog/2013/08/17/a-simple-mvc-framework-with-node-and-express/ */

var express = require('express')
	, router = express.Router()
	, path = require('path')
	, bodyParser = require('body-parser')
	, Parse = require('parse/node').Parse;

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}));

// first get
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
		var arr = [];
		var arr2 = [];
		var arr3 = [];
		var Event = Parse.Object.extend("Event");
		var query = new Parse.Query(Event);
		query.find({
			success: function(results) {
		    // Do something with the returned Parse.Object values

			    for (var i = 0; i < results.length; i++) {
			    	var temp = {
			    		objectId: results[i].id, 
			    		name: results[i].get('name'),
			    		location: results[i].get('LocationCity')
			    	}
			    	arr.push(temp);
			    }

			    var EventAdmins = Parse.Object.extend("EventAdmins");
			    var query = new Parse.Query(EventAdmins);
			    query.equalTo("user", currentUser);
			    query.include("event");
			    query.find({
			    	success: function(results) {
			    		for (var i = 0; i < results.length; i++) {
			    			var obj = results[i].get('event');
			    			var temp = {
			    				objectId: obj.id, 
			    				name: obj.get('name'),
			    				location: obj.get('LocationCity')
			    			}
			    			arr2.push(temp);
			    		}
			    		var EventAttendees = Parse.Object.extend("EventAttendees");
			    		var query = new Parse.Query(EventAttendees);
			    		query.equalTo("user", currentUser);
			    		query.include("event");
			    		query.find({
			    			success: function(results) {
			    				for (var i = 0; i < results.length; i++) {
			    					var obj = results[i].get('event');
			    					var temp = {
			    						objectId: obj.id, 
			    						name: obj.get('name'),
			    						location: obj.get('LocationCity')
			    					}
			    					arr3.push(temp);
			    				}
			    				res.render('dashboard', {allEvents: arr, yourEvents: arr2, joinedEvents: arr3, email: currentUser.get('email')})
			    				
			    			},
			    			error: function(error){
			    				res.render('error', {message: "Error: " + error.code + " " + error.message})
			    			}
			    		});

			    		
			    	},
			    	error: function(error) {
			    		res.render('error', {message: "Error: " + error.code + " " + error.message})
			    	}
			    });
			},
			error: function(error) {
				console.log("Error: " + error.code + " " + error.message);
				res.render('dashboard', {email: currentUser.get('email')})
			}
		});
	} 
	else {
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

// fetch an event
router.get('/event/:_id', function (req, res) {
	var currentUser = Parse.User.current();
	if (currentUser) {
		var Event = Parse.Object.extend("Event");
		var query = new Parse.Query(Event);
		query.get(req.params._id, {
			success: function(event) {
		    // Check if they are an admin or not
			    var EventAdmins = Parse.Object.extend("EventAdmins");
			    var query = new Parse.Query(EventAdmins);
			    query.equalTo("event", event);
			    query.equalTo("user", currentUser);
			    query.first({
			    	success: function(object) {
			    		// admin
			    		if (object != null) {
			    			var arr = [];
							var EventAttendees = Parse.Object.extend("EventAttendees");
				    		var query = new Parse.Query(EventAttendees);
				    		query.equalTo("event", event);
				    		query.include("user");
				    		query.find({
				    			success: function(results) {
				    				for (var i = 0; i < results.length; i++) {
				    					var obj = results[i].get('user');
				    					var temp = {
				    						userId: obj.id, 
				    						userName: obj.get('username'),
				    						userStatus: results[i].get('CheckinStatus')
				    					}
				    					arr.push(temp);
				    				}
				    				var data = {
					    				objectId: event.id, 
					    				name: event.get('name'),
					    				location: event.get('LocationCity'),
					    				description: event.get('Description'),
					    				admin: true,
					    				joined: false,
					    				attendees: arr
					    			}
					    			res.render('event', data);
				    			},
				    			error: function(error){
				    				res.render('error', {message: "Error: " + error.code + " " + error.message})
				    			}
				    		});
			    		}
			    		// not admin, check if joined or not
			    		else {
							var EventAttendees = Parse.Object.extend("EventAttendees");
						    var query = new Parse.Query(EventAttendees);
						    query.equalTo("event", event);
						    query.equalTo("user", currentUser);
						    query.first({
						    	success: function(object) {
						    		// joined
						    		if (object != null) {					    		
							    		var data = {
						    				objectId: event.id, 
						    				name: event.get('name'),
						    				location: event.get('LocationCity'),
						    				description: event.get('Description'),
						    				admin: false,
						    				joined: true,
						    				checkedIn: object.get('CheckinStatus'),
						    				userId: currentUser.id
						    			}
						    		}
						    		// not joined yet
						    		else {
						    			var data = {
						    				objectId: event.id, 
						    				name: event.get('name'),
						    				location: event.get('LocationCity'),
						    				description: event.get('Description'),
						    				admin: false,
						    				joined: false
						    			}
						    		}
			    					res.render('event', data);
						   		},
						    	error: function(error) {
						    		res.render('error', {message: "Error: " + error.code + " " + error.message})
						    	}
						    });
			    		}
		    		},
		    		error: function(error) {
		    			res.render('error', {message: "Error: " + error.code + " " + error.message})
		    		}
		    	});
			},
			error: function(event, error) {
				res.render('error', {message: "Error: " + error.code + " " + error.message})
			}
		});

	} 
	else {
		res.redirect('/login');
	}
})

// API stuff


// api post to create an event
router.post('/create_event', function (req, res) {
	var currentUser = Parse.User.current();
	if (currentUser) {
		var Event = Parse.Object.extend("Event");
		var newEvent = new Event();

		console.log(req.body.event_name);
		newEvent.set("name", req.body.event_name);
		newEvent.set("LocationCity", req.body.location);
		newEvent.set("Description", req.body.description);
		// need to add relation for host

		newEvent.save(null, {
			success: function(event) {
			    // Execute any logic that should take place after the object is saved.
			    console.log('New object created with objectId: ' + event.id);

			    // set the admin
			    var EventAdmins = Parse.Object.extend("EventAdmins");
			    var newAdmin = new EventAdmins();

			    newAdmin.set("user", currentUser);
			    newAdmin.set("event", event);

			    newAdmin.save(null, {
			    	success: function(eventadmin) {
			    		res.redirect('/event/' + event.id);
			    	},
			    	error: function(eventadmin, error) {
			    		res.render('error', {message: "Error: " + error.code + " " + error.message})
			    	}
			    });
			},
			error: function(event, error) {
			    // Execute any logic that should take place if the save fails.
			    // error is a Parse.Error with an error code and message.
			   res.render('error', {message: "Error: " + error.code + " " + error.message})
			}
		});
	} 
	else {
		res.redirect('/login')
	}
})


router.get('/attend/:_id', function (req, res) {
	var currentUser = Parse.User.current();
	if (currentUser) {
		var Event = Parse.Object.extend("Event");
		var query = new Parse.Query(Event);
		query.get(req.params._id, {
			success: function(event) {
				var EventAttendees = Parse.Object.extend("EventAttendees");
			    var query = new Parse.Query(EventAttendees);
			    query.equalTo("event", event);
			    query.equalTo("user", currentUser);
			    query.first({
			    	success: function(object) {
			    		// is not already joined
			    		if (object == null) {
			    		
							var newAttendee = new EventAttendees();

							newAttendee.set("user", currentUser);
							newAttendee.set("event", event);
							newAttendee.set("CheckinStatus", false);

							newAttendee.save(null, {
							 	success: function(eventattendee) {
							 		res.redirect('/event/' + event.id);
							 	},
							 	error: function(eventattendee, error) {
							 		res.render('error', {message: "Error: " + error.code + " " + error.message})
							 	}
							});
			    		}		    		
			    	},
			    	error: function(error) {
			    		res.render('error', {message: "Error: " + error.code + " " + error.message})
			    	}
			    });
			},
			error: function(error) {
				res.render('error', {message: "Error: " + error.code + " " + error.message})
			}
		});
	}
	else {
		res.redirect('/login');
	}
})

router.get('/checkin/:_eventid/:_userid', function (req, res) {
	// make sure only host is logged in
	var currentUser = Parse.User.current();
	if (currentUser) {
		// open up query for EventAdmins
		var EventAdmins = Parse.Object.extend("EventAdmins");
		var query = new Parse.Query(EventAdmins);

		var Event = Parse.Object.extend("Event");
		var event = new Event();
		event.id = req.params._eventid;
		query.equalTo("event", event);
		query.equalTo("user", currentUser);

	    query.first({
	    	success: function(object) {
	    		// admin
	    		if (object != null) {
	    			var EventAdmins = Parse.Object.extend("EventAttendees");
					var query = new Parse.Query(EventAdmins);

					var Event = Parse.Object.extend("Event");
					var event = new Event();
					event.id = req.params._eventid;
					query.equalTo("event", event);

					var User = new Parse.Object.extend("User");
					var user = new User();
					user.id = req.params._userid;
					query.equalTo("user", user);

				    query.first({
				    	success: function(object) {
				    			object.set("CheckinStatus", true);
				    			object.save();
				    			res.redirect('/event/' + event.id);
				    		
			    		
			    		},
			    		error: function(error) {
			    			res.render('error', {message: "Error: " + error.code + " " + error.message})
			    		}
			    	});
	    		}
	    		// not admin, check if joined or not
	    		else {
					res.render('error', {message: "You must be the host of this event to check people in."})
	    		}
    		
    		},
    		error: function(error) {
    			res.render('error', {message: "Error: " + error.code + " " + error.message})
    		}
    	});
	} 
	else {
		res.redirect('/login');
	}
})


// just a tiny test
router.get('/test', function (req, res) {
	var data = { 
		title: "My New Post", 
		body: "This is my first post!"
	}
	res.render('test', data)
})


module.exports = router