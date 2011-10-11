// Localization for FormAssembly.com / wForms v3.0
// 中文 (简体) [Simplified Chinese] - October 26, 2009, 11:38 am
wFORMS.behaviors.validation.messages = {
	isRequired 		: "必填栏。",
	isAlpha 		: "文字必须只使用字母（a-z, A-Z），不能使用数字。",
	isEmail 		: "这是不正确的 email 地址。",
	isInteger 		: "请输入一个数字（不能带小数点）。",
	isFloat 		: "请输入一个数字（例如：1、9）。",
	isAlphanum 		: "只使用字母－数字字符 [a-z ，0-9]。",
	isDate 			: "日期不正确。",
	isPhone			: "请输入有效的电话号码。",
	isCustom		: "请输入有效数据。",
	notification_0	: "检测到 %% 个错误，您的表单没有填写完整，并且未被提交。请检查您所提供的资料。",
	notification	: "检测到 %% 个错误，您的表单没有填写完整，并且未被提交。请检查您所提供的资料。"
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "请添加另外一条反馈",
	ADD_TITLE 		: "将会重复该问题（或该部分）。",
	REMOVE_CAPTION 	: "删除",
	REMOVE_TITLE 	: "将会删除该问题（或该部分）。"
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : '下一页',
	CAPTION_PREVIOUS : '上一页',
	CAPTION_UNLOAD	 : '在这个表单中，输入到任何页面中的所有数据都将丢失。'
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

cfg.TITLE 				= '请选择日期';
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
cfg.WEEKDAYS_SHORT		= [ '星期日',
							'星期一',
							'星期二',
							'星期三',
							'星期四',
							'星期五',
							'星期六'
							];
cfg.MDY_DAY_POSITION 		= 1;
cfg.MDY_MONTH_POSITION 		= 2;
cfg.MDY_YEAR_POSITION		= 3;
cfg.DATE_FIELD_DELIMITER	= '/';
