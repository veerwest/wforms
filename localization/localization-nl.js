// Localization for FormAssembly.com / wForms v3.2
// Nederlands - January 17, 2011, 4:24 pm
wFORMS.behaviors.validation.messages = {
	oneRequired 	: "Invullen van deze veld groep is verplicht.",
	isRequired 		: "Invullen van dit veld is verplicht.",
	isAlpha 		: "De tekst kan uitsluitend alfanumerieke tekens bevatten (a-z, A-Z). Cijfers zijn niet toegestaan.",
	isEmail 		: "Dit lijkt niet op een correct e-mailadres",
	isInteger 		: "Voer a.u.b. een geheel getal in.",
	isFloat 		: "A.u.b. alleen cijfers (0-9) zonder spaties ingeven",
	isAlphanum 		: "A.u.b. alleen alfanumerieke tekens (a-z, A-Z, 0-9) zonder spaties ingeven.",
	isDate 			: "Dit is geen correcte datum.",
	isPhone			: "Vul een juist telefoonnummer in.",
	isCustom		: "Vul een geldige waarde in.",
	notification_0	: "%% fout(en) ontdekt. Het formulier is nog niet verzonden. Controleer a.u.b. de informatie die is ingevoerd.",
	notification	: "%% fout(en) ontdekt. Het formulier is nog niet verzonden. Controleer a.u.b. de informatie die is ingevoerd.",
	isPasswordStrong: "Please choose a more secure password. Passwords must contain 8 or more characters, with at least 1 letter (a to z), 1 number (0 to 9), and 1 symbol (like \'%\', \'$\' or \'!\').",
	isPasswordMedium: "Kiest u svp een veiliger wachtwoord. Wachtwoorden moeten uit 4 of meer karakters bestaan met minimaal 1 letter (a-z) en 1 nummer (0-9)",
	isPasswordWeak  : "Het wachtwoord-veld mag niet leeg zijn",
	isPasswordConfirmed : "Uw wachtwoord en bevestiging komen niet overeen"
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Antwoord toevoegen",
	ADD_TITLE 		: "Voeg een rij toe",
	REMOVE_CAPTION 	: "Verwijderen",
	REMOVE_TITLE 	: "Verwijdert het voorgaande veld of veld groep."
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Volgende pagina',
	CAPTION_PREVIOUS : 'Vorige pagina',
	CAPTION_UNLOAD	 : 'Alle data van alle pagina\'s van dit formulier zullen verloren gaan'
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

cfg.TITLE 				= 'Kies een datum';
cfg.START_WEEKDAY 		= 1;
cfg.MONTHS_LONG			= [	'Januari',
							'Februari',
							'Maart',
							'April',
							'Mei',
							'Juni',
							'Juli',
							'Augustus',
							'September',
							'Oktober',
							'November',
							'December'
							];
cfg.WEEKDAYS_SHORT		= [ 'Zo',
							'Ma',
							'Di',
							'Wo',
							'Do',
							'Vr',
							'Za'
							];
cfg.MDY_DAY_POSITION 		= 1;
cfg.MDY_MONTH_POSITION 		= 2;
cfg.MDY_YEAR_POSITION		= 3;
cfg.DATE_FIELD_DELIMITER	= '/';


wFORMS.behaviors.validation.instance.prototype.validateDate = function(element, value) {
   if(this.isEmpty(value)){
       return true;
   }
 
   var cfg = wFORMS.helpers.calendar.locale;
   
   var re = /^(\d{1,2})[\/\.\-](\d{1,2})[\/\.\-](\d{2,4})$/
   if (re.test(value)) {
      var dArr = value.split(/[\/\.\-]/);
      
      var yr = dArr[cfg.MDY_YEAR_POSITION-1]; 
      if(yr.length==2) yr = (yr>50) ? '19'+yr : '20'+yr;
      var mo = parseInt(dArr[cfg.MDY_MONTH_POSITION-1],10); 
      var dy = parseInt(dArr[cfg.MDY_DAY_POSITION-1],10);
      var d = new Date(yr,mo-1,dy);
      return (d.getMonth() + 1 == mo && 
    		  d.getDate() == dy && 
    		  d.getFullYear() == yr);
   }
   else {
	  return false;
   }
}
