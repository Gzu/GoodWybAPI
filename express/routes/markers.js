/**
 * Created by nicolasfasetti on 28/09/15.
 */
var express = require('express');
var router = express.Router();
var Marker = require('../models/marker');
var Map = require('../models/map');
var AuthUtils = require('../utils/auth');

router.post('/',AuthUtils.isAuthenticated,function(req,res) {
    console.log(0);
    Map.findById(req.body.mapId, function(err,content) {
        console.log(1);
        if (err) res.send(err);
        else {
            console.log(2);
            if (AuthUtils.canAddMarker(req.user,content)) {
                console.log(3);
                Marker.create({ name: req.body.name,lat:req.body.lat, lng: req.body.lng , mapId: req.body.mapId, owner: req.user.id, comments: req.body.comments}, function (err, content) {
                    console.log(4);
                    if (err) res.send(err);
                    else res.send(content);
                });
            } else {
                res.status(403).send("Dommage");
            }
        }
    });

});

router.get('/:id',AuthUtils.isAuthenticated,function(req, res) {
    Map.findById(req.params.id, function(err,content) {
        if (err) res.send(err);
        else if (AuthUtils.canAddMarker(req.user,content)) {
            Marker.find({ mapId: req.params.id}, function (err, content){
                if (err) res.send(err);
                res.send(content);
            })
        } else {
            res.status(403).send("Not Authorized");
        }
    });
});

router.post('/:id',AuthUtils.isAuthenticated,function(req,res) {
    console.log("test");
    Marker.findById(req.params.id, function(err, marker) {
        if (err) res.send(err);
        else {
            Map.findById(req.body.mapId, function(err,content) {
                if (err) res.send(err);
                else if (AuthUtils.canEditMarker(req.user,marker,content)) {
                    if (req.body.lat) marker.lat = req.body.lat;
                    if (req.body.lng) marker.lng = req.body.lng;
                    if (req.body.name) marker.name = req.body.name;
                    if (req.body.comments) marker.comments = req.body.comments;
                    marker.updatedOn = Date.now();
                    marker.save(function (err) {
                        if (err)
                            res.send(err);

                        res.json(marker);
                    });
                }
            });
        }
    });
});

module.exports = router;