/***
 *  wForms 3.0 - a javascript extension to web forms.
 * 
 *  Customization Script:
 *    custom validation isURL
 * 	custom validation isBetweenLimit
 * 
 *  wForms 3.0 uses base2 - copyright 2007 Dean Edwards 
***/
if (typeof(wFORMS) == "undefined") {
	throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
if (typeof(wFORMS.behaviors['validation']) == "undefined") {
	throw new Error("wFORMS validation behavior not found. This behavior depends on the wFORMS validation behavior.");
}


wFORMS.behaviors.validation.messages.isURL = "This is not a valid URL. Format is http://www.example.com";
wFORMS.behaviors.validation.rules.isURL = { selector: ".validate-url", check: 'isURL' };
wFORMS.behaviors.validation.instance.prototype.isURL = function(element, value) {
        var regexp = new RegExp("^(((ht|f)tp(s?))\://)?(www.|[a-zA-Z].)[a-zA-Z0-9\-\.]+\.(com|edu|gov|mil|net|org|biz|info|name|museum|us|ca|uk)(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\;\?\'\\\+&amp;%\$#\=~_\-]+))*$","i");
        return this.isEmpty(value) || regexp.test(value);
}

wFORMS.behaviors.validation.messages.isBetweenLimit = "This text length is incorrect.";
wFORMS.behaviors.validation.rules.isBetweenLimit = { selector: ".validate-between", check: 'isBetweenLimit' }
wFORMS.behaviors.validation.instance.prototype.isBetweenLimit = function(element, value) {
	var pattern = new RegExp(/validate-between [\d]*:[\d]*/i);
	var matches = element.className.match(pattern);
		if(matches[0]) {
			matches = matches[0].match(/(\d*):(\d*)/i);
			if(matches[1] && matches[2]){
				if(!((value.length >= matches[1]) && (value.length <= matches[2]))){
					wFORMS.behaviors.validation.messages.isBetweenLimit = "This text length is incorrect. Your text must be between "+matches[1]+" and "+matches[2]+" characters long.";
				return false;
				}
			}
		}
	return true;
}


//wFORMS.behaviors.validation.messages.isSame = "These values do not match.";
//wFORMS.behaviors.validation.rules.isSame = { selector: ".validate-between", check: 'isSame' }
//wFORMS.behaviors.validation.instance.prototype.isSame = function(element, value) {
//	var pattern = new RegExp(/validate-same:[\d]*/i);
//	var matches = element.className.match(pattern);
//		if(matches[0]) {
//			matches = matches[0].match(/(\d*):(\d*)/i);
//			if(matches[1] && matches[2]){
//				return ( (value.length >= matches[1]) && (value.length <= matches[2]) );
//			}
//		}
//	return true;
//}


function tfa_validate(idValue,newClass){
	base2.DOM.Element.addEventListener(document,'DOMContentLoaded',function(){
		var elem = base2.DOM.Element.querySelector(document,"#"+idValue);
		base2.DOM.HTMLElement.addClass(elem,newClass);
	});
}

