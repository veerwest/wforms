/***
 *  wForms 3.0 - a javascript extension to web forms.
 * 
 *  Customization Script:
 *    custom validation
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
 * Handler for the 'switchOff' event.
 */
new function(_) {

	wFORMS.behaviors.validation.rules.isDateInTheFuture    = { selector: "#tfa_EstimatedConvers", check: 'validateDateInTheFuture' }
	wFORMS.behaviors.validation.messages.isDateInTheFuture = "This date cannot be in the past.";
	
	
	wFORMS.behaviors.validation.instance.prototype.validateDateInTheFuture = function(element, value) {			
		var testDate = new Date(value);
		var today = new Date();
		return (testDate.getTime() > today.getTime());
	}
}();
