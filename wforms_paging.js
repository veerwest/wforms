
if (typeof(wFORMS) == "undefined") {
	throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
/**
 * wForms paging behavior. 
 * See: http://www.formassembly.com/blog/the-pagination-behavior-explained/
 */
wFORMS.behaviors.paging = {

	/**
	 * Selector expression for catching elements
     * @final
     * @see	http://www.w3.org/TR/css3-selectors/
	 */
	SELECTOR : '.wfPage',

	/**
	 * CSS class indicates page
     * @final
	 */
	CSS_PAGE : 'wfPage',

	/**
	 * CSS class for current page
     * @final
	 */
	CSS_CURRENT_PAGE : 'wfCurrentPage',

	/**
	 * CSS class for next button
     * @final
	 */
	CSS_BUTTON_NEXT : 'wfPageNextButton',

	/**
	 * CSS class for next button
     * @final
	 */
	CSS_BUTTON_PREVIOUS : 'wfPagePreviousButton',
	
	/**
	 * CSS class for the div contains the previous/next buttons
     * @final
	 */
	CSS_BUTTON_PLACEHOLDER : 'wfPagingButtons',
	
	/**
	 * ID prefix for the next buttons
     * @final
	 */
	ID_BUTTON_NEXT_PREFIX : 'wfPageNextId',

	/**
	 * ID prefix for the previos buttons
     * @final
	 */
	ID_BUTTON_PREVIOUS_PREFIX : 'wfPagePreviousId',

	/**
	 * CSS class for hidden submit button
     * @final
	 */
	CSS_SUBMIT_HIDDEN : 'wfHideSubmit',

	/**
	 * ID attribute prefix for page area
     * @final
	 */
	ID_PAGE_PREFIX	: 'wfPgIndex-',

	/**
	 * ID attribute suffix for prev/next buttons placeholder
     * @final
	 */
	ID_PLACEHOLDER_SUFFIX : '-buttons',

	/**
	 * Attribute indicates index of the page button should activate
     * @final
	 */
	ATTR_INDEX : 'wfPageIndex_activate',

	/**
	 * Custom messages used for creating links
     * @final
	 */
	MESSAGES : {
		CAPTION_NEXT : 'Next Page',
		CAPTION_PREVIOUS : 'Previous Page',
		CAPTION_UNLOAD : 'Any data entered on ANY PAGE of this form will be LOST.'
	},

	/**
     * Indicates that form should be validated on Next clicked
     * TODO		Possible refactor functionality with validation
	 */
	runValidationOnPageNext : true,

	/**
	 * Add an unload handler to warn the user of potential loss of data
	 */
	warnOnUnload: true,
	 
	/**
	 * custom 'Page Next' event handler (to be overridden) 
     * @param	{HTMLElement}	elem	new page
	 */
	 onPageNext: function() {},
	 
	/**
	 * custom 'Page Previous' event handler (to be overridden) 
     * @param	{HTMLElement}	elem	new page
	 */
	 onPagePrevious: function() {}, 
	 
	 /**
	 * custom 'Page Change' event handler (either next or previous) (to be overridden) 
     * @param	{HTMLElement}	elem	new page
	 */
	 onPageChange: function() {}, 
	   
	/**
	 * Creates new instance of the behavior
     * @param	{HTMLElement}	f	Form element
     * @constructor
	 */
	instance: function(f) {
		this.behavior = wFORMS.behaviors.paging; 
		this.target = f;
		this.currentPageIndex = 1;
	}
}

/**
 * Factory Method.
 * Applies the behavior to the given HTML element by setting the appropriate event handlers.
 * @param {domElement} f An HTML element, either nested inside a FORM element or (preferably) the FORM element itself.
 * @return {object} an instance of the behavior 
 */	
wFORMS.behaviors.paging.applyTo = function(f) {
	var b = null;
	var behavior = wFORMS.behaviors.paging;
	var isValidationAccepted = (wFORMS.behaviors.validation && wFORMS.behaviors.paging.runValidationOnPageNext);
	
	
	// Iterates over the elements with specified class names
	f.querySelectorAll(wFORMS.behaviors.paging.SELECTOR).forEach(
		function(elem){
			if(!b) {
				b = new wFORMS.behaviors.paging.instance(f)
			}			
			// Creates placeholder for buttons
			var ph = b.getOrCreatePlaceHolder(elem);
			var index = wFORMS.behaviors.paging.getPageIndex(elem);
			// If first page add just Next button
			if(index == 1){
				var ctrl = base2.DOM.bind(ph.appendChild(behavior._createNextPageButton(index)));
									
					ctrl.addEventListener('click', function(event) {							
							var v = wFORMS.getBehaviorInstance(b.target,'validation');
							var result = true;
							if((wFORMS.behaviors.validation && wFORMS.behaviors.paging.runValidationOnPageNext)){
								result = v.run(event,elem);
							}
							if(result){b.run(event, ctrl);}
						}, 
						false);

				wFORMS.behaviors.paging.showPage(elem);
			}else{
				// Adds previous button
				var ctrl = base2.DOM.bind(behavior._createPreviousPageButton(index));
				ph.insertBefore(ctrl, ph.firstChild);

				ctrl.addEventListener('click', function(event) { b.run(event, ctrl)}, false);

				// If NOT last page adds next button also
				if(!wFORMS.behaviors.paging.isLastPageIndex(index, true)){
					var _ctrl = base2.DOM.bind(ph.appendChild(behavior._createNextPageButton(index)));

					if(isValidationAccepted){						
						_ctrl.addEventListener('click', function(event) {
							var v = wFORMS.getBehaviorInstance(b.target,'validation'); 							 
							if(v.run(event, elem)){b.run(event, _ctrl);} 
						}, false);
					}else{
						_ctrl.addEventListener('click', function(event) { b.run(event, _ctrl); }, false);
					}
				}
			}
		}
	);
	// Looking for the first active page from 0. 0 is a "fake page"
	if(b){		
		p = b.findNextPage(0);
		b.currentPageIndex = 0;
		b.activatePage(wFORMS.behaviors.paging.getPageIndex(p), false); // no scrolling to the top of the page here
	
		// Add a unload handler to prevent accidental loss of data when navigating away from the page
		if(!window.onbeforeunload) {	
			window.onbeforeunload = function() { 
				if(b.behavior.warnOnUnload)
					return b.behavior.MESSAGES.CAPTION_UNLOAD;
				// don't return anything to skip the warning 
			};
		}
		b.onApply();	
		
		// intercept the submit event
		base2.DOM.Element.addEventListener(f, 'submit', function (e) {b.onSubmit(e, b)});	
	}
	return b;
}

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
				if(b.errorPages && b.errorPages[index]){
					var elem = document.getElementById(b.errorPages[0]);
					if(elem.scrollIntoView) {
						elem.scrollIntoView();
					}
				};
}

