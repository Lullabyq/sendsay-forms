import {Text} from "../../src/classes/Text.js";



describe("Text.spec.js", function() {

    var json = {"type":"text","text":"<b>Form title</b>", "align": "left"};

	it('Cheking text render' , function() {
    	var dom = new Text(json);
        dom.render();
    });
    it('Cheking text makeStyles' , function() {
    	var dom = new Text(json);
        expect(dom.makeStyles()).toEqual({
            "text-align": "left",
            "line-height": "normal"
        });
    });
});