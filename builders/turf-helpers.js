var turf = require('turf');
var _ = require('lodash');

module.exports = {
  makeRouteObj: function (routeJSON) {
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
                const index = routeJSONdirs[k].Shape.indexOf(point);
                return turf.point(
                  [point.Lat, point.Lon],
                  {'index': index}
                );
              })
            ),
        turf.featureCollection(
              routeJSONdirs[k].Stops.map((point) => {
                return turf.point([point.Lat, point.Lon]);
              })
            )
      ], {
        rtId: routeJSON.RouteID,
        dir: routeJSONdirs[k].DirectionText.slice(0, 1),
        dirNum: routeJSONdirs[k].DirectionNum
      });
    });
    return routeObj;
  }
};
