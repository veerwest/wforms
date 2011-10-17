// Localization for FormAssembly.com / wForms v3.0
// 日本語 [Japanese] - May 14, 2010, 3:43 pm
wFORMS.behaviors.validation.messages = {
	oneRequired 	: "このセクションは必須です",
	isRequired 		: "このフィールドは必須です",
	isAlpha 		: "英文字のみ可、数字は不可です",
	isEmail 		: "メールアドレスが正しくありません",
	isInteger 		: "番号を入力してください",
	isFloat 		: "番号を入力してください",
	isAlphanum 		: "英文字か数字を入力してください",
	isDate 			: "日付が正しくありません",
	isPhone			: "正しい電話番号を入力してください",
	isCustom		: "正しい値を入力してください",
	notification_0	: "まだ送信されていません",
	notification	: "まだ送信されていません"
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "別の回答を追加してください",
	ADD_TITLE 		: "この質問、またはセクションはコピーされます",
	REMOVE_CAPTION 	: "除去",
	REMOVE_TITLE 	: "この質問もしくはセクションを除去します"
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : '次のページへ',
	CAPTION_PREVIOUS : '前のページへ',
	CAPTION_UNLOAD	 : 'このフォームに入力したすべてのデータは失われます'
}


// Alpha Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlpha = function(element, value) {
	var reg =  /^[a-zA-Z\s\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]+$/;
	return this.isEmpty(value) || reg.test(value);
}
// Alphanumeric Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlphanum = function(element, value) {
	var reg =  /^[\u0030-\u0039a-zA-Z\s\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]+$/;
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

cfg.TITLE 				= '日付を選択';
cfg.START_WEEKDAY 		= 1;
cfg.MONTHS_LONG			= [	'１月',
							'２月',
							'３月',
							'４月',
							'５月',
							'６月',
							'７月',
							'８月',
							'９月',
							'１０月',
							'１１月',
							'１２月'
							];
cfg.WEEKDAYS_SHORT		= [ '日',
							'月',
							'火',
							'水',
							'木',
							'金',
							'土'
							];
cfg.MDY_DAY_POSITION 		= 1;
cfg.MDY_MONTH_POSITION 		= 2;
cfg.MDY_YEAR_POSITION		= 3;
cfg.DATE_FIELD_DELIMITER	= '/';
