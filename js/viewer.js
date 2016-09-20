/**
* @author Nils Grüttner
*
* This module has the purpose of creating a graph from preprocessed data with the cytoscape library and
* handling graph interaction
*/


'use strict';

var cy = [];

/**
* This function creates a graph object with cytoscape.js and binds it to a html container. It also sets 
* options for layout and style, according to counterexample type
*
* @param {object} data An object in JSON format, containing edges and nodes for the graph
* @param {string} type The counterexample type
*
*/
function cyInit(data,type) {
  hideInfo();
  var layout_options = [];
  //set layout, depending on counterexample type
  switch(type) {

    case "TRACE":
    layout_options = {
      name: 'grid',
      position: function (node) {
        if (node.hasClass('imp')) {
       return {row:2,col:undefined};
        } else {
          return {row:1, col:undefined}
        }
      },
      fit: true,
      rows: 2
    }
    break;

    case "FAILURE":
    layout_options = {
      name: 'grid',
      position: function (node) {
        if (node.hasClass('imp')) {
       return {row:2,col:undefined};
        } else {
          return {row:1, col:undefined}
        }
      },
      fit: true
    }
    break;

    case "LOOP":
    layout_options = {
      name: 'grid',
      fit: true,
      rows: 1
    }
    break;
  }
  
  // create a graph object and specify layout/style
	cy = cytoscape({

		container: document.getElementById('cy'), //container to render in
		elements: data,
    layout: layout_options,
    style: common_stylesheet,
    selectionType: 'single',
    autoungrabify: true
  });
  
  //Event handlers for nodes/edges
  //center view on selected node, highlight selected node and show info window for selected node
  cy.on('select', 'node', function(e){
    var node = this;

    cy.center(node);
    showInfo(node);
    node.outgoers('edge').addClass('highlighted');
  });
  //undo actions that were done by selecting a node
  cy.on('unselect', 'node', function(e){
    var node = this;

    hideInfo();
    node.outgoers('edge').removeClass('highlighted');
  });
  //highlight hovered nodes
  cy.on('mouseover', 'node', function(e){
    var node = this;
    node.addClass('hovered');
  });
  //un-highlight if node is not hovered anymore
  cy.on('mouseout', 'node', function(e){
    var node = this;
    node.removeClass('hovered');
  });
}

/**
* This function hides the info window
*/
function hideInfo() {

  $('#info_window').hide();
}
/**
* This function creates a info window, using handlebars.js, and fills it with information. Also adds buttons to 
* expand/collapse specific nodes.
*
* @param {object} node The node the info window is shown for
*/
function showInfo(node) {

  //create the info window
  var infoTemplate_comp = Handlebars.compile([
    '<p>Accepted: {{acc_evt}}</p>',
    '<p>Refused: {{ref_evt}}</p>',
    '<button id="info_collapse_button" type="button" class="info_button">Collapse view</button>',
    '<button id="info_expand_button" type="button" class="info_button">Expand view</button>'].join(""));
  //gathers information on accepted events, that are shown in the info window
  var acc_evt = node.data('acc_evt');
  //gathers information on refused events, that are shown in the info window
  var ref_evt = node.data('ref_evt');
  //if empty, show empty set
  if (acc_evt==undefined) {
    acc_evt= ['{}'];
  }
  if (ref_evt==undefined) {
    ref_evt= ['{}'];
  }
  //show the info window in the predefined info_window div
  $('#info_window').html(infoTemplate_comp({acc_evt:acc_evt, ref_evt:ref_evt})).show();
}
/**
* This function adds the ability to expand one specific or all nodes
*
* @param onlyActive {boolean} false: expand all nodes, true: expand only the currently selected node
*/
function expandNodes(onlyActive=false) {
    
    //if only for active node, call addExpandedNodes once
    if (onlyActive) {
      var activeNode = cy.nodes(':selected');
      addExpandedNodes(activeNode);
    //else iterate through all nodes  
   } else {
      cy.nodes().each(function (index, node) {addExpandedNodes(node);});
    }
}

/**
* Helper function for expandNodes. Adds the actual expanding ability
*
* @param node This is the node that will get expanded. 
*/

function addExpandedNodes(node) {

  //use cy.batch to make things more efficient. cy.batch waits until all new elements are added before calculating new positions and styles
  cy.batch(function(){

    //if current node does not accept anything, just do nothing
    if ((node.data('acc_evt')!=undefined) && !node.hasClass('expanded') && !node.hasClass('spec_end') && !node.hasClass('imp_end')){
      //create a new node and an edge, leading from current node to new node
      for (var i=0; i < node.data('acc_evt').length; i++) {

        cy.add({"data":{"id":node.id()+"dummy"+i}, "classes":"dummy"+node.id()+" "+"dummy"});
        cy.add({"data":{"id":node.id()+"edgeDummy"+i, "source":node.id(), "target": node.id()+"dummy"+i, "label":node.data('acc_evt')[i]}, "classes": "dummy"+node.id()+" "+"dummy"});
        node.addClass('expanded');

      }
      //for all newly created nodes, arrange them around their parent node in a circular shape
      cy.elements('.dummy'+node.id()).layout({name: 'circle', boundingBox: {
        x1: node.position('x'),
        x2: node.position('x'),
        y1: node.position('y'),
        y2: node.position('y')
      },
      concentric: function( n ){
        if( node.id() === n.id() ){
          return 2;
        } else {
          return 1;
        }
      },
      minNodeSpacing:1,
      levelWidth: function(){
        return 1;
      },
      fit:false, 
      radius:100
      });
    }
  });
}



