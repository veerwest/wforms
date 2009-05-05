
if (typeof(wFORMS) == "undefined") {
	throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
/**
 * wForms validation behavior
 * 
 */
wFORMS.behaviors.validation = {
	
	/*
	 * Suffix of the ID for the error message placeholder
 	 */
	ERROR_PLACEHOLDER_SUFFIX : '-E',
	
	
	rules: {	
		isRequired	: { selector: ".required", 			  check: 'validateRequired'}, 
		isAlpha		: { selector: ".validate-alpha", 	  check: 'validateAlpha'},
		isAlphanum	: { selector: ".validate-alphanum",	  check: 'validateAlphanum'}, 
		isDate		: { selector: ".validate-date", 	  check: 'validateDate'}, 
		isTime		: { selector: ".validate-time", 	  check: 'validateTime'}, 
		isEmail		: { selector: ".validate-email", 	  check: 'validateEmail'}, 
		isInteger	: { selector: ".validate-integer", 	  check: 'validateInteger'}, 
		isFloat		: { selector: ".validate-float", 	  check: 'validateFloat'}, 
		isPhone		: { selector: ".validate-phone",	  check: 'validatePhone'},
		isCustom	: { selector: ".validate-custom",	  check: 'validateCustom'}
	},	
	
	styling: {
		fieldError	: "errFld",
		errorMessage: "errMsg"
	},
	
	messages: {
		isRequired 		: "This field is required. ",
		isAlpha 		: "The text must use alphabetic characters only (a-z, A-Z). Numbers are not allowed.",
		isEmail 		: "This does not appear to be a valid email address.",
		isInteger 		: "Please enter an integer.",
		isFloat 		: "Please enter a number (ex. 1.9).",
		isAlphanum 		: "Please use alpha-numeric characters only [a-z 0-9].",
		isDate 			: "This does not appear to be a valid date.",
		isPhone			: "Please enter a valid phone number.",
		isCustom		: "Please enter a valid value.",
		notification	: "The form is not complete and has not been submitted yet. There was %% problem(s) with your submission."  // %% will be replaced by the actual number of errors.
	},
	
	
	instance: function(f) {
		this.behavior = wFORMS.behaviors.validation; 
		this.target   = f;
		var self 	  = this;
		
		if(!f.__wFormsValidationHandled) {
			if(!f.addEventListener) {
				wFORMS.standardizeElement(f);
			}
			f.addEventListener('submit', function(e){ return self.run(e, this)} ,false);
			f.__wFormsValidationHandled = true;			
		}
	},
	
	onPass: function(f) {},
	onFail: function(f) {}
}

/**
 * Factory Method
 * Applies the behavior to the given HTML element by setting the appropriate event handlers.
 * @param {domElement} f An HTML element, either nested inside a FORM element or (preferably) the FORM element itself.
 * @return {object} an instance of the behavior 
 */	
wFORMS.behaviors.validation.applyTo = function(f) {
	if(!f || !f.tagName) {
		throw new Error("Can't apply behavior to " + f);
	}
	if(f.tagName!="FORM") {
		// look for form tag in the ancestor nodes.
		if(f.form) 
			f=f.form;
		else {
			var _f = f;
			for(f = f.parentNode; f && f.tagName!="FORM" ;f = f.parentNode) continue;
			if(!f || f.tagName!="FORM") {
				// form tag not found, look for nested forms.
				f = _f.getElementsByTagName('form');				
			}
		}
	}
	if(!f.tagName && f.length>0) {
		var v = new Array();
		for(var i=0;i<f.length;i++) {
			var _v = new wFORMS.behaviors.validation.instance(f[i]);
			v.push(_v);	
			_v.onApply();
		}
	} else {
		var v = new wFORMS.behaviors.validation.instance(f);
		v.onApply();
	}
	
	return v;	   
}
 
/**
 * Executed once the behavior has been applied to the document.
 * Can be overwritten.
 */
wFORMS.behaviors.validation.instance.prototype.onApply = function() {} 

 
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
					
		// Workaround for apparent bug in querySelectorAll not being limited to descendants of 'element':
		// See bug #172 - Check if the element is not on the current page of a multi-page form			
		if(wFORMS.behaviors.paging && !wFORMS.behaviors.paging.isElementVisible(element)) {
			return;	
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
			if(!passed) { 
				if(!element.id) element.id = wFORMS.helpers.randomId();
				_self.elementsInError[element.id] = { id:element.id, rule: ruleName };
				_self.removeErrorMessage(element); 
				if(rule.fail) {
					// custom fail method
					rule.fail.call(_self, element, ruleName);
				} else {
					// default fail method
					_self.fail.call(_self, element, ruleName);
				} 					
				errorCount ++;
			} else {
				// If no previos rule has found an error on that field,
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
	}
	

 	var errorCount = 0;
 	this.elementsInError = {};
 	for (var ruleName in this.behavior.rules) {
 		var rule = this.behavior.rules[ruleName];
   		var _self = this;

		if(!element.matchesSelector)
			base2.DOM.bind(element);
	
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
 		if(this.behavior.onFail) this.behavior.onFail(this);
 		return false;
 	}
 	if(this.behavior.onPass) this.behavior.onPass(this);
 	return true; 
}




/**
 * fail
 * @param {domElement} element 
 */
wFORMS.behaviors.validation.instance.prototype.fail = function(element, ruleName) { 

	// set class to show that the field has an error
	element.addClass(this.behavior.styling.fieldError);
	// show error message.
	this.addErrorMessage(element, this.behavior.messages[ruleName]);			
},
	
/**
 * pass
 * @param {domElement} element 
 */	
wFORMS.behaviors.validation.instance.prototype.pass = function(element) { /* no implementation needed */ }

/**
 * addErrorMessage
 * @param {domElement} element 
 * @param {string} error message 
 */
wFORMS.behaviors.validation.instance.prototype.addErrorMessage = function(element, message) {
	
	// we'll need an id here.
	if (!element.id) element.id = wFORMS.helpers.randomId(); 
	
	// Prepare error message
	var txtNode = document.createTextNode(message);
	
	// Find error message placeholder.
	var p = document.getElementById(element.id + this.behavior.ERROR_PLACEHOLDER_SUFFIX);
	if(!p) { // create placeholder.
		p = document.createElement("div"); 
		p.setAttribute('id', element.id + this.behavior.ERROR_PLACEHOLDER_SUFFIX);
		if(element.tagName=="TR") {
			p = (element.getElementsByTagName('TD')[0]).appendChild(p);
		} else {		
			p = element.parentNode.insertBefore(p,element.nextSibling);
		}
	}
	// Finish the error message.
	p.appendChild(txtNode);
	base2.DOM.bind(p);  
	p.addClass(this.behavior.styling.errorMessage);							
}

/**
 * removeErrorMessage
 * @param {domElement} element 
 */
wFORMS.behaviors.validation.instance.prototype.removeErrorMessage = function(element) { 
	if(!element.hasClass) base2.DOM.bind(element);
	if(element.hasClass(this.behavior.styling.fieldError)) {
		element.removeClass(this.behavior.styling.fieldError);
		var errorMessage  = document.getElementById(element.id + this.behavior.ERROR_PLACEHOLDER_SUFFIX);
		if(errorMessage)  {				
			errorMessage.parentNode.removeChild(errorMessage); 
		}
	}
}

/**
 * Checks the element's 'visibility' (switch behavior)
 * @param {domElement} element 
 * @return	{boolean}	true if the element is not 'visible' (switched off), false otherwise.
 */
wFORMS.behaviors.validation.instance.prototype.isSwitchedOff = function(element) {
	var sb = wFORMS.getBehaviorInstance(this.target,'switch');
	if(sb) { 
		var parentElement = element;
		while(parentElement && parentElement.tagName!='BODY') {
			// TODO: Check what happens with elements with multiple ON and OFF switches	
			if(parentElement.className && 
			   parentElement.className.indexOf(sb.behavior.CSS_OFFSTATE_PREFIX)!=-1 &&
			   parentElement.className.indexOf(sb.behavior.CSS_ONSTATE_PREFIX)==-1
			   ) {
				// switched off. skip element.
				return true;
			}
			parentElement = parentElement.parentNode;
		}
	}	
	return false;
}
 
/**
 * Checks if the element with the given id is a placeholder for the error message
 * @param {domElement} element 
 * @return	{boolean}	true if the element is a placeholder, false otherwise.
 */
wFORMS.behaviors.validation.isErrorPlaceholderId = function(id) {
	return id.match(new RegExp(wFORMS.behaviors.validation.ERROR_PLACEHOLDER_SUFFIX + '$')) != null;
} 
  
/**
 * Checks if the given string is empty (null or whitespace only)
 * @param {string} s 
 * @returns {boolean} 
 */
wFORMS.behaviors.validation.instance.prototype.isEmpty = function(s) {				
	var regexpWhitespace = /^\s+$/;
	return  ((s == null) || (s.length == 0) || regexpWhitespace.test(s));
}

/**
 * validateRequired
 * @param {domElement} element 
 * @param {string} element's value (if available) 
 * @returns {boolean} 
 */
wFORMS.behaviors.validation.instance.prototype.validateRequired = function(element, value) {
		
	switch(element.tagName) {
		case "INPUT":
			var inputType = element.getAttribute("type");					
			if(!inputType) inputType = 'text'; 
			switch(inputType.toLowerCase()) {
				case "checkbox":
				case "radio":
					return element.checked; 
					break;
				case "file":
					// allows form to pass validation if a file has already been uploaded 
					// (tfa_uploadDelete_xx checkbox exists and is not checked)					
					var deleteCheckbox=document.getElementById('tfa_uploadDelete_'+element.id);
					if(this.isEmpty(value)) {
						return (deleteCheckbox && !deleteCheckbox.checked);						
					}
					return true;
					break;
				default:
					return !this.isEmpty(value);
			}
			break;
		case "SELECT":							
			return !this.isEmpty(value);
			break;
		case "TEXTAREA":
			return !this.isEmpty(value);
			break;
		default:
			return this.validateOneRequired(element);
			break;
	} 	 
	return false 
};

/**
 * validateOneRequired
 * @param {domElement} element 
 * @returns {boolean} 
 */
wFORMS.behaviors.validation.instance.prototype.validateOneRequired = function(element) {
	if(element.nodeType != 1) return false;
	
	if(this.isSwitchedOff(element))
		return false;	
	
	switch(element.tagName) {
		case "INPUT":
			var inputType = element.getAttribute("type");
			if(!inputType) inputType = 'text'; 
			switch(inputType.toLowerCase()) {
				case "checkbox":
				case "radio":
					return element.checked; 
					break;
				case "file":
					// allows form to pass validation if a file has already been uploaded 
					// (tfa_uploadDelete_xx checkbox exists and is not checked)
					var deleteCheckbox=document.getElementById('tfa_uploadDelete_'+element.id);
					if(this.isEmpty(wFORMS.helpers.getFieldValue(element))) {
						return (deleteCheckbox && !deleteCheckbox.checked);						
					}
					return true;
					break;
				default:
					return !this.isEmpty(wFORMS.helpers.getFieldValue(element));
			}
			break;
		case "SELECT":							
			return !this.isEmpty(wFORMS.helpers.getFieldValue(element));
			break;
		case "TEXTAREA":
			return !this.isEmpty(wFORMS.helpers.getFieldValue(element));
			break;
		default:
			for(var i=0; i<element.childNodes.length;i++) {
				if(this.validateOneRequired(element.childNodes[i])) return true;
			}
			break;
	} 	 
	return false 
}

/**
 * validateAlpha
 * @param {domElement} element 
 * @returns {boolean} 
 */
wFORMS.behaviors.validation.instance.prototype.validateAlpha = function(element, value) {
	var regexp = /^[a-zA-Z\s]+$/; // Add ' and - ?
	return this.isEmpty(value) || regexp.test(value);
}

/**
 * validateAlphanum
 * @param {domElement} element 
 * @returns {boolean} 
 */
wFORMS.behaviors.validation.instance.prototype.validateAlphanum = function(element, value) {
	var regexp = /^[\w\s]+$/;
	return this.isEmpty(value) || regexp.test(value);
}

/**
 * validateDate
 * @param {domElement} element 
 * @returns {boolean} 
 */
wFORMS.behaviors.validation.instance.prototype.validateDate = function(element, value) {
	var testDate = new Date(value);
	return this.isEmpty(value) || !isNaN(testDate);
}

/**
 * validateTime
 * @param {domElement} element 
 * @returns {boolean} 
 */
wFORMS.behaviors.validation.instance.prototype.validateTime = function(element, value) {
	/* not yet implemented */	
	return true;
}

/**
 * validateEmail
 * @param {domElement} element 
 * @returns {boolean} 
 */
wFORMS.behaviors.validation.instance.prototype.validateEmail = function(element, value) {
	var regexpEmail = /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,}$/;
	return this.isEmpty(value) || regexpEmail.test(value);
}

