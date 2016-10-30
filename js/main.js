/**
* @author Nils Grüttner
* 
* This module controls the program flow and handles user interaction
*/

'use strict';

//Enter the URL of a server, that provides counterexamples here!
var url = "ws://localhost:8000/";
//Set to "true", if there is no server, that provides counterexamples
var standalone_flag = true;

//wait until document is loaded. then initialise the graph
document.addEventListener("DOMContentLoaded", init());
//Event listener for file input
document.getElementById('json_file').addEventListener('change', handleFileSelect);

$(document).on("click", ".button, #info_expand_button, #info_collapse_button", click_handler);

function init() {

  if(!standalone_flag){

    getDatafromSocket(cyInit);
  }
}

function handleFileSelect(evt) {

  var file = evt.target.files[0];
  //parse file and initialize Cytoscape, when finished
  parseFile(file, cyInit);
}

/**
* Click handler for all buttons
*
* @param {string} button The button that was pressed
*/
function click_handler(button) {
	var button_id = button.target.id;

  switch(button_id) {

  //this button will load a new graph
	case "load_button":
    document.getElementById('json_file').click();
    break;
	
  //this button will reset the view to default
	case "reset_button":
		cy.center();
    break;

  //this button will collapse all nodes
  case "collapse_button":
    cy.batch(function() {
      cy.remove('.dummy');
    });
    cy.elements().removeClass('expanded');
    break;
  
  //this button will expand all nodes (showing the available events for this node) 
	case "expand_button":
    expandNodes();
    break;
  		
  }
}
