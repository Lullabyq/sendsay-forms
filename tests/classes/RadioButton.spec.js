import {RadioButton} from "../../src/classes/RadioButton.js";



describe("RadioButton.spec.js", function() {
	var json = {
					qid: 'test', 
					label: 'Label',
					value: 'hw',
					checked: true
			};
	
	it('Cheking RadioButton render' , function() {
    	var dom = new RadioButton(json);
        dom.render();
    }); 
});