var routeIds = require('./builders/route-ids.js');
var makeRoutes = require('./builders/route-maker.js');

routeIds.then((ids) => {
  makeRoutes(ids).then((routes) => {
    console.log(routes);
  });
});
