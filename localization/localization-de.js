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
	isRequired 		: "Diese Eingabe ist Pflicht.",
	isAlpha 		: "Geben Sie bitte nur Buchstaben (a-z, A-Z) ein. Zahlen sind nicht erlaubt.",
	isEmail 		: "Geben Sie bitte eine gltige Emailadresse ein.",
	isInteger 		: "Geben Sie bitte eine ganze Zahl ein.",
	isFloat 		: "Geben Sie bitte eine Zahl ein (z.B 1.9).",
	isAlphanum 		: "Geben Sie bitte alphanumerische Zeichen ein (a-z, 0-9).",
	isDate 			: "Geben Sie bitte ein gltiges Datum ein.",
	isCustom		: "",
	notification	: "%% Fehler entdeckt. Das Formular wurde noch nicht abgeschickt.\nBitte prfen Sie ihre Eingaben."
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Zeile hinzufgen",
	ADD_TITLE 		: "Wiederholt das vorherige Feld oder die Gruppe von Feldern.",
	REMOVE_CAPTION 	: "Entfernen",
	REMOVE_TITLE 	: "Entfernen des vorstehenden Felds bzw. der vorstehenden Gruppe von Feldern."	
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Nchste Seite',
	CAPTION_PREVIOUS : 'Vorherige Seite'
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

