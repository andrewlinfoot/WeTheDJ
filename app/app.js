if (Meteor.isClient) {
  Songs = new Meteor.Collection("songs");

  Session.setDefault('currentPage', 'homePage');

  //Page Routing 
  Template.renderPage.helpers({
    homePage: function() {
      if (Session.equals('currentPage', 'homePage')) {
        return true;
      } else {
        return false;
      }
    },
    signupPage: function() {
      if (Session.equals('currentPage', 'signupPage')) {
        return true;
      } else {
        return false;
      }
    },
    loginPage: function() {
      if (Session.equals('currentPage', 'loginPage')) {
        return true;
      } else {
        return false;
      }
    }
  });

  Template.home.greeting = function () {
    if(Session.get('url')) {
      return Session.get('url');
    } else {
      return "Welcome to app.";      
    }
  };

  Template.home.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      Meteor.call('getSongList');

      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  Template.smartFileCredentials = function() {
    return true;
  };



  // //Get Exchange URLs and store them in the Songs collection
  // getExchangeURL = function(filePath) {
  //   Meteor.call("SmartFile", "POST",
  //     "/api/2/path/exchange/",
  //     {auth: "2fm70a9TvdcItdhsQmwicn8THvnn61:mQnzKCvvAsILQDGmj20y6W1QSdNEkb",
  //      params: {
  //        path: filePath,
  //        mode: "r",            //read only
  //        expires: 60*60*24 }   //expires after 1 day     
  //     },
  //     function(error, results) {
  //       console.log(results);
  //       content = JSON.parse(results.content);
  //       console.log(content);
  //       Session.set('url',content.url);

  //       //Meteor.call("insertSong", content);
  //       Meteor.call("getSongList");
  //   });
  // }
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
    insertSong: function(exchangeURL) {
      //hack for passing the filePath
      //works because the exchange URLs have the file path appended to the end
      var filePath = exchangeURL.split("wethedj");
      filePath = "wethedj" + filePath[1];
      filePath = decodeURIComponent(filePath);

      var results = Meteor.http.call("GET", "https://app.smartfile.com/api/2/path/info/"+filePath,
        { auth: "2fm70a9TvdcItdhsQmwicn8THvnn61:mQnzKCvvAsILQDGmj20y6W1QSdNEkb" });
      var data = results.data;

      var songData = {
        attributes: data.attributes,
        exchangeURL: content.url
      };
      //Songs.insert(songData);
    },
    getSongList: function() {
      var results = Meteor.http.get("https://app.smartfile.com/api/2/path/info/wethedj?children=on",
        { auth: "2fm70a9TvdcItdhsQmwicn8THvnn61:mQnzKCvvAsILQDGmj20y6W1QSdNEkb" });
      var data = results.data;
      var songArray = data.children;
      //console.log(songArray);
      for($i=0; $i<songArray.length; $i++) {
        if ( songArray[$i].extension === '.mp3') {
          var filePath = songArray[$i].url.split("wethedj");
          filePath = "wethedj" + filePath[1];
          filePath = decodeURIComponent(filePath);

          Meteor.call('getExchangeURL', filePath );
        }
      }
    },
    //Get Exchange URLs and store them in the Songs collection
    getExchangeURL: function(filePath) {
      Meteor.call("SmartFile", "POST",
        "/api/2/path/exchange/",
        {auth: "2fm70a9TvdcItdhsQmwicn8THvnn61:mQnzKCvvAsILQDGmj20y6W1QSdNEkb",
         params: {
           path: filePath,
           mode: "r",            //read only
           expires: 60*60*24 }   //expires after 1 day     
        },
        function(error, results) {
          content = JSON.parse(results.content);
          Meteor.call("insertSong", content.url);
      });
    }
  });
}
