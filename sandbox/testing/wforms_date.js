(window.location.protocol == "https:") ? _HTTP="https://" : _HTTP="http://";
	
	//Store old onApply behavior for reuse.
	var _onApply      = wFORMS.behaviors.validation.instance.prototype.onApply;
	wFORMS.behaviors.validation.instance.prototype.onApply = function(){
		var forms=document.getElementsByTagName("FORM");
		for(i =0; i < forms.length; i++){
		base = base2.DOM.bind(forms[i]);
		if(base.querySelectorAll('.validate-date').length > 0)
			{
			//Generate list of js libraries to load	-	https://ajax.googleapis.com/ajax/libs/yui/
				Library = Array();
					Library.push(_HTTP+"ajax.googleapis.com/ajax/libs/yui/2.6.0/build/yahoo-dom-event/yahoo-dom-event.js"	);
					Library.push(_HTTP+"ajax.googleapis.com/ajax/libs/yui/2.6.0/build/calendar/calendar-min.js"	);
				
					Library.push("http://wforms.googlecode.com/svn/trunk/sandbox/testing/dates.js");
					
					wFORMS.helpers.ext_js.loaded = function(){global_init();};
					wFORMS.helpers.ext_js.add(Library);
					
					break;
			}
		}
		
		if(_onApply) _onApply.apply(this);
	}
	
	wFORMS.helpers.ext_js = {
		count : 0,
		loaded : ""
	}
	wFORMS.helpers.ext_js.add = function(array_url){
	base2.DOM.Element.forEach(array_url,function(url)
		{
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
