//Crossbrowser hacks. 
try{
	if( NodeList && !(NodeList.prototype.forEach))
	{
		NodeList.prototype.forEach = function (a, b) { for (var i = 0; i < this.length; i++) { a.call(b, this.item(i), i, this); } };
	} 
}catch(e){};

try{
	if(typeof StaticNodeList !='undefined' && !(StaticNodeList.prototype.forEach)){
		StaticNodeList.prototype.forEach = function (a, b) { for (var i = 0; i < this.length; i++) { a.call(b, this.item(i), i, this); } };
	}
}catch(e){};

try{
	//IE9 doesn't seem to respect the StaticNodeList prototype setup above
	//best way I've found so far to add the forEach to querySelectorAll calls
	if(!(document.querySelectorAll('a').constructor.prototype.forEach)){
		document.querySelectorAll('a').constructor.prototype.forEach = function (a, b) { for (var i = 0; i < this.length; i++) { a.call(b, this.item(i), i, this); } };
	}
}catch(e){};
//

if (typeof(base2) == "undefined") {
	throw new Error("Base2 not found. wForms 3 depends on the base2 library.");
}

/* Base2 beta2 backward compatibility. 
 */
base2.DOM.HTMLElement.implement({
  hasClass : function($node, $class) {
	if($node.classList && $node.classList.contains) return $node.classList.contains($class);
	else return $node.className.match(new RegExp('(\\s|^)'+$class+'(\\s|$)'));
  },
  removeClass : function($node, $class) {
	if($node.classList && $node.classList.remove) return $node.classList.remove($class);
	else if (base2.DOM.HTMLElement.hasClass($node,$class)) {
    	var reg = new RegExp('(\\s|^)'+$class+'(\\s|$)');
    	$node.className=$node.className.replace(reg,' ').replace(/^\s+|\s+$/g,"");
	}
  },
  addClass : function($node, $class) {
	if($node.classList && $node.classList.add) $node.classList.add($class);
	else if (!base2.DOM.HTMLElement.hasClass($node,$class)) {
		$node.className = ($node.className+" "+$class).replace(/^\s+|\s+$/g,"");
	}
  }
}); 

