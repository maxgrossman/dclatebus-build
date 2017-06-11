var key = require('../credentials.js').apiKey;
var rp = require('request-promise');
var Promise = require('bluebird');
var throttle = require('promise-ratelimit')(150);

module.exports = function (routeIds) {
  return Promise.map(routeIds.slice(0, 50), (id) => {
    return throttle()
    .then(() => {
      return rp('https://api.wmata.com/Bus.svc/json/jRouteDetails?RouteID=' +
      id + '&api_key=' + key);
    })
    .then((route) => {
      return JSON.parse(route);
    })
    .catch((error) => {
      console.log(error);
    });
  })
  .then((routes) => {
    return routes;
  });
};
