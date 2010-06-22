
if (typeof(wFORMS) == "undefined") {
	throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
/**
 * wForms hint behavior. Show/highlight an HTML element when the associated input gets the focus.
 */
wFORMS.behaviors.hint  = { 
	
	/**
	 * Inactive CSS class for the element
     * @final
	 */
	CSS_INACTIVE : 'field-hint-inactive',

	/**
	 * Active CSS class for the element
     * @final
	 */
	CSS_ACTIVE : 'field-hint',

	/**
	 * Selector expression for the hint elements
     * @final
     * @see	http://www.w3.org/TR/css3-selectors/
	 */
	HINT_SELECTOR : '*[id$="-H"]',

	/**
	 * Suffix of the ID for the hint element
     * @final
	 */
	HINT_SUFFIX : '-H',

	/**
	 * Creates new instance of the behavior
     * @constructor
	 */
	instance : function(f) {
		this.behavior = wFORMS.behaviors.hint; 
		this.target = f;
	}
}

/**
 * Factory Method.
 * Applies the behavior to the given HTML element by setting the appropriate event handlers.
 * @param {domElement} f An HTML element, either nested inside a FORM element or (preferably) the FORM element itself.
 * @return {object} an instance of the behavior 
 */	
wFORMS.behaviors.hint.applyTo = function(f) {
	var b = new wFORMS.behaviors.hint.instance(f);
	// Selects all hints elements using predefined selector and attaches
	// event listeners to related HTML elements for each hint
	var elems = f.querySelectorAll(wFORMS.behaviors.hint.HINT_SELECTOR);
	if(!elems.forEach){
		//Make sure elems have forEach property since Opera doesn't let us override
		//StaticNodeList.prototype
		elems.forEach = NodeList.prototype.forEach;
	}
	
	elems.forEach(
		function(elem){
			
			// ID attribute is not checked here because selector already contains it
			// if selector is changed, ID check should also exists
			// if(!elem.id) { return ; }
			var e = b.getElementByHintId(elem.id);
			if(e){
				if(!e.addEventListener) base2.DOM.bind(e);
				if(e.tagName == "SELECT" || e.tagName == "TEXTAREA" || (e.tagName == "INPUT" && e.type != "radio" && e.type != "checkbox")){							
					e.addEventListener('focus', function(event) { b.run(event, this)}, false);
					e.addEventListener('blur',  function(event) { b.run(event, this)}, false);	
				} else {
					e.addEventListener('mouseover', function(event) { b.run(event, e)}, false);
					e.addEventListener('mouseout', function(event) { b.run(event, e)}, false);
				}
			}
		}
	);
	b.onApply();
	return b;
}

/**
 * Executed once the behavior has been applied to the document.
 * Can be overwritten.
 */
wFORMS.behaviors.hint.instance.prototype.onApply = function() {} 

/**
 * Executes the behavior
 * @param {event} event
 * @param {domElement} elem
 */
wFORMS.behaviors.hint.instance.prototype.run = function(event, element) { 	
	
	var hint = this.getHintElement(element);
	if(!hint) return;
	if(!hint.removeClass) base2.DOM.bind(hint);
	
	if(event.type == 'focus' || event.type == 'mouseover'){
		hint.removeClass(wFORMS.behaviors.hint.CSS_INACTIVE)
		hint.addClass(wFORMS.behaviors.hint.CSS_ACTIVE);
		if (!wFORMS.helpers.getForm(element).hasClass('hintsSide')) {
			this.setup(hint, element);
		}
	} else{
		hint.addClass(wFORMS.behaviors.hint.CSS_INACTIVE);
		hint.removeClass(wFORMS.behaviors.hint.CSS_ACTIVE);
	}
}


/**
 * Returns HTMLElement related to specified hint ID
 * @returns	{HTMLElement}
 */
wFORMS.behaviors.hint.instance.prototype.getElementByHintId = function(hintId){
	var id = hintId.substr(0, hintId.length - wFORMS.behaviors.hint.HINT_SUFFIX.length);
	var e = document.getElementById(id);
	return e;
}

/**
 * Returns HTMLElement Hint element associated with element event catched from
 * @returns	{HTMLElement}
 */
wFORMS.behaviors.hint.instance.prototype.getHintElement = function(element){
	var e = document.getElementById(element.id + this.behavior.HINT_SUFFIX);
	if(e && !e.hasClass){base2.DOM.bind(e);}
	return e && e != '' ? e : null;
}

/**
 * Setups hint position on the screen depend on the element
 * @param	{HTMLElement}	hint	Hint HTML element
 * @param   {HTMLElement}	source	HTML element with focus.
 */
wFORMS.behaviors.hint.instance.prototype.setup = function(hint, field) {
	var form = wFORMS.helpers.getForm(field);
	if (hint.parentNode != form) {
		form.appendChild(hint);
	}
	var fp = wFORMS.helpers.position(field);
	var hp = wFORMS.helpers.position(hint);
	var diff = {
		left: fp.left - hp.left,
		top: fp.top - hp.top
	};
	if (field.tagName.toLowerCase() == 'select') {
		hint.style.left = hint.offsetLeft + diff.left + field.offsetWidth +'px';
		hint.style.top = hint.offsetTop + diff.top +'px';
	} else {
		hint.style.left = hint.offsetLeft + diff.left +'px';
		hint.style.top = hint.offsetTop + diff.top + field.offsetHeight +'px';
	}
}

/**
 * Returns if ID is of the HINT element. Used by repeat behavior to correctly 
 * update hint ID
 * @param	{DOMString}	id
 * @return	boolean
 */
wFORMS.behaviors.hint.isHintId = function(id){
	return id.match(new RegExp(wFORMS.behaviors.hint.HINT_SUFFIX + '$')) != null;
}
