new function(_) {

	if(!wFORMS.helpers.calendar) {wFORMS.helpers.calendar = {}};
	var _HTTP = '';

	(window.location.protocol == "https:") ? _HTTP="https://" : _HTTP="http://";
	
	if(wFORMS.behaviors.validation) {
		//Store old onApply behavior for reuse.	
		var _onApply = wFORMS.behaviors.validation.instance.prototype.onApply;
				 
		wFORMS.behaviors.validation.rules.isDate.selector  = ".validate-date, .validate-datecal";
				
		wFORMS.behaviors.validation.instance.prototype.onApply = function(){
		
			var	Library = Array();
			Library.push(_HTTP+"ajax.googleapis.com/ajax/libs/yui/2.6.0/build/yahoo-dom-event/yahoo-dom-event.js" );
			Library.push(_HTTP+"ajax.googleapis.com/ajax/libs/yui/2.6.0/build/calendar/calendar-min.js"	);
			
			wFORMS.helpers.ext_js.loaded = function(){wFORMS.helpers.calendar.calendar_init();};
			wFORMS.helpers.ext_js.add(Library);		

			if(_onApply) _onApply.apply(this);
		}
	}
		
	if(!wFORMS.helpers.ext_js) {
		
		wFORMS.helpers.ext_js = {
			count : 0,
			loaded : ""
		}
		
		wFORMS.helpers.ext_js.add = function(array_url){
			
			for(var i=0;i<array_url.length;i++) {
				
				var fileref=document.createElement('script');
					fileref.setAttribute("type","text/javascript");
					fileref.setAttribute("src", array_url[i]);
			
				document.getElementsByTagName("head")[0].appendChild(fileref);
				wFORMS.helpers.ext_js.count = wFORMS.helpers.ext_js.count+1;
												
				if(navigator.userAgent.search(/MSIE/) != -1 ){		//IE hack
					base2.DOM.Element.addEventListener(fileref,"readystatechange",
						function(){if(this.readyState == 'loaded' || this.readyState == 'complete'){wFORMS.helpers.ext_js.remove();}});
				}else{
					base2.DOM.Element.addEventListener(fileref,"load",wFORMS.helpers.ext_js.remove);
				}
			}
			
			var fileref=document.createElement('link');
			fileref.setAttribute("type","text/css");
			fileref.setAttribute("rel","stylesheet");
			fileref.setAttribute("href", _HTTP+"app.formassembly.com/wForms/3.0/css/wforms_calendar.css");
		
			document.getElementsByTagName("head")[0].appendChild(fileref);
		
		}
		wFORMS.helpers.ext_js.remove = function(){
			wFORMS.helpers.ext_js.count = wFORMS.helpers.ext_js.count-1;
			
			if(wFORMS.helpers.ext_js.count <= 0){
					wFORMS.helpers.ext_js.loaded();
			}
		}
	}	

	wFORMS.helpers.calendar.calendar_init = function(){
	
		YAHOO.namespace("formmanager.calendar");
		
		YAHOO.formmanager.calendar.handler = function(type,args,cal) {
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
					cal._targetField.value = selectedDate;
					this.hide();
				}
			}
			else if(type=='deselect') {			
					cal._targetField.value = "";
			}
		};
		
		YAHOO.formmanager.calendar.today   = new Date();
		YAHOO.formmanager.calendar.mindate = (YAHOO.formmanager.calendar.today.getMonth()+1) + "/" + YAHOO.formmanager.calendar.today.getDate() + "/" + YAHOO.formmanager.calendar.today.getFullYear();
		
		YAHOO.formmanager.calendar.showCal = function (e, cal) {
			if(!e.target){e.target = e.srcElement;};	//Clean IE's weird nomenclature
		
			var field  = e.target;
			cal._targetField = field;
			var caldiv = cal.oDomContainer;
	
			caldiv.style.display='block';
			var fp = wFORMS.helpers.position(field);
			var cp = wFORMS.helpers.position(caldiv);
			
			var diff = {
				left: fp.left - cp.left + 10,
				top: fp.top - cp.top
			};
			caldiv.style.left = caldiv.offsetLeft + diff.left + field.offsetWidth +'px';
			caldiv.style.top = caldiv.offsetTop + diff.top +'px';
									
			this.show();
		}
	
		YAHOO.formmanager.calendar.hideCal = function (e,f) {
			if(f.over_cal == false){
				f._targetField = null;
				f.hide();
			}
		}
		
		YAHOO.formmanager.calendar.setLocale = function(cal) {
			if(wFORMS.helpers.calendar && wFORMS.helpers.calendar.locale){
				for(property in wFORMS.helpers.calendar.locale){
					cal.cfg.setProperty(property, wFORMS.helpers.calendar.locale[property]); 
				}
			}
		}
	
		
		wFORMS.helpers.calendar.cal_init = function(){
			var forms=document.getElementsByTagName("FORM");
		
			for(i =0; i < forms.length; i++){
			
				if(!forms[i].querySelectorAll) {
					base = base2.DOM.bind(forms[i]);
				}
				var newdiv = document.createElement("div")
				newdiv.id = forms[i].id+"_calContainer";
				forms[i].appendChild(newdiv);
					
				if(wFORMS.helpers.calendar && wFORMS.helpers.calendar.title)
				{
					var title_name = wFORMS.helpers.calendar.title;
				}else{
					var title_name = "Please select a date";
				}
	
				var cal = new YAHOO.widget.Calendar("cal",newdiv.id, { title: title_name, close:true});
				YAHOO.formmanager.calendar.setLocale(cal);
	
				cal.selectEvent.subscribe(YAHOO.formmanager.calendar.handler, cal, true);
				cal.deselectEvent.subscribe(YAHOO.formmanager.calendar.handler, cal, true);
				cal.render();
				cal.hide();
				cal.over_cal = false;
				
				YAHOO.util.Event.addListener(cal.containerId, "mouseover", function(){this.over_cal = true;},cal,true);
				YAHOO.util.Event.addListener(cal.containerId, "mouseout", function(){this.over_cal = false;},cal,true);
				
				var datesList = forms[i].querySelectorAll('.validate-datecal');
				
				datesList.forEach(function(f){
					YAHOO.util.Event.addListener(f.id, "focus", YAHOO.formmanager.calendar.showCal, cal, true);
					YAHOO.util.Event.addListener(f.id, "blur", YAHOO.formmanager.calendar.hideCal, cal, true);
				});			
			}
		}
		
		wFORMS.helpers.calendar.cal_init();
	}

}();