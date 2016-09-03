/**
* @author Nils Grüttner
* 
* This module controls the program flow and handles user interaction
*/

'use strict';
//wait until document is loaded. then initialise the graph
document.addEventListener("DOMContentLoaded", cyInit());

$(document).on("click", ".button, #info_expand_button, #info_collapse_button", click_handler);

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
		cyInit(graphGenerator(10,20,true));
    break;
	
  //this button will reset the view to default
	case "reset_button":
		cy.reset();
    break;

  //this button will collapse all nodes
  case "collapse_button":
    cy.batch(function() {
      cy.remove('.dummy');
    });
    cy.elements().removeClass('expanded');
    break;
  
  //this button is shown in the info window. It collapses the currently selected node
  case "info_collapse_button":
    cy.batch(function() {
      cy.remove(cy.elements('.dummy'+cy.elements(':selected').id()));
    });
    cy.elements(':selected').removeClass('expanded');
    break;
  
  //this button will expand all nodes (showing the accepted events for this node) 
	case "expand_button":
    expandNodes();
    break;

  //this button is shown in the info window. It expands the currently selected node
  case "info_expand_button":
    expandNodes(true);
    break;
  		
  }
}
