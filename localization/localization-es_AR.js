// Localization for FormAssembly.com / wForms v3.0
// Español (de América) - November 20, 2009, 10:51 am
wFORMS.behaviors.validation.messages = {
	isRequired 		: "Campo Requerido",
	isAlpha 		: "Letras (a-z, A-Z) permitidas unicamente, numeros NO permitidos",
	isEmail 		: "Aparentemente no es una direccion de email valido",
	isInteger 		: "Por favor registra un numero (sin decimales)",
	isFloat 		: "Por favor registra un numero (p.e. 1.9)",
	isAlphanum 		: "Por favor usa caracteres alfanumericos (a-z, 0-9) unicamente",
	isDate 			: "Aparentemente no es un dato valido",
	isPhone			: "Por favor registra un numero telefonico correcto",
	isCustom		: "Por favor registra un valor valido",
	notification_0	: "El formulario no se completo y no ha sido enviado aun. El problema presenta este problema %%",
	notification	: "El formulario no se completo y no ha sido enviado aun. El problema presenta estos problemas %%"
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Agregar otra respuesta",
	ADD_TITLE 		: "Duplicar esta seccion o pregunta.",
	REMOVE_CAPTION 	: "Eliminar",
	REMOVE_TITLE 	: "Eliminar esta seccion o pregunta"
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Pagina Siguiente',
	CAPTION_PREVIOUS : 'Pagina Anterior',
	CAPTION_UNLOAD	 : 'Algun dato registrado en alguna pagina de este formulario se PERDIO'
}


// Alpha Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlpha = function(element, value) {
	var reg =  /^[a-zA-Z\s\u00C0-\u00FF]+$/;
	return this.isEmpty(value) || reg.test(value);
}
// Alphanumeric Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlphanum = function(element, value) {
	var reg =  /^[\u0030-\u0039a-zA-Z\s\u00C0-\u00FF]+$/;
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

cfg.TITLE 				= 'Seleccione una fecha';
cfg.START_WEEKDAY 		= 1;
cfg.MONTHS_LONG			= [	'Enero',
							'Febrero',
							'Marzo',
							'Abril',
							'Mayo',
							'Junio',
							'Julio',
							'Agosto',
							'Septiembre',
							'Octubre',
							'Noviembre',
							'Diciembre'
							];
cfg.WEEKDAYS_SHORT		= [ 'Do',
							'Lu',
							'Ma',
							'Mi',
							'Ju',
							'Vi',
							'Sa'
							];
cfg.MDY_DAY_POSITION 		= 1;
cfg.MDY_MONTH_POSITION 		= 2;
cfg.MDY_YEAR_POSITION		= 3;
cfg.DATE_FIELD_DELIMITER	= '/';
