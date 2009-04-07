new function(_) {

	var _HTTP = '';

	(window.location.protocol == "https:") ? _HTTP="https://" : _HTTP="http://";
	
	if(wFORMS.behaviors.validation) {
		//Store old onApply behavior for reuse.	
		var _onApply = wFORMS.behaviors.validation.instance.prototype.onApply;
			
		wFORMS.behaviors.validation.instance.prototype.onApply = function(){
			var forms=document.getElementsByTagName("FORM");
			for(i =0; i < forms.length; i++){
				base = base2.DOM.bind(forms[i]);
				if(base.querySelectorAll('.validate-date').length > 0)
					{
					//Generate list of js libraries to load	-	https://ajax.googleapis.com/ajax/libs/yui/
					var	Library = Array();
					Library.push(_HTTP+"ajax.googleapis.com/ajax/libs/yui/2.6.0/build/yahoo-dom-event/yahoo-dom-event.js"	);
					Library.push(_HTTP+"ajax.googleapis.com/ajax/libs/yui/2.6.0/build/calendar/calendar-min.js"	);
					
					wFORMS.helpers.ext_js.loaded = function(){wFORMS.helpers.calender.calender_init();};
					wFORMS.helpers.ext_js.add(Library);
					
					break;
				}
			}		
			if(_onApply) _onApply.apply(this);
		}
	}
		
	if(!wFORMS.helpers.ext_js) {
		
		wFORMS.helpers.ext_js = {
			count : 0,
			loaded : ""
		}
		
		wFORMS.helpers.ext_js.add = function(array_url){
			base2.DOM.Element.forEach(array_url,function(url) {
				var fileref=document.createElement('script');
					fileref.setAttribute("type","text/javascript");
					fileref.setAttribute("src", url);
			
				document.getElementsByTagName("head")[0].appendChild(fileref);
				wFORMS.helpers.ext_js.count = wFORMS.helpers.ext_js.count+1;
			
					base2.DOM.Element.addEventListener(fileref,"load",wFORMS.helpers.ext_js.remove);
					base2.DOM.Element.addEventListener(fileref,"readystatechange",wFORMS.helpers.ext_js.remove);
			});
		}
		wFORMS.helpers.ext_js.remove = function(){
			if(this.readyState){	//IE Hack
				if(this.readyState == 'loaded' || this.readyState == 'complete'){
					wFORMS.helpers.ext_js.count = wFORMS.helpers.ext_js.count-1;
				}
			}else{
				wFORMS.helpers.ext_js.count = wFORMS.helpers.ext_js.count-1;
			}
			
		if(wFORMS.helpers.ext_js.count == 0){
			wFORMS.helpers.ext_js.loaded();
		}
	}
}	

	wFORMS.helpers.calender.calender_init = function(){

	YAHOO.namespace("formmanager.calendar");
	
	YAHOO.formmanager.calendar.handler = function(type,args,obj) {
		if(type=='select') {	
			var dates = this.getSelectedDates();
			if(dates){
				//var selectedDate = (dates[0].getMonth()+1) + "/" + dates[0].getDate() + "/" + dates[0].getFullYear();
				var selectedDateArray = Array();
				selectedDateArray[this.Locale.MDY_DAY_POSITION-1] = dates[0].getDate();
				selectedDateArray[this.Locale.MDY_MONTH_POSITION-1] = dates[0].getMonth()+1;
				selectedDateArray[this.Locale.MDY_YEAR_POSITION-1] = dates[0].getFullYear();
				var seperator = 	this.Locale.DATE_FIELD_DELIMITER;
				
				
				var selectedDate = selectedDateArray.join(seperator);
				document.getElementById(this.oDomContainer.previousSibling.id).value = selectedDate;
				this.hide();
			}
		}
		else if(type=='deselect') {			
				document.getElementById(this.oDomContainer.previousSibling.id).value = "";
		}
	};
	
	YAHOO.formmanager.calendar.today   = new Date();
	YAHOO.formmanager.calendar.mindate = (YAHOO.formmanager.calendar.today.getMonth()+1) + "/" + YAHOO.formmanager.calendar.today.getDate() + "/" + YAHOO.formmanager.calendar.today.getFullYear();
	
	YAHOO.formmanager.calendar.showCal = function (e,f) {
	//Clear any other open calenders
		for(var i=0; i< YAHOO.formmanager.calendar.calendars_array.length; i++)
		{
			if(YAHOO.formmanager.calendar.calendars_array[i] != f)
				YAHOO.formmanager.calendar.calendars_array[i].hide();
		}

		var location = YAHOO.util.Dom.getRegion(this.oDomContainer.previousSibling.id);
		this.oDomContainer.style.left = (location[0] + (location.right - location.left)) + "px";
		this.oDomContainer.style.top =  (location[1]) + "px";
	this.show();
	}

	YAHOO.formmanager.calendar.hideCal = function (e,f) {
		if(f.over_cal == false){
			f.hide();
		}
	}
	
	YAHOO.formmanager.calendar.setLocale = function(cal) {
		if(wFORMS.helpers.calender && wFORMS.helpers.calender.locale){
			for(property in wFORMS.helpers.calender.locale){
				if(cal.Locale[property]){
					cal.Locale[property] = wFORMS.helpers.calender.locale[property];
				}
			}
		}
	}

	
	YAHOO.formmanager.calendar.calendars_array = Array();
	wFORMS.helpers.calender.cal_init = function(){
		
		var forms=document.getElementsByTagName("FORM");
	
		for(i =0; i < forms.length; i++){
		base= base2.DOM.bind(forms[i]);
		var datesList = base.querySelectorAll('.validate-date');
		
			datesList.forEach(function(f){
		
				var dateField = f;
				
				var newdiv = document.createElement("div")
				newdiv.id = dateField.id+"_calContainer";

				dateField.parentNode.insertBefore( newdiv, dateField.nextSibling );

				if(wFORMS.helpers.calender && wFORMS.helpers.calender.title)
				{
					var title_name = wFORMS.helpers.calender.title;
				}else{
					var title_name = "Please select a date";
				}
			var cal = new YAHOO.widget.Calendar("cal",newdiv.id, { title: title_name, close:true});
			YAHOO.formmanager.calendar.setLocale(cal);

		
			cal.selectEvent.subscribe(YAHOO.formmanager.calendar.handler, cal, true);
			cal.deselectEvent.subscribe(YAHOO.formmanager.calendar.handler, cal, true);
			cal.render();
			cal.hide();
			
			YAHOO.util.Event.addListener(dateField.id, "focus", YAHOO.formmanager.calendar.showCal, cal, true);
			YAHOO.util.Event.addListener(dateField.id, "blur", YAHOO.formmanager.calendar.hideCal, cal, true);
					
					cal.over_cal = false;
			YAHOO.util.Event.addListener(cal.containerId, "mouseover", function(){this.over_cal = true;},cal,true);
			YAHOO.util.Event.addListener(cal.containerId, "mouseout", function(){this.over_cal = false;},cal,true);
			YAHOO.formmanager.calendar.calendars_array.push(cal);
			});
			
		}
	}
	
	wFORMS.helpers.calender.cal_init();
}

}();