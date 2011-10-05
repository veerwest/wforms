// Localization for FormAssembly.com / wForms v3.0
// Türkçe - May 13, 2009, 3:23 pm
wFORMS.behaviors.validation.messages = {
	isRequired 		: "Bu alan zorunludur.",
	isAlpha 		: "Metin sadece alfabetik karakterleri (a-z, A-Z) kullanmalıdır. Rakamlar kullanılamaz.",
	isEmail 		: "Geçerli bir e-mail adresi olarak görünmüyor.",
	isInteger 		: "Lütfen bir tamsayı giriniz.",
	isFloat 		: "Lütfen bir sayı giriniz (Ör: 1.9).",
	isAlphanum 		: "Lütfen sadece alfanümerik karakterler kullanınız [a-z 0-9].",
	isDate 			: "Geçerli bir tarih olarak görünmüyor.",
	isPhone			: "Lütfen geçerli bir telefon numarası giriniz.",
	isCustom		: "Lütfen geçerli bir veri giriniz.",
	notification_0	: "The form is not complete and has not been submitted yet. There is one problem with your submission.",
	notification	: "The form is not complete and has not been submitted yet. There are %% problems with your submission."
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Başka bir yanıt ekle",
	ADD_TITLE 		: "Bu soruyu ya da bölümü kopyalar.",
	REMOVE_CAPTION 	: "Çıkar",
	REMOVE_TITLE 	: "Bu soruyu ya da bölümü çıkarır."
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Sonraki Sayfa',
	CAPTION_PREVIOUS : 'Önceki Sayfa',
	CAPTION_UNLOAD	 : 'Bu formdaki HERHANGİ BİR SAYFADAKİ girilen veriler KAYBOLACAKTIR'
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
cfg.MDY_DAY_POSITION 		= 1;
cfg.MDY_MONTH_POSITION 		= 2;
cfg.MDY_YEAR_POSITION		= 3;
cfg.DATE_FIELD_DELIMITER	= '/';
