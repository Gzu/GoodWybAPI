/**
 * Created by nicolasfasetti on 28/09/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Map = new Schema({
    name: String,
    desc: String,
    owner: String,
    isPublic: {type: Boolean, default: true },
    authorized: [String],
    createdOn: { type : Date, default : Date.now },
    updatedOn: { type : Date, default : Date.now }
});

module.exports = mongoose.model('Map', Map);