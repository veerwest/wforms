/**
 *  wForms 3.0 - a javascript extension to web forms.
 * 
 *  Customization Script:
 *    Displays the number of errors at the top of the form
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



wFORMS.behaviors.validation.onFail = function(bInstance) {
	
	// Count errors and prepare message	
	var m = wFORMS.behaviors.validation.messages.notification;
	var c = 0;
	for (var id in bInstance.elementsInError) { c++; }
	m = m.replace('%%', c);
	
	// Remove any existing error message
	msgId = bInstance.target.id+'-ERR';
	var elem = document.getElementById(msgId);
	if(elem) {
		elem.parentNode.removeChild(elem);
	}
	
	// Insert error message
	var p = bInstance.target.insertBefore(document.createElement('DIV'),bInstance.target.firstChild);
	p.id = msgId;
	p.className = "errMsg";
	p.innerHTML = m;
	
	// scroll message into view	
	if(p.scrollIntoView) {	
		p.scrollIntoView();
	} else {
		location.hash="#"+msgId;
	}
		
}