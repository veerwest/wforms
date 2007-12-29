	
if (typeof(wFORMS) == "undefined") {
	throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
/**
 * wForms repeat behavior. 
 * See: http://www.formassembly.com/wForms/v2.0/documentation/examples/repeat.html
 */
wFORMS.behaviors.repeat = {

	/**
	 * Selector expression for catching repeat elements
     * @final
     * @see	http://www.w3.org/TR/css3-selectors/
	 */
	SELECTOR_REPEAT : '*[class~="repeat"]',

	/**
	 * Selector expression for catching removable section
     * @final
     * @see	http://www.w3.org/TR/css3-selectors/
	 */
	SELECTOR_REMOVEABLE : '*[class~="removeable"]',

	/**
	 * Suffix for the ID of the element that is a control field to make a duplicate 
     * of the section specififed
     * @final
	 */
	ID_SUFFIX_DUPLICATE_LINK : '-wfDL',

	/**
	 * Suffix for the ID of the repeat counter hidden element
     * @final
	 */
	ID_SUFFIX_COUNTER : '-RC',

	/**
	 * CSS class for duplicate span/link
     * @final
	 */
	CSS_DUPLICATE_LINK : 'duplicateLink',
	CSS_DUPLICATE_SPAN : 'duplicateSpan',
	/**
	 * CSS class for delete link
     * @final
	 */
	CSS_DELETE_LINK : 'removeLink',
	CSS_DELETE_SPAN : 'removeSpan',
	/**
	 * CSS class for field group that could be removed
     * @final
	 */
	CSS_REMOVEABLE : 'removeable',

	/**
	 * CSS class for field group that could be repeat
     * @final
	 */
	CSS_REPEATABLE : 'repeat',

	/**
	 * Attribute specifies that current group is duplicate
     * @final
	 */
	ATTR_DUPLICATE : 'wfr__dup',

	/**
	 * Attribute specifies that current group is duplicate
     * @final
	 */
	ATTR_DUPLICATE_ELEM : 'wfr__dup_elem',


    /**
     * Means that element has been already handled by repeat behavior
     */
	ATTR_HANDLED : 'wfr_handled',

	/**
	 * Attribute specifies ID of the master section on its dublicate
     * @final
	 */
	ATTR_MASTER_SECTION : 'wfr__master_sec',

	/**
	 * Special attribute name that is set to Remove link with section ID
     * should be deleted when link is clicked
     * @final
	 */
	ATTR_LINK_SECTION_ID : 'wfr_sec_id',

	/**
	 * Messages collection used for creating links
     * @final
	 */
	MESSAGES : {
		ADD_CAPTION : "Add another response",
		ADD_TITLE : "Will duplicate this question or section.",

		REMOVE_CAPTION : "Remove",
		REMOVE_TITLE : "Will remove this question or section"
	},

	/**
	 * Array of the attribute names that shoud be updated in the duplicated tree
	 */
	UPDATEABLE_ATTR_ARRAY : [
		'id',
		'name',
		'for'
	],

	/**
	 * Allows to leave names of the radio buttons the same (behavior-wide setting)
	 */
	preserveRadioName : false,
	
	/**
	 * Allows to leave names of the radio buttons the same (field-level setting)
	 * This class attribute can be set on a repeated element to override the
	 * behavior's preserveRadioName setting.
	 */
	CSS_PRESERVE_RADIO_NAME: "preserveRadioName",
	
	/**
	 * Custom function that could be overridden. 
	 * Evaluates when section is duplicated
     * @param	{HTMLElement}	elem	Duplicated section
	 */
	onRepeat : function(elem){
	},

	/**
	 * Custom function that could be overridden. 
	 * Evaluates when section is removed
	 */
	onRemove : function(){
	},

	/**
	 * Custom function that could be overridden. 
	 * Returns if section could be repeated
     * @param	{HTMLElement}	elem	Section to be duplicated
     * @param	{wFORMS.behaviors.repeat}	b	Behavior mapped to repeatable section 
     * @return	boolean
	 */
	allowRepeat : function(elem, b){
		return true;
	},

	/**
	 * Creates new instance of the behavior
     * @param	{HTMLElement}	f	Form element
     * @constructor
	 */
	instance : function(f) {
		this.behavior = wFORMS.behaviors.repeat; 
		this.target = f;
	}
}

/**
 * Factory Method.
 * Applies the behavior to the given HTML element by setting the appropriate event handlers.
 * @param {domElement} f An HTML element, either nested inside a FORM element or (preferably) the FORM element itself.
 * @return {object} an instance of the behavior 
 */	
wFORMS.behaviors.repeat.applyTo = function(f) {
	// look up for the all elements that could be repeated.
	// Trying to add event listeners to elements for adding new container.
	// If need create Add new section element
	var _self = this;
	var b = new Array();
	
	f.querySelectorAll(this.SELECTOR_REPEAT).forEach(
		function(elem){
			if(_self.isHandled(elem)){
				return ;
			}
			if(!elem.id) elem.id = wFORMS.helpers.randomId();
			
			var _b = new _self.instance(elem);
			var e = _b.getOrCreateRepeatLink(elem);
			e.addEventListener('click', function(event) { _b.run(event, e) }, false);
			b.push(_b);	
			
			// Sets element to handled state and iterates its child matching for
			// repeat behavior. The idea is to have different instances of repeat
			// behavior for every group that could be duplicated
			// for all indexes for each group begin from zero
			_self.handleElement(elem);			
			//elem.querySelectorAll(_self.SELECTOR_REPEAT).forEach(
			//	function(__elem){
			//		_self.applyTo(__elem);
			//	}
			//);
		}
	);
	// When section is duplicated remove link should be added to it
	// It is done here because for each new section new behavior instance is created
	// And event from the correct instance should be assigned to Remove Link
	var addRemoveLinkToSection= function(elem){
		e = _self.createRemoveLink(elem.id);
		
		// looking for the place where to paste link
		if(elem.tagName == 'TR'){
			var tds = elem.getElementsByTagName('TD');
			var tdElem = tds[tds.length-1];
			tdElem.appendChild(e);
		} else {
			elem.appendChild(e)
		}
	}

	if(f.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE)){
		addRemoveLinkToSection(f);
	}
	
	f.querySelectorAll(this.SELECTOR_REMOVEABLE).forEach(function(e){
		// 
		addRemoveLinkToSection(e);
	});
	
	return b;
}

