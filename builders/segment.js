var turf = require('turf');
var _ = require('lodash');
var Promise = require('bluebird');

module.exports = {
  /* For each bus stop pair:
   *  1. slice route points from the point closets to the 1st bus stop
   *     to the point closest to the 2nd bus stop
   */
  makeSegments: function (routeObj, routeID, buffDist) {
    return Promise.map(routeObj[routeID], (fc) => {
      var routePnts = fc.geometry.geometries[0];
      var busPnts = fc.geometry.geometries[1].features;
      Promise.map(Object.keys(busPnts), (key, val) => {
        const nextKey = (parseInt(key) + 1).toString();
        if (busPnts[nextKey]) {
          let stops = [
            busPnts[key],
            busPnts[nextKey]
          ];
          const selRoutePnts = stops.map((stop) => {
            let buffedStop = turf.featureCollection(
              turf.buffer(stop, buffDist, 'meters')
            );
            let selStopPnts = turf.within(routePnts, buffedStop);
            // while (selStopPnts.features.length < 1) {
            //   buffDist += 10;
            //   console.log(buffDist);
            //   buffedStop = turf.featureCollection(
            //     turf.buffer(stop, buffDist, 'meters')
            //   );
            //   selStopPnts = turf.within(routePnts, buffedStop);
            // }
            console.log(selStopPnts);
            return selStopPnts;
          });
          return selRoutePnts;
          // next do within
          // then do distance, selecting closest
        }
      })
      .then((allSelRoutePnts) => {
        return allSelRoutePnts;
      });
    })
    .then((geom) => {
      return geom;
    });
  }
};
