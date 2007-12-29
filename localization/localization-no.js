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
	isRequired 		: "Dette feltet er obligatorisk.",
	isAlpha 		: "Teksten m&Atilde;&yen; kun best&Atilde;&yen; av bokstaver (a-z, A-Z). Tall er ikke lov.",
	isEmail 		: "Dette ser ut som du ikke har lagt til en gyldig epostadresse.",
	isInteger 		: "Vennligst fyll ut.",
	isFloat 		: "Vennligst fyll inn f.eks 1.0",
	isAlphanum 		: "Vennligst kun bruk sm&Atilde;&yen; bokstaver og tall",
	isDate 			: "Dette er ikke en gyldig dato ",
	isCustom		: "",
	notification	: "%% feil ble oppdaget. Skjemaet har enda ikke blitt sendt.\nVennligst sjekk informasjonen du har angitt."
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Legg til ekstra felt",
	ADD_TITLE 		: "",
	REMOVE_CAPTION 	: "Fjern",
	REMOVE_TITLE 	: ""	
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Neste side',
	CAPTION_PREVIOUS : 'Forrige side'
}


// Alpha & Alphanumeric Input Validation: 
wFORMS.behaviors.validation.instance.prototype.validateAlpha = function(element, value) {
	// Basic Latin
	var reg =  /^[\u0041-\u007A\u00C0-\u00FF]+$/;
	// Latin-1
	// var reg =  /^[\u0041-\u007A\u00C0-\u00FF]+$/;
	// Latin Extended-A
	// var reg =  /^[\u0041-\u007A\u00C0-\u00FF\u0100-\u017F]+$/;
	// See unicode range below for other languages
	
	return this.isEmpty(value) || reg.test(value);
}
wFORMS.behaviors.validation.instance.prototype.validateAlphanum = function(element, value) {
	// Basic Latin
	var reg =  /^[\u0030-\u0039\u0041-\u007A\u00C0-\u00FF]+$/;
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