/**
 * Returns repeat link for specified area if it exists, 
 * otherwise creates new one and returns it
 * @param	{HTMLElement}	elem	Element repeat link is related to
 * @return	{HTMLElement}
 */
wFORMS.behaviors.repeat.instance.prototype.getOrCreateRepeatLink = function(elem){
	var id = elem.id + wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK;
	var e = document.getElementById(id);
	if(!e || e == ''){
		e = this.createRepeatLink(id);
		
		// Wraps in a span for better CSS positionning control.
		var spanElem = document.createElement('span');
		spanElem.className = wFORMS.behaviors.repeat.CSS_DUPLICATE_SPAN;
		e = spanElem.appendChild(e);
		
		if(elem.tagName.toUpperCase() == 'TR'){
			var tdElem = elem.getElementsByTagName('TD');
			if(!tdElem){
				tdElem = elem.appendChild(document.createElement('TD'));
			} else {
				tdElem = tdElem[tdElem.length-1]; 
			}
			tdElem.appendChild(spanElem);
		}else{
			elem.appendChild(spanElem)
		}
	}

	return base2.DOM.bind(e);
}

/**
 * Returns repeat link for specified area if it exists, 
 * otherwise creates new one and returns it
 * @param	{DOMString}	id	ID of the group
 * @return	{HTMLElement}
 */
wFORMS.behaviors.repeat.instance.prototype.createRepeatLink = function(id){
	// Creates repeat link element
	var linkElem = document.createElement("A");
				
	linkElem.id = id;
	linkElem.setAttribute('href', '#');	
	linkElem.className = wFORMS.behaviors.repeat.CSS_DUPLICATE_LINK;
	linkElem.setAttribute('title', wFORMS.behaviors.repeat.MESSAGES.ADD_TITLE);	

	// Appends text inside the <span element (for CSS replacement purposes) to <a element
	linkElem.appendChild(document.createElement('span').appendChild(
		document.createTextNode(wFORMS.behaviors.repeat.MESSAGES.ADD_CAPTION)));

	return linkElem;
}

/**
 * Returns remove link for specified area 
 * @param	{DOMString}	id	ID of the field group
 * @return	{HTMLElement}
 */
