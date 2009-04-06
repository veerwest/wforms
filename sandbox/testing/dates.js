function global_init(){

//if(checkYahooLoaded()){			//Wait for IE to finish loading YAHOO library
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
				this.render();
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
	
		if(this.oDomContainer.style.display == "block") {
			this.hide();
		} else {
			this.show();
			var location = YAHOO.util.Dom.getRegion(this.oDomContainer.previousSibling.id);
			this.oDomContainer.style.left = (location[0] + (location.right - location.left)) + "px";
			this.oDomContainer.style.top =  (location[1]) + "px";
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
	function cal_init(){
	var forms=document.getElementsByTagName("FORM");
	
		for(i =0; i < forms.length; i++){
		base= base2.DOM.bind(forms[i]);
		var datesList = base.querySelectorAll('.validate-date');
		
			datesList.forEach(function(f){
		
				dateField = f;
				
				newdiv = document.createElement("div")
				newdiv.id = dateField.id+"_calContainer";

				dateField.parentNode.insertBefore( newdiv, dateField.nextSibling );

				if(wFORMS.helpers.calender && wFORMS.helpers.calender.title)
				{
					var title_name = wFORMS.helpers.calender.title;
				}else{
					var title_name = "Please select a date";
				}
			cal = new YAHOO.widget.Calendar("cal",newdiv.id, { title: title_name, close:true});
			YAHOO.formmanager.calendar.setLocale(cal);

		
			cal.selectEvent.subscribe(YAHOO.formmanager.calendar.handler, cal, true);
			cal.deselectEvent.subscribe(YAHOO.formmanager.calendar.handler, cal, true);
			cal.render();
			cal.hide();
			
			YAHOO.util.Event.addListener(dateField.id, "focus", YAHOO.formmanager.calendar.showCal, cal, true);
			YAHOO.formmanager.calendar.calendars_array.push(cal);
			});
			
		}
	}
	
	cal_init();
	//}else{setTimeout(global_init,500);}//Wait for IE to finish loading YAHOO library
	
	}
	
	function checkYahooLoaded(){
	
	if((typeof YAHOO) != "undefined"){
		if((typeof YAHOO.widget) != "undefined"){
			if((typeof YAHOO.widget.Calendar) != "undefined")
				{return true;}
		}
	}
	
	return false;
	}
	
	//global_init();