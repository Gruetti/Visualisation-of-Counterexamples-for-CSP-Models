/**
* @author Nils Grüttner
*
* This module retrieves data from a socket with json protocol and processes it for further use
*/
'use strict';

var json = {
};

/**
* This function creates a json object from a file object
*
* @param file A file object, containing a json
* @param callback This function will be called, once the parsing is done
*/
function parseFile(file, callback) {

	var reader = new FileReader();
	reader.addEventListener("load", function () {
		json=JSON.parse(reader.result);
		callback(getData(),getType());
	});
	reader.readAsText(file);
}

/**
* This function returns processed data to use in cytoscape
*/
function getData() {

	switch(json.name) {

		case "TRACE":
			json.nodes.push({"data":{"id":"traceDummy"}, "classes":"traceDummy spec"}); 
			json.edges.push({"data":{"id":"traceEdgeDummy", "source": getSpecEnd().data.id, "target": "traceDummy", "label":"Available: "+"{"+getSpecEnd().data.acc_evt+"}"}, "classes": "traceEdgeDummy"});

			markLastImpEdge();
 
		return json.nodes.concat(json.edges);


		case "FAILURE":
			json.nodes.push({"data":{"id":"failDummy"}, "classes":"failDummy imp"}); 
			json.edges.push({"data":{"id":"failEdgeDummy", "source": getImpEnd().data.id, "target": "failDummy", "label":"Refused: "+"{"+getImpEnd().data.ref_evt+"}"}, "classes": "failEdgeDummy"});
 
		return json.nodes.concat(json.edges);

		case "LOOP":
		return json.nodes.concat(json.edges);
	}
}

//helper function, returns last node of implementation process
function getImpEnd() {

	for (var i = json.nodes.length-1; i >= 0; i--) {

		if (json.nodes[i].classes.indexOf("imp_end")!= -1) {
			
			return json.nodes[i];
		}
	}

}

//helper function, returns last node of specification process
function getSpecEnd() {

	for (var i = json.nodes.length-1; i >= 0; i--) {

		if (json.nodes[i].classes.indexOf("spec_end")!= -1) {
			
			return json.nodes[i];
		}
	}

}

function markLastImpEdge() {

	for (var i = json.edges.length-1; i >= 0; i--) {

	if (json.edges[i].data.target == getImpEnd().data.id) {
		
		json.edges[i].classes = json.edges[i].classes+" "+"imp_end";
	}
}
}

function getType() {

	return json.name;
}

