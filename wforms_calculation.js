
if (typeof(wFORMS) == "undefined") {
	throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
/**
 * wForms calculation behavior. 
 */
wFORMS.behaviors.calculation  = { 
	
	/**
	 * Selector expression for the variable used in a calculation
     * @final
     * @see	http://www.w3.org/TR/css3-selectors/
	 */
	VARIABLE_SELECTOR_PREFIX : "calc-",
	
	/**
	 * Behavior uses value defined in the class with this prefix if available (e.g. calcval-9.99)
	 * otherwise uses field value property. 
	 */
	CHOICE_VALUE_SELECTOR_PREFIX : "calcval-",

	/**
	 * Suffix of the ID for the hint element
     * @final
	 */
	CALCULATION_SELECTOR : '*[class*="formula="]',

	/**
	 * The error message displayed next to a field with a calculation error
	 */
	CALCULATION_ERROR_MESSAGE : "There was an error computing this field.",
	
	/**
	 * Creates new instance of the behavior
     * @constructor
	 */
	instance : function(f) {
		this.behavior = wFORMS.behaviors.calculation; 
		this.target = f;
		this.calculations = [];
		//this.variables = [];
	}
}

/**
 * Factory Method.
 * Applies the behavior to the given HTML element by setting the appropriate event handlers.
 * @param {domElement} f An HTML element, either nested inside a FORM element or (preferably) the FORM element itself.
 * @return {object} an instance of the behavior 
 */	
wFORMS.behaviors.calculation.applyTo = function(f) {
	
	
	while(f && f.tagName!='FORM') {
		f = f.parentNode;
	}
	
	var b = wFORMS.getBehaviorInstance(f,'calculation');
	if(!b) { 
		b = new wFORMS.behaviors.calculation.instance(f);
	} else {
		b.calculations = [];
	}
	
	if(wFORMS.behaviors.repeat && !b._repeatRemoveHandler) {
		var _callback = wFORMS.behaviors.repeat.onRemove;
		b._repeatRemoveHandler = function() {
			wFORMS.behaviors.calculation.applyTo(f);
			if(_callback) _callback();
		}
		wFORMS.behaviors.repeat.onRemove = b._repeatRemoveHandler; 
	}
	
	
	f.querySelectorAll(wFORMS.behaviors.calculation.CALCULATION_SELECTOR).forEach(
		function(elem){
			// extract formula
			var formula = elem.className.substr(elem.className.indexOf('formula=')+8).split(' ')[0];

			var variables = formula.split(/[^a-zA-Z]+/g);
			b.varFields = [];
			
			// process variables, add onchange/onblur event to update total.
			for (var i = 0; i < variables.length; i++) {
				if(variables[i]!='') {
					
					/* 
					Binding with forEach sometime fails when using this, resulting in undefined 'variable' parameter. 
						f.querySelectorAll("*[class*=\"...\"]");
					Library call works fine: base2.DOM.Document.querySelectorAll(...) 
					*/
					base2.DOM.Document.querySelectorAll(f,"*[class*=\""+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+variables[i]+"\"]").forEach(
						function(variable){
							if(!variable.addEventListener) {
								base2.DOM.bind(variable);
							}
							// make sure the variable is an exact match.
							var exactMatch = ((' ' + variable.className + ' ').indexOf(' '+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+variables[i]+' ')!=-1);
							if(!exactMatch) return;
							
							// listen for value changes
							if(!wFORMS.behaviors.calculation.isHandled(variable)){
								var t = variable.tagName.toLowerCase();
								if (t == 'input' || t == 'textarea') {
									
									// toggled fields
									var y = variable.type.toLowerCase();
									if (t == 'input' && (y == 'radio' || y == 'checkbox')) {
										variable.addEventListener('click', function(e){ return b.run(e, this)}, false);
										wFORMS.behaviors.calculation.setHandledFlag(variable);
									
									// text entry fields
									} else {
										variable.addEventListener('blur', function(e){ return b.run(e, this)}, false);
										wFORMS.behaviors.calculation.setHandledFlag(variable);
									}
									
								// select boxes
								} else if (t == 'select') {
									variable.addEventListener('change',  function(e){ return b.run(e, this)}, false);
									wFORMS.behaviors.calculation.setHandledFlag(variable);
									
								// unsupported elements	
								} else {
									return;
								}
							}
							
							b.varFields.push({name: variables[i], field: variable});						
						}
					);			
				}		
			}		
			var calc = { field: elem, formula: formula, variables: b.varFields };		
			b.calculations.push(calc);	
			b.compute(calc);
		}
	);
	
	b.onApply();
	
	return b;
}

/**
 * Executed once the behavior has been applied to the document.
 * Can be overwritten.
 */
wFORMS.behaviors.calculation.instance.prototype.onApply = function() {} 

/**
 * Runs when a field is changed, update dependent calculated fields. 
 * @param {event} event
 * @param {domElement} elem
 */
wFORMS.behaviors.calculation.instance.prototype.run = function(event, element) {

	for(var i=0; i<this.calculations.length;i++) {		
		var calc = this.calculations[i];
		for(var j=0; j<calc.variables.length;j++) {		
					
			if(element==calc.variables[j].field) {
				// this element is part of the calculation for calc.field
				this.compute(calc);
			}
		}
	}
} 

/**
 * Can be used to update a calculated field if the run method is not triggered. 
 * @param {event} event
 * @param {domElement} elem
 */
wFORMS.behaviors.calculation.instance.prototype.refresh = function(event, element) { 
	
	for(var i=0; i<this.calculations.length;i++) {		
		var calc = this.calculations[i];
					
		if(element==calc.field) {
			this.compute(calc);
		}
	}
} 
 
wFORMS.behaviors.calculation.instance.prototype.compute = function(calculation) {
	var f = this.target;
	var formula = calculation.formula;
	var _processedVariables = new Array();
	
	for(var i=0; i<calculation.variables.length;i++) {
		var v = calculation.variables[i];
		var varval = 0;
		var _self  = this;
		
		// We don't rely on calculation.variables[i].field because 
		// the form may have changed since we've applied the behavior
		// (repeat behavior for instance).
		
		// Since the calculations can have several variables with the same name
		// querySelectorAll will catch them all, so we don't need to also loop 
		// through all of them.
		if(wFORMS.helpers.contains(_processedVariables,v.name)) {
			continue;
		} else {
			_processedVariables.push(v.name);
		}
		 
		// TODO: Exclude switched-off variables?
		
		/* 
		Binding with forEach sometime fails when using this, resulting in undefined 'variable' parameter. 
			f.querySelectorAll("*[class*=\"...\"]");
		Library call works fine: base2.DOM.Document.querySelectorAll(...) 
		*/
		base2.DOM.Document.querySelectorAll(f,"*[class*=\""+_self.behavior.VARIABLE_SELECTOR_PREFIX+v.name+"\"]").forEach(
			function(variable){
								
				// make sure the variable is an exact match.
				var exactMatch = ((' ' + variable.className + ' ').indexOf(' '+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+v.name+' ')!=-1);
				if(!exactMatch) return;
				
				
				if(!_self.inScope(calculation.field, variable)){
					return;
				}
				
				
				// If field value has a different purpose, the value for the calculation can be set in the
				// class attribute, prefixed with CHOICE_VALUE_SELECTOR_PREFIX
				if(_self.hasValueInClassName(variable)) {
					var value = _self.getValueFromClassName(variable);
				} else {
					var value = wFORMS.helpers.getFieldValue(variable);					
				} 
				if(!value) value=0;
				
				if(value.constructor==Array) { // array (multiple select)
					for(var j=0;j<value.length;j++) { 
						if(String(value[j]).search(/^[\d\.,]*$/) != -1)
							varval += parseFloat(value[j]);
						else
							(!varval)?(varval=value[j]):(varval=String(varval).concat(value[j]));
					}
				} else {
						if(String(value).search(/^[\d\.,]*$/) != -1) 
							varval += parseFloat(value);
						else
							(!varval)?(varval=value):(varval=String(varval).concat(value));
				}
			}
		);		
		
		// prepend variable assignment to the formula
		if(String(varval).search(/^[\d\.,]*$/) != -1) {
			formula = 'var '+ v.name +' = '+ varval +'; '+ formula;
		} else {
			formula = 'var '+ v.name +' = "'+ varval.replace(/\"/g, '\\"') +'"; '+ formula;
		}
	} 
	  
	try {
		var calc = function () {return eval(formula)};
		var result = calc();
		if(result == 'Infinity' || result == 'NaN' || String(result).match('NaN')){
			result = 'error';
		}
	} catch(x) {		
		result = 'error';	
	} 
	// Check if validation behavior is available. Then flag field if error.
	var validationBehavior = wFORMS.getBehaviorInstance(this.target,'validation');	
	if(validationBehavior) {		
		// add validation error message 
		if(!wFORMS.behaviors.validation.messages['calculation']) {
			wFORMS.behaviors.validation.messages['calculation'] = this.behavior.CALCULATION_ERROR_MESSAGE;
		}
		validationBehavior.removeErrorMessage(calculation.field);
		if(result=='error') {			
			validationBehavior.fail(calculation.field, 'calculation');
		}
	}
	calculation.field.value = result;
	
	// If the calculated field is also a variable, recursively update dependant calculations
	if(calculation.field.className && (calculation.field.className.indexOf(this.behavior.VARIABLE_SELECTOR_PREFIX)!=-1)) {
		// TODO: Check for infinite loops?
		//console.log('rec',this);
		this.run(null,calculation.field);
	} 
}
	
wFORMS.behaviors.calculation.instance.prototype.hasValueInClassName = function(element) {
	switch(element.tagName) {
		case "SELECT": 
			for(var i=0;i<element.options.length;i++) {
				if(element.options[i].className && element.options[i].className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)!=-1) {
					return true; 
				}
			}
			return false; 
			break;
		default:
			if(!element.className || (' '+element.className).indexOf(' '+this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)==-1)
				return false;
			break;
	}
	return true;
}
/**
 * getValueFromClassName 
 * If field value has a different purpose, the value for the calculation can be set in the
 * class attribute, prefixed with CHOICE_VALUE_SELECTOR_PREFIX 
 * @param {domElement} element 
 * @returns {string} the value of the field, as set in the className
 */
wFORMS.behaviors.calculation.instance.prototype.getValueFromClassName = function(element) {
	switch(element.tagName) {
		case "INPUT":
			if(!element.className || element.className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)==-1) 
				return null;
			
			var value = element.className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(' ')[0];								
			if(element.type=='checkbox')
				return element.checked?value:null;
			if(element.type=='radio')
				return element.checked?value:null;
			return value;
			break;
		case "SELECT":		
			if(element.selectedIndex==-1) {					
				return null; 
			} 
			if (element.multiple) {
				var v=[];
				for(var i=0;i<element.options.length;i++) {
					if(element.options[i].selected) {
						if(element.options[i].className && element.options[i].className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)!=-1) { 
							var value = element.options[i].className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(' ')[0];								
							v.push(value);
						}
					}
				}
				if(v.length==0) return null;
				return v;
			}	
			if (element.options[element.selectedIndex].className &&  element.options[element.selectedIndex].className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)!=-1) { 
				var value =  element.options[element.selectedIndex].className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(' ')[0];								
				return value;
			}													
			break;
		case "TEXTAREA":
			if(!element.className || element.className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)==-1) 
				return null;
			var value = element.className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(' ')[0];								
			
			return value;
			break;
		default:
			return null; 
			break;
	} 	 
	return null; 
}


