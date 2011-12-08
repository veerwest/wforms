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
    LOWER_BOUND_ATTRIBUTE: 'min',
    UPPER_BOUND_ATTRIBUTE: 'max',
	
	
	rules: {	
		oneRequired	: { selector: ".required-one", 		  check: 'validateOneRequired'},
	    isRequired	: { selector: ".required", 			  check: 'validateRequired'}, 
		isAlpha		: { selector: ".validate-alpha", 	  check: 'validateAlpha'},
		isAlphanum	: { selector: ".validate-alphanum",	  check: 'validateAlphanum'}, 
        isDateTime        : { selector: ".validate-datetime",       check: 'validateDateTime'},
        isDate        : { selector: ".validate-date",       check: 'validateDate',
            range_verifier: 'dateRangeTest', range_error_message: 'rangeDate'},
        isTime        : { selector: ".validate-time",       check: 'validateTime',
            range_verifier: 'timeRangeTest', range_error_message: 'rangeDate'},
		isEmail		: { selector: ".validate-email", 	  check: 'validateEmail'}, 
        isInteger    : { selector: ".validate-integer",       check: 'validateInteger',
            range_verifier: 'numberRangeTest', range_error_message: 'rangeNumber'},
        isFloat        : { selector: ".validate-float",       check: 'validateFloat',
            range_verifier: 'numberRangeTest', range_error_message : 'rangeNumber'},
		isPhone		: { selector: ".validate-phone",	  check: 'validatePhone'},
		isCustom	: { selector: ".validate-custom",	  check: 'validateCustom'}
	},	
	
	styling: {
		fieldError	: "errFld",
		errorMessage: "errMsg"
	},
	
	messages: {
		oneRequired 	: "This section is required.",
		isRequired 		: "This field is required.",
		isAlpha 		: "The text must use alphabetic characters only (a-z, A-Z). Numbers are not allowed.",
		isEmail 		: "This does not appear to be a valid email address.",
		isInteger 		: "Please enter an integer.",
		isFloat 		: "Please enter a number (ex. 1.9).",
		isAlphanum 		: "Please use alpha-numeric characters only [a-z 0-9].",
        isDateTime             : "This does not appear to be a valid date/time.",
		isDate 			: "This does not appear to be a valid date.",
        isTime             : "This does not appear to be a valid time.",
		isPhone			: "Please enter a valid phone number.",
		isCustom		: "Please enter a valid value.",
        notification    : "The form is not complete and has not been submitted yet. There was %% problem(s) with your submission.",  // %% will be replaced by the actual number of errors.
        rangeNumber    : {
            max: 'The value must be smaller than the upper bound %1',
            min: 'The value must be greater than the lower bound %1'
	},
        rangeDate    : {
            max: 'The date must be before %1',
            min: 'The date must be after %1'
        }
    },
	
	
	instance: function(f) {
		this.behavior = wFORMS.behaviors.validation; 
		this.target   = f;
		var self 	  = this;
		
		if(!f.__wFormsValidationHandled) {
			if(!f.addEventListener) {
				wFORMS.standardizeElement(f);
			}
            f.addEventListener('submit', function(e) {
                return self.run(e, this)
            }, false);
			f.__wFormsValidationHandled = true;			
		}

        
	},
	
    onPass: function(f, e) {
    },
    onFail: function(f, e) {
    },

    dateRegex : (function(){
        var p_month = "((January)|(February)|(March)|(April)|(May)|(June)|(July)|(August)|(September)|(October)|(November)|(December)|(Jan)|(Feb)|(Mar)|(Apr)|(May)|(Jun)|(Jul)|(Aug)|(Sep)|(Oct)|(Nov)|(Dec))";
        var p_num = '\\d{1,2}';
        var year = '(\\d{1,4}|\\d{1,2})';
        var month = '(' + p_num + '|' + p_month + ')';
        var day = '\\d{1,2}((th)|(rd)|(nd)|(st))?';
        var spliter = '\\s*[-/\\\\|\\,\\.]?\\s*';
        var reg_month_day = '((' + month + spliter + day + ')|'
                + '(' + day + spliter + month + ')|(' + month + '))';

        var reg_date = '((' + year + spliter + reg_month_day +')|'
                + '(' + reg_month_day + spliter + year +')|' + reg_month_day + ')';
        var time = '(\\d{1,2}\\s*[:-]?\\s*\\d{1,2}(\\s*[:-]?\\s*\\d{1,2})?)';

        return [
            new RegExp('^' + reg_date + '\\s+' + time + '$', 'i'),
            new RegExp('^' + time + '\\s+' + reg_date + '$', 'i'),
            new RegExp('^' + reg_date + '$', 'i'),
            new RegExp('^' + time  + '$', 'i')
        ];
    })()

};

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
wFORMS.behaviors.validation.instance.prototype.onApply = function() {
	var _self = this;

	if(wFORMS.behaviors.repeat && !wFORMS.behaviors.repeat.handlingRepeatedErrors){
		wFORMS.behaviors.repeat.handlingRepeatedErrors = true;
		var _onRepeatCallBack = wFORMS.behaviors.repeat.onRepeat;
		wFORMS.behaviors.repeat.onRepeat = function(elem) {
			if(elem){
				_self.removeErrorMessage(elem);
			}
			var errFld = "*[class*='"+wFORMS.behaviors.validation.styling.fieldError+"']";
			base2.DOM.Element.querySelectorAll(elem,errFld).forEach(function(i){
				_self.removeErrorMessage(i);
			});
			if(_onRepeatCallBack) _onRepeatCallBack.apply(this, arguments);
		}
	}
} 

 
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
		
		//Scope validation to currently visible page only if being called by a page button.
		//Otherwise, run full validation.
		if(e.pagingStopPropagation){
			// Workaround for apparent bug in querySelectorAll not being limited to descendants of 'element':
			// See bug #172 - Check if the element is not on the current page of a multi-page form			
			if(wFORMS.behaviors.paging && !wFORMS.behaviors.paging.isElementVisible(element)) {
				return;	
			}
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

        var errorMessage = ruleName;
        //Check range as well
        if(passed && rule.range_verifier !== undefined){
            var result = _self[rule.range_verifier].call( _self, element, value,
                wFORMS.behaviors.validation.messages[rule.range_error_message] );
            if( result !== true ){
                passed = false;
                if( result !== false ){
                    errorMessage = result;
                }
            }
        }

			if(!passed) { 
				if(!element.id) element.id = wFORMS.helpers.randomId();
				_self.elementsInError[element.id] = { id:element.id, rule: ruleName };
				_self.removeErrorMessage(element); 
				if(rule.fail) {
					// custom fail method
                rule.fail.call(_self, element, errorMessage);
				} else {
					// default fail method
                _self.fail.call(_self, element, errorMessage);
				} 					
				errorCount ++;
			} else {
				// If no previous rule has found an error on that field,
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
    };
	

 	var errorCount = 0;
 	this.elementsInError = {};
 	for (var ruleName in this.behavior.rules) {
 		var rule = this.behavior.rules[ruleName];
   		var _self = this;

		//Seems to be an IE9 issue with DOM.bind, switched to standardizeElement instead
		if(!element.matchesSelector)
			wFORMS.standardizeElement(element);
		if(!element.matchesSelector)
			element = base2.DOM.bind(element);	

		//Maybe move this to crossbrowser hacks?
		//IE9 doesn't implement Element.matchesSelector ... oh wait
		//yes it does, it just calls it msMatchesSelector
		if(!element.matchesSelector && element.msMatchesSelector)
			element.matchesSelector = element.msMatchesSelector;
		if(!element.matchesSelector && element.mozMatchesSelector)
			element.matchesSelector = element.mozMatchesSelector;
		if(!element.matchesSelector && element.webkitMatchesSelector)
			element.matchesSelector = element.webkitMatchesSelector;
		if(!element.matchesSelector)
			element.matchesSelector = base2.DOM.Element.matchesSelector;
			
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
 		if(this.behavior.onFail) this.behavior.onFail(this, e);
 		return false;
 	}
 	if(this.behavior.onPass) this.behavior.onPass(this, e);
 	return true; 
}


