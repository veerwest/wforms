
if (typeof(wFORMS) == "undefined") {
	throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
/**
 * wForms switch behavior.  
 * See: http://www.formassembly.com/wForms/v2.0/documentation/conditional-sections.php
 *  and http://www.formassembly.com/wForms/v2.0/documentation/examples/switch_validation.html 
 */
wFORMS.behaviors['switch']  = {

	/**
	 * Selector expression for the switch elements
     * @final
     * @see	http://www.w3.org/TR/css3-selectors/

	 */
	SELECTOR : '*[class*="switch-"]',

	/**
	 * CSS class name prefix for switch elements
     * @final
	 */
	CSS_PREFIX : 'switch-',

	/**
	 * CSS class prefix for the off state of the target element
     * @final
	 */
	CSS_OFFSTATE_PREFIX : 'offstate-',

	/**
	 * CSS class prefix for the on state of the target element
     * @final
	 */
	CSS_ONSTATE_PREFIX : 'onstate-',
	
	/**
	 * CSS class for switch elements that don't have a native ON state (ie. links)
     * @final
	 */
	CSS_ONSTATE_FLAG : 'swtchIsOn',
	
	/**
	 * CSS class for switch elements that don't have a native OFF state (ie. links)
     * @final
	 */
	CSS_OFFSTATE_FLAG : 'swtchIsOff',
	
	/**
	 * Custom function that could be overridden. 
	 * Evaluates when an element is switched on
     * @param	{HTMLElement}	elem	Duplicated section
	 */
	onSwitchOn: function(elem){ 
	},
	
	/**
	 * Custom function that could be overridden. 
	 * Evaluates when an element is switched off
     * @param	{HTMLElement}	elem	Duplicated section
	 */
	onSwitchOff: function(elem){ 
	},
	
	/**
	 * Custom function that could be overridden. 
	 * Evaluates after a switch is triggered
	 * (after all onSwitchOn and onSwitchOff events)
     * @param	{HTMLElement}	elem	Duplicated section
	 */
	onSwitch: function(form){  
	},
	
	/**
	 * Creates new instance of the behavior
     * @constructor
	 */
	instance : function(f){
		this.behavior = wFORMS.behaviors['switch']; 
		this.target   = f;
		this.cache    = {};
	}
}

/**
 * Factory Method.
 * Applies the behavior to the given HTML element by setting the appropriate event handlers.
 * @param {domElement} f An HTML element, either nested inside a FORM element or (preferably) the FORM element itself.
 * @return {object} an instance of the behavior 
 */	
wFORMS.behaviors['switch'].applyTo = function(f){
	
	while(f && f.tagName!='FORM') {
		f = f.parentNode;
	}
	if(!f) return; // bad markup
	
	// keep existing instance if possible
	var b = wFORMS.getBehaviorInstance(f,'switch');
	
	if(b) {
		// but reset cache.
		b.cache = {};	
		// will return an empty behavior to save memory (workaround. core doesn't check if the behavior returned already exists)
		ret = new Array({target:null}); 
	} else {		
		b = new wFORMS.behaviors['switch'].instance(f);
		ret = b; 	
	}		
	b.buildCache();	
	b.setupTriggers();
	b.setupTargets();
	b.onApply();
	return ret;	
}

wFORMS.behaviors['switch'].instance.prototype.setupTriggers = function() {
	for(var i in this.cache) {
		var triggers = this.cache[i].triggers;
		for(var j=0; j<triggers.length;j++) {
			this.setupTrigger(triggers[j]);
		} 
	}	
}
	
wFORMS.behaviors['switch'].instance.prototype.setupTrigger = function(elem) {
	var self = this;
	if(!elem.id){
		elem.id = wFORMS.helpers.randomId()
	}
	
	switch(elem.tagName.toUpperCase()){
		case 'OPTION' : 
			var sNode = elem.parentNode;
			// Tries to get <select node
			while (sNode && sNode.tagName != 'SELECT'){
				sNode = sNode.parentNode;
			} 		
			if(sNode && !wFORMS.behaviors['switch'].isHandled(sNode)){
				sNode.addEventListener('change', function(event) { self.run(event, sNode) }, false);
				wFORMS.behaviors['switch'].handleElement(sNode);
			}
			break;
		case 'SELECT' :
			if(elem && !wFORMS.behaviors['switch'].isHandled(elem)){
				elem.addEventListener('change', function(event) { self.run(event, elem) }, false);
				wFORMS.behaviors['switch'].handleElement(elem);
			}
			break;		
		case 'INPUT' : 
			if(elem.type && elem.type.toUpperCase() == 'RADIO'){
				
				// Retreives all radio group
				var radioGroup = elem.form[elem.name];
				for(var i=radioGroup.length-1;i>=0;i--) {
					
					var _elem = radioGroup[i];
					wFORMS.standardizeElement(_elem);	
					
					if(!this.behavior.isHandled(_elem)){
						_elem.addEventListener('click', function(event) { self.run(event, _elem) }, false);								
						this.behavior.handleElement(_elem);
					}
				}
			} else {						
				if (!this.behavior.isHandled(elem)) {
					elem.addEventListener('click', function(event){
						self.run(event, elem)
					}, false);
					this.behavior.handleElement(elem);
				}
			}
			break;
			
		default:
			if (!this.behavior.isHandled(elem)) {
				// Other type of element with a switch (links for instance).
				elem.addEventListener('click', function(event){
					self.run(event, elem)
				}, false);
				this.behavior.handleElement(elem);
			}						
			break;
	}
}

/**
 * Executed once the behavior has been applied to the document.
 * Can be overwritten.
 */
wFORMS.behaviors['switch'].instance.prototype.onApply = function() {} 



/**
 * Checks if element is already handled
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
wFORMS.behaviors['switch'].isHandled = function(elem){
	// TODO remove wHandled to final constant
	return elem.getAttribute('rel') && elem.getAttribute('rel').indexOf('wfHandled') > -1;
}

/**
 * Checks if element is already handled
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
wFORMS.behaviors['switch'].handleElement = function(elem){
	// TODO remove wHandled to final constant
	return elem.setAttribute('rel', (elem.getAttribute('rel') || "") + ' wfHandled');
}

/**
 * Removes handle attribute from element
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
wFORMS.behaviors['switch'].removeHandle = function(elem){
	// TODO remove wHandled to final constant
	if(attr = elem.getAttribute('rel')){
		if(attr == 'wfHandled'){
			elem.removeAttribute('rel');
		}else if(attr.indexOf('wfHandled') != -1){
			elem.setAttribute('rel', attr.replace(/(.*)( wfHandled)(.*)/, "$1$3"));
		}
	}
}

/**
 *
 */
wFORMS.behaviors['switch'].instance.prototype.buildCache = function() {
	
	var l = this.target.getElementsByTagName('*');
		
	for(var i=0;i<l.length;i++) {
		if(l[i].tagName) {
		
			// Iterates all elements. Lookup for triggers and targets
			if(l[i].className && l[i].className.indexOf(this.behavior.CSS_PREFIX)!=-1) {		
				this.addTriggerToCache(l[i]);	
			}
			if(l[i].className && l[i].className.indexOf(this.behavior.CSS_OFFSTATE_PREFIX)!=-1) {
				this.addTargetToCache(l[i]);			
			}
			if(l[i].className && l[i].className.indexOf(this.behavior.CSS_ONSTATE_PREFIX)!=-1) {
				this.addTargetToCache(l[i]);			
			}
		}
	}		
}

/**
 * if argument provided, invalidate cache only if element contains a switch or trigger.
 */
wFORMS.behaviors['switch'].instance.prototype.invalidateCache = function() {
	
	var resetCache = true;
	
	if(arguments.length>0) {			
		var element = document.getElementById(arguments[0]);
		if(element) {
			var resetCache = false;		
			if(!element.querySelectorAll) base2.DOM.bind(element);
			var selector = "*[class*=\""+this.behavior.CSS_PREFIX+"\"], *[class*=\""+this.behavior.CSS_OFFSTATE_PREFIX+"\"], *[class*=\""+this.behavior.CSS_ONSTATE_PREFIX+"\"]";
			var l = element.querySelectorAll(selector);
			if(l.length>0 || element.className && 
							 (element.className.indexOf(this.behavior.CSS_PREFIX)!=-1 || 
							  element.className.indexOf(this.behavior.CSS_OFFSTATE_PREFIX) != -1 ||
							  element.className.indexOf(this.behavior.CSS_ONSTATE_PREFIX)!=-1)) {
				resetCache = true;
			}
		}
	}	
	if(resetCache) {
		this.cache = {};	
		this.buildCache();
	}
}

wFORMS.behaviors['switch'].instance.prototype.addTriggerToCache = function(element) {
	
	// For selects, make sure to get the <SELECT> element.
	if(element.tagName =='OPTION') {
		var sNode = element.parentNode;
		// Tries to get <select node
		while (sNode && sNode.tagName != 'SELECT'){
			sNode = sNode.parentNode;
		} 
		if(!sNode){
			return; // bad markup
		}
		element = sNode;	
	}	

	wFORMS.standardizeElement(element);
						
	var t = this.getTriggers(new Array(element));
	
	for(var i=0;i< t.ON.length; i++) {
		var switchName = t.ON[i];
		
		if(typeof this.cache[switchName]== 'undefined') {
			this.cache[switchName] = { triggers: [], targets: []};
		}
		for(var j=0;j<this.cache[switchName].triggers.length;j++) {
			if(this.cache[switchName].triggers[j]==element) {
				break;
			}
		}
		if(j==this.cache[switchName].triggers.length) {
			this.cache[switchName].triggers.push(element);
		}
	}
	for(var i=0;i< t.OFF.length; i++) {
		var switchName = t.OFF[i];
		if(typeof this.cache[switchName]== 'undefined') {
			this.cache[switchName] = { triggers: [], targets: []};
		}
		for(var j=0;j<this.cache[switchName].triggers.length;j++) {
			if(this.cache[switchName].triggers[j]==element) {
				break;
			}
		}
		if(j==this.cache[switchName].triggers.length) {
			this.cache[switchName].triggers.push(element);
		}
	}		
	
}

wFORMS.behaviors['switch'].instance.prototype.addTargetToCache = function(element) {
		
	wFORMS.standardizeElement(element);
		
	var switchNames = this.behavior.getSwitchNamesFromTarget(element);
			
	for(var i=0;i<switchNames.length; i++) {
		switchName = switchNames[i];
		if(typeof this.cache[switchName]== 'undefined') {
			this.cache[switchName] = { triggers: [], targets: []};
		}
		for(var j=0;j<this.cache[switchName].targets.length;j++) {
			if(this.cache[switchName].targets[j]==element) {
				break;
			}
		}
		if(j==this.cache[switchName].targets.length) {
			this.cache[switchName].targets.push(element);
		}
	}
}

 
/**
 * Returns object with two triggers collection: ON, OFF
 * @param	{Array}	elems	HTML Elements array to create triggers from
 * @param	{Array}	includeSwitches	Only that switches should be included
 * @returns	{Object}	Object of type {ON: Array, OFF: Array}
 *
 */
wFORMS.behaviors['switch'].instance.prototype.getTriggers = function(elems, includeSwitches){
	var o = {
		ON : new Array(), 
		OFF : new Array(), 
		toString : function(){
			return "ON: " + this.ON + "\nOFF: " + this.OFF
		}
	};
	for(var i=0;i<elems.length;i++) {
		var elem = elems[i];
		
		switch(elem.tagName.toUpperCase()){
			case 'OPTION' :
				if(elem.selected){
					o.ON = o.ON.concat(this.behavior.getSwitchNamesFromTrigger(elem, includeSwitches));
				}else{
					o.OFF = o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(elem, includeSwitches));
				}
				break;
				
			case 'SELECT' : 
				for(var j=0; j < elem.options.length; j++){
					var opt = elem.options.item(j);
					if(opt.selected){
						o.ON = o.ON.concat(this.behavior.getSwitchNamesFromTrigger(opt, includeSwitches));
					}else{
						o.OFF = o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(opt, includeSwitches));
					}
				}
				break;

			case 'INPUT' : 
				if(elem.type && elem.type.toUpperCase() == 'RADIO'){					
					var radioGroup = elem.form[elem.name];
					if(!radioGroup) break; // bad markup
					for(var j=radioGroup.length-1;j>=0;j--) {						
						var _elem = radioGroup[j];
						// Do not call getSwitchNamesFromTrigger on this radio input 
						// if we have/will process it anyway because it's part of the 
						// collection being evaluated. 
						if(_elem==elem || !wFORMS.helpers.contains(elems, _elem)) { 							
							if(_elem.checked){
								o.ON  = o.ON.concat(this.behavior.getSwitchNamesFromTrigger(_elem, includeSwitches));
							} else {
								o.OFF = o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(_elem, includeSwitches));
							}						
						}
					}					
				}else{
					if(elem.checked){
						o.ON = o.ON.concat(this.behavior.getSwitchNamesFromTrigger(elem, includeSwitches));
					}else{
						o.OFF = o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(elem, includeSwitches));
					}
				}
				break;
				
			default:
				if(elem.hasClass(this.behavior.CSS_ONSTATE_FLAG)){
					o.ON  = o.ON.concat(this.behavior.getSwitchNamesFromTrigger(elem, includeSwitches));
				}else{
					o.OFF = o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(elem, includeSwitches));
				}
				break;
		}
	}
	
	// remove duplicates in arrays
	var _ON = new Array(); 
	for(var i=0;i<o.ON.length;i++) {
		if(!wFORMS.helpers.contains(_ON,o.ON[i])) {
			_ON.push(o.ON[i]);
		}
		
	}
	var _OFF = new Array(); 
	for(var i=0;i<o.OFF.length;i++) {
		if(!wFORMS.helpers.contains(_OFF,o.OFF[i])) {
			_OFF.push(o.OFF[i]);
		}		
	}
	o.ON  = _ON;
	o.OFF = _OFF;
	
	return o;
}

