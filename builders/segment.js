'use strict';
import turf from 'turf';
import sector from '@turf/sector';
import Promise from 'bluebird';

module.exports = {
  /* For each bus stop pair:
   *  1. Buffer each stop in bus stop pair
   *  2. Attempt to select routePnts with those buffers
   *  3. If attempt not successful, retry until successful
   *  4. Reduce each stop's selected point to be just the closets point
   *  5. Subset routePnts to make bus segment.
   *  6. Return bus segment
   */
  makeSegments: function (routeObj, routeID) {
    return Promise.map(routeObj[routeID], (fc) => {
      let routePnts = fc.geometry.geometries[0].features.map((point) => {
        return point.geometry.coordinates;
      });
      const routeLineString = turf.lineString(routePnts);
      const routePntsFC = turf.featureCollection(
        routePnts.map((point) => {
          return turf.point(point);
        })
      );
      let busPnts = fc.geometry.geometries[1].features;
      return Promise.map(Object.keys(busPnts), (key, ix) => {
        let segment;
        const nextKey = (parseInt(key) + 1).toString();
        if (busPnts[nextKey]) {
          let busStops = [
            busPnts[key],
            busPnts[nextKey]
          ];
          // get closest point on line
          busStops = busStops.map((stop) => {
            return turf.pointOnLine(routeLineString, stop, 'degrees');
          });
          // get dist between points for radius
          const pointDist = turf.distance(busStops[0], busStops[1]);
          // get the bearings between a stop and its partner
          // make radius bearings +- 20 degs, respectively, from stop partner
          // make this a geom
          let bearingsGeom = busStops.map(
            (stop) => {
              // use busStop indexes to get the other busStop
              // note, since we this makes a list of lenght 1,
              // just grab the first element in the list.
              const otherPoint = busStops.filter((busStop) => {
                const otherStop = busStops.indexOf(stop);
                const thisStop = busStops.indexOf(busStop);
                if (thisStop !== otherStop) {
                  return busStop;
                }
              })[0];
              const bearing = turf.bearing(stop, otherPoint);
              return sector(
                stop,
                pointDist,
                bearing - 2,
                bearing + 2
              );
            }
          );
          bearingsGeom = turf.featureCollection(bearingsGeom);
          // selecting all within bearingGeom
          segment = turf.within(routePntsFC, bearingsGeom);
          // getting only unique points
          segment = [...new Set(segment.features)];
          // getting the original points from the routePntsFC
          segment = segment.map((stop) => {
            return routePntsFC.features[routePntsFC.features.indexOf(stop)]
              .geometry
              .coordinates;
          });
          segment = [busStops[0].geometry.coordinates]
            .concat(
              segment,
              [busStops[1].geometry.coordinates]
            );
          return turf.lineString(segment);
        }
      }).then((routeSegs) => {
        return routeSegs.slice(0, -1);
      });
    }).then((routeSegs) => {
      return routeSegs;
    });
  }
};
