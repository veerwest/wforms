// Localization for FormAssembly.com / wForms v3.0
// Român - November 11, 2009, 11:51 am
wFORMS.behaviors.validation.messages = {
	isRequired 		: "Completarea acestui camp este obligatorie.",
	isAlpha 		: "Textul introdus trebuie sa contina doar caractere alfabetice (literele alfabetului: a-z, A-Z). Numerele nu sunt permise.",
	isEmail 		: "Nu ati introdus o adresa de email valida.",
	isInteger 		: "Va rugam sa introduceti un numar intreg.",
	isFloat 		: "Va rugam sa introduceti un numar real (ex. 1,93).",
	isAlphanum 		: "Va rugam sa introduceti numai caractere alfa-numerice (litere de la \\\"a\\\" la \\\"z\\\" si cifre de la 0 la 9).",
	isDate 			: "Nu ati introdus data intr-un format corect.",
	isPhone			: "Va rugam introduceti un numar valid de telefon.",
	isCustom		: "Va rugam introduceti o valoare valida.",
	notification_0	: "A fost depistata o eroare la completarea formularului. Informatia nu a fost procesata. Va rugam sa corectati sau sa completati informatia furnizata .",
	notification	: "Au fost depistate erori la completarea formularului. Informatiile nu au fost procesate. Va rugam sa corectati sau sa completati informatia furnizata ."
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Adauga alta varianta de raspuns",
	ADD_TITLE 		: "Va duplica această întrebare sau secţiune.",
	REMOVE_CAPTION 	: "Sterge",
	REMOVE_TITLE 	: "Va sterge această întrebare sau secţiune"
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Pagina urmatoare',
	CAPTION_PREVIOUS : 'Pagina anterioara',
	CAPTION_UNLOAD	 : 'Orice informatie introdusa pana acum pe acest formular va fi pierduta.'
}


// Alpha Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlpha = function(element, value) {
	var reg =  /^[a-zA-Z\s\u00C0-\u00FF\u0100-\u017F]+$/;
	return this.isEmpty(value) || reg.test(value);
}
// Alphanumeric Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlphanum = function(element, value) {
	var reg =  /^[\u0030-\u0039a-zA-Z\s\u00C0-\u00FF\u0100-\u017F]+$/;
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

cfg.TITLE 				= 'Selecteaza o data.';
cfg.START_WEEKDAY 		= 1;
cfg.MONTHS_LONG			= [	'Ianuarie',
							'Februarie',
							'Martie',
							'Aprilie',
							'Mai',
							'Iunie',
							'Iulie',
							'August',
							'Septembrie',
							'Octombrie',
							'Noiembrie',
							'Decembrie'
							];
cfg.WEEKDAYS_SHORT		= [ 'Du',
							'Lu',
							'Ma',
							'Mi',
							'Jo',
							'Vi',
							'Sa'
							];
cfg.MDY_DAY_POSITION 		= 3;
cfg.MDY_MONTH_POSITION 		= 2;
cfg.MDY_YEAR_POSITION		= 1;
cfg.DATE_FIELD_DELIMITER	= '/';
