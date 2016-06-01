var nodesStats = F.curlGet('/_nodes/stats', function(data) {
	var nodeKeys = F.util.keys(data.nodes);
	var html = '';
	var metric = '';
	
	
	html = '';
	metric = 'indices';
	for ( i = 0; i < nodeKeys.length; i++ ) {
		html += '<tr>';
		html += '	<td class="table-td-center">' + data.nodes[nodeKeys[i]].name + '</td>';
		html += '	<td class="">' + F.format.bytes(data.nodes[nodeKeys[i]][metric].filter_cache.memory_size_in_bytes, 'm') + '</td>';
		html += '	<td class="">' + data.nodes[nodeKeys[i]][metric].filter_cache.evictions + '</td>';
		html += '	<td class="">' + F.format.count(data.nodes[nodeKeys[i]][metric].search.query_total) + '</td>';
		html += '	<td class="">' + F.format.count(data.nodes[nodeKeys[i]][metric].search.fetch_total) + '</td>';
		html += '	<td class="">' + (data.nodes[nodeKeys[i]][metric].search.query_time_in_millis / F.util.nvlInt(data.nodes[nodeKeys[i]][metric].search.query_total, 1))  + '</td>';
		html += '	<td class="">' + (data.nodes[nodeKeys[i]][metric].search.fetch_time_in_millis / F.util.nvlInt(data.nodes[nodeKeys[i]][metric].search.fetch_total, 1))  + '</td>';
		html += '	<td class="">' + data.nodes[nodeKeys[i]][metric].segments.count + '</td>';
		html += '	<td class="">' + F.format.bytes(data.nodes[nodeKeys[i]][metric].segments.memory_in_bytes, 'm') + '</td>';
		html += '	<td class="">' + F.format.count(data.nodes[nodeKeys[i]][metric].docs.count) + '</td>';
		html += '	<td class="">' + F.format.count(data.nodes[nodeKeys[i]][metric].docs.deleted) + '</td>';
		html += '	<td class="">' + F.format.bytes(data.nodes[nodeKeys[i]][metric].store.size_in_bytes, 'g') + '</td>';
		html += '	<td class="">' + data.nodes[nodeKeys[i]][metric].translog.operations + '</td>';
		html += '	<td class="">' + F.format.bytes(data.nodes[nodeKeys[i]][metric].translog.size_in_bytes, 'b') + '</td>';
		html += '	<td class="">' + data.nodes[nodeKeys[i]][metric].query_cache.miss_count + '</td>';
		html += '	<td class="">' + data.nodes[nodeKeys[i]][metric].query_cache.hit_count + '</td>';
		html += '	<td class="">' + data.nodes[nodeKeys[i]][metric].query_cache.evictions + '</td>';
		html += '	<td class="">' + F.format.bytes(data.nodes[nodeKeys[i]][metric].query_cache.memory_size_in_bytes, 'k') + '</td>';
		html += '	<td class="">' + F.format.bytes(data.nodes[nodeKeys[i]][metric].fielddata.memory_size_in_bytes, 'g') + '</td>';
		html += '	<td class="">' + data.nodes[nodeKeys[i]][metric].fielddata.evictions + '</td>';
	}
		
	html += '</tr>';

	$('#nodes-stats-' + metric + ' tbody').html(html);
	
	
	html = '';
	metric = 'os';
	for ( i = 0; i < nodeKeys.length; i++ ) {
		html += '<tr>';
		html += '	<td class="table-td-center">' + data.nodes[nodeKeys[i]].name + '</td>';
		
		var loadAvg = 0.0;
		for ( var j = 0; j < data.nodes[nodeKeys[i]][metric].load_average.length; j++ ) {
			loadAvg += data.nodes[nodeKeys[i]][metric].load_average[j];
		}
		
		html += '	<td class="">' + (loadAvg / j).toFixed(1) + '</td>';
		html += '	<td class="">' + data.nodes[nodeKeys[i]][metric].cpu.sys + '</td>';
		html += '	<td class="">' + data.nodes[nodeKeys[i]][metric].cpu.user + '</td>';
		html += '	<td class="">' + data.nodes[nodeKeys[i]][metric].cpu.idle + '</td>';
		html += '	<td class="">' + F.util.concat2FieldVals(F.format.bytes(data.nodes[nodeKeys[i]][metric].mem.free_in_bytes, 'g'), data.nodes[nodeKeys[i]][metric].mem.free_percent + '%') + '</td>';
		html += '	<td class="">' + F.util.concat2FieldVals(F.format.bytes(data.nodes[nodeKeys[i]][metric].mem.used_in_bytes, 'g'), data.nodes[nodeKeys[i]][metric].mem.used_percent + '%') + '</td>';
		html += '	<td class="">' + F.format.bytes(data.nodes[nodeKeys[i]][metric].mem.actual_free_in_bytes, 'g') + '</td>';
		html += '	<td class="">' + F.format.bytes(data.nodes[nodeKeys[i]][metric].mem.actual_used_in_bytes, 'g') + '</td>';
		html += '	<td class="">' + F.format.bytes(data.nodes[nodeKeys[i]][metric].swap.free_in_bytes, 'g') + '</td>';
		html += '	<td class="">' + F.format.bytes(data.nodes[nodeKeys[i]][metric].swap.used_in_bytes, 'g') + '</td>';
	}
		
	html += '</tr>';

	$('#nodes-stats-' + metric + ' tbody').html(html);
	
	
	html = '';
	metric = 'process';
	for ( i = 0; i < nodeKeys.length; i++ ) {
		html += '<tr>';
		html += '	<td class="table-td-center">' + data.nodes[nodeKeys[i]].name + '</td>';
		
		html += '	<td class="">' + data.nodes[nodeKeys[i]][metric].cpu.percent + '</td>';
		html += '	<td class="">' + F.format.bytes(data.nodes[nodeKeys[i]][metric].mem.total_virtual_in_bytes, 'g') + '</td>';
		html += '	<td class="">' + F.format.bytes(data.nodes[nodeKeys[i]][metric].mem.resident_in_bytes, 'g') + '</td>';
		html += '	<td class="">' + F.format.bytes(data.nodes[nodeKeys[i]][metric].mem.share_in_bytes, 'g') + '</td>';
		html += '	<td class="">' + F.format.count(data.nodes[nodeKeys[i]][metric].open_file_descriptors) + '</td>';
	}
		
	html += '</tr>';

	$('#nodes-stats-' + metric + ' tbody').html(html);
	
	
	html = '';
	metric = 'jvm';
	for ( i = 0; i < nodeKeys.length; i++ ) {
		html += '<tr>';
		html += '	<td class="table-td-center">' + data.nodes[nodeKeys[i]].name + '</td>';
		
		html += '	<td class="">' + F.format.count(data.nodes[nodeKeys[i]][metric].threads.peak_count) + '</td>';
		html += '	<td class="">' + F.format.count(data.nodes[nodeKeys[i]][metric].threads.count) + '</td>';
		html += '	<td class="">' + F.util.concat2FieldVals(F.format.bytes(data.nodes[nodeKeys[i]][metric].mem.heap_used_in_bytes, 'g'), data.nodes[nodeKeys[i]][metric].mem.heap_used_percent + '%') + '</td>';
		html += '	<td class="">' + F.format.bytes(data.nodes[nodeKeys[i]][metric].mem.non_heap_used_in_bytes, 'g') + '</td>';
		html += '	<td class="">' + F.format.bytes(data.nodes[nodeKeys[i]][metric].mem.heap_max_in_bytes, 'g') + '</td>';
		html += '	<td class="">' + F.format.bytes(data.nodes[nodeKeys[i]][metric].mem.heap_committed_in_bytes, 'g') + '</td>';
		html += '	<td class="">' + data.nodes[nodeKeys[i]][metric].gc.collectors.old.collection_count + '</td>';
		html += '	<td class="">' + data.nodes[nodeKeys[i]][metric].gc.collectors.old.collection_time_in_millis + '</td>';
	}
		
	html += '</tr>';

	$('#nodes-stats-' + metric + ' tbody').html(html);
});