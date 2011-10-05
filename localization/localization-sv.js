// Localization for FormAssembly.com / wForms v3.0
// Svenska - April 13, 2009, 4:57 pm
wFORMS.behaviors.validation.messages = {
	isRequired 		: "Fältet måste fyllas i.",
	isAlpha 		: "Texten får endast innehålla bokstäver (a-z, A-Z). Siffror är inte tillåtna.",
	isEmail 		: "Detta ser inte ut som en giltig e-postadress.",
	isInteger 		: "Ange ett tal.",
	isFloat 		: "Ange ett decimaltal (t ex 1.9).",
	isAlphanum 		: "Endast alfanumeriska tecken tillåts (a-z 0-9).",
	isDate 			: "Detta ser inte ut som ett giltigt datum.",
	isPhone			: "Vänligen ange ett giltigt telefonnummer.",
	isCustom		: "Vänligen ange ett giltigt värde.",
	notification_0	: "The form is not complete and has not been submitted yet. There is one problem with your submission.",
	notification	: "The form is not complete and has not been submitted yet. There are %% problems with your submission."
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Lägg till ett svar",
	ADD_TITLE 		: "Duplicerar denna fråga eller sektion",
	REMOVE_CAPTION 	: "Ta bort",
	REMOVE_TITLE 	: "Tar bort denna fråga eller sektion"
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Nästa sida',
	CAPTION_PREVIOUS : 'Förra sidan',
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

cfg.TITLE 				= 'Select a date';
cfg.START_WEEKDAY 		= 1;
cfg.MONTHS_LONG			= [	'January',
							'February',
							'March',
							'April',
							'May',
							'June',
							'July',
							'August',
							'September',
							'October',
							'November',
							'December'
							];
cfg.WEEKDAYS_SHORT		= [ 'Su',
							'Mo',
							'Tu',
							'We',
							'Th',
							'Fr',
							'Sa'
							];
cfg.MDY_DAY_POSITION 		= 3;
cfg.MDY_MONTH_POSITION 		= 2;
cfg.MDY_YEAR_POSITION		= 1;
cfg.DATE_FIELD_DELIMITER	= '/';