/**
 * Returns all switch names for given trigger element
 * @param	{HTMLElement}	elem
 * @param	{Array}	includeSwitches	Only that switches should be included
 * @return	Array
 */
wFORMS.behaviors['switch'].getSwitchNamesFromTrigger = function(elem, includeSwitches){
	return wFORMS.behaviors['switch'].getSwitchNames(elem.className, "trigger", includeSwitches);
}

/**
 * Returns all switch names for given target element
 * @param	{HTMLElement}	elem
 * @param	{Array}	includeSwitches	Only that switches should be included
 * @return	Array
 */
wFORMS.behaviors['switch'].getSwitchNamesFromTarget = function(elem, includeSwitches){
	return wFORMS.behaviors['switch'].getSwitchNames(elem.className,"target", includeSwitches);
}


/**
 * Returns all switch names for given element
 * @param	{string}	value of class attribute
 * @param	{string}	switch part ('trigger' or 'target') 
 * @param	{Array}		Only these switches should be included
 * @return	Array
 */
wFORMS.behaviors['switch'].getSwitchNames = function(className, switchPart, includeSwitches){
	if(!className || className=='') return [];
	
	var names  = className.split(" ");
	var _names = new Array();
	
	if(switchPart=='trigger') 
		var doTriggers = true;
	else 
		var doTriggers = false; // do switch targets
	
	for(var i=names.length-1;i>=0;i--) {		
		var cn = names[i];
		if(doTriggers) {
			if(cn.indexOf(this.CSS_PREFIX)==0) 
				var sn = cn.substring(this.CSS_PREFIX.length);
		} else {
			if(cn.indexOf(this.CSS_ONSTATE_PREFIX)==0) 
				var sn = cn.substring(this.CSS_ONSTATE_PREFIX.length);
			else if(cn.indexOf(this.CSS_OFFSTATE_PREFIX)==0) 
				var sn = cn.substring(this.CSS_OFFSTATE_PREFIX.length);
		}
		if(sn && (!includeSwitches || wFORMS.helpers.contains(includeSwitches, sn))){
			_names.push(sn);
		}
	}
	return _names;
}

