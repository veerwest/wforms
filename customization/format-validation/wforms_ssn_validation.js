
wFORMS.behaviors.validation.rules.isValidSSN    = { selector: ".validate-ssn", check: 'validateSSN' }
wFORMS.behaviors.validation.messages.isValidSSN = "This is not a valid SSN";

// SSN validation method.
wFORMS.behaviors.validation.instance.prototype.validateSSN = function(element, value) {
	//strip - character from value
	var val = element.value;
	val = val.replace(/\-/g,'');
	
	if (Number(val) && val.length <= 9) {
		return true;
	} else {
		return false;
	}
}

// SSN formatting method, run only when validation passes.
// (see http://code.google.com/p/wforms/source/browse/trunk/wforms_validation.js#188)
wFORMS.behaviors.validation.rules.isValidSSN.pass = function(element) {
	
	// wForms set 'this' to the validation instance, so we can access the _keyPressed value stored by the live validation.
	if(this._keyPressed && this._keyPressed==8 /* backspace, see http://www.quirksmode.org/js/keys.htm */) {
		// skip reformatting if backspace is pressed.
		return;
	}
	
	//strip - character from value
	var value = element.value;
	value = value.replace(/\-/g,'');
	
	// replace - at the correct location
	if(value.length == 3){
		element.value= value.substr(0,3) + "-"; 
	} else if(value.length == 5 ){
		element.value= value.substr(0,3) + "-" + value.substr(3,2) + "-"; 
	} else if(value.length == 9){
		element.value= value.substr(0,3) + "-" + value.substr(3,2) + "-"+ value.substr(5,4); 
		element.blur(); 
	} 
}