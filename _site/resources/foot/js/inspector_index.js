var __render = function(indexNameFilter) {
	$F.inspector = {
			'max_metric': 0,
			'total_metric': 0
	};
	
	
	var indexHtml = '';
	var shardHtml = '';
	
	var indexColor = {};
	
	for ( var i = 0; i < $FL.indices.length; i++ ) {
		
		$F.inspector['total_metric'] += $FL.indices[i][$FG.metric][$FG.key];
		$F.inspector['max_metric'] = Math.max($F.inspector['max_metric'], $FL.indices[i][$FG.metric][$FG.key]);
	}
	
	
	shardHtml += '<tbody>';
	for ( var i = 0; i < $FL.indices.length; i++ ) {
		shardHtml += '<tr>\n';
		shardHtml += '	<td class="inspector-table-title">\n';
		shardHtml += '		<span class="nowrap">' + $FL.indices[i].indexName + '</span>\n';
		shardHtml += '	</td>\n';
		shardHtml += '	<td style="width:100%;">\n';
		shardHtml += '		<div class="progress">\n';

		var shardData = [];
		for ( var j = 0 ; j < $FL.shards.length; j++ ) {
			if ( $FL.indices[i].indexName == $FL.shards[j].indexName ) {
				if ( indexNameFilter ) {
					if ( $FL.shards[j].indexName == indexNameFilter ) {
						shardData.push($FL.shards[j]);
					}
				} else {
					shardData.push($FL.shards[j]);
				}
			}
			
			if ( !($FL.shards[j].indexName in indexColor) ) {					
				indexColor[$FL.shards[j].indexName] = F.util.randColor();
			}
		}
		shardData.sort(F.util.sortByFieldVal($FG.metric, $FG.key, true), false);
		
		for ( var j = 0 ; j < shardData.length; j++ ) {
			shardHtml += '<div data-toggle="popover" data-trigger="hover" data-html="true" title="'
				+ __getShardTitle(shardData[j])
				+ '" data-content="' 
				+ __getShardPopOverHtml(shardData[j])
				+ '" class="progress-bar" style="background-color:' + indexColor[shardData[j].indexName] 
				+ '; width: ' + (shardData[j][$FG.metric][$FG.key] / F.util.nvlInt($F.inspector['max_metric'], 1) * 100) + '%">\n';
			shardHtml += '</div>\n';
		}
		shardHtml += '		<span class="metric-text">' + F.format.count($FL.indices[i][$FG.metric][$FG.key]) + '</span></div>\n';
		shardHtml += '	</td>\n';
		shardHtml += '</tr>\n';
		shardHtml += '</tbody>';
	}
	
	$FL.indices.sort(F.util.sortByFieldVal($FG.metric, $FG.key, true), false);
	for ( var j =0; j < $FL.indices.length; j++ ) {
		indexHtml += '<button data-trigger="hover" data-container="body" data-toggle="popover" data-html="true" title="'
			+ $FL.indices[j].indexName 
			+ '" data-content="'
			+ __getIndexPopOverHtml($FL.indices[j]) 
			+ '" type="button" class="btn btn-xs" style="background-color: ' 
			+ indexColor[$FL.indices[j].indexName] + ';" onclick="__render(\'' + $FL.indices[j].indexName + '\'); $(\'.popover\').popover(\'hide\');">' 
			+ $FL.indices[j].indexName + '</button>\n';
	}
	
	$('#indices-list').html(indexHtml);
	$('#display-div').html(shardHtml);
	
	$('#total-metric').text(F.format.count($F.inspector['total_metric']));
	$('#max-metric').text(F.format.count($F.inspector['max_metric']));
	
	$('[data-toggle=popover]').popover();
};

var __getShardTitle = function(shardData) {
	var title = '';
	title += shardData.indexName
	title += ' / ';
	title += shardData.shardNo
	title += ' th ';
	
	if ( shardData.isPrimary ) {
		title += ' primary';
	} else {
		title += ' replica';
	}
	
	return title;
};

