var config = require('bedrock').config;

config['fuoco-index'] = {};
config['fuoco-index'].search = {};
config['fuoco-index'].search.basePath = '/search';
// FIXME: remove after fuoco-server is integrated
config['fuoco-server'] = {};
config['fuoco-server'].baseUrl = 'https://fuoco.floydcommons.com:3000';
config['fuoco-server'].documentBasePath = '/document';
config['fuoco-server'].historyQuery = '/history';

config.mongodb.name = 'fuoco_dev';
config.mongodb.host = 'localhost';
config.mongodb.port = 27017;
config.mongodb.local.collection = 'fuoco_dev';
config.mongodb.username = 'fuoco';
config.mongodb.password = 'password';
config.mongodb.adminPrompt = true;

// express info
config.express.session.secret = 'NOTASECRET';
config.express.session.key = 'fuoco-index-server.sid';
config.express.session.prefix = 'fuoco-index-server.';
