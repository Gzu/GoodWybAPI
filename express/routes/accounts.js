/**
 * Created by nicolasfasetti on 29/09/15.
 */
/**
 * Created by nicolasfasetti on 28/09/15.
 */
var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var AuthUtils = require('../utils/auth');

router.get('/',AuthUtils.isAuthenticated,function(req, res) {
    res.send(req.user);
});

router.post('/:id',AuthUtils.isAuthenticated,function(req,res) {
    Account.findById(req.params.id, function(err, content) {
        if (err) res.send(err);
        else if (content.id==req.user.id) {
            if (req.body.username) content.lat = req.body.lat;
            if (req.body.email) content.name = req.body.email;
            if (req.body.facebook) content.facebook = req.body.facebook;
            content.updatedOn = Date.now();
            content.save(function (err) {
                if (err) res.send(err);
                else res.json(content);
            });
        } else {
            res.status(403).send("Dommage");
        }
    });
});

module.exports = router;