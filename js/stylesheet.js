var common_stylesheet = [
   {
    selector: 'node',
    	style: {
      'background-color': '#666',
  }
  }, 
  { selector: 'node.root_spec',
    style: {
      'label': 'SPECIFICATION PROCESS'
    }
  },
  { selector: 'node.root_imp',
    style: {
      'label': 'IMPLEMENTATION PROCESS'
    }
  },  
  {
    selector: 'node.root_spec, node.root_imp',
    	style: {
      'background-color': 'green'
    }
	},
  
    {
    selector: 'edge',
    style: {
      'width': 1,
      'line-color': 'ccc',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle',
      'curve-style': 'bezier',
      'label': 'data(label)',
      'text-margin-y': '-10'
    }
  },
    {
    selector: 'edge.highlighted',
      style: {
      'line-color': '#fe8e41',
      'width': 3
    }
  },
  {
    selector: 'node.spec_end, edge.accepted',
    style: {
      'background-color': 'green',
      'line-color': 'green'
    }
  },
  {
    selector: 'node.imp_end, edge.refused',
    style: {
      'background-color': 'red',
      'line-color': 'red'
    }
  },
  {
    selector: ':selected, :active, node.hovered',
    style: {
      'background-color': '#fe8e41',
      'line-color': '#fe8e41' 
    }
  },
  {
    selector: 'node.dummy',
    style: {
      'width': 0.1,
      'background-opacity': 0
    }
  }
  ];