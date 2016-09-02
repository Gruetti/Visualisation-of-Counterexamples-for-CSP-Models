/**
* @author Nils Grüttner
* 
* This module controls the program flow and handles user interaction
*/

'use strict';
document.addEventListener("DOMContentLoaded", cyInit());

$(document).on("click", ".button, #info_expand_button, #info_collapse_button", click_handler);

function click_handler(button) {
	var button_id = button.target.id;

  switch(button_id) {

	case "load_button":
		cyInit(graphGenerator(10,20,true));
    break;
		
	case "reset_button":
		cy.reset();
    break;

  case "collapse_button":
    cy.batch(function() {
      cy.remove('.dummy');
    });
    break;
 
  case "info_collapse_button":
    cy.batch(function() {
      cy.remove(cy.elements('.dummy'+cy.elements(':selected').id()));
    });
    break;
     
	case "expand_button":
    expandNodes();
    break;

  case "info_expand_button":
    expandNodes(true);
    break;
  		
  }
}