if (typeof(wFORMS) == "undefined") {
	wFORMS = {};
}
wFORMS.NAME 	= "wFORMS";
wFORMS.VERSION 	= "3.2";
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
		wFORMS.standardizeElement(e.form);
		return e.form;
	} else if (e.parentNode) {
		if (e.parentNode.tagName.toLowerCase() == 'form') {
			wFORMS.standardizeElement(e.parentNode);
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

// Loader config
wFORMS.LOADER    	  = {};
wFORMS.LOADER.enabled = false;
wFORMS.LOADER.message = "Please wait...";
wFORMS.LOADER.spinner = ""; // image url
wFORMS.LOADER.speed   = 2;

wFORMS.LOADER.show = function(placeholder) {
	if(wFORMS.LOADER.enabled) {
	
		// Create the loader div
		var p = wFORMS.LOADER.create();
		
		// We'll adjust the size of the div to deduce the padding. Avoid flicker by hiding it.
		p.style.visibility = "hidden"; 
		p.style.overflow   = "hidden"; // triggers hasLayout in IE7
		
		/*@cc_on
		@if(@_jscript_version <= 5.7)
			p.style.width = "100%"; // triggers hasLayout in IE6			
		@end
		@*/
		
		// Insert in DOM
		var where = (arguments[1]=='above')?placeholder:placeholder.nextSibling;
		p     	  = placeholder.parentNode.insertBefore(p,where);
		p.id      = "wfLoader_"+placeholder.id;
		wFORMS.LOADER._id = p.id;
		
		// Get div padding (set from CSS). We'll need it to collapse the div. 
		var h = p.clientHeight;
		p.style.height = h+'px';
		wFORMS.LOADER._padding = p.clientHeight-h;
		
		// Reset height correctly 
		p.style.height = (h-wFORMS.LOADER._padding)+'px';
		
		// Show div
		p.style.visibility = "visible";		
	}	
}
wFORMS.LOADER.hide = function(placeholder) {
	if(wFORMS.LOADER.enabled && wFORMS.LOADER._id) {	
		var p = document.getElementById(wFORMS.LOADER._id);
		
		if(p) {			
			if(arguments[1]) {
				// quick 
				p.parentNode.removeChild(p);
			} else {
				// collapse div, then remove it.
				wFORMS.LOADER._interval = setInterval(function() {
					var h = p.clientHeight - wFORMS.LOADER.speed - wFORMS.LOADER._padding;
					if(h<0) h=0;										
					p.style.height = h +'px';
					if(p && !(p.clientHeight - wFORMS.LOADER._padding)) {
						p.parentNode.removeChild(p);
						clearInterval(wFORMS.LOADER._interval);
					}
				}, 10);
			}
		}
		wFORMS.LOADER._id = null;
	}
}
wFORMS.LOADER.create = function() {
	var d = document.createElement('DIV');
	d.className = "wfLoader";
	
	var i = d.appendChild(document.createElement('DIV'));
	i.className = 'inner';
	
	if(wFORMS.LOADER.spinner) {
		var img = i.appendChild(document.createElement('IMG'));
		img.src= wFORMS.LOADER.spinner;
	}
	if(wFORMS.LOADER.message) {
		i.appendChild(document.createTextNode(wFORMS.LOADER.message));
	}	
	return d;
}



/**
 * Initialization routine. Automatically applies the behaviors to all web forms in the document.  
 */	
wFORMS.onLoadHandler = function() {
	var forms=document.getElementsByTagName("FORM");
	
	for(var i=0;i<forms.length;i++) {		
		// wrapper for setTimeout closure 
		// (behaviors not applied correctly otherwise when 2+ forms)
		var _f = function(f) {  
			if(f.getAttribute('rel')!='no-behavior') {
				wFORMS.LOADER.show(f,'above');
				setTimeout( function() {
					wFORMS.applyBehaviors(f); 
					wFORMS.LOADER.hide(f); 
				}, 1);	
			}			
		}(forms[i]);
	}	
}
/**
 * note: should be in wFORMS.helpers
 */
wFORMS.standardizeElement = function(elem) {
	if(!elem.addEventListener) {
		elem.addEventListener = function(event,handler,p) {
			base2.DOM.Element.addEventListener(this,event,handler,p);
		}
	}
	if(!elem.hasClass) {
		elem.hasClass = function(className) { 
			if((' ' + this.className + ' ').indexOf(' ' + className +' ') != -1) {
				return true;
			}			
			return false;		
		};
	}
	if(!elem.removeClass) {
		elem.removeClass = function(className) { return base2.DOM.HTMLElement.removeClass(this,className) };
	}
	if(!elem.addClass) {
		elem.addClass = function(className) { return base2.DOM.HTMLElement.addClass(this,className) };	
	}
}
/**
 * Initialization routine. Automatically applies all behaviors to the given element.
 * @param {domElement} A form element, or any of its children.
 * TODO: Kill existing instances before applying the behavior to the same element. 
 */	
wFORMS.applyBehaviors = function(f) {
	
	// Test if base2 already applied. Prevents stack overflow error in test suite with IE8 standard mode.
	//   see: http://code.google.com/p/base2/issues/detail?id=111#c2 for  
	// reapply anyway for Opera 10 and IE <= 7 or IE8 quirk mode (unit tests fail otherwise)  
	if(!!base2.DOM.bind[f.base2ID] || window.opera || navigator.userAgent.match(/MSIE [567]/) || (navigator.userAgent.match(/MSIE 8/) && document.compatMode=='BackCompat') ) {
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

// Enable JS only stylesheet.
wFORMS.helpers.activateStylesheet('wforms-jsonly.css');

// Enable user-agent specific stylesheets
if(navigator.userAgent.match(/iPad/i)){
	wFORMS.helpers.activateStylesheet('wforms-layout-ipad.css');
}