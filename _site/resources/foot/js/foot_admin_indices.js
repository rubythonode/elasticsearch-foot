var listIndices = F.curlGet('/_cat/indices', function(data) {
	var line = data.split('\n');
	$FL.indicesHealth = [];
	for ( var i = 0; i < line.length - 1; i++ ) {
		var tokens = line[i].replace(/ +/g, ' ').split(' ');
		
		
		if ( F.util.contains(line[i], 'close') ) {
			$FL.indicesHealth.push(new $F.IndicesHealth('-', 'close', tokens[2], '-', '-', '-', '-', '-', '-'));
		} else {
			var tokens = line[i].replace(/ +/g, ' ').split(' ');
			$FL.indicesHealth.push(new $F.IndicesHealth(tokens[0], tokens[1], tokens[2], tokens[3], tokens[4], tokens[5], tokens[6], tokens[7], tokens[8]));
		}
	}
	
	$FL.indicesHealth.sort(F.util.sortByField('status'), false);
	__renderListIndices(); 
}, 'text');


var __renderListIndices = function() {
	var indices = [];
	for ( var i = 0; i < $FL.indicesHealth.length; i++ ) {
		if ( $FL.indicesHealth[i].status == 'close' ) {
			$('#indices-selector').append('<span class="list-group-item disabled">' + $FL.indicesHealth[i].index + '</span>');
		} else {
			$('#indices-selector').append('<a href="javascript:F.curlGet(\'/'+ $FL.indicesHealth[i].index + '/_stats\', callback)();" class="list-group-item">' + $FL.indicesHealth[i].index + '</a>');
		}
	}
	
};


var callback = function(data) {
	var index = F.util.keys(data.indices)[0];
	var primaries = data.indices[index].primaries;
	var total = data.indices[index].total;
	
	var conf = [   'docs', 'store', 'translog'
	            , 'indexing', 'get', 'search'
	            , 'merges', 'segments', 'refresh', 'flush'
	            , 'query_cache', 'filter_cache', 'fielddata'
	           ];
	
	
	for ( var i = 0; i < conf.length; i++ ) {
		$('#' + conf[i] + ' tbody').html('');
		var keys =  F.util.keys(primaries[conf[i]]);
		
		for ( var j = 0; j < keys.length; j++ ) {
			var pVal = primaries[conf[i]][keys[j]];
			var tVal = total[conf[i]][keys[j]];
			if ( F.util.endsWith(keys[j], 'bytes') ) {
				pVal = F.format.bytes(pVal, 'g');
				tVal = F.format.bytes(tVal, 'g');
			} else if ( F.util.endsWith(keys[j], 'count') || F.util.endsWith(keys[j], 'total') || F.util.endsWith(keys[j], 'deleted') || F.util.endsWith(keys[j], 'total_docs') ) {
				pVal = F.format.count(pVal);
				tVal = F.format.count(tVal);
			}
			
			$('#' + conf[i] + ' tbody').append('<tr><td>' + keys[j] + '</td><td>' + pVal + '(' + tVal + ')' +  '</td></tr>');
		}
	}
};



// no way!!
var listIndices4Fielddata = F.curlGet('/_cat/indices', function(data) {
	var line = data.split('\n');
	$FL.indicesHealth = [];
	for ( var i = 0; i < line.length - 1; i++ ) {
		var tokens = line[i].replace(/ +/g, ' ').split(' ');
		
		
		if ( F.util.contains(line[i], 'close') ) {
			$FL.indicesHealth.push(new $F.IndicesHealth('-', 'close', tokens[2], '-', '-', '-', '-', '-', '-'));
		} else {
			var tokens = line[i].replace(/ +/g, ' ').split(' ');
			$FL.indicesHealth.push(new $F.IndicesHealth(tokens[0], tokens[1], tokens[2], tokens[3], tokens[4], tokens[5], tokens[6], tokens[7], tokens[8]));
		}
	}
	
	$FL.indicesHealth.sort(F.util.sortByField('status'), false);
	__renderListIndices4Fielddata(); 
}, 'text');

var __renderListIndices4Fielddata = function() {
	var indices = [];
	for ( var i = 0; i < $FL.indicesHealth.length; i++ ) {
		if ( $FL.indicesHealth[i].status == 'close' ) {
			$('#indices-selector').append('<span class="list-group-item disabled">' + $FL.indicesHealth[i].index + '</span>');
		} else {
			$('#indices-selector').append('<a href="javascript:F.curlGet(\'/'+ $FL.indicesHealth[i].index + '/_stats/fielddata?fields=*\', callback4Fielddata)();" class="list-group-item">' + $FL.indicesHealth[i].index + '</a>');
		}
	}
	
};

