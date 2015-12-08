/* http://timstermatic.github.io/blog/2013/08/17/a-simple-mvc-framework-with-node-and-express/ */

var Parse = require('parse/node').Parse;

exports.renderlogIn = function (req, res) {
	res.render('login');
}

exports.renderRegister = function (req, res) {
	res.render('register');
}

exports.register = function (req, res) {
	var user = new Parse.User();

	user.set("username", req.body.email);
	user.set("email", req.body.email);
	user.set("password", req.body.password);
	user.set("name", req.body.name);
	user.set("gender", req.body.gender);

	user.signUp(null, {
	  	success: function (user) {
	    	// Hooray! Let them use the app now.
			res.redirect('/');
	  	},
	  	error: function (user, error) {
	    	// Show the error message somewhere and let the user try again.
	    	res.render('register', {message: error.message})
	  	}
	});
}

exports.logOut = function (req, res) {
	req.logout();
  	res.redirect('/');
}

exports.getProfile = function(req, res) {
    var currentUser = req.user;	
    var data = { 
  		email: currentUser.get('email'),
  		gender: currentUser.get('gender'),
  		name: currentUser.get('name')
	}
	res.render('profile', data)
}

// update the profile fix this with names and stuff
exports.updateProfile = function(req, res) {
	var currentUser = req.user;
	
	currentUser.set("name", req.body.name);
	currentUser.set("gender", req.body.gender);

	currentUser.save(null, {
        success: function(user) {
        	var data = { 
		  		email: currentUser.get('email'),
		  		message: "Your profile has been updated."
			}
            res.render('profile', data);
        },
        error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            var data = { 
		  		email: currentUser.get('email'),
		  		message: "Error: " + error.code + " " + error.message
			}
            res.render('profile', data);
        }
	});	
}

exports.getDashboard = function (req, res) {
	var currentUser = req.user;
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
		    		date: results[i].get('date'),
		    		location: results[i].get('Location')
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
		    				date: results[i].get('date'),
		    				location: obj.get('Location')
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
		    						date: results[i].get('date'),
		    						location: obj.get('Location')
		    					}
		    					arr3.push(temp);
		    				}
		    				res.render('dashboard', {allEvents: arr, yourEvents: arr2, joinedEvents: arr3, currName: currentUser.get('name')})
		    				
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
			res.render('dashboard', {currName: currentUser.get('name')})
		}
	});
}

// event form
exports.renderCreateEvent = function (req, res) {
	res.render('event_form')
}

// // fetch an event
exports.getEvent = function (req, res) {
	var currentUser = req.user;
	var Event = Parse.Object.extend("Event");
	var query = new Parse.Query(Event);
	query.get(req.params._id, {
		success: function(event) {
	    // Check if they are an admin or not
	    	var data = {
				objectId: event.id, 
				name: event.get('name'),
				location: event.get('Location'),
				date: event.get('date'),
				description: event.get('Description'),
			}

		    var EventAdmins = Parse.Object.extend("EventAdmins");
		    var query = new Parse.Query(EventAdmins);
		    query.equalTo("event", event);
		    query.include("user");
		    query.first({
		    	success: function(object) {
		    		data.host = object.get('user').get('username');
		    		// admin
		    		if (object.get('user').id == currentUser.id) {
		    			var arr = [];
						var EventAttendees = Parse.Object.extend("EventAttendees");
			    		var query = new Parse.Query(EventAttendees);
			    		query.equalTo("event", event);
			    		query.include("user");
			    		query.find({
			    			success: function(results) {
			    				data.count_check = 0;
			    				data.females = 0;
			    				data.males = 0;
			    				data.others = 0;
			    				for (var i = 0; i < results.length; i++) {
			    					var obj = results[i].get('user');
			    					var temp = {
			    						userId: obj.id, 
			    						userName: obj.get('username'),
			    						userStatus: results[i].get('CheckinStatus')
			    					}
			    					arr.push(temp);
			    					if (results[i].get('user').get('checkedIn') == true)
			    						data.count_check++;
			    					switch(results[i].get('user').get('gender')) {
			    						case "Female": data.females++; break;
			    						case "Male": data.males++; break;
			    						default: data.others++; break;
			    					}
			    				}
			    				data.admin = true;
			    				data.joined = false;
			    				data.attendees = arr;
			    				data.count_join = results.length;
				    			
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
					    			data.admin = false;
					    			data.joined = true;
					    			data.checkedIn = object.get('CheckinStatus');
					    			data.userId = currentUser.id;
					    		}
					    		// not joined yet
					    		else {
					    			data.admin = false;
					    			data.joined = false;
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

// // API stuff
exports.updateEvent = function (req, res) {
	// feature does not yet
	res.render('error', {message: "Sorry! This feature is not available yet."})
}


// api post to create an event
exports.createEvent = function (req, res) {
	var currentUser = req.user;
	var Event = Parse.Object.extend("Event");
	var newEvent = new Event();

	newEvent.set("name", req.body.event_name);
	newEvent.set("Location", req.body.location);
	newEvent.set("date", new Date(req.body.datetime));
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


exports.attend = function (req, res) {
	var currentUser = req.user;
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

exports.checkIn = function (req, res) {
	// make sure only host is logged in
	var currentUser = req.user;
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
			    			//object.set("CheckinTime", new Date().getTime());
			    			object.save(null, {
							 	success: function(object) {
							 		res.redirect('/event/' + event.id);
							 	},
							 	error: function(object, error) {
							 		res.render('error', {message: "Error: " + error.code + " " + error.message})
							 	}
							});		    		
		    		
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

