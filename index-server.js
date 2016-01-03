var bedrock = require('bedrock');
var path = require('path');

require('./lib/index.js');

require(path.join(__dirname, 'configs/live.config'));

bedrock.start();
