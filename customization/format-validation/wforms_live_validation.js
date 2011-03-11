/**
 * Live (as you type) input validation.
 *  
 * wForms validation adds a event handler to the <form> 'submit' event.
 * (See: http://code.google.com/p/wforms/source/browse/trunk/wforms_validation.js#60)
 * then run the onApply() method, which is by default empty. 'onapply' is a pseudo-event that we can use to hook up some custom code.
 * (See: http://code.google.com/p/wforms/source/browse/trunk/wforms_validation.js#125)
 * 
 * To do the 'live' validation, we need to add more event handlers to all fields with a validation rule. 
 */

// Wrap everything in anonymous function so we don't mess with the global scope 
new function(_) {

	// Preserve the onApply handler in case some other code already customized it. We'll run it once we're done with our business.	
	var _onApply = wFORMS.behaviors.validation.instance.prototype.onApply;
	
	// Now we overwrite the onApply handler with the code we need to run.
	wFORMS.behaviors.validation.instance.prototype.onApply = function() {
		
		// In this context 'this' refers to the validation instance object (onApply is a prototype).
		// We keep a reference in a local variable so we can still use it in the closure below.
		var _validation = this; 
		
		// The 'target' property refers to the form to which the validation behavior is applied. 
		// (see http://code.google.com/p/wforms/source/browse/trunk/wforms_validation.js#53)
		var _form = this.target;
				
		// Go through each rule defined in the validation behavior
		// (see http://code.google.com/p/wforms/source/browse/trunk/wforms_validation.js#17)
		// The 'behavior' property is a shortcut to the wFORMS.behaviors.validation object.
		// (see http://code.google.com/p/wforms/source/browse/trunk/wforms_validation.js#52)		
		for (var ruleName in this.behavior.rules) {
			
			// Find all form inputs matching the rule's selector (see W3C Selector API / CSS Selectors).
			_form.querySelectorAll(this.behavior.rules[ruleName].selector).forEach(function(element) {
 				
				// The closure changed the meaning of 'this', we'll use the local variable '_validation' now.
				
				// The actual validation code is executed by wFORMS.behaviors.validation.instance.prototype.run
				// (see http://code.google.com/p/wforms/source/browse/trunk/wforms_validation.js#144)
				// In this context, it's _validation.run()
				
				// Check the element's type to run the live validation on the appropriate event.
				if(element.type=='radio' || element.type=='checkbox') {
					element.addEventListener('click', function(e){ return _validation.run(e, element)} ,false);		
				} else {					
					element.addEventListener('keyup', function(e){
						// Keep a note of which key was pressed, so we don't force a reformat when using 'backspace'.
						_validation._keyPressed = e?e.keyCode:window.event.keyCode; 
						var result = _validation.run(e, element);
						// Reset our keyPress note. 
						_validation._keyPressed = null;
						return result;
					} ,false);
				}
 			});
		}
		
		// We're done applying our custom handlers, run the saved onApply() to play nice with other customizations.	
		_onApply();		
	}
}(); // run our anonymous function to set up everything.