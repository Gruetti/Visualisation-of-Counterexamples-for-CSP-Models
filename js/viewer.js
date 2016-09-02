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
  var infoTemplate_comp = Handlebars.compile('<p>Accepted: {{acc_evt}}</p><p>Refused: {{ref_evt}}');
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

function resetView(cy) {
  cy.reset();
}

function getGraph() {
  return cy;
}




