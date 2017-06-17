var turf = require('turf');
var Promise = require('bluebird');

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
            let selStopPnts = turf.nearest(stop, routePnts);
            // while (selStopPnts.features.length < 1) {
            console.log(selStopPnts);
            //   buffDist += 10;
            //   console.log(buffDist);
            //   buffedStop = turf.featureCollection(
            //     turf.buffer(stop, buffDist, 'meters')
            //   );
            //   selStopPnts = turf.within(routePnts, buffedStop);
            // }
            // return selStopPnts;
          });
          // return selRoutePnts;
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