/**
 * 
 */
wFORMS.behaviors['switch'].instance.prototype.getTriggersByTarget = function(target){
	var res = new Array();
	
	var names = wFORMS.behaviors['switch'].getSwitchNamesFromTarget(target);
	var b = wFORMS.behaviors.repeat;

	for(var i=0;i<names.length;i++) {
		var c = this.cache[names[i]];
		if(c) {
			for(j=0; j<c.triggers.length;j++) {
				var elem = c.triggers[j];				
				res.push(elem); 
			}
		} 
	}
	return this.getTriggers(res, names);	
}

/**
 * Checks if provided element is switched off
 * @param	{HTMLElement}	elem
 * @return	{bool}
 * @public
 */
wFORMS.behaviors['switch'].isSwitchedOff = function(elem){
	return (elem.className.match(
		new RegExp(wFORMS.behaviors['switch'].CSS_OFFSTATE_PREFIX + "[^ ]*")) ?
		true : false) &&
		(elem.className.match(
		new RegExp(wFORMS.behaviors['switch'].CSS_ONSTATE_PREFIX + "[^ ]*")) ?
		false : true) ; 
}

/**
 * Setups targets depends on switches and control state. I.e. if control is ON
 * Targets should be ON. 
 */
wFORMS.behaviors['switch'].instance.prototype.setupTargets = function(){

	for(var i in this.cache) {
		
		for(var j=0; j< this.cache[i].triggers.length; j++) {
			var elem = this.cache[i].triggers[j];
		
			// Switch link state is set with the class 'swtchIsOn'/'swtchIsOff' 
			if(elem.tagName!='A' || elem.hasClass(this.behavior.CSS_ONSTATE_FLAG)) {
				this.run(null, elem)
			}			
		}		
	}	
}