wFORMS.behaviors.repeat.createRemoveLink = function(id){
	// Creates repeat link element
	var linkElem = document.createElement("a");
	
	linkElem.id = id + wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK;
	linkElem.setAttribute('href', '#');	
	linkElem.className = wFORMS.behaviors.repeat.CSS_DELETE_LINK;
	linkElem.setAttribute('title', wFORMS.behaviors.repeat.MESSAGES.REMOVE_TITLE);	
	linkElem.setAttribute(wFORMS.behaviors.repeat.ATTR_LINK_SECTION_ID, id);

	// Appends text inside the <span element (for CSS image replacement) to <a element
	var spanElem = document.createElement('span');
	spanElem.appendChild(document.createTextNode(wFORMS.behaviors.repeat.MESSAGES.REMOVE_CAPTION));
	linkElem.appendChild(spanElem);

	linkElem.onclick = function(event) { wFORMS.behaviors.repeat.onRemoveLinkClick(event, linkElem); };	

	// Wraps in a span for better CSS positionning control.
	var spanElem = document.createElement('span');
	spanElem.className = wFORMS.behaviors.repeat.CSS_DELETE_SPAN;
	spanElem.appendChild(linkElem);
	
	return spanElem;
}


/**
 * Returns target area that should be copyied by repeat link element
 * @param	{HTMLElement}	elem	Repeat Link Element
 * @return	{HTMLElement}
 * @DEPRECATED
 */
wFORMS.behaviors.repeat.instance.prototype.getTargetByRepeatLink = function(elem){
	return this.target.matchSingle('#' + 
		elem.id.substring(0, elem.id.length - wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK.length));

}

/**
 * Duplicates repeat section. Changes ID of the elements, adds event listeners
 * @param	{HTMLElement}	elem	Element to duplicate
 */
wFORMS.behaviors.repeat.instance.prototype.duplicateSection = function(elem){
	// Call custom function. By default return true
	if(!this.behavior.allowRepeat(elem, this)){
		return false;
	}
	this.updateMasterSection(elem);
	
	// Creates clone of the group
	// TODO: Cloning a radio group results in the loss of the selection (in Firefox at least)
	var newElem = base2.DOM.bind(elem.cloneNode(true));
	// Looking for the place where to add group
	var insertNode = elem;
	while(insertNode && 
		 (insertNode.nodeType==3 ||       // skip text-node that can be generated server-side when populating a previously repeated group 
		  insertNode.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE)  || 
		  insertNode.hasClass(wFORMS.behaviors.repeat.CSS_REPEATABLE))) {						
		insertNode = insertNode.nextSibling;
		if(insertNode && insertNode.nodeType==1 && !insertNode.hasClass) {
			insertNode = base2.DOM.bind(insertNode);
		}
	}
	
	elem.parentNode.insertBefore(newElem, insertNode);
	
	this.updateDuplicatedSection(newElem);	
	wFORMS.applyBehaviors(newElem);
	// Calls custom function
	wFORMS.behaviors.repeat.onRepeat(newElem);
}

/**
 * Removes section specified by id
 * @param	{DOMString}	id
 */
wFORMS.behaviors.repeat.removeSection = function(id){
	var elem = document.getElementById(id);

	// Removes section
	if(elem != ''){
		// SHOULD NOT Decrease count of the sections
		// or else, REPEAT TWICE + DELETE FIRST + REPEAT AGAIN => field name collision    
		//var cElem = wFORMS.behaviors.repeat.getOrCreateCounterField(
		//	wFORMS.behaviors.repeat.getMasterSection(elem));
		//cElem.value = parseInt(cElem.value) - 1;
		
		elem.parentNode.removeChild(elem);

		// Calls custom function
		wFORMS.behaviors.repeat.onRemove();
	}
}

/**
 * Evaluates when user clicks Remove link
 * @param	{DOMEvent}	Event	catched
 * @param	{HTMLElement}	elem	Element produced event
 */
wFORMS.behaviors.repeat.onRemoveLinkClick = function(event, elem){
	this.removeSection(elem.getAttribute(wFORMS.behaviors.repeat.ATTR_LINK_SECTION_ID));
	if(event) event.preventDefault();
}

/**
 * Updates attributes inside the master element
  * @param	{HTMLElement}	elem
 */
