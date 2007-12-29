// Localization for wForms v3.0 - a javascript extension to web forms.
// Afrikaans - July 19th 2006 - Thanks to Arno Esterhuizen
// This software is licensed under the CC-GNU LGPL <http://creativecommons.org/licenses/LGPL/2.1/>
//
// See http://formassembly.com/blog/how-to-localize-wforms/
// Example: 
// <head>...
// <script type="text/javascript" src="wforms.js" ></script>
// <script type="text/javascript" src="localization-af.js" ></script>
// </head>

wFORMS.behaviors.validation.messages = {
	isRequired 		: "Hierdie veld is verpligtend.",
	isAlpha 		: "Die teks moet slegs alfabetiese karakters gebruik (a-z, A-Z). Syfers word nie toegelaat nie.",
	isEmail 		: "Hierdie blyk nie 'n geldige eposadres te wees nie.",
	isInteger 		: "Voer asseblief 'n heelgetal in.",
	isFloat 		: "Voer asseblief 'n wisselpuntgetal in (bv 1.9).",
	isAlphanum 		: "Gebruik asseblief slegs alfa-numeriese karakters [a-z 0-9].",
	isDate 			: "Hierdie blyk nie 'n geldige datum te wees nie.",
	isCustom		: "Please enter a valid value.",
	notification	: "%% foute opgespoor. Jou vorm is nognie ingestuur nie.\nGaan asseblief die inligting wat jy ingevoer het na."
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Voeg nog 'n antwoord by",
	ADD_TITLE 		: "Sal hierdie vraag of afdeling herhaal.",
	REMOVE_CAPTION 	: "Verwyder",
	REMOVE_TITLE 	: "Sal hierdie vraag of afdeling verwyder."	
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Volgende Bladsy',
	CAPTION_PREVIOUS : 'Vorige Bladsy'
}


// Alpha & Alphanumeric Input Validation: 
wFORMS.behaviors.validation.instance.prototype.validateAlpha = function(element, value) {
	var reg =  /^[\u0041-\u007A\u00C0-\u00FF\u0100-\u017F]+$/;
	return this.isEmpty(value) || reg.test(value);
}
wFORMS.behaviors.validation.instance.prototype.validateAlphanum = function(element, value) {
	var reg = /^[\u0030-\u0039\u0041-\u007A\u00C0-\u00FF\u0100-\u017F]+$/;
	return this.isEmpty(value) || reg.test(value);
}

// Unused translations:
// Weak Passord: Onveilige wagwoord. Jou wagwoord behoort tussen 4 en 12 karakters lank te wees en 'n kombinasie van hoofletters en kleinletters wees.

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
