/**
* @author Nils Grüttner
*
* This module has the purpose of creating a graph from preprocessed data with the cytoscape library and
* handling graph interaction
*/


'use strict';

var cy = [];
var default_graph = graphGenerator();

function cyInit(data=default_graph) {
  hideInfo();
  
  // create a graph object
	cy = cytoscape({

		container: document.getElementById('cy'), //container to render in
		elements: data,
    layout: {
      name: 'grid',
      fit: true,
      rows: 2
    },
    style: common_stylesheet,
    selectionType: 'single',
    autoungrabify: true
  });
  

  cy.on('select', 'node', function(e){
    var node = this;

    cy.center(node);
    showInfo(node);
    node.outgoers('edge').addClass('highlighted');
  });

  cy.on('unselect', 'node', function(e){
    var node = this;

    hideInfo();
    node.outgoers('edge').removeClass('highlighted');
  });

  cy.on('mouseover', 'node', function(e){
    var node = this;
    node.addClass('hovered');
  });

  cy.on('mouseout', 'node', function(e){
    var node = this;
    node.removeClass('hovered');
  });
}

function hideInfo() {

  $('#info_window').hide();
}

function showInfo(node) {
  var infoTemplate=[];
  infoTemplate = $('#info_template').html();
  var infoTemplate_comp = Handlebars.compile([
    '<p>Accepted: {{acc_evt}}</p>',
    '<p>Refused: {{ref_evt}}</p>',
    '<button id="info_collapse_button" type="button" class="info_button">Collapse view</button>',
    '<button id="info_expand_button" type="button" class="info_button">Expand view</button>'].join(""));
  var acc_evt = node.data('acc_evt');
  var ref_evt = node.data('ref_evt');
  if (acc_evt==undefined) {
    acc_evt= ['{}'];
  }
  if (ref_evt==undefined) {
    ref_evt= ['{}'];
  }
  $('#info_window').html(infoTemplate_comp({acc_evt:acc_evt, ref_evt:ref_evt})).show();
}

function expandNodes(onlyActive=false) {
    
    if (onlyActive) {
      var activeNode = cy.nodes(':selected');
      addExpandedNodes(activeNode);
   } else {
      cy.nodes().each(function (index, node) {addExpandedNodes(node);});
    }
}

function addExpandedNodes(node) {

  cy.batch(function(){

    if (node.data('acc_evt')!=undefined){
      for (var i=0; i < node.data('acc_evt').length; i++) {

        cy.add({"data":{"id":node.id()+"dummy"+i}, "classes":"dummy"+node.id()+" "+"dummy"});
        cy.add({"data":{"id":node.id()+"edgeDummy"+i, "source":node.id(), "target": node.id()+"dummy"+i, "label":node.data('acc_evt')[i]}, "classes": "dummy"});

      }
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



