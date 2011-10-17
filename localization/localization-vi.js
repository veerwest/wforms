// Localization for FormAssembly.com / wForms v3.0
// tiếng việt - September 22, 2009, 10:56 am
wFORMS.behaviors.validation.messages = {
	isRequired 		: "Hồ sơ này được yêu cầu",
	isAlpha 		: "Chỉ sử dụng những ký tự chữ trong văn bản (a-z, A-Z). Không được dùng số",
	isEmail 		: "Email này có thể không đúng",
	isInteger 		: "Xin hãy nhập vào một số nguyên",
	isFloat 		: "Xin hãy nhập vào một số lẻ",
	isAlphanum 		: "Xin hãy chỉ sử dụng các ký tự chữ và số [ a-z -0-9]",
	isDate 			: "Ngày không đúng\"",
	isPhone			: "Please enter a valid phone number.",
	isCustom		: "Please enter a valid value.",
	notification_0	: "Có lỗi. Thông tin chưa được gửi đi. Xin hãy xem lại những thông tin mà bạn đã điền",
	notification	: "Có lỗi. Thông tin chưa được gửi đi. Xin hãy xem lại những thông tin mà bạn đã điền"
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Cho them cau tra loi khac",
	ADD_TITLE 		: "Will duplicate this question or section.",
	REMOVE_CAPTION 	: "chuyen",
	REMOVE_TITLE 	: "Will remove this question or section"
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'trang sau',
	CAPTION_PREVIOUS : 'trang truoc',
	CAPTION_UNLOAD	 : 'Any data entered on ANY PAGE of this form will be LOST'
}


// Alpha Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlpha = function(element, value) {
	var reg =  /^[\u0041-\u007A\u00C0-\u00FF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF]+$/;
	return this.isEmpty(value) || reg.test(value);
}
// Alphanumeric Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlphanum = function(element, value) {
	var reg =  /^[\u0030-\u0039\u0041-\u007A\u00C0-\u00FF\u0100-\u017F\u0180-\u024F\u1E00-\u1EFF]+$/;
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
