if (Meteor.isClient) {
  Songs = new Meteor.Collection("songs");

  Template.hello.greeting = function () {
    if(Session.get('url')) {
      return Session.get('url');
    } else {
      return "Welcome to app.";      
    }
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      getExchangeURL("/wethedj/01 Action (3LAU Extended Edit).mp3");

      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  //Get Exchange URLs and store them in the Songs collection
  getExchangeURL = function(filePath) {
    Meteor.call("SmartFile", "POST",
      "/api/2/path/exchange/",
      {auth: "2fm70a9TvdcItdhsQmwicn8THvnn61:mQnzKCvvAsILQDGmj20y6W1QSdNEkb",
       params: {
         path: filePath,
         mode: "r",            //read only
         expires: 60*60*24 }   //expires after 1 day     
      },
      function(error, results) {
        console.log(results);
        content = JSON.parse(results.content);
        console.log(content);
        Session.set('url',content.url);

        //Meteor.call("insertSong", content);
        Meteor.call("getSongList");
    });
  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Songs = new Meteor.Collection("songs");

  });

  Meteor.methods({
    SmartFile: function(method, uri, options) {
      this.unblock();
      return Meteor.http.call( method, "https://app.smartfile.com" + uri, options);
    },
    insertSong: function(content) {
      //hack for passing the filePath
      //works because the exchange URLs have the file path appended to the end
      var filePath = content.url.split("wethedj");
      filePath = "wethedj" + filePath[1];
      filePath = decodeURIComponent(filePath);
      console.log(filePath);

      var results = Meteor.http.call("GET", "https://app.smartfile.com/api/2/path/info/"+filePath,
        { auth: "2fm70a9TvdcItdhsQmwicn8THvnn61:mQnzKCvvAsILQDGmj20y6W1QSdNEkb" });
      var data = results.data;

      var songData = {
        attributes: data.attributes,
        exchangeURL: content.url
      };
      console.log(songData);
      //Songs.insert(songData);
    },
    getSongList: function() {
      var results = Meteor.http.get("https://app.smartfile.com/api/2/path/info/wethedj?children=on",
        { auth: "2fm70a9TvdcItdhsQmwicn8THvnn61:mQnzKCvvAsILQDGmj20y6W1QSdNEkb" });
      var data = results.data;
      var songArray = data.children;
      console.log(songArray);
      //songArray.forEach
    }
  });
}
