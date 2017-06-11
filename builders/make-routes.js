var key = require('../credentials.js').apiKey;
var rp = require('request-promise');
var Promise = require('bluebird');
var throttle = require('promise-ratelimit')(150);
var turf = require('turf');

module.exports = function (routeIds) {
  return Promise.map(routeIds.slice(0, 1), (id) => {
    return throttle()
    .then(() => {
      return rp('https://api.wmata.com/Bus.svc/json/jRouteDetails?RouteID=' +
      id + '&api_key=' + key);
    })
    .then((route) => {
      let parsedRoute = JSON.parse(route);
      return turf.multiPoint(
        parsedRoute.Direction0.Shape.map((point) => {
          return [point.Lat, point.Lon];
        }),
        {
          RouteID: parsedRoute.RouteID
        }
      );
    })
    .catch((error) => {
      console.log(error);
    });
  })
  .then((routes) => {
    return routes;
  });
};
