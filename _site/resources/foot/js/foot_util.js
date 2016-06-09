/**
 * curl get
 * @param url
 * @param callback function
 * @dateType json(default)/text
 */
F.curlGet = function(url, callback, dataType) {
	if ( F.mode == 'standalone' ) {
		url = '/es' + url;
	}
	if ( !dataType ) {
		dataType = 'json';
	}

	return function() {
		$.ajax({
			type: 'GET',
			url: url,
			success : function(data) {
				callback(data);
			},
			dataType : dataType
		});
	};
};


F.util.nvl = function(str, formattedStr) {
	if ( !formattedStr ) {
		formattedStr = '';
	}
	
	if ( str ) {
		return str;
	}
	
	return formattedStr;
};

F.util.nvlInt = function(val, defaultVal) {
	if ( !defaultVal ) {
		defaultVal = 0;
	}
	
	if ( val ) {
		return val;
	}
	
	return defaultVal;
};

F.util.viewName = function(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    
    if ( match ) {
    	return decodeURIComponent(match[1].replace(/\+/g, ' '));
    } else {
    	return "overview.html";
    }
};

F.util.concat2FieldVals = function(val1, val2) {
	return val1 + " (" + val2 + ")";
};

F.util.keys = function(obj) {
	var keys = [];
	for(var k in obj) {
		keys.push(k);
	}
	
	return keys;
};

F.util.endsWith = function (target, ends) {
  return target.length >= ends.length && target.substr(target.length - ends.length) == ends;
};

F.util.contains = function(str, sub) {
	if ( str.indexOf(sub) > -1 ) {
		return true;
	}
	
	return false;
};

F.util.sortByField = function(field, reverse) {
	return function(a, b) {
		if ( reverse ) {
			if ( isNaN(a[field]) || isNaN(b[field]) ) {
				return -(a[field].localeCompare(b[field]));
			} else {
				return -(a[field] - b[field]);
			}
		} else {
			if ( isNaN(a[field]) || isNaN(b[field]) ) {
				return (a[field].localeCompare(b[field]));
			} else {
				return (a[field] - b[field]);
			}
		}
	}
};

F.util.sortByFieldVal = function(field, val, reverse) {
	return function(a, b) {
		if ( reverse ) {
			return -(a[field][val] - b[field][val]);
		} else {
			return (a[field][val] - b[field][val]);
		}
	}
};

F.util.randColor = function colorFor() {
	var h = Math.random() * 360
	var s = 30 + Math.random() * 20
	var l = 60 + Math.random() * 20
	// return [$.husl.toHex(h, s, l), $.husl.toHex(h, s, l - 10)];
	return $.husl.toHex(h, s, l);
};


F.format.bytes = function(bytes, scale) {
	var bytesFloat = parseFloat(bytes);
	
	if ( bytesFloat <= 0.0 ) {
		return 0;
	}
	
	if ( scale == 'b' ) {
		return (bytesFloat).toFixed(1) + 'b';
	} else if ( scale == 'k' ) {
		return (bytesFloat / 1024).toFixed(1) + 'kb';
	} else if ( scale == 'm' ) {
		return (bytesFloat / 1024 / 1024).toFixed(1) + 'mb';
	} else if ( scale == 'g' ) {
		return (bytesFloat / 1024 / 1024 / 1024).toFixed(2) + 'gb';
	}
};

F.format.toBytes = function(bytesReadable) {
	var bytes = 0;
	if ( bytesReadable.match(/.*kb$/) ) {
		bytes = parseFloat(bytesReadable) * 1024;
	} else if ( bytesReadable.match(/.*mb$/) ) {
		bytes = parseFloat(bytesReadable) * 1024 * 1024;
	} else if ( bytesReadable.match(/.*gb$/) ) {
		bytes = parseFloat(bytesReadable) * 1024 * 1024 * 1024;
	} else {
		bytes = parseFloat(bytesReadable);
	}
	
	return Math.round(bytes);
};

F.format.count = function(count) {
	if ( isNaN(count) ) {
		return count;
	}
	return count.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};