/**
 * fail
 * @param {domElement} element 
 */
/**
 * fail
 * @param {domElement} element 
 */
wFORMS.behaviors.validation.instance.prototype.fail = function(element, ruleName) { 

	
	//  field wrapper DIV. (-D suffix)
	var div = document.getElementById(element.id+'-D');
	
	if(!div && wFORMS.behaviors.repeat) {
		if(element.id){
			var name = element.id.replace(/(\[\d+\])+(\-[HED])?$/,"$2");
			var suffix = element.id.split(name).join('');
			name += '-D';
			if(suffix){
				name += suffix;
			}
			div  = document.getElementById(name);
		}
	}
	
	// set class to show that the field has an error
	if(div) {	
		if(!div.hasClass || !div.addClass) wFORMS.standardizeElement(div);
		div.addClass(this.behavior.styling.fieldError);
	}else{
		// set class to show that the field has an error
		if(!element.hasClass || !element.addClass) wFORMS.standardizeElement(element);
		element.addClass(this.behavior.styling.fieldError);	
	}
	
    var message = (ruleName in this.behavior.messages) ? this.behavior.messages[ruleName] : ruleName;
	// show error message.
    this.addErrorMessage(element, message);
},
	
/**
 * pass
 * @param {domElement} element 
 */	
    wFORMS.behaviors.validation.instance.prototype.pass = function(element) { /* no implementation needed */
    }

