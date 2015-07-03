var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var request = require('request');

require('./app_ns.js');
var util = require('./_server/app_util.js');

app.use(express.static(path.join(__dirname, './_site')));

/* Init ************************************************************************************************/
var ES_CONFIG = util.loadConfig();

/* Listeners ************************************************************************************************/
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
	console.log('elasticsearch-foot started listening on *:3000');
	console.log('elasticsearch-foot listening on *:3000');
});

app.get('/config/url/save', function(req, res){
	util.saveEsClusterUrl(req.query.url);
	ES_CONFIG = util.loadConfig();
});


app.get('/es/*', function(req, res){
	var url = req.url.substring(3);

	request(ES_CONFIG.CONFIG.ES_CLUSTER_URL + url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body);
    } else {
    	console.info(error);
    }
  });
});