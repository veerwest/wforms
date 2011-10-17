// Localization for FormAssembly.com / wForms v3.0
// Čeština - May 14, 2009, 12:38 pm
wFORMS.behaviors.validation.messages = {
	isRequired 		: "Toto pole je povinné.",
	isAlpha 		: "Text musí obsahovat pouze písmena (a-z, A-Z). Čísla nejsou povolena.",
	isEmail 		: "Zdá se, že toto není správná emailová adresa.",
	isInteger 		: "Vložte prosím číslo (bez desetinných míst).",
	isFloat 		: "Vložte prosím číslo (tj. 1,9).",
	isAlphanum 		: "Použijte prosím pouze znaky písmen a číslic (a-z, 0-9).",
	isDate 			: "Zdá se, že toto nejsou platné datum.",
	isPhone			: "Zadejte platné číslo mobilního telefonu.",
	isCustom		: "zadejne platnou hodnotu.",
	notification_0	: "The form is not complete and has not been submitted yet. There is one problem with your submission.",
	notification	: "The form is not complete and has not been submitted yet. There are %% problems with your submission."
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Přidat další odpověď",
	ADD_TITLE 		: "Vytvořit kopii otázky (sekce)",
	REMOVE_CAPTION 	: "Odebrat",
	REMOVE_TITLE 	: "Odebrat otázku (sekci)"
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Další strana',
	CAPTION_PREVIOUS : 'Předchozí strana',
	CAPTION_UNLOAD	 : 'Všechny údaje, které jste do formuláře zadali, budou ztracena'
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

cfg.TITLE 				= 'Zvolte datum';
cfg.START_WEEKDAY 		= 1;
cfg.MONTHS_LONG			= [	'Leden',
							'Únor',
							'Březen',
							'Duben',
							'Květen',
							'Červen',
							'Červenec',
							'Srpen',
							'Září',
							'Říjen',
							'Listopad',
							'Prosinec'
							];
cfg.WEEKDAYS_SHORT		= [ 'Ne',
							'Po',
							'Út',
							'St',
							'Čt',
							'Pá',
							'So'
							];
cfg.MDY_DAY_POSITION 		= 1;
cfg.MDY_MONTH_POSITION 		= 2;
cfg.MDY_YEAR_POSITION		= 3;
cfg.DATE_FIELD_DELIMITER	= '/';