/**
 * validateInteger
 * @param {domElement} element 
 * @returns {boolean} 
 */
wFORMS.behaviors.validation.instance.prototype.validateInteger = function(element, value) {
	var regexp = /^[+]?\d+$/;
	return this.isEmpty(value) || regexp.test(value);
}

/**
 * validateFloat
 * @param {domElement} element 
 * @returns {boolean} 
 */
wFORMS.behaviors.validation.instance.prototype.validateFloat = function(element, value) {
	return this.isEmpty(value) || !isNaN(parseFloat(value));
}

/**
 * validatePhone
 * @param {domElement} element
 * @returns {boolean}
 */
wFORMS.behaviors.validation.instance.prototype.validatePhone = function(element, value) {
	if (this.isEmpty(value)) {
		return true;
	}
	var formats = [
		/^[\d\-\. \+\(\)]+$/, // any combination of valid characters
		/^[\d\-\. \+\(\)]+ # {0,1}\d+ *$/, // with hash extension
		/^[\d\-\. \+\(\)]+ ext\.{0,1} \d+ *$/ // with abbreviated extension
	];
	for (var f in formats) {
		if (formats[f].test(value)) {
			return true;
		}
	}
	return false;
}

/**
 * validateCustom
 * @param {domElement} element 
 * @returns {boolean} 
 */
wFORMS.behaviors.validation.instance.prototype.validateCustom = function(element, value) {	
	var pattern = new RegExp("\/(.*)\/([gi]*)");
	var matches = element.className.match(pattern);
	//console.log(matches);
	if(matches && matches[0]) {										
		var validationPattern = new RegExp(matches[1],matches[2]);
		if(!value.match(validationPattern)) {
			return false									
		}
	}		
	return true;
}