/**
 * addErrorMessage
 * @param {domElement} element 
 * @param {string} error message 
 */
wFORMS.behaviors.validation.instance.prototype.addErrorMessage = function(element, message) {
	
	// we'll need an id here.
	if (!element.id) element.id = wFORMS.helpers.randomId(); 
	
	// Prepare error message
	var txtNode = document.createElement('span');
	txtNode.appendChild(document.createTextNode(message));
	
	// Find error message placeholder.
	var p = document.getElementById(element.id + this.behavior.ERROR_PLACEHOLDER_SUFFIX);
	if(!p) { // create placeholder.
		p = document.createElement("div"); 
		p.setAttribute('id', element.id + this.behavior.ERROR_PLACEHOLDER_SUFFIX);
		if(element.tagName=="TR") {
			// If this is a table row, add error message to first cell.		
			if(element.getElementsByTagName('TH').length>0) {
				p = (element.getElementsByTagName('TH')[0]).appendChild(p);
			} else {
				p = (element.getElementsByTagName('TD')[0]).appendChild(p);
			}
		} else {
			if(element.hasClass("wfSection") || element.hasClass("inlineSection")) {
				p = element.appendChild(p);				
			} else {	
				// If we find a field wrapper, append error message to it.
				var div = document.getElementById(element.id+'-D');
				if(div) {
					p = div.appendChild(p);
				} else {
					// last resort, place the error message just after the field.
					p = element.parentNode.insertBefore(p,element.nextSibling);
				}
			}
		}
	}
	// Finish the error message.
	p.appendChild(txtNode);
	wFORMS.standardizeElement(p);  
	p.addClass(this.behavior.styling.errorMessage);							
}

/**
 * removeErrorMessage
 * @param {domElement} element 
 */
