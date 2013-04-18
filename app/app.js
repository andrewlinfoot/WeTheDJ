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
            }
          });
        }
      } else {
        alert("please enter all of the required fields");
      }

    }
  });

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

  Template.smartFileCredentials = function() {
    return true;
  };

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
      })

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
