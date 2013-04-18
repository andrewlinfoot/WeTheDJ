if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to app.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  pingPong = function(data) {
    console.log(data);
  }

  Meteor.http.call( "GET" ,"https://app.smartfile.com/api/2/ping/",
    {params: {format:"json-p"},
     headers: "Acces-Control-Allow-Origin: *", 
     timeout: 10000 },
    function(error, result) {
      console.log(error);
      console.log(result);
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
