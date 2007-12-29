// Localization for wForms v3.0 - a javascript extension to web forms.
// LANGUAGE_HERE - July 19th 2006 - Thanks to AUTHOR_HERE

// This software is licensed under the CC-GNU LGPL <http://creativecommons.org/licenses/LGPL/2.1/>
//
// See http://formassembly.com/blog/how-to-localize-wforms/
// Example: 
// <head>...
// <script type="text/javascript" src="wforms.js" ></script>
// <script type="text/javascript" src="localization-XX.js" ></script>
// </head>

wFORMS.behaviors.validation.messages = {
	isRequired 		: "Pole jest wymagane! ",
	isAlpha 		: "Warto musi zawiera tylko litery z zakresu (a-z, A-Z). Liczby s niedozwolone.",
	isEmail 		: "To nie jest prawidowy adres email.",
	isInteger 		: "Prosz wprowadzi liczb cakowit.",
	isFloat 		: "Prosz wprowadzi liczb zmiennoprzecinkow (np. 1.9).",
	isAlphanum 		: "Warto musi zawiera tylko znaki alfanumeryczne [a-z 0-9].",
	isDate 			: "To nie jest prawidowa data. ",
	isCustom		: "",
	notification	: "Ilo wykrytych bdw: %%. Formularz nie zosta przesany.\nSprawd wartoci ktre podae."
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Dodaj wiersz",
	ADD_TITLE 		: "Powtarza poprzedzajce pole lub grup p.",
	REMOVE_CAPTION 	: "Usu",
	REMOVE_TITLE 	: "Usuwa poprzedzajce pole lub grup p."	
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Nastpna Strona',
	CAPTION_PREVIOUS : 'Poprzednia Strona'
}


// Alpha & Alphanumeric Input Validation: 
wFORMS.behaviors.validation.instance.prototype.validateAlpha = function(element, value) {
	// Basic Latin
	var reg =  /^[\u0041-\u007A\u00C0-\u00FF\u0100-\u017F]+$/;
	// Latin-1
	// var reg =  /^[\u0041-\u007A\u00C0-\u00FF]+$/;
	// Latin Extended-A
	// var reg =  /^[\u0041-\u007A\u00C0-\u00FF\u0100-\u017F]+$/;
	// See unicode range below for other languages
	
	return this.isEmpty(value) || reg.test(value);
}
wFORMS.behaviors.validation.instance.prototype.validateAlphanum = function(element, value) {
	// Basic Latin
	var reg =  /^[\u0030-\u0039\u0041-\u007A\u00C0-\u00FF\u0100-\u017F]+$/;
	// Latin-1
	// var reg = /^[\u0030-\u0039\u0041-\u007A\u00C0-\u00FF]+$/;
	// Latin Extended-A
	// var reg = /^[\u0030-\u0039\u0041-\u007A\u00C0-\u00FF\u0100-\u017F]+$/;
	// See unicode range below for other languages
	
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

