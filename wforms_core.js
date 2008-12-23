//This should be removed when base2 becomes safari compatable. 
if( navigator.appVersion.search(/Safari/) != -1)
{
NodeList.prototype.forEach = function (a, b) { for (var i = 0; i < this.length; i++) { a.call(b, this.item(i), i, this); } };
} 
//

if (typeof(base2) == "undefined") {
	throw new Error("Base2 not found. wForms 3.0 depends on the base2 library.");
}

if (typeof(wFORMS) == "undefined") {
	wFORMS = {};
}
wFORMS.NAME 	= "wFORMS";
wFORMS.VERSION 	= "3.0";
wFORMS.__repr__ = function () {
	return "[" + this.NAME + " " + this.VERSION + "]";
};
wFORMS.toString = function () {
	return this.__repr__();
};

wFORMS.behaviors = {};
wFORMS.helpers   = {}
wFORMS.instances = []; // keeps track of behavior instances

/**
 * Helper method.
 * @return {string} A randomly generated id (with very high probability of uniqueness). 
 */	
wFORMS.helpers.randomId = function () {
	var seed = (new Date()).getTime();
	seed = seed.toString().substr(6);
	for (var i=0; i<6;i++)
		seed += String.fromCharCode(48 + Math.floor((Math.random()*10)));
	return "id_" + seed;
}

/**
 * getFieldValue 
 * @param {domElement} element 
 * @returns {string} the value of the field. 
 */
wFORMS.helpers.getFieldValue = function(element) {
	switch(element.tagName) {
		case "INPUT":
			if(element.type=='checkbox')
				return element.checked?element.value:null;
			if(element.type=='radio')
				return element.checked?element.value:null;
			return element.value;
			break;
		case "SELECT":		
			if(element.selectedIndex==-1) {					
				return null; 
			} 
			if(element.getAttribute('multiple')) {
				var v=[];
				for(var i=0;i<element.options.length;i++) {
					if(element.options[i].selected) {
						v.push(element.options[i].value);
					}
				}
				return v;
			}											
			return element.options[element.selectedIndex].value;
			break;
		case "TEXTAREA":
			// TODO: fix this
			return element.value;
			break;
		default:
			return null; 
			break;
	} 	 
}

/**
 * DEPRECATED
 * Returns computed style from the element by style name
 * @param	{HTMLElement}	element
 * @param	{String}	styleName
 * @return	{String} or false
 */
wFORMS.helpers.getComputedStyle = function(element, styleName){
	return document.defaultView.getComputedStyle(element, "").getPropertyValue(styleName);
}

/**
 * finds the parent form of any element
 */
wFORMS.helpers.getForm = function (e) {
	if (e.form) {
		return e.form;
	} else if (e.parentNode) {
		if (e.parentNode.tagName.toLowerCase() == 'form') {
			return e.parentNode;
		} else {
			return this.getForm(e.parentNode);
		}
	} else {
		return null;
	}
};

/**
 * Returns left position of the element
 * @params	{HTMLElement}	elem	Source element 
 */
wFORMS.helpers.getLeft = function(elem){
	var pos = 0;
	while(elem.offsetParent) {
		try {
			if(document.defaultView.getComputedStyle(elem, "").getPropertyValue('position') == 'relative'){
				return pos;
			}
			if(pos > 0 && document.defaultView.getComputedStyle(elem, "").getPropertyValue('position') == 'absolute'){
				return pos;
			}
		} catch(x) {}
		pos += elem.offsetLeft;
		
		elem = elem.offsetParent;
		
	}
 	if(!window.opera && document.all && document.compatMode && document.compatMode != "BackCompat") {
		pos += parseInt(document.body.currentStyle.marginTop); 	   		
 	}
	return pos;
}

/**
 * Returns top position of the element
 * @params	{HTMLElement}	elem	Source element 
 */
wFORMS.helpers.getTop = function(elem){
	var pos = 0;
	while(elem.offsetParent) {
		try {
			if(document.defaultView.getComputedStyle(elem, "").getPropertyValue('position') == 'relative'){
				return pos;
			}
			if(pos > 0 && document.defaultView.getComputedStyle(elem, "").getPropertyValue('position') == 'absolute'){
				return pos;
			}
		} catch(x) {}
		pos += elem.offsetTop;
		
		elem = elem.offsetParent;
	}
	if(!window.opera && document.all && document.compatMode && document.compatMode != "BackCompat") {
		pos += parseInt(document.body.currentStyle.marginLeft) + 1; 	   		
 	}
	return pos;
}

/**
 * determine the position of an element relative to the document
 */
wFORMS.helpers.position = function (element) {
	var x = element.offsetLeft;
	var y = element.offsetTop;
	if (element.offsetParent) {
		var p = this.position(element.offsetParent);
		x += p.left;
		y += p.top;
	}
	return {left: x, top: y};
};

/**
 * highlight change 
 */ 
wFORMS.helpers.useSpotlight = false;

wFORMS.helpers.spotlight = function(target) {
	// not implemented	 	
}

/**
 * Activating an Alternate Stylesheet (thx to: http://www.howtocreate.co.uk/tutorials/index.php?tut=0&part=27)
 * Use this to activate a CSS Stylesheet that shouldn't be used if javascript is turned off.
 * The stylesheet rel attribute should be 'alternate stylesheet'. The title attribute MUST be set.
 */
