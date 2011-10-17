// Localization for FormAssembly.com / wForms v3.0
// بهاس ملايو [Bahasa Melayu] - September 25, 2009, 2:34 pm
wFORMS.behaviors.validation.messages = {
	isRequired 		: "Ruang ini mesti diisi.",
	isAlpha 		: "Teks ini mesti menggunakan abjad sahaja (a-z,A-Z).Nombor tidak dibenarkan.",
	isEmail 		: "Alamat emel ini tidak sah.",
	isInteger 		: "Sila isi nombor (tanpa tanda perpuluhan).",
	isFloat 		: "Sila isi nombor (cth: 1.9).",
	isAlphanum 		: "Sila gunakan abjad dan nombor sahaja [a-z 0-9].",
	isDate 			: "Tarikh ini tidak sah.",
	isPhone			: "Sila isi nombor telefon yang sah.",
	isCustom		: "Sila isi nilai yang betul.",
	notification_0	: "Borang ini belum sempurna dan tidak dihantar lagi. Ada %% masalah dengan submisi anda.",
	notification	: "Banyak daripada borang ini belum sempurna dan tidak dihantar lagi. Ada %% masalah dengan submisi anda."
}

wFORMS.behaviors.repeat.MESSAGES = {
	ADD_CAPTION 	: "Tambah jawapan lain",
	ADD_TITLE 		: "Akan menduakan soalan atau bahagian ini.",
	REMOVE_CAPTION 	: "Buang",
	REMOVE_TITLE 	: "Akan buang soalan atau bahagian ini."
}

wFORMS.behaviors.paging.MESSAGES = {
	CAPTION_NEXT 	 : 'Seterusnya',
	CAPTION_PREVIOUS : 'Sebelumnya',
	CAPTION_UNLOAD	 : 'Semua data yang diisi di MANA-MANA MUKASURAT di dalam borang akan HILANG'
}


// Alpha Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlpha = function(element, value) {
	var reg =  /^[\u0041-\u007A]+$/;
	return this.isEmpty(value) || reg.test(value);
}
// Alphanumeric Input Validation:
wFORMS.behaviors.validation.instance.prototype.validateAlphanum = function(element, value) {
	var reg =  /^[\u0030-\u0039\u0041-\u007A]+$/;
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

cfg.TITLE 				= 'Pilih satu tarikh';
cfg.START_WEEKDAY 		= 1;
cfg.MONTHS_LONG			= [	'Januari',
							'Februari',
							'Mac',
							'April',
							'Mei',
							'June',
							'Julai',
							'Ogos',
							'September',
							'Oktober',
							'November',
							'Disember'
							];
cfg.WEEKDAYS_SHORT		= [ 'Aha',
							'Isn',
							'Sel',
							'Rab',
							'Kha',
							'Jum',
							'Sab'
							];
cfg.MDY_DAY_POSITION 		= 1;
cfg.MDY_MONTH_POSITION 		= 2;
cfg.MDY_YEAR_POSITION		= 3;
cfg.DATE_FIELD_DELIMITER	= '/';
