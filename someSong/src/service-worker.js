/**
 * Check out https://googlechrome.github.io/sw-toolbox/docs/master/index.html for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */


'use strict';
importScripts('./build/sw-toolbox.js');

self.toolbox.options.cache = {
  name: 'ionic-cache'
};

// pre-cache our key assets
self.toolbox.precache(
  [
    './build/main.js',
    './build/main.css',
    './build/polyfills.js',
    'index.html',
    'manifest.json'
  ]
);

// dynamically cache any other local assets
self.toolbox.router.any('/*', self.toolbox.cacheFirst);

// for any other requests go to the network, cache,
// and then only use that cached resource if your user goes offline
self.toolbox.router.default = self.toolbox.networkFirst;

function verifyJwt() {
    let jwt = require("jsonwebtoken");
    let secret = 'some-secret';
    // ruleid: jwt-none-alg
    jwt.verify('token-here', secret, { algorithms: ['RS256', 'none'] }, function(err, payload) {
        console.log(payload);
    });
}

// ok: jwt-none-alg
const jwt = require("jsonwebtoken");
const secret = 'some-secret';
const payload = jwt.verify('token-here', secret, { algorithms: ['RS256', 'HS256'] });
