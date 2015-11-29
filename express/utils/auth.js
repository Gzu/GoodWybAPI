/**
 * Created by nicolasfasetti on 30/09/15.
 */
var AuthUtils = {
    isAuthenticated: function(req,res,next) {
        if (req.isAuthenticated()) {
            console.log("Authenticated");
            return next();
        } else {
            console.log("Not Authenticated");
            return res.status(401).send("Unauthenticated");
        }
    },
    canEditMap: function(user,map) {
        if (map.owner==user.id) {
            return true;
        } else {
            return false;
        }
    },
    canAddMarker: function(user,map) {
        if ((map.owner==user.id) || (map.isPublic) || (map.authorized.indexOf(user.id)!=-1)) {
            return true;
        } else {
            return false;
        }
    },
    canEditMarker: function(user,marker,map) {
        if ((map.owner==user.id) || (marker.owner=user.id)) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = AuthUtils;