wFORMS.behaviors.repeat.instance.prototype.updateMasterSection = function(elem){
	// do it once 
	if(elem.doItOnce==true)
		return true;
	else
		elem.doItOnce=true;

	var suffix = this.createSuffix(elem);
	elem.id = this.clearSuffix(elem.id) + suffix;
	
	this.updateMasterElements(elem, suffix);	
}
wFORMS.behaviors.repeat.instance.prototype.updateMasterElements  = function(elem, suffix){
	
	if(!elem || elem.nodeType!=1) 
		return;
	
	var cn = elem.childNodes;
	for(var i=0;i<cn.length;i++) {
		var n = cn[i];
		if(n.nodeType!=1) continue;
		if(!n.hasClass) {
			base2.DOM.bind(n);
		}
		if(n.hasClass(wFORMS.behaviors.repeat.CSS_REPEATABLE))
			suffix += "[0]";
		if(!n.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE)){
			// Iterates over updateable attribute names
			for(var j = 0; j < wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY.length; j++){
				var attrName = wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY[j];
				var value = this.clearSuffix(n.getAttribute(attrName));
				if(!value){
					continue;
				}
				
				if(wFORMS.behaviors.hint && wFORMS.behaviors.hint.isHintId(n.id)){
					n.setAttribute(attrName, value.replace(new RegExp("(.*)(" + wFORMS.behaviors.hint.HINT_SUFFIX + ')$'),
						"$1" + suffix + "$2"));
				}else if(n.id.indexOf(wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK) != -1){
					n.setAttribute(attrName, value.replace(new RegExp("(.*)(" + wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK + ')$'),
						"$1" + suffix + "$2"));
				}else{
					n.setAttribute(attrName, value + suffix);					
				}
			}
			
			this.updateMasterElements(n, suffix);
		}
	}
}

/**
 * Updates attributes inside the duplicated tree
 * TODO rename
 * @param	{HTMLElement}	elem
 */
wFORMS.behaviors.repeat.instance.prototype.updateDuplicatedSection = function(elem){
	var clazz = this;
//	var idSuffix = this.getNextDuplicateIndex(this.target);

	// elem.setAttribute('dindex', this.getNextDuplicateIndex(this.target))
	var index  = this.getNextDuplicateIndex(this.target);
	var suffix = this.createSuffix(elem, index);

	// Caches master section ID in the dublicate
	elem.setAttribute(wFORMS.behaviors.repeat.ATTR_MASTER_SECTION, elem.id);
	// Updates element ID (possible problems when repeat element is Hint or switch etc)
	elem.id = this.clearSuffix(elem.id) + suffix;
	// Updates classname	
	elem.className = elem.className.replace(wFORMS.behaviors.repeat.CSS_REPEATABLE, wFORMS.behaviors.repeat.CSS_REMOVEABLE);

	// Check for preserverRadioName override
	if(elem.hasClass(wFORMS.behaviors.repeat.CSS_PRESERVE_RADIO_NAME)) 
		var _preserveRadioName = true;
	else
		var _preserveRadioName = wFORMS.behaviors.repeat.preserveRadioName;


	this.updateSectionChildNodes(elem.querySelectorAll('> *'), suffix, _preserveRadioName);
}

// new {{{


/**
 * Updates NodeList. Changes ID and names attributes
 * For different node elements suffixes could be different - i.e. for the nested
 * repeat section IDs and names should store parent section number
 * @param	elems	Array of the elements should be updated
 * @param	suffix	Suffix value should be added to attributes
 */
wFORMS.behaviors.repeat.instance.prototype.updateSectionChildNodes = function(elems, suffix, preserveRadioName){
	
	var clazz = this;
    elems.forEach(function(e){
    	
		// Removes created descendant duplicated group if any
		if(wFORMS.behaviors.repeat.isDuplicate(e)){
			e.parentNode.removeChild(e);
			return;
		}
		// Removes duplicate link
		if(e.hasClass(wFORMS.behaviors.repeat.CSS_DUPLICATE_SPAN)){
			e.parentNode.removeChild(e);
			return ;
		}
		if(e.hasClass(wFORMS.behaviors.repeat.CSS_DUPLICATE_LINK)){
			e.parentNode.removeChild(e);
			return ;
		}
				
		// Clears value	
		var tagName = e.tagName.toUpperCase();
		if(tagName == 'INPUT' || tagName == 'TEXTAREA'){
				
			if(e.type != 'radio' && e.type != 'checkbox'){
				e.value = '';
			}else{
				e.checked = false;
			}
		}
		
		clazz.updateAttributes(e, suffix, preserveRadioName);
		
		if(_elems = e.querySelectorAll('> *')){
			if(e.hasClass(wFORMS.behaviors.repeat.CSS_REPEATABLE)){
				clazz.updateSectionChildNodes(_elems, 
					wFORMS.behaviors.repeat.instance.prototype.createSuffix(e), 
					preserveRadioName);

			}else{
				clazz.updateSectionChildNodes(_elems, suffix, preserveRadioName);
			}
		}
    });
    
}

