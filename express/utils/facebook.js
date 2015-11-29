/**
 * Created by nicolasfasetti on 30/09/15.
 */
var Facebook= {
    opts: {

        // pull in our app id and secret from our auth.js file
        clientID: "330809210372593",
        clientSecret: "385c6da1581b68539bb98acb902f762c",
        callbackURL: '/login/facebook/callback',
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
    fbCallback: function (req, token, refreshToken, profile, done) {

        process.nextTick(function () {
            console.log("token: " + token);
            if (!req.user) {
                console.log("looking for user with profile id: " + profile.id);
                Account.findOne({'facebook.id': profile.id}, function (err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        var newAccount = new Account();
                        console.log("defore setting");
                        // set all of the facebook information in our user mode
                        newAccount.facebook.id = profile.id; // set the users facebook id
                        newAccount.facebook.token = token; // we will save the token that facebook provides to the user
                        newAccount.facebook.name = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                        newAccount.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                        newAccount.name = profile.name.givenName + ' ' + profile.name.familyName;

                        // save our user to the database
                        newAccount.save(function (err) {
                            if (err)
                                throw err;

                            // if successful, return the new user
                            return done(null, newAccount);
                        });
                    }

                });

            } else {
                // user already exists and is logged in, we have to link accounts
                var user = req.user; // pull the user out of the session

                // update the current users facebook credentials
                user.facebook.id = profile.id;
                user.facebook.token = token;
                user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email = profile.emails[0].value;

                // save the user
                user.save(function (err) {
                    if (err)
                        throw err;
                    return done(null, user);
                });
            }

        });

    }
}

module.exports = Facebook;