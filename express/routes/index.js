var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var AuthUtils = require('../utils/auth');
var router = express.Router();

router.get('/', function (req, res) {
  res.send("HOME");
});

router.post('/register', function(req, res) {
  Account.register(new Account({ username : req.body.username ,email :req.body.email,provider:"goodwyb"}), req.body.password, function(err, account) {
    if (err) {
      return res.send("FAILED");
    }

    passport.authenticate('local')(req, res, function () {
      res.send("REGISTERED");
    });
  });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
  res.send("LOGGED IN");
});

router.get('/login/facebook', passport.authorize('facebook', { scope : 'email' }));

// handle the callback after facebook has authorized the user
router.get('/login/facebook/callback',
    passport.authorize('facebook', {
      successRedirect : '/securedping',
      failureRedirect : '/'
    }));


router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

//TODO: to remove
router.get('/ping', function(req, res){
  res.status(200).send("pong!");
});
router.get('/securedping',AuthUtils.isAuthenticated, function(req, res, next){
  res.status(200).send("securedpong!");
});

module.exports = router;
