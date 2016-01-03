var config = require('bedrock').config;

// server info
config.server.port = 3100;
config.server.httpPort = 22080;
config.server.bindAddr = ['fuoco-index.dev'];
config.server.domain = 'fuoco-index.dev';
config.server.host = 'fuoco-index.dev:' + config.server.port;
config.server.baseUri = 'https://' + config.server.host;
