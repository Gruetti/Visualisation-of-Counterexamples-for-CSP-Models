/**
* @author Nils Grüttner
* 
* This module controls the program flow and handles user interaction
*/

'use strict';
var cy = getGraph();
document.addEventListener("DOMContentLoaded", cyInit());

$(document).on("click", ".button", click_handler);

function click_handler(button) {
	var button_id = button.target.id;

	if (button_id == "load_button") {
		cyInit(graphGenerator(10,20,true));
		
	}	
	if (button_id == "reset_button") {
		resetView(getGraph());
	}
	if (button_id == "expand_button") {
		var node = cy.getElementById('1_');
		var npos = node.position();
		var w = window.innerWidth;
		var h = window.innerHeight;
		cy.add({"data": { "id": "hubl1", "acc_evt": ["a","b"], "ref_evt":["d"]},"classes": "invis"});
		cy.add({"data": { "id": "hubl2", "acc_evt": ["a","b"], "ref_evt":["d"]},"classes": "invis"});
		cy.add({"data": { "id": "hubl3", "acc_evt": ["a","b"], "ref_evt":["d"]},"classes": "invis"});
		cy.add({"data": { "id": "hubl4", "acc_evt": ["a","b"], "ref_evt":["d"]},"classes": "invis"});
		cy.add({"data": { "id": "hubl5", "acc_evt": ["a","b"], "ref_evt":["d"]},"classes": "invis"});
		cy.add({"data": { "id": "hubl6", "acc_evt": ["a","b"], "ref_evt":["d"]},"classes": "invis"});
		cy.add({"data": { "id": "hubl7", "acc_evt": ["a","b"], "ref_evt":["d"]},"classes": "invis"});
    cy.add({"data": { "id": "wubl1", "source": "1_", "target": "hubl1", "label": "a"}, "classes": "spec"});
    cy.add({"data": { "id": "wubl2", "source": "1_", "target": "hubl2", "label": "a"}, "classes": "spec"});
    cy.add({"data": { "id": "wubl3", "source": "1_", "target": "hubl3", "label": "a"}, "classes": "spec"});
    cy.add({"data": { "id": "wubl4", "source": "1_", "target": "hubl4", "label": "a"}, "classes": "spec"});
    cy.add({"data": { "id": "wubl5", "source": "1_", "target": "hubl5", "label": "a"}, "classes": "spec"});
    cy.add({"data": { "id": "wubl6", "source": "1_", "target": "hubl6", "label": "a"}, "classes": "spec"});
    cy.add({"data": { "id": "wubl7", "source": "1_", "target": "hubl7", "label": "a"}, "classes": "spec"});
    cy.elements('#hubl1, #hubl2, #hubl3,#hubl4,#hubl5,#hubl6,#hubl7').layout({name: 'circle', boundingBox: {
            x1: npos.x - w/2,
            x2: npos.x + w/2,
            y1: npos.y - w/2,
            y2: npos.y + w/2
          },
          concentric: function( n ){
            if( node.id() === n.id() ){
              return 2;
            } else {
              return 1;
            }
        },minNodeSpacing:1,levelWidth: function(){
            return 1;
          }, avoidOverlap: false,padding:1,fit:false, radius:100
    }
    );
	}		
}
