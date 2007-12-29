
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
     * @TODO	Possible change hint due to switch could be not the very first prefix
     * 			but element could contains it as a CSS class
     * @TODO	!!!!!! for some reasons it is not working with IE!!!
     * 			looks like IE does not support selecting by class with selectors
     *			but selectors API allows such thing
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
		this.target = f;
	}
}

/**
 * Factory Method.
 * Applies the behavior to the given HTML element by setting the appropriate event handlers.
 * @param {domElement} f An HTML element, either nested inside a FORM element or (preferably) the FORM element itself.
 * @return {object} an instance of the behavior 
 */	
wFORMS.behaviors['switch'].applyTo = function(f){
	var b = new wFORMS.behaviors['switch'].instance(f);	
	// Iterates all switch elements. Lookup for its triggers and add event listeners
	f.querySelectorAll(wFORMS.behaviors['switch'].SELECTOR).forEach(
		function(elem){
			if(!elem.id){
				elem.id = wFORMS.helpers.randomId()
			}
			switch(elem.tagName.toUpperCase()){
				case 'OPTION' : 
					var sNode = elem.parentNode;
					// Tries to get <select node
					while (sNode && sNode.tagName.toUpperCase() != 'SELECT'){
						sNode = sNode.parentNode;
					} 

					base2.DOM.bind(sNode);

					if(sNode && !wFORMS.behaviors['switch'].isHandled(sNode)){
						sNode.addEventListener('change', function(event) { b.run(event, sNode) }, false);
						b.setupTargets(elem);
						wFORMS.behaviors['switch'].handleElement(sNode);
					}
					break;

				case 'INPUT' : 
					if(elem.type && elem.type.toUpperCase() == 'RADIO'){
						if(!wFORMS.behaviors['switch'].isHandled(elem)){
							b.setupTargets(elem);		
						}
						// Retreives all radio group
						var radioGroup = elem.form[elem.name];
						for(var i=radioGroup.length-1;i>=0;i--) {
							// [don] Added element binding
							var _elem = base2.DOM.bind(radioGroup[i]);
							if(!wFORMS.behaviors['switch'].isHandled(_elem)){
								_elem.addEventListener('click', function(event) { b.run(event, _elem) }, false);								
								wFORMS.behaviors['switch'].handleElement(_elem);
							}
						}
					}else{
						elem.addEventListener('click', function(event) { b.run(event, elem) }, false);
						b.setupTargets(elem);
					}
					break;
					
				default:
					// Other type of element with a switch (links for instance).
					// The behavior is not run on initialization (no b.setupTargets(elem))
					elem.addEventListener('click', function(event) { b.run(event, elem) }, false);					
					break;
			}
		}
	);

	return b;
}


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
 * Returns object with two triggers collection: ON, OFF
 * @param	{Array}	elems	HTML Elements array to create triggers from
 * @param	{Array}	includeSwitches	Only that switches should be included
 * @returns	{Object}	Object of type {ON: Array, OFF: Array}
 *
 * Notes: 
 * May 26th (CS) Replaced base2.forEach with a regular loop when possible
 *               Fixed ON/OFF array to remove duplicates
 *               Replaced base2.querySelectorAll to get a radio group. Used form.fields collection instead.
 */
