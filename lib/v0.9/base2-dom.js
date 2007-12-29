// timestamp: Fri, 10 Aug 2007 20:00:50

new function(_) { ////////////////////  BEGIN: CLOSURE  ////////////////////

// =========================================================================
// DOM/namespace.js
// =========================================================================

var DOM = new base2.Namespace(this, {
  name:    "DOM",
  version: "0.9 (alpha)",
  exports:
    "Interface, Binding, AbstractView, Event, EventTarget, NodeSelector, DocumentEvent, DocumentSelector, ElementSelector, " +
    "StaticNodeList, ViewCSS, Node, Document, Element, HTMLDocument, HTMLElement, Selector, Traversal, XPathParser",
  
  bind: function(node) {
    // apply a base2 DOM Binding to a native DOM node
    if (node && node.nodeType) {
      var uid = assignID(node);
      if (!arguments.callee[uid]) {
        switch (node.nodeType) {
          case 1: // Element
            if (typeof node.className == "string") {
              // it's an HTML element, use bindings based on tag name
              (HTMLElement.bindings[node.tagName] || HTMLElement).bind(node);
            } else {
              Element.bind(node);
            }
            break;
          case 9: // Document
            if (node.links) {
              HTMLDocument.bind(node);
            } else {
              Document.bind(node);
            }
            break;
          default:
            Node.bind(node);
        }
        arguments.callee[uid] = true;
      }
    }
    return node;
  }
});

eval(this.imports);

// =========================================================================
// DOM/plumbing.js
// =========================================================================

// avoid memory leaks

if (detect("MSIE[56].+win") && !detect("SV1")) {
  var closures = {}; // all closures stored here
  
  extend(base2, "bind", function(method, element) {
    if (!element || element.nodeType != 1) {
      return this.base(method, element);
    }
    
    // unique id's for element and function
    var elementID = element.uniqueID;
    var methodID = assignID(method);
    
    // store the closure in a manageable scope
    closures[methodID] = method;
    
    // reset pointers
    method = null;
    element = null;
    
    if (!closures[elementID]) closures[elementID] = {};
    var closure = closures[elementID][methodID];
    if (closure) return closure; // already stored
    
    var bound = function() {
      var element = document.all[elementID];
      if (element) return closures[methodID].apply(element, arguments);
    };
    bound._cloneID = methodID;
    closures[elementID][methodID] = bound;
    
    return bound;
  });
  
  attachEvent("onunload", function() {
    closures = null; // closures are destroyed when the page is unloaded
  });
}

// =========================================================================
// DOM/Interface.js
// =========================================================================

// The Interface module is the base module for defining DOM interfaces.
// Interfaces are defined with reference to the original W3C IDL.
// e.g. http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-1950641247

var Interface = Module.extend(null, {
  implement: function(_interface) {    
    if (typeof _interface == "object") {
      forEach (_interface, function(source, name) {
        if (name.charAt(0) == "@") {
          forEach (source, arguments.callee, this);
        } else if (!this[name] && typeof source == "function") {
          this.createDelegate(name, source.length);
        }
      }, this);
    }
    return this.base(_interface);
  },
  
  createDelegate: function(name, length) {
    // delegate a static method to the bound object
    //  e.g. for most browsers:
    //    EventTarget.addEventListener(element, type, listener, capture) 
    //  forwards to:
    //    element.addEventListener(type, listener, capture)
    if (!this[name]) {
      var FN = "var fn=function _%1(%2){%3.base=%3.%1.ancestor;var m=%3.base?'base':'%1';return %3[m](%4)}";
      var args = "abcdefghij".split("").slice(-length);
      eval(format(FN, name, args, args[0], args.slice(1)));
      fn._delegate = name;
      this[name] = fn;
    }
  }
});

// =========================================================================
// DOM/Binding.js
// =========================================================================

var Binding = Interface.extend(null, {
  bind: function(object) {
    return this(object); // cast
  }
});

// =========================================================================
// DOM/Traversal.js
// =========================================================================

// DOM Traversal. Just the basics.

// Loosely based on this:
// http://www.w3.org/TR/2007/WD-ElementTraversal-20070727/

var Traversal = Module.extend({
  getDefaultView: function(node) {
    return this.getDocument(node).defaultView;
  },
  
  getNextElementSibling: function(node) {
    // return the next element to the supplied element
    //  nextSibling is not good enough as it might return a text or comment node
    while (node && (node = node.nextSibling) && !this.isElement(node)) continue;
    return node;
  },

  getNodeIndex: function(node) {
    var index = 0;
    while (node && (node = node.previousSibling)) index++;
    return index;
  },
  
  getOwnerDocument: function(node) {
    // return the node's containing document
    return node.ownerDocument;
  },
  
  getPreviousElementSibling: function(node) {
    // return the previous element to the supplied element
    while (node && (node = node.previousSibling) && !this.isElement(node)) continue;
    return node;
  },

  getTextContent: function(node) {
    return node[Traversal.$TEXT];
  },

  isEmpty: function(node) {
    node = node.firstChild;
    while (node) {
      if (node.nodeType == 3 || this.isElement(node)) return false;
      node = node.nextSibling;
    }
    return true;
  },

  setTextContent: function(node, text) {
    return node[Traversal.$TEXT] = text;
  },
  
  "@MSIE": {
    getDefaultView: function(node) {
      return this.getDocument(node).parentWindow;
    },
  
    "@MSIE5": {
      // return the node's containing document
      getOwnerDocument: function(node) {
        return node.ownerDocument || node.document;
      }
    }
  }
}, {
  $TEXT: "textContent",
  
  contains: function(node, target) {
    while (target && (target = target.parentNode) && node != target) continue;
    return !!target;
  },
  
  getDocument: function(node) {
    // return the document object
    return this.isDocument(node) ? node : this.getOwnerDocument(node);
  },
  
  isDocument: function(node) {
    return !!(node && node.documentElement);
  },
  
  isElement: function(node) {
    return !!(node && node.nodeType == 1);
  },
  
  "@(element.contains)": {  
    contains: function(node, target) {
      return node != target && this.isDocument(node) ? node == this.getOwnerDocument(target) : node.contains(target);
    }
  },
  
  "@MSIE": {
    $TEXT: "innerText"
  },
  
  "@MSIE5": {
    isElement: function(node) {
      return !!(node && node.nodeType == 1 && node.tagName != "!");
    }
  }
});

// =========================================================================
// DOM/views/AbstractView.js
// =========================================================================

// This is just fluff for now.

var AbstractView = Binding.extend();

// =========================================================================
// DOM/events/Event.js
// =========================================================================

// http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-Event

var Event = Binding.extend({  
  "@!(document.createEvent)": {
    initEvent: function(event, type, bubbles, cancelable) {
      event.timeStamp = new Date().valueOf();
      event.type = type;
      event.bubbles = bubbles;
      event.cancelable = cancelable;
    },
    
    "@MSIE": {
      initEvent: function(event, type, bubbles, cancelable) {
        this.base(event, type, bubbles, cancelable);
        event.cancelBubble = !event.bubbles;
      },
      
      preventDefault: function(event) {
        if (event.cancelable !== false) {
          event.returnValue = false;
        }
      },
    
      stopPropagation: function(event) {
        event.cancelBubble = true;
      }
    }
  }
}, {
  BUBBLES: "abort,error,select,change,resize,scroll", // + Event.CANCELABLE
  CANCELABLE: "click,mousedown,mouseup,mouseover,mousemove,mouseout,keydown,keyup,submit,reset",
  
  init: function() {
    this.BUBBLES = Array2.combine((this.BUBBLES + "," + this.CANCELABLE).split(","));
    this.CANCELABLE = Array2.combine(this.CANCELABLE.split(","));
  },
  
  "@MSIE": {
    "@Mac": {
      bind: function(event) {
        // Mac IE5 does not allow expando properties on the event object so
        //  we copy the object instead.
        return this.base(extend({
          preventDefault: function() {
            if (this.cancelable !== false) {
              this.returnValue = false;
            }
          }
        }, event));
      }
    },
    
    "@Windows": {
      bind: function(event) {
        this.base(event);
        if (!event.timeStamp) {
          event.bubbles = !!this.BUBBLES[event.type];
          event.cancelable = !!this.CANCELABLE[event.type];
          event.timeStamp = new Date().valueOf();
        }
        if (!event.target) {
          event.target = event.srcElement;
        }
        event.relatedTarget = event.fromElement || null;
        return event;
      }
    }
  }
});

// =========================================================================
// DOM/events/EventTarget.js
// =========================================================================

// http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-Registration-interfaces

// TO DO: event capture

var EventTarget = Interface.extend({
  "@!(element.addEventListener)": {
    addEventListener: function(target, type, listener, capture) {
      // assign a unique id to both objects
      var targetID = assignID(target);
      var listenerID = listener._cloneID || assignID(listener);
      // create a hash table of event types for the target object
      var events = EventTarget.$all[targetID];
      if (!events) events = EventTarget.$all[targetID] = {};
      // create a hash table of event listeners for each object/event pair
      var listeners = events[type];
      var current = target["on" + type];
      if (!listeners) {
        listeners = events[type] = {};
        // store the existing event listener (if there is one)
        if (current) listeners[0] = current;
      }
      // store the event listener in the hash table
      listeners[listenerID] = listener;
      if (current !== undefined) {
        target["on" + type] = delegate(EventTarget.$handleEvent);
      }
    },
  
    dispatchEvent: function(target, event) {
      return EventTarget.$handleEvent(target, event);
    },
  
    removeEventListener: function(target, type, listener, capture) {
      // delete the event listener from the hash table
      var events = EventTarget.$all[target.base2ID];
      if (events && events[type]) {
        delete events[type][listener.base2ID];
      }
    },
    
    "@MSIE.+win": {
      addEventListener: function(target, type, listener, capture) {
        // avoid memory leaks
        if (typeof listener == "function") {
          listener = bind(listener, target);
        }
        this.base(target, type, listener, capture);
      },
      
      dispatchEvent: function(target, event) {
        event.target = target;
        try {
          return target.fireEvent(event.type, event);
        } catch (error) {
          // the event type is not supported
          return this.base(target, event);
        }
      }
    }
  }
}, {  
  dispatchEvent: function(target, event) {
    // a little sugar
    if (typeof event == "string") {
      var type = event;
      event = DocumentEvent.createEvent(target, "Events");
      Event.initEvent(event, type, false, false);
    }
    this.base(target, event);
  },
  
  "@!(element.addEventListener)": {
    $all : {},
  
    $handleEvent: function(target, event) {
      var returnValue = true;
      // get a reference to the hash table of event listeners
      var events = EventTarget.$all[target.base2ID];
      if (events) {
        event = Event.bind(event); // fix the event object
        var listeners = events[event.type];
        // execute each event listener
        for (var i in listeners) {
          var listener = listeners[i];
          // support the EventListener interface
          if (listener.handleEvent) {
            returnValue = listener.handleEvent(event);
          } else {
            returnValue = listener.call(target, event);
          }
          if (event.returnValue === false) returnValue = false;
          if (returnValue === false) break;
        }
      }
      return returnValue;
    },
    
    "@MSIE": {  
      $handleEvent: function(target, event) {
        if (target.Infinity) {
          target = target.document.parentWindow;
          if (!event) event = target.event;
        }
        return this.base(target, event || Traversal.getDefaultView(target).event);
      }
    }
  }
});

// =========================================================================
// DOM/events/DocumentEvent.js
// =========================================================================

// http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-DocumentEvent

var DocumentEvent = Interface.extend({  
  "@!(document.createEvent)": {
    createEvent: function(document, type) {
      return Event.bind({});
    },
  
    "@(document.createEventObject)": {
      createEvent: function(document, type) {
        return Event.bind(document.createEventObject());
      }
    }
  },
  
  "@(document.createEvent)": {
    "@!(document.createEvent('Events'))": { // before Safari 3
      createEvent: function(document, type) {
        // a type of "Events" throws an error on Safari
        return this.base(document, type == "Events" ? "UIEvents" : type);
      }
    }
  }
});

// =========================================================================
// DOM/events/DOMContentLoaded.js
// =========================================================================

// http://dean.edwards.name/weblog/2006/06/again

var DOMContentLoaded = Module.extend(null, {
  fired: false,
  
  fire: function() {
    if (!DOMContentLoaded.fired) {
      DOMContentLoaded.fired = true;
      // this function will be called from another event handler so we'll user a timer
      //  to drop out of any current event
      // use a string for old browsers
      setTimeout("base2.DOM.EventTarget.dispatchEvent(document,'DOMContentLoaded')", 0);
    }
  },
  
  init: function() {
    // use the real event for browsers that support it (opera & firefox)
    EventTarget.addEventListener(document, "DOMContentLoaded", function() {
      DOMContentLoaded.fired = true;
    }, false);
    // if all else fails fall back on window.onload
    EventTarget.addEventListener(window, "load", this.fire, false);
  },

  "@(addEventListener)": {
    init: function() {
      this.base();
      addEventListener("load", this.fire, false);
    }
  },

  "@(attachEvent)": {
    init: function() {
      this.base();
      attachEvent("onload", this.fire);
    }
  },

  "@MSIE.+win": {
    init: function() {
      this.base();
      // Matthias Miller/Mark Wubben/Paul Sowden/Me
      document.write("<script id=__ready defer src=//:><\/script>");
      document.all.__ready.onreadystatechange = function() {
        if (this.readyState == "complete") {
          this.removeNode(); // tidy
          DOMContentLoaded.fire();
        }
      };
    }
  },
  
  "@KHTML": {
    init: function() {
      this.base();
      // John Resig
      var timer = setInterval(function() {
        if (/loaded|complete/.test(document.readyState)) {
          clearInterval(timer);
          DOMContentLoaded.fire();
        }
      }, 100);
    }
  }
});

// =========================================================================
// DOM/style/ViewCSS.js
// =========================================================================

// http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-ViewCSS

var ViewCSS = Interface.extend({
  "@!(document.defaultView.getComputedStyle)": {
    "@MSIE": {
      getComputedStyle: function(view, element, pseudoElement) {
        var METRICS = /(width|height|top|bottom|left|right|fontSize)$/;
        var COLOR = /^(color|backgroundColor)$/;
        // pseudoElement parameter is not supported
        var computedStyle = {};
        var currentStyle = element.currentStyle;
        for (var i in currentStyle) {
          if (METRICS.test(i)) {
            computedStyle[i] = this.$getPixelValue(element, computedStyle[i]) + "px";
          } else if (COLOR.test(i)) {
            computedStyle[i] = this.$getColorValue(element, i == "color" ? "ForeColor" : "BackColor");
          } else {
            computedStyle[i] = currentStyle[i];
          }
        }
        return computedStyle;
      }
    }
  }
}, {
  toCamelCase: function(string) {
    return String(string).replace(/\-([a-z])/g, function(match, chr) {
      return chr.toUpperCase();
    });
  },
  
  "@MSIE": {
    $getPixelValue: function(element, value) {
      var PIXEL = /^\d+(px)?$/i;
      if (PIXEL.test(value)) return parseInt(value);
      var styleLeft = element.style.left;
      var runtimeStyleLeft = element.runtimeStyle.left;
      element.runtimeStyle.left = element.currentStyle.left;
      element.style.left = value || 0;
      value = element.style.pixelLeft;
      element.style.left = styleLeft;
      element.runtimeStyle.left = runtimeStyleLeft;
      return value;
    },
    
    $getColorValue: function(element, value) {
      var range = element.document.body.createTextRange();
      range.moveToElementText(element);
      var color = range.queryCommandValue(value);
      return format("rgb(%1,%2,%3)", color & 0xff, (color & 0xff00) >> 8,  (color & 0xff0000) >> 16);
    }
  }
});

// =========================================================================
// DOM/selectors-api/NodeSelector.js
// =========================================================================

// http://www.w3.org/TR/selectors-api/
// http://www.whatwg.org/specs/web-apps/current-work/#getelementsbyclassname

var NodeSelector = Interface.extend({  
  "@!(element.getElementsByClassName)": { // firefox3?
    getElementsByClassName: function(node, className) {
      if (instanceOf(className, Array)) {
        className = className.join(".");
      }
      return this.matchAll(node, "." + className);
    }
  },
  
  "@!(element.matchSingle)": { // future-proof
    matchAll: function(node, selector) {
      return new Selector(selector).exec(node);
    },
    
    matchSingle: function(node, selector) {
      return new Selector(selector).exec(node, 1);
    }
  }
});

// automatically bind objects retrieved using the Selectors API

extend(NodeSelector.prototype, {
  matchAll: function(selector) {
    return extend(this.base(selector), "item", function(index) {
      return DOM.bind(this.base(index));
    });
  },
  
  matchSingle: function(selector) {
    return DOM.bind(this.base(selector));
  }
});

// =========================================================================
// DOM/selectors-api/DocumentSelector.js
// =========================================================================

// http://www.w3.org/TR/selectors-api/#documentselector

var DocumentSelector = NodeSelector.extend();

// =========================================================================
// DOM/selectors-api/ElementSelector.js
// =========================================================================

// more Selectors API sensibleness

var ElementSelector = NodeSelector.extend({
  "@!(element.matchesSelector)": { // future-proof
    matchesSelector: function(element, selector) {
      return new Selector(selector).test(element);
    }
  }
});


// =========================================================================
// DOM/selectors-api/StaticNodeList.js
// =========================================================================

// http://www.w3.org/TR/selectors-api/#staticnodelist

// A wrapper for an array of elements or an XPathResult.
// The item() method provides access to elements.
// Implements Enumerable so you can forEach() to your heart's content... :-)

var StaticNodeList = Base.extend({
  constructor: function(nodes) {
    nodes = nodes || [];
    this.length = nodes.length;
    this.item = function(index) {
      return nodes[index];
    };
  },
  
  length: 0,
  
  forEach: function(block, context) {
    var length = this.length; // preserve
    for (var i = 0; i < length; i++) {
      block.call(context, this.item(i), i, this);
    }
  },
  
  item: Undefined, // defined in the constructor function
  
  "@(XPathResult)": {
    constructor: function(nodes) {
  //- if (nodes instanceof XPathResult) { // doesn't work in Safari
      if (nodes && nodes.snapshotItem) {
        this.length = nodes.snapshotLength;
        this.item = function(index) {
          return nodes.snapshotItem(index);
        };
      } else this.base(nodes);
    }
  }
});

StaticNodeList.implement(Enumerable);

// =========================================================================
// DOM/selectors-api/Selector.js
// =========================================================================

// This object can be instantiated, however it is probably better to use
// the matchAll/matchSingle methods on DOM nodes.

// There is no public standard for this object. It just separates the NodeSelector
//  interface from the complexity of the Selector parsers.

var Selector = Base.extend({
  constructor: function(selector) {
    this.toString = returns(trim(selector));
  },
  
  exec: function(context, single) {
    try {
      var result = this.$evaluate(context || document, single);
    } catch (error) { // probably an invalid selector =)
      throw new SyntaxError(format("'%1' is not a valid CSS selector.", this));
    }
    return single ? result : new StaticNodeList(result);
  },
  
  test: function(element) {
    //-dean: improve this for simple selectors
    element.setAttribute("b2_test", true);
    var selector = new Selector(this + "[b2_test]");
    var result = selector.exec(Traversal.getOwnerDocument(element), true);
    element.removeAttribute("b2_test");
    return result == element;
  },
  
  $evaluate: function(context, single) {
    return Selector.parse(this)(context, single);
  }
});

// =========================================================================
// DOM/selectors-api/Parser.js
// =========================================================================
  
var Parser = RegGrp.extend({
  constructor: function(items) {
    this.base(items);
    this.cache = {};
    this.sorter = new RegGrp;
    this.sorter.add(/:not\([^)]*\)/, RegGrp.IGNORE);
    this.sorter.add(/([ >](\*|[\w-]+))([^: >+~]*)(:\w+-child(\([^)]+\))?)([^: >+~]*)/, "$1$3$6$4");
  },
  
  cache: null,
  ignoreCase: true,
  
  escape: function(selector) {
    // remove strings
    var QUOTE = /'/g;
    var strings = this._strings = [];
    return this.optimise(this.format(String(selector).replace(Parser.ESCAPE, function(string) {
      strings.push(string.slice(1, -1).replace(QUOTE, "\\'"));
      return "\x01" + strings.length;
    })));
  },
  
  format: function(selector) {
    return selector
      .replace(Parser.WHITESPACE, "$1")
      .replace(Parser.IMPLIED_SPACE, "$1 $2")
      .replace(Parser.IMPLIED_ASTERISK, "$1*$2");
  },
  
  optimise: function(selector) {
    // optimise wild card descendant selectors
    return this.sorter.exec(selector.replace(Parser.WILD_CARD, ">* "));
  },
  
  parse: function(selector) {
    return this.cache[selector] ||
      (this.cache[selector] = this.unescape(this.exec(this.escape(selector))));
  },
  
  unescape: function(selector) {
    // put string values back
    var strings = this._strings;
    return selector.replace(/\x01(\d+)/g, function(match, index) {
      return strings[index - 1];
    });
  }
}, {
  ESCAPE:           /(["'])[^\1]*\1/g,
  IMPLIED_ASTERISK: /([\s>+~,]|[^(]\+|^)([#.:@])/g,
  IMPLIED_SPACE:    /(^|,)([^\s>+~])/g,
  WHITESPACE:       /\s*([\s>+~(),]|^|$)\s*/g,
  WILD_CARD:        /\s\*\s/g,
  
  _nthChild: function(match, args, position, last, not, and, mod, equals) {
    // ugly but it works for both CSS and XPath
    last = /last/i.test(match) ? last + "+1-" : "";
    if (!isNaN(args)) args = "0n+" + args;
    else if (args == "even") args = "2n";
    else if (args == "odd") args = "2n+1";
    args = args.split(/n\+?/);
    var a = args[0] ? (args[0] == "-") ? -1 : parseInt(args[0]) : 1;
    var b = parseInt(args[1]) || 0;
    var not = a < 0;
    if (not) {
      a = -a;
      if (a == 1) b++;
    }
    var query = format(a == 0 ? "%3%7" + (last + b) : "(%4%3-%2)%6%1%70%5%4%3>=%2", a, b, position, last, and, mod, equals);
    if (not) query = not + "(" + query + ")";
    return query;
  }
});

// =========================================================================
// DOM/selectors-api/Selector/operators.js
// =========================================================================

Selector.operators = {
  "=":  "%1=='%2'",
  "!=": "%1!='%2'", //  not standard but other libraries support it
  "~=": /(^| )%1( |$)/,
  "|=": /^%1(-|$)/,
  "^=": /^%1/,
  "$=": /%1$/,
  "*=": /%1/
};

Selector.operators[""] = "%1!=null";

// =========================================================================
// DOM/selectors-api/Selector/pseudoClasses.js
// =========================================================================

Selector.pseudoClasses = { //-dean: lang()
  "checked":     "e%1.checked",
  "contains":    "e%1[Traversal.$TEXT].indexOf('%2')!=-1",
  "disabled":    "e%1.disabled",
  "empty":       "Traversal.isEmpty(e%1)",
  "enabled":     "e%1.disabled===false",
  "first-child": "!Traversal.getPreviousElementSibling(e%1)",
  "last-child":  "!Traversal.getNextElementSibling(e%1)",
  "only-child":  "!Traversal.getPreviousElementSibling(e%1)&&!Traversal.getNextElementSibling(e%1)",
  "root":        "e%1==Traversal.getDocument(e%1).documentElement"
/*  "lang": function(element, lang) {
    while (element && !element.getAttribute("lang")) {
      element = element.parentNode;
    }
    return element && lang.indexOf(element.getAttribute("lang")) == 0;
  }, */
};

// =========================================================================
// DOM/selectors-api/Selector/parse.js
// =========================================================================

// CSS parser - converts CSS selectors to DOM queries.

// Hideous code but it produces fast DOM queries.
// Respect due to Alex Russell and Jack Slocum for inspiration.

// TO DO:
// * sort nodes into document order (comma separated queries only)

new function(_) {
  // some constants
  var _MSIE = detect("MSIE");
  var _MSIE5 = detect("MSIE5");
  var _INDEXED = detect("(element.sourceIndex)") ;
  var _VAR = "var p%2=0,i%2,e%2,n%2=e%1.";
  var _ID = _INDEXED ? "e%1.sourceIndex" : "assignID(e%1)";
  var _TEST = "var g=" + _ID + ";if(!p[g]){p[g]=1;";
  var _STORE = "r[r.length]=e%1;if(s)return e%1;";
  var _FN = "fn=function(e0,s){indexed++;var r=[],p={},reg=[%1]," +
    "d=Traversal.getDocument(e0),c=d.body?'toUpperCase':'toString';";
  
  // IE confuses the name attribute with id for form elements,
  // use document.all to retrieve all elements with name/id instead
  var byId = _MSIE ? function(document, id) {
    var result = document.all[id] || null;
    // returns a single element or a collection
    if (!result || result.id == id) return result;
    // document.all has returned a collection of elements with name/id
    for (var i = 0; i < result.length; i++) {
      if (result[i].id == id) return result[i];
    }
    return null;
  } : function(document, id) {
    return document.getElementById(id);
  };
  
  // register a node and _index its children
  var indexed = 1;
  function register(element) {
    if (element.b2_indexed != indexed) {
      var _index = 0;
      var child = element.firstChild;
      while (child) {
        if (child.nodeType == 1 && child.tagName != "!") {
          child.b2_index = ++_index;
        }
        child = child.nextSibling;
      }
      element.b2_length = _index;
      element.b2_indexed = indexed;
    }
    return element;
  };
  
  // variables used by the parser
  var fn;
  var reg; // a store for RexExp objects
  var _index;
  var _wild; // need to flag certain _wild card selectors as _MSIE includes comment nodes
  var _list; // are we processing a node _list?
  var _duplicate; // possible duplicates?
  var _cache = {}; // store parsed selectors
  
  // a hideous parser
  var parser = new Parser({
    "^ \\*:root": function(match) { // :root pseudo class
      _wild = false;
      var replacement = "e%2=d.documentElement;if(Traversal.contains(e%1,e%2)){";
      return format(replacement, _index++, _index);
    },
    " (\\*|[\\w-]+)#([\\w-]+)": function(match, tagName, id) { // descendant selector followed by _ID
      _wild = false;
      var replacement = "var e%2=byId(d,'%4');if(e%2&&";
      if (tagName != "*") replacement += "e%2.nodeName=='%3'[c]()&&";
      replacement += "Traversal.contains(e%1,e%2)){";
      if (_list) replacement += format("i%1=n%1.length;", _list);
      return format(replacement, _index++, _index, tagName, id);
    },
    " (\\*|[\\w-]+)": function(match, tagName) { // descendant selector
      _duplicate++; // this selector may produce duplicates
      _wild = tagName == "*";
      var replacement = _VAR;
      // IE5.x does not support getElementsByTagName("*");
      replacement += (_wild && _MSIE5) ? "all" : "getElementsByTagName('%3')";
      replacement += ";for(i%2=0;(e%2=n%2[i%2]);i%2++){";
      return format(replacement, _index++, _list = _index, tagName);
    },
    ">(\\*|[\\w-]+)": function(match, tagName) { // child selector
      var children = _MSIE && _list;
      _wild = tagName == "*";
      var replacement = _VAR;
      // use the children property for _MSIE as it does not contain text nodes
      //  (but the children collection still includes comments).
      // the document object does not have a children collection
      replacement += children ? "children": "childNodes";
      if (!_wild && children) replacement += ".tags('%3')";
      replacement += ";for(i%2=0;(e%2=n%2[i%2]);i%2++){";
      if (_wild) {
        replacement += "if(e%2.nodeType==1){";
        _wild = _MSIE5;
      } else {
        if (!children) replacement += "if(e%2.nodeName=='%3'[c]()){";
      }
      return format(replacement, _index++, _list = _index, tagName);
    },
    "\\+(\\*|[\\w-]+)": function(match, tagName) { // direct adjacent selector
      var replacement = "";
      if (_wild && _MSIE) replacement += "if(e%1.tagName!='!'){";
      _wild = false;
      replacement += "e%1=Traversal.getNextElementSibling(e%1);if(e%1";
      if (tagName != "*") replacement += "&&e%1.nodeName=='%2'[c]()";
      replacement += "){";
      return format(replacement, _index, tagName);
    },
    "~(\\*|[\\w-]+)": function(match, tagName) { // indirect adjacent selector
      var replacement = "";
      if (_wild && _MSIE) replacement += "if(e%1.tagName!='!'){";
      _wild = false;
      _duplicate = 2; // this selector may produce duplicates
      replacement += "while(e%1=e%1.nextSibling){if(e%1.b2_adjacent==indexed)break;e%1.b2_adjacent=indexed;if(";
      if (tagName == "*") {
        replacement += "e%1.nodeType==1";
        if (_MSIE5) replacement += "&&e%1.tagName!='!'";
      } else replacement += "e%1.nodeName=='%2'[c]()";
      replacement += "){";
      return format(replacement, _index, tagName);
    },
    "#([\\w-]+)": function(match, id) { // _ID selector
      _wild = false;
      var replacement = "if(e%1.id=='%2'){";
      if (_list) replacement += format("i%1=n%1.length;", _list);
      return format(replacement, _index, id);
    },
    "\\.([\\w-]+)": function(match, className) { // class selector
      _wild = false;
      // store RegExp objects - slightly faster on IE
      reg.push(new RegExp("(^|\\s)" + rescape(className) + "(\\s|$)"));
      return format("if(reg[%2].test(e%1.className)){", _index, reg.length - 1);
    },
    ":not\\((\\*|[\\w-]+)?([^)]*)\\)": function(match, tagName, filters) { // :not pseudo class
      var replacement = (tagName && tagName != "*") ? format("if(e%1.nodeName=='%2'[c]()){", _index, tagName) : "";
      replacement += parser.exec(filters);
      return "if(!" + replacement.slice(2, -1).replace(/\)\{if\(/g, "&&") + "){";
    },
    ":nth(-last)?-child\\(([^)]+)\\)": function(match, last, args) { // :nth-child pseudo classes
      _wild = false;
      last = format("e%1.parentNode.b2_length", _index);
      var replacement = "if(p%1!==e%1.parentNode)";
      replacement += "p%1=register(e%1.parentNode);var i=e%1.b2_index;if(";
      return format(replacement, _index) + Parser._nthChild(match, args, "i", last, "!", "&&", "%", "==") + "){";
    },
    ":([\\w-]+)(\\(([^)]+)\\))?": function(match, pseudoClass, $2, args) { // other pseudo class selectors
      return "if(" + format(Selector.pseudoClasses[pseudoClass], _index, args || "") + "){";
    },
    "\\[([\\w-]+)\\s*([^=]?=)?\\s*([^\\]]*)\\]": function(match, attr, operator, value) { // attribute selectors
      var alias = Element.$attributes[attr] || attr;
      if (attr == "class") alias = "className";
      else if (attr == "for") alias = "htmlFor";
      if (operator) {
        attr = format("(e%1.%3||e%1.getAttribute('%2'))", _index, attr, alias);
      } else {
        attr = format("Element.getAttribute(e%1,'%2')", _index, attr);
      }
      var replacement = Selector.operators[operator || ""];
      if (instanceOf(replacement, RegExp)) {
        reg.push(new RegExp(format(replacement.source, rescape(parser.unescape(value)))));
        replacement = "reg[%2].test(%1)";
        value = reg.length - 1;
      }
      return "if(" + format(replacement, attr, value) + "){";
    }
  });
  
  // return the parse() function
  Selector.parse = function(selector) {
    if (!_cache[selector]) {
      reg = []; // store for RegExp objects
      fn = "";
      var selectors = parser.escape(selector).split(",");
      for (var i = 0; i < selectors.length; i++) {
        _wild = _index = _list = 0; // reset
        _duplicate = selectors.length > 1 ? 2 : 0; // reset
        var block = parser.exec(selectors[i]) || "throw;";
        if (_wild && _MSIE) { // IE's pesky comment nodes
          block += format("if(e%1.tagName!='!'){", _index);
        }
        // check for duplicates before storing results
        var store = (_duplicate > 1) ? _TEST : "";
        block += format(store + _STORE, _index);
        // add closing braces
        block += Array(match(block, /\{/g).length + 1).join("}");
        fn += block;
      }
      eval(format(_FN, reg) + parser.unescape(fn) + "return s?null:r}");
      _cache[selector] = fn;
    }
    return _cache[selector];
  };
};

// =========================================================================
// DOM/selectors-api/xpath/XPathParser.js
// =========================================================================

// XPath parser
// converts CSS expressions to *optimised* XPath queries

// This code used to be quite readable until I added code to optimise *-child selectors. 

var XPathParser = Parser.extend({
  constructor: function() {
    this.base(XPathParser.rules);
    // The sorter sorts child selectors to the end because they are slow.
    // For XPath we need the child selectors to be sorted to the beginning,
    // so we reverse the sort order. That's what this line does:
    this.sorter.storeAt(1, "$1$4$3$6");
  },
  
  escape: function(selector) {
    return this.base(selector).replace(/,/g, "\x02");
  },
  
  unescape: function(selector) {
    return this.base(selector
      .replace(/\[self::\*\]/g, "")   // remove redundant wild cards
      .replace(/(^|\x02)\//g, "$1./") // context
      .replace(/\x02/g, " | ")        // put commas back
    );
  },
  
  "@opera": {
    unescape: function(selector) {
      // opera does not seem to support last() but I can't find any 
      //  documentation to confirm this
      return this.base(selector.replace(/last\(\)/g, "count(preceding-sibling::*)+count(following-sibling::*)+1"));
    }
  }
}, {
  init: function() {
    // build the prototype
    this.values.attributes[""] = "[@$1]";
    forEach (this.types, function(add, type) {
      forEach (this.values[type], add, this.rules);
    }, this);
  },
  
  optimised: {    
    pseudoClasses: {
      "first-child": "[1]",
      "last-child":  "[last()]",
      "only-child":  "[last()=1]"
    }
  },
  
  rules: extend({}, {
    "@!KHTML": { // these optimisations do not work on Safari
      // fast id() search
      "(^|\\x02) (\\*|[\\w-]+)#([\\w-]+)": "$1id('$3')[self::$2]",
      // optimise positional searches
      "([ >])(\\*|[\\w-]+):([\\w-]+-child(\\(([^)]+)\\))?)": function(match, token, tagName, pseudoClass, $4, args) {
        var replacement = (token == " ") ? "//*" : "/*";
        if (/^nth/i.test(pseudoClass)) {
          replacement += _nthChild(pseudoClass, args, "position()");
        } else {
          replacement += XPathParser.optimised.pseudoClasses[pseudoClass];
        }
        return replacement + "[self::" + tagName + "]";
      }
    }
  }),
  
  types: {
    identifiers: function(replacement, token) {
      this[rescape(token) + "([\\w-]+)"] = replacement;
    },
    
    combinators: function(replacement, combinator) {
      this[rescape(combinator) + "(\\*|[\\w-]+)"] = replacement;
    },
    
    attributes: function(replacement, operator) {
      this["\\[([\\w-]+)\\s*" + rescape(operator) +  "\\s*([^\\]]*)\\]"] = replacement;
    },
    
    pseudoClasses: function(replacement, pseudoClass) {
      this[":" + pseudoClass.replace(/\(\)$/, "\\(([^)]+)\\)")] = replacement;
    }
  },
  
  values: {
    identifiers: {
      "#": "[@id='$1'][1]", // ID selector
      ".": "[contains(concat(' ',@class,' '),' $1 ')]" // class selector
    },
    
    combinators: {
      " ": "/descendant::$1", // descendant selector
      ">": "/child::$1", // child selector
      "+": "/following-sibling::*[1][self::$1]", // direct adjacent selector
      "~": "/following-sibling::$1" // indirect adjacent selector
    },
    
    attributes: { // attribute selectors
      "*=": "[contains(@$1,'$2')]",
      "^=": "[starts-with(@$1,'$2')]",
      "$=": "[substring(@$1,string-length(@$1)-string-length('$2')+1)='$2']",
      "~=": "[contains(concat(' ',@$1,' '),' $2 ')]",
      "|=": "[contains(concat('-',@$1,'-'),'-$2-')]",
      "!=": "[not(@$1='$2')]",
      "=":  "[@$1='$2']"
    },
    
    pseudoClasses: { // pseudo class selectors
      "empty":            "[not(child::*) and not(text())]",
//-   "lang()":           "[boolean(lang('$1') or boolean(ancestor-or-self::*[@lang][1][starts-with(@lang,'$1')]))]",
      "first-child":      "[not(preceding-sibling::*)]",
      "last-child":       "[not(following-sibling::*)]",
      "not()":            _not,
      "nth-child()":      _nthChild,
      "nth-last-child()": _nthChild,
      "only-child":       "[not(preceding-sibling::*) and not(following-sibling::*)]",
      "root":             "[not(parent::*)]"
    }
  },
  
  "@opera": {  
    init: function() {
      this.optimised.pseudoClasses["last-child"] = this.values.pseudoClasses["last-child"];
      this.optimised.pseudoClasses["only-child"] = this.values.pseudoClasses["only-child"];
      this.base();
    }
  }
});

// these functions defined here to make the code more readable
var _notParser = new XPathParser;
function _not(match, args) {
  return "[not(" + _notParser.exec(trim(args))
    .replace(/\[1\]/g, "") // remove the "[1]" introduced by ID selectors
    .replace(/^(\*|[\w-]+)/, "[self::$1]") // tagName test
    .replace(/\]\[/g, " and ") // merge predicates
    .slice(1, -1)
  + ")]";
};

function _nthChild(match, args, position) {
  return "[" + Parser._nthChild(match, args, position || "count(preceding-sibling::*)+1", "last()", "not", " and ", " mod ", "=") + "]";
};

// =========================================================================
// DOM/selectors-api/xpath/Selector.js
// =========================================================================

// If the browser supports XPath then the CSS selector is converted to an XPath query instead.

Selector.implement({
  toXPath: function() {
    return Selector.toXPath(this);
  },
  
  "@(XPathResult)": {
    $evaluate: function(context, single) {
      // use DOM methods if the XPath engine can't be used
      if (Selector.$NOT_XPATH.test(this)) {
        return this.base(context, single);
      }
      var document = Traversal.getDocument(context);
      var type = single
        ? 9 /* FIRST_ORDERED_NODE_TYPE */
        : 7 /* ORDERED_NODE_SNAPSHOT_TYPE */;
      var result = document.evaluate(this.toXPath(), context, null, type, null);
      return single ? result.singleNodeValue : result;
    }
  },
  
  "@MSIE": {
    $evaluate: function(context, single) {
      if (typeof context.selectNodes != "undefined" && !Selector.$NOT_XPATH.test(this)) { // xml
        var method = single ? "selectSingleNode" : "selectNodes";
        return context[method](this.toXPath());
      }
      return this.base(context, single);
    }
  }
});

extend(Selector, {
  xpathParser: null,
  
  toXPath: function(selector) {
    if (!this.xpathParser) this.xpathParser = new XPathParser;
    return this.xpathParser.parse(selector);
  },
  
  $NOT_XPATH: /:(checked|disabled|enabled|contains)|^(#[\w-]+\s*)?\w+$/,
  
  "@KHTML": { // XPath is just too buggy on earlier versions of Safari  
    $NOT_XPATH: /:(checked|disabled|enabled|contains)|^(#[\w-]+\s*)?\w+$|nth\-|,/,
    
    "@!WebKit5": {
      $NOT_XPATH: /./
    }
  }
});

// =========================================================================
// DOM/core/Node.js
// =========================================================================

// http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-1950641247

var Node = Binding.extend({  
  "@!(element.compareDocumentPosition)" : {
    compareDocumentPosition: function(node, other) {
      // http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-compareDocumentPosition
      
      if (Traversal.contains(node, other)) {
        return 4|16; // following|contained_by
      } else if (Traversal.contains(other, node)) {
        return 2|8;  // preceding|contains
      }
      
      var nodeIndex = Node.$getSourceIndex(node);
      var otherIndex = Node.$getSourceIndex(other);
      
      if (nodeIndex < otherIndex) {
        return 4; // following
      } else if (nodeIndex > otherIndex) {
        return 2; // preceding
      }      
      return 0;
    }
  }
}, {
  $getSourceIndex: function(node) {
    // return a key suitable for comparing nodes
    var key = 0;
    while (node) {
      key = Traversal.getNodeIndex(node) + "." + key;
      node = node.parentNode;
    }
    return key;
  },
  
  "@(element.sourceIndex)": {  
   $getSourceIndex: function(node) {
      return node.sourceIndex;
    }
  }
});

// =========================================================================
// DOM/core/Document.js
// =========================================================================

var Document = Node.extend(null, {
  bind: function(document) {
    this.base(document);
    extend(document, "createElement", function(tagName) { //-dean- test this!
      return DOM.bind(this.base(tagName));
    });
    AbstractView.bind(document.defaultView);
    return document;
  },
  
  "@!(document.defaultView)": {
    bind: function(document) {
      document.defaultView = Traversal.getDefaultView(document);
      return this.base(document);
    }
  }
});

// provide these as pass-through methods
Document.createDelegate("createElement", 2);

// =========================================================================
// DOM/core/Element.js
// =========================================================================

// http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-745549614

// I'm going to fix getAttribute() for IE here instead of HTMLElement.

// getAttribute() will return null if the attribute is not specified. This is
//  contrary to the specification but has become the de facto standard.

var Element = Node.extend({
  "@MSIE[67]": {
    getAttribute: function(element, name, iFlags) {
      if (element.className === undefined || name == "href" || name == "src") {
        return this.base(element, name, 2);
      }
      var attribute = element.getAttributeNode(name);
      return attribute && attribute.specified ? attribute.nodeValue : null;
    }
  },
  
  "@MSIE5.+win": {
    getAttribute: function(element, name, iFlags) {
      if (element.className === undefined || name == "href" || name == "src") {
        return this.base(element, name, 2);
      }
      var attribute = element.attributes[this.$attributes[name.toLowerCase()] || name];
      return attribute ? attribute.specified ? attribute.nodeValue : null : this.base(element, name);
    }
  }
}, {
  $attributes: {},
  
  "@MSIE5.+win": {
    init: function() {
      // these are the attributes that IE is case-sensitive about
      // convert the list of strings to a hash, mapping the lowercase name to the camelCase name.
      var attributes = "colSpan,rowSpan,vAlign,dateTime,accessKey,tabIndex,encType,maxLength,readOnly,longDesc";
      // combine two arrays to make a hash
      var keys = attributes.toLowerCase().split(",");
      var values = attributes.split(",");
      this.$attributes = Array2.combine(keys, values);
    }
  }
});

Element.createDelegate("setAttribute", 3);

// remove the base2ID for clones
extend(Element.prototype, "cloneNode", function(deep) {
  var clone = this.base(deep || false);
  clone.base2ID = undefined;
  return clone;
});

// =========================================================================
// DOM/implementations.js
// =========================================================================

AbstractView.implement(ViewCSS);

Document.implement(DocumentSelector);
Document.implement(DocumentEvent);
Document.implement(EventTarget);

Element.implement(ElementSelector);
Element.implement(EventTarget);

// =========================================================================
// DOM/html/HTMLDocument.js
// =========================================================================

// http://www.whatwg.org/specs/web-apps/current-work/#htmldocument

var HTMLDocument = Document.extend(null, {
  // http://www.whatwg.org/specs/web-apps/current-work/#activeelement  
  "@(document.activeElement===undefined)": {
    bind: function(document) {
      this.base(document);
      document.activeElement = null;
      document.addEventListener("focus", function(event) { //-dean: is onfocus good enough?
        document.activeElement = event.target;
      }, false);
      return document;
    }
  }
});

// =========================================================================
// DOM/html/HTMLElement.js
// =========================================================================

// The className methods are not standard but are extremely handy. :-)

var HTMLElement = Element.extend({
  addClass: function(element, className) {
    if (!this.hasClass(element, className)) {
      element.className += (element.className ? " " : "") + className;
    }
  },
  
  hasClass: function(element, className) {
    var regexp = new RegExp("(^|\\s)" + className + "(\\s|$)");
    return regexp.test(element.className);
  },

  removeClass: function(element, className) {
    var regexp = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
    element.className = element.className.replace(regexp, "$2");
  },

  toggleClass: function(element, className) {
    if (this.hasClass(element, className)) {
      this.removeClass(element, className);
    } else {
      this.addClass(element, className);
    }
  }
}, {
  bindings: {},
  tags: "*",
  
  extend: function() {
    // Maintain HTML element bindings.
    // This allows us to map specific interfaces to elements by reference
    // to tag name.
    var binding = base(this, arguments);
    var tags = (binding.tags || "").toUpperCase().split(",");
    forEach (tags, function(tagName) {
      HTMLElement.bindings[tagName] = binding;
    });
    return binding;
  },
  
  "@!(element.ownerDocument)": {
    bind: function(element) {
      this.base(element);
      element.ownerDocument = Traversal.getOwnerDocument(element);
      return element;
    }
  }
});

// =========================================================================
// DOM/init.js
// =========================================================================

// all other libraries allow this handy shortcut so base2 will too :-)

DOM.$ = function(selector, context) {
  return new Selector(selector).exec(context, 1);
};

DOM.$$ = function(selector, context) {
  return new Selector(selector).exec(context);
};

eval(this.exports);

}; ////////////////////  END: CLOSURE  /////////////////////////////////////
