// Localization for FormAssembly.com / wForms v3.0
// Lietuvių - September 14, 2009, 11:56 am
wFORMS.behaviors.validation.messages = {
	isRequired 		: "This field is required.",
	isAlpha 		: "The text must use alphabetic characters only (a-z, A-Z). Numbers are not allowed.",
	isEmail 		: "This does not appear to be a valid email address.",
	isInteger 		: "Please enter a number (without decimals).",
	isFloat 		: "Please enter a number (e.g. 1.9).",
	isAlphanum 		: "Please use alpha-numeric characters only [a-z 0-9].",
	isDate 			: "This does not appear to be a valid date.",
	isPhone			: "Please enter a valid phone number.",
	isCustom		: "Please enter a valid value.",
	notification_0	: "",
	notification	: ""
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Add another response",
	ADD_TITLE 		: "Will duplicate this question or section.",
	REMOVE_CAPTION 	: "Remove",
	REMOVE_TITLE 	: "Will remove this question or section"
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Kitas puslapis',
	CAPTION_PREVIOUS : 'Previous Page',
	CAPTION_UNLOAD	 : 'Any data entered on ANY PAGE of this form will be LOST'
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
