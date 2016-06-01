var clusterHealth = F.curlGet('/_cluster/health', function(data) {
	$('#cluster-health tbody tr').html(
			'<td class="table-td-center">' + data.cluster_name + '</td>'
		  + '<td class="table-td-center">' + F.ui.status(data.status) + '</td>'
		  + '<td class="table-td-center">' + data.timed_out + '</td>'
		  + '<td>' + data.number_of_nodes + '</td>'
		  + '<td>' + data.number_of_data_nodes + '</td>'
		  + '<td>' + data.active_primary_shards + '</td>'
		  + '<td>' + data.active_shards + '</td>'
		  + '<td>' + data.relocating_shards + '</td>'
		  + '<td>' + data.initializing_shards + '</td>'
		  + '<td>' + data.unassigned_shards + '</td>');
});

var indicesHealth = F.curlGet('/_cat/indices', function(data) {
	var line = data.split('\n');
	$FL.indicesHealth = [];
	for ( var i = 0; i < line.length - 1; i++ ) {
		var tokens = line[i].replace(/ +/g, ' ').split(' ');
		
		
		if ( F.util.contains(line[i], 'close') ) {
			$FL.indicesHealth.push(new $F.IndicesHealth('-', 'close', tokens[2], '-', '-', '-', '-', '-', '-'));
		} else {
			var tokens = line[i].replace(/ +/g, ' ').split(' ');
			$FL.indicesHealth.push(new $F.IndicesHealth(tokens[0], tokens[1], tokens[2], tokens[3], tokens[4], tokens[5], tokens[6], tokens[7], tokens[8], F.format.toBytes(tokens[7]), F.format.toBytes(tokens[8])));
		}
	}
	
	$FL.indicesHealth.sort(F.util.sortByField('status'), false);
	__renderIndicesHealth();
}, 'text');

var __renderIndicesHealth = function() {
	var html = '';
	for ( var i = 0; i < $FL.indicesHealth.length; i++ ) {
		html  += $FL.indicesHealth[i].formatHtml();
	}
	
	$('#indices-health tbody').html(html);
};

var nodesHealth = function() {
	var res = {};
	
	F.curlGet('/_cat/allocation', function(data) {
		res.allocations = data;
		
		__collectNodesHeath__(res);
	}, 'text')(); 
	
	F.curlGet('/_cat/fielddata', function(data) {
		res.fielddata = data;
		
		__collectNodesHeath__(res);
	}, 'text')(); 
	
	F.curlGet('/_cat/nodes', function(data) {
		res.nodes = data;
		
		__collectNodesHeath__(res);
	}, 'text')(); 
	
};

var __collectNodesHeath__ = function(res) {
	var i = 0;
	var j = 0;
	
	if ( res.allocations && res.fielddata && res.nodes ) {
		$FL.nodesHealth = [];
		
		var line = res.nodes.split('\n');
		for ( i = 0; i < line.length - 1; i++ ) {
			var tokens = line[i].replace(/ +/g, ' ').split(' ');
			$FL.nodesHealth.push(new $F.NodesHealth(tokens[7], tokens[0], __getNodeRole__(tokens[5], tokens[6]), tokens[2], tokens[4]));
		}
		
		line = res.fielddata.split('\n');
		for ( i = 0; i < line.length - 1; i++ ) {
			var tokens = line[i].replace(/ +/g, ' ').split(' ');

			for ( j = 0; j < $FL.nodesHealth.length; j++ ) {
				if ( tokens[3] == $FL.nodesHealth[j].get('node') ) {
					$FL.nodesHealth[j].set('fielddata', tokens[4]);
				}
			}
		}
		
		line = res.allocations.split('\n');
		for ( i = 0; i < line.length - 1; i++ ) {
			var tokens = line[i].trim().replace(/ +/g, ' ').split(' ');

			for ( j = 0; j < $FL.nodesHealth.length; j++ ) {
				if ( tokens[7] ==  $FL.nodesHealth[j].get('node') ) {
					$FL.nodesHealth[j].set('shards', tokens[0]);
					$FL.nodesHealth[j].set('disk_used', tokens[4]);
				}
			}
		}
		
		$FL.nodesHealth.sort(F.util.sortByField('node'), false);
		__renderNodesHealth();
	}
};

var __renderNodesHealth = function() {
	var html = '';
	for ( var i = 0; i < $FL.nodesHealth.length; i++ ) {
		html  += $FL.nodesHealth[i].formatHtml();
	}
	
	$('#nodes-health tbody').html(html);
};

var __getNodeRole__ = function(role, master) {
	var nodeRole = '';
	if ( master == '*' ) {
		nodeRole = 'active master' 
	} else if ( master == 'm' ) {
		nodeRole = 'master'
	}
	
	if ( role == 'd' ) {
		if ( nodeRole == '' ) {
			nodeRole = 'data';
		} else {
			nodeRole = nodeRole + '/data';
		}
	}
	
	if ( role == '-' && master == '-' ) {
		nodeRole = 'client';
	}
	
	return nodeRole;
};
