// Localization for wForms v3.0 - a javascript extension to web forms.
// Farsi / Persian - Sept. 19th 2007 - Thanks to Hadi Farnoud

// This software is licensed under the CC-GNU LGPL <http://creativecommons.org/licenses/LGPL/2.1/>
//
// See http://formassembly.com/blog/how-to-localize-wforms/
// Example: 
// <head>...
// <script type="text/javascript" src="wforms.js" ></script>
// <script type="text/javascript" src="localization-fa.js" ></script>
// </head>

wFORMS.behaviors.validation.messages = {
	isRequired 		: "این فیلد ضروری است",
	isAlpha 		: "متن باید فقط حروف باشد.عدد مجاز نیست",
	isEmail 		: "این آدرس به نظر معتبر نمی آید",
	isInteger 		: "لطفا عدد وارد کنید",
	isFloat 		: "لطفا عدد اعشاری وارد کنید",
	isAlphanum 		: "لطفا فقط از عدد و حروف استفاده کنید",
	isDate 			: "به نظر یک تاریخ معتبر نمی آید",
	isCustom		: "This value is invalid",
	notification	: "%% خطا(ها) پیدا شد.فرم شما فرستاده نشد.لطفا اطلاعات وارد شده را چک کنی"	
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "یک پاسخ دیگر",
	ADD_TITLE 		: "",
	REMOVE_CAPTION 	: "حذف",
	REMOVE_TITLE 	: ""	
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'بعدی',
	CAPTION_PREVIOUS : 'قبلی'
}


// Alpha & Alphanumeric Input Validation: 
wFORMS.behaviors.validation.instance.prototype.validateAlpha = function(element, value) {
	var reg =  /^[\u0600-\u06FF]+$/;
	return this.isEmpty(value) || reg.test(value);
}
wFORMS.behaviors.validation.instance.prototype.validateAlphanum = function(element, value) {
	var reg =  /^[\u0030-\u0039\u0600-\u06FF]+$/;
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

