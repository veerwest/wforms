// Localization for FormAssembly.com / wForms v3.0
// 한국어 - November 20, 2009, 10:50 am
wFORMS.behaviors.validation.messages = {
	isRequired 		: "필수 입력 사항",
	isAlpha 		: "알파벳(a-z, A-Z)만 사용하실 수 있습니다. 숫자는 사용하실 수 없습니다.",
	isEmail 		: "존재하지 않는 이메일 주소입니다.",
	isInteger 		: "숫자를 입력하여 주시기 바랍니다 (소수점은 사용할 수 없습니다).",
	isFloat 		: "숫자를 입력하여 주시기 바랍니다 (예.1.9).",
	isAlphanum 		: "알파벳 또는 숫자를 사용해 주시기 바랍니다 [a-z 0-9].",
	isDate 			: "존재하지 않는 날짜입니다.",
	isPhone			: "존재하지 않는 전화번호입니다.",
	isCustom		: "유효한 내용을 입력하여 주시기 바랍니다.",
	notification_0	: "작성이 완료 되지 않았고, 아직 제출되지 않았습니다. %% 문제가 있습니다.",
	notification	: "작성이 완료 되지 않았고, 아직 제출되지 않았습니다. %% 문제들이 있습니다."
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "답변을 추가하여 주시기 바랍니다.",
	ADD_TITLE 		: "질문 또는 섹션을 중복으로 추가합니다.",
	REMOVE_CAPTION 	: "삭제",
	REMOVE_TITLE 	: "질문 또는 섹션을 삭제합니다."
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : '다음 페이지',
	CAPTION_PREVIOUS : '이전 페이지',
	CAPTION_UNLOAD	 : '페이지의 데이터는 저장되지 않았습니다.'
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

cfg.TITLE 				= '날짜 선택';
cfg.START_WEEKDAY 		= 1;
cfg.MONTHS_LONG			= [	'1월',
							'2월',
							'3월',
							'4월',
							'5월',
							'6월',
							'7월',
							'8월',
							'9월',
							'10월',
							'11월',
							'12월'
							];
cfg.WEEKDAYS_SHORT		= [ '일',
							'월',
							'화',
							'수',
							'목',
							'금',
							'토'
							];
cfg.MDY_DAY_POSITION 		= 1;
cfg.MDY_MONTH_POSITION 		= 2;
cfg.MDY_YEAR_POSITION		= 3;
cfg.DATE_FIELD_DELIMITER	= '/';
