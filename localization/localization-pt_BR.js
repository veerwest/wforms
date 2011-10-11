// Localization for FormAssembly.com / wForms v3.0
// Português (do Brasil) - June 18, 2009, 8:49 pm
wFORMS.behaviors.validation.messages = {
	isRequired 		: "Este campo é obrigatório.",
	isAlpha 		: "O texto deve usar apenas caracteres alfabéticos (a-z, A-Z). Números não são permitidos.",
	isEmail 		: "Este não é um endereço do e-mail válido.",
	isInteger 		: "Por favor entre um número inteiro.",
	isFloat 		: "Por favor entre um número decimal (1,9).",
	isAlphanum 		: "Somente alfanuméricos (a-z, 0-9)",
	isDate 			: "Data inválida.",
	isPhone			: "Por favor coloque um telefone válido.",
	isCustom		: "Por favor coloque um valor válido.",
	notification_0	: "Erro(s) detectado(s). Seu formulário ainda no foi submetido. Por favor, verifique o(s) dado(s) informado(s).",
	notification	: "Erro(s) detectado(s). Seu formulário ainda no foi submetido. Por favor, verifique o(s) dado(s) informado(s)."
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Adicionar mais dados",
	ADD_TITLE 		: "Repetir o campo ou o grupo.",
	REMOVE_CAPTION 	: "Remover",
	REMOVE_TITLE 	: "Remover o campo ou o grupo."
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Próxima Página',
	CAPTION_PREVIOUS : 'Página Anterior',
	CAPTION_UNLOAD	 : 'Todos os dados serão perdidos!'
}


// Alpha Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlpha = function(element, value) {
	var reg =  /^[\u0041-\u007A\u00C0-\u00FF]+$/;
	return this.isEmpty(value) || reg.test(value);
}
// Alphanumeric Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlphanum = function(element, value) {
	var reg =  /^[\u0030-\u0039\u0041-\u007A\u00C0-\u00FF]+$/;
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

cfg.TITLE 				= 'Selecione uma data:';
cfg.START_WEEKDAY 		= 1;
cfg.MONTHS_LONG			= [	'Janeiro',
							'Fevereiro',
							'Março',
							'Abril',
							'Maio',
							'Junho',
							'Julho',
							'Agosto',
							'Setembro',
							'Outubro',
							'Novembro',
							'Dezembro'
							];
cfg.WEEKDAYS_SHORT		= [ 'Dom',
							'Seg',
							'Ter',
							'Qua',
							'Qui',
							'Sex',
							'Sab'
							];
cfg.MDY_DAY_POSITION 		= 1;
cfg.MDY_MONTH_POSITION 		= 2;
cfg.MDY_YEAR_POSITION		= 3;
cfg.DATE_FIELD_DELIMITER	= '/';
