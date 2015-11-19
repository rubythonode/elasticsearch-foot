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

## Feature Snapshots
You can find some snapshots,
[Visit elasticsearch-foot!](http://socurites.com/elasticsearch-foot).