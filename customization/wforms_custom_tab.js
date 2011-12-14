//Also include the CSS file wforms_custom_tab.css

if (typeof(wFORMS) == "undefined") {
	throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
if (typeof(wFORMS.behaviors['paging']) == "undefined") {
	throw new Error("wFORMS validation behavior not found. This behavior depends on the wFORMS paging behavior.");
}
if (typeof(wFORMS.behaviors['validation']) == "undefined") {
	throw new Error("wFORMS validation behavior not found. This behavior depends on the wFORMS validation behavior.");
}

wFORMS.behaviors.paging.CSS_PAGETAB	= 'wfPageTab';
wFORMS.behaviors.paging.CSS_TABS 	= 'wfTabs';
wFORMS.behaviors.paging.CSS_TABSID	= 'wfTabNav';
wFORMS.behaviors.paging.CSS_TABSCURRENT	= 'wfTabCurrentPage';
wFORMS.behaviors.paging.MESSAGES.TABS_LABEL = 'Page: ';
wFORMS.behaviors.paging.MESSAGES.TAB_LABEL = 'Page ';

if(!wFORMS.behaviors.paging.helpers){
	wFORMS.behaviors.paging.helpers = {};
}

/**
 *	Find the page the given element is associated with.
 */
wFORMS.behaviors.paging.helpers.findPage = function(e){
	if (e.className.match("wfPage") || e.className.match("wfCurrentPage")) {
		wFORMS.standardizeElement(e);
		return e;
	} else if (e.parentNode) {
		if (e.parentNode.className.match("wfPage") || e.parentNode.className.match("wfCurrentPage")) {
			wFORMS.standardizeElement(e.parentNode);
			return e.parentNode;
		} else {
			return wFORMS.behaviors.paging.helpers.findPage(e.parentNode);
		}
	} else {
		return null;
	}
}

/**
 * Executed once the behavior has been applied to the document.
 * Can be overwritten.
 */
wFORMS.behaviors.paging.instance.prototype.onApply = function() {}

/**
 * Move from one page to another without validation or other action.
 */
wFORMS.behaviors.paging.instance.prototype.jumpTo = function(i){
				var b = this;
				var index = i;
				
				if(b.currentPageIndex!=index) {	
					b.behavior.hidePage(b.behavior.getPageByIndex(b.currentPageIndex));
					b.setupManagedControls(index);
					b.behavior.showPage(b.behavior.getPageByIndex(index));
					b.currentPageIndex = index;
				}
				
				//If there's a page with an error, jump to that first.
			
				vInstance = wFORMS.getBehaviorInstance(b.target, 'validation');
				if(vInstance.errorPages && vInstance.errorPages[index] && !arguments[1]){
					var elem = document.getElementById(vInstance.errorPages[index][0]);
					if(elem.scrollIntoView) {
						//Fix for very stange rendering bug.  
						//Page would lock up in Chrome if scrollIntoView was called
						setTimeout(function(){elem.scrollIntoView();},1);
					}
				};
				
				this.onPageChange(this);
}

/**
 * Create a list of tabs to move users around the form.
 * Append into element e
 */
wFORMS.behaviors.paging.instance.prototype.generateTabs = function(e){

	var _b = this;
	var d = document.createElement('div');
	d.id = this.behavior.CSS_TABSID;
	d.style.fontSize="smaller";
	var d_text = document.createTextNode(this.behavior.MESSAGES.TABS_LABEL);
	d.appendChild(d_text);
	
	if(e){
		e.appendChild(d);
	}else{
		this.target.parentNode.insertBefore(d,this.target);
	}
	
	var pages = base2.DOM.Element.querySelectorAll(this.target,"."+this.behavior.CSS_PAGE+", ."+this.behavior.CSS_CURRENT_PAGE);
	pages.forEach(function(elem,i){
		var tab = document.createElement('a');
		tab.setAttribute("class",_b.behavior.CSS_TABS);
		tab.setAttribute("id",_b.behavior.CSS_PAGETAB+"_"+(i+1));
		tab.setAttribute("href","#");
		var label = base2.DOM.Element.querySelector(elem,'h3');
		var label_text = null;
		if(label){
		 label_text = label.innerText?label.innerText:label.textContent;
		}
		tab.setAttribute("title",label_text?label_text:_b.behavior.MESSAGES.TAB_LABEL+(i+1));
		
		var tab_text = document.createTextNode(i+1);
		tab.appendChild(tab_text);
		
		if(i<pages.length-1){
			var text = document.createTextNode(" | ");
		}
		base2.DOM.Element.addEventListener(tab,'click',function(){_b.jumpTo(i+1);});
		d.appendChild(tab);
		if(text){d.appendChild(text);}
	});
	
	this.onPageChange(this);
	
	return pages;
}

/** On submit advance the page instead, until the last page. */
wFORMS.behaviors.paging.instance.prototype.onSubmit = function (e, b) {
	if (!wFORMS.behaviors.paging.isLastPageIndex(b.currentPageIndex) && wFORMS.behaviors.paging.runValidationOnPageNext) {
		var currentPage = wFORMS.behaviors.paging.getPageByIndex(b.currentPageIndex);
		var nextPage = b.findNextPage(b.currentPageIndex);
		
		// validate and advance the page
		var v = wFORMS.getBehaviorInstance(b.target, 'validation');
		if (v.run(e, currentPage)) {
			b.activatePage(b.currentPageIndex + 1);
			
			// focus the first form element in the next page
			var first = base2.DOM.Element.querySelector(nextPage, 'input, textarea, select');
			if (first) {
				first.focus();
			}
		}
		
		e.stopPropagation();
		e.preventDefault();
		e.pagingStopPropagation = true;
	}
	else {
		if(window.onbeforeunload) {
			window.onbeforeunload = null;
		}
	
	}
}

wFORMS.behaviors.paging.instance.prototype.labelCurrentPageTab = function(p){
				_b = this;
 				currentIndex = this.currentPageIndex;
				base2.DOM.Element.querySelectorAll(this.target.parentNode,'a[id^="'+this.behavior.CSS_PAGETAB+'"]').forEach(function(i){
					if(!i.removeClass || !i.hasClass || !i.addClass){wFORMS.standardizeElement(i);}
					i.removeClass(_b.behavior.CSS_TABSCURRENT);
					if(i.getAttribute("id")==(_b.behavior.CSS_PAGETAB+"_"+currentIndex)){
					  i.addClass(_b.behavior.CSS_TABSCURRENT);
					}
				});	
}

/** 
 * instance-specific pageChange event handlers (can be overriden).
 * @param	{HTMLElement}	page element 
 */ 
 wFORMS.behaviors.paging.instance.prototype.onPageChange = function(p) {
				this.labelCurrentPageTab(p);
				this.behavior.onPageChange(p);
 }
 
 // End Paging extension
 
 
 
//Begin Validation extension
 
/**
 * Executes the behavior
 * @param {event} 		e 	(optional) 
 * @param {domElement} element
 * @return	{boolean}	true if validation successful, false otherwise (and prevents event propagation)
 */
wFORMS.behaviors.validation.instance.prototype.run = function(e, element) {
	
	// hack to stop to event propagation under paging
	if (e && e.pagingStopPropagation) {
		return false;
	}
	
	var _run = function(element) { 
		
		//Scope validation to currently visible page only if being called by a page button.
		//Otherwise, run full validation.
		if(e && e.pagingStopPropagation){
			// Workaround for apparent bug in querySelectorAll not being limited to descendants of 'element':
			// See bug #172 - Check if the element is not on the current page of a multi-page form			
			if(wFORMS.behaviors.paging && !wFORMS.behaviors.paging.isElementVisible(element)) {
				return;	
			}
		}
		
		// Do not validate elements that are switched off by the switch behavior
		if(_self.isSwitchedOff(element))
			return;			
		
		var	value = wFORMS.helpers.getFieldValue(element);	
		if(rule.check.call) {
			var passed = rule.check.call(_self, element, value);
		} else {
			var passed = _self[rule.check].call(_self, element, value);
		}				

        var errorMessage = ruleName;
        //Check range as well
        if(passed && rule.range_verifier !== undefined){
            var result = _self[rule.range_verifier].call( _self, element, value,
                wFORMS.behaviors.validation.messages[rule.range_error_message] );
            if( result !== true ){
                passed = false;
                if( result !== false ){
                    errorMessage = result;
                }
            }
        }

			if(!passed) { 
				if(!element.id) element.id = wFORMS.helpers.randomId();
				_self.elementsInError[element.id] = { id:element.id, rule: ruleName };
				_self.removeErrorMessage(element); 
				if(rule.fail) {
					// custom fail method
                rule.fail.call(_self, element, errorMessage);
				} else {
					// default fail method
                _self.fail.call(_self, element, errorMessage);
				} 					
				errorCount ++;
			} else {
				// If no previous rule has found an error on that field,
				// remove any error message from a previous validation run.
				if(!_self.elementsInError[element.id])
					_self.removeErrorMessage(element);
				
				if(rule.pass) {
 				// runs custom pass method. 
 				rule.pass.call(_self, element);
 			} else {
 				// default pass method
 				_self.pass.call(_self, element);
 			}	 			
		}
    };
	

 	var errorCount = 0;
 	this.elementsInError = {};
 	for (var ruleName in this.behavior.rules) {
 		var rule = this.behavior.rules[ruleName];
   		var _self = this;

		//Seems to be an IE9 issue with DOM.bind, switched to standardizeElement instead
		if(!element.matchesSelector)
			wFORMS.standardizeElement(element);
		if(!element.matchesSelector)
			element = base2.DOM.bind(element);	

		//Maybe move this to crossbrowser hacks?
		//IE9 doesn't implement Element.matchesSelector ... oh wait
		//yes it does, it just calls it msMatchesSelector
		if(!element.matchesSelector && element.msMatchesSelector)
			element.matchesSelector = element.msMatchesSelector;
		if(!element.matchesSelector && element.mozMatchesSelector)
			element.matchesSelector = element.mozMatchesSelector;
		if(!element.matchesSelector && element.webkitMatchesSelector)
			element.matchesSelector = element.webkitMatchesSelector;
		if(!element.matchesSelector)
			element.matchesSelector = base2.DOM.Element.matchesSelector;
			
		/* run validation if rule matches current element */
		if(element.matchesSelector(rule.selector)) { 
			_run(element);			
		}
		
		/* check descendant nodes and run validation on matching elements */
 		element.querySelectorAll(rule.selector).forEach(_run);
 	}
	
 	if(errorCount > 0) {
 		if(e) {
 			e.preventDefault?e.preventDefault():e.returnValue = false;
 		}
 		if(this.behavior.onFail) this.behavior.onFail(this, e);
 		return false;
 	}
 	if(this.behavior.onPass) this.behavior.onPass(this, e);
 	return true; 
} 


//End Validation extension















/*
 *	Extend error system
 */

/**
 * Display of validation error. Alert message + scroll into view of the first field in error.
 */
wFORMS.behaviors.validation.onFail = function(bInstance) {
	var m = wFORMS.behaviors.validation.messages.notification;
	var firstErrorId = null;
	var c = 0;
	for (var id in bInstance.elementsInError) {
		c++;
		if(!firstErrorId) 
			firstErrorId = id;
	}
	m = m.replace('%%', c);
	
	/*
	 * Let's break the individual error messages into their respective pages
	 * and save it into bInstance.errorPages for later use.
	 */
	if(wFORMS.behaviors.paging){
		bInstance.errorPages = new Array();
		for (var id in bInstance.elementsInError){
			var page = wFORMS.behaviors.paging.helpers.findPage(document.getElementById(id));
			var firstpage = null;
			if(page){
				var index = wFORMS.behaviors.paging.getPageIndex(page);
				if( typeof bInstance.errorPages[index] == 'object' ){
					bInstance.errorPages[index].push(id);
				}else{
					bInstance.errorPages[index] = new Array();
					bInstance.errorPages[index].push(id);
				}
			}
		}
	}
	
	var pInstance = wFORMS.getBehaviorInstance(bInstance.target,"paging");
	var elem = document.getElementById(firstErrorId);
	
	/*
	 * Let's find the first page, if any, where an error occurs in the form
	 * then the first error on that page and jump to it.
	 */
	if(wFORMS.behaviors.paging && !wFORMS.behaviors.paging.isElementVisible(elem)){
		var firstpage = null;
		//Find first page with error, if any.
		for(var i=0; i<bInstance.errorPages.length; i++){
			if(bInstance.errorPages[i] && bInstance.errorPages[i].length > 0){
				//Found first page with errors on it.
				firstpage = i;
				//Assume first error id in the page is the first visible error
				firstErrorId = bInstance.errorPages[i][0];
				elem = document.getElementById(firstErrorId);
				break;
			}
		}
		if(firstpage){
			//If a first error page is found, jump to it, 
			//so scroll into view should work
			pInstance.jumpTo(firstpage,true);
		}
	}
	
	if(elem.scrollIntoView) {
		elem.scrollIntoView();
	} else {
		location.hash="#"+firstErrorId;
	}	

	//Clear any errMsg on tabs, then add new ones for this validation cycle.
	var a = base2.DOM.Element.querySelectorAll(bInstance.target.parentNode,'a[id^="'+pInstance.behavior.CSS_PAGETAB+'"]');
	if(!a.forEach){a = base2.JavaScript.Array2(a);}
	a.forEach(function(i){
		if(!i.removeClass || !i.hasClass || !i.addClass){wFORMS.standardizeElement(i);}
		i.removeClass("errMsg");
	});	
	if(!bInstance.errorPages.forEach){bInstance.errorPages = base2.JavaScript.Array2(bInstance.errorPages);}
	bInstance.errorPages.forEach(function(id,index){
		var tab = base2.DOM.Element.querySelector(bInstance.target.parentNode,'#'+pInstance.behavior.CSS_PAGETAB+'_'+index);
		if(tab){
			if(!tab.addClass){wFORMS.standardizeElement(tab);}
			tab.addClass("errMsg");
		}
	});
	
	pInstance.onPageChange(pInstance);
	//
	
	alert(m);
}

wFORMS.behaviors.paging.runValidationOnPageNext=false;
wFORMS.behaviors.paging.instance.prototype.onApply = function(){
this.generateTabs();
};