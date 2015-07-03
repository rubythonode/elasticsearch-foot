var fs = require('fs');
	
var confPath = ES_HOME + '/_server/data/config.json';
module.exports = {
	saveEsClusterUrl: function(url) {
		var conf = {
						'CONFIG': {
							'ES_CLUSTER_URL': url
						}
					};
		
		fs.writeFileSync(confPath, JSON.stringify(conf), {"encoding":'utf8'});
		console.log("ES_CLUSTER_URL was set: " + url);
	},
	loadConfig: function() {
		var confData = fs.readFileSync(confPath, "utf8");
		return JSON.parse(confData);
	}
};