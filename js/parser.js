/**
* @author Nils Grüttner
*
* This module retrieves data from a socket with json protocol and processes it for further use
*/
'use strict';

var json = {
  "name": "FAILURE",
  "nodes": [{
      "data": { "id": "1", "acc_evt": ["a","b"], "ref_evt":["d"]}, "classes": "root_spec spec"
    },
    {
      "data": { "id": "2", "acc_evt": ["b"], "ref_evt":["g"]}, "classes": "spec"
    },
    {
      "data": { "id": "3", "acc_evt": ["b","c"], "ref_evt":["h","i"]}, "classes": "spec"
    },
    {
      "data": { "id": "4", "acc_evt": ["a"], "ref_evt":["g","f","d"]}, "classes": "spec_end spec"
    },
  {
      "data": { "id": "1_", "acc_evt": ["a"], "ref_evt":["g","h","i"]}, "classes": "root_imp imp"
    },
    {
      "data": { "id": "2_", "acc_evt": ["b"], "ref_evt":["g","h","i"]}, "classes": "imp"
    },
  {
      "data": { "id": "3_", "acc_evt": ["c"], "ref_evt":["g","h","i"]}, "classes": "imp"
    },
    {
      "data": { "id": "4_", "acc_evt": ["h"], "ref_evt":["g","h","i"]}, "classes": "imp_end imp"
    }],
    "edges": [{ 
      "data": { "id": "a", "source": "1", "target": "2", "label": "a"}, "classes": "spec"
    },
  { 
      "data": { "id": "b", "source": "2", "target": "3", "label": "b"}, "classes": "spec"
    },
    { 
      "data": { "id": "c", "source": "3", "target": "4", "label": "c"}, "classes": "spec"
    },
  { 
      "data": { "id": "a_", "source": "1_", "target": "2_", "label": "a"}, "classes": "imp"
    },
    { 
      "data": { "id": "b_", "source": "2_", "target": "3_", "label": "b"}, "classes": "imp"
    },
  { 
      "data": { "id": "c_", "source": "3_", "target": "4_", "label": "d"}, "classes": "imp"
    }]
};


/**
* This function returns processed data to use in cytoscape
*/
function getData() {

	switch(json.name) {

		case "TRACE":
			json.nodes.push({"data":{"id":"traceDummy"}, "classes":"traceDummy spec"}); 
			json.edges.push({"data":{"id":"traceEdgeDummy", "source": getSpecEnd().data.id, "target": "traceDummy", "label":"Accepted: "+"{"+getSpecEnd().data.acc_evt+"}"}, "classes": "traceEdgeDummy"});

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

