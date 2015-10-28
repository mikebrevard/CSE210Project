Parse.initialize("Bn4qZapXuVfTFxqRoeagbdQgpPiCIdGdudgnDBSB", "bqE6qmaTnILaijsSicwKWSKYwaoLZGLSp3YC7wDA");

var TestObject = Parse.Object.extend("TestObject");
var testObject = new TestObject();
  testObject.save({foo: "bar"}, {
  success: function(object) {
    $(".success").show();
  },
  error: function(model, error) {
    $(".error").show();
  }
});