/**
 * Create a list of tabs to move users around the form.
 * Append into element e
 */
wFORMS.behaviors.paging.instance.prototype.generateTabs = function(e){

	var _b = this;
	var d = document.createElement('div');
	d.id = 'tab-nav';
	d.style.fontSize="smaller";
	
	if(e){
		e.appendChild(d);
	}else{
		this.target.parentNode.insertBefore(d,this.target);
	}
	
	var pages = base2.DOM.Element.querySelectorAll(this.target,'.wfPage, .wfCurrentPage');
	pages.forEach(function(elem,i){
		var tab = document.createElement('a');
		tab.setAttribute("class","tabs");
		tab.setAttribute("id","wfTab_page_"+i);
		tab.setAttribute("href","#");
		var label = base2.DOM.Element.querySelector(elem,'h3');
		tab.textContent=label?label.textContent:"Page "+(i+1);
		if(i<pages.length-1){
			var text = document.createTextNode(" | ");
		}
		base2.DOM.Element.addEventListener(tab,'click',function(){_b.jumpTo(i+1);});
		d.appendChild(tab);
		if(text){d.appendChild(text);}
	});
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
		e.pagingStopPropagation = false;
	}
}

/**
 * instance-specific pageNext event handler (can be overriden).
 * @param	{HTMLElement}	page element 
 */ 
wFORMS.behaviors.paging.instance.prototype.onPageNext = function(p) { this.behavior.onPageNext(p); }

/** 
 * instance-specific pagePrevious event handler (can be overriden).
 * @param	{HTMLElement}	page element 
 */ 
wFORMS.behaviors.paging.instance.prototype.onPagePrevious = function(p) { this.behavior.onPagePrevious(p); }