/**
 * Creates suffix that should be used inside duplicated repeat section
 * @param	e	Repeat section element
 */
wFORMS.behaviors.repeat.instance.prototype.createSuffix = function(e, index){

	// var idx = e.getAttribute('dindex');
	var suffix = '[' + (index ? index : '0' ) + ']';
    var reg = /\[(\d+)\]$/;
	e = e.parentNode;
	while(e){
		if(e.hasClass && (e.hasClass(wFORMS.behaviors.repeat.CSS_REPEATABLE) ||
			e.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE))){
			var idx = reg.exec(e.id);
			if(idx) idx = idx[1];
			//var idx = e.getAttribute('dindex');
			suffix = '[' + (idx ? idx : '0' ) + ']' + suffix;
		}
		e = e.parentNode;
	}
	return suffix;
}

/**
 * Removes suffix from ID id was previously set
 * @param	id	Current element id
 * @return	DOMString
 */
wFORMS.behaviors.repeat.instance.prototype.clearSuffix = function(value){
	if(!value){
		return;
	}
	if(value.indexOf('[') != -1){		
		return value.substring(0, value.indexOf('['));
	}

	return value;
}

/**
 * Updates attributes of the element in the section
 * TODO rename
 * @param	{HTMLElement}	elem
 */
wFORMS.behaviors.repeat.instance.prototype.updateAttributes = function(e, idSuffix, preserveRadioName){
	var isHint = wFORMS.behaviors.hint && wFORMS.behaviors.hint.isHintId(e.id);
	var isDuplicate = e.id.indexOf(wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK) != -1;
	// Sets that element belongs to duplicate group
	wFORMS.behaviors.repeat.setInDuplicateGroup(e);

	// TODO Check if it is neccessary
	if(wFORMS.behaviors.repeat.isHandled(e)){
		wFORMS.behaviors.repeat.removeHandled(e)
	}

	if(wFORMS.behaviors['switch'] && wFORMS.behaviors['switch'].isHandled(e)){
		wFORMS.behaviors['switch'].removeHandle(e);
	}

	// Iterates over updateable attribute names
	for(var i = 0; i < wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY.length; i++){
		var attrName = wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY[i];
		
		var value = this.clearSuffix(e.getAttribute(attrName));	
		if(!value){
			continue;
		}

		if(attrName == 'name' && e.tagName.toUpperCase() == 'INPUT' && preserveRadioName){
			continue;
		}
		if(isHint && attrName=='id'){			
			e.setAttribute('id', value + idSuffix + wFORMS.behaviors.hint.HINT_SUFFIX);
		}else if(isDuplicate){
			e.setAttribute(attrName, value.replace(new RegExp("(.*)(" + wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK + ')$'),
				"$1" + idSuffix + "$2"));
		}else{
			e.setAttribute(attrName, value + idSuffix);
		}
	}
}

/**
 * Returns index of the next created duplicate by section HTML element
 * @param	{HTMLElement}	elem
 * @return	{Integer}
 */
wFORMS.behaviors.repeat.instance.prototype.getNextDuplicateIndex = function(elem){
	var c = wFORMS.behaviors.repeat.getOrCreateCounterField(elem);
	var newValue = parseInt(c.value) + 1;
	c.value = newValue;
	return newValue;
}


/**
 * Returns counter field fo specified area if exists. Otherwise creates new one
 * @param	{HTMLElement}	elem
 * @return	{HTMLElement}
 */
