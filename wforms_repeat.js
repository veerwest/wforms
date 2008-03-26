	
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
	 * Suffix for the ID of 'repeat' link
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
	onRepeat : function(elem){},

	/**
	 * Custom function that could be overridden. 
	 * Evaluates when section is removed
	 */
	onRemove : function(){},

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

/*
 * Temporary shortcuts
 */
var _b = wFORMS.behaviors.repeat;
var _i = wFORMS.behaviors.repeat.instance;

/**
 * Factory Method.
 * Applies the behavior to the given HTML element by setting the appropriate event handlers.
 * @param {domElement} f An HTML element, either nested inside a FORM element or (preferably) the FORM element itself.
 * @return {object} an instance of the behavior 
 */	
_b.applyTo = function(f) {
	// look up for the all elements that could be repeated.
	// Trying to add event listeners to elements for adding new container.
	// If need create Add new section element
	var _self = this;
	var b = new Array();
	
	if(!f.querySelectorAll) base2.DOM.bind(f);
	
	f.querySelectorAll(this.SELECTOR_REPEAT).forEach(
		function(elem){
			if(_self.isHandled(elem)){
				return ;
			}
			if(!elem.id) elem.id = wFORMS.helpers.randomId();
			
			var _b = new _self.instance(elem);
			var e = _b.getOrCreateRepeatLink(elem);
			e.addEventListener('click', function(event) { _b.run(event, e) }, false);
			_b.setElementHandled(elem);
			b.push(_b);							
		}
	);
	
	f = base2.DOM.bind(f);
	if(f.hasClass(this.CSS_REMOVEABLE)){
		var m  = this.getMasterSection(f);		
		var _i = wFORMS.getBehaviorInstance(m, 'repeat');
		if(_i) {
			_i.getOrCreateRemoveLink(f);
		} else if(b[0]){
			b[0].getOrCreateRemoveLink(f);
		}
	}
	
	f.querySelectorAll(this.SELECTOR_REMOVEABLE).forEach(function(e){
		var m  = wFORMS.behaviors.repeat.getMasterSection(e);
		var _i = wFORMS.getBehaviorInstance(m, 'repeat');
		if(_i) {
			_i.getOrCreateRemoveLink(e);
		} else if(b[0]){
			b[0].getOrCreateRemoveLink(e);
		}
	});
	
	for(var i=0;i<b.length;i++) {
		b[i].onApply();
	}
	return b;
}

/**
 * Executed once the behavior has been applied to the document.
 * Can be overwritten.
 */
_i.prototype.onApply = function() {} 


/**
 * Returns repeat link for specified area if it exists, 
 * otherwise creates new one and returns it
 * @param	{HTMLElement}	elem	Element repeat link is related to
 * @return	{HTMLElement}
 */
