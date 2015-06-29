/* FOOT Main Namespaec */
var F = {};

/* document reference url */
F.ref = {};
F.ref._cluster_health = 'https://www.elastic.co/guide/en/elasticsearch/guide/current/_cluster_health.html';
F.ref._indices_health = 'https://www.elastic.co/guide/en/elasticsearch/reference/current/cat-indices.html';
F.ref._nodes_health = 'https://www.elastic.co/guide/en/elasticsearch/reference/current/cat.html';
F.ref._cluster_stats_nodes = 'https://www.elastic.co/guide/en/elasticsearch/reference/current/cluster-stats.html';
F.ref._indices_health = 'https://www.elastic.co/guide/en/elasticsearch/guide/current/_cluster_health.html';
F.ref._indices_stats = 'https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-stats.html'
F.ref._fielddata_indices_level = 'https://www.elastic.co/guide/en/elasticsearch/guide/current/_limiting_memory_usage.html';
F.ref._segments_indices_level = 'https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-segments.html'; 
F.ref._nodes_stats = 'https://www.elastic.co/guide/en/elasticsearch/guide/current/_monitoring_individual_nodes.html'; 

F.util = {};

F.format = {};

F.ui = {};

F.domain = {};
var $F = F.domain;

$F.list = {};
var $FL = $F.list;

$F.IndicesHealth = function(health, status, index, num_primary_shards, num_replica_shards, num_docs, num_deleted_docs, store_size, primary_store_size) {
	this.health = health;
	this.status = status;
	this.index = index;
	this.num_primary_shards = num_primary_shards;
	this.num_replica_shards = num_replica_shards;
	this.num_docs = num_docs;
	this.num_deleted_docs = num_deleted_docs;
	this.store_size = store_size;
	this.primary_store_size = primary_store_size;
};

$F.IndicesHealth.prototype.formatHtml = function() {
	var result = 
		'<tr>'  
			+ '<td class="table-td-center">' + F.ui.status(this.health) + '</td>'
		    + '<td class="table-td-center">' + this.status + '</td>'
		    + '<td class="table-td-center">' + this.index + '</td>'
		    + '<td>' + this.num_primary_shards + '</td>'
		    + '<td>' + this.num_replica_shards + '</td>'
		    + '<td>' + F.format.count(this.num_docs) + '</td>'
		    + '<td>' + F.format.count(this.num_deleted_docs) + '</td>'
		    + '<td>' + this.store_size + '</td>'
		    + '<td>' + this.primary_store_size + '</td>'
	    + '</tr>';
	
	
	return result;
};


$F.NodesHealth = function(node, host, role, heap_used, load) {
	this.node = node;
	this.host = host;
	this.role = role;
	this.heap_used = heap_used;
	this.load = load;
	this.fielddata = 0;
	this.shards = 0;
	this.disk_used = 0;
};

$F.NodesHealth.prototype.set = function(field, fielddata) {
	this[field] = fielddata;
};

$F.NodesHealth.prototype.get = function(field) {
	return this[field];
};

$F.NodesHealth.prototype.formatHtml = function() {
	var result =
		'<tr>'  
			 + '<td class="table-td-center">' + this.node + '</td>'
			 + '<td class="table-td-center">' + this.host + '</td>'
			 + '<td class="table-td-center">' + this.role + '</td>'
			 + '<td>' + F.util.nvl(this.shards, '-') + '</td>'
			 + '<td>' + F.util.nvl(this.disk_used, '-') + '</td>'
			 + '<td>' + this.heap_used + '</td>'
			 + '<td>' + this.fielddata + '</td>'
			 + '<td>' + this.load + '</td>'
	     + '</tr>';
	
	return result;
};

$F.indicesLevelHealth = function(index, status, number_of_shards, number_of_replicas, active_primary_shards, active_shards, relocating_shards, initializing_shards, unassigned_shards) {
	this.index = index;
	this.status = status;
	this.number_of_shards = number_of_shards;
	this.number_of_replicas = number_of_replicas;
	this.active_primary_shards = active_primary_shards;
	this.active_shards = active_shards;
	this.relocating_shards = relocating_shards;
	this.initializing_shards = initializing_shards;
	this.unassigned_shards = unassigned_shards;
};

$F.indicesLevelHealth.prototype.formatHtml = function() {
	var result =
		'<tr>'
			  + '<td class="table-td-center">' + this.index + '</td>'
			  + '<td class="table-td-center">' + F.ui.status(this.status) + '</td>'
			  + '<td>' + this.number_of_shards + '</td>'
			  + '<td>' + this.number_of_replicas + '</td>'
			  + '<td>' + this.active_primary_shards + '</td>'
			  + '<td>' + this.active_shards + '</td>'
			  + '<td>' + this.relocating_shards + '</td>'
			  + '<td>' + this.initializing_shards + '</td>'
			  + '<td>' + this.unassigned_shards + '</td>'
		  + '</tr>';
	
	return result;
};

$F.FielddataNodesLevel = function(gen_node, node, memory_size_in_bytes, evictions, fields) {
	this.gen_node = gen_node;
	this.node = node;
	this.memory_size_in_bytes = memory_size_in_bytes;
	this.evictions = evictions;
	this.fields = fields;
};


$F.FielddataNodesLevel.prototype.formatHtml = function() {
	var result =
		'<tr>'
			  + '<td class="table-td-center">' + '<a href="javascript:nodeFielddataFields(\'' + this.gen_node + '\');">' + this.node + '</a>' + '</td>'
			  + '<td>' + F.format.bytes(this.memory_size_in_bytes, 'g') + '</td>'
			  + '<td>' + this.this + '</td>'
		  + '</tr>';
	
	return result;
};