wFORMS.behaviors.repeat.getOrCreateCounterField = function(elem){
		
	var cId = elem.id + wFORMS.behaviors.repeat.ID_SUFFIX_COUNTER;
	
	// Using getElementById except matchSingle because of lib bug
	// when element is not exists exception is thrown
	var cElem = document.getElementById(cId);
	if(!cElem || cElem == ''){
		cElem = wFORMS.behaviors.repeat.createCounterField(cId);
		// Trying to find form element
		var formElem = elem.parentNode;
		while(formElem && formElem.tagName.toUpperCase() != 'FORM'){
			formElem = formElem.parentNode;
		}

		formElem.appendChild(cElem);
	}
	return cElem;
}

/**
 * Creates counter field with specified ID
 * @param	{DOMString}	id
 * @return	{HTMLElement}
 */
wFORMS.behaviors.repeat.createCounterField = function(id){
	cElem = base2.DOM.bind(document.createElement('input'));
	cElem.id = id;
	cElem.setAttribute('type', 'hidden');
	cElem.setAttribute('name', id);
	cElem.value = '0';

	return cElem;
}

/**
 * Returns count of already duplicated sections. If was called from the behavior 
 * belonged to dupolicated section, returns false
 * @public
 * @DEPRECATED
 * @return	{Integer} or {boolean}
 */
wFORMS.behaviors.repeat.instance.prototype.getDuplicatedSectionsCount = function(){
	var b = wFORMS.behaviors.repeat;
	if(b.isDuplicate(this.target)){
		return false;
	}

	return parseInt(b.getOrCreateCounterField(this.target).value);
}

/**
 * Returns count of already duplicated sections. If was called from the behavior 
 * belonged to duplicated section, returns false
 * @public
 * @return	{Integer} or {boolean}
 */
wFORMS.behaviors.repeat.instance.prototype.getSectionsCount = function(){
	var b = wFORMS.behaviors.repeat;
	if(b.isDuplicate(this.target)){
		return false;
	}

	return parseInt(b.getOrCreateCounterField(this.target).value) + 1;
}


/**
 * Returns true if element is duplicate of initial group, false otherwise
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
wFORMS.behaviors.repeat.isDuplicate = function(elem){
	return elem.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE);
}

/**
 * Sets duplicate flag to element
 * @param	{HTMLElement}	elem
 */
wFORMS.behaviors.repeat.setDuplicate = function(elem){
	// elem.setAttribute(wFORMS.behaviors.repeat.ATTR_DUPLICATE, 'true');
}

/**
 * Returns true if element belongs to duplicate group
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
wFORMS.behaviors.repeat.isInDuplicateGroup = function(elem){
	return elem.getAttribute(wFORMS.behaviors.repeat.ATTR_DUPLICATE_ELEM) ? true : false;
}

/**
 * Specifies that element is inside the duplicate group
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
wFORMS.behaviors.repeat.setInDuplicateGroup = function(elem){
	return elem.setAttribute(wFORMS.behaviors.repeat.ATTR_DUPLICATE_ELEM, true);
}

/**
 * Checks if element is already handled
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
wFORMS.behaviors.repeat.isHandled = function(elem){
	return elem.getAttribute(wFORMS.behaviors.repeat.ATTR_HANDLED);
}


/**
 * Returns html element of the master section (repeatable) from its duplicate
 * @param	{HTMLElement}	elem
 * @return	{HTMLElement} or false
 */
wFORMS.behaviors.repeat.getMasterSection = function(elem){
	if(!wFORMS.behaviors.repeat.isDuplicate(elem)){
		return false;
	}
	var e = document.getElementById(elem.getAttribute(wFORMS.behaviors.repeat.ATTR_MASTER_SECTION));

	return e == '' ? null : e;
}

/**
 * Handles element
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
wFORMS.behaviors.repeat.handleElement = function(elem){
	return elem.setAttribute(wFORMS.behaviors.repeat.ATTR_HANDLED, true);
}

/**
 * Remove handled attribute from element
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
wFORMS.behaviors.repeat.removeHandled = function(elem){
	return elem.removeAttribute(wFORMS.behaviors.repeat.ATTR_HANDLED);
}

/**
 * Executes the behavior
 * @param {event} e 
 * @param {domElement} element
 */
wFORMS.behaviors.repeat.instance.prototype.run = function(e, element){ 
	this.duplicateSection(this.target);
	if(e) e.preventDefault();
}