var key = require('../credentials.js').apiKey;
var rp = require('request-promise');
var Promise = require('bluebird');
var throttle = require('promise-ratelimit')(150);
var makeRouteObj = require('./turf-helpers').makeRouteObj;

/* for each route:
 *  1. get details from api
 *  2. then generate feature collection for route
 *  3. then return feature collection
 */

module.exports = function (routeIds) {
  return Promise.map(routeIds, (id) => {
    return throttle().then(
    () => {
      return rp('https://api.wmata.com/Bus.svc/json/jRouteDetails?RouteID=' +
      id + '&api_key=' + key);
    })
    .then((route) => {
      let parsedRoute = JSON.parse(route);
      return makeRouteObj(parsedRoute);
    })
    .catch((error) => {
      console.log(error);
    });
  })
  .then((routes) => {
    return routes;
  });
};
