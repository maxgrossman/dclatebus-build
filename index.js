var routeIds = require('./builders/route-ids.js');
var makeRoutes = require('./builders/make-routes.js');

routeIds.then((ids) => {
  makeRoutes(ids).then((routes) => {
    console.log(routes);
  });
});
