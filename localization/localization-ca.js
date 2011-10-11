// Localization for FormAssembly.com / wForms v3.0
// català-valencià - May 1, 2009, 12:12 pm
wFORMS.behaviors.validation.messages = {
	isRequired 		: "Aquest camp és obligatori.",
	isAlpha 		: "No introduïu xifres en els camps de text (a-z).",
	isEmail 		: "L’adreça de correu no és vàlida.",
	isInteger 		: "Introduïu un nombre enter (p. ex. 3).",
	isFloat 		: "Introduïu un nombre decimal (p. ex. 1,9) .",
	isAlphanum 		: "Introduïu únicament caràcters alfanumèrics (a-z i 0-9).",
	isDate 			: "La data no és correcta.",
	isPhone			: "Introduïu un número de telèfon vàlid",
	isCustom		: "Introduïu un valor vàlid",
	notification_0	: "The form is not complete and has not been submitted yet. There is one problem with your submission.",
	notification	: "The form is not complete and has not been submitted yet. There are %% problems with your submission."
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Afegeix una altra fila. ",
	ADD_TITLE 		: "Repiteix el camp o el grup anterior. ",
	REMOVE_CAPTION 	: "Suprimeix",
	REMOVE_TITLE 	: "Suprimeix el camp o el grup anterior."	
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Pàgina següent',
	CAPTION_PREVIOUS : 'Pàgina anterior',
	CAPTION_UNLOAD	 : 'Tot les dades introduïdes en QUALSEVOL PÀGINA d\'aquest formulari es PERDRÀN'
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

// Calendar
if(!wFORMS.helpers.calendar) {
	wFORMS.helpers.calendar = {};
}
if(!wFORMS.helpers.calendar.locale) {
	wFORMS.helpers.calendar.locale = {};
}
var cfg = wFORMS.helpers.calendar.locale;

cfg.TITLE 				= 'Selecciona una data';
cfg.START_WEEKDAY 		= 1;
cfg.MONTHS_LONG			= [	'Gener',
							'Febrer',
							'Març',
							'Abril',
							'Maig',
							'Juny',
							'Juliol',
							'Agost',
							'Setembre',
							'Octubre',
							'Novembre',
							'Desembre'
							];
cfg.WEEKDAYS_SHORT		= [ 'Dg',
							'Dl',
							'Dm',
							'Dc',
							'Dj',
							'Dv',
							'Ds'
							];
cfg.MDY_DAY_POSITION 		= 2;
cfg.MDY_MONTH_POSITION 		= 1;
cfg.MDY_YEAR_POSITION		= 3;
cfg.DATE_FIELD_DELIMITER	= '/';