_i.prototype.getOrCreateRepeatLink = function(elem){
	var id = elem.id + this.behavior.ID_SUFFIX_DUPLICATE_LINK;
	var e = document.getElementById(id);
	if(!e || e == ''){
		e = this.createRepeatLink(id);
		
		// Wraps in a span for better CSS positionning control.
		var spanElem = document.createElement('span');
		spanElem.className = this.behavior.CSS_DUPLICATE_SPAN;
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
_i.prototype.createRepeatLink = function(id){
	// Creates repeat link element
	var linkElem = document.createElement("A");
				
	linkElem.id = id;
	linkElem.setAttribute('href', '#');	
	linkElem.className = this.behavior.CSS_DUPLICATE_LINK;
	linkElem.setAttribute('title', this.behavior.MESSAGES.ADD_TITLE);	

	// Appends text inside the <span element (for CSS replacement purposes) to <a element
	linkElem.appendChild(document.createElement('span').appendChild(
		document.createTextNode(this.behavior.MESSAGES.ADD_CAPTION)));

	return linkElem;
}

/*
 * Add remove link to duplicated section
 * @param 	{DOMElement}	duplicated section.
 */ 	
_i.prototype.getOrCreateRemoveLink= function(elem){
	var e  = this.createRemoveLink(elem.id);
	// looking for the place where to paste link
	if(elem.tagName == 'TR'){
		var tds = elem.getElementsByTagName('TD');
		var tdElem = tds[tds.length-1];
		tdElem.appendChild(e);
	} else {
		elem.appendChild(e)
	}
}

/**
 * Returns remove link for specified area 
 * @param	{DOMString}	id	ID of the field group
 * @return	{HTMLElement}
 */
_i.prototype.createRemoveLink = function(id){
	// Creates repeat link element
	var linkElem = document.createElement("a");
	
	linkElem.id = id + this.behavior.ID_SUFFIX_DUPLICATE_LINK;
	linkElem.setAttribute('href', '#');	
	linkElem.className = this.behavior.CSS_DELETE_LINK;
	linkElem.setAttribute('title', this.behavior.MESSAGES.REMOVE_TITLE);	
	linkElem.setAttribute(this.behavior.ATTR_LINK_SECTION_ID, id);

	// Appends text inside the <span element (for CSS image replacement) to <a element
	var spanElem = document.createElement('span');
	spanElem.appendChild(document.createTextNode(this.behavior.MESSAGES.REMOVE_CAPTION));
	linkElem.appendChild(spanElem);

	var _self = this;
	linkElem.onclick = function(event) { _self.onRemoveLinkClick(event, linkElem); };	

	// Wraps in a span for better CSS positionning control.
	var spanElem = document.createElement('span');
	spanElem.className = this.behavior.CSS_DELETE_SPAN;
	spanElem.appendChild(linkElem);
	
	return spanElem;
}


/**
 * Duplicates repeat section. Changes ID of the elements, adds event listeners
 * @param	{HTMLElement}	elem	Element to duplicate
 */
_i.prototype.duplicateSection = function(elem){
	// Call custom function. By default return true
	if(!this.behavior.allowRepeat(elem, this)){
		return false;
	}
	this.updateMasterSection(elem);
	
	// Creates clone of the group
	var newElem = elem.cloneNode(true);	
	newElem = elem.parentNode.insertBefore(newElem, this.getInsertNode(elem));

	this.updateDuplicatedSection(newElem);	
	wFORMS.applyBehaviors(newElem);
	// Calls custom function
	this.behavior.onRepeat(newElem);
	
	wFORMS.helpers.spotlight(newElem);
}

/**
 * Removes section specified by id
 * @param	{DOMElement}	element to remove
 */
_i.prototype.removeSection = function(elem){
	if(elem){
		// Removes section
		elem.parentNode.removeChild(elem);
		// Calls custom function
		this.behavior.onRemove();
	}
}
/**
 * Looking for the place where to insert the cloned element
 * @param 	{DOMElement} 	source element
 * @return 	{DOMElement} 	target element for 'insertBefore' call.
 */
_i.prototype.getInsertNode = function(elem) {
 	var insertNode = elem.nextSibling;
 	
 	if(insertNode && insertNode.nodeType==1 && !insertNode.hasClass) {
		insertNode = base2.DOM.bind(insertNode); 
	}
  	
	while(insertNode && 
		 (insertNode.nodeType==3 ||       // skip text-node that can be generated server-side when populating a previously repeated group 
		  insertNode.hasClass(this.behavior.CSS_REMOVEABLE))) {						
		
		insertNode = insertNode.nextSibling;
		
		if(insertNode && insertNode.nodeType==1 && !insertNode.hasClass) {
			insertNode = base2.DOM.bind(insertNode);
		}
	}
	return insertNode;
}
/**
 * Evaluates when user clicks Remove link
 * @param	{DOMEvent}		Event	catched
 * @param	{HTMLElement}	elem	Element produced event
 */
_i.prototype.onRemoveLinkClick = function(event, link){
	var e  = document.getElementById(link.getAttribute(this.behavior.ATTR_LINK_SECTION_ID));
	this.removeSection(e);
	if(event) event.preventDefault();
}

/**
 * Updates attributes inside the master element
  * @param	{HTMLElement}	elem
 */
_i.prototype.updateMasterSection = function(elem){
	// do it once 
	if(elem.doItOnce==true)
		return true;
	else
		elem.doItOnce=true;

	var suffix = this.createSuffix(elem);
	elem.id = this.clearSuffix(elem.id) + suffix;
	
	this.updateMasterElements(elem, suffix);
}
_i.prototype.updateMasterElements  = function(elem, suffix){
	
	if(!elem || elem.nodeType!=1) 
		return;
	
	var cn = elem.childNodes;
	for(var i=0;i<cn.length;i++) {
		var n = cn[i];
		if(n.nodeType!=1) continue;
		
		if(!n.hasClass) { // no base2.DOM.bind to speed up function 
			n.hasClass = function(className) { return base2.DOM.HTMLElement.hasClass(this,className) };
		}
		
		// suffix may change for this node and child nodes, but not sibling nodes, so keep a copy
		var siblingSuffix = suffix;
		if(n.hasClass(this.behavior.CSS_REPEATABLE)) {
			suffix += "[0]";
		}
		if(!n.hasClass(this.behavior.CSS_REMOVEABLE)){
			// Iterates over updateable attribute names
			for(var j = 0; j < this.behavior.UPDATEABLE_ATTR_ARRAY.length; j++){
				var attrName = this.behavior.UPDATEABLE_ATTR_ARRAY[j];
				var value = this.clearSuffix(n.getAttribute(attrName));
				if(!value){
					continue;
				}				
				if(attrName=='id' && wFORMS.behaviors.hint && wFORMS.behaviors.hint.isHintId(n.id)){
					n.id = value.replace(new RegExp("(.*)(" + wFORMS.behaviors.hint.HINT_SUFFIX + ')$'),"$1" + suffix + "$2");
				} else if(attrName=='id' && wFORMS.behaviors.validation && wFORMS.behaviors.validation.isErrorPlaceholderId(n.id)){
					n.id = value.replace(new RegExp("(.*)(" + wFORMS.behaviors.validation.ERROR_PLACEHOLDER_SUFFIX + ')$'),"$1" + suffix + "$2"); 
				} else if(attrName=='id' && n.id.indexOf(this.behavior.ID_SUFFIX_DUPLICATE_LINK) != -1){
					n.id = value.replace(new RegExp("(.*)(" + this.behavior.ID_SUFFIX_DUPLICATE_LINK + ')$'), "$1" + suffix + "$2");
				} else if(attrName=='id'){ 
					n.id = value + suffix;		// do not use setAttribute for the id property (doesn't work in IE6)	
				} else if(attrName=='name'){ 
					n.name = value + suffix;	// do not use setAttribute for the name property (doesn't work in IE6)	
				} else {
					n.setAttribute(attrName, value + suffix);	
				}
			}			
			this.updateMasterElements(n, suffix);
		}
		// restore suffix for siblings if needed.
		suffix = siblingSuffix;
	}
}

/**
 * Updates attributes inside the duplicated tree
 * TODO rename
 * @param	{HTMLElement}	elem
 */
_i.prototype.updateDuplicatedSection = function(elem){
	
	var index  = this.getNextDuplicateIndex(this.target);
	var suffix = this.createSuffix(elem, index);

	// Caches master section ID in the dublicate
	elem[this.behavior.ATTR_MASTER_SECTION]=elem.id;
	
	
	// Updates element ID (possible problems when repeat element is Hint or switch etc)
	elem.id = this.clearSuffix(elem.id) + suffix;
	// Updates classname	
	elem.className = elem.className.replace(this.behavior.CSS_REPEATABLE, this.behavior.CSS_REMOVEABLE);

	if(!elem.hasClass) { // no base2.DOM.bind to speed up function 
		elem.hasClass = function(className) { return base2.DOM.HTMLElement.hasClass(this,className) };
	}
	// Check for preserverRadioName override
	if(elem.hasClass(this.behavior.CSS_PRESERVE_RADIO_NAME)) 
		var _preserveRadioName = true;
	else
		var _preserveRadioName = this.behavior.preserveRadioName;
	
	this.updateSectionChildNodes(elem, suffix, _preserveRadioName);
}


/**
 * Updates NodeList. Changes ID and names attributes
 * For different node elements suffixes could be different - i.e. for the nested
 * repeat section IDs and names should store parent section number
 * @param	elems	Array of the elements should be updated
 * @param	suffix	Suffix value should be added to attributes
 */
_i.prototype.updateSectionChildNodes = function(elem, suffix, preserveRadioName){
	
	var removeStack = new Array();
	var l=elem.childNodes.length;
	for(var i=0;i<l;i++) {
		var e = elem.childNodes[i];
		if(e.nodeType!=1) {
			// skip text nodes 
			continue;
		}
		if(!e.hasClass) { // no base2.DOM.bind to speed up function 
			e.hasClass = function(className) { return base2.DOM.HTMLElement.hasClass(this,className) };
		}
		// Removes created descendant duplicated group if any
		if(this.behavior.isDuplicate(e)){
			removeStack.push(e);
			continue;
		}
		// Removes duplicate link
		if(e.hasClass(this.behavior.CSS_DUPLICATE_SPAN)){
			removeStack.push(e);
			continue;
		}
		if(e.hasClass(this.behavior.CSS_DUPLICATE_LINK)){
			removeStack.push(e);
			continue;
		}
				
		// Clears value	(TODO: select?)
		if(e.tagName == 'INPUT' || e.tagName == 'TEXTAREA'){
			if(e.type != 'radio' && e.type != 'checkbox'){
				e.value = '';
			} else {
				e.checked = false;
			}
		}
		
		this.updateAttributes(e, suffix, preserveRadioName);
		
		if(e.hasClass(this.behavior.CSS_REPEATABLE)){
			this.updateSectionChildNodes(e, this.createSuffix(e), preserveRadioName);
		} else{
			this.updateSectionChildNodes(e, suffix, preserveRadioName);
		}
   	}    
   	for(var i=0;i<removeStack.length;i++){
   		var e = removeStack[i];
   		if(e.clearAttributes) {
			// detach all event handler 
			e.clearAttributes(false); 	
		}
   		if(e.parentNode) e.parentNode.removeChild(e);
   	}
   	
	
}

/**
 * Creates suffix that should be used inside duplicated repeat section
 * @param	e	Repeat section element
 */
_i.prototype.createSuffix = function(e, index){

	// var idx = e.getAttribute('dindex');
	var suffix = '[' + (index ? index : '0' ) + ']';
    var reg = /\[(\d+)\]$/;
	e = e.parentNode;
	while(e){
		if(e.hasClass && (e.hasClass(this.behavior.CSS_REPEATABLE) ||
			e.hasClass(this.behavior.CSS_REMOVEABLE))){
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
_i.prototype.clearSuffix = function(value){
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
_i.prototype.updateAttributes = function(e, idSuffix, preserveRadioName){
	var isHint = wFORMS.behaviors.hint && wFORMS.behaviors.hint.isHintId(e.id);
	var isErrorPlaceholder = wFORMS.behaviors.validation && wFORMS.behaviors.validation.isErrorPlaceholderId(e.id);
	var isDuplicateLink = e.id.indexOf(this.behavior.ID_SUFFIX_DUPLICATE_LINK) != -1;

	// Sets that element belongs to duplicate group
	this.setInDuplicateGroup(e);

	if(this.behavior.isHandled(e)){
		this.removeHandled(e)
	}

	if(wFORMS.behaviors['switch'] && wFORMS.behaviors['switch'].isHandled(e)){
		wFORMS.behaviors['switch'].removeHandle(e);
	}

	// Iterates over updateable attribute names
	var l = this.behavior.UPDATEABLE_ATTR_ARRAY.length;
	for(var i = 0; i < l; i++){
		var attrName = this.behavior.UPDATEABLE_ATTR_ARRAY[i];
		
		var value = this.clearSuffix(e.getAttribute(attrName));	
		if(!value){
			continue;
		}

		if(attrName == 'name' && e.tagName == 'INPUT' && preserveRadioName){
			continue;
		} else if(isErrorPlaceholder && attrName=='id'){	
			e.id = value + idSuffix + wFORMS.behaviors.validation.ERROR_PLACEHOLDER_SUFFIX;
		} else if(isHint && attrName=='id'){			
			e.id = value + idSuffix + wFORMS.behaviors.hint.HINT_SUFFIX;
		} else if(isDuplicateLink && attrName=='id'){
			e.id = value.replace(new RegExp("(.*)(" + this.behavior.ID_SUFFIX_DUPLICATE_LINK + ')$'),"$1" + idSuffix + "$2");
		} else if(attrName=='id'){ 
			e.id = value + idSuffix;	// do not use setAttribute for the id property (doesn't work in IE6)	
		} else if(attrName=='name'){ 
			e.name = value + idSuffix;	// do not use setAttribute for the id property (doesn't work in IE6)	
		} else {
			e.setAttribute(attrName, value + idSuffix);	
		}
	}
}

/**
 * Returns index of the next created duplicate by section HTML element
 * @param	{HTMLElement}	elem
 * @return	{Integer}
 */
_i.prototype.getNextDuplicateIndex = function(elem){
	var c = this.getOrCreateCounterField(elem);
	var newValue = parseInt(c.value) + 1;
	c.value = newValue;
	return newValue;
}


/**
 * Returns counter field fo specified area if exists. Otherwise creates new one
 * @param	{HTMLElement}	elem
 * @return	{HTMLElement}
 */
_i.prototype.getOrCreateCounterField = function(elem){
		
	var cId = elem.id + this.behavior.ID_SUFFIX_COUNTER;
	
	// Using getElementById except matchSingle because of lib bug
	// when element is not exists exception is thrown
	var cElem = document.getElementById(cId);
	if(!cElem || cElem == ''){
		cElem = this.createCounterField(cId);
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
_i.prototype.createCounterField = function(id){
	cElem = document.createElement('input');
	cElem.id = id;
	cElem.setAttribute('type', 'hidden');
	cElem.setAttribute('name', id);
	cElem.value = '0';
	return cElem;
}

/**
 * Returns count of already duplicated sections. If was called from the behavior 
 * belonged to duplicated section, returns false
 * @public
 * @return	{Integer} or {boolean}
 */
_i.prototype.getSectionsCount = function(){
	if(this.behavior.isDuplicate(this.target)){
		return false;
	}
	return parseInt(this.getOrCreateCounterField(this.target).value) + 1;
}

/**
 * Specifies that element is inside the duplicate group
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
_i.prototype.setInDuplicateGroup = function(elem){
	return elem.setAttribute(this.behavior.ATTR_DUPLICATE_ELEM, true);
}


/**
 * setElementHandled
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
_i.prototype.setElementHandled = function(elem){
	return elem.setAttribute(this.behavior.ATTR_HANDLED, true);
}

/**
 * Remove handled attribute from element
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
_i.prototype.removeHandled = function(elem){
	return elem.removeAttribute(this.behavior.ATTR_HANDLED);
}

/**
 * Returns true if element is duplicate of initial group, false otherwise
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
_b.isDuplicate = function(elem){
	return elem.hasClass(this.CSS_REMOVEABLE);
}


/**
 * Returns true if element belongs to duplicate group
 * (to be used by other behaviors) 
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
_b.isInDuplicateGroup = function(elem){
	return elem.getAttribute(this.ATTR_DUPLICATE_ELEM) ? true : false;
}


/**
 * Checks if element is already handled
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
_b.isHandled = function(elem){
	return elem.getAttribute(this.ATTR_HANDLED);
}


/**
 * Returns html element of the master section (repeatable) from its duplicate
 * @param	{HTMLElement}	elem
 * @return	{HTMLElement} or false
 */
_b.getMasterSection = function(elem){
	if(!this.isDuplicate(elem)) return false;	
	return document.getElementById(elem[this.ATTR_MASTER_SECTION]);
}


/**
 * Executes the behavior
 * @param {event} e 
 * @param {domElement} element
 */
_i.prototype.run = function(e, element){ 	
	this.duplicateSection(this.target);
	if(e) e.preventDefault();
}