'use strict';

var turf = require('turf');
var Promise = require('bluebird');
var addPoints = require('./turf-helpers').addPoints;
var _ = require('lodash');

module.exports = {
  /* For each bus stop pair:
   *  1. Buffer each stop in bus stop pair
   *  2. Attempt to select routePnts with those buffers
   *  3. If attempt not successful, retry until successful
   *  4. Reduce each stop's selected point to be just the closets point
   *  5. Subset routePnts to make bus segment.
   *  6. Return bus segment
   */
  makeSegments: function (routeObj, routeID, buffDist) {
    return Promise.map(routeObj[routeID], (fc) => {
      let routePnts = fc.geometry.geometries[0];
      const routePntsFC = addPoints(routePnts, 5);
      let busPnts = fc.geometry.geometries[1].features;
      return Promise.map(Object.keys(busPnts), (key, ix) => {
        const nextKey = (parseInt(key) + 1).toString();
        let segRoutePntsIndex;
        if (busPnts[nextKey]) {
          let stops = [
            busPnts[key],
            busPnts[nextKey]
          ];
          segRoutePntsIndex = stops.map((stop) => {
            const nearestPnt = turf.nearest(stop, routePntsFC);
            return routePntsFC.features.indexOf(nearestPnt);
          });
        }
        if (segRoutePntsIndex) {
          let segPnts;
          const segObj = {};
          segPnts = routePntsFC.features.slice(
            segRoutePntsIndex[0],
            segRoutePntsIndex[1]
          ).map((pnt) => {
            return pnt.geometry.coordinates;
          });
          segObj[ix] = segPnts;
          return segObj;
        }
      })
      .then((segObjs) => {
        return _.difference(segObjs, [ undefined ]);
      });
    })
    .then((routeSegs) => {
      return routeSegs;
    });
  }
};
