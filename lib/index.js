var async = require('async');
var bedrock = require('bedrock');
var config = bedrock.config;
var cors = require('cors');
var Firepad = require('./firepad');
var database = require('bedrock-mongodb');
var lodash = require('lodash');
var request = require('request');
request = request.defaults({json: true});
require('bedrock-express');

// load config
require('./config');

var collectionName = 'composedDocuments';
var collection = null;

// open some collections once the database is ready
bedrock.events.on('bedrock-mongodb.ready', function(callback) {
  async.auto({
    openCollections: function(callback) {
      database.openCollections([collectionName], function(err) {
        if(!err) {
          collection = database.collections[collectionName];
        }
        callback(err);
      });
    },
    createIndexes: ['openCollections', function(callback) {
      // background indexing should be OK
      database.createIndexes([{
        collection: collectionName,
        fields: {content: 'text', title: 'text'},
        options: {unique: false, background: true}
      }, {
        collection: collectionName,
        fields: {id: 1},
        options: {unique: true, background: true}
      }], callback);
    }]
  }, callback);
});

bedrock.events.on('bedrock-express.configure.routes', addRoutes);
function addRoutes(app) {
  app.use(cors());
  app.post(
    config['fuoco-index'].search.basePath + '/:q', function(req, res, next) {
    async.auto({
      find: function(callback) {
        collection.find(
          {'$text': {'$search': req.params.q}},
          {id: '', title: '', lastModified: ''}).toArray(callback);
      },
      respond: ['find', function(callback, results) {
        res.json(results.find);
      }]
    });
  });
}

bedrock.events.on('bedrock.start', function() {
  console.log('INDEX SERVER START');
  init();
  setInterval(function() {
    init();
  }, 30000);
});

/* right now running on timed intervals, but after fuoco-server is integrate
 * this can be triggered by an event
 * starter imlementation - index every document at timed intervals
 */

function init() {
  async.auto({
    getDocuments: function(callback) {
      request(
        config.server.baseUri +
        config['fuoco-server'].documentBasePath,
        function(err, res, body) {
          console.log('GETDOCUMENTS', err, res, body);
          if(err) {
            return callback(new Error(
              'Server could not be contacted:',
              config['fuoco-server'].baseUrl));
          }
          if(res.statusCode === 200) {
            callback(null, body);
          }
        });
    },
    processDocuments: ['getDocuments', function(callback, results) {
      async.each(results.getDocuments, function(document, callback) {
        console.log('Processing document:', document.id);
        storeDocument(document, callback);
      }, callback);
    }]
  });
}

function storeDocument(document, callback) {
  async.auto({
    get: function(callback) {
      var headless = new Firepad.Headless({
        server: config.server.baseUri,
        document: document.id,
        push: function() {
          return {key: function() {return 'VALUE_NOT_USED';}};
        },
        headless: true,
        request: request,
        lodash: lodash
      });
      headless.getDocument(function(document) {
        callback(null, document);
      });
    },
    compose: ['get', function(callback, results) {
      var text = results.get.ops.map(function(op) {
        return op.text;
      }).join(' ');
      // FIXME: we particularly need to get rid of %EE which is a marker used by
      // the editor, but for now, eliminate everything but URL safe text and
      // whitespace
      text = encodeURIComponent(text)
        .replace(/%[A-Z0-9][A-Z0-9]/g, ' ')
        .replace(/ +(?= )/g, '');
      callback(null, text);
    }],
    store: ['compose', function(callback, results) {
      var query = {
        id: document.id
      };
      var record = {
        id: document.id,
        title: document.title,
        lastModified: document.lastModified,
        content: results.compose
      };
      collection.update(
        query, record, {upsert: true, multi: false}, function(err, result) {
      });
    }]
  }, callback);
}
