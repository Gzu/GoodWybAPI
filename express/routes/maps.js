/**
 * Created by nicolasfasetti on 28/09/15.
 */
var express = require('express');
var router = express.Router();
var Map = require('../models/map');
var AuthUtils = require('../utils/auth');

router.get('/',AuthUtils.isAuthenticated,function(req,res) {
    Map.find({ owner: req.user.id}, function (err, content){
        if (err) return handleError(err);
        res.send(content);
    })
});

router.get('/friends',AuthUtils.isAuthenticated,function(req,res) {
    Map.find({ authorized: req.user.id}, function (err, content){
        if (err) return handleError(err);
        res.send(content);
    })
});

router.post('/',AuthUtils.isAuthenticated,function(req,res) {
    Map.create({name: req.body.name, desc: req.body.desc, owner: req.user.id}, function (err, content) {
        if (err) return handleError(err);
        res.send(content);
    });
});

router.get('/:id',AuthUtils.isAuthenticated,function(req, res) {
    Map.findById(req.params.id, function(err, content) {
        if (err)
            res.send(err);
        if (AuthUtils.canAddMarker(req.user,content)) {
            return res.json(content);
        } else {
            res.status(403).send("Dommage");
        }
    });
});

router.post('/:id',AuthUtils.isAuthenticated,function(req,res) {
    Map.findById(req.params.id, function(err, content) {
        if (err)
            res.send(err);
        if (AuthUtils.canEditMap(req.user,content)) {
            if (req.body.desc) content.desc = req.body.desc;
            if (req.body.name) content.name = req.body.name;
            if (req.body.authorized) content.authorized = req.body.authorized;
            content.updatedOn = Date.now();
            content.save(function (err) {
                if (err)
                    res.send(err);
                res.json(content);
            });
        } else {
            res.status(403).send("Dommage");
        }
    });
});

module.exports = router;