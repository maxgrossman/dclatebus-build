'use-strict';

var routeIds = require('./builders/route-ids.js');
var makeRoutes = require('./builders/route-maker.js');
var turf = require('turf');
var fs = require('fs');

routeIds.then((ids) => {
  makeRoutes(ids).then((routes) => {
    return routes[0].map((route, ix) => {
      return turf.featureCollection(
        route.map((seg) => {
          return turf.lineString(seg[Object.keys(seg)]);
        })
      );
    });
  })
  .then((geomRoutes) => {
    geomRoutes.forEach((fc, ix) => {
      fs.writeFileSync(
        'test_data/10A_' + ix + '.geojson',
        JSON.stringify(fc)
      );
    });
  });
});