/** 
 * instance-specific pageChange event handlers (can be overriden).
 * @param	{HTMLElement}	page element 
 */ 
 wFORMS.behaviors.paging.instance.prototype.onPageChange = function(p) { this.behavior.onPageChange(p);}


/**
 * Returns page index by the page area element
 * @param	{HTMLElement}	elem
 * @return	{Integer}	or false
 */
wFORMS.behaviors.paging.getPageIndex = function(elem){
	if(elem && elem.id){
		var index = elem.id.replace(
			new RegExp(wFORMS.behaviors.paging.ID_PAGE_PREFIX + '(\\d+)'), "$1");

		index = parseInt(index);
		return !isNaN(index) ? index : false;

	}

	return false;
}

/**
 * Check if the given element is in the visible page.
 * @param	{DOMElement}	an element (such as a field to be validated)
 * @return	{boolean}
 */
wFORMS.behaviors.paging.isElementVisible = function(element){	
	while(element && element.tagName != 'BODY'){
		if(element.className) {
			if(element.className.indexOf(this.CSS_CURRENT_PAGE) != -1) {
				return true;
			}
			if(element.className.indexOf(this.CSS_PAGE) != -1 ) {
				return false;
			}
		} 
		element = element.parentNode;
	}	
	return true;
}

/**
 * Private method for creating button. Uses public method for design creating
 * @param	{Integer}	index 	Index of the page button belongs to
 * @return	{HTMLElement}
 * @private
 * @see wFORMS.behaviors.paging.createNextPageButton
 */
wFORMS.behaviors.paging._createNextPageButton = function(index){
	var elem = this.createNextPageButton();
	elem.setAttribute(this.ATTR_INDEX, index + 1);
	elem.id = this.ID_BUTTON_NEXT_PREFIX + index;
	return elem;
}

/**
 * Creates button for moving to the next page. This method could be overridden
 * And developed for easily customization for users. Behavior uses private method
 * @return	{HTMLElement}
 * @public
 */
wFORMS.behaviors.paging.createNextPageButton = function(){
	var elem = document.createElement('input'); 
	elem.setAttribute('value', this.MESSAGES.CAPTION_NEXT);
	elem.type = 'button';
	elem.className = this.CSS_BUTTON_NEXT;
	return elem;
}

/**
 * Private method for creating button. Uses public method for design creating
 * @param	{Integer}	index 	Index of the page button belongs to
 * @return	{HTMLElement}
 * @private
 * @see wFORMS.behaviors.paging.createPreviousPageButton
 */
wFORMS.behaviors.paging._createPreviousPageButton = function(index){
	var elem = this.createPreviousPageButton();
	elem.setAttribute(this.ATTR_INDEX, index - 1);
	elem.id = this.ID_BUTTON_PREVIOUS_PREFIX + index;;
	return elem;
}

/**
 * Creates button for moving to the next page. This method could be overridden
 * And developed for easily customization for users. Behavior uses private method
 * @return	{HTMLElement}
 * @public
 */
wFORMS.behaviors.paging.createPreviousPageButton = function(){
	var elem = document.createElement('input'); 
	elem.setAttribute('value', this.MESSAGES.CAPTION_PREVIOUS);
	elem.type = 'button';
	elem.className = this.CSS_BUTTON_PREVIOUS;
	return elem;
}

/**
 * Creates place holder for buttons
 * @param	{HTMLElement}	pageElem	Page where placeholder should be created
 * @return	{HTMLElement}
 */
wFORMS.behaviors.paging.instance.prototype.getOrCreatePlaceHolder = function(pageElem){
	var id = pageElem.id + this.behavior.ID_PLACEHOLDER_SUFFIX;
	var elem = document.getElementById(id);

	if(!elem){
		elem = pageElem.appendChild(document.createElement('div'));
		elem.id = id;
		elem.className = this.behavior.CSS_BUTTON_PLACEHOLDER;
	}	

	return elem;
}

/**
 * Hides page specified
 * @param	{HTMLElement}	e
 */
