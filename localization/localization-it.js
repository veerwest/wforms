// Localization for FormAssembly.com / wForms v3.0
// Italiano - November 1, 2009, 6:50 pm
wFORMS.behaviors.validation.messages = {
	isRequired 		: "Questo campo  è richiesto.",
	isAlpha 		: "Il testo deve contenere soltanto caratteri alfabetici. I numeri non sono ammessi.",
	isEmail 		: "Questo non è un indirizzo email valido.",
	isInteger 		: "Inserire un numero intero.",
	isFloat 		: "Inserire un numero reale (ad esempio 1,9).",
	isAlphanum 		: "ll testo devo contenere solo caratteri alfanumerici [a-z 0-9].",
	isDate 			: "Questa non sembra essere una data valida.",
	isPhone			: "Inserire un numero di telefono valido.",
	isCustom		: "Inserisci un valore valido",
	notification_0	: "Sono stati riscontrati %% errori. Il modulo non  è stato ancora inviato. Controllare le informazioni digitate.",
	notification	: "Sono stati riscontrati %% errori. Il modulo non è stato ancora inviato.\\nControllare le informazioni digitate."
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Aggiungi una riga",
	ADD_TITLE 		: "Ripete il campo o il gruppo di campi precedenti.",
	REMOVE_CAPTION 	: "Rimuovi",
	REMOVE_TITLE 	: "Rimuove il campo o il gruppo di campi precedenti."
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Prossima Pagina',
	CAPTION_PREVIOUS : 'Pagina Precedente',
	CAPTION_UNLOAD	 : 'Eventuali dati inseriti in qualsiasi pagina del presente modulo verranno persi'
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

cfg.TITLE 				= 'Seleziona la data';
cfg.START_WEEKDAY 		= 1;
cfg.MONTHS_LONG			= [	'Gennaio',
							'Febbraio',
							'Marzo',
							'Aprile',
							'Maggio',
							'Giugno',
							'Luglio',
							'Agosto',
							'Settembre',
							'Ottobre',
							'Novembre',
							'Dicembre'
							];
cfg.WEEKDAYS_SHORT		= [ 'Do',
							'Lu',
							'Ma',
							'Me',
							'Gi',
							'Ve',
							'Sa'
							];
cfg.MDY_DAY_POSITION 		= 1;
cfg.MDY_MONTH_POSITION 		= 2;
cfg.MDY_YEAR_POSITION		= 3;
cfg.DATE_FIELD_DELIMITER	= '/';
