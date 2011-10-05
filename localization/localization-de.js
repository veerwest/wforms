// Localization for FormAssembly.com / wForms v3.0
// Deutsch - June 16, 2009, 6:21 pm
wFORMS.behaviors.validation.messages = {
	isRequired 		: "Dies ist ein Pflichtfeld.",
	isAlpha 		: "Der Text muss aus alphabetischen Zeichen (a-z, A-Z) bestehen. Nummern sind nicht erlaubt.",
	isEmail 		: "Dies darf nicht als gültige eMailadresse erscheinen.",
	isInteger 		: "Bitte geben Sie eine Nummer ein (ohne Dezimalstelle).",
	isFloat 		: "Bitte geben Sie eine Nummer ein (z.B. 1.9).",
	isAlphanum 		: "Bitte nur alphanumerische Zeichen benutzen (a-z, 0-9).",
	isDate 			: "Dies darf nicht als gültiges Datum erscheinen.",
	isPhone			: "Bitte eine gültige Telefonnummer eingeben.",
	isCustom		: "Bitte geben sie gültige Werte ein.",
	notification_0	: "%% Fehler entdeckt. Ihr Formular wurde bisher nicht eingereicht. Bitte prüfen Sie die Eingaben.",
	notification	: "%% Fehler entdeckt. Ihr Formular wurde bisher nicht eingereicht. Bitte prüfen Sie die Eingaben."
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Eine andere Antwort hinzufügen",
	ADD_TITLE 		: "Will duplicate this question or section.",
	REMOVE_CAPTION 	: "Entfernen",
	REMOVE_TITLE 	: "Will remove this question or section"
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Nächste Seite',
	CAPTION_PREVIOUS : 'Vorherige Seite',
	CAPTION_UNLOAD	 : 'Any data entered on ANY PAGE of this form will be LOST'
}


// Alpha Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlpha = function(element, value) {
	var reg =  /^[\u0041-\u007A\u00C0-\u00FF]+$/;
	return this.isEmpty(value) || reg.test(value);
}
// Alphanumeric Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlphanum = function(element, value) {
	var reg =  /^[\u0030-\u0039\u0041-\u007A\u00C0-\u00FF]+$/;
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

cfg.TITLE 				= 'Datum aussuchen';
cfg.START_WEEKDAY 		= 1;
cfg.MONTHS_LONG			= [	'Januar',
							'Februar',
							'März',
							'April',
							'Mai',
							'Juni',
							'Juli',
							'August',
							'September',
							'Oktober',
							'November',
							'Dezember'
							];
cfg.WEEKDAYS_SHORT		= [ 'So',
							'Mo',
							'Di',
							'Mi',
							'Do',
							'Fr',
							'Sa'
							];
cfg.MDY_DAY_POSITION 		= 1;
cfg.MDY_MONTH_POSITION 		= 2;
cfg.MDY_YEAR_POSITION		= 3;
cfg.DATE_FIELD_DELIMITER	= '/';
