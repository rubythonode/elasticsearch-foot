// no way
var METRIC;

var metrics = {
		indices: {
			docs : 			['count', 'deleted']
		  , store : 		['size_in_bytes', 'throttle_time_in_millis']
		  , fielddata : 	['memory_size_in_bytes', 'evictions']
		  , segments : 		['count', 'memory_in_bytes']
		  , filter_cache : 	['memory_size_in_bytes', 'evictions']
		  , query_cache : 	['memory_size_in_bytes', 'evictions']
		}
	  , os: {
		  	cpu:			['sys', 'user', 'idle']
		  , mem: 			['free_in_bytes', 'free_percent', 'used_in_bytes', 'used_percent', 'actual_free_in_bytes', 'actual_used_in_bytes']
		  , swap: 			['free_in_bytes', 'used_in_bytes']
	    }
	  , process: {
		  	cpu: 			['percent']
		  , mem: 			['resident_in_bytes', 'share_in_bytes', 'total_virtual_in_bytes']
	    }
	  , jvm: {
		  	mem:			['heap_used_in_bytes', 'heap_used_percent', 'non_heap_used_in_bytes']
	      , threads:		['count', 'peak_count']
	      , gc:				['collectors.young.collection_count', 'collectors.old.collection_count']
	    }
};

var nodesStats = F.curlGet('/_nodes/stats', function(data) {
	var i = 0;
	var j = 0;
	var k = 0;
	var metricLevel1Keys = F.util.keys(metrics[METRIC]);
	
	var htmlTh = '<tr>' + '<th rowspan="2">node</th>';
	for ( i = 0; i < metricLevel1Keys.length; i++ ) {
		htmlTh = htmlTh + '<th colspan="' +  metrics[METRIC][metricLevel1Keys[i]].length + '">' + metricLevel1Keys[i] + '</th>';
	}
	htmlTh = htmlTh + '</tr>';
	
	htmlTh = htmlTh + '<tr>';
	for ( i = 0; i < metricLevel1Keys.length; i++ ) {
		for ( k = 0; k < metrics[METRIC][metricLevel1Keys[i]].length; k++ ) {
			htmlTh = htmlTh + '<th>' + metrics[METRIC][metricLevel1Keys[i]][k] + '</th>';
		}
	}
	
	htmlTh = htmlTh + '</tr>';
	
	
	$('#nodes-stats thead').html(htmlTh);
	
	var nodeKeys = F.util.keys(data.nodes);
	var html = '';
	for ( i = 0; i < nodeKeys.length; i++ ) {
		html = html + '<tr>'
			  + '<td class="table-td-center">' + data.nodes[nodeKeys[i]].name + '</td>';
		
		for ( j = 0; j < metricLevel1Keys.length; j++ ) {
			for ( k = 0; k < metrics[METRIC][metricLevel1Keys[j]].length; k++ ) {
				var _key_;
				var _val_;
				
				// gc is 3depth
				if ( metricLevel1Keys[j] == 'gc' ) {
					_key_ = metrics[METRIC][metricLevel1Keys[j]][k];
					var _tokens_ = _key_.split('.');
					_val_ = data.nodes[nodeKeys[i]][METRIC][metricLevel1Keys[j]][_tokens_[0]][_tokens_[1]][_tokens_[2]];
				} else {
					_key_ = metrics[METRIC][metricLevel1Keys[j]][k];
					_val_ = data.nodes[nodeKeys[i]][METRIC][metricLevel1Keys[j]][_key_];
				}
				
				if ( F.util.endsWith(_key_, 'bytes') ) {
					_val_ = F.format.bytes(_val_, 'g');
				} else if ( F.util.endsWith(_key_,'count') || F.util.endsWith(_key_, 'deleted') ) {
                    _val_ = F.format.count(_val_);
                }
				
				html = html + '<td>' + _val_ + '</td>';
			}
		}
			  
		html = html + '</tr>';
	}

	$('#nodes-stats tbody').html(html);
});