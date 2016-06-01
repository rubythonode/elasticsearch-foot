var clusterStats = F.curlGet('/_cluster/stats', function(data) {
	$('#cluster-stats-nodes tbody tr').html(
			'<td class="table-td-center">' + data.nodes.versions[0] + '</td>'
		  + '<td>' + data.nodes.count.total + '</td>'
		  + '<td>' + data.nodes.count.master_only + '</td>'
		  + '<td>' + data.nodes.count.data_only + '</td>'
		  + '<td>' + data.nodes.count.master_data + '</td>'
		  + '<td>' + data.nodes.count.client + '</td>'
		  );
	
	$('#cluster-stats-indices tbody tr').html(
			'<td>' + data.indices.count + '</td>'
		  + '<td>' + F.format.count(data.indices.docs.count) + '</td>'
		  + '<td>' + F.format.count(data.indices.docs.deleted) + '</td>'
		  + '<td>' + F.format.bytes(data.indices.store.size_in_bytes, 'g') + '</td>'
		  + '<td>' + F.util.concat2FieldVals(F.format.bytes(F.util.nvl(data.indices.fielddata.memory_size_in_bytes, '0'), 'g'), data.indices.fielddata.evictions) + '</td>'
          + '<td>' + F.util.concat2FieldVals(F.format.bytes(F.util.nvl(data.indices.filter_cache.memory_size_in_bytes, '0'), 'g'), data.indices.filter_cache.evictions) + '</td>'
		  + '<td>' + F.format.count(data.indices.segments.count) + '</td>'
		  + '<td>' + F.format.bytes(data.indices.segments.memory_in_bytes, 'g') + '</td>'
		  );
});

var indicesLevelHealth = F.curlGet('/_cluster/health?level=indices', function(data) {
	var keys = F.util.keys(data.indices);
	
	$FL.indicesLevelHealth = [];
	
	for ( var i = 0; i < keys.length; i++ ) {
		$FL.indicesLevelHealth.push(new $F.indicesLevelHealth(keys[i], data.indices[keys[i]].status, data.indices[keys[i]].number_of_shards, data.indices[keys[i]].number_of_replicas, data.indices[keys[i]].active_primary_shards, data.indices[keys[i]].active_shards, data.indices[keys[i]].relocating_shards, data.indices[keys[i]].initializing_shards, data.indices[keys[i]].unassigned_shards));
	}
	
	$FL.indicesLevelHealth.sort(F.util.sortByField('index'), false);
	__renderindicesLevelHealth();
});

var __renderindicesLevelHealth = function() {
	var html = '';
	for ( var i = 0; i < $FL.indicesLevelHealth.length; i++ ) {
		html  += $FL.indicesLevelHealth[i].formatHtml();
	}
	
	$('#cluster-health-indices-level tbody').html(html);
};