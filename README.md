# elasticsearch-foot

## Another web front end for an elasticsearch cluster

## Overview
Elasticsearch monitoring and managing tool through web

## Instailling and Running

After Downloading the ZIP file, copy it into elasticsearch plugin directory.
```
$ cp ~/Downloads/elasticsearch-foot-master.zip ${ES_HOME}/plugins/
```

Unzip it, and connect it through browser.
rename it as 'foot'
```
$ unzip elasticsearch-foot-master.zip
$ mv elasticsearch-foot-master foot
```

Open foot config file(foot_config.js), then config some settings.
```
vi foot/_site/resources/foot/js/foot_config.js

...
/*
 * elasticsearch-foot running mode
 * - plugin   : plugin mode
 * - standalone : standalone mode (under developing..)
 */
F.mode = 'plugin';

/*
 * elasticsearch-foot plugin name
 * Set it correctly
 */
F.pugin_name = 'foot';
...
```

Open a browser, then type it.
```
http://[host]:[folder]/_plugin/foot/index.html
```

## Features
You can easily monitor and inspect elasticsearch cluster in a varied view.

### Cluster Health Overview
At a high level, you can overview health of cluster, indices and nodes.
![Cluster Health Overview](http://socurites.com/wp-content/uploads/2015/06/elasticsearch_foot_overview-1024x620.png "Cluster Health Overview")

### Node level Stats
At a node level, you can watch machine status.
![Node level Stats](http://socurites.com/wp-content/uploads/2015/06/elasticsearch_foot_nodes_stats-1024x281.png "Node level Stats")

### Index Level Stats
At a index level, you can check index status.
![Index Level Stats](http://socurites.com/wp-content/uploads/2015/06/elasticsearch_foot_indices_stats-1024x515.png "Index Level Stats")

### Inspector
This is the most useful feature of elasticsearch-foot.
You can introspect index/nodes status at a shard level on some key metrics. 
![Nodes Inspector](http://socurites.com/wp-content/uploads/2015/12/foot_nodes_inspector-1024x221.png "Nodes Inspector")

![Indices Inspector](http://socurites.com/wp-content/uploads/2015/12/foot_indices_inspector-1024x294.png "Indices Inspector")


## Feature Snapshots
You can find some snapshots,
[Visit elasticsearch-foot!](http://socurites.com/elasticsearch-foot).