// Localization for FormAssembly.com / wForms v3.0
// Polski - November 25, 2009, 11:22 pm
wFORMS.behaviors.validation.messages = {
	isRequired 		: "To pole jest wymagane.",
	isAlpha 		: "Tekst musi składać się tylko ze znaków alfabetycznych (a-z, A-Z). Cyfry są niedozwolone.",
	isEmail 		: "Podany adres jest nieprawidłowy.",
	isInteger 		: "Prosimy podać numer (bez ułamków).",
	isFloat 		: "Prosimy podać numer (np. 1.9).",
	isAlphanum 		: "Użyj tylko znaków alfa-numerycznych [a-z 0-9].",
	isDate 			: "Podana data jest nieprawidłowa.",
	isPhone			: "Proszę wprowadzić poprawny numer telefonu",
	isCustom		: "Proszę wprowadzić poprawną wartość",
	notification_0	: "%% błędów wykrytych. Twój formularz nie został wysłany. Prosimy o sprawdzenie podanych informacji.",
	notification	: "%% błędów wykrytych. Twój formularz nie został wysłany. Prosimy o sprawdzenie podanych informacji."
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Dodaj kolejną odpowiedź",
	ADD_TITLE 		: "Wykonaj duplikat tej sekcji lub zapytania",
	REMOVE_CAPTION 	: "Usuń",
	REMOVE_TITLE 	: "Przenieś tą sekcję lub zapytanie"
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Następna strona',
	CAPTION_PREVIOUS : 'Poprzednia strona',
	CAPTION_UNLOAD	 : 'Wprowadzone dane na każdej stronie tego formularza zostaną utracone'
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

cfg.TITLE 				= 'Wybierz date';
cfg.START_WEEKDAY 		= 1;
cfg.MONTHS_LONG			= [	'Styczeń',
							'Luty',
							'Marzec',
							'Kwiecień',
							'Maj',
							'Czerwiec',
							'Lipiec',
							'Sierpień',
							'Wrzesień',
							'Październik',
							'Listopad',
							'Grudzień'
							];
cfg.WEEKDAYS_SHORT		= [ 'Ni',
							'Po',
							'Wt',
							'Śr',
							'Cz',
							'Pi',
							'So'
							];
cfg.MDY_DAY_POSITION 		= 3;
cfg.MDY_MONTH_POSITION 		= 2;
cfg.MDY_YEAR_POSITION		= 1;
cfg.DATE_FIELD_DELIMITER	= '/';
