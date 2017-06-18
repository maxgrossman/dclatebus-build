'use-strict';

var routeIds = require('./builders/route-ids.js');
var makeRoutes = require('./builders/route-maker.js');
var turf = require('turf');
var fs = require('fs');

routeIds.then((ids) => {
  makeRoutes(ids).then((routes) => {
    // stuff
  });
});
