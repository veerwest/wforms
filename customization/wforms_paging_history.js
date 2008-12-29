/***
 *  wForms 3.0 - a javascript extension to web forms.
 * 
 *  Customization Script:
 *    Support for browser's back/forward buttons in multi-page forms.
 * 
 * 
 *  wForms 3.0 uses base2 - copyright 2007 Dean Edwards 
***/

if (typeof(wFORMS) == "undefined") {
	throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
if (typeof(wFORMS.behaviors['paging']) == "undefined") {
	throw new Error("wFORMS paging behavior not found. This behavior depends on the wFORMS paging behavior.");
}



/**
 *
 */
new function(_) {
	
	var _ready = false;
	var _b	   = null; // local reference to paging behavior instance
	
	// Load YUI history manager 
	document.write('<script type="text/javascript" src="http://yui.yahooapis.com/2.6.0/build/yahoo/yahoo-min.js"></script>');
	document.write('<script type="text/javascript" src="http://yui.yahooapis.com/2.6.0/build/event/event-min.js"></script>');
	document.write('<script type="text/javascript" src="http://yui.yahooapis.com/2.6.0/build/history/history-min.js"></script>');

	// Prepare YUI history markup
	function _insertYUIHistoryMarkup() {

		// Add hidden field 
		var hfield  = document.createElement('INPUT');
		hfield.id   = "yui-history-field";
		hfield.type = "hidden";
		
		document.getElementsByTagName('BODY')[0].insertBefore(hfield, document.body.firstChild)

		// create an iframe with a dummy but valid resource (IE only)
		
		/*@cc_on
			// use the first image as the dummy resource, if any 
			// (best dummy resource for the iframe since no request is needed to retrieve it).  		
			var img = document.getElementsByTagName('IMG');
			if(img && img[0] && img[0].src) {
				var src = img[0].src;
			} 
			// use the current page otherwise (a guaranteed valid resource for the iframe)
			else {
				var src = document.location;
			}
			
			// Create the iframe and hide it.
			var iframe = document.createElement('IFRAME');
			iframe.src = src;
			iframe.id  = 'yui-history-iframe';
			
			iframe.style.visibility = 'hidden';
			iframe.style.position = 'absolute';
			iframe.style.top  = 0;
			iframe.style.left = 0;
			iframe.style.width  = '1px';
			iframe.style.height = '1px';
			
			document.getElementsByTagName('BODY')[0].insertBefore(iframe, document.body.firstChild)						
		@*/

	}
		
	// Preserve existing wForms handlers
	var _onPageChange = wFORMS.behaviors.paging.instance.prototype.onPageChange;
	var _onApply   	  = wFORMS.behaviors.paging.instance.prototype.onApply;
		
	// Initialize YUI history
	wFORMS.behaviors.paging.instance.prototype.onApply = function() {
		
		_insertYUIHistoryMarkup();	
		
		var state = YAHOO.util.History.getBookmarkedState("wfPage") || '1'; 			
		YAHOO.util.History.register("wfPage", state, _historyChangeHandler); 
				
		try {
			YAHOO.util.History.initialize("yui-history-field", "yui-history-iframe");
		} catch(x) {
			// browser not supported
		} 						

		// uncomment if jump to bookmarked page is needed
		/*
		YAHOO.util.History.onReady(function () { 		    
		    _b.activatePage(YAHOO.util.History.getCurrentState("wfPage"),true);		 
		}); 
		*/
		
		// run previous handler if any	
		if(_onApply) _onApply.apply(this);
		
		// keep reference to behavior
		_b = this;
		
		_ready = true;
	}
		
	
	// Update history when changing page.	
	wFORMS.behaviors.paging.instance.prototype.onPageChange = function(p) {
		
		if(_ready) {
			YAHOO.util.History.navigate("wfPage", wFORMS.behaviors.paging.getPageIndex(p).toString());
		}
		// run previous handler if any	
		if(_onPageChange) _onPageChange.apply(this,[p]);		
	}	
	
	
	// Detect history change and go to corresponding page
	function _historyChangeHandler(pageIndex) {
		_b.activatePage(pageIndex,true);		
	}
		
}();