wFORMS.helpers.activateStylesheet = function(sheetref) {
	if(document.getElementsByTagName) {
		var ss=document.getElementsByTagName('link');
	} else if (document.styleSheets) {
		var ss = document.styleSheets;
	}
	for(var i=0;ss[i];i++ ) {
		if(ss[i].href.indexOf(sheetref) != -1) {
			ss[i].disabled = true;
			ss[i].disabled = false;			
		}
	}
}

wFORMS.helpers.contains = function(array, needle) {
	var l=array.length;
	for (var i=0; i<l; i++) {
		if(array[i] === needle) {
			return true;
		}
	}
	return false;
}
/**
 * Initialization routine. Automatically applies the behaviors to all web forms in the document.  
 */	
wFORMS.onLoadHandler = function() {
	var forms=document.getElementsByTagName("FORM");
	
	for(var i=0;i<forms.length;i++) {
		if(forms[i].getAttribute('rel')!='no-behavior')
			wFORMS.applyBehaviors(forms[i]);
	}	
}
/**
 * 
 */
wFORMS.standardizeElement = function(elem) {
	if(!elem.addEventListener) {
		elem.addEventListener = function(event,handler,p) {
			base2.DOM.Element.addEventListener(this,event,handler,p);
		}
	}
	if(!elem.hasClass) {
		elem.hasClass = function(className) { 
			var regexp = new RegExp("(^|\\s)" + className + "(\\s|$)");
			return regexp.test(elem.className);
		};
	}
	if(!elem.removeClass) {
		elem.removeClass = function(className) {
			var regexp = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
			//elem.className = trim(elem.className.replace(regexp, "$2"));
			elem.className = elem.className.replace(regexp, "$2");
			elem.className = String(elem.className).replace(/^\s\s*/, "").replace(/\s\s*$/, "");
		};
	}
	if(!elem.addClass) {
		elem.addClass = function(className) {
			if (!this.hasClass(elem, className)) {
		      elem.className += (elem.className ? " " : "") + className;
			}
		};	
	}
}
/**
 * Initialization routine. Automatically applies all behaviors to the given element.
 * @param {domElement} A form element, or any of its children.
 * TODO: Kill existing instances before applying the behavior to the same element. 
 */	
wFORMS.applyBehaviors = function(f) {
	
	if(!f.querySelectorAll) {
		base2.DOM.bind(f);
	}
	// switch must run before paging behavior
	if(wFORMS.behaviors['switch']){
		var b = wFORMS.behaviors['switch'].applyTo(f);
		if(!wFORMS.instances['switch']) {
			wFORMS.instances['switch'] = [b];
		} else {
			wFORMS.removeBehavior(f, 'switch');
			wFORMS.instances['switch'].push(b);
		}		
	}
	for(var behaviorName in wFORMS.behaviors) {
		if(behaviorName == 'switch'){
			continue;
		}		
		if(wFORMS.behaviors[behaviorName].applyTo) {
			// It is a behavior.
			
			var b = wFORMS.behaviors[behaviorName].applyTo(f);
			
			// behaviors may create several instances
			// if single instance returned, convert it to an array
			if(b && b.constructor != Array) {
				b=[b];			
			} 
			
			for(var i=0;b && i<b.length;i++) {
				if(!wFORMS.instances[behaviorName]) {
					wFORMS.instances[behaviorName] = [b[i]];
				} else {
					wFORMS.removeBehavior(f, behaviorName);
					wFORMS.instances[behaviorName].push(b[i]);
				}
			}
		}
	}
	if(wFORMS.behaviors.onApplyAll) {
		wFORMS.behaviors.onApplyAll(f);
	}
}

wFORMS.removeBehavior = function(f, behaviorName) {
	
	return null;
	
	if(!wFORMS.instances[behaviorName]) 
		return null;

	for(var i=0; i < wFORMS.instances[behaviorName].length; i++) {
		if(wFORMS.instances[behaviorName][i].target==f) {
			
			// TODO: call a remove method for each behavior to cleanly remove any event handler
			wFORMS.instances[behaviorName][i] = null;
		}	
	}
	return null;
}

/**
 * Returns the behavior instance associated to the given form/behavior pair.
 * @param	{domElement}	a HTML element (often the form element itself)
 * @param	{string}		the name of the behavior 
 * @return	{object}		the instance of the behavior 
 * TODO: Returns an array if more than one instance for the given form
 */
wFORMS.getBehaviorInstance = function(f, behaviorName) {
	if(!f || !wFORMS.instances[behaviorName]) 
		return null;
	
	for(var i=0; i < wFORMS.instances[behaviorName].length; i++) {
		if(wFORMS.instances[behaviorName][i].target==f) {
			return wFORMS.instances[behaviorName][i];
		}	
	}
	return null;
}

base2.DOM.Element.addEventListener(document, 'DOMContentLoaded',wFORMS.onLoadHandler,false);
// document.addEventListener('DOMContentLoaded',wFORMS.onLoadHandler,false);

// Attach JS only stylesheet.
wFORMS.helpers.activateStylesheet('wforms-jsonly.css');





