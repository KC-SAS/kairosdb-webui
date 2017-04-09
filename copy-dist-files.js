var fs = require('fs');
var ncp = require('ncp');
var path = require('path');

ncp('flot','aot/flot');
ncp('resources','aot/resources');

var jsResource = [
  'node_modules/core-js/client/shim.min.js',
  'node_modules/zone.js/dist/zone.min.js',
  'node_modules/jquery/dist/jquery.min.js'
];

jsResource.map(function (f) {
  var path = f.split('/');
  var t = 'aot/' + path[path.length - 1];
  fs.createReadStream(f).pipe(fs.createWriteStream(t));
});