var callback4Fielddata = function(data) {
	var index = F.util.keys(data.indices)[0];
	var primaries = data.indices[index].primaries;
	var total = data.indices[index].total;
	
	$('#indices-fielddata table tbody tr').html(
			'<td>' + F.format.bytes(primaries.fielddata.memory_size_in_bytes, 'g') + '(' + F.format.bytes(total.fielddata.memory_size_in_bytes, 'g') + ')' + '</td>'
	  	  + '<td>' + primaries.fielddata.evictions + '(' + total.fielddata.evictions + ')' + '</td>'
	);
	
	var keys =  F.util.keys(primaries.fielddata.fields);
	var html = '';
	for ( var i = 0; i < keys.length; i++ ) {
		html = html + '<tr>'
		  + '<td>' + keys[i] + '</td>'
		  + '<td>' + F.format.bytes(primaries.fielddata.fields[keys[i]].memory_size_in_bytes, 'm') + '(' + F.format.bytes(total.fielddata.fields[keys[i]].memory_size_in_bytes, 'm') + ')' + '</td>'
		  + '</tr>';
	}
	
	$('#indices-fielddata-fields table tbody').html(html);
	
};

// no way
var fielddataNodesLevel = F.curlGet('/_nodes/stats/indices/fielddata?fields=*', function(data) {
	var nodes =  F.util.keys(data.nodes);
	$FL.fielddataNodesLevel = [];
	for ( var i = 0; i < nodes.length; i++ ) {
		$FL.fielddataNodesLevel.push(new $F.FielddataNodesLevel(nodes[i], data.nodes[nodes[i]].name, data.nodes[nodes[i]].indices.fielddata.memory_size_in_bytes, data.nodes[nodes[i]].indices.fielddata.evictions, data.nodes[nodes[i]].indices.fielddata.fields));
	}
	
	$FL.fielddataNodesLevel.sort(F.util.sortByField('memory_size_in_bytes', true));
	__renderFielddataNodesLevel();
});

var __renderFielddataNodesLevel = function() {
	var html = '';
	for ( var i = 0; i < $FL.fielddataNodesLevel.length; i++ ) {
		html  += $FL.fielddataNodesLevel[i].formatHtml();
	}
	
	$('#nodes-fielddata table tbody').html(html);
};

var nodeFielddataFields = function(key) {
	var target;
	for ( var i = 0; i < $FL.fielddataNodesLevel.length; i++ ) {
		if ( $FL.fielddataNodesLevel[i].gen_node == key ) {
			target = $FL.fielddataNodesLevel[i];
		}
	}
	
	var fieldKeys = F.util.keys(target.fields);
	
	var html = '';
	var rows = [];
	if  ( target ) {
		for ( var i = 0; i < fieldKeys.length; i++ ) {
			var row = { 'field': fieldKeys[i],
						'memory_size_in_bytes': target.fields[fieldKeys[i]].memory_size_in_bytes
			};
			
			rows.push(row);
		}
		
		rows.sort(F.util.sortByField('memory_size_in_bytes', true));
		for ( var i = 0; i < rows.length; i++ ) {
			html = html + '<tr>'
			  + '<td>' + rows[i].field + '</td>'
			  + '<td>' + F.format.bytes(rows[i].memory_size_in_bytes, 'm') + '</td>'
			  + '</tr>';
		}
	}
	
	$('#nodes-fielddata-fields table tbody').html(html);
};

//no way!!
var listIndices4Segments = F.curlGet('/_cat/indices', function(data) {
	var line = data.split('\n');
	$FL.indicesHealth = [];
	for ( var i = 0; i < line.length - 1; i++ ) {
		var tokens = line[i].replace(/ +/g, ' ').split(' ');
		
		
		if ( F.util.contains(line[i], 'close') ) {
			$FL.indicesHealth.push(new $F.IndicesHealth('-', 'close', tokens[2], '-', '-', '-', '-', '-', '-'));
		} else {
			var tokens = line[i].replace(/ +/g, ' ').split(' ');
			$FL.indicesHealth.push(new $F.IndicesHealth(tokens[0], tokens[1], tokens[2], tokens[3], tokens[4], tokens[5], tokens[6], tokens[7], tokens[8]));
		}
	}
	
	$FL.indicesHealth.sort(F.util.sortByField('status'), false);
	__renderListIndices4Segments(); 
}, 'text');


var __renderListIndices4Segments = function(data) {
	for ( var i = 0; i < $FL.indicesHealth.length; i++ ) {
		if ( $FL.indicesHealth[i].status == 'close' ) {
			$('#indices-selector').append('<span class="list-group-item disabled">' + $FL.indicesHealth[i].index + '</span>');
		} else {
			$('#indices-selector').append('<a href="javascript:F.curlGet(\'/'+ $FL.indicesHealth[i].index + '/_segments\', callback4Segments)();" class="list-group-item">' + $FL.indicesHealth[i].index + '</a>');
		}
	}
};

var callback4Segments = function(data) {
	$('#indices-segments-stats tbody tr').html(
			'<td>' + data._shards.total + '</td>'
		  + '<td>' + data._shards.successful + '</td>'
		  + '<td>' + data._shards.failed + '</td>'
	);
	
	var index = F.util.keys(data.indices)[0];
	
	var shards = data.indices[index].shards;
	var shardKeys = F.util.keys(shards);
	
	
	var html = '';
	for ( var i = 0; i < shardKeys.length; i++ ) {
		html = html + '<tr>'
		  + '<td>' + shardKeys[i] + '</td>'
		  + '<td>' + shards[shardKeys[i]][0].num_committed_segments + '</td>'
		  + '<td>' + shards[shardKeys[i]][0].num_search_segments + '</td>'
		  + '</tr>';
	}
	
	$('#indices-segments-per-shard tbody').html(html);
	
};