wFORMS.behaviors.validation.instance.prototype.removeErrorMessage = function(element) { 
	
	//  field wrapper DIV. (-D suffix)
	var div = document.getElementById(element.id+'-D');
	
	if(!element.hasClass) wFORMS.standardizeElement(element);
	if(!element.addClass) wFORMS.standardizeElement(element);
	if(!element.removeClass) wFORMS.standardizeElement(element);
	if(div && !div.hasClass) wFORMS.standardizeElement(div);
	if(div && !div.addClass) wFORMS.standardizeElement(div);
	if(div && !div.removeClass) wFORMS.standardizeElement(div);
	
	if(element.hasClass(this.behavior.styling.fieldError)) {
		element.removeClass(this.behavior.styling.fieldError);
	}
	if(div && div.hasClass(this.behavior.styling.fieldError)) {
		div.removeClass(this.behavior.styling.fieldError);
	}
	
	var errorMessage  = document.getElementById(element.id + this.behavior.ERROR_PLACEHOLDER_SUFFIX);
	if(errorMessage)  {
		errorMessage.parentNode.removeChild(errorMessage); 
	}else{
		//Handle nested repeated sections
		if(element.id){
			var name = element.id.split('-D').join('');
			var errorMessage  = document.getElementById(name + this.behavior.ERROR_PLACEHOLDER_SUFFIX);
			if(errorMessage)  {
				errorMessage.parentNode.removeChild(errorMessage); 
			}
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
wFORMS.behaviors.validation.instance.prototype.validateDateTime = function(element, value) {
    if(this.isEmpty(value)){
        return true;
    }

    var regex = wFORMS.behaviors.validation.dateRegex;
    for(var i = 0; i < regex.length - 1; i++){
        if (regex[i].test(value)) {
			return true;
		}
    }

	return false;
};

wFORMS.behaviors.validation.instance.prototype.validateDate = function(element, value) {
    if (this.isEmpty(value)) {
        return true;
}
    var date = this.analyzeDateComponents(value);
    return !(date === null);
};
/**
 * @param value
 * @return null for failure or otherwise a Date object
 */
wFORMS.behaviors.validation.instance.prototype.analyzeDateComponents = function(value){
    var cfg, e;
    try{
        cfg =  wFORMS.helpers.calendar.locale;
    }catch(e){
        cfg = {
            MDY_DAY_POSITION : 1,
            MDY_MONTH_POSITION : 2,
            MDY_YEAR_POSITION : 3
        }
    }

    var splitter = /[\/\.\-\s]/;
    var dArr = value.split(splitter);
    if(dArr.length != 3){
        return null;
    }
    for(var i = 0; i < 3; i++){
        if( !/^\d+$/g.test(dArr[i]) ){
            return null;
        }
    }

    var yr = dArr[cfg.MDY_YEAR_POSITION-1];
    if(yr.length==2) yr = (yr>50) ? '19'+yr : '20'+yr;
    if(yr < 0 || yr > 3000){
        return null;
    }
    var mo = parseInt(dArr[cfg.MDY_MONTH_POSITION-1],10);
    if(mo < 0 || mo > 12){
        return null;
    }
    var dy = parseInt(dArr[cfg.MDY_DAY_POSITION-1],10);
    if(dy < 0 || dy > 31){
        return null;
    }
    var d = new Date(yr,mo-1,dy);
    if (!(d.getMonth() + 1 == mo &&  d.getDate() == dy && d.getFullYear() == yr)){
        return null;
    }
    return d;
};

/**
 * validateTime
 * @param {domElement} element 
 * @returns {boolean} 
 */
wFORMS.behaviors.validation.instance.prototype.validateTime = function(element, value) {
	/* not yet implemented */	
    if (this.isEmpty(value)) {
	return true;
}
    return this.analyzeTimeComponents(value) !== null;
};

wFORMS.behaviors.validation.instance.prototype.analyzeTimeComponents = function(value){
    var isAm = false, isPm = false, match;
    //detect am or pm
    if(match = value.match(/a[^\da-z]?m/ig)){
        if( match.length > 1 ){
            // too many a.m definitions
            return null;
        }else if(match.length == 1){
            isAm = true;
        }
    }

    if(match = value.match(/p[^\da-z]?m/ig)){
        if(match.length > 1){
            // too many p.m definitions
            return null;
        }else if(match.length == 1){
            isPm = true;
        }
    }

    if(isAm && isPm){
        return null;
    }

    var parts = null;
    var hour = 0, minute = 0, second = 0; match = false;
    if( (parts = value.match(/(\d{1,2})[-:](\d{1,2})[-:](\d{1,2})/))  && parts.length == 4){
        hour = parseInt(parts[1]);
        minute = parseInt(parts[2]);
        second = parseInt(parts[3]);
        match = true;
    }else if((parts = value.match(/(\d{1,2})[-:](\d{1,2})/)) && parts.length == 3){
        hour = parseInt(parts[1]);
        minute = parseInt(parts[2]);
        match = true;
    }else if((parts = value.match(/(\d{1,2})/)) && parts.length == 2){
        hour = parseInt(parts[1]);
        match = true;
    }
    if(!match){
        return null;
    }

    if(isPm){
        hour+=12;
        if(hour == 24){
            hour = 0
        }
    }else if(isAm && hour > 12){
        return null;
    }
    if(hour < 0 || hour > 23 || minute < 0 || minute > 59 || second < 0 || second > 59){
        return null;
    }

    return new Date(0, 0, 0, hour, minute, second, 0);
};

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
	var regexp = /^[\-+]?\d+$/;
	return this.isEmpty(value) || regexp.test(value);
}

/**
 * validateFloat
 * @param {domElement} element 
 * @returns {boolean} 
 */
wFORMS.behaviors.validation.instance.prototype.validateFloat = function(element, value) {
	var regexp = /^[\-+]?((([1-9]\d*|0)?\.\d+)|([1-9]\d*))$/;
	return this.isEmpty(value) || regexp.test(value);
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
	if (this.isEmpty(value)) {
		return true;
	}	
	if(matches && matches[0]) {										
		var validationPattern = new RegExp(matches[1],matches[2]);
		if(!value.match(validationPattern)) {
			return false									
		}
	}		
	return true;
}

wFORMS.behaviors.validation.instance.prototype.numberRangeTest = function(element, value, errMessage){
    var lbound = null, ubound = null, lboundRaw, uboundRaw;
    if(this.isEmpty(value)){
        return true;
    }
    lboundRaw = element.getAttribute(wFORMS.behaviors.validation.LOWER_BOUND_ATTRIBUTE);
    if(lboundRaw && (this.validateFloat(lboundRaw) || this.validateInteger(lboundRaw))){
        lbound = parseFloat(lboundRaw);
    }

    uboundRaw = element.getAttribute(wFORMS.behaviors.validation.UPPER_BOUND_ATTRIBUTE);
    if(uboundRaw  && (this.validateFloat(uboundRaw) || this.validateInteger(uboundRaw))){
        ubound = parseFloat(uboundRaw);
    }

    value = parseFloat(value);
    if(isNaN(value) || value === undefined || value === null){
        return false;
    }

    if( lbound && (value < lbound) ){
        if(ubound){
            return errMessage.min.replace(/%1/g, lbound) + ' ' + errMessage.max.replace(/%1/g, ubound);
        }
        return errMessage.min.replace(/%1/g, lbound);
    }


    if( ubound && (value > ubound) ){
        if(lbound){
            return errMessage.min.replace(/%1/g, lbound) + ' ' + errMessage.max.replace(/%1/g, ubound);
        }
        return errMessage.max.replace(/%1/g, ubound);
    }

    return true;
};

wFORMS.behaviors.validation.instance.prototype.dateRangeTest = function(element, value, errMessage){
    return this.dateTimeRangeTestCommon(element, value, errMessage, 'analyzeDateComponents');
};

wFORMS.behaviors.validation.instance.prototype.timeRangeTest = function(element, value, errMessage){
    return this.dateTimeRangeTestCommon(element, value, errMessage, 'analyzeTimeComponents');
};

wFORMS.behaviors.validation.instance.prototype.dateTimeRangeTestCommon = function(element, value, errMessage, conversionFunc){
    var lbound = null, ubound = null, lboundRaw, uboundRaw;
    if(this.isEmpty(value)){
        return true;
    }
    lboundRaw = element.getAttribute(wFORMS.behaviors.validation.LOWER_BOUND_ATTRIBUTE);
    if(lboundRaw ){
        lbound = this[conversionFunc](lboundRaw);
    }

    uboundRaw = element.getAttribute(wFORMS.behaviors.validation.UPPER_BOUND_ATTRIBUTE);
    if(uboundRaw ){
        ubound = this[conversionFunc](uboundRaw);
    }

    if( (value = this[conversionFunc](value) ) === null ){
        return false;
    }

    if( lbound && (value.getTime() < lbound.getTime()) ){
        if(ubound){
            return errMessage.min.replace(/%1/g, lboundRaw) + ' ' + errMessage.max.replace(/%1/g, uboundRaw);
        }
        return errMessage.min.replace(/%1/g, lboundRaw);
    }


    if( ubound && (value.getTime() > ubound.getTime()) ){
        if(lbound){
            return errMessage.min.replace(/%1/g, lboundRaw) + ' ' + errMessage.max.replace(/%1/g, uboundRaw);
        }
        return errMessage.max.replace(/%1/g, uboundRaw);
    }

    return true;
};
