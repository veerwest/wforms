(window.location.protocol == "https:") ? _HTTP="https://" : _HTTP="http://";

	
	var _onApply      = wFORMS.behaviors.paging.instance.prototype.onApply;
	wFORMS.behaviors.validation.instance.prototype.onApply = function(){
		var forms=document.getElementsByTagName("FORM");
		for(i =0; i < forms.length; i++){
		base = base2.DOM.bind(forms[i]);
		if(base.querySelectorAll('.validate-date').length > 0)
			{
					wFORMS.helpers.ext_js(_HTTP+"ajax.googleapis.com/ajax/libs/yui/2.6.0/build/yahoo-dom-event/yahoo-dom-event.js"	);
					wFORMS.helpers.ext_js(_HTTP+"ajax.googleapis.com/ajax/libs/yui/2.6.0/build/calendar/calendar-min.js"	);
				
					wFORMS.helpers.ext_js("testing/dates_to.js");
					break;
			}
		}
		
		if(_onApply) _onApply.apply(this);
	}
	
	
	 wFORMS.helpers.ext_js = function(url){
		 var fileref=document.createElement('script');
			fileref.setAttribute("type","text/javascript");
			fileref.setAttribute("src", url);
	
		document.getElementsByTagName("head")[0].appendChild(fileref);
	}