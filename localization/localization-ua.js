// Localization for wForms - a javascript extension to web forms.
// Ukrainian v1.0 - April 16th 2008
// Translation by Vyacheslav Dzhura <www.dimensionforce.com.ua> (hoaxer@ukr.net)
// This software is licensed under the CC-GNU LGPL <http://creativecommons.org/licenses/LGPL/2.1/>

// Більше про локалізацю тут: http://formassembly.com/blog/how-to-localize-wforms/
// Цей файл повинен бути підключений *ПІСЛЯ* wforms.js 
// Приклад: 
// <head>...
// <script type="text/javascript" src="wforms.js" ></script>
// <script type="text/javascript" src="localization-ua.js" ></script>
// </head>

wFORMS.behaviors.validation.messages = {
	isRequired 		: "Це поле обов'язкове для заповнення. ",
	isAlpha 		: "В цьому полі повинні знаходитись лише літери (а-я, А-Я). Цифри не припустимі. ",
	isEmail 		: "Невірний формат адреси.",
	isInteger 		: "Будь-ласка, введіть ціле число.",
	isFloat 		: "Будь-ласка, введіть дробове число (наприклад, 1.9).",
	isAlphanum 		: "Будь-ласка, використовуйте лише цифро-буквенні символи [а-я 0-9].",
	isDate 			: "Невірний формат дати.",
	isCustom		: "",
	notification	: "Знайдено %% помилок! Форма не була відправлена.\nБудь-ласка, перевірте введену інформацію."
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Додати рядок",
	ADD_TITLE 		: "Скопіює це поле або секцію.",
	REMOVE_CAPTION 	: "Видалити",
	REMOVE_TITLE 	: "Видалить це поле або секцію."	
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Наступна сторінка',
	CAPTION_PREVIOUS : 'Попередня сторінка'
}


// Alpha & Alphanumeric Input Validation: 
wFORMS.behaviors.validation.instance.prototype.validateAlpha = function(element, value) {
	var reg = /^[\u0400-\u04FF]+$/;
	return this.isEmpty(value) || reg.test(value);
}
wFORMS.behaviors.validation.instance.prototype.validateAlphanum = function(element, value) {
	var reg = /^[\u0030-\u0039\u0400-\u04FF]+$/;
	return this.isEmpty(value) || reg.test(value);
}

// Unicode ranges (from http://www.unicode.org/) :
// \u0030-\u0039 : Numbers 0-9
// \u0041-\u007A : Basic Latin : For english, and ASCII only strings (ex: username, password, ..)
// \u00C0-\u00FF : Latin-1 : For Danish, Dutch, Faroese, Finnish, Flemish, German, Icelandic, Irish, Italian, Norwegian, Portuguese, Spanish, and Swedish.
// \u0100-\u017F : Latin Extended-A (to be used with Basic Latin and Latin-1) : Afrikaans, Basque, Breton, Catalan, Croatian, Czech, Esperanto, Estonian, French, Frisian, Greenlandic, Hungarian, Latin, Latvian, Lithuanian, Maltese, Polish, Proven�al, Rhaeto-Romanic, Romanian, Romany, Sami, Slovak, Slovenian, Sorbian, Turkish, Welsh, and many others.
// \u0180-\u024F : Latin Extended-B (to be used with Basic Latin and Latin-1) : ?
// \u1E00-\u1EFF : Latin Extended Additional : Vietnamese ?
// \u0370-\u03FF : Greek
// \u0400-\u04FF : Cyrillic : Russian, etc..
// \u0590-\u05FF : Hebrew (and #FB1D - #FB4F ?)
// \u0600-\u06FF : Arabic
// \u0900-\u097F : Devanagari : Hindi, etc..
// \u4E00-\u9FFF : Han - common ideographs : Chinese, Japanese, and Korean languages.
// See http://www.unicode.org/charts/ for other languages

