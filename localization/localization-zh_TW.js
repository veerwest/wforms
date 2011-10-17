// Localization for FormAssembly.com / wForms v3.0
// 正體中文 (繁體) [Traditional Chinese] - November 1, 2009, 6:57 pm
wFORMS.behaviors.validation.messages = {
	isRequired 		: "此為必填欄位。",
	isAlpha 		: "只可輸入英文字母（a-z, A-Z）。請勿輸入數字。",
	isEmail 		: "您輸入的電子郵件地址有誤。",
	isInteger 		: "請輸入數字（不要有小數點位數）。",
	isFloat 		: "請輸入數字（例如1.9 ）。",
	isAlphanum 		: "請輸入英文字母與數字 [a-z, 0-9 ] 。",
	isDate 			: "此非有效日期。",
	isPhone			: "請輸入有效的電話號碼。",
	isCustom		: "請輸入有效的數值。",
	notification_0	: "表格未填完，因此無法送出。 您送出的表格有 ％ ％問題。",
	notification	: "表格未填完，因此無法送出。 您送出的表格有 ％ ％問題。"
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "新增另一個表格",
	ADD_TITLE 		: "系統將複製此問題或段落。",
	REMOVE_CAPTION 	: "刪除",
	REMOVE_TITLE 	: "系統將刪除此問題或段落"
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : '下一頁',
	CAPTION_PREVIOUS : '上一頁',
	CAPTION_UNLOAD	 : '表格中填寫的所有資料將全部消失'
}


// Alpha Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlpha = function(element, value) {
	var reg =  /^[a-zA-Z\s\u4E00-\u9FFF]+$/;
	return this.isEmpty(value) || reg.test(value);
}
// Alphanumeric Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlphanum = function(element, value) {
	var reg =  /^[\u0030-\u0039a-zA-Z\s\u4E00-\u9FFF]+$/;
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

cfg.TITLE 				= '選擇日期';
cfg.START_WEEKDAY 		= 0;
cfg.MONTHS_LONG			= [	'一月',
							'二月',
							'三月',
							'四月',
							'五月',
							'六月',
							'七月',
							'八月',
							'九月',
							'十月',
							'十一月',
							'十二月'
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
