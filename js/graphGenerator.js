function graphGenerator(n=10,e=20,isDefault=true) {
	
	var nodes=[];
	var graph=[];
	var json = {
  "name": "TRACE",
  "nodes": [{
      "data": { "id": "1", "acc_evt": ["a","b"], "ref_evt":["d"]}, "classes": "root_spec"
    },
    {
      "data": { "id": "2", "acc_evt": ["b"], "ref_evt":["g"]}, "classes": "spec"
    },
    {
      "data": { "id": "3", "acc_evt": ["b","c"], "ref_evt":["h","i"]}, "classes": "spec"
    },
    {
      "data": { "id": "4", "ref_evt":["g","f","d"]}, "classes": "spec_end"
    },
  {
      "data": { "id": "1_", "acc_evt": ["a"], "ref_evt":["g","h","i"]}, "classes": "root_imp"
    },
    {
      "data": { "id": "2_", "acc_evt": ["b"], "ref_evt":["g","h","i"]}, "classes": "imp"
    },
  {
      "data": { "id": "3_", "acc_evt": ["c"], "ref_evt":["g","h","i"]}, "classes": "imp"
    },
    {
      "data": { "id": "4_", "ref_evt":["g","h","i"]}, "classes": "imp_end"
    }],
    "edges": [{ 
      "data": { "id": "a", "source": "1", "target": "2", "label": "a"}, "classes": "spec"
    },
  { 
      "data": { "id": "b", "source": "2", "target": "3", "label": "b"}, "classes": "spec"
    },
    { 
      "data": { "id": "c", "source": "3", "target": "4", "label": "c"}, "classes": "spec accepted"
    },
  { 
      "data": { "id": "a_", "source": "1_", "target": "2_", "label": "a"}, "classes": "imp"
    },
    { 
      "data": { "id": "b_", "source": "2_", "target": "3_", "label": "b"}, "classes": "imp"
    },
  { 
      "data": { "id": "c_", "source": "3_", "target": "4_", "label": "d"}, "classes": "imp refused"
    }]
};
var default_graph=json.nodes.concat(json.edges);

	if (isDefault) {
		return default_graph;
	}
	//create nodes
	for (i = 1; i <= 2*n; i++) {
		if (i == 1) {
			nodes.push({'data': {'id': i}, classes: 'root'});
			graph.push({'data': {'id': i}, classes: 'root'});
			console.log(nodes[0].data.id);
		} else if (i == n){
			nodes.push({'data': {'id': i}, classes: 'difference'});
			graph.push({'data': {'id': i}, classes: 'difference'});
		} else {
			nodes.push({'data': {'id': i}});
			graph.push({'data': {'id': i}});
		}
	}

	var node=[];
	for (i=0; i < nodes.length; i++) {
		
		node = nodes[i];

		if (node.classes=='difference') {
			graph.push({'data': {'id':node.data.id + "-" + nodes[i+1].data.id, 'source': node.data.id, 'target': nodes[i+1].data.id}, classes:'stop'});
			break;
		} else {

			graph.push({'data': {'id':node.data.id + "-" + nodes[i+1].data.id, 'source': node.data.id, 'target': nodes[i+1].data.id}});
		}
	}	



	console.log(graph);
	return graph;
}