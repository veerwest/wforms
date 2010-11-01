
if (typeof(wFORMS) == "undefined") {
	throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
/**
 * wForms form prefilling behavior
 * 
 */
wFORMS.behaviors.prefill = {

	instance: function(f) {
		this.behavior = wFORMS.behaviors.prefill; 
		this.target   = f;
		var self 	  = this;
	}
}

/**
 * Factory Method
 * Applies the behavior to the given HTML element 
 * @param {domElement} f An HTML element, either nested inside a FORM element or (preferably) the FORM element itself.
 * @return {object} an instance of the behavior 
 */	
wFORMS.behaviors.prefill.applyTo = function(f) {
	var bi = new wFORMS.behaviors.prefill.instance(f);
	
	var _bs = wFORMS.getBehaviorInstance(f,'switch');
	var _bc = wFORMS.getBehaviorInstance(f,'calculation');
	
	var params = bi.getParameters();
	
	for(var fieldName in params) {
		var fld = f.elements[fieldName];
    	if(fld) {
    	    bi.populateField(fld, params[fieldName], _bs, _bc);
    	} else {
    	    // Allow checkbox selection by providing the id of a wrapper element and a list of labels or ids for the check boxes.
    	    var div = document.getElementById(fieldName);
    	    if(div) {
    	        var flds = div.querySelectorAll('input[type=checkbox]').forEach(function(fld) {
    	        	bi.populateField(fld, params[fieldName], _bs, _bc);
    	        });
    	    }
    	}
    	
    }	
	bi.onApply();
	return bi;	   
}
/**
 * Executed once the behavior has been applied to the document.
 * Can be overwritten.
 */
wFORMS.behaviors.prefill.instance.prototype.onApply = function() {} 
	
 
wFORMS.behaviors.prefill.instance.prototype.populateField = function(fld, value, _bs, _bc) {
	if(fld) {
		if(fld.tagName) {
	    	if((fld.tagName=='INPUT' && (fld.type=='text' || fld.type=='hidden' || fld.type=='password'))
	    	          ||(fld.tagName=='TEXTAREA'));
	    		fld.value = value; 
	    	if(fld.tagName=='INPUT' && fld.type=='checkbox') {
	    		if((value=='1' || this.getLabel(fld)==value || fld.id==value)) {
	    			fld.checked = true;
	    		} else {
	    			// allow multiple selections by providing a ';' separated list of labels or ids.
	    			var values = value.split(';');
	    			for(var i=0; i<values.length;i++) {
	    				var v = values[i].replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // trim
	    				if((v=='1' || this.getLabel(fld)==v || fld.id==v)) {
			    			fld.checked = true;
			    		}
	    			}	
	    		}
	    	}
	    	if(fld.tagName=='SELECT' && !fld.hasAttribute('multiple')) {
	    		for(var j=0; j<fld.options.length; j++) {
    	            if(fld.options[j].value == value || fld.options[j].text == value) {
    	                fld.options[j].selected=true;
    	            }
    	        }
	    	}
	    	if(fld.tagName=='SELECT' && fld.hasAttribute('multiple')) {
	    	    // allow multiple selections by providing a ';' separated list of labels or ids.
	    	    var values = value.split(';');
	    	    for(var j=0; j<fld.options.length; j++) {
	    	    	// test against full label first
	    	    	if(fld.options[j].value == value || fld.options[j].text == value) {
    	                fld.options[j].selected=true;
    	            } else {	    	    	
		    	    	for(var i=0; i<values.length;i++) {
			    	        var v = values[i].replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // trim
			    	        if(fld.options[j].value == v || fld.options[j].text == v) {
		    	                fld.options[j].selected=true;
		    	            }
			    	    }
    	            }
    	        }	    	    			    	   
            }
			if(_bs) { // trigger switch behavior if appropriate.
				_bs.run(null,fld);
			}
			if(_bc) { // trigger calculation behavior if appropriate.
				_bc.run(null,fld);
			}
		} else {
			// radio group    			
    		for (i=0;i<fld.length;i++) {
				if (fld[i].value==value || this.getLabel(fld[i]) == value) {
					fld[i].checked = true;
					if(_bs) { // trigger switch behavior if appropriate.
						_bs.run(null,fld[i]);
					}
					if(_bc) { // trigger calculation behavior if appropriate.
						_bc.run(null,fld[i]);
					}
					break;						
				}
			}
    	}
	}
}

/**
 * returns the label associated to the given input (looking for matching <label> 
 * element with the 'for' attribute set to the input's ID).
 * Requires querySelectorAll support (native, or via base2 binding)
 */
wFORMS.behaviors.prefill.instance.prototype.getLabel = function(field) {
    if(!field || !field.form) { return null };
    if(!field.form.querySelectorAll) { return null };
    
    var fieldId = field.getAttribute('id');
    l = field.form.querySelectorAll("label[for="+fieldId+"]");
    if(l && l.length>=1) {
        return l[0].innerHTML;
    }
    return null;
}

wFORMS.behaviors.prefill.instance.prototype.getParameters = function(/* querystring */) {
	var param = Array();
	if(arguments.length==1) {
		var q = arguments[0];
	} else {
		var q = document.location.search;
	}
	if(q.length==0) 
		return;
	if(q.split('?')[1]) {
		var v = q.split('?')[1].split('&');
	} else {
		var v = q.split('&');
	}
    
    for(var i=0;i<v.length;i++) {
    	param[v[i].split('=')[0]] = decodeURIComponent(v[i].split('=')[1]);
    }
    return param;
} 