wFORMS.behaviors['switch'].instance.prototype.getTriggersByElements = function(elems, includeSwitches){
	var o = {
		ON : new Array(), 
		OFF : new Array(), 
		toString : function(){
			return "ON: " + this.ON + "\nOFF: " + this.OFF
		}
	};
	for(var i=0;i<elems.length;i++) {
		var elem = elems[i];
		
		// TODO on switch if checked.
		switch(elem.tagName.toUpperCase()){
			case 'OPTION' :
				if(elem.selected){
					o.ON = o.ON.concat(this.behavior.getSwitchNamesFromTrigger(elem, includeSwitches));
				}else{
					o.OFF = o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(elem, includeSwitches));
				}
				break;
				
			case 'SELECT' : 
				// TODO Check behavior
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
	//console.log(_names);
	return _names;
}

/**
 * Returns all elements associated with switch name
 * @TODO	Remove to pre-cache
 * @param	{String}	sName
 * @param   'ON'|'OFF'	Specifies whether 'on-state' or 'off-state' elements should be returned 
 * @returns	StaticNodeList
 */
wFORMS.behaviors['switch'].instance.prototype.getTargetsBySwitchName = function(sName, state){
	var res = new Array();
	var clazz = this;
	var b = wFORMS.behaviors.repeat;
	
	if(arguments[1]=='ON')
		var className = [wFORMS.behaviors['switch'].CSS_ONSTATE_PREFIX + sName];
	else {
		var className = [wFORMS.behaviors['switch'].CSS_OFFSTATE_PREFIX + sName];
	}
	
	this.target.querySelectorAll("."+className).forEach(
		function(elem){
			// In case target found, IS in the duplicate group and this 
			// behavior target is NOT in the duplicate section and NOT dupicate itself
			// SKIP this target
			// There is no need to make other checks, because that the only
			// situation could be. Behavior applied to its top element
			// and we are searching elements inside behavior target
			if(b && b.isInDuplicateGroup(elem) && 
				!(b.isDuplicate(clazz.target) || b.isInDuplicateGroup(clazz.target))){
				return;
			}
			res.push(base2.DOM.bind(elem));
		}	
	);
	
	return res;
}

/**
 * Returns all elements associated with switch name
 * @TODO	Remove to pre-cache
 * @param	{String}	sName
 * @returns	StaticNodeList
 */
wFORMS.behaviors['switch'].instance.prototype.getTriggersByTarget = function(target){
	var res = new Array();
	var clazz = this;
	var names = wFORMS.behaviors['switch'].getSwitchNamesFromTarget(target);
	var b = wFORMS.behaviors.repeat;

	base2.forEach(names, function(name){
		clazz.target.querySelectorAll("."+wFORMS.behaviors['switch'].CSS_PREFIX + name).forEach(
				function(elem){
					// In case trigger found IS in the duplicate group and the target
					// is NOT in the duplicate section and NOT dupicate itself
					// SKIP this trigger
					// There is no need to make other checking for because that the only
					// situation could be. Targets in the duplicate section CAN NOT 
					// reach triggers from other duplicates because bahaviors applied
					// to entire section element
					if(b && b.isInDuplicateGroup(elem) && 
						!(b.isDuplicate(target) || b.isInDuplicateGroup(target))){
						return;
					}
					res.push(base2.DOM.bind(elem));
				}	
		);
	
	});
	return this.getTriggersByElements(res, names);
}


/**
 * Setups targets depends on switches and control state. I.e. if control is ON
 * Targets should be ON. 
 * TODO Check for optimization, check for design
 * @param	{HTMLElement}	elem
 */
wFORMS.behaviors['switch'].instance.prototype.setupTargets = function(elem){
	this.run(null, elem)
}

/**
 * Checks if provided element is switched off
 * @param	{HTMLElement}	elem
 * @return	{bool}
 * @public
 */
wFORMS.behaviors['switch'].isSwitchedOff = function(elem){
	// TODO possible base2.DOM.bind
	return (elem.className.match(
		new RegExp(wFORMS.behaviors['switch'].CSS_OFFSTATE_PREFIX + "[^ ]*")) ?
		true : false) &&
		(elem.className.match(
		new RegExp(wFORMS.behaviors['switch'].CSS_ONSTATE_PREFIX + "[^ ]*")) ?
		false : true) ; 
}


/**
 * Executes the behavior
 * @param {event} e Event caught. (!In current implementation it could be null in case of the initialization)
 * @param {domElement} element
 */
wFORMS.behaviors['switch'].instance.prototype.run = function(e, element){ 
	
	if(!element.hasClass) base2.DOM.bind(element);
	
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
		
	var triggers = this.getTriggersByElements(new Array(element));
	var clazz = this;
	
	
	base2.forEach(triggers.OFF, function(switchName){
		var targets = clazz.getTargetsBySwitchName(switchName, 'ON');
		base2.forEach(targets, function(elem){
			var _triggers = clazz.getTriggersByTarget(elem);
			if(_triggers.ON.length == 0){
				elem.addClass(wFORMS.behaviors['switch'].CSS_OFFSTATE_PREFIX + switchName);
				elem.removeClass(wFORMS.behaviors['switch'].CSS_ONSTATE_PREFIX + switchName);
				clazz.behavior.onSwitchOff(elem);
			}
		})
	});

	base2.forEach(triggers.ON, function(switchName){
		var targets = clazz.getTargetsBySwitchName(switchName, 'OFF');
		base2.forEach(targets, function(elem){
			elem.removeClass(wFORMS.behaviors['switch'].CSS_OFFSTATE_PREFIX + switchName);
			elem.addClass(wFORMS.behaviors['switch'].CSS_ONSTATE_PREFIX + switchName);
			clazz.behavior.onSwitchOn(elem);
		})
	});

	if(b = wFORMS.getBehaviorInstance(this.target, 'paging')){
		b.setupManagedControls();
	}
	
	this.behavior.onSwitch(this.target);
	
}

