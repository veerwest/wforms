// Localization for FormAssembly.com / wForms v3.0
// עברית - November 1, 2009, 6:32 pm
wFORMS.behaviors.validation.messages = {
	isRequired 		: "שדה זה הינו הכרחי",
	isAlpha 		: "הטקסט חייב להיות אותיות בלבד (א-ת). מספרים אינם מותרים",
	isEmail 		: "הכתובת שהוזנה אינה כתובת דואל חוקית",
	isInteger 		: "אנא הכנס מספר",
	isFloat 		: "אנא הכנס שבר",
	isAlphanum 		: "אנא הכנס טקטס בלבד - מספרים או אותיות",
	isDate 			: "הנתונים שהוכנסו אינם חוקים",
	isPhone			: "אנא הכנס מספר טלפון קיים",
	isCustom		: "אנא הכנס ערך אמיתי",
	notification_0	: "הטופס לא מולא כראוי עד סופו ועדיין לא נשלח.יש כ%% טעויות בהזנה",
	notification	: "הטופס לא מולא כראוי עד סופו ועדיין לא נשלח.יש כ%% טעויות בהזנה"
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "הוסף תגובה נוספת",
	ADD_TITLE 		: "יעתיק שנית את השאלה או הנתון",
	REMOVE_CAPTION 	: "הסר",
	REMOVE_TITLE 	: "יסיר את השאלה או הנתון"
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'דף הבא',
	CAPTION_PREVIOUS : 'דף קודם',
	CAPTION_UNLOAD	 : 'המידע שהזנת לא ישמר'
}


// Alpha Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlpha = function(element, value) {
	var reg =  /^[a-zA-Z\s\u0590-\u05FF]+$/;
	return this.isEmpty(value) || reg.test(value);
}
// Alphanumeric Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlphanum = function(element, value) {
	var reg =  /^[\u0030-\u0039a-zA-Z\s\u0590-\u05FF]+$/;
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

cfg.TITLE 				= 'בחר תאריך';
cfg.START_WEEKDAY 		= 1;
cfg.MONTHS_LONG			= [	'ינואר',
							'פברואר',
							'מרץ',
							'אפריל',
							'מאי',
							'יוני',
							'יולי',
							'אוגוסט',
							'ספטמבר',
							'אוקטובר',
							'נובמבר',
							'דצמבר'
							];
cfg.WEEKDAYS_SHORT		= [ 'א\'',
							'ב\'',
							'ג\'',
							'ד\'',
							'ה\'',
							'ו\'',
							'ש\''
							];
cfg.MDY_DAY_POSITION 		= 1;
cfg.MDY_MONTH_POSITION 		= 2;
cfg.MDY_YEAR_POSITION		= 3;
cfg.DATE_FIELD_DELIMITER	= '/';
