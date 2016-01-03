var config = require('bedrock').config;
var path = require('path');

// server info
config.server.port = 3100;
config.server.httpPort = 22080;
config.server.bindAddr = ['fuoco.floydcommons.com'];
config.server.domain = 'fuoco.floydcommons.com';
config.server.host = 'fuoco.floydcommons.com:' + config.server.port;
config.server.baseUri = 'https://' + config.server.host;
config.server.key = path.join(__dirname, '..', 'pki', 'privkey.pem');
config.server.cert = path.join(__dirname, '..', 'pki', 'fullchain.pem');
