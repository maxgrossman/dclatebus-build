var Promise = require('bluebird');
var rp = require('request-promise');
var key = require('../credentials.js').apiKey;

/* Build routes list w/jRoutes & jRouteDetails end points
 *  1. Get list of routes
 *  2. Pass those into a promise.map, format them as needed, export the result
 */
module.exports = rp('https://api.wmata.com/Bus.svc/json/jRoutes?api_key=' + key)
.then((results) => {
  const routes = JSON.parse(results).Routes;
  return Object.keys(routes).map((k, v) => {
    return routes[k].RouteID;
  });
});
