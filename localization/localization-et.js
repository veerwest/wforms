// Localization for FormAssembly.com / wForms v3.0
// Eesti keel - March 5, 2009, 1:23 pm
wFORMS.behaviors.validation.messages = {
	isRequired 		: "See väli on vajatud.",
	isAlpha 		: "Tekst peab koosnema ainult tähtedest (a-y, A-Y). Numbrid ei ole lubatud.",
	isEmail 		: "See ei tundu olevat korralik e-maili aadress.",
	isInteger 		: "Palun sisesta number (ilma komakohtadeta).",
	isFloat 		: "Palun sisesta number (nt. 1.9)",
	isAlphanum 		: "Palun kasuta ainult tähti ja numbreid (a-y, 0-9).",
	isDate 			: "See ei tundu olevat korralik kuupäev.",
	isPhone			: "",
	isCustom		: "",
	notification_0	: "The form is not complete and has not been submitted yet. There is one problem with your submission.",
	notification	: "The form is not complete and has not been submitted yet. There are %% problems with your submission."
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Lisa veel üks vastus",
	ADD_TITLE 		: "",
	REMOVE_CAPTION 	: "Eemalda",
	REMOVE_TITLE 	: ""
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Järgmine lehekülg',
	CAPTION_PREVIOUS : 'Eelmine lehekülg',
	CAPTION_UNLOAD	 : ''
}


// Alpha Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlpha = function(element, value) {
	var reg =  /^[\u0041-\u007A\u00C0-\u00FF\u0100-\u017F]+$/;
	return this.isEmpty(value) || reg.test(value);
}
// Alphanumeric Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlphanum = function(element, value) {
	var reg =  /^[\u0030-\u0039\u0041-\u007A\u00C0-\u00FF\u0100-\u017F]+$/;
	return this.isEmpty(value) || reg.test(value);
}
