/***
 *  wForms 3.0 - a javascript extension to web forms.
 * 
 *  Customization Script:
 *    Run validation on the onblur event.
 * 
 * 
 *  wForms 3.0 uses base2 - copyright 2007 Dean Edwards 
***/

if (typeof(wFORMS) == "undefined") {
	throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
if (typeof(wFORMS.behaviors['validation']) == "undefined") {
	throw new Error("wFORMS validation behavior not found. This behavior depends on the wFORMS validation behavior.");
}

/**
 *
 */
new function(_) {

	// preserve any existing handler
	var _onApply = wFORMS.behaviors.validation.instance.prototype.onApply;
	
	// set onblur event handler
	var _setHandler = function(element, behavior, target) {
	
		target = target || element;
		
		if(!element.addEventListener) base2.DOM.bind(element);		
		
		if( element.tagName == 'INPUT' ||
		    element.tagName == 'TEXTAREA' || 
		    element.tagName == 'SELECT') { 
		
			if(element.type!='radio' && element.type!='checkbox') {
				element.addEventListener('blur', function(e){ return behavior.run(e, target)} ,false);
			} else {
				element.addEventListener('click', function(e){ return behavior.run(e, target)} ,false);					
			}
		}
	}
	
	// find validated fields and apply onblur handler 
	wFORMS.behaviors.validation.instance.prototype.onApply = function() {
	
		// form element
		var f = this.target;
		
		// Go through all rules defined in validation behavior
		for (var ruleName in this.behavior.rules) {
	 		var rule  = this.behavior.rules[ruleName];
	   		var _b 	  = this;
		
			if(!f.querySelectorAll)
				base2.DOM.bind(f);
			
			// Go through all matching elements
 			f.querySelectorAll(rule.selector).forEach(function(element) {
 				
 				_setHandler(element, _b);
 				
 				// apply to child nodes if needed.
				element.querySelectorAll("INPUT,TEXTAREA,SELECT").forEach(function(n) {
					_setHandler(n, _b, element);
				});
			});
 		}
		// run previous handler if any	
		if(_onApply) _onApply(f);		
	}
}();
