/**
 * curl get
 * @param url
 * @param callback function
 * @dateType json(default)/text
 */
F.curlGet = function(url, callback, dataType) {
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

F.util.viewName = function(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    
    if ( match ) {
    	return decodeURIComponent(match[1].replace(/\+/g, ' '));
    } else {
    	return "overview.html";
    }
};

F.util.concat2FieldVals = function(val1, val2) {
	return val1 + "(" + val2 + ")";
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


F.format.bytes = function(bytes, scale) {
	var bytesFloat = parseFloat(bytes);
	
	if ( bytesFloat <= 0.0 ) {
		return 0;
	}
	
	if ( scale == 'm' ) {
		return (bytesFloat / 1024 / 1024).toFixed(1) + 'mb';
	} else if ( scale == 'g' ) {
		return (bytesFloat / 1024 / 1024 / 1024).toFixed(2) + 'gb';
	}
};

F.format.count = function(count) {
	if ( isNaN(count) ) {
		return count;
	}
	return count.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};