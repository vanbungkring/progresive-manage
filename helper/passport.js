var LocalStrategy = require('passport-local').Strategy;
var models = require(GLOBAL_PATH + '/models/index.js');
// // load the auth variables
// var configAuth = require('./auth'); // use this one for testing

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        models.user.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
        },
        function(req, email, password, done) {
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching
            // asynchronous
            process.nextTick(function() {
                models.user.findOne({
                    'email': email
                }).deepPopulate('merchant').exec(function(err, result) {
                  console.log(result);
                    if (err) {
                        return done(err);
                    }
                    // if no user is found, return the message
                    if (result === null) {
                        return;
                    }
                    if (!result.validPassword(password)) {
                        return;
                    } else {
                        return done(null, result);
                    }
                });
            });

        }));
};