/**
 * Checks if element is already handled
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
wFORMS.behaviors['calculation'].isHandled = function(elem){
	return (elem._wforms_calc_handled === true);
}

/**
 * set element as already handled
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
wFORMS.behaviors['calculation'].setHandledFlag = function(elem){
	elem._wforms_calc_handled = true;
}

/**
 * Removes handle attribute from element
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
wFORMS.behaviors['calculation'].removeHandledFlag = function(elem){
	delete elem._wforms_calc_handled;
}

 
 wFORMS.behaviors.calculation.instance.prototype.inScope = function(formula, variable) {
		
		var br = wFORMS.behaviors.repeat;
		if(br) {
			var formulaRepeat = formula;
			if(!formulaRepeat.hasClass) {
				wFORMS.standardizeElement(formulaRepeat);
			}
			while (formulaRepeat && !formulaRepeat.hasClass(br.CSS_REMOVEABLE) &&  !formulaRepeat.hasClass(br.CSS_REPEATABLE)) {						
				formulaRepeat = formulaRepeat.parentNode;
				if(formulaRepeat) {
					wFORMS.standardizeElement(formulaRepeat);
				}			
			}
			
			if (formulaRepeat) {
				// formula is in a repeated section. Check if variable belong to same.
				
				var isInRepeat = false;			
				while(variable) {
					if(!variable.hasClass) {
						wFORMS.standardizeElement(variable);
					}
					if(variable.hasClass(br.CSS_REMOVEABLE) ||  variable.hasClass(br.CSS_REPEATABLE)) {
						isInRepeat = true;
					}
					if(variable==formulaRepeat) {
						return true;
					}
					variable = variable.parentNode;
					if(variable) {
						wFORMS.standardizeElement(variable);
					}	
				}
				
				return !isInRepeat;
			}
		}
		return true;
	}
