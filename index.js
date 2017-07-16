'use-strict';

import routeIds from './builders/route-ids';
import makeRoutes from './builders/route-maker';
import turf from 'turf';
import Promise from 'bluebird';
import fs from 'fs';

routeIds.then((ids) => {
  makeRoutes(ids).then((routes) => {
    return routes[0];
  }).then((geomRoutes) => {
    geomRoutes.forEach((features, ix) => {
      const routeFC = turf.featureCollection(features);
      console.log(routeFC);
      const routeName = 'test_data/10A_' + ix + '.geojson';
      fs.writeFileSync(
        routeName,
        JSON.stringify(routeFC)
      );
    });
  });
});
