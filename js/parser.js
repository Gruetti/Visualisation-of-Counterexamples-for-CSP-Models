/**
* @author Nils Grüttner
*
* This module retrieves data from a socket with json protocol and processes it for further use
*/
'use strict';

//Enter the URL of a server, that provides counterexamples here!
var url = "ws://localhost:8000/";
var json = {};

//This function will receive a counterexample from a server
function getDatafromSocket(callback){

	var websocket = new WebSocket(url);
	websocket.onopen = function(evt){console.log('Connected')};
	websocket.onmessage = function(evt){
		json=JSON.parse(evt.data);
		callback(getData(),getType());
		console.log('Data received');
		websocket.close();
	};
	websocket.onclose = function(evt){console.log('Disconnected')};
	websocket.onerror = function(evt){
							alert('An error has occured: '+ evt.data+'. If the server is ready, try refreshing.');
							websocket.close();
						};

}

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
* This function returns processed data to use in cytoscape and validates the data using the JSON schema
*/
function getData() {

	var json_schema={
		"type": "object",
		"properties": {
			"name": {
				"type": "string", 
				"enum": ["TRACE", "FAILURE", "LOOP"]
			},
			"nodes": {
				"type": "array", 
				"items": {
					"type": "object",
					"properties": {
						"data": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								}, 
								"acc_evt": {
									"type": "array",
									"items": {
										"type": "string"
									}
								},
								"ref_evt": {
									"type": "array",
									"items": {
										"type": "string"
									}
								}
							},
							"required": ["id","acc_evt","ref_evt"]
						},				
						"classes": {
							"type": "string",
							"enum": ["root_spec","root_imp","spec","imp","spec_end","imp_end"]
						}
					},
					"required": ["data"]
				}
			},
			"edges": {
				"type": "array",
				"items": {
					"type": "object",
					"properties": {
						"data": {
							"type": "object",
							"properties": {
								"id": {
									"type": "string"
								},
								"source": {
									"type": "string"
								},
								"target": {
									"type": "string"
								},
								"label": {
									"type": "string"
								}
							},
							"required":["id","source","target","label"]
						},
						"classes": {
							"type": "string",
							"enum": ["spec","imp"]
						}
					},
					"required": ["data"]
				}
			}
		}
	}

	if(tv4.validate(json,json_schema)) {

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
	} else {

		alert('The data is not in the required JSON format!');
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

