/**
 * Created by nicolasfasetti on 28/09/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Marker = new Schema({
    lat: String,
    lng: String,
    name: String,
    mapId: String,
    owner: String,
    comments: [
        {
            author: String,
            content:String,
            createdOn: { type : Date, default : Date.now },
            updatedOn: { type : Date, default : Date.now }
        }
    ],
    createdOn: { type : Date, default : Date.now },
    updatedOn: { type : Date, default : Date.now }
});

module.exports = mongoose.model('Marker', Marker);