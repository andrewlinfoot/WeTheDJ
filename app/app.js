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
          Session.set('songTitle', '');
          Session.set('currentPage', 'homePage');
        }
      });
    },
    'click #testbutton': function(e,t) {
      Meteor.call('getSongList');
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

  //Parse query strings
  deparam = function (querystring) {
    // remove any preceding url and split
    querystring = querystring.substring(querystring.indexOf('?')+1).split('&');
    var params = {}, pair, d = decodeURIComponent;
    // march and parse
    for (var i = querystring.length - 1; i >= 0; i--) {
      pair = querystring[i].split('=');
      params[d(pair[0])] = d(pair[1]);
    }

    return params;
  };//--  fn  deparam

  //get the GET parameters
  var getParams = deparam( window.location.search.replace( "?", "" ) );
  console.log(getParams);
  if ( getParams.verifier && window.opener ) {
    window.opener.callAuthorize( getParams.verifier );
    window.close();
  }

  //funtion to call authorize
  callAuthorize = function( oauth_verifier ) {
    console.log("running the oauth calls");

    var oauth_token = Session.get('oauth_token');
    var oauth_token_secret = Session.get('oauth_token_secret');

    Meteor.call('smartfileOAuthAccess', oauth_verifier, oauth_token, oauth_token_secret, function( error, results ) {
      console.log(error);
      console.log(results);

      var oauthResponse = deparam(results.content);
      console.log(oauthResponse);

      var oauth_token = oauthResponse.oauth_token;
      var oauth_token_secret = oauthResponse.oauth_token_secret;

      Meteor.call('addOAuth' , oauth_token , oauth_token_secret, function( error, results) {
        console.log(error);
        console.log(results);
        if (results === true) {
          location.reload();
        } else {
          location.reload();
        }

      });
    });
  }

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
    'click #loginWithSmartfile': function(e, t) {

      Meteor.call('smartfileOAuth', function (error, results) {
        console.log(error);
        console.log(results);
        console.log(results.content);

        var oauthResponse = deparam(results.content);
        console.log(oauthResponse);

        var oauth_token = oauthResponse.oauth_token;
        var oauth_token_secret = oauthResponse.oauth_token_secret;

        Session.set('oauth_token', oauth_token);
        Session.set('oauth_token_secret', oauth_token_secret);

        //window.location = 'https://app.smartfile.com/oauth/authorize/?oauth_token='+oauth_token+'&oauth_callback=http%3A%2F%2Flocalhost%3A3000?oauth_token='+oauth_token;
        window.open('https://app.smartfile.com/oauth/authorize/?oauth_token='+oauth_token+'&oauth_callback=http%3A%2F%2Flocalhost%3A3000');

      });

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

    if ( this.find('[data-nowPlaying]') ) {
      var nowPlaying = this.find('[data-nowPlaying]');      
    } else {
      var nowPlaying = this.find('[data-songTitle]');
    }
    var topSong = this.find('[data-songTitle]');

    var songTitle = nowPlaying.getAttribute('data-songTitle');
    var player = document.getElementById('audioPlayer');

    if( !Session.get('songTitle') ) {
      //first initialization
      nowPlaying.className="dark-content price-content";
      nowPlaying.style.marginTop="0px";

      nowPlaying.setAttribute('data-nowPlaying', true);

      player.src = nowPlaying.getAttribute('data-audioURL');

      Meteor.setTimeout(function(){player.play()},1000);

      Session.set('songTitle', songTitle);      
    } else if ( nowPlaying !== topSong ) {
      //new top song
      //remove old songs attributes
      var oldSong = nowPlaying;

      oldSong.className="white-content price-content";
      oldSong.style.marginTop="";

      oldSong.removeAttribute('data-nowPlaying');

      player.src = topSong.getAttribute('data-audioURL');
      player.play();

      //set new song as now playing
      topSong.className="dark-content price-content";
      topSong.style.marginTop="0px";

      topSong.setAttribute('data-nowPlaying', true);

      Session.set('songTitle', songTitle); 

    } else if ( nowPlaying === topSong ) {
      //same song on top reapply css changes
      nowPlaying.className="dark-content price-content";
      nowPlaying.style.marginTop="0px";

      nowPlaying.setAttribute('data-nowPlaying', true);
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
  Songs = new Meteor.Collection('songs');

  Meteor.startup(function () {
    // code to run on server at startup

  });

  Meteor.publish("songs", function() {
    return Songs.find();
  });

  Meteor.methods({
    SmartFile: function(method, uri, options) {
      this.unblock();
      return Meteor.http.call( method, "https://app.smartfile.com" + uri, options);
    },
    insertSong: function( playLink, filePath ) {

      var params = getOAuthParams();
      var results = Meteor.http.get('https://app.smartfile.com/api/2/path/info/'+filePath, {params: params})

      //sets the date that the song is entered into the DB
      //this is used to remove songs that have expired exchange urls
      var createdAt = new Date();
      createdAt = createdAt.getTime();
      console.log(createdAt);

      var data = results.data;
      var songTitle = data.attributes.Title;

      var songData = {
        songTitle: songTitle,
        attributes: data.attributes,
        exchangeURL: playLink,
        createdAt: createdAt,
        votes: 0
      };

      console.log(songData);

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
      var params = getOAuthParams();

      var results = Meteor.http.get("https://app.smartfile.com/api/2/path/info/wethedj/?children=on", {params: params});

      var data = results.data;
      var songArray = data.children;

      for( var i=0; i < songArray.length; i++) {
        if ( songArray[i].extension === 'mp3') {
          var filePath = songArray[i].url.split("wethedj");
          filePath = "/wethedj" + filePath[1];
          filePath = decodeURIComponent(filePath);

          Meteor.call('getPlayLink', filePath );
        }
      }
    },
    //Get Play links and store them in the Songs collection
    getPlayLink: function(filePath) {
      /*************************************************************
        Using OAuth - Couldn't get to work with api/2/link/ endpoint

      **************************************************************/
      // //gets the user data of the current user
      // var params = getOAuthParams();

      // params.path = filePath;
      // params.read = "on";              //read only
      // params.list = "on";              //list mode? it seems we need it

      // //console.log(params);

      // var results = Meteor.http.post('https://app.smartfile.com/api/2/link/', {params: params} );
      // console.log(results);

      /********************************************************************
        Temporary hard coded API key for demo

      *********************************************************************/
      var params = {
        path: filePath,
        read: "on",
        list: "on"
      };
      //hardcoded api keys for alinfoot9
      var auth = "7bbGRLbWoKYO1zqr9F2VQVFuhwQoBq:1CsQ8aD9CI0XJjngmUD5I5Y1CUEXJx";
      var results = Meteor.http.post('https://app.smartfile.com/api/2/link/', {params: params, auth: auth});

      var href = results.data.href;
      var fileName = results.data.path;
      fileName = fileName.split("wethedj/");
      fileName = fileName[1];
      fileName = encodeURIComponent(fileName);

      var playLink = href+fileName;
      console.log(playLink);

      Meteor.call('insertSong', playLink , filePath);

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
    //successfully returns request_token
    smartfileOAuth: function() {
      var timestamp = new Date();
      timestamp = Math.floor(timestamp.getTime() / 1000);

      var nonce = Math.floor(Math.random()*1000000000000);

      var params = {
        oauth_consumer_key: "m0smtXzYZ9CRCWNrHywf0a7gts8EkE",
        oauth_signature_method: "PLAINTEXT",
        oauth_signature: "UgZltyLchvQdenDYHhzlFwipdLbE5F%26",
        oauth_timestamp: timestamp,
        oauth_nonce: nonce,
        oauth_version: 1.0,
        oauth_callback: "http://localhost:3000"
      };
      console.log(params);
      return Meteor.http.get("https://app.smartfile.com/oauth/request_token/", {params: params});
    },
    smartfileOAuthAccess: function( oauth_verifier, oauth_token, oauth_token_secret ) {
      var timestamp = new Date();
      timestamp = Math.floor(timestamp.getTime() / 1000);

      var nonce = Math.floor(Math.random()*1000000000000);

      var params = {
        oauth_consumer_key: "m0smtXzYZ9CRCWNrHywf0a7gts8EkE",
        oauth_signature_method: "PLAINTEXT",
        oauth_signature: "UgZltyLchvQdenDYHhzlFwipdLbE5F%26"+oauth_token_secret,
        oauth_timestamp: timestamp,
        oauth_nonce: nonce,
        oauth_version: 1.0,
        oauth_token: oauth_token,
        oauth_verifier: oauth_verifier
      };
      console.log(params);
      return Meteor.http.get("https://app.smartfile.com/oauth/access_token/", {params: params});
    },
    addOAuth: function( oauth_token, oauth_token_secret ) {
        var userID = Meteor.userId();
        Meteor.users.update(
        {
          _id: userID
        },{ $set:{ 
            smartFile: {
              oauth_token: oauth_token,
              oauth_token_secret: oauth_token_secret
            }
          }
        }, function(error) {
          console.log(error);
        });      
        return true;
    }
  });

  //function to get OAuth parameters for a given user
  getOAuthParams = function() {
      var userData = Meteor.user();
      var oauth_token = userData.smartFile.oauth_token;
      var oauth_token_secret = userData.smartFile.oauth_token_secret;
      var timestamp = new Date();
      timestamp = Math.floor(timestamp.getTime() / 1000);

      var nonce = Math.floor(Math.random()*1000000000000);

      var params = {
        oauth_consumer_key: "m0smtXzYZ9CRCWNrHywf0a7gts8EkE",
        oauth_signature_method: "PLAINTEXT",
        oauth_signature: "UgZltyLchvQdenDYHhzlFwipdLbE5F%26"+oauth_token_secret,
        oauth_timestamp: timestamp,
        oauth_nonce: nonce,
        oauth_version: 1.0,
        oauth_token: oauth_token,
      };

      return params;
  }
}