wFORMS.behaviors['switch'].instance.prototype.inScope = function(trigger, target) {
	var br = wFORMS.behaviors.repeat;
	if(br) {
		var triggerRepeat = trigger;
		while (triggerRepeat && !triggerRepeat.hasClass(br.CSS_REMOVEABLE) &&  !triggerRepeat.hasClass(br.CSS_REPEATABLE)) {						
			triggerRepeat = triggerRepeat.parentNode;
			if(triggerRepeat) {
				wFORMS.standardizeElement(triggerRepeat);
			}			
		}
		
		if (triggerRepeat) {
			// trigger is in a repeated section. Check if target belong to same.
			
			var isInRepeat = false;			
			while(target) {
				if(target.hasClass(br.CSS_REMOVEABLE) ||  target.hasClass(br.CSS_REPEATABLE)) {
					isInRepeat = true;
				}
				if(target==triggerRepeat) {
					return true;
				}
				target = target.parentNode;
				if(target) {
					wFORMS.standardizeElement(target);
				}	
			}
			return !isInRepeat;
		}
	}
	return true;
}
/**
 * Executes the behavior
 * @param {event} e Event caught. (!In current implementation it could be null in case of the initialization)
 * @param {domElement} element
 */
wFORMS.behaviors['switch'].instance.prototype.run = function(e, element){ 
	
	wFORMS.standardizeElement(element);
	// If this element does not have a native state attribute (ie. checked/selected)
	// the classes CSS_ONSTATE_FLAG|CSS_OFFSTATE_FLAG are used and must be switched.
	if(element.hasClass(this.behavior.CSS_ONSTATE_FLAG)) {	 	
		element.removeClass(this.behavior.CSS_ONSTATE_FLAG);
		element.addClass(this.behavior.CSS_OFFSTATE_FLAG);
		if(e) e.preventDefault();
		
	} else if(element.hasClass(this.behavior.CSS_OFFSTATE_FLAG)) {
		element.removeClass(this.behavior.CSS_OFFSTATE_FLAG);
		element.addClass(this.behavior.CSS_ONSTATE_FLAG);
		if(e) e.preventDefault();
	}
		
	var triggers = this.getTriggers(new Array(element));
	
	for(var i=0; i<triggers.OFF.length;i++) {
		var switchName = triggers.OFF[i];
		
		for(var j=0; j<this.cache[switchName].targets.length;j++) {
			var elem = this.cache[switchName].targets[j];
						
			if(!this.inScope(element,elem)) {
				continue;
			}
						
			wFORMS.standardizeElement(elem);
			
			elem.addClass(wFORMS.behaviors['switch'].CSS_OFFSTATE_PREFIX + switchName);
			elem.removeClass(wFORMS.behaviors['switch'].CSS_ONSTATE_PREFIX + switchName);
			
			var _triggers = this.getTriggersByTarget(elem);
			if(_triggers.ON.length == 0){				
				this.behavior.onSwitchOff(elem);
			}
		}				
	}
	for(var i=0; i<triggers.ON.length;i++) {
		var switchName = triggers.ON[i];
		for(var j=0; j<this.cache[switchName].targets.length;j++) {			
			var elem = this.cache[switchName].targets[j];
			
			if(!this.inScope(element,elem)) {
				continue;
			}
			
			wFORMS.standardizeElement(elem);
			
			elem.removeClass(this.behavior.CSS_OFFSTATE_PREFIX + switchName);
			elem.addClass(this.behavior.CSS_ONSTATE_PREFIX + switchName);			
			this.behavior.onSwitchOn(elem);			
		}				
	}
		
	if(b = wFORMS.getBehaviorInstance(this.target, 'paging')){
		b.setupManagedControls();
	}	
	this.behavior.onSwitch(this.target);	
}

