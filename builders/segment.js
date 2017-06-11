var turf = require('turf');
var _ = require('lodash');
var Promise = require('bluebird');

module.exports = {
  /* For each bus stop pair:
   *  1. slice route points from the point closets to the 1st bus stop
   *     to the point closest to the 2nd bus stop
   */
  makeSegments: function (routeObj, routeID) {
    return Promise.map(routeObj[routeID], (geomColl) => {
      var routePnts = geomColl.geometry.geometries[0];
      var busPnts = geomColl.geometry.geometries[1];
    })
    .then((geom) => {
      return geom;
    });
  }
};