wFORMS.behaviors.paging.hidePage = function(e){
	if(e) {
		if(!e.removeClass) { // no base2.DOM.bind to speed up function 
			e.removeClass = function(className) { return base2.DOM.HTMLElement.removeClass(this,className) };
		}
		if(!e.addClass) { // no base2.DOM.bind to speed up function 
			e.addClass = function(className) { return base2.DOM.HTMLElement.addClass(this,className) };
		}
		e.removeClass(wFORMS.behaviors.paging.CSS_CURRENT_PAGE);
		e.addClass(wFORMS.behaviors.paging.CSS_PAGE);
	}
}

/**
 * Shows page specified
 * @param	{HTMLElement}	e
 */
wFORMS.behaviors.paging.showPage = function(e){
	if(e) {
		if(!e.removeClass) { // no base2.DOM.bind to speed up function 
			e.removeClass = function(className) { return base2.DOM.HTMLElement.removeClass(this,className) };
		}
		e.removeClass(wFORMS.behaviors.paging.CSS_PAGE);
		if(!e.addClass) { // no base2.DOM.bind to speed up function 
			e.addClass = function(className) { return base2.DOM.HTMLElement.addClass(this,className) };
		}
		e.addClass(wFORMS.behaviors.paging.CSS_CURRENT_PAGE);
	}
}

/**
 * Activates page by index
 * @param	{Integer}	index	
 * @param	{Boolean}	[optional] scroll to the top of the page (default to true)
 */
wFORMS.behaviors.paging.instance.prototype.activatePage = function(index /*, scrollIntoView*/){
	
	if(arguments.length>1) {
		var scrollIntoView = arguments[1];
	} else {
		var scrollIntoView = true;
	}
	
	if(index == this.currentPageIndex){
		return false;
	}
	index = parseInt(index);
	if(index > this.currentPageIndex){
		var p = this.findNextPage(this.currentPageIndex);
	} else {
		var p = this.findPreviousPage(this.currentPageIndex);
	}
	
	if(p) { 
		// Workaround for Safari. Otherwise it crashes with Safari 1.2
		var _self = this;
	//	setTimeout(
		//	function(){
				var index = _self.behavior.getPageIndex(p);
				_self.setupManagedControls(index);
				_self.behavior.hidePage(_self.behavior.getPageByIndex(_self.currentPageIndex));				
				_self.behavior.showPage(p);
				var  _currentPageIndex = _self.currentPageIndex;
				_self.currentPageIndex = index;
				
				// go to top of the page
				if (scrollIntoView) {
					if (p.scrollIntoView) {
						p.scrollIntoView();
					}
					else {
						location.hash = "#" + wFORMS.behaviors.paging.ID_PAGE_PREFIX + index;
					}
				}
				
				// run page change event handlers
				_self.onPageChange(p);
				if(index > _currentPageIndex){
					_self.onPageNext(p);
				} else {
					_self.onPagePrevious(p);
				}
		//	}, 1
		//);
	}
}

/**
 * Setups managed controls: Next/Previous/Send buttons
 * @param	{int}	index	Index of the page to make controls setting up. If null setups current page
 */
wFORMS.behaviors.paging.instance.prototype.setupManagedControls = function(index){
	// new 
	if(!index){
		index = this.currentPageIndex;
	}
	
	// new
	var b = wFORMS.behaviors.paging;
	if(b.isFirstPageIndex(index)){
		if(ctrl = b.getPreviousButton(index)){
			ctrl.style.visibility = 'hidden';
		}
	}else{
		if(ctrl = b.getPreviousButton(index)){
			ctrl.style.visibility = 'visible';
		}
	}

	if(b.isLastPageIndex(index)){
		if(ctrl = b.getNextButton(index)){
			ctrl.style.visibility = 'hidden';
		}
		this.showSubmitButtons();
	} else {
		if(ctrl = b.getNextButton(index)){
			ctrl.style.visibility = 'visible';
		}
		this.hideSubmitButtons();
	}
}

/**
 * Shows all submit buttons
 */
wFORMS.behaviors.paging.instance.prototype.showSubmitButtons = function(){
	var nl = this.target.getElementsByTagName('input');
	for(var i=0;i<nl.length;i++) {
		if(nl[i].type=='submit') {
			nl[i].className = nl[i].className.replace(new RegExp("(^|\\s)" + this.behavior.CSS_SUBMIT_HIDDEN + "(\\s|$)", "g"), "$2");
		}	
	}
}

/**
 * Hides all submit button
 */
wFORMS.behaviors.paging.instance.prototype.hideSubmitButtons = function(){
	var nl = this.target.getElementsByTagName('input');
	for(var i=0;i<nl.length;i++) {
		if(nl[i].type=='submit') {
			if(!(new RegExp("(^|\\s)" + this.behavior.CSS_SUBMIT_HIDDEN + "(\\s|$)")).test(nl[i].className)) {
				nl[i].className+=' '+this.behavior.CSS_SUBMIT_HIDDEN;
			}
		}
	}
}

/**
 * Returns page element specified by index
 * @param	{Integer}	index
 * @return	{HTMLElement}
 */
wFORMS.behaviors.paging.getPageByIndex = function(index){
	var page = document.getElementById(wFORMS.behaviors.paging.ID_PAGE_PREFIX + index);
	return page ? base2.DOM.bind(page) : false;
}

/**
 * Returns next button specified by index
 * @param	{int}	index	Index of the page button related to
 * @return	{HTMLElement}
 */
wFORMS.behaviors.paging.getNextButton = function(index){
	// base2 is not using here because of when control is absen it produces an error in IE
	// for example on last page there is not Next button, on first - Previous
	return document.getElementById(wFORMS.behaviors.paging.ID_BUTTON_NEXT_PREFIX + index);
}

/**
 * Returns previous button specified by index
 * @param	{int}	index	Index of the page button related to
 * @return	{HTMLElement}
 */
wFORMS.behaviors.paging.getPreviousButton = function(index){
	// base2 is not using here because of when control is absen it produces an error in IE
	// for example on last page there is not Next button, on first - Previous
	return document.getElementById(wFORMS.behaviors.paging.ID_BUTTON_PREVIOUS_PREFIX + index);
}

/**
 * Check if index passed is index of the last page
 * @param	{Integer}	index
 * @param	{bool}	ignoreSwitch	Ingoneres switch behavior when checking for last index
 * @return	{bool}
 */
wFORMS.behaviors.paging.isLastPageIndex = function(index, ignoreSwitch){
	index = parseInt(index) + 1;
	var b = wFORMS.behaviors.paging;
	var p = b.getPageByIndex(index);

	if((_b = wFORMS.behaviors['switch']) && !ignoreSwitch){
		while(p && _b.isSwitchedOff(p)){
			index++;
			p = b.getPageByIndex(index);
		}
	}

	return p ? false : true;
}

/**
 * Check if index passed is index of the first page
 * @param	{Integer}	index
 * @param	{bool}	ignoreSwitch	Ingoneres switch behavior when checking for first index
 * @return	{bool}
 */
wFORMS.behaviors.paging.isFirstPageIndex = function(index, ignoreSwitch){
	index = parseInt(index) - 1;
	var b = wFORMS.behaviors.paging;
	var p = b.getPageByIndex(index);
	if((_b = wFORMS.behaviors['switch']) && !ignoreSwitch){
		while(p && _b.isSwitchedOff(p)){
			index--;
			p = b.getPageByIndex(index);
		}
	}

	return p ? false : true;
}

/**
 * Returns Next page from the index. Takes in attention switch behavior
 * @param	{int}	index
 */
wFORMS.behaviors.paging.instance.prototype.findNextPage = function(index){
	index = parseInt(index) + 1;
	var b = wFORMS.behaviors.paging;
	var p = b.getPageByIndex(index);

	if(_b = wFORMS.behaviors['switch']){
		while(p && _b.isSwitchedOff(p)){
			index++;
			p = b.getPageByIndex(index);
		}
	}
	return p;
}

/**
 * Returns Next page from the index. Takes in attention switch behavior
 * @param	{int}	index
 */
wFORMS.behaviors.paging.instance.prototype.findPreviousPage = function(index){
	index = parseInt(index) - 1;
	var b = wFORMS.behaviors.paging;
	var p = b.getPageByIndex(index);

	if(_b = wFORMS.behaviors['switch']){
		while(p && _b.isSwitchedOff(p)){
			index--;
			p = b.getPageByIndex(index);
		}
	}

	return p ? p : false;
}





/**
 * Executes the behavior
 * @param {event} e 
 * @param {domElement} element
 */
wFORMS.behaviors.paging.instance.prototype.run = function(e, element){
	this.activatePage(element.getAttribute(wFORMS.behaviors.paging.ATTR_INDEX));
}
