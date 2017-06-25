'use strict';

var turf = require('turf');
var _ = require('lodash');
Promise = require('bluebird');

module.exports = {
  makeRouteObj: (routeJSON) => {
    // remove non-geom properties and keys w/null props
    // null props occur when route directions does not exist
    let routeJSONdirs = _.omit(routeJSON, ['RouteID', 'Name']);
    routeJSONdirs = _.omitBy(routeJSONdirs, _.isNull);
    // return object for route w/one k,v pair...
    // routeID: geometryCollection
    // this geometryCollection has routes & stops for all possible directions
    const routeID = routeJSON.RouteID;
    let routeObj = {};
    routeObj[routeID] = Object.keys(routeJSONdirs).map((k, v) => {
      return turf.geometryCollection([
        turf.featureCollection(
              routeJSONdirs[k].Shape.map((point) => {
                return turf.point([point.Lon, point.Lat]);
              })
            ),
        turf.featureCollection(
              routeJSONdirs[k].Stops.map((point) => {
                return turf.point([point.Lon, point.Lat]);
              })
            )
      ], {
        rtId: routeJSON.RouteID,
        dir: routeJSONdirs[k].DirectionText.slice(0, 1),
        dirNum: routeJSONdirs[k].DirectionNum
      });
    });
    return routeObj;
  },
  addPoints: (routePnts, loops) => {
    let moreRoutePnts = routePnts;
    for (var i = 0; i < loops; i++) {
      let morePnts = [];
      moreRoutePnts = moreRoutePnts.features.map(
      (feature, index) => {
        const nextIndex = index + 1;
        if (moreRoutePnts.features[nextIndex]) {
          const firstPnt = moreRoutePnts.features[index];
          const secondPnt = moreRoutePnts.features[nextIndex];
          const midPnt = turf.midpoint(firstPnt, secondPnt);
          morePnts = morePnts.concat([firstPnt, midPnt, secondPnt]);
        }
        return morePnts;
      });
      moreRoutePnts = _.flatten(morePnts);
      console.log(moreRoutePnts.length);
      if (i !== loops) {
        moreRoutePnts = turf.featureCollection(moreRoutePnts);
      }
    }
    return moreRoutePnts;
  }
};
