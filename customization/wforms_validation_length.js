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


wFORMS.behaviors.validation.rules.isUnderLimit   = { selector: ".validate-length", check: 'isUnderLimit' }
wFORMS.behaviors.validation.messages.isUnderLimit = "This text is too long.";


wFORMS.behaviors.validation.instance.prototype.isUnderLimit = function(element, value) {
	
	var pattern = new RegExp("\.validate-length (\d*)/([gi]*)");
	var matches = element.className.match(pattern);	
	if(matches && matches[0]) {										
		return (value.length <= matches[0]);		
	}	
	return true;
	
}
