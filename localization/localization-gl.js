// Localization for FormAssembly.com / wForms v3.0
// Galego - June 8, 2009, 9:45 am
wFORMS.behaviors.validation.messages = {
	isRequired 		: "Campo obrigatorio.",
	isAlpha 		: "Só admítense letras (a-z A-Z). Non se permiten números.",
	isEmail 		: "Non é unha dirección de correo válida.",
	isInteger 		: "Introduza un valor numérico.",
	isFloat 		: "Introduza un valor decimal (ex: 1.9) .",
	isAlphanum 		: "Únicamente caracteres alfanuméricos (a-z 0-9).",
	isDate 			: "A data non é correcta",
	isPhone			: "Por favor verifique o formato do número",
	isCustom		: "Por favor ingrese un dato válido",
	notification_0	: "The form is not complete and has not been submitted yet. There is one problem with your submission.",
	notification	: "The form is not complete and has not been submitted yet. There are %% problems with your submission."
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Engadir outra resposta",
	ADD_TITLE 		: "Repite o campo ou grupo anterior.",
	REMOVE_CAPTION 	: "Eliminar",
	REMOVE_TITLE 	: "Borra o campo ou grupo anterior."
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Páxina seguinte',
	CAPTION_PREVIOUS : 'Páxina anterior',
	CAPTION_UNLOAD	 : 'Calquera dato ingresado nalgunha páxina deste formulario perderase'
}


// Alpha Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlpha = function(element, value) {
	var reg =  /^[\u0041-\u007A]+$/;
	return this.isEmpty(value) || reg.test(value);
}
// Alphanumeric Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlphanum = function(element, value) {
	var reg =  /^[\u0030-\u0039\u0041-\u007A]+$/;
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

cfg.TITLE 				= 'Seleccione unha data';
cfg.START_WEEKDAY 		= 1;
cfg.MONTHS_LONG			= [	'xaneiro',
							'febreiro',
							'marzo',
							'abril',
							'maio',
							'xuño',
							'xullo',
							'agosto',
							'setembro',
							'outubro',
							'novembro',
							'decembro'
							];
cfg.WEEKDAYS_SHORT		= [ 'Do',
							'Lu',
							'Ma',
							'Me',
							'Xo',
							'Ve',
							'Sa'
							];
cfg.MDY_DAY_POSITION 		= 2;
cfg.MDY_MONTH_POSITION 		= 1;
cfg.MDY_YEAR_POSITION		= 3;
cfg.DATE_FIELD_DELIMITER	= '/';
