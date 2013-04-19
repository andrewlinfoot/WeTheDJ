if (Meteor.isClient) {
  Songs = Meteor.subscribe("songs");

  Songs = new Meteor.Collection("songs");

  /* ==============================================================
    Home Page Code 
    Starts Here
  =============================================================== */
  Session.setDefault('currentPage', 'homePage');

  //Page Routing 
  Template.renderHome.helpers({
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

  //Header Navigation
  Template.header.events({
    'click #_signup': function(e, t) {
      e.preventDefault();
      window.scrollTo(0,0);
      Session.set('currentPage', 'signupPage');
    },    
    'click #_login': function(e, t) {
      e.preventDefault();
      window.scrollTo(0,0);
      Session.set('currentPage', 'loginPage');
    },    
    'click #_home': function(e, t) {
      e.preventDefault();
      window.scrollTo(0,0);
      Session.set('currentPage', 'homePage');
    },
    'click #_logout': function(e, t) {
      e.preventDefault();
      Meteor.logout( function(err) {
        if (err) {
          alert('error');
        } else {
          window.scrollTo(0,0);
          Session.set('currentPage', 'homePage');
        }
      });
    }
  });

  //Sign Up Events
  Template.signup.events({
    'click #_login': function(e, t) {
      e.preventDefault();
      window.scrollTo(0,0);
      Session.set('currentPage', 'loginPage');
    },
    'submit #createAccount, click #createAccount': function(e, t) {
      e.preventDefault();

      var email = t.find('#email').value
        , password = t.find('#password').value
        , confPassword = t.find('#confPassword').value;

      if( email && password && confPassword ) {
        if( !isValidEmail(email) ) {
          alert("Not valid email");
        } else if ( password != confPassword) {
          alert("Passwords do not match");
        } else {
          Accounts.createUser({email: email, password: password}, function(error) {
            if (error) {
              alert("User create error");
            }
          });
        }
      } else {
        alert("please enter all of the required fields");
      }
    }
  });

  //Login Events
  Template.login.events({
    'click #_signup': function(e, t) {
      e.preventDefault();
      window.scrollTo(0,0);
      Session.set('currentPage', 'signupPage');
    },
    'submit #loginUser, click #loginUser': function(e, t) {
      e.preventDefault();

      var email = t.find('#email').value
        , password = t.find('#password').value;

      if( email && password ) {
        if( !isValidEmail(email) ) {
          alert("Not valid email");
        } else {
          Meteor.loginWithPassword(email, password, function(error) {
            if (error) {
              alert(error.reason);
            } else {
              Meteor.call('getSongList');
            }
          });
        }
      } else {
        alert("please enter all of the required fields");
      }
    }
  });

  //REGEX check for valid email format
  var isValidEmail = function(email) {
    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
    return pattern.test(email);
  };

  Template.home.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      Meteor.call('getSongList');

      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  /* ==============================================================
    Dashboard Code 
    Starts Here
  =============================================================== */
  //initilize the audioElement variable
  audioElement = document.createElement('audio');

  Template.renderDash.smartFileCredentials = function() {
    Meteor.call('checkSmartFileCred', function(error, result) {
      if ( error || (result === false) ) {
        console.log("Check failed");
        Session.set('smartFile', false);
      } else if ( result === true ) {
        console.log("you have the credentials");
        Session.set('smartFile', true);
      }
    });
    if ( Session.equals('smartFile', false) ) {
      return false;
    }    
    if ( Session.equals('smartFile', true) ) {
      return true;
    }
  };

  Template.addAPIcredentials.events({
    'submit #submitAPIcredentials, click #submitAPIcredentials': function(e, t) {
      e.preventDefault();

      var apiKey = t.find('#apiKey').value
        , apiPassword = t.find('#apiPassword').value;

      if( apiKey && apiPassword ) {
        Meteor.call('validateSmartFileCred', apiKey, apiPassword, function(error, result) {
          console.log(error);
          console.log(result);
          if ( result === true ) {
            Session.set('smartFile', true);
          }
        });
      } else {
        alert("please enter both you key and password");
      }

    }
  });

  Template.dashboard.songs = function() {
    return Songs.find({},{sort: { votes: -1 }});
  }

  Template.songDisplay.events({
    'click .upvote': function(e, t) {
      e.preventDefault();  

      Songs.update({_id: t.data._id},{$inc: {votes: 1}});
    }
  });

  /* ==============================================================
    Template UI Rendering Code 
    Starts Here
  =============================================================== */
  Template.home.rendered = function() {
      $(function() {
        var Page = (function() {
          var $navArrows = $( '#nav-arrows' ),
            $nav = $( '#nav-dots > span' ),
            slitslider = $( '#slider' ).slitslider( {
              onBeforeChange : function( slide, pos ) {

                $nav.removeClass( 'nav-dot-current' );
                $nav.eq( pos ).addClass( 'nav-dot-current' );

              }
            } ),
            init = function() {
              initEvents();   
            },
            initEvents = function() {
              // add navigation events
              $navArrows.children( ':last' ).on( 'click', function() {
                slitslider.next();
                return false;
              } );
              $navArrows.children( ':first' ).on( 'click', function() {
                slitslider.previous();
                return false;
              } );
              $nav.each( function( i ) {
                $( this ).on( 'click', function( event ) {
                  var $dot = $( this );
                  if( !slitslider.isActive() ) {
                    $nav.removeClass( 'nav-dot-current' );
                    $dot.addClass( 'nav-dot-current' );
                  }
                  slitslider.jump( i + 1 );
                  return false;
                } );
              } );
            };
            return { init : init };
        })();
        Page.init();
      });

      $(document).ready(function () {
        $('#shell img').plaxify()
        $.plax.enable()
      });

  }
  Template.dashboard.rendered = function() {
    var nowPlaying = this.find('[data-songTitle]');
    var songTitle = nowPlaying.getAttribute('data-songTitle');

    if( !Session.get('songTitle') ) {
      console.log("first initialization");

      nowPlaying.className="dark-content price-content";
      nowPlaying.style.marginTop="0px";

      nowPlaying.setAttribute('data-topSong', true);

      var player = document.getElementById('audioPlayer');
      player.src = nowPlaying.getAttribute('data-audioURL');

      Meteor.setTimeout(function(){player.play()},1000);

      Session.set('songTitle', songTitle);      
    } else if ( !Session.equals('songTitle', songTitle) ) {
      //new top song
      //remove old songs attributes
      console.log("new top song");
      var oldSong = this.find('[data-topSong]');

      oldSong.className="white-content price-content";
      oldSong.style.marginTop="";

      oldSong.removeAttribute('data-topSong');

      var player = document.getElementById('audioPlayer');
      player.src = nowPlaying.getAttribute('data-audioURL');
      player.play();

      //set new song as now playing
      nowPlaying.className="dark-content price-content";
      nowPlaying.style.marginTop="0px";

      nowPlaying.setAttribute('data-topSong', true);

      Session.set('songTitle', songTitle); 

    } else if ( Session.equals('songTitle', songTitle)) {
      console.log('rerender, same song on top');
      nowPlaying.className="dark-content price-content";
      nowPlaying.style.marginTop="0px";

      nowPlaying.setAttribute('data-topSong', true);
    }

  }
  Template.songDisplay.rendered = function() {
    console.log("song display rendered");
  }
}

/* ==============================================================
  Server Code 
  Starts Here
=============================================================== */

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
    Songs = new Meteor.Collection('songs');

  });

  // Meteor.setInterval(function() {

  // }, 60*60*24*1000);
  Meteor.publish("songs", function() {
    return Songs.find();
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

      //gets the user data of the current user
      var userData = Meteor.user();
      var ownerUsername = userData.smartFile.ownerUsername;
      var auth = userData.smartFile.apiKey + ":" + userData.smartFile.apiPassword;

      //gets the attributes of the song
      var results = Meteor.http.call("GET", "https://app.smartfile.com/api/2/path/info/"+filePath,
        { auth: auth });
      var data = results.data;

      //sets the date that the song is entered into the DB
      //this is used to remove songs that have expired exchange urls
      var createdAt = new Date();
      createdAt = createdAt.getTime();
      console.log(createdAt);

      var songTitle = data.attributes.Title;

      var songData = {
        songTitle: songTitle,
        attributes: data.attributes,
        exchangeURL: exchangeURL,
        createdAt: createdAt,
        ownerUsername: ownerUsername,
        votes: 0
      };

      if( Songs.find().count() === 0 ) {
        Songs.insert(songData);
      } else {
        if( Songs.findOne({songTitle: songTitle}) ) {
          console.log("Found match");
        } else {
          Songs.insert(songData);
          console.log("Inserting");
        }  
      }

    },
    getSongList: function() {
      //gets the user data of the current user
      var userData = Meteor.user();
      var ownerUsername = userData.smartFile.ownerUsername;
      var auth = userData.smartFile.apiKey + ":" + userData.smartFile.apiPassword;

      var results = Meteor.http.get("https://app.smartfile.com/api/2/path/info/wethedj?children=on",
        { auth: auth });
      var data = results.data;
      var songArray = data.children;
      //console.log(songArray);
      for($i=0; $i<songArray.length; $i++) {
        if ( songArray[$i].extension === '.mp3') {
          var filePath = songArray[$i].url.split("wethedj");
          filePath = "/wethedj" + filePath[1];
          filePath = decodeURIComponent(filePath);

          Meteor.call('getExchangeURL', filePath );
        }
      }
    },
    //Get Exchange URLs and store them in the Songs collection
    getExchangeURL: function(filePath) {
      //gets the user data of the current user
      var userData = Meteor.user();
      var ownerUsername = userData.smartFile.ownerUsername;
      var auth = userData.smartFile.apiKey + ":" + userData.smartFile.apiPassword;

      console.log(filePath);

      Meteor.call("SmartFile", "POST",
        "/api/2/path/exchange/",
        {auth: auth,
         params: {
           path: filePath,
           mode: "r",            //read only
           expires: 60*60*24*10 }   //expires after 10 days     
        },
        function(error, results) {
          console.log(error);
          content = JSON.parse(results.content);
          Meteor.call("insertSong", content.url);
      });
    },
    //checks to see if the user has entered their smartfile credentials yet
    checkSmartFileCred: function() {
      if( Meteor.user().smartFile ){
        console.log("got dem credits");
        return true;
      } else if ( !Meteor.user().smartFile ) {
        console.log("no soup for you");
        return false;
      }
    },
    //validates smartFile credentials and if valid, adds them to the users account
    //also adds the ownerUsername value which sorts users by account
    validateSmartFileCred: function(apiKey, apiPassword) {
      auth = apiKey + ":" + apiPassword;
      //2fm70a9TvdcItdhsQmwicn8THvnn61:mQnzKCvvAsILQDGmj20y6W1QSdNEkb
      var results = Meteor.http.get("https://app.smartfile.com/api/2/whoami/", {auth: auth});
      if ( results.error === null) {
        //legit creds
        var data = results.data;
        if (data.user.owner === null) {
          var ownerUsername = data.user.username;
        } else {
          var ownerUsername = data.user.owner.username;
        }

        var userID = Meteor.userId();
        Meteor.users.update(
        {
          _id: userID
        },{ $set:{ 
            smartFile: {
              apiKey: apiKey,
              apiPassword: apiPassword,
              ownerUsername: ownerUsername
            }
          }
        }, function(error) {
          console.log(error);
        });
        return true;
      } else {
        //not so legit
        console.log("failed validateSmartFileCred");
        return false;
      }
    }
  });
}
