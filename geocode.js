/*jslint */
/*global window, console, GlocalSearch */

(function() {

	function addEvent(obj,type,fn){
	  if (obj.attachEvent) {
	    obj['e'+type+fn] = fn;
	    obj[type+fn] = function(){
				obj['e'+type+fn](window.event);
	    };
	    obj.attachEvent('on'+type, obj[type+fn]);
	  } else {
	    obj.addEventListener(type,fn,false);
	  }
	}
	
	function geoCode(point,html) {
		var latLon = point.split(',');
		document.getElementById('result').innerHTML += html+latLon[0]+'</td><td>'+latLon[1]+'</td></tr>';
	}
	
	function usePointFromPostcode(postcode,callbackFunction,html) {
		var localSearch = new GlocalSearch();
		localSearch.setSearchCompleteCallback(null,
			function() {
				if (localSearch.results[0]) {
					var resultLat = localSearch.results[0].lat;
					var resultLng = localSearch.results[0].lng;
					var point = resultLat+','+resultLng;
					callbackFunction(point,html);
				} else if (window.console) {
					console.log('Postcode not found!');
				}
			});
		localSearch.execute(postcode + ', UK');
	}
	
  function CSVToArray(strData, strDelimiter){
		strDelimiter = (strDelimiter || ",");
    var objPattern = new RegExp(
			(
				"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
				"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
				"([^\"\\" + strDelimiter + "\\r\\n]*))"
			),
			"gi"
    );
		var arrData = [[]];
    var arrMatches = null;
		while ( (arrMatches = objPattern.exec( strData )) !== null ){
			var strMatchedDelimiter = arrMatches[ 1 ];
			if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)){
				arrData.push( [] );
      }
      var strMatchedValue;
			if (arrMatches[ 2 ]){
				strMatchedValue = arrMatches[ 2 ].replace(new RegExp( "\"\"", "g" ),"\"");
      } else {
				strMatchedValue = arrMatches[ 3 ];
			}
			arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
    return( arrData );
  }
	
	function processCSV(csv) {
	  var stores = CSVToArray(csv);
	  for (var i=stores.length; i--;) {
			var store = stores[i];	
			var postcode = store[5];
			if (postcode !== undefined) {
				var add1 = store[0];
				var add2 = store[1];
				var add3 = store[2];
				var add4 = store[3];
				var add5 = store[4];
				var html = '<tr><td>'+add1+'</td><td>'+add2+'</td><td>'+add3+'</td><td>'+add4+'</td><td>'+add5+'</td><td>'+postcode+'</td><td>';
				usePointFromPostcode(postcode.toUpperCase(),geoCode,html);
			}	
	  }
	}

	addEvent(window,'load',function(e){
		var doc = document;
		var formSingle = doc.getElementById('form-single');
		if (formSingle) {
			var mapPostcode = doc.getElementById('postcode');
		  addEvent(formSingle,'click',function(){
				var postcode = mapPostcode.value.toUpperCase();
				if (postcode === '') {
					window.alert('Please enter a postocde');
					return false;
				}
				var html = '<tr><td></td><td></td><td></td><td></td><td></td><td>'+postcode+'</td><td>';
				usePointFromPostcode(postcode,geoCode,html);
			});
		}
		var formMultiple = doc.getElementById('form-multiple');
		if (formMultiple) {
			var csvData = doc.getElementById('csv');
		  addEvent(formMultiple,'click',function(){
				var csv = csvData.value;
				if (csv === '') {
					window.alert('Please enter csv data');
					return false;
				}
				processCSV(csv);
			});
		}
	});
	
})();
