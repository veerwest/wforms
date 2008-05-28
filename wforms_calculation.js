
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
	var b = new wFORMS.behaviors.calculation.instance(f);

	f.querySelectorAll(wFORMS.behaviors.calculation.CALCULATION_SELECTOR).forEach(
		function(elem){
			// extract formula
			var formula = elem.className.substr(elem.className.indexOf('formula=')+8).split(' ')[0];

			var variables = formula.split(/[^a-zA-Z]+/g);
			b.varFields = [];
			
			// process variables, add onchange/onblur event to update total.
			for (var i = 0; i < variables.length; i++) {
				if(variables[i]!='') {
					f.querySelectorAll("*[class*=\""+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+variables[i]+"\"]").forEach(
						function(variable){
							
							// make sure the variable is an exact match.
							var exactMatch = ((' ' + variable.className + ' ').indexOf(' '+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+variables[i]+' ')!=-1);
							if(!exactMatch) return;
							
							switch(variable.tagName + ":" + variable.getAttribute('type') ) {
								case 'INPUT:':			// (type attribute empty)
								case 'INPUT:null': 		// (type attribute missing)
								case 'INPUT:text':
								case 'INPUT:hidden':
								case 'INPUT:password':
								case 'TEXTAREA:null':
									if(!variable._wforms_calc_handled) {
										variable.addEventListener('blur', function(e){ return b.run(e, this)}, false);
										variable._wforms_calc_handled = true;
									}
									break;
								case 'INPUT:radio':		 						
								case 'INPUT:checkbox':
									if(!variable._wforms_calc_handled) {
										variable.addEventListener('click', function(e){ return b.run(e, this)}, false);
										variable._wforms_calc_handled = true;
									}
									break;			
								case 'SELECT:null':
									if(!variable._wforms_calc_handled) {
										variable.addEventListener('change',  function(e){ return b.run(e, this)}, false);
										variable._wforms_calc_handled = true;
									}
									break;		
								default:
									// error: variable refers to a non supported element.
									return;
									break;
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
		f.querySelectorAll("*[class*=\""+_self.behavior.VARIABLE_SELECTOR_PREFIX+v.name+"\"]").forEach(
			function(f){
				
				// make sure the variable is an exact match.
				var exactMatch = ((' ' + f.className + ' ').indexOf(' '+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+v.name+' ')!=-1);
				if(!exactMatch) return;
				
				// If field value has a different purpose, the value for the calculation can be set in the
				// class attribute, prefixed with CHOICE_VALUE_SELECTOR_PREFIX
				if(_self.hasValueInClassName(f)) {
					var value = _self.getValueFromClassName(f);
				} else {
					var value = wFORMS.helpers.getFieldValue(f);					
				} 
				if(!value) value=0;
				
				if(value.constructor==Array) { // array (multiple select)
					for(var j=0;j<value.length;j++) { 
						varval += parseFloat(value[j]);
					}					
				} else {
					varval += parseFloat(value);
				}
				
			}
		);		
		
	    var rgx = new RegExp("([^a-z])("+v.name+")([^a-z])","gi");
	    while((' '+formula+' ').match(rgx)) {
	    	formula = (' '+formula+' ').replace(rgx, "$1"+varval+"$3");
	    }	      
	} 
	  
	try {
		var result = eval(formula);
		if(result == 'Infinity' || result == 'NaN' || isNaN(result)){
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
			if(element.getAttribute('multiple')) {
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