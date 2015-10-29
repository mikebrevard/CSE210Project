// added keys for Eventor [APPLICATION ID], [JAVASCRIPT ID]
Parse.initialize("TAqW6JABm2HvOp28LtglzAaCOXvg0hqYhLTnqHV7",
		"1dBZMfjDznjLx2Dw4OXlL1Ah5dNbj2QEN5sTFXCW");

var TestObject = Parse.Object.extend("TestObject");
var testObject = new TestObject();
testObject.save({
	foo : "bar"
}, {
	success : function(object) {
		$(".success").show();
	},
	error : function(model, error) {
		$(".error").show();
	}
});

userRegister();

function userRegister() {
	var user = new Parse.User();
	user.set("username", "my name");
	user.set("email", "testemail@gmail.com");
	user.set("password", "1234");

	user.signUp(null, {
		success : function(user) {
			// Hooray! Let them use the app now.
			console.log("User was added correctly");
		},
		error : function(user, error) {
			// Show the error message somewhere and let the user try again.
			alert("User Failed: Error: " + error.code + " " + error.message);
		}
	});

	return "success";

}