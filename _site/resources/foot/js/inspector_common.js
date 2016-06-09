$FL.dataNodes = [];
$FL.indices = [];
$FL.shards = [];

$F.inspector = {
		'max_metric': 0,
		'total_metric': 0
};

var listMetric = function(metric, key) {
	$FG.metric = metric;
	$FG.key = key;
	
	listNodes();
};

var listNodes = F.curlGet('/_nodes/stats', function(data) {
	$FL.dataNodes = [];
	for ( nodeId in data.nodes ) {
		if ( data.nodes[nodeId].indices.docs.count > 0 ) {
			$FL.dataNodes.push(new $F.Node(nodeId
										 , data.nodes[nodeId].name
										 , data.nodes[nodeId].ip
										 , data.nodes[nodeId].indices.docs
										 , data.nodes[nodeId].indices.store
										 , data.nodes[nodeId].indices.indexing
										 , data.nodes[nodeId].indices.get
										 , data.nodes[nodeId].indices.search
										 , data.nodes[nodeId].indices.merges
										 , data.nodes[nodeId].indices.refresh
										 , data.nodes[nodeId].indices.flush
										 , data.nodes[nodeId].indices.filter_cache
										 , data.nodes[nodeId].indices.fielddata
										 , data.nodes[nodeId].indices.segments
										 , data.nodes[nodeId].indices.translog
										 , data.nodes[nodeId].indices.query_cache
							  )
			);
		}
	}
	
	listShards();
	
}, 'json');


var listShards = F.curlGet('/_stats?level=shards', function(data) {
	$FL.shards = [];
	$FL.indices = [];
	for ( index in data.indices ) {
		var indexJson = data.indices[index].total;
		$FL.indices.push(new $F.Index(index
						   , indexJson.docs
						   , indexJson.store
						   , indexJson.indexing
						   , indexJson.get
						   , indexJson.search
						   , indexJson.merges
						   , indexJson.refresh
						   , indexJson.flush
						   , indexJson.filter_cache
						   , indexJson.fielddata
						   , indexJson.segments
						   , indexJson.translog
						   , indexJson.query_cache
				)
		);
		
		for ( shardNo in data.indices[index].shards ) {
			for ( var i = 0; i < data.indices[index].shards[shardNo].length; i++ ) {
				var shardJson = data.indices[index].shards[shardNo][i];
				
				$FL.shards.push(new $F.Shard(shardJson.routing.node
										   , index
										   , shardNo
										   , shardJson.routing.primary
										   , shardJson.routing
										   , shardJson.docs
										   , shardJson.store
										   , shardJson.indexing
										   , shardJson.get
										   , shardJson.search
										   , shardJson.merges
										   , shardJson.refresh
										   , shardJson.flush
										   , shardJson.filter_cache
										   , shardJson.fielddata
										   , shardJson.segments
										   , shardJson.translog
										   , shardJson.query_cache
								)
				);
				
			}
		}
	}
	
	__render();
}, 'json');