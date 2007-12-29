
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
		CAPTION_PREVIOUS : 'Previous Page'
	},

	/**
     * Indicates that form should be validated on Next clicked
     * TODO		Possible refactor functionality with validation
	 */
	runValidationOnPageNext : true,

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
	var b = new wFORMS.behaviors.paging.instance(f)
	var behavior = wFORMS.behaviors.paging;
	var isValidationAccepted = (wFORMS.behaviors.validation && wFORMS.behaviors.paging.runValidationOnPageNext);
	// Shows that form contains paging
	var isPagingApplied = false;
	// Iterates over the elements with specified class names
	f.querySelectorAll(wFORMS.behaviors.paging.SELECTOR).forEach(
		function(elem){
			console.log(elem);
			isPagingApplied = true;
			// Creates placeholder for buttons
			var ph = b.getOrCreatePlaceHolder(elem);
			var index = wFORMS.behaviors.paging.getPageIndex(elem);
			// If first page add just Next button
			if(index == 1){
				var ctrl = base2.DOM.bind(ph.appendChild(behavior._createNextPageButton(index)));
				
				if(isValidationAccepted){					
					ctrl.addEventListener('click', function(event) {							
							var v = wFORMS.getBehaviorInstance(b.target,'validation'); 
							if(v.run(event, elem)){b.run(event, ctrl);} 
						}, 
						false);					
				}else{
					ctrl.addEventListener('click', function(event) { b.run(event, ctrl); }, false);
				}

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
	if(isPagingApplied){		
		p = b.findNextPage(0);
		b.currentPageIndex = 0;
		b.activatePage(wFORMS.behaviors.paging.getPageIndex(p));
	}

	return b;
}


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
 * Private method for creating button. Uses public method for design creating
 * @param	{Integer}	index 	Index of the page button belongs to
 * @return	{HTMLElement}
 * @private
 * @see wFORMS.behaviors.paging.createNextPageButton
 */
wFORMS.behaviors.paging._createNextPageButton = function(index){
	var elem = wFORMS.behaviors.paging.createNextPageButton();
	elem.setAttribute(wFORMS.behaviors.paging.ATTR_INDEX, index + 1);
	elem.id = wFORMS.behaviors.paging.ID_BUTTON_NEXT_PREFIX + index;

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
	elem.setAttribute('value', wFORMS.behaviors.paging.MESSAGES.CAPTION_NEXT);
	elem.setAttribute('type', 'button');

	elem.className = wFORMS.behaviors.paging.CSS_BUTTON_NEXT;

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
	var elem = wFORMS.behaviors.paging.createPreviousPageButton();
	elem.setAttribute(wFORMS.behaviors.paging.ATTR_INDEX, index - 1);
	elem.id = wFORMS.behaviors.paging.ID_BUTTON_PREVIOUS_PREFIX + index;;

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
	elem.setAttribute('value', wFORMS.behaviors.paging.MESSAGES.CAPTION_PREVIOUS);
	elem.setAttribute('type', 'button');

	elem.className = wFORMS.behaviors.paging.CSS_BUTTON_PREVIOUS;

	return elem;
}

/**
 * Creates place holder for buttons
 * @param	{HTMLElement}	pageElem	Page where placeholder should be created
 * @return	{HTMLElement}
 */
wFORMS.behaviors.paging.instance.prototype.getOrCreatePlaceHolder = function(pageElem){
	var id = pageElem.id + wFORMS.behaviors.paging.ID_PLACEHOLDER_SUFFIX;
	var elem = document.getElementById(id);

	if(!elem){
		elem = pageElem.appendChild(document.createElement('div'));
		elem.id = id;
		elem.className = wFORMS.behaviors.paging.CSS_BUTTON_PLACEHOLDER;
	}	

	return elem;
}

/**
 * Hides page specified
 * @param	{HTMLElement}	e
 */
wFORMS.behaviors.paging.hidePage = function(e){
	if(e) {
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
		e.removeClass(wFORMS.behaviors.paging.CSS_PAGE);
		e.addClass(wFORMS.behaviors.paging.CSS_CURRENT_PAGE);
	}
}

/**
 * Activates page by index
 * @param	{Integer}	index	
 */
wFORMS.behaviors.paging.instance.prototype.activatePage = function(index){

	if(index == this.currentPageIndex){
		return false;
	}
	
	// hack
	index = parseInt(index);
	//hack
	if(index > this.currentPageIndex){
		var p = this.findNextPage(this.currentPageIndex);
	} else {
		var p = this.findPreviousPage(this.currentPageIndex);
	}
	if(p) { 
		// rewrite index
		var index = wFORMS.behaviors.paging.getPageIndex(p);
	
		var b = wFORMS.behaviors.paging;
	
		// Workaround for Safari. Otherwise it crashes with Safari 1.2
		// Looks like hiding should be ran in "different thread"
		var clazz = this;
		setTimeout(
			function(){
				clazz.setupManagedControls(index);
				b.hidePage(b.getPageByIndex(clazz.currentPageIndex));				
				b.showPage(p);
				clazz.currentPageIndex = index;
			}, 1
		);
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
			ctrl.style.display = 'none';
		}
	}else{
		if(ctrl = b.getPreviousButton(index)){
			ctrl.style.display = 'inline';
		}
	}

	if(b.isLastPageIndex(index)){
		if(ctrl = b.getNextButton(index)){
			ctrl.style.display = 'none';
		}
		this.showSubmitButtons();
	} else {
		if(ctrl = b.getNextButton(index)){
			ctrl.style.display = 'inline';
		}
		this.hideSubmitButtons();
	}
}

/**
 * Shows all submit buttons
 */
wFORMS.behaviors.paging.instance.prototype.showSubmitButtons = function(){
	this.target.querySelectorAll('input[type~="submit"]').forEach(function(elem){
		elem.removeClass(wFORMS.behaviors.paging.CSS_SUBMIT_HIDDEN);
	});
}

/**
 * Hides all submit button
 */
wFORMS.behaviors.paging.instance.prototype.hideSubmitButtons = function(){
	this.target.querySelectorAll('input[type~="submit"]').forEach(function(elem){
		elem.addClass(wFORMS.behaviors.paging.CSS_SUBMIT_HIDDEN);
	});
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

	return p ? p : true;
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