var __getIndexPopOverHtml = function(indexData) {
	var html = '';
	html += '<div>';
	html += '<table class=\'table table-bordered popover-content-table\'>';
	html += '	<tbody>';
	html += '		<tr>';
	html += '			<td class=\'popover-content-table-title\' rowspan=\'2\'>filter_cache</td>';
	html += '			<td>memory</td>';
	html += '			<td>' + F.format.bytes(indexData.filter_cache.memory_size_in_bytes, 'm') + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>evictions</td>';
	html += '			<td>' + indexData.filter_cache.evictions + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td class=\'popover-content-table-title\' rowspan=\'4\'>query_cache</td>';
	html += '			<td>hit_count</td>';
	html += '			<td>' + indexData.query_cache.hit_count + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>miss_count</td>';
	html += '			<td>' + indexData.query_cache.miss_count + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>memory</td>';
	html += '			<td>' + F.format.bytes(indexData.query_cache.memory_size_in_bytes, 'm') + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>evictions</td>';
	html += '			<td>' + indexData.query_cache.evictions + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td class=\'popover-content-table-title\' rowspan=\'2\'>fielddata</td>';
	html += '			<td>memory</td>';
	html += '			<td>' + F.format.bytes(indexData.fielddata.memory_size_in_bytes, 'g') + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>memory</td>';
	html += '			<td>' + indexData.fielddata.evictions + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td class=\'popover-content-table-title\' rowspan=\'4\'>search</td>';
	html += '			<td>query_total</td>';
	html += '			<td>' + F.format.count(indexData.search.query_total) + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>fetch_total</td>';
	html += '			<td>' + F.format.count(indexData.search.fetch_total) + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>avg. query time(ms)</td>';
	html += '			<td>' + (indexData.search.query_time_in_millis / F.util.nvlInt(indexData.search.query_total, 1)).toFixed(1) + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>avg. fetch time(ms)</td>';
	html += '			<td>' + (indexData.search.fetch_time_in_millis / F.util.nvlInt(indexData.search.fetch_total, 1)).toFixed(1) + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td class=\'popover-content-table-title\' rowspan=\'2\'>segments</td>';
	html += '			<td>count</td>';
	html += '			<td>' + indexData.segments.count + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>memory</td>';
	html += '			<td>' + F.format.bytes(indexData.segments.memory_in_bytes, 'm') + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td class=\'popover-content-table-title\' rowspan=\'2\'>docs</td>';
	html += '			<td>count</td>';
	html += '			<td>' + F.format.count(indexData.docs.count) + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>deleted</td>';
	html += '			<td>' + F.format.count(indexData.docs.deleted) + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td class=\'popover-content-table-title\' rowspan=\'1\'>store</td>';
	html += '			<td>size</td>';
	html += '			<td>' + F.format.bytes(indexData.store.size_in_bytes, 'g') + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td class=\'popover-content-table-title\' rowspan=\'2\'>translog</td>';
	html += '			<td>operations</td>';
	html += '			<td>' + indexData.translog.operations + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>size</td>';
	html += '			<td>' + F.format.bytes(indexData.translog.size_in_bytes, 'k') + '</td>';
	html += '		</tr>';
	html += '	</tbody>';
	html += '</table>';
	html += '</div>';

	return html;
};


var __getShardPopOverHtml = function(shardData) {
	var html = '';
	html += '<div>';
	html += '<table class=\'table table-bordered popover-content-table\'>';
	html += '	<tbody>';
	html += '		<tr>';
	html += '			<td class=\'popover-content-table-title\' rowspan=\'2\'>filter_cache</td>';
	html += '			<td>memory</td>';
	html += '			<td>' + F.format.bytes(shardData.filter_cache.memory_size_in_bytes, 'm') + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>evictions</td>';
	html += '			<td>' + shardData.filter_cache.evictions + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td class=\'popover-content-table-title\' rowspan=\'4\'>query_cache</td>';
	html += '			<td>hit_count</td>';
	html += '			<td>' + shardData.query_cache.hit_count + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>miss_count</td>';
	html += '			<td>' + shardData.query_cache.miss_count + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>memory</td>';
	html += '			<td>' + F.format.bytes(shardData.query_cache.memory_size_in_bytes, 'm') + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>evictions</td>';
	html += '			<td>' + shardData.query_cache.evictions + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td class=\'popover-content-table-title\' rowspan=\'2\'>fielddata</td>';
	html += '			<td>memory</td>';
	html += '			<td>' + F.format.bytes(shardData.fielddata.memory_size_in_bytes, 'g') + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>memory</td>';
	html += '			<td>' + shardData.fielddata.evictions + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td class=\'popover-content-table-title\' rowspan=\'4\'>search</td>';
	html += '			<td>query_total</td>';
	html += '			<td>' + F.format.count(shardData.search.query_total) + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>fetch_total</td>';
	html += '			<td>' + F.format.count(shardData.search.fetch_total) + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>avg. query time(ms)</td>';
	html += '			<td>' + (shardData.search.query_time_in_millis / F.util.nvlInt(shardData.search.query_total, 1)).toFixed(1) + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>avg. fetch time(ms)</td>';
	html += '			<td>' + (shardData.search.fetch_time_in_millis / F.util.nvlInt(shardData.search.fetch_total, 1)).toFixed(1) + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td class=\'popover-content-table-title\' rowspan=\'2\'>segments</td>';
	html += '			<td>count</td>';
	html += '			<td>' + shardData.segments.count + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>memory</td>';
	html += '			<td>' + F.format.bytes(shardData.segments.memory_in_bytes, 'm') + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td class=\'popover-content-table-title\' rowspan=\'2\'>docs</td>';
	html += '			<td>count</td>';
	html += '			<td>' + F.format.count(shardData.docs.count) + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>deleted</td>';
	html += '			<td>' + F.format.count(shardData.docs.deleted) + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td class=\'popover-content-table-title\' rowspan=\'1\'>store</td>';
	html += '			<td>size</td>';
	html += '			<td>' + F.format.bytes(shardData.store.size_in_bytes, 'g') + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td class=\'popover-content-table-title\' rowspan=\'2\'>translog</td>';
	html += '			<td>operations</td>';
	html += '			<td>' + shardData.translog.operations + '</td>';
	html += '		</tr>';
	html += '		<tr>';
	html += '			<td>size</td>';
	html += '			<td>' + F.format.bytes(shardData.translog.size_in_bytes, 'k') + '</td>';
	html += '		</tr>';
	html += '	</tbody>';
	html += '</table>';
	html += '</div>';

	return html;
};
