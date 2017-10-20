require('dotenv').config({silent: true, path: 'local.env'});
var debug = require('debug');
const log = debug('dpc-moments-service-app');

var express = require('express');
var cfenv = require('cfenv');
var rp = require('request-promise');
var app = express();
var appEnv = cfenv.getAppEnv();
var url = require('url');

var oauth = require('./modules/oauth');
var ww = require('./modules/ww');
var appId = process.env.WORKSPACE_APP_ID;
var appSecret = process.env.WORKSPACE_APP_SECRET;


app.get('/getMoments', function(req, res) {
  log('-----> entering getMoments');
  var qs = url.parse(req.url,true).query;
  log('qs is', typeof qs.id);
  if (typeof qs.id === 'undefined') {
    ww.getSpaces(jwtToken)
    .then( (results) => {
      res.status(400).json({error:'Please provide a workspace ID',choices:results});
    })
    .catch( (err) => {
      log('error calling getSpaces:', err);
      res.status(500).json(err);
    });
  } else {
    log('found id, calling getMoments');
    var nbrOfDays = typeof qs.days === 'undefined' ? 7 : qs.days;
    ww.getMoments(jwtToken, qs.id, nbrOfDays)
    .then( (results) => {
      res.json(results);
    })
    .catch( (err) => {
      log('error calling getMoments:', err);
      res.status(500).json(err);
    });
  }
  log('<------- exiting getMoments');
});


app.use(express.static(__dirname + '/public'));

app.listen(appEnv.port || 3001, '0.0.0.0', function() {
  log('server starting on ', appEnv.url);
  initialize();
});


var jwtToken = '';
var errors = 0;

function initialize() {
	oauth.run(
		appId,
		appSecret,
		(err, token) => {
			if(err) {
				console.error(`Failed to get JWT token - attempt ${errors}`);
				errors++;
				if(errors > 10) {
					console.error(`Too many JWT token attempts; giving up`);
					return;
				}
				setTimeout(initialize, 10000);
				return;
			}

			log("Initialized JWT token");
			jwtToken = token();
		});
}
