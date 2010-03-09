new function(_) {
	
	if(typeof YAHOO == 'undefined') { return false; }
	
	if(!wFORMS.helpers.calendar) {wFORMS.helpers.calendar = {}};
	wFORMS.helpers.calendar.alreadyApplied = false;
    
	//Store old onApply behavior for reuse.	
	var _onApply = wFORMS.behaviors.validation.instance.prototype.onApply;
    
	if(wFORMS.behaviors.validation) {
    
		wFORMS.behaviors.validation.rules.isDate.selector  = ".validate-date, .validate-datecal";
				
		wFORMS.behaviors.validation.instance.prototype.onApply = function(){
	
	        if(wFORMS.helpers.calendar.alreadyApplied == false){        //Ensure init is run only once
	            wFORMS.helpers.calendar.calendar_init();        
	            wFORMS.helpers.calendar.alreadyApplied = true;
	        }
	        
			if(_onApply) _onApply.apply(this);
		}
	}
    
	if(wFORMS.behaviors.repeat) {
		var _onRepeat = wFORMS.behaviors.repeat.onRepeat;	
    
		wFORMS.behaviors.repeat.onRepeat = function(e){
			if(_onRepeat) _onRepeat.apply(e);
        
            cal = wFORMS.helpers.calendar.instance[wFORMS.helpers.calendar.instance.length-1];
                
			var datesList = base2.DOM.Element.querySelectorAll(e,'.validate-datecal');
			datesList.forEach(function(f){
				YAHOO.util.Event.addListener(f.id, "focus", YAHOO.formmanager.calendar.showCal, cal, true);
				YAHOO.util.Event.addListener(f.id, "blur", YAHOO.formmanager.calendar.hideCal, cal, true);
			});      
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
			this.hide();
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
			var forms=base2.DOM.Element.querySelectorAll(document,'.wForm form');
        
			for(i =0; i < forms.length; i++){
            
				if(!forms.item(i).querySelectorAll) {
					base = base2.DOM.bind(forms[i]);
				}
				var newdiv = document.createElement("div")
				newdiv.id = forms.item(i).id+"_calContainer";
				forms.item(i).appendChild(newdiv);
					
				if(wFORMS.helpers.calendar && wFORMS.helpers.calendar.title)
				{
					var title_name = wFORMS.helpers.calendar.title;
				}else{
					var title_name = "Please select a date";
				}
	
			if(!(wFORMS.helpers.calendar.instance)){
                wFORMS.helpers.calendar.instance = new Array();
			}

            var cal = new YAHOO.widget.Calendar("cal",newdiv.id, { title: title_name, close:true});
            wFORMS.helpers.calendar.instance.push(cal);
            cal = wFORMS.helpers.calendar.instance[wFORMS.helpers.calendar.instance.length-1];
				YAHOO.formmanager.calendar.setLocale(cal);
	
				cal.selectEvent.subscribe(YAHOO.formmanager.calendar.handler, cal, true);
				cal.deselectEvent.subscribe(YAHOO.formmanager.calendar.handler, cal, true);
                cal.render();
				cal.hide();
				cal.over_cal = false;
				
				YAHOO.util.Event.addListener(cal.containerId, "mouseover", function(){this.over_cal = true;},cal,true);
				YAHOO.util.Event.addListener(cal.containerId, "mouseout", function(){this.over_cal = false;},cal,true);
				
				var datesList = base2.DOM.Element.querySelectorAll(forms.item(i),'.validate-datecal');
				datesList.forEach(function(f){
					YAHOO.util.Event.addListener(f.id, "focus", YAHOO.formmanager.calendar.showCal, cal, true);
					YAHOO.util.Event.addListener(f.id, "blur", YAHOO.formmanager.calendar.hideCal, cal, true);
				});
			}
		}      
        wFORMS.helpers.calendar.cal_init();
	}
}();