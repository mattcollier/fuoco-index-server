// server info
config.server.port = 3100;
config.server.httpPort = 22080;
config.server.bindAddr = ['sterns.t4k.org'];
config.server.domain = 'sterns.t4k.org';
config.server.host = 'sterns.t4k.org:' + config.server.port;
config.server.baseUri = 'https://' + config.server.host;
config.server.key = path.join('..', 'pki', 'privkey.pem');
config.server.cert = path.join('..', 'pki', 'fullchain.pem');
