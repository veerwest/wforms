/* wForms 3.0
A javascript extension to web forms.

Copyright (c) 2005-2007 Cedric Savarese <cedric@veerwest.com> and contributors.
This software is licensed under the CC-GNU LGPL <http://creativecommons.org/licenses/LGPL/2.1/>
For more information, visit: http://www.formassembly.com/wForms

wForms version 3.0 by Demid Nikitin and Cedric Savarese.
wForms 3.0 requires base2 - copyright 2007, Dean Edwards. */

// timestamp: Sun, 06 Jan 2008 18:17:45
/*
  base2 - copyright 2007-2008, Dean Edwards
  http://code.google.com/p/base2/
  http://www.opensource.org/licenses/mit-license.php
  
  Contributors:
    Doeke Zanstra
*/

var base2 = {
  name:    "base2",
  version: "1.0 (beta 2)",
  exports:
    "Base,Package,Abstract,Module,Enumerable,Map,Collection,RegGrp,"+
    "assert,assertArity,assertType,assignID,copy,detect,extend,"+
    "forEach,format,global,instanceOf,match,rescape,slice,trim,typeOf,"+
    "I,K,Undefined,Null,True,False,bind,delegate,flip,not,unbind",
  
  global: this, // the window object in a browser environment
  
  // this is defined here because it must be defined in the global scope
  detect: new function(_) {  
    // Two types of detection:
    //  1. Object detection
    //    e.g. detect("(java)");
    //    e.g. detect("!(document.addEventListener)");
    //  2. Platform detection (browser sniffing)
    //    e.g. detect("MSIE");
    //    e.g. detect("MSIE|opera");
        
    var global = _;
    var jscript = NaN/*@cc_on||@_jscript_version@*/; // http://dean.edwards.name/weblog/2007/03/sniff/#comment85164
    var java = _.java ? true : false;
    if (_.navigator) {
      var MSIE = /MSIE[\d.]+/g;
      var element = document.createElement("span");
      // Close up the space between name and version number.
      //  e.g. MSIE 6 -> MSIE6
      var userAgent = navigator.userAgent.replace(/([a-z])[\s\/](\d)/gi, "$1$2");
      // Fix opera's (and others) user agent string.
      if (!jscript) userAgent = userAgent.replace(MSIE, "");
      if (MSIE.test(userAgent)) userAgent = userAgent.match(MSIE)[0] + " " + userAgent.replace(MSIE, "");
      userAgent = navigator.platform + " " + userAgent;
      java &= navigator.javaEnabled();
    }
    
    return function(expression) {
      var r = false;
      var not = expression.charAt(0) == "!";
      if (not) expression = expression.slice(1);
      if (expression.charAt(0) == "(") {
        // Object detection.
        try {
          eval("r=!!" + expression);
        } catch (e) {
          // the test failed
        }
      } else {
        // Browser sniffing.
        r = new RegExp("(" + expression + ")", "i").test(userAgent);
      }
      return !!(not ^ r);
    };
  }(this)
};

new function(_) { ////////////////////  BEGIN: CLOSURE  ////////////////////

// =========================================================================
// base2/lang/header.js
// =========================================================================

var _namespace = "function base(o,a){return o.base.apply(o,a)};";
eval(_namespace);

var detect = base2.detect;

var Undefined = K(), Null = K(null), True = K(true), False = K(false);

// private
var _FORMAT = /%([1-9])/g;
var _LTRIM = /^\s\s*/;
var _RTRIM = /\s\s*$/;
var _RESCAPE = /([\/()[\]{}|*+-.,^$?\\])/g;             // safe regular expressions
var _BASE = /eval/.test(detect) ? /\bbase\s*\(/ : /.*/; // some platforms don't allow decompilation
var _HIDDEN = ["constructor", "toString", "valueOf"];   // only override these when prototyping
var _MSIE_NATIVE_FUNCTION = detect("(jscript)") ?
  new RegExp("^" + rescape(isNaN).replace(/isNaN/, "\\w+") + "$") : {test: False};

var _counter = 1;
var _slice = Array.prototype.slice;

var slice = Array.slice || function(array) {
  return _slice.apply(array, _slice.call(arguments, 1));
};

_Function_forEach(); // make sure this is initialised

// =========================================================================
// base2/Base.js
// =========================================================================

// http://dean.edwards.name/weblog/2006/03/base/

var _subclass = function(_instance, _static) {
  // Build the prototype.
  base2.__prototyping = this.prototype;
  var _prototype = new this;
  extend(_prototype, _instance);
  delete base2.__prototyping;
  
  // Create the wrapper for the constructor function.
  var _constructor = _prototype.constructor;
  function _class() {
    // Don't call the constructor function when prototyping.
    if (!base2.__prototyping) {
      if (this.constructor == arguments.callee || this.__constructing) {
        // Instantiation.
        this.__constructing = true;
        _constructor.apply(this, arguments);
        delete this.__constructing;
      } else {
        // Casting.
        return extend(arguments[0], _prototype);
      }
    }
    return this;
  };
  _prototype.constructor = _class;
  
  // Build the static interface.
  for (var i in Base) _class[i] = this[i];
  _class.ancestor = this;
  _class.base = Undefined;
  _class.init = Undefined;
  extend(_class, _static);
  _class.prototype = _prototype;
  _class.init();
  
  // introspection (removed when packed)
  ;;; _class.toString = K(String(_constructor));
  ;;; _class["#implements"] = [];
  ;;; _class["#implemented_by"] = [];
  
  return _class;
};

var Base = _subclass.call(Object, {
  constructor: function() {
    if (arguments.length > 0) {
      this.extend(arguments[0]);
    }
  },
  
  base: function() {
    // Call this method from any other method to invoke the current method's ancestor (super).
  },
  
  extend: delegate(extend)  
}, Base = {
  ancestorOf: delegate(_ancestorOf),
  
  extend: _subclass,
    
  forEach: delegate(_Function_forEach),
  
  implement: function(source) {
    if (typeof source == "function") {
      // If we are implementing another classs/module then we can use
      // casting to apply the interface.
      if (_ancestorOf(Base, source)) {
        source(this.prototype); // cast
        // introspection (removed when packed)
        ;;; this["#implements"].push(source);
        ;;; source["#implemented_by"].push(this);
      }
    } else {
      // Add the interface using the extend() function.
      extend(this.prototype, source);
    }
    return this;
  }
});

// =========================================================================
// base2/Package.js
// =========================================================================

var Package = Base.extend({
  constructor: function(_private, _public) {
    this.extend(_public);
    if (this.init) this.init();
    
    if (this.name != "base2") {
      if (!this.parent) this.parent = base2;
      this.parent.addName(this.name, this);
      this.namespace = format("var %1=%2;", this.name, String(this).slice(1, -1));
    }
    
    var LIST = /[^\s,]+/g; // pattern for comma separated list
    
    if (_private) {
      // This string should be evaluated immediately after creating a Package object.
      _private.imports = Array2.reduce(this.imports.match(LIST), function(namespace, name) {
        eval("var ns=base2." + name);
        assert(ns, format("Package not found: '%1'.", name), ReferenceError);
        return namespace += ns.namespace;
      }, _namespace + base2.namespace + JavaScript.namespace);
      
      // This string should be evaluated after you have created all of the objects
      // that are being exported.
      _private.exports = Array2.reduce(this.exports.match(LIST), function(namespace, name) {
        var fullName = this.name + "." + name;
        this.namespace += "var " + name + "=" + fullName + ";";
        return namespace += "if(!" + fullName + ")" + fullName + "=" + name + ";";
      }, "", this);
    }
  },

  exports: "",
  imports: "",
  name: "",
  namespace: "",
  parent: null,

  addName: function(name, value) {
    if (!this[name]) {
      this[name] = value;
      this.exports += "," + name;
      this.namespace += format("var %1=%2.%1;", name, this.name);
    }
  },

  addPackage: function(name) {
    this.addName(name, new Package(null, {name: name, parent: this}));
  },
  
  toString: function() {
    return format("[%1]", this.parent ? String(this.parent).slice(1, -1) + "." + this.name : this.name);
  }
});

// =========================================================================
// base2/Abstract.js
// =========================================================================

var Abstract = Base.extend({
  constructor: function() {
    throw new TypeError("Class cannot be instantiated.");
  }
});

// =========================================================================
// base2/Module.js
// =========================================================================

var Module = Abstract.extend(null, {
  extend: function(_interface, _static) {
    // Extend a module to create a new module.
    var module = this.base();
    // Inherit class methods.
    module.implement(this);
    // Implement module (instance AND static) methods.
    module.implement(_interface);
    // Implement static properties and methods.
    extend(module, _static);
    module.init();
    return module;
  },
  
  implement: function(_interface) {
    var module = this;
    if (typeof _interface == "function") {
      if (!_ancestorOf(_interface, module)) {
        this.base(_interface);
      }
      if (_ancestorOf(Module, _interface)) {
        // Implement static methods.
        forEach (_interface, function(property, name) {
          if (!module[name]) {
            if (typeof property == "function" && property.call && _interface.prototype[name]) {
              property = function() { // Late binding.
                return _interface[name].apply(_interface, arguments);
              };
            }
            module[name] = property;
          }
        });
      }
    } else {
      // Add static interface.
      extend(module, _interface);
      // Add instance interface.
      _Function_forEach (Object, _interface, function(source, name) {
        if (name.charAt(0) == "@") { // object detection
          if (detect(name.slice(1))) {
            forEach (source, arguments.callee);
          }
        } else if (typeof source == "function" && source.call) {
          module.prototype[name] = function() { // Late binding.
            var args = _slice.call(arguments);
            args.unshift(this);
            return module[name].apply(module, args);
          };
          ;;; module.prototype[name]._module = module; // introspection
        }
      });
    }
    return module;
  }
});

// =========================================================================
// base2/Enumerable.js
// =========================================================================

var Enumerable = Module.extend({
  every: function(object, test, context) {
    var result = true;
    try {
      this.forEach (object, function(value, key) {
        result = test.call(context, value, key, object);
        if (!result) throw StopIteration;
      });
    } catch (error) {
      if (error != StopIteration) throw error;
    }
    return !!result; // cast to boolean
  },
  
  filter: function(object, test, context) {
    var i = 0;
    return this.reduce(object, function(result, value, key) {
      if (test.call(context, value, key, object)) {
        result[i++] = value;
      }
      return result;
    }, []);
  },
  
  invoke: function(object, method) {
    // Apply a method to each item in the enumerated object.
    var args = _slice.call(arguments, 2);
    return this.map(object, (typeof method == "function") ? function(item) {
      return (item == null) ? undefined : method.apply(item, args);
    } : function(item) {
      return (item == null) ? undefined : item[method].apply(item, args);
    });
  },
  
  map: function(object, block, context) {
    var result = [], i = 0;
    this.forEach (object, function(value, key) {
      result[i++] = block.call(context, value, key, object);
    });
    return result;
  },
  
  pluck: function(object, key) {
    return this.map(object, function(item) {
      return (item == null) ? undefined : item[key];
    });
  },
  
  reduce: function(object, block, result, context) {
    var initialised = arguments.length > 2;
    this.forEach (object, function(value, key) {
      if (initialised) { 
        result = block.call(context, result, value, key, object);
      } else { 
        result = value;
        initialised = true;
      }
    });
    return result;
  },
  
  some: function(object, test, context) {
    return !this.every(object, not(test), context);
  }
}, {
  forEach: forEach
});


// =========================================================================
// base2/Map.js
// =========================================================================

// http://wiki.ecmascript.org/doku.php?id=proposals:dictionary

var _HASH = "#";

var Map = Base.extend({
  constructor: function(values) {
    this.merge(values);
  },

  copy: delegate(copy),

  forEach: function(block, context) {
    for (var key in this) if (key.charAt(0) == _HASH) {
      block.call(context, this[key], key.slice(1), this);
    }
  },

  get: function(key) {
    return this[_HASH + key];
  },

  getKeys: function() {
    return this.map(flip(I));
  },

  getValues: function() {
    return this.map(I);
  },

  // Ancient browsers throw an error when we use "in" as an operator.
  has: function(key) {
  /*@cc_on @*/
  /*@if (@_jscript_version < 5.5)
    return $Legacy.has(this, _HASH + key);
  @else @*/
    return _HASH + key in this;
  /*@end @*/
  },

  merge: function(values) {
    var put = flip(this.put);
    forEach (arguments, function(values) {
      forEach (values, put, this);
    }, this);
    return this;
  },

  remove: function(key) {
    delete this[_HASH + key];
  },

  put: function(key, value) {
    if (arguments.length == 1) value = key;
    // create the new entry (or overwrite the old entry).
    this[_HASH + key] = value;
  },

  size: function() {
    // this is expensive because we are not storing the keys
    var size = 0;
    for (var key in this) if (key.charAt(0) == _HASH) size++;
    return size;
  },

  union: function(values) {
    return this.merge.apply(this.copy(), arguments);
  }
});

Map.implement(Enumerable);

// =========================================================================
// base2/Collection.js
// =========================================================================

// A Map that is more array-like (accessible by index).

// Collection classes have a special (optional) property: Item
// The Item property points to a constructor function.
// Members of the collection must be an instance of Item.

// The static create() method is responsible for all construction of collection items.
// Instance methods that add new items (add, put, insertAt, putAt) pass *all* of their arguments
// to the static create() method. If you want to modify the way collection items are 
// created then you only need to override this method for custom collections.

var _KEYS = "~";

var Collection = Map.extend({
  constructor: function(values) {
    this[_KEYS] = new Array2;
    this.base(values);
  },
  
  add: function(key, item) {
    // Duplicates not allowed using add().
    // But you can still overwrite entries using put().
    assert(!this.has(key), "Duplicate key '" + key + "'.");
    this.put.apply(this, arguments);
  },

  copy: function() {
    var copy = this.base();
    copy[_KEYS] = this[_KEYS].copy();
    return copy;
  },

  forEach: function(block, context) { // optimised (refers to _HASH)
    var keys = this[_KEYS];
    var length = keys.length;
    for (var i = 0; i < length; i++) {
      block.call(context, this[_HASH + keys[i]], keys[i], this);
    }
  },

  getAt: function(index) {
    if (index < 0) index += this[_KEYS].length; // starting from the end
    var key = this[_KEYS][index];
    return (key === undefined)  ? undefined : this[_HASH + key];
  },

  getKeys: function() {
    return this[_KEYS].concat();
  },

  indexOf: function(key) {
    return this[_KEYS].indexOf(String(key));
  },

  insertAt: function(index, key, item) {
    assert(Math.abs(index) < this[_KEYS].length, "Index out of bounds.");
    assert(!this.has(key), "Duplicate key '" + key + "'.");
    this[_KEYS].insertAt(index, String(key));
    this[_HASH + key] == null; // placeholder
    this.put.apply(this, _slice.call(arguments, 1));
  },
  
  item: function(keyOrIndex) {
    return this[typeof keyOrIndex == "number" ? "getAt" : "get"](keyOrIndex);
  },

  put: function(key, item) {
    if (arguments.length == 1) item = key;
    if (!this.has(key)) {
      this[_KEYS].push(String(key));
    }
    var klass = this.constructor;
    if (klass.Item && !instanceOf(item, klass.Item)) {
      item = klass.create.apply(klass, arguments);
    }
    this[_HASH + key] = item;
  },

  putAt: function(index, item) {
    assert(Math.abs(index) < this[_KEYS].length, "Index out of bounds.");
    arguments[0] = this[_KEYS].item(index);
    this.put.apply(this, arguments);
  },

  remove: function(key) {
    // The remove() method of the Array object can be slow so check if the key exists first.
    if (this.has(key)) {
      this[_KEYS].remove(String(key));
      delete this[_HASH + key];
    }
  },

  removeAt: function(index) {
    var key = this[_KEYS].removeAt(index);
    delete this[_HASH + key];
  },

  reverse: function() {
    this[_KEYS].reverse();
    return this;
  },

  size: function() {
    return this[_KEYS].length;
  },

  sort: function(compare) { // optimised (refers to _HASH)
    if (compare) {
      var self = this;
      this[_KEYS].sort(function(key1, key2) {
        return compare(self[_HASH + key1], self[_HASH + key2], key1, key2);
      });
    } else this[_KEYS].sort();
    return this;
  },

  toString: function() {
    return String(this[_KEYS]);
  }
}, {
  Item: null, // If specified, all members of the collection must be instances of Item.
  
  create: function(key, item) {
    return this.Item ? new this.Item(key, item) : item;
  },
  
  extend: function(_instance, _static) {
    var klass = this.base(_instance);
    klass.create = this.create;
    extend(klass, _static);
    if (!klass.Item) {
      klass.Item = this.Item;
    } else if (typeof klass.Item != "function") {
      klass.Item = (this.Item || Base).extend(klass.Item);
    }
    klass.init();
    return klass;
  }
});

// =========================================================================
// base2/RegGrp.js
// =========================================================================

// A collection of regular expressions and their associated replacement values.
// A Base class for creating parsers.

var _RG_BACK_REF        = /\\(\d+)/g,
    _RG_ESCAPE_CHARS    = /\\./g,
    _RG_ESCAPE_BRACKETS = /\(\?[:=!]|\[[^\]]+\]/g,
    _RG_BRACKETS        = /\(/g,
    _RG_LOOKUP          = /\$(\d+)/,
    _RG_LOOKUP_SIMPLE   = /^\$\d+$/;

var RegGrp = Collection.extend({
  constructor: function(values, flags) {
    this.base(values);
    if (typeof flags == "string") {
      this.global = /g/.test(flags);
      this.ignoreCase = /i/.test(flags);
    }
  },

  global: true, // global is the default setting
  ignoreCase: false,

  exec: function(string, replacement) { // optimised (refers to _HASH/_KEYS)
    var flags = (this.global ? "g" : "") + (this.ignoreCase ? "i" : "");
    string = String(string) + ""; // type-safe
    if (arguments.length == 1) {
      var self = this;
      var keys = this[_KEYS];
      replacement = function(match) {
        if (match) {
          var item, offset = 1, i = 0;
          // Loop through the RegGrp items.
          while ((item = self[_HASH + keys[i++]])) {
            var next = offset + item.length + 1;
            if (arguments[offset]) { // do we have a result?
              var replacement = item.replacement;
              switch (typeof replacement) {
                case "function":
                  return replacement.apply(self, _slice.call(arguments, offset, next));
                case "number":
                  return arguments[offset + replacement];
                default:
                  return replacement;
              }
            }
            offset = next;
          }
        }
        return "";
      };
    }
    return string.replace(new RegExp(this, flags), replacement);
  },

  insertAt: function(index, expression, replacement) {
    if (instanceOf(expression, RegExp)) {
      arguments[1] = expression.source;
    }
    return base(this, arguments);
  },

  test: function(string) {
    return this.exec(string) != string;
  },
  
  toString: function() {
    var length = 0;
    return "(" + this.map(function(item) {
      // Fix back references.
      var ref = String(item).replace(_RG_BACK_REF, function(match, index) {
        return "\\" + (1 + Number(index) + length);
      });
      length += item.length + 1;
      return ref;
    }).join(")|(") + ")";
  }
}, {
  IGNORE: "$0",
  
  init: function() {
    forEach ("add,get,has,put,remove".split(","), function(name) {
      _override(this, name, function(expression) {
        if (instanceOf(expression, RegExp)) {
          arguments[0] = expression.source;
        }
        return base(this, arguments);
      });
    }, this.prototype);
  },
  
  Item: {
    constructor: function(expression, replacement) {
      if (typeof replacement == "number") replacement = String(replacement);
      else if (replacement == null) replacement = "";    
      
      // does the pattern use sub-expressions?
      if (typeof replacement == "string" && _RG_LOOKUP.test(replacement)) {
        // a simple lookup? (e.g. "$2")
        if (_RG_LOOKUP_SIMPLE.test(replacement)) {
          // store the index (used for fast retrieval of matched strings)
          replacement = parseInt(replacement.slice(1));
        } else { // a complicated lookup (e.g. "Hello $2 $1")
          // build a function to do the lookup
          var Q = /'/.test(replacement.replace(/\\./g, "")) ? '"' : "'";
          replacement = replacement.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\$(\d+)/g, Q +
            "+(arguments[$1]||" + Q+Q + ")+" + Q);
          replacement = new Function("return " + Q + replacement.replace(/(['"])\1\+(.*)\+\1\1$/, "$1") + Q);
        }
      }
      
      this.length = RegGrp.count(expression);
      this.replacement = replacement;
      this.toString = K(String(expression));
    },
    
    length: 0,
    replacement: ""
  },
  
  count: function(expression) {
    // Count the number of sub-expressions in a RegExp/RegGrp.Item.
    expression = String(expression).replace(_RG_ESCAPE_CHARS, "").replace(_RG_ESCAPE_BRACKETS, "");
    return match(expression, _RG_BRACKETS).length;
  }
});

// =========================================================================
// JavaScript/package.js
// =========================================================================

var JavaScript = {
  name:      "JavaScript",
  version:   base2.version,
  exports:   "Array2,Date2,String2",
  namespace: "", // fixed later
  
  bind: function(host) {
    forEach (this.exports.match(/\w+/g), function(name2) {
      var name = name2.slice(0, -1);
      extend(host[name], this[name2]);
      this[name2](host[name].prototype); // cast
    }, this);
    return this;
  }
};

// =========================================================================
// JavaScript/~/Date.js
// =========================================================================

// Fix Date.get/setYear() (IE5-7)

if ((new Date).getYear() > 1900) {
  Date.prototype.getYear = function() {
    return this.getFullYear() - 1900;
  };
  Date.prototype.setYear = function(year) {
    return this.setFullYear(year + 1900);
  };
}

// =========================================================================
// JavaScript/~/Function.js
// =========================================================================

// Some browsers don't define this.

Function.prototype.prototype = {};

// =========================================================================
// JavaScript/~/String.js
// =========================================================================

// A KHTML bug.

if ("".replace(/^/, K("$$")) == "$") {
  extend(String.prototype, "replace", function(expression, replacement) {
    if (typeof replacement == "function") {
      var fn = replacement;
      replacement = function() {
        return String(fn.apply(null, arguments)).split("$").join("$$");
      };
    }
    return this.base(expression, replacement);
  });
}

// =========================================================================
// JavaScript/Array2.js
// =========================================================================

var Array2 = _createObject2(
  Array,
  Array,
  "concat,join,pop,push,reverse,shift,slice,sort,splice,unshift", // generics
  [Enumerable, {
    combine: function(keys, values) {
      // Combine two arrays to make a hash.
      if (!values) values = keys;
      return this.reduce(keys, function(hash, key, index) {
        hash[key] = values[index];
        return hash;
      }, {});
    },

    contains: function(array, item) {
      return this.indexOf(array, item) != -1;
    },

    copy: function(array) {
      var copy = _slice.call(array);
      if (!copy.swap) this(copy); // cast to Array2
      return copy;
    },

    flatten: function(array) {
      var length = 0;
      return this.reduce(array, function(result, item) {
        if (this.like(item)) {
          this.reduce(item, arguments.callee, result, this);
        } else {
          result[length++] = item;
        }
        return result;
      }, [], this);
    },
    
    forEach: _Array_forEach,
    
    indexOf: function(array, item, fromIndex) {
      var length = array.length;
      if (fromIndex == null) {
        fromIndex = 0;
      } else if (fromIndex < 0) {
        fromIndex = Math.max(0, length + fromIndex);
      }
      for (var i = fromIndex; i < length; i++) {
        if (array[i] === item) return i;
      }
      return -1;
    },
    
    insertAt: function(array, index, item) {
      this.splice(array, index, 0, item);
      return item;
    },
    
    item: function(array, index) {
      if (index < 0) index += array.length; // starting from the end
      return array[index];
    },
    
    lastIndexOf: function(array, item, fromIndex) {
      var length = array.length;
      if (fromIndex == null) {
        fromIndex = length - 1;
      } else if (fromIndex < 0) {
        fromIndex = Math.max(0, length + fromIndex);
      }
      for (var i = fromIndex; i >= 0; i--) {
        if (array[i] === item) return i;
      }
      return -1;
    },
  
    map: function(array, block, context) {
      var result = [];
      this.forEach (array, function(item, index) {
        result[index] = block.call(context, item, index, array);
      });
      return result;
    },
    
    remove: function(array, item) {
      var index = this.indexOf(array, item);
      if (index != -1) this.removeAt(array, index);
      return item;
    },

    removeAt: function(array, index) {
      return this.splice(array, index, 1);
    },

    swap: function(array, index1, index2) {
      if (index1 < 0) index1 += array.length; // starting from the end
      if (index2 < 0) index2 += array.length;
      var temp = array[index1];
      array[index1] = array[index2];
      array[index2] = temp;
      return array;
    }
  }]
);

Array2.reduce = Enumerable.reduce; // Mozilla does not implement the thisObj argument

Array2.like = function(object) {
  // is the object like an array?
  return !!(object && typeof object == "object" && typeof object.length == "number");
};

// introspection (removed when packed)
;;; Enumerable["#implemented_by"].pop();
;;; Enumerable["#implemented_by"].push(Array2);

// =========================================================================
// JavaScript/Date2.js
// =========================================================================

// http://developer.mozilla.org/es4/proposals/date_and_time.html

// big, ugly, regular expression
var _DATE_PATTERN = /^((-\d+|\d{4,})(-(\d{2})(-(\d{2}))?)?)?T((\d{2})(:(\d{2})(:(\d{2})(\.(\d{1,3})(\d)?\d*)?)?)?)?(([+-])(\d{2})(:(\d{2}))?|Z)?$/;  
var _DATE_PARTS = { // indexes to the sub-expressions of the RegExp above
  FullYear: 2,
  Month: 4,
  Date: 6,
  Hours: 8,
  Minutes: 10,
  Seconds: 12,
  Milliseconds: 14
};
var _TIMEZONE_PARTS = { // idem, but without the getter/setter usage on Date object
  Hectomicroseconds: 15, // :-P
  UTC: 16,
  Sign: 17,
  Hours: 18,
  Minutes: 20
};

var _TRIM_ZEROES   = /(((00)?:0+)?:0+)?\.0+$/;
var _TRIM_TIMEZONE = /(T[0-9:.]+)$/;

var Date2 = _createObject2(
  Date, 
  function(yy, mm, dd, h, m, s, ms) {
    switch (arguments.length) {
      case 0: return new Date;
      case 1: return new Date(yy);
      default: return new Date(yy, mm, arguments.length == 2 ? 1 : dd, h || 0, m || 0, s || 0, ms || 0);
    }
  }, "", [{
    toISOString: function(date) {
      var string = "####-##-##T##:##:##.###";
      for (var part in _DATE_PARTS) {
        string = string.replace(/#+/, function(digits) {
          var value = date["getUTC" + part]();
          if (part == "Month") value++; // js month starts at zero
          return ("000" + value).slice(-digits.length); // pad
        });
      }
      // remove trailing zeroes, and remove UTC timezone, when time's absent
      return string.replace(_TRIM_ZEROES, "").replace(_TRIM_TIMEZONE, "$1Z");
    }
  }]
);

Date2.now = function() {
  return (new Date).valueOf(); // milliseconds since the epoch
};

Date2.parse = function(string, defaultDate) {
  if (arguments.length > 1) {
    assertType(defaultDate, "number", "defaultDate should be of type 'number'.")
  }
  // parse ISO date
  var match = String(string).match(_DATE_PATTERN);
  if (match) {
    if (match[_DATE_PARTS.Month]) match[_DATE_PARTS.Month]--; // js months start at zero
    // round milliseconds on 3 digits
    if (match[_TIMEZONE_PARTS.Hectomicroseconds] >= 5) match[_DATE_PARTS.Milliseconds]++;
    var date = new Date(defaultDate || 0);
    var prefix = match[_TIMEZONE_PARTS.UTC] || match[_TIMEZONE_PARTS.Hours] ? "UTC" : "";
    for (var part in _DATE_PARTS) {
      var value = match[_DATE_PARTS[part]];
      if (!value) continue; // empty value
      // set a date part
      date["set" + prefix + part](value);
      // make sure that this setting does not overflow
      if (date["get" + prefix + part]() != match[_DATE_PARTS[part]]) {
        return NaN;
      }
    }
    // timezone can be set, without time being available
    // without a timezone, local timezone is respected
    if (match[_TIMEZONE_PARTS.Hours]) {
      var Hours = Number(match[_TIMEZONE_PARTS.Sign] + match[_TIMEZONE_PARTS.Hours]);
      var Minutes = Number(match[_TIMEZONE_PARTS.Sign] + (match[_TIMEZONE_PARTS.Minutes] || 0));
      date.setUTCMinutes(date.getUTCMinutes() + (Hours * 60) + Minutes);
    } 
    return date.valueOf();
  } else {
    return Date.parse(string);
  }
};

// =========================================================================
// JavaScript/String2.js
// =========================================================================

var String2 = _createObject2(
  String, 
  function(string) {
    return new String(arguments.length == 0 ? "" : string);
  },
  "charAt,charCodeAt,concat,indexOf,lastIndexOf,match,replace,search,slice,split,substr,substring,toLowerCase,toUpperCase",
  [{trim: trim}]
);

// =========================================================================
// JavaScript/functions.js
// =========================================================================

function _createObject2(Native, constructor, generics, extensions) {
  // Clone native objects and extend them.

  // Create a Module that will contain all the new methods.
  var INative = Module.extend();
  // http://developer.mozilla.org/en/docs/New_in_JavaScript_1.6#Array_and_String_generics
  forEach (generics.match(/\w+/g), function(name) {
    INative[name] = unbind(Native.prototype[name]);
  });
  forEach (extensions, INative.implement, INative);

  // create a faux constructor that augments the native object
  var Native2 = function() {
    return INative(this.constructor == INative ? constructor.apply(null, arguments) : arguments[0]);
  };
  Native2.prototype = INative.prototype;

  // Remove methods that are already implemented.
  forEach (INative, function(method, name) {
    if (Native[name]) {
      INative[name] = Native[name];
      delete INative.prototype[name];
    }
    Native2[name] = INative[name];
  });
  Native2.ancestor = Object;
  delete Native2.extend;
  if (Native != Array) delete Native2.forEach; 

  return Native2;
};

// =========================================================================
// lang/extend.js
// =========================================================================

function extend(object, source) { // or extend(object, key, value)
  if (object && source) {
    if (arguments.length > 2) { // Extending with a key/value pair.
      var key = source;
      source = {};
      source[key] = arguments[2];
    }
    var proto = (typeof source == "function" ? Function : Object).prototype;
    // Add constructor, toString etc
    var i = _HIDDEN.length, key;
    if (base2.__prototyping) {
      while (key = _HIDDEN[--i]) {
        var value = source[key];
        if (value != proto[key]) {
          if (_BASE.test(value)) {
            _override(object, key, value)
          } else {
            object[key] = value;
          }
        }
      }
    }
    // Copy each of the source object's properties to the target object.
    for (key in source) {
      if (proto[key] === undefined) {
        var value = source[key];
        // Object detection.
        if (key.charAt(0) == "@") {
          if (detect(key.slice(1))) arguments.callee(object, value);
          continue;
        }
        // Check for method overriding.
        var ancestor = object[key];
        if (ancestor && typeof value == "function") {
          if (value != ancestor && (!ancestor.method || !_ancestorOf(value, ancestor))) {
            if (_BASE.test(value)) {
              _override(object, key, value);
            } else {
              value.ancestor = ancestor;
              object[key] = value;
            }
          }
        } else {
          object[key] = value;
        }
      }
    }
  }
  return object;
};

function _ancestorOf(ancestor, fn) {
  // Check if a function is in another function's inheritance chain.
  while (fn) {
    if (!fn.ancestor) return false;
    fn = fn.ancestor;
    if (fn == ancestor) return true;
  }
  return false;
};

function _override(object, name, method) {
  // Override an existing method.
  var ancestor = object[name];
  var superObject = base2.__prototyping; // late binding for classes
  if (superObject && ancestor != superObject[name]) superObject = null;
  function _base() {
    var previous = this.base;
    this.base = superObject ? superObject[name] : ancestor;
    var returnValue = method.apply(this, arguments);
    this.base = previous;
    return returnValue;
  };
  _base.ancestor = ancestor;
  object[name] = _base;
  // introspection (removed when packed)
  ;;; _base.toString = K(String(method));
};

// =========================================================================
// lang/forEach.js
// =========================================================================

// http://dean.edwards.name/weblog/2006/07/enum/

if (typeof StopIteration == "undefined") {
  StopIteration = new Error("StopIteration");
}

function forEach(object, block, context, fn) {
  if (object == null) return;
  if (!fn) {
    if (typeof object == "function" && object.call) {
      // Functions are a special case.
      fn = Function;
    } else if (typeof object.forEach == "function" && object.forEach != arguments.callee) {
      // The object implements a custom forEach method.
      object.forEach(block, context);
      return;
    } else if (typeof object.length == "number") {
      // The object is array-like.
      _Array_forEach(object, block, context);
      return;
    }
  }
  _Function_forEach(fn || Object, object, block, context);
};

// These are the two core enumeration methods. All other forEach methods
//  eventually call one of these two.

function _Array_forEach(array, block, context) {
  if (array == null) return;
  var length = array.length, i; // preserve length
  if (typeof array == "string") {
    for (i = 0; i < length; i++) {
      block.call(context, array.charAt(i), i, array);
    }
  } else { // Cater for sparse arrays.
    for (i = 0; i < length; i++) {    
    /*@cc_on @*/
    /*@if (@_jscript_version < 5.2)
      if ($Legacy.has(array, i))
    @else @*/
      if (i in array)
    /*@end @*/
        block.call(context, array[i], i, array);
    }
  }
};

function _Function_forEach(fn, object, block, context) {
  // http://code.google.com/p/base2/issues/detail?id=10
  
  // Run the test for Safari's buggy enumeration.
  var Temp = function(){this.i=1};
  Temp.prototype = {i:1};
  var count = 0;
  for (var i in new Temp) count++;
  
  // Overwrite the main function the first time it is called.
  _Function_forEach = (count > 1) ? function(fn, object, block, context) {
    // Safari fix (pre version 3)
    var processed = {};
    for (var key in object) {
      if (!processed[key] && fn.prototype[key] === undefined) {
        processed[key] = true;
        block.call(context, object[key], key, object);
      }
    }
  } : function(fn, object, block, context) {
    // Enumerate an object and compare its keys with fn's prototype.
    for (var key in object) {
      if (fn.prototype[key] === undefined) {
        block.call(context, object[key], key, object);
      }
    }
  };
  
  _Function_forEach(fn, object, block, context);
};

// =========================================================================
// lang/typeOf.js
// =========================================================================

// http://wiki.ecmascript.org/doku.php?id=proposals:typeof

function typeOf(object) {
  var type = typeof object;
  switch (type) {
    case "object":
      return object === null ? "null" : typeof object.call == "function" || _MSIE_NATIVE_FUNCTION.test(object) ? "function" : type;
    case "function":
      return typeof object.call == "function" ? type : "object";
    default:
      return type;
  }
};

// =========================================================================
// lang/instanceOf.js
// =========================================================================

function instanceOf(object, klass) {
  // Handle exceptions where the target object originates from another frame.
  // This is handy for JSON parsing (amongst other things).
  
  if (typeof klass != "function") {
    throw new TypeError("Invalid 'instanceOf' operand.");
  }

  if (object == null) return false;
  
  /*@cc_on  
  // COM objects don't have a constructor
  if (typeof object.constructor != "function") {
    return typeOf(object) == typeof klass.prototype.valueOf();
  }
  @*/
  /*@if (@_jscript_version < 5.1)
    if ($Legacy.instanceOf(object, klass)) return true;
  @else @*/
    if (object instanceof klass) return true;
  /*@end @*/

  // If the class is a base2 class then it would have passed the test above.
  if (Base.ancestorOf == klass.ancestorOf) return false;
  
  // base2 objects can only be instances of Object.
  if (Base.ancestorOf == object.constructor.ancestorOf) return klass == Object;
  
  switch (klass) {
    case Array: // This is the only troublesome one.
      return !!(typeof object == "object" && object.join && object.splice);
    case Function:
      return typeOf(object) == "function";
    case RegExp:
      return typeof object.constructor.$1 == "string";
    case Date:
      return !!object.getTimezoneOffset;
    case String:
    case Number:  // These are bullet-proof.
    case Boolean:
      return typeof object == typeof klass.prototype.valueOf();
    case Object:
      return true;
  }
  
  return false;
};

// =========================================================================
// lang/assert.js
// =========================================================================

function assert(condition, message, ErrorClass) {
  if (!condition) {
    throw new (ErrorClass || Error)(message || "Assertion failed.");
  }
};

function assertArity(args, arity, message) {
  if (arity == null) arity = args.callee.length;
  if (args.length < arity) {
    throw new SyntaxError(message || "Not enough arguments.");
  }
};

function assertType(object, type, message) {
  if (type && (typeof type == "function" ? !instanceOf(object, type) : typeOf(object) != type)) {
    throw new TypeError(message || "Invalid type.");
  }
};

// =========================================================================
// lang/core.js
// =========================================================================

function assignID(object) {
  // Assign a unique ID to an object.
  if (!object.base2ID) object.base2ID = "b2_" + _counter++;
  return object.base2ID;
};

function copy(object) {
  var fn = function(){};
  fn.prototype = object;
  return new fn;
};

// String/RegExp.

function format(string) {
  // Replace %n with arguments[n].
  // e.g. format("%1 %2%3 %2a %1%3", "she", "se", "lls");
  // ==> "she sells sea shells"
  // Only %1 - %9 supported.
  var args = arguments;
  var pattern = new RegExp("%([1-" + arguments.length + "])", "g");
  return String(string).replace(pattern, function(match, index) {
    return args[index];
  });
};

function match(string, expression) {
  // Same as String.match() except that this function will return an empty 
  // array if there is no match.
  return String(string).match(expression) || [];
};

function rescape(string) {
  // Make a string safe for creating a RegExp.
  return String(string).replace(_RESCAPE, "\\$1");
};

// http://blog.stevenlevithan.com/archives/faster-trim-javascript
function trim(string) {
  return String(string).replace(_LTRIM, "").replace(_RTRIM, "");
};

// =========================================================================
// lang/functional.js
// =========================================================================

function I(i) {
    return i;
};

function K(k) {
  return function() {
    return k;
  };
};

function bind(fn, context) {
  var args = _slice.call(arguments, 2);
  return args.length == 0 ? function() {
    return fn.apply(context, arguments);
  } : function() {
    return fn.apply(context, args.concat.apply(args, arguments));
  };
};

function delegate(fn, context) {
  return function() {
    var args = _slice.call(arguments);
    args.unshift(this);
    return fn.apply(context, args);
  };
};

function flip(fn) {
  return function() {
    return fn.apply(this, Array2.swap(arguments, 0, 1));
  };
};

function not(fn) {
  return function() {
    return !fn.apply(this, arguments);
  };
};

function unbind(fn) {
  return function(context) {
    return fn.apply(context, _slice.call(arguments, 1));
  };
};

// =========================================================================
// base2/init.js
// =========================================================================

base2 = new Package(this, base2);
eval(this.exports);

base2.extend = extend;

// the enumerable methods are extremely useful so we'll add them to the base2
//  namespace for convenience
forEach (Enumerable, function(method, name) {
  if (!Module[name]) base2.addName(name, bind(method, Enumerable));
});

JavaScript = new Package(this, JavaScript);
eval(this.exports);

}; ////////////////////  END: CLOSURE  /////////////////////////////////////

// timestamp: Sun, 06 Jan 2008 18:17:46

new function(_) { ////////////////////  BEGIN: CLOSURE  ////////////////////

// =========================================================================
// DOM/package.js
// =========================================================================

var DOM = new base2.Package(this, {
  name:    "DOM",
  version: "1.0 (beta 2)",
  exports:
    "Interface,Binding,Node,Document,Element,AbstractView,HTMLDocument,HTMLElement,"+
    "Selector,Traversal,XPathParser,NodeSelector,DocumentSelector,ElementSelector,"+
    "StaticNodeList,Event,EventTarget,DocumentEvent,ViewCSS,CSSStyleDeclaration",
  
  bind: function(node) {
    // Apply a base2 DOM Binding to a native DOM node.
    if (node && node.nodeType) {
      var uid = assignID(node);
      if (!DOM.bind[uid]) {
        switch (node.nodeType) {
          case 1: // Element
            if (typeof node.className == "string") {
              // It's an HTML element, so use bindings based on tag name.
              (HTMLElement.bindings[node.tagName] || HTMLElement).bind(node);
            } else {
              Element.bind(node);
            }
            break;
          case 9: // Document
            if (node.writeln) {
              HTMLDocument.bind(node);
            } else {
              Document.bind(node);
            }
            break;
          default:
            Node.bind(node);
        }
        DOM.bind[uid] = true;
      }
    }
    return node;
  },
  
  "@MSIE5.+win": {  
    bind: function(node) {
      if (node && node.writeln) {
        node.nodeType = 9;
      }
      return this.base(node);
    }
  }
});

eval(this.imports);

var _MSIE = detect("MSIE");
var _MSIE5 = detect("MSIE5");

// =========================================================================
// DOM/Interface.js
// =========================================================================

// The Interface module is the base module for defining DOM interfaces.
// Interfaces are defined with reference to the original W3C IDL.
// e.g. http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-1950641247

var Interface = Module.extend(null, {
  implement: function(_interface) {
    var module = this;
    if (Interface.ancestorOf(_interface)) {
      forEach (_interface, function(property, name) {
        if (_interface[name]._delegate) {
          module[name] = function() { // Late binding.
            return _interface[name].apply(_interface, arguments);
          };
        }
      });
    } else if (typeof _interface == "object") {
      this.forEach (_interface, function(source, name) {
        if (name.charAt(0) == "@") {
          forEach (source, arguments.callee);
        } else if (typeof source == "function" && source.call) {
          // delegate a static method to the bound object
          //  e.g. for most browsers:
          //    EventTarget.addEventListener(element, type, listener, capture) 
          //  forwards to:
          //    element.addEventListener(type, listener, capture)
          if (!module[name]) {
            var FN = "var fn=function _%1(%2){%3.base=%3.%1.ancestor;var m=%3.base?'base':'%1';return %3[m](%4)}";
            var args = "abcdefghij".split("").slice(-source.length);
            eval(format(FN, name, args, args[0], args.slice(1)));
            fn._delegate = name;
            module[name] = fn;
          }
        }
      });
    }
    return this.base(_interface);
  }
});

// =========================================================================
// DOM/Binding.js
// =========================================================================

var Binding = Interface.extend(null, {
  bind: function(object) {
    return extend(object, this.prototype);
  }
});

// =========================================================================
// DOM/Node.js
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
      
      var nodeIndex = _getSourceIndex(node);
      var otherIndex = _getSourceIndex(other);
      
      if (nodeIndex < otherIndex) {
        return 4; // following
      } else if (nodeIndex > otherIndex) {
        return 2; // preceding
      }      
      return 0;
    }
  }
});

var _getSourceIndex = document.documentElement.sourceIndex ? function(node) {
  return node.sourceIndex;
} : function(node) {
  // return a key suitable for comparing nodes
  var key = 0;
  while (node) {
    key = Traversal.getNodeIndex(node) + "." + key;
    node = node.parentNode;
  }
  return key;
};

// =========================================================================
// DOM/Document.js
// =========================================================================

var Document = Node.extend(null, {
  bind: function(document) {
    extend(document, "createElement", function(tagName) {
      return DOM.bind(this.base(tagName));
    });
    AbstractView.bind(document.defaultView);
    if (document != window.document)
      new DOMContentLoadedEvent(document);
    return this.base(document);
  },
  
  "@!(document.defaultView)": {
    bind: function(document) {
      document.defaultView = Traversal.getDefaultView(document);
      return this.base(document);
    }
  }
});

// =========================================================================
// DOM/Element.js
// =========================================================================

// http://www.w3.org/TR/DOM-Level-3-Core/core.html#ID-745549614

// Fix has/get/setAttribute() for IE here instead of HTMLElement.

// getAttribute() will return null if the attribute is not specified. This is
//  contrary to the specification but has become the de facto standard.

var _EVALUATED = /^(href|src)$/;
var _ATTRIBUTES = {
  "class": "className",
  "for": "htmlFor"
};

var Element = Node.extend({
  "@MSIE.+win": {
    getAttribute: function(element, name, iFlags) {
      if (element.className === undefined) { // XML
        return this.base(element, name);
      }
      var attribute = _MSIE_getAttributeNode(element, name);
      if (attribute && (attribute.specified || name == "value")) {
        if (_EVALUATED.test(name)) {
          return this.base(element, name, 2);
        } else if (name == "style") {
         return element.style.cssText;
        } else {
         return attribute.nodeValue;
        }
      }
      return null;
    },
    
    setAttribute: function(element, name, value) {
      if (element.className === undefined) { // XML
        this.base(element, name, value);
      } else if (name == "style") {
        element.style.cssText = value;
      } else {
        value = String(value);
        var attribute = _MSIE_getAttributeNode(element, name);
        if (attribute) {
          attribute.nodeValue = value;
        } else {
          this.base(element, _ATTRIBUTES[name] || name, value);
        }
      }
    }
  },

  "@!(element.hasAttribute)": {
    hasAttribute: function(element, name) {
      return this.getAttribute(element, name) != null;
    }
  }
});

// remove the base2ID for clones
extend(Element.prototype, "cloneNode", function(deep) {
  var clone = this.base(deep || false);
  clone.base2ID = undefined;
  return clone;
});

if (_MSIE) {
  var _PROPERCASE_ATTRIBUTES = "colSpan,rowSpan,vAlign,dateTime,accessKey,tabIndex,encType,maxLength,readOnly,longDesc";
  // Convert the list of strings to a hash, mapping the lowercase name to the camelCase name.
  extend(_ATTRIBUTES, Array2.combine(_PROPERCASE_ATTRIBUTES.toLowerCase().split(","), _PROPERCASE_ATTRIBUTES.split(",")));
  
  var _MSIE_getAttributeNode = _MSIE5 ? function(element, name) {
    return element.attributes[name] || element.attributes[_ATTRIBUTES[name.toLowerCase()]];
  } : function(element, name) {
    return element.getAttributeNode(name);
  };
}

// =========================================================================
// DOM/Traversal.js
// =========================================================================

// DOM Traversal. Just the basics.

// Loosely based on this:
// http://www.w3.org/TR/2007/WD-ElementTraversal-20070727/

var TEXT = _MSIE ? "innerText" : "textContent";

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
    return node[TEXT];
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
    return node[TEXT] = text;
  },
  
  "@MSIE": {
    getDefaultView: function(node) {
      return (node.document || node).parentWindow;
    },
  
    "@MSIE5": {
      // return the node's containing document
      getOwnerDocument: function(node) {
        return node.ownerDocument || node.document;
      }
    }
  }
}, {
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
      return node != target && (this.isDocument(node) ? node == this.getOwnerDocument(target) : node.contains(target));
    }
  },
  
  "@MSIE5": {
    isElement: function(node) {
      return !!(node && node.nodeType == 1 && node.nodeName != "!");
    }
  }
});

// =========================================================================
// DOM/views/AbstractView.js
// =========================================================================

var AbstractView = Binding.extend();

// =========================================================================
// DOM/events/Event.js
// =========================================================================

// http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-Event

var Event = Binding.extend({
  "@!(document.createEvent)": {
    initEvent: function(event, type, bubbles, cancelable) {
      event.type = type;
      event.bubbles = bubbles;
      event.cancelable = cancelable;
      event.timeStamp = new Date().valueOf();
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
/*  "@WebKit": {
    bind: function(event) {
      if (event.target && event.target.nodeType == 3) { // TEXT_NODE
        event = copy(event);
        event.target = event.target.parentNode;
      }
      return this.base(event);
    }
  }, */
  
  "@!(document.createEvent)": {
    "@MSIE": {
      bind: function(event) {
        if (!event.timeStamp) {
          event.bubbles = !!_BUBBLES[event.type];
          event.cancelable = !!_CANCELABLE[event.type];
          event.timeStamp = new Date().valueOf();
        }
        if (!event.target) {
          event.target = event.srcElement;
        }
        event.relatedTarget = event[(event.type == "mouseout" ? "to" : "from") + "Element"];
        return this.base(event);
      }
    }
  }
});

if (_MSIE) {
  var _BUBBLES    = "abort,error,select,change,resize,scroll"; // + _CANCELABLE
  var _CANCELABLE = "click,mousedown,mouseup,mouseover,mousemove,mouseout,keydown,keyup,submit,reset";
  _BUBBLES = Array2.combine((_BUBBLES + "," + _CANCELABLE).split(","));
  _CANCELABLE = Array2.combine(_CANCELABLE.split(","));
}

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
      var listenerID = assignID(listener);
      // create a hash table of event types for the target object
      var events = _eventMap[targetID];
      if (!events) events = _eventMap[targetID] = {};
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
        target["on" + type] = _eventMap._handleEvent;
      }
    },
  
    dispatchEvent: function(target, event) {
      return _handleEvent.call(target, event);
    },
  
    removeEventListener: function(target, type, listener, capture) {
      // delete the event listener from the hash table
      var events = _eventMap[target.base2ID];
      if (events && events[type]) {
        delete events[type][listener.base2ID];
      }
    },
    
    "@(element.fireEvent)": {
      dispatchEvent: function(target, event) {
        var type = "on" + event.type;
        event.target = target;
        if (target[type] === undefined) {
          return this.base(target, event);
        } else {
          return target.fireEvent(type, event);
        }
      }
    }
  }
});

var _eventMap = new Base({ 
  _handleEvent: _handleEvent,
  
  "@MSIE": {
    _handleEvent: function() {
      var target = this;
      var window = (target.document || target).parentWindow;
      if (target.Infinity) target = window;
      return _handleEvent.call(target, window.event);
    }
  }
});

function _handleEvent(event) {
  var returnValue = true;
  // get a reference to the hash table of event listeners
  var events = _eventMap[this.base2ID];
  if (events) {
    Event.bind(event); // fix the event object
    var listeners = events[event.type];
    // execute each event listener
    for (var i in listeners) {
      var listener = listeners[i];
      // support the EventListener interface
      if (listener.handleEvent) {
        var result = listener.handleEvent(event);
      } else {
        result = listener.call(this, event);
      }
      if (result === false || event.returnValue === false) returnValue = false;
    }
  }
  return returnValue;
};

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
        return this.base(document, type == "Events" ? "UIEvents" : type);
      }
    }
  }
});

// =========================================================================
// DOM/events/DOMContentLoadedEvent.js
// =========================================================================

// http://dean.edwards.name/weblog/2006/06/again

var DOMContentLoadedEvent = Base.extend({
  constructor: function(document) {
    var fired = false;
    this.fire = function() {
      if (!fired) {
        fired = true;
        // this function will be called from another event handler so we'll user a timer
        //  to drop out of any current event
        setTimeout(function() {
          var event = DocumentEvent.createEvent(document, "Events");
          Event.initEvent(event, "DOMContentLoaded", false, false);
          EventTarget.dispatchEvent(document, event);
        }, 1);
      }
    };
    // use the real event for browsers that support it (opera & firefox)
    EventTarget.addEventListener(document, "DOMContentLoaded", function() {
      fired = true;
    }, false);
    this.listen(document);
  },
  
  listen: function(document) {
    // if all else fails fall back on window.onload
    EventTarget.addEventListener(Traversal.getDefaultView(document), "load", this.fire, false);
  },

  "@MSIE.+win": {
    listen: function(document) {
      if (document.readyState != "complete") {
        // Matthias Miller/Mark Wubben/Paul Sowden/Me
        var event = this;
        document.write("<script id=__ready defer src=//:><\/script>");
        document.all.__ready.onreadystatechange = function() {
          if (this.readyState == "complete") {
            this.removeNode(); // tidy
            event.fire();
          }
        };
      }
    }
  },
  
  "@KHTML": {
    listen: function(document) {
      // John Resig
      if (document.readyState != "complete") {
        var event = this;
        var timer = setInterval(function() {
          if (/loaded|complete/.test(document.readyState)) {
            clearInterval(timer);
            event.fire();
          }
        }, 100);
      }
    }
  }
});

new DOMContentLoadedEvent(document);

// =========================================================================
// DOM/events/implementations.js
// =========================================================================

Document.implement(DocumentEvent);
Document.implement(EventTarget);

Element.implement(EventTarget);

// =========================================================================
// DOM/style/ViewCSS.js
// =========================================================================

// http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-ViewCSS

var _PIXEL   = /^\d+(px)?$/i;
var _METRICS = /(width|height|top|bottom|left|right|fontSize)$/;
var _COLOR   = /^(color|backgroundColor)$/;

var ViewCSS = Interface.extend({
  "@!(document.defaultView.getComputedStyle)": {
    "@MSIE": {
      getComputedStyle: function(view, element, pseudoElement) {
        // pseudoElement parameter is not supported
        var currentStyle = element.currentStyle; 
        var computedStyle = {};
        for (var i in currentStyle) {
          if (_METRICS.test(i)) {
            computedStyle[i] = _MSIE_getPixelValue(element, computedStyle[i]) + "px";
          } else if (_COLOR.test(i)) {
            computedStyle[i] = _MSIE_getColorValue(element, i == "color" ? "ForeColor" : "BackColor");
          } else {        
          	try {
          		computedStyle[i] = currentStyle[i];
          	} catch(x){}          	
          }
        }
        return computedStyle;
      } 
    }
  },
  
  getComputedStyle: function(view, element, pseudoElement) {
    return _CSSStyleDeclaration_ReadOnly.bind(this.base(view, element, pseudoElement));
  }
}, {
  toCamelCase: function(string) {
    return string.replace(/\-([a-z])/g, function(match, chr) {
      return chr.toUpperCase();
    });
  }
});

function _MSIE_getPixelValue(element, value) {
  if (_PIXEL.test(value)) return parseInt(value);
  var styleLeft = element.style.left;
  var runtimeStyleLeft = element.runtimeStyle.left;
  element.runtimeStyle.left = element.currentStyle.left;
  element.style.left = value || 0;
  value = element.style.pixelLeft;
  element.style.left = styleLeft;
  element.runtimeStyle.left = runtimeStyleLeft;
  return value;
};

function _MSIE_getColorValue(element, value) {
  var range = element.document.body.createTextRange();
  range.moveToElementText(element);
  var color = range.queryCommandValue(value);
  return format("rgb(%1,%2,%3)", color & 0xff, (color & 0xff00) >> 8,  (color & 0xff0000) >> 16);
};

// =========================================================================
// DOM/style/CSSStyleDeclaration.js
// =========================================================================

// http://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration

var _CSSStyleDeclaration_ReadOnly = Binding.extend({
  getPropertyValue: function(style, propertyName) {
    return this.base(style, _CSSPropertyNameMap[propertyName] || propertyName);
  },
  
  "@MSIE.+win": {
    getPropertyValue: function(style, propertyName) {
      return propertyName == "float" ? style.styleFloat : style[ViewCSS.toCamelCase(propertyName)];
    }
  }
});

var CSSStyleDeclaration = _CSSStyleDeclaration_ReadOnly.extend({
  setProperty: function(style, propertyName, value, important) {
    return this.base(style, _CSSPropertyNameMap[propertyName] || propertyName, value, important);
  },
  
  "@MSIE.+win": {
    setProperty: function(style, propertyName, value, priority) {
      if (propertyName == "opacity") {
        value *= 100;
        style.opacity = value;
        style.zoom = 1;
        style.filter = "Alpha(opacity=" + value + ")";
      } else {
        style.setAttribute(propertyName, value);
      }
    }
  }
}, {
  "@MSIE": {
    bind: function(style) {
      style.getPropertyValue = this.prototype.getPropertyValue;
      style.setProperty = this.prototype.setProperty;
      return style;
    }
  }
});

var _CSSPropertyNameMap = new Base({
  "@Gecko": {
    opacity: "-moz-opacity"
  },
  
  "@KHTML": {
    opacity: "-khtml-opacity"
  }
});

with (CSSStyleDeclaration.prototype) getPropertyValue.toString = setProperty.toString = function() {
  return "[base2]";
};

// =========================================================================
// DOM/style/implementations.js
// =========================================================================

AbstractView.implement(ViewCSS);

// =========================================================================
// DOM/selectors-api/NodeSelector.js
// =========================================================================

// http://www.w3.org/TR/selectors-api/

var NodeSelector = Interface.extend({
  "@!(element.querySelector)": { // future-proof
    querySelector: function(node, selector) {
      return new Selector(selector).exec(node, 1);
    },
    
    querySelectorAll: function(node, selector) {
      return new Selector(selector).exec(node);
    }
  }
});

// automatically bind objects retrieved using the Selectors API

extend(NodeSelector.prototype, {
  querySelector: function(selector) {
    return DOM.bind(this.base(selector));
  },

  querySelectorAll: function(selector) {
    return extend(this.base(selector), "item", function(index) {
      return DOM.bind(this.base(index));
    });
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
    for (var i = 0; i < this.length; i++) {
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
// DOM/selectors-api/CSSParser.js
// =========================================================================

var _CSS_ESCAPE =           /'(\\.|[^'\\])*'|"(\\.|[^"\\])*"/g,
    _CSS_IMPLIED_ASTERISK = /([\s>+~,]|[^(]\+|^)([#.:\[])/g,
    _CSS_IMPLIED_SPACE =    /(^|,)([^\s>+~])/g,
    _CSS_WHITESPACE =       /\s*([\s>+~(),]|^|$)\s*/g,
    _CSS_WILD_CARD =        /\s\*\s/g,
    _CSS_UNESCAPE =         /\x01(\d+)/g,
    _QUOTE =                /'/g;
  
var CSSParser = RegGrp.extend({
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
    var strings = this._strings = [];
    return this.optimise(this.format(String(selector).replace(_CSS_ESCAPE, function(string) {      
      return "\x01" + strings.push(string.slice(1, -1).replace(_QUOTE, "\\'"));
    })));
  },
  
  format: function(selector) {
    return selector
      .replace(_CSS_WHITESPACE, "$1")
      .replace(_CSS_IMPLIED_SPACE, "$1 $2")
      .replace(_CSS_IMPLIED_ASTERISK, "$1*$2");
  },
  
  optimise: function(selector) {
    // optimise wild card descendant selectors
    return this.sorter.exec(selector.replace(_CSS_WILD_CARD, ">* "));
  },
  
  parse: function(selector) {
    return this.cache[selector] ||
      (this.cache[selector] = this.unescape(this.exec(this.escape(selector))));
  },
  
  unescape: function(selector) {
    // put string values back
    var strings = this._strings;
    return selector.replace(_CSS_UNESCAPE, function(match, index) {
      return strings[index - 1];
    });
  }
});

function _nthChild(match, args, position, last, not, and, mod, equals) {
  // ugly but it works for both CSS and XPath
  last = /last/i.test(match) ? last + "+1-" : "";
  if (!isNaN(args)) args = "0n+" + args;
  else if (args == "even") args = "2n";
  else if (args == "odd") args = "2n+1";
  args = args.split("n");
  var a = args[0] ? (args[0] == "-") ? -1 : parseInt(args[0]) : 1;
  var b = parseInt(args[1]) || 0;
  var negate = a < 0;
  if (negate) {
    a = -a;
    if (a == 1) b++;
  }
  var query = format(a == 0 ? "%3%7" + (last + b) : "(%4%3-%2)%6%1%70%5%4%3>=%2", a, b, position, last, and, mod, equals);
  if (negate) query = not + "(" + query + ")";
  return query;
};

// =========================================================================
// DOM/selectors-api/XPathParser.js
// =========================================================================

// XPath parser
// converts CSS expressions to *optimised* XPath queries

// This code used to be quite readable until I added code to optimise *-child selectors. 

var XPathParser = CSSParser.extend({
  constructor: function() {
    this.base(XPathParser.rules);
    // The sorter sorts child selectors to the end because they are slow.
    // For XPath we need the child selectors to be sorted to the beginning,
    // so we reverse the sort order. That's what this line does:
    this.sorter.putAt(1, "$1$4$3$6");
  },
  
  escape: function(selector) {
    return this.base(selector).replace(/,/g, "\x02");
  },
  
  unescape: function(selector) {
    return this.base(selector
      .replace(/\[self::\*\]/g, "")   // remove redundant wild cards
      .replace(/(^|\x02)\//g, "$1./") // context
      .replace(/\x02/g, " | ")        // put commas back      
    ).replace(/'[^'\\]*\\'(\\.|[^'\\])*'/g, function(match) { // escape single quotes
      return "concat(" + match.split("\\'").join("',\"'\",'") + ")";
    });
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
          replacement += _xpath_nthChild(pseudoClass, args, "position()");
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
      "not()":            _xpath_not,
      "nth-child()":      _xpath_nthChild,
      "nth-last-child()": _xpath_nthChild,
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
function _xpath_not(match, args) {
  return "[not(" + _notParser.exec(trim(args))
    .replace(/\[1\]/g, "") // remove the "[1]" introduced by ID selectors
    .replace(/^(\*|[\w-]+)/, "[self::$1]") // tagName test
    .replace(/\]\[/g, " and ") // merge predicates
    .slice(1, -1)
  + ")]";
};

function _xpath_nthChild(match, args, position) {
  return "[" + _nthChild(match, args, position || "count(preceding-sibling::*)+1", "last()", "not", " and ", " mod ", "=") + "]";
};

// =========================================================================
// DOM/selectors-api/Selector.js
// =========================================================================

// This object can be instantiated, however it is probably better to use
// the querySelector/querySelectorAll methods on DOM nodes.

// There is no public standard for this object.

var Selector = Base.extend({
  constructor: function(selector) {
    this.toString = K(trim(selector));
  },
  
  exec: function(context, single) {
    return Selector.parse(this)(context, single);
  },
  
  test: function(element) {
    //-dean: improve this for simple selectors
    var selector = new Selector(this + "[b2-test]");
    element.setAttribute("b2-test", true);
    var result = selector.exec(Traversal.getOwnerDocument(element), true);
    element.removeAttribute("b2-test");
    return result == element;
  },
  
  toXPath: function() {
    return Selector.toXPath(this);
  },
  
  "@(XPathResult)": {
    exec: function(context, single) {
      // use DOM methods if the XPath engine can't be used
     
      if (_NOT_XPATH.test(this)) {      	
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
    exec: function(context, single) {
      if (typeof context.selectNodes != "undefined" && !_NOT_XPATH.test(this)) { // xml
        var method = single ? "selectSingleNode" : "selectNodes";
        return context[method](this.toXPath());
      }
      return this.base(context, single);
    }
  },
  
  "@(true)": {
    exec: function(context, single) {
      try {
        var result = this.base(context || document, single);
      } catch (error) { // probably an invalid selector =)
        throw new SyntaxError(format("'%1' is not a valid CSS selector.", this));
      }
      return single ? result : new StaticNodeList(result);
    }
  }
}, {  
  toXPath: function(selector) {
    if (!_xpathParser) _xpathParser = new XPathParser;
    return _xpathParser.parse(selector);
  }
});

var _NOT_XPATH = ":(checked|disabled|enabled|contains)|^(#[\\w-]+\\s*)?\\w+$";
if (detect("KHTML")) {
  if (detect("WebKit5")) {
    _NOT_XPATH += "|nth\\-|,";
  } else {
    _NOT_XPATH = ".";
  }
}
_NOT_XPATH = new RegExp(_NOT_XPATH);

// Selector.parse() - converts CSS selectors to DOM queries.

// Hideous code but it produces fast DOM queries.
// Respect due to Alex Russell and Jack Slocum for inspiration.

var _OPERATORS = {
  "=":  "%1=='%2'",
  "!=": "%1!='%2'", //  not standard but other libraries support it
  "~=": /(^| )%1( |$)/,
  "|=": /^%1(-|$)/,
  "^=": /^%1/,
  "$=": /%1$/,
  "*=": /%1/
};
_OPERATORS[""] = "%1!=null";

var _PSEUDO_CLASSES = { //-dean: lang()
  "checked":     "e%1.checked",
  "contains":    "e%1[TEXT].indexOf('%2')!=-1",
  "disabled":    "e%1.disabled",
  "empty":       "Traversal.isEmpty(e%1)",
  "enabled":     "e%1.disabled===false",
  "first-child": "!Traversal.getPreviousElementSibling(e%1)",
  "last-child":  "!Traversal.getNextElementSibling(e%1)",
  "only-child":  "!Traversal.getPreviousElementSibling(e%1)&&!Traversal.getNextElementSibling(e%1)",
  "root":        "e%1==Traversal.getDocument(e%1).documentElement"
};

var _INDEXED = detect("(element.sourceIndex)") ;
var _VAR = "var p%2=0,i%2,e%2,n%2=e%1.";
var _ID = _INDEXED ? "e%1.sourceIndex" : "assignID(e%1)";
var _TEST = "var g=" + _ID + ";if(!p[g]){p[g]=1;";
var _STORE = "r[r.length]=e%1;if(s)return e%1;";
//var _SORT = "r.sort(sorter);";
var _FN = "var _selectorFunction=function(e0,s){_indexed++;var r=[],p={},reg=[%1]," +
  "d=Traversal.getDocument(e0),c=d.body?'toUpperCase':'toString';";
  
var _xpathParser;

//var sorter = _INDEXED ? function(a, b) {
//  return a.sourceIndex - b.sourceIndex;
//} : Node.compareDocumentPosition;

// variables used by the parser

var _reg; // a store for RexExp objects
var _index;
var _wild; // need to flag certain _wild card selectors as _MSIE includes comment nodes
var _list; // are we processing a node _list?
var _duplicate; // possible duplicates?
var _cache = {}; // store parsed selectors

// a hideous parser
var _parser = new CSSParser({
  "^ \\*:root": function(match) { // :root pseudo class
    _wild = false;
    var replacement = "e%2=d.documentElement;if(Traversal.contains(e%1,e%2)){";
    return format(replacement, _index++, _index);
  },
  
  " (\\*|[\\w-]+)#([\\w-]+)": function(match, tagName, id) { // descendant selector followed by ID
    _wild = false;
    var replacement = "var e%2=_byId(d,'%4');if(e%2&&";
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
    if (_wild && _MSIE) replacement += "if(e%1.nodeName!='!'){";
    _wild = false;
    replacement += "e%1=Traversal.getNextElementSibling(e%1);if(e%1";
    if (tagName != "*") replacement += "&&e%1.nodeName=='%2'[c]()";
    replacement += "){";
    return format(replacement, _index, tagName);
  },
  
  "~(\\*|[\\w-]+)": function(match, tagName) { // indirect adjacent selector
    var replacement = "";
    if (_wild && _MSIE) replacement += "if(e%1.nodeName!='!'){";
    _wild = false;
    _duplicate = 2; // this selector may produce duplicates
    replacement += "while(e%1=e%1.nextSibling){if(e%1.b2_adjacent==_indexed)break;if(";
    if (tagName == "*") {
      replacement += "e%1.nodeType==1";
      if (_MSIE5) replacement += "&&e%1.nodeName!='!'";
    } else replacement += "e%1.nodeName=='%2'[c]()";
    replacement += "){e%1.b2_adjacent=_indexed;";
    return format(replacement, _index, tagName);
  },
  
  "#([\\w-]+)": function(match, id) { // ID selector
    _wild = false;
    var replacement = "if(e%1.id=='%2'){";
    if (_list) replacement += format("i%1=n%1.length;", _list);
    return format(replacement, _index, id);
  },
  
  "\\.([\\w-]+)": function(match, className) { // class selector
    _wild = false;
    // store RegExp objects - slightly faster on IE
    _reg.push(new RegExp("(^|\\s)" + rescape(className) + "(\\s|$)"));
    return format("if(e%1.className&&reg[%2].test(e%1.className)){", _index, _reg.length - 1);
  },
  
  ":not\\((\\*|[\\w-]+)?([^)]*)\\)": function(match, tagName, filters) { // :not pseudo class
    var replacement = (tagName && tagName != "*") ? format("if(e%1.nodeName=='%2'[c]()){", _index, tagName) : "";
    replacement += _parser.exec(filters);
    return "if(!" + replacement.slice(2, -1).replace(/\)\{if\(/g, "&&") + "){";
  },
  
  ":nth(-last)?-child\\(([^)]+)\\)": function(match, last, args) { // :nth-child pseudo classes
    _wild = false;
    last = format("e%1.parentNode.b2_length", _index);
    var replacement = "if(p%1!==e%1.parentNode)p%1=_register(e%1.parentNode);";
    replacement += "var i=e%1[p%1.b2_lookup];if(p%1.b2_lookup!='b2_index')i++;if(";
    return format(replacement, _index) + _nthChild(match, args, "i", last, "!", "&&", "%", "==") + "){";
  },
  
  ":([\\w-]+)(\\(([^)]+)\\))?": function(match, pseudoClass, $2, args) { // other pseudo class selectors
    return "if(" + format(_PSEUDO_CLASSES[pseudoClass] || "throw", _index, args || "") + "){";
  },
  
  "\\[([\\w-]+)\\s*([^=]?=)?\\s*([^\\]]*)\\]": function(match, attr, operator, value) { // attribute selectors
    var alias = _ATTRIBUTES[attr] || attr;
    if (operator) {
      var getAttribute = "e%1.getAttribute('%2',2)";
      if (!_EVALUATED.test(attr)) {
        getAttribute = "e%1.%3||" + getAttribute;
      }
      attr = format("(" + getAttribute + ")", _index, attr, alias);
    } else {
      attr = format("Element.getAttribute(e%1,'%2')", _index, attr);
    }
    var replacement = _OPERATORS[operator || ""];
    if (instanceOf(replacement, RegExp)) {
      _reg.push(new RegExp(format(replacement.source, rescape(_parser.unescape(value)))));
      replacement = "reg[%2].test(%1)";
      value = _reg.length - 1;
    }
    return "if(" + format(replacement, attr, value) + "){";
  }
});

new function(_) {
  // IE confuses the name attribute with id for form elements,
  // use document.all to retrieve all elements with name/id instead
  var _byId = _MSIE ? function(document, id) {
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

  // register a node and index its children
  var _indexed = 1;
  function _register(element) {
    if (element.rows) {
      element.b2_length = element.rows.length;
      element.b2_lookup = "rowIndex";
    } else if (element.cells) {
      element.b2_length = element.cells.length;
      element.b2_lookup = "cellIndex";
    } else if (element.b2_indexed != _indexed) {
      var index = 0;
      var child = element.firstChild;
      while (child) {
        if (child.nodeType == 1 && child.nodeName != "!") {
          child.b2_index = ++index;
        }
        child = child.nextSibling;
      }
      element.b2_length = index;
      element.b2_lookup = "b2_index";
    }
    element.b2_indexed = _indexed;
    return element;
  };
  
  Selector.parse = function(selector) {
    if (!_cache[selector]) {
      _reg = []; // store for RegExp objects
      var fn = "";
      var selectors = _parser.escape(selector).split(",");
      for (var i = 0; i < selectors.length; i++) {
        _wild = _index = _list = 0; // reset
        _duplicate = selectors.length > 1 ? 2 : 0; // reset
        var block = _parser.exec(selectors[i]) || "throw;";
        if (_wild && _MSIE) { // IE's pesky comment nodes
          block += format("if(e%1.nodeName!='!'){", _index);
        }
        // check for duplicates before storing results
        var store = (_duplicate > 1) ? _TEST : "";
        block += format(store + _STORE, _index);
        // add closing braces
        block += Array(match(block, /\{/g).length + 1).join("}");
        fn += block;
      }
//    if (selectors.length > 1) fn += _SORT;
      eval(format(_FN, _reg) + _parser.unescape(fn) + "return s?null:r}");
      _cache[selector] = _selectorFunction;
    }
    return _cache[selector];
  };
};

// =========================================================================
// DOM/selectors-api/implementations.js
// =========================================================================

Document.implement(DocumentSelector);
Element.implement(ElementSelector);

// =========================================================================
// DOM/html/HTMLDocument.js
// =========================================================================

// http://www.whatwg.org/specs/web-apps/current-work/#htmldocument

var HTMLDocument = Document.extend(null, {
  // http://www.whatwg.org/specs/web-apps/current-work/#activeelement  
  "@(document.activeElement===undefined)": {
    bind: function(document) {
      document.activeElement = null;
      EventTarget.addEventListener(document, "focus", function(event) { //-dean: is onfocus good enough?
        document.activeElement = event.target;
      }, false);
      return this.base(document);
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
    element.className = trim(element.className.replace(regexp, "$2"));
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
  
  bind: function(element) {
    CSSStyleDeclaration.bind(element.style);
    return this.base(element);
  },
  
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
      element.ownerDocument = Traversal.getOwnerDocument(element);
      return this.base(element);
    }
  }
});

HTMLElement.extend(null, {
  tags: "APPLET,EMBED",  
  bind: I // Binding not allowed for these elements.
});

eval(this.exports);

}; ////////////////////  END: CLOSURE  /////////////////////////////////////

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
		elem.hasClass = function(className) { return base2.DOM.HTMLElement.hasClass(this,className) };
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

if (typeof(wFORMS) == "undefined") {
	throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
/**
 * wForms hint behavior. Show/highlight an HTML element when the associated input gets the focus.
 */
wFORMS.behaviors.hint  = { 
	
	/**
	 * Inactive CSS class for the element
     * @final
	 */
	CSS_INACTIVE : 'field-hint-inactive',

	/**
	 * Active CSS class for the element
     * @final
	 */
	CSS_ACTIVE : 'field-hint',

	/**
	 * Selector expression for the hint elements
     * @final
     * @see	http://www.w3.org/TR/css3-selectors/
	 */
	HINT_SELECTOR : '*[id$="-H"]',

	/**
	 * Suffix of the ID for the hint element
     * @final
	 */
	HINT_SUFFIX : '-H',

	/**
	 * Creates new instance of the behavior
     * @constructor
	 */
	instance : function(f) {
		this.behavior = wFORMS.behaviors.hint; 
		this.target = f;
	}
}

/**
 * Factory Method.
 * Applies the behavior to the given HTML element by setting the appropriate event handlers.
 * @param {domElement} f An HTML element, either nested inside a FORM element or (preferably) the FORM element itself.
 * @return {object} an instance of the behavior 
 */	
wFORMS.behaviors.hint.applyTo = function(f) {
	var b = new wFORMS.behaviors.hint.instance(f);
	// Selects all hints elements using predefined selector and attaches
	// event listeners to related HTML elements for each hint
	f.querySelectorAll(wFORMS.behaviors.hint.HINT_SELECTOR).forEach(
		function(elem){
			
			// ID attribute is not checked here because selector already contains it
			// if selector is changed, ID check should also exists
			// if(!elem.id) { return ; }
			var e = b.getElementByHintId(elem.id);
			if(e){
				if(!e.addEventListener) base2.DOM.bind(e);
				if(e.tagName == "SELECT" || e.tagName == "TEXTAREA" || (e.tagName == "INPUT" && e.type != "radio" && e.type != "checkbox")){							
					e.addEventListener('focus', function(event) { b.run(event, this)}, false);
					e.addEventListener('blur',  function(event) { b.run(event, this)}, false);	
				} else {
					e.addEventListener('mouseover', function(event) { b.run(event, e)}, false);
					e.addEventListener('mouseout', function(event) { b.run(event, e)}, false);
				}
			}
		}
	);
	b.onApply();
	return b;
}

/**
 * Executed once the behavior has been applied to the document.
 * Can be overwritten.
 */
wFORMS.behaviors.hint.instance.prototype.onApply = function() {} 

/**
 * Executes the behavior
 * @param {event} event
 * @param {domElement} elem
 */
wFORMS.behaviors.hint.instance.prototype.run = function(event, element) { 	
	
	var hint = this.getHintElement(element);
	if(!hint) return;

	if(event.type == 'focus' || event.type == 'mouseover'){
		hint.removeClass(wFORMS.behaviors.hint.CSS_INACTIVE)
		hint.addClass(wFORMS.behaviors.hint.CSS_ACTIVE);
		this.setup(hint, element);
	} else{
		hint.addClass(wFORMS.behaviors.hint.CSS_INACTIVE);
		hint.removeClass(wFORMS.behaviors.hint.CSS_ACTIVE);
	}
}


/**
 * Returns HTMLElement related to specified hint ID
 * @returns	{HTMLElement}
 */
wFORMS.behaviors.hint.instance.prototype.getElementByHintId = function(hintId){
	var id = hintId.substr(0, hintId.length - wFORMS.behaviors.hint.HINT_SUFFIX.length);
	var e = document.getElementById(id);
	return e;
}

/**
 * Returns HTMLElement Hint element associated with element event catched from
 * @returns	{HTMLElement}
 */
wFORMS.behaviors.hint.instance.prototype.getHintElement = function(element){
	var e = document.getElementById(element.id + this.behavior.HINT_SUFFIX);
	if(e && !e.hasClass){base2.DOM.bind(e);}
	return e && e != '' ? e : null;
}

/**
 * Setups hint position on the screen depend on the element
 * @param	{HTMLElement}	hint	Hint HTML element
 * @param   {HTMLElement}	source	HTML element with focus.
 */
wFORMS.behaviors.hint.instance.prototype.setup = function(hint, source){
	
	var l = ((source.tagName == 'SELECT' ? + source.offsetWidth : 0) + wFORMS.helpers.getLeft(source));
	var t  = (wFORMS.helpers.getTop(source) + source.offsetHeight);	
	hint.style.left = l + "px"; 
	hint.style.top  = t + "px";
}

/**
 * Returns if ID is of the HINT element. Used by repeat behavior to correctly 
 * update hint ID
 * @param	{DOMString}	id
 * @return	boolean
 */
wFORMS.behaviors.hint.isHintId = function(id){
	return id.match(new RegExp(wFORMS.behaviors.hint.HINT_SUFFIX + '$')) != null;
}

if (typeof(wFORMS) == "undefined") {
	throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
/**
 * wForms paging behavior. 
 * See: http://www.formassembly.com/blog/the-pagination-behavior-explained/
 */
wFORMS.behaviors.paging = {

	/**
	 * Selector expression for catching elements
     * @final
     * @see	http://www.w3.org/TR/css3-selectors/
	 */
	SELECTOR : '.wfPage',

	/**
	 * CSS class indicates page
     * @final
	 */
	CSS_PAGE : 'wfPage',

	/**
	 * CSS class for current page
     * @final
	 */
	CSS_CURRENT_PAGE : 'wfCurrentPage',

	/**
	 * CSS class for next button
     * @final
	 */
	CSS_BUTTON_NEXT : 'wfPageNextButton',

	/**
	 * CSS class for next button
     * @final
	 */
	CSS_BUTTON_PREVIOUS : 'wfPagePreviousButton',
	
	/**
	 * CSS class for the div contains the previous/next buttons
     * @final
	 */
	CSS_BUTTON_PLACEHOLDER : 'wfPagingButtons',
	
	/**
	 * ID prefix for the next buttons
     * @final
	 */
	ID_BUTTON_NEXT_PREFIX : 'wfPageNextId',

	/**
	 * ID prefix for the previos buttons
     * @final
	 */
	ID_BUTTON_PREVIOUS_PREFIX : 'wfPagePreviousId',

	/**
	 * CSS class for hidden submit button
     * @final
	 */
	CSS_SUBMIT_HIDDEN : 'wfHideSubmit',

	/**
	 * ID attribute prefix for page area
     * @final
	 */
	ID_PAGE_PREFIX	: 'wfPgIndex-',

	/**
	 * ID attribute suffix for prev/next buttons placeholder
     * @final
	 */
	ID_PLACEHOLDER_SUFFIX : '-buttons',

	/**
	 * Attribute indicates index of the page button should activate
     * @final
	 */
	ATTR_INDEX : 'wfPageIndex_activate',

	/**
	 * Custom messages used for creating links
     * @final
	 */
	MESSAGES : {
		CAPTION_NEXT : 'Next Page',
		CAPTION_PREVIOUS : 'Previous Page'
	},

	/**
     * Indicates that form should be validated on Next clicked
     * TODO		Possible refactor functionality with validation
	 */
	runValidationOnPageNext : true,

	/**
	 * custom 'Page Next' event handler (to be overridden) 
     * @param	{HTMLElement}	elem	new page
	 */
	 onPageNext: function() {},
	 
	/**
	 * custom 'Page Previous' event handler (to be overridden) 
     * @param	{HTMLElement}	elem	new page
	 */
	 onPagePrevious: function() {}, 
	 
	 /**
	 * custom 'Page Change' event handler (either next or previous) (to be overridden) 
     * @param	{HTMLElement}	elem	new page
	 */
	 onPageChange: function() {}, 
	   
	/**
	 * Creates new instance of the behavior
     * @param	{HTMLElement}	f	Form element
     * @constructor
	 */
	instance: function(f) {
		this.behavior = wFORMS.behaviors.paging; 
		this.target = f;
		this.currentPageIndex = 1;
	}
}

/**
 * Factory Method.
 * Applies the behavior to the given HTML element by setting the appropriate event handlers.
 * @param {domElement} f An HTML element, either nested inside a FORM element or (preferably) the FORM element itself.
 * @return {object} an instance of the behavior 
 */	
wFORMS.behaviors.paging.applyTo = function(f) {
	var b = new wFORMS.behaviors.paging.instance(f)
	var behavior = wFORMS.behaviors.paging;
	var isValidationAccepted = (wFORMS.behaviors.validation && wFORMS.behaviors.paging.runValidationOnPageNext);
	// Shows that form contains paging
	var isPagingApplied = false;
	
	// Iterates over the elements with specified class names
	f.querySelectorAll(wFORMS.behaviors.paging.SELECTOR).forEach(
		function(elem){			
			isPagingApplied = true;
			// Creates placeholder for buttons
			var ph = b.getOrCreatePlaceHolder(elem);
			var index = wFORMS.behaviors.paging.getPageIndex(elem);
			// If first page add just Next button
			if(index == 1){
				var ctrl = base2.DOM.bind(ph.appendChild(behavior._createNextPageButton(index)));
				
				if(isValidationAccepted){					
					ctrl.addEventListener('click', function(event) {							
							var v = wFORMS.getBehaviorInstance(b.target,'validation'); 
							if(v.run(event, elem)){b.run(event, ctrl);} 
						}, 
						false);					
				}else{
					ctrl.addEventListener('click', function(event) { b.run(event, ctrl); }, false);
				}

				wFORMS.behaviors.paging.showPage(elem);
			}else{
				// Adds previous button
				var ctrl = base2.DOM.bind(behavior._createPreviousPageButton(index));
				ph.insertBefore(ctrl, ph.firstChild);

				ctrl.addEventListener('click', function(event) { b.run(event, ctrl)}, false);

				// If NOT last page adds next button also
				if(!wFORMS.behaviors.paging.isLastPageIndex(index, true)){
					var _ctrl = base2.DOM.bind(ph.appendChild(behavior._createNextPageButton(index)));

					if(isValidationAccepted){						
						_ctrl.addEventListener('click', function(event) {
							var v = wFORMS.getBehaviorInstance(b.target,'validation'); 							 
							if(v.run(event, elem)){b.run(event, _ctrl);} 
						}, false);
					}else{
						_ctrl.addEventListener('click', function(event) { b.run(event, _ctrl); }, false);
					}
				}
			}
		}
	);
	// Looking for the first active page from 0. 0 is a "fake page"
	if(isPagingApplied){		
		p = b.findNextPage(0);
		b.currentPageIndex = 0;
		b.activatePage(wFORMS.behaviors.paging.getPageIndex(p), false); // no scrolling to the top of the page here
		b.onApply();		
	}
	
	// intercept the submit event
	base2.DOM.Element.addEventListener(f, 'submit', function (e) {b.onSubmit(e, b)});
	
	return b;
}

/**
 * Executed once the behavior has been applied to the document.
 * Can be overwritten.
 */
wFORMS.behaviors.paging.instance.prototype.onApply = function() {}

/** On submit advance the page instead, until the last page. */
wFORMS.behaviors.paging.instance.prototype.onSubmit = function (e, b) {
	if (!wFORMS.behaviors.paging.isLastPageIndex(b.currentPageIndex)) {
		var currentPage = wFORMS.behaviors.paging.getPageByIndex(b.currentPageIndex);
		var nextPage = b.findNextPage(b.currentPageIndex);
		
		// validate and advance the page
		var v = wFORMS.getBehaviorInstance(b.target, 'validation');
		if (v.run(e, currentPage)) {
			b.activatePage(b.currentPageIndex + 1);
			
			// focus the first form element in the next page
			var first = base2.DOM.Element.querySelector(nextPage, 'input, textarea, select');
			if (first) {
				first.focus();
			}
		}
		
		e.stopPropagation();
		e.preventDefault();
		e.pagingStopPropagation = true;
	}
}

/**
 * Returns page index by the page area element
 * @param	{HTMLElement}	elem
 * @return	{Integer}	or false
 */
wFORMS.behaviors.paging.getPageIndex = function(elem){
	if(elem && elem.id){
		var index = elem.id.replace(
			new RegExp(wFORMS.behaviors.paging.ID_PAGE_PREFIX + '(\\d+)'), "$1");

		index = parseInt(index);
		return !isNaN(index) ? index : false;

	}

	return false;
}

/**
 * Check if the given element is in the visible page.
 * @param	{DOMElement}	an element (such as a field to be validated)
 * @return	{boolean}
 */
wFORMS.behaviors.paging.isElementVisible = function(element){	
	while(element && element.tagName != 'BODY'){
		if(element.className) {
			if(element.className.indexOf(this.CSS_CURRENT_PAGE) != -1) {
				return true;
			}
			if(element.className.indexOf(this.CSS_PAGE) != -1 ) {
				return false;
			}
		} 
		element = element.parentNode;
	}	
	return true;
}

/**
 * Private method for creating button. Uses public method for design creating
 * @param	{Integer}	index 	Index of the page button belongs to
 * @return	{HTMLElement}
 * @private
 * @see wFORMS.behaviors.paging.createNextPageButton
 */
wFORMS.behaviors.paging._createNextPageButton = function(index){
	var elem = this.createNextPageButton();
	elem.setAttribute(this.ATTR_INDEX, index + 1);
	elem.id = this.ID_BUTTON_NEXT_PREFIX + index;
	return elem;
}

/**
 * Creates button for moving to the next page. This method could be overridden
 * And developed for easily customization for users. Behavior uses private method
 * @return	{HTMLElement}
 * @public
 */
wFORMS.behaviors.paging.createNextPageButton = function(){
	var elem = document.createElement('input'); 
	elem.setAttribute('value', this.MESSAGES.CAPTION_NEXT);
	elem.type = 'button';
	elem.className = this.CSS_BUTTON_NEXT;
	return elem;
}

/**
 * Private method for creating button. Uses public method for design creating
 * @param	{Integer}	index 	Index of the page button belongs to
 * @return	{HTMLElement}
 * @private
 * @see wFORMS.behaviors.paging.createPreviousPageButton
 */
wFORMS.behaviors.paging._createPreviousPageButton = function(index){
	var elem = this.createPreviousPageButton();
	elem.setAttribute(this.ATTR_INDEX, index - 1);
	elem.id = this.ID_BUTTON_PREVIOUS_PREFIX + index;;
	return elem;
}

/**
 * Creates button for moving to the next page. This method could be overridden
 * And developed for easily customization for users. Behavior uses private method
 * @return	{HTMLElement}
 * @public
 */
wFORMS.behaviors.paging.createPreviousPageButton = function(){
	var elem = document.createElement('input'); 
	elem.setAttribute('value', this.MESSAGES.CAPTION_PREVIOUS);
	elem.type = 'button';
	elem.className = this.CSS_BUTTON_PREVIOUS;
	return elem;
}

/**
 * Creates place holder for buttons
 * @param	{HTMLElement}	pageElem	Page where placeholder should be created
 * @return	{HTMLElement}
 */
wFORMS.behaviors.paging.instance.prototype.getOrCreatePlaceHolder = function(pageElem){
	var id = pageElem.id + this.behavior.ID_PLACEHOLDER_SUFFIX;
	var elem = document.getElementById(id);

	if(!elem){
		elem = pageElem.appendChild(document.createElement('div'));
		elem.id = id;
		elem.className = this.behavior.CSS_BUTTON_PLACEHOLDER;
	}	

	return elem;
}

/**
 * Hides page specified
 * @param	{HTMLElement}	e
 */
wFORMS.behaviors.paging.hidePage = function(e){
	if(e) {
		if(!e.removeClass) { // no base2.DOM.bind to speed up function 
			e.removeClass = function(className) { return base2.DOM.HTMLElement.removeClass(this,className) };
		}
		if(!e.addClass) { // no base2.DOM.bind to speed up function 
			e.addClass = function(className) { return base2.DOM.HTMLElement.addClass(this,className) };
		}
		e.removeClass(wFORMS.behaviors.paging.CSS_CURRENT_PAGE);
		e.addClass(wFORMS.behaviors.paging.CSS_PAGE);
	}
}

/**
 * Shows page specified
 * @param	{HTMLElement}	e
 */
wFORMS.behaviors.paging.showPage = function(e){
	if(e) {
		if(!e.removeClass) { // no base2.DOM.bind to speed up function 
			e.removeClass = function(className) { return base2.DOM.HTMLElement.removeClass(this,className) };
		}
		e.removeClass(wFORMS.behaviors.paging.CSS_PAGE);
		if(!e.addClass) { // no base2.DOM.bind to speed up function 
			e.addClass = function(className) { return base2.DOM.HTMLElement.addClass(this,className) };
		}
		e.addClass(wFORMS.behaviors.paging.CSS_CURRENT_PAGE);
	}
}

/**
 * Activates page by index
 * @param	{Integer}	index	
 * @param	{Boolean}	[optional] scroll to the top of the page (default to true)
 */
wFORMS.behaviors.paging.instance.prototype.activatePage = function(index /*, scrollIntoView*/){
	
	if(arguments.length>1) {
		var scrollIntoView = arguments[1];
	} else {
		var scrollIntoView = true;
	}
	
	if(index == this.currentPageIndex){
		return false;
	}
	index = parseInt(index);
	if(index > this.currentPageIndex){
		var p = this.findNextPage(this.currentPageIndex);
	} else {
		var p = this.findPreviousPage(this.currentPageIndex);
	}
	
	if(p) { 
		// Workaround for Safari. Otherwise it crashes with Safari 1.2
		var _self = this;
	//	setTimeout(
		//	function(){
				var index = _self.behavior.getPageIndex(p);
				_self.setupManagedControls(index);
				_self.behavior.hidePage(_self.behavior.getPageByIndex(_self.currentPageIndex));				
				_self.behavior.showPage(p);
				var  _currentPageIndex = _self.currentPageIndex;
				_self.currentPageIndex = index;
				
				// go to top of the page
				if (scrollIntoView) {
					if (p.scrollIntoView) {
						p.scrollIntoView();
					}
					else {
						location.hash = "#" + wFORMS.behaviors.paging.ID_PAGE_PREFIX + index;
					}
				}
				
				// run page change event handlers
				_self.behavior.onPageChange(p);
				if(index > _currentPageIndex){
					_self.behavior.onPageNext(p);
				} else {
					_self.behavior.onPagePrevious(p);
				}
		//	}, 1
		//);
	}
}

/**
 * Setups managed controls: Next/Previous/Send buttons
 * @param	{int}	index	Index of the page to make controls setting up. If null setups current page
 */
wFORMS.behaviors.paging.instance.prototype.setupManagedControls = function(index){
	// new 
	if(!index){
		index = this.currentPageIndex;
	}
	
	// new
	var b = wFORMS.behaviors.paging;
	if(b.isFirstPageIndex(index)){
		if(ctrl = b.getPreviousButton(index)){
			ctrl.style.visibility = 'hidden';
		}
	}else{
		if(ctrl = b.getPreviousButton(index)){
			ctrl.style.visibility = 'visible';
		}
	}

	if(b.isLastPageIndex(index)){
		if(ctrl = b.getNextButton(index)){
			ctrl.style.visibility = 'hidden';
		}
		this.showSubmitButtons();
	} else {
		if(ctrl = b.getNextButton(index)){
			ctrl.style.visibility = 'visible';
		}
		this.hideSubmitButtons();
	}
}

/**
 * Shows all submit buttons
 */
wFORMS.behaviors.paging.instance.prototype.showSubmitButtons = function(){
	var nl = this.target.getElementsByTagName('input');
	for(var i=0;i<nl.length;i++) {
		if(nl[i].type=='submit') {
			nl[i].className = nl[i].className.replace(new RegExp("(^|\\s)" + this.behavior.CSS_SUBMIT_HIDDEN + "(\\s|$)", "g"), "$2");
		}	
	}
}

/**
 * Hides all submit button
 */
wFORMS.behaviors.paging.instance.prototype.hideSubmitButtons = function(){
	var nl = this.target.getElementsByTagName('input');
	for(var i=0;i<nl.length;i++) {
		if(nl[i].type=='submit') {
			if(!(new RegExp("(^|\\s)" + this.behavior.CSS_SUBMIT_HIDDEN + "(\\s|$)")).test(nl[i].className)) {
				nl[i].className+=' '+this.behavior.CSS_SUBMIT_HIDDEN;
			}
		}
	}
}

/**
 * Returns page element specified by index
 * @param	{Integer}	index
 * @return	{HTMLElement}
 */
wFORMS.behaviors.paging.getPageByIndex = function(index){
	var page = document.getElementById(wFORMS.behaviors.paging.ID_PAGE_PREFIX + index);
	return page ? base2.DOM.bind(page) : false;
}

/**
 * Returns next button specified by index
 * @param	{int}	index	Index of the page button related to
 * @return	{HTMLElement}
 */
wFORMS.behaviors.paging.getNextButton = function(index){
	// base2 is not using here because of when control is absen it produces an error in IE
	// for example on last page there is not Next button, on first - Previous
	return document.getElementById(wFORMS.behaviors.paging.ID_BUTTON_NEXT_PREFIX + index);
}

/**
 * Returns previous button specified by index
 * @param	{int}	index	Index of the page button related to
 * @return	{HTMLElement}
 */
wFORMS.behaviors.paging.getPreviousButton = function(index){
	// base2 is not using here because of when control is absen it produces an error in IE
	// for example on last page there is not Next button, on first - Previous
	return document.getElementById(wFORMS.behaviors.paging.ID_BUTTON_PREVIOUS_PREFIX + index);
}

/**
 * Check if index passed is index of the last page
 * @param	{Integer}	index
 * @param	{bool}	ignoreSwitch	Ingoneres switch behavior when checking for last index
 * @return	{bool}
 */
wFORMS.behaviors.paging.isLastPageIndex = function(index, ignoreSwitch){
	index = parseInt(index) + 1;
	var b = wFORMS.behaviors.paging;
	var p = b.getPageByIndex(index);

	if((_b = wFORMS.behaviors['switch']) && !ignoreSwitch){
		while(p && _b.isSwitchedOff(p)){
			index++;
			p = b.getPageByIndex(index);
		}
	}

	return p ? false : true;
}

/**
 * Check if index passed is index of the first page
 * @param	{Integer}	index
 * @param	{bool}	ignoreSwitch	Ingoneres switch behavior when checking for first index
 * @return	{bool}
 */
wFORMS.behaviors.paging.isFirstPageIndex = function(index, ignoreSwitch){
	index = parseInt(index) - 1;
	var b = wFORMS.behaviors.paging;
	var p = b.getPageByIndex(index);
	if((_b = wFORMS.behaviors['switch']) && !ignoreSwitch){
		while(p && _b.isSwitchedOff(p)){
			index--;
			p = b.getPageByIndex(index);
		}
	}

	return p ? false : true;
}

/**
 * Returns Next page from the index. Takes in attention switch behavior
 * @param	{int}	index
 */
wFORMS.behaviors.paging.instance.prototype.findNextPage = function(index){
	index = parseInt(index) + 1;
	var b = wFORMS.behaviors.paging;
	var p = b.getPageByIndex(index);

	if(_b = wFORMS.behaviors['switch']){
		while(p && _b.isSwitchedOff(p)){
			index++;
			p = b.getPageByIndex(index);
		}
	}
	return p;
}

/**
 * Returns Next page from the index. Takes in attention switch behavior
 * @param	{int}	index
 */
wFORMS.behaviors.paging.instance.prototype.findPreviousPage = function(index){
	index = parseInt(index) - 1;
	var b = wFORMS.behaviors.paging;
	var p = b.getPageByIndex(index);

	if(_b = wFORMS.behaviors['switch']){
		while(p && _b.isSwitchedOff(p)){
			index--;
			p = b.getPageByIndex(index);
		}
	}

	return p ? p : false;
}





/**
 * Executes the behavior
 * @param {event} e 
 * @param {domElement} element
 */
wFORMS.behaviors.paging.instance.prototype.run = function(e, element){
	this.activatePage(element.getAttribute(wFORMS.behaviors.paging.ATTR_INDEX));
}

if (typeof(wFORMS) == "undefined") {
	throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
/**
 * wForms repeat behavior. 
 * See: http://www.formassembly.com/wForms/v2.0/documentation/examples/repeat.html
 */
wFORMS.behaviors.repeat = {

	/**
	 * Selector expression for catching repeat elements
     * @final
     * @see	http://www.w3.org/TR/css3-selectors/
	 */
	SELECTOR_REPEAT : '*[class~="repeat"]',

	/**
	 * Selector expression for catching removable section
     * @final
     * @see	http://www.w3.org/TR/css3-selectors/
	 */
	SELECTOR_REMOVEABLE : '*[class~="removeable"]',

	/**
	 * Suffix for the ID of 'repeat' link
     * @final
	 */
	ID_SUFFIX_DUPLICATE_LINK : '-wfDL',

	/**
	 * Suffix for the ID of the repeat counter hidden element
     * @final
	 */
	ID_SUFFIX_COUNTER : '-RC',

	/**
	 * CSS class for duplicate span/link
     * @final
	 */
	CSS_DUPLICATE_LINK : 'duplicateLink',
	CSS_DUPLICATE_SPAN : 'duplicateSpan',
	/**
	 * CSS class for delete link
     * @final
	 */
	CSS_DELETE_LINK : 'removeLink',
	CSS_DELETE_SPAN : 'removeSpan',
	/**
	 * CSS class for field group that could be removed
     * @final
	 */
	CSS_REMOVEABLE : 'removeable',

	/**
	 * CSS class for field group that could be repeat
     * @final
	 */
	CSS_REPEATABLE : 'repeat',

	/**
	 * Attribute specifies that current group is duplicate
     * @final
	 */
	ATTR_DUPLICATE : 'wfr__dup',

	/**
	 * Attribute specifies that current group is duplicate
     * @final
	 */
	ATTR_DUPLICATE_ELEM : 'wfr__dup_elem',


    /**
     * Means that element has been already handled by repeat behavior
     */
	ATTR_HANDLED : 'wfr_handled',

	/**
	 * Attribute specifies ID of the master section on its dublicate
     * @final
	 */
	ATTR_MASTER_SECTION : 'wfr__master_sec',

	/**
	 * Special attribute name that is set to Remove link with section ID
     * should be deleted when link is clicked
     * @final
	 */
	ATTR_LINK_SECTION_ID : 'wfr_sec_id',

	/**
	 * Messages collection used for creating links
     * @final
	 */
	MESSAGES : {
		ADD_CAPTION : "Add another response",
		ADD_TITLE : "Will duplicate this question or section.",

		REMOVE_CAPTION : "Remove",
		REMOVE_TITLE : "Will remove this question or section"
	},

	/**
	 * Array of the attribute names that shoud be updated in the duplicated tree
	 */
	UPDATEABLE_ATTR_ARRAY : [
		'id',
		'name',
		'for'
	],

	/**
	 * Allows to leave names of the radio buttons the same (behavior-wide setting)
	 */
	preserveRadioName : false,
	
	/**
	 * Allows to leave names of the radio buttons the same (field-level setting)
	 * This class attribute can be set on a repeated element to override the
	 * behavior's preserveRadioName setting.
	 */
	CSS_PRESERVE_RADIO_NAME: "preserveRadioName",
	
	/**
	 * Custom function that could be overridden. 
	 * Evaluates after section is duplicated
     * @param	{HTMLElement}	elem	Duplicated section
	 */
	onRepeat : function(elem){},

	/**
	 * Custom function that could be overridden. 
	 * Evaluates after the section is removed
	 * @param	{HTMLElement}	elem	a copy of the removed section - detached from the document
	 */
	onRemove : function(elem){},

	/**
	 * Custom function that could be overridden. 
	 * Returns if section could be repeated
     * @param	{HTMLElement}	elem	Section to be duplicated
     * @param	{wFORMS.behaviors.repeat}	b	Behavior mapped to repeatable section 
     * @return	boolean
	 */
	allowRepeat : function(elem, b){
		return true;
	},

	/**
	 * Creates new instance of the behavior
     * @param	{HTMLElement}	f	Form element
     * @constructor
	 */
	instance : function(f) {
		this.behavior = wFORMS.behaviors.repeat; 
		this.target = f;		
	}
}

/*
 * Temporary shortcuts
 */
var _b = wFORMS.behaviors.repeat;
var _i = wFORMS.behaviors.repeat.instance;

/**
 * Factory Method.
 * Applies the behavior to the given HTML element by setting the appropriate event handlers.
 * @param {domElement} f An HTML element, either nested inside a FORM element or (preferably) the FORM element itself.
 * @return {object} an instance of the behavior 
 */	
_b.applyTo = function(f) {
	// look up for the all elements that could be repeated.
	// Trying to add event listeners to elements for adding new container.
	// If need create Add new section element
	var _self = this;
	var b = new Array();
	
	if(!f.querySelectorAll) base2.DOM.bind(f);
	
	f.querySelectorAll(this.SELECTOR_REPEAT).forEach(
		function(elem){
			if(_self.isHandled(elem)){
				return ;
			}
			if(!elem.id) elem.id = wFORMS.helpers.randomId();
			
			var _b = new _self.instance(elem);
			var e = _b.getOrCreateRepeatLink(elem);
			e.addEventListener('click', function(event) { _b.run(event, e)}, false);
			_b.setElementHandled(elem);
			b.push(_b);							
		}
	);
	
	if(!f.hasClass) {
		f = base2.DOM.bind(f);	
	}
	
	if(f.hasClass(this.CSS_REMOVEABLE)){
		var m  = this.getMasterSection(f);		
		var _i = wFORMS.getBehaviorInstance(m, 'repeat');
		if(_i) {
			_i.getOrCreateRemoveLink(f);
		} else if(b[0]){
			b[0].getOrCreateRemoveLink(f);
		}
	}
	
	f.querySelectorAll(this.SELECTOR_REMOVEABLE).forEach(function(e){
		var m  = wFORMS.behaviors.repeat.getMasterSection(e);
		var _i = wFORMS.getBehaviorInstance(m, 'repeat');
		if(_i) {
			_i.getOrCreateRemoveLink(e);
		} else if(b[0]){
			b[0].getOrCreateRemoveLink(e);
		}
	});
	
	for(var i=0;i<b.length;i++) {
		b[i].onApply();
	}
	return b;
}

/**
 * Executed once the behavior has been applied to the document.
 * Can be overwritten.
 */
_i.prototype.onApply = function() {} 


/**
 * Returns repeat link for specified area if it exists, 
 * otherwise creates new one and returns it
 * @param	{HTMLElement}	elem	Element repeat link is related to
 * @return	{HTMLElement}
 */
_i.prototype.getOrCreateRepeatLink = function(elem){
	var id = elem.id + this.behavior.ID_SUFFIX_DUPLICATE_LINK;
	var e = document.getElementById(id);
	if(!e || e == ''){
		e = this.createRepeatLink(id);
		
		// Wraps in a span for better CSS positionning control.
		var spanElem = document.createElement('span');
		spanElem.className = this.behavior.CSS_DUPLICATE_SPAN;
		e = spanElem.appendChild(e);
		
		if(elem.tagName.toUpperCase() == 'TR'){
			var tdElem = elem.getElementsByTagName('TD');
			if(!tdElem){
				tdElem = elem.appendChild(document.createElement('TD'));
			} else {
				tdElem = tdElem[tdElem.length-1]; 
			}
			tdElem.appendChild(spanElem);
		}else{
			elem.appendChild(spanElem)
		}
	}

	return base2.DOM.bind(e);
}

/**
 * Returns repeat link for specified area if it exists, 
 * otherwise creates new one and returns it
 * @param	{DOMString}	id	ID of the group
 * @return	{HTMLElement}
 */
_i.prototype.createRepeatLink = function(id){
	// Creates repeat link element
	var linkElem = document.createElement("A");
				
	linkElem.id = id;
	linkElem.setAttribute('href', '#');	
	linkElem.className = this.behavior.CSS_DUPLICATE_LINK;
	linkElem.setAttribute('title', this.behavior.MESSAGES.ADD_TITLE);	

	// Appends text inside the <span element (for CSS replacement purposes) to <a element
	linkElem.appendChild(document.createElement('span').appendChild(
		document.createTextNode(this.behavior.MESSAGES.ADD_CAPTION)));

	return linkElem;
}

/*
 * Add remove link to duplicated section
 * @param 	{DOMElement}	duplicated section.
 */ 	
_i.prototype.getOrCreateRemoveLink= function(elem){
	var e  = this.createRemoveLink(elem.id);
	// looking for the place where to paste link
	if(elem.tagName == 'TR'){
		var tds = elem.getElementsByTagName('TD');
		var tdElem = tds[tds.length-1];
		tdElem.appendChild(e);
	} else {
		elem.appendChild(e)
	}
}

/**
 * Returns remove link for specified area 
 * @param	{DOMString}	id	ID of the field group
 * @return	{HTMLElement}
 */
_i.prototype.createRemoveLink = function(id){
	// Creates repeat link element
	var linkElem = document.createElement("a");
	
	linkElem.id = id + this.behavior.ID_SUFFIX_DUPLICATE_LINK;
	linkElem.setAttribute('href', '#');	
	linkElem.className = this.behavior.CSS_DELETE_LINK;
	linkElem.setAttribute('title', this.behavior.MESSAGES.REMOVE_TITLE);	
	linkElem.setAttribute(this.behavior.ATTR_LINK_SECTION_ID, id);

	// Appends text inside the <span element (for CSS image replacement) to <a element
	var spanElem = document.createElement('span');
	spanElem.appendChild(document.createTextNode(this.behavior.MESSAGES.REMOVE_CAPTION));
	linkElem.appendChild(spanElem);

	var _self = this;
	linkElem.onclick = function(event) { _self.onRemoveLinkClick(event, linkElem); };	

	// Wraps in a span for better CSS positionning control.
	var spanElem = document.createElement('span');
	spanElem.className = this.behavior.CSS_DELETE_SPAN;
	spanElem.appendChild(linkElem);
	
	return spanElem;
}


/**
 * Duplicates repeat section. Changes ID of the elements, adds event listeners
 * @param	{HTMLElement}	elem	Element to duplicate
 */
_i.prototype.duplicateSection = function(elem){
	// Call custom function. By default return true
	if(!this.behavior.allowRepeat(elem, this)){
		return false;
	}
	this.updateMasterSection(elem);
	// Creates clone of the group
	var newElem = elem.cloneNode(true);	
	// Update the ids, names and other attributes that must be changed.
	// (do it before inserting the element back in the DOM to prevent reseting radio buttons, see bug #152)
	var index  = this.getNextDuplicateIndex(this.target);
	var suffix = this.createSuffix(elem, index);

	this.updateDuplicatedSection(newElem, index, suffix);
	// Insert in DOM		
	newElem = elem.parentNode.insertBefore(newElem, this.getInsertNode(elem));
	wFORMS.applyBehaviors(newElem);
		
	// Associates repeated input sections with thier calculations.
	if(wFORMS.behaviors.calculation)
	{
	_c = wFORMS.behaviors.calculation;
	inputItem = newElem.querySelector('input');
		if(inputItem)
		{
		if(inputItem.className.search(_c.VARIABLE_SELECTOR_PREFIX) != -1) 
			_c.applyTo(inputItem.form);
		}
	}
	// Calls custom function
	this.behavior.onRepeat(newElem);
	
	wFORMS.helpers.spotlight(newElem);
}

/**
 * Removes section specified by id
 * @param	{DOMElement}	element to remove
 */
_i.prototype.removeSection = function(elem){
	if(elem){
		// Removes section
		var elem = elem.parentNode.removeChild(elem);
		// Calls custom function
		this.behavior.onRemove(elem);
	}
}
/**
 * Looking for the place where to insert the cloned element
 * @param 	{DOMElement} 	source element
 * @return 	{DOMElement} 	target element for 'insertBefore' call.
 */
_i.prototype.getInsertNode = function(elem) {
 	var insertNode = elem.nextSibling;
 	
 	if(insertNode && insertNode.nodeType==1 && !insertNode.hasClass) {
		insertNode = base2.DOM.bind(insertNode); 
	}
  	
	while(insertNode && 
		 (insertNode.nodeType==3 ||       // skip text-node that can be generated server-side when populating a previously repeated group 
		  insertNode.hasClass(this.behavior.CSS_REMOVEABLE))) {						
		
		insertNode = insertNode.nextSibling;
		
		if(insertNode && insertNode.nodeType==1 && !insertNode.hasClass) {
			insertNode = base2.DOM.bind(insertNode);
		}
	}
	return insertNode;
}
/**
 * Evaluates when user clicks Remove link
 * @param	{DOMEvent}		Event	catched
 * @param	{HTMLElement}	elem	Element produced event
 */
_i.prototype.onRemoveLinkClick = function(event, link){
	var e  = document.getElementById(link.getAttribute(this.behavior.ATTR_LINK_SECTION_ID));
	this.removeSection(e);
	if(event) event.preventDefault();
}

/**
 * Updates attributes inside the master element
  * @param	{HTMLElement}	elem
 */
_i.prototype.updateMasterSection = function(elem){
	// do it once 
	if(elem.doItOnce==true)
		return true;
	else
		elem.doItOnce=true;

	var suffix = this.createSuffix(elem);
	elem.id = this.clearSuffix(elem.id) + suffix;
	
	this.updateMasterElements(elem, suffix);
}
_i.prototype.updateMasterElements  = function(elem, suffix){
	
	if(!elem || elem.nodeType!=1) 
		return;
	
	var cn = elem.childNodes;
	for(var i=0;i<cn.length;i++) {
		var n = cn[i];
		if(n.nodeType!=1) continue;
		
		if(!n.hasClass) { // no base2.DOM.bind to speed up function 
			n.hasClass = function(className) { return base2.DOM.HTMLElement.hasClass(this,className) };
		}
		
		// suffix may change for this node and child nodes, but not sibling nodes, so keep a copy
		var siblingSuffix = suffix;
		if(n.hasClass(this.behavior.CSS_REPEATABLE)) {
			suffix += "[0]";
		}
		if(!n.hasClass(this.behavior.CSS_REMOVEABLE)){
			// Iterates over updateable attribute names
			for(var j = 0; j < this.behavior.UPDATEABLE_ATTR_ARRAY.length; j++){
				var attrName = this.behavior.UPDATEABLE_ATTR_ARRAY[j];
				var value = this.clearSuffix(n.getAttribute(attrName));
				if(!value){
					continue;
				}				
				if(attrName=='id' && wFORMS.behaviors.hint && wFORMS.behaviors.hint.isHintId(n.id)){
					n.id = value.replace(new RegExp("(.*)(" + wFORMS.behaviors.hint.HINT_SUFFIX + ')$'),"$1" + suffix + "$2");
				} else if(attrName=='id' && wFORMS.behaviors.validation && wFORMS.behaviors.validation.isErrorPlaceholderId(n.id)){
					n.id = value.replace(new RegExp("(.*)(" + wFORMS.behaviors.validation.ERROR_PLACEHOLDER_SUFFIX + ')$'),"$1" + suffix + "$2"); 
				} else if(attrName=='id' && n.id.indexOf(this.behavior.ID_SUFFIX_DUPLICATE_LINK) != -1){
					n.id = value.replace(new RegExp("(.*)(" + this.behavior.ID_SUFFIX_DUPLICATE_LINK + ')$'), "$1" + suffix + "$2");
				} else if(attrName=='id'){ 
					n.id = value + suffix;		// do not use setAttribute for the id property (doesn't work in IE6)	
				} else if(attrName=='name'){ 
					n.name = value + suffix;	// do not use setAttribute for the name property (doesn't work in IE6)	
				} else {
					n.setAttribute(attrName, value + suffix);	
				}
			}			
			this.updateMasterElements(n, suffix);
		}
		// restore suffix for siblings if needed.
		suffix = siblingSuffix;
	}
}

/**
 * Updates attributes inside the duplicated tree
 * TODO rename
 * @param	{HTMLElement}	dupliocated element (not yet inserted back in DOM)
 * @param	{integer}		row index
 * @param	{string}		array-like notation, to be appended to attributes that must be unique.
 */
_i.prototype.updateDuplicatedSection = function(elem, index, suffix){
	
	// Caches master section ID in the dublicate
	elem[this.behavior.ATTR_MASTER_SECTION]=elem.id;
		
	// Updates element ID (possible problems when repeat element is Hint or switch etc)
	elem.id = this.clearSuffix(elem.id) + suffix;
	// Updates classname	
	elem.className = elem.className.replace(this.behavior.CSS_REPEATABLE, this.behavior.CSS_REMOVEABLE);

	if(!elem.hasClass) { // no base2.DOM.bind to speed up function 
		elem.hasClass = function(className) { return base2.DOM.HTMLElement.hasClass(this,className) };
	}
	// Check for preserverRadioName override
	if(elem.hasClass(this.behavior.CSS_PRESERVE_RADIO_NAME)) 
		var _preserveRadioName = true;
	else
		var _preserveRadioName = this.behavior.preserveRadioName;
	
	this.updateSectionChildNodes(elem, suffix, _preserveRadioName);
}


/**
 * Updates NodeList. Changes ID and names attributes
 * For different node elements suffixes could be different - i.e. for the nested
 * repeat section IDs and names should store parent section number
 * @param	elems	Array of the elements should be updated
 * @param	suffix	Suffix value should be added to attributes
 */
_i.prototype.updateSectionChildNodes = function(elem, suffix, preserveRadioName){
	
	var removeStack = new Array();
	var i = 0;
	
	while(elem && elem.childNodes && elem.childNodes[i]) {
	
		var e = elem.childNodes[i];
		i++;
		
		if(e.nodeType!=1) {
			// skip text nodes 
			continue;
		}
		if(!e.hasClass) { // no base2.DOM.bind to speed up function 
			e.hasClass = function(className) { return base2.DOM.HTMLElement.hasClass(this,className) };
		}
		// Removes created descendant duplicated group if any
		if(this.behavior.isDuplicate(e)){
			removeStack.push(e);
			continue;
		}
		// Removes duplicate link
		if(e.hasClass(this.behavior.CSS_DUPLICATE_SPAN)){
			removeStack.push(e);
			continue;
		}
		if(e.hasClass(this.behavior.CSS_DUPLICATE_LINK)){
			removeStack.push(e);
			continue;
		}
				
		// Clears value	(TODO: select?)
		if(e.tagName == 'INPUT' || e.tagName == 'TEXTAREA'){
			if(e.type != 'radio' && e.type != 'checkbox'){
				e.value = '';
			} else {
				e.checked = false;
			}
		}
		
		// Fix #152 - Radio name with IE6+
		if(e.tagName == 'INPUT' && e.type == 'radio' && document.all && !window.opera && !preserveRadioName) {
			// Create a radio input that works in IE and insert it before the input it needs to replace
			var tagHtml = "<INPUT type=\"radio\" name=\""+e.name+suffix+"\"></INPUT>";
			var fixedRadio = e.parentNode.insertBefore(document.createElement(tagHtml),e);
			/*
			var fixedRadio = e.parentNode.insertBefore(document.createElement("SPAN"),e);
			fixedRadio.innerHTML = tagHtml;
			fixedRadio = fixedRadio.firstChild;
			*/			
			// Clone other attributes
			fixedRadio.id = e.id;
			fixedRadio.className = e.className;		
			
			// Remove original radio (keep element in memory)
			e = e.parentNode.removeChild(e);			
							
			var l = this.behavior.UPDATEABLE_ATTR_ARRAY.length;
						
			for (var j = 0; j < l; j++) {			
				var attrName = this.behavior.UPDATEABLE_ATTR_ARRAY[j];
				var value = e.getAttribute(attrName);
				fixedRadio.setAttribute(attrName, value);	
			}			
			// We can now continue with the fixed radio element				
			e = fixedRadio;				
			if(!e.hasClass) { // no base2.DOM.bind to speed up function 
				e.hasClass = function(className) { return base2.DOM.HTMLElement.hasClass(this,className) };
			}								
		} 
		
		this.updateAttributes(e, suffix, preserveRadioName);
		
		if(e.hasClass(this.behavior.CSS_REPEATABLE)){
			this.updateSectionChildNodes(e, this.createSuffix(e), preserveRadioName);
		} else{
			this.updateSectionChildNodes(e, suffix, preserveRadioName);
		}
   	}   
	 
   	for(var i=0;i<removeStack.length;i++){
   		var e = removeStack[i];
   		if(e.clearAttributes) {
			// detach all event handler 
			e.clearAttributes(false); 	
		}
   		if(e.parentNode) e.parentNode.removeChild(e);
   	}
   
}

/**
 * Creates suffix that should be used inside duplicated repeat section
 * @param	domelement	Repeat section element
 * @param	integer		row index	
 */
_i.prototype.createSuffix = function(e, index){

	// var idx = e.getAttribute('dindex');
	var suffix = '[' + (index ? index : '0' ) + ']';
    var reg = /\[(\d+)\]$/;
	e = e.parentNode;
	while(e){
		if(!e.hasClass) { // no base2.DOM.bind to speed up function 
			e.hasClass = function(className) { return base2.DOM.HTMLElement.hasClass(this,className) };
		}
		if(e.hasClass(this.behavior.CSS_REPEATABLE) || e.hasClass(this.behavior.CSS_REMOVEABLE)){
			var idx = reg.exec(e.id);
			if(idx) idx = idx[1];
			//var idx = e.getAttribute('dindex');
			suffix = '[' + (idx ? idx : '0' ) + ']' + suffix;
		}
		e = e.parentNode;
	}
	return suffix;
}

/**
 * Removes suffix from ID id was previously set
 * @param	id	Current element id
 * @return	DOMString
 */
_i.prototype.clearSuffix = function(value){
	if(!value){
		return;
	}
    value = value.replace(/(\[\d+\])+(\-H)?$/,"");    
	return value;
}

/**
 * Updates attributes of the element in the section
 * TODO rename
 * @param	{HTMLElement}	elem
 */
_i.prototype.updateAttributes = function(e, idSuffix, preserveRadioName){
	var isHint = wFORMS.behaviors.hint && wFORMS.behaviors.hint.isHintId(e.id);
	var isErrorPlaceholder = wFORMS.behaviors.validation && wFORMS.behaviors.validation.isErrorPlaceholderId(e.id);
	var isDuplicateLink = e.id.indexOf(this.behavior.ID_SUFFIX_DUPLICATE_LINK) != -1;

	// Sets that element belongs to duplicate group
	this.setInDuplicateGroup(e);

	if(this.behavior.isHandled(e)){
		this.removeHandled(e)
	}

	if(wFORMS.behaviors['switch'] && wFORMS.behaviors['switch'].isHandled(e)){
		wFORMS.behaviors['switch'].removeHandle(e);
	}

	// Iterates over updateable attribute names
	var l = this.behavior.UPDATEABLE_ATTR_ARRAY.length;
	for(var i = 0; i < l; i++){
		var attrName = this.behavior.UPDATEABLE_ATTR_ARRAY[i];
		
		var value = this.clearSuffix(e.getAttribute(attrName));	
		if(!value){
			continue;
		}

		if(attrName == 'name' && e.tagName == 'INPUT' && preserveRadioName){
			continue;
		} else if(isErrorPlaceholder && attrName=='id'){	
			e.id = value + idSuffix + wFORMS.behaviors.validation.ERROR_PLACEHOLDER_SUFFIX;
		} else if(isHint && attrName=='id'){			
			e.id = value + idSuffix + wFORMS.behaviors.hint.HINT_SUFFIX;
		} else if(isDuplicateLink && attrName=='id'){
			e.id = value.replace(new RegExp("(.*)(" + this.behavior.ID_SUFFIX_DUPLICATE_LINK + ')$'),"$1" + idSuffix + "$2");
		} else if(attrName=='id'){ 
			e.id = value + idSuffix;	// do not use setAttribute for the id property (doesn't work in IE6)	
		} else if(attrName=='name'){ 
			e.name = value + idSuffix;	// do not use setAttribute for the id property (doesn't work in IE6)	
		} else {
			e.setAttribute(attrName, value + idSuffix);	
		}
	}
}

/**
 * Returns index of the next created duplicate by section HTML element
 * @param	{HTMLElement}	elem
 * @return	{Integer}
 */
_i.prototype.getNextDuplicateIndex = function(elem){
	var c = this.getOrCreateCounterField(elem);
	var newValue = parseInt(c.value) + 1;
	c.value = newValue;
	return newValue;
}


/**
 * Returns counter field fo specified area if exists. Otherwise creates new one
 * @param	{HTMLElement}	elem
 * @return	{HTMLElement}
 */
_i.prototype.getOrCreateCounterField = function(elem){
		
	var cId = elem.id + this.behavior.ID_SUFFIX_COUNTER;
	
	// Using getElementById except matchSingle because of lib bug
	// when element is not exists exception is thrown
	var cElem = document.getElementById(cId);
	if(!cElem || cElem == ''){
		cElem = this.createCounterField(cId);
		// Trying to find form element
		var formElem = elem.parentNode;
		while(formElem && formElem.tagName.toUpperCase() != 'FORM'){
			formElem = formElem.parentNode;
		}

		formElem.appendChild(cElem);
	}
	return cElem;
}

/**
 * Creates counter field with specified ID
 * @param	{DOMString}	id
 * @return	{HTMLElement}
 */
_i.prototype.createCounterField = function(id){
	cElem = document.createElement('input');
	cElem.id = id;
	cElem.setAttribute('type', 'hidden');
	cElem.setAttribute('name', id);
	cElem.value = '0';
	return cElem;
}

/**
 * Returns count of already duplicated sections. If was called from the behavior 
 * belonged to duplicated section, returns false
 * @public
 * @return	{Integer} or {boolean}
 */
_i.prototype.getSectionsCount = function(){
	if(this.behavior.isDuplicate(this.target)){
		return false;
	}
	return parseInt(this.getOrCreateCounterField(this.target).value) + 1;
}

/**
 * Specifies that element is inside the duplicate group
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
_i.prototype.setInDuplicateGroup = function(elem){
	return elem.setAttribute(this.behavior.ATTR_DUPLICATE_ELEM, true);
}


/**
 * setElementHandled
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
_i.prototype.setElementHandled = function(elem){
	return elem.setAttribute(this.behavior.ATTR_HANDLED, true);
}

/**
 * Remove handled attribute from element
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
_i.prototype.removeHandled = function(elem){
	return elem.removeAttribute(this.behavior.ATTR_HANDLED);
}

/**
 * Returns true if element is duplicate of initial group, false otherwise
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
_b.isDuplicate = function(elem){
	return elem.hasClass(this.CSS_REMOVEABLE);
}


/**
 * Returns true if element belongs to duplicate group
 * (to be used by other behaviors) 
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
_b.isInDuplicateGroup = function(elem){
	return elem.getAttribute(this.ATTR_DUPLICATE_ELEM) ? true : false;
}


/**
 * Checks if element is already handled
 * @param	{HTMLElement}	elem
 * @return	boolean
 */
_b.isHandled = function(elem){
	return elem.getAttribute(this.ATTR_HANDLED);
}


/**
 * Returns html element of the master section (repeatable) from its duplicate
 * @param	{HTMLElement}	elem
 * @return	{HTMLElement} or false
 */
_b.getMasterSection = function(elem){
	if(!this.isDuplicate(elem)) return false;	
	return document.getElementById(elem[this.ATTR_MASTER_SECTION]);
}


/**
 * Executes the behavior
 * @param {event} e 
 */
_i.prototype.run = function(e){ 	
	this.duplicateSection(this.target);
	if(e) e.preventDefault();
}

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
				if(!radioGroup) {
					// repeated radio groups don't show up in the collection in IE6+
					radioGroup = [];
					var c = elem.form.getElementsByTagName('INPUT');
					for(var k=0;k<c.length;k++) {
						if(c[k].type=='radio' && c[k].name==elem.name) {
							radioGroup.push(c[k]);
						}
					}
				}
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
					if(!radioGroup) {
						// repeated radio groups don't show up in the collection in IE6+
						var radioGroup = [];
						var c = elem.form.getElementsByTagName('INPUT');
						for(var k=0;k<c.length;k++) {
							if(c[k].type=='radio' && c[k].name==elem.name) {
								radioGroup.push(c[k]);
							}
						}
					}
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
	var _ran = []; 
	for(var i in this.cache) {	
		for(var j=0; j< this.cache[i].triggers.length; j++) {
			var elem = this.cache[i].triggers[j];
			// an element can have several triggers (ie. select tag), so make sure we run it only once.
			if(!wFORMS.helpers.contains(_ran,elem)) {
				// Switch link state is set with the class 'swtchIsOn'/'swtchIsOff' 
				if(elem.tagName!='A' || elem.hasClass(this.behavior.CSS_ONSTATE_FLAG)) {
					_ran.push(elem);
					this.run(null, elem)
				}			
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
		isCustom		: "Please enter a valid value.",
		notification	: "%% error(s) detected. Your form has not been submitted yet.\nPlease check the information you provided."  // %% will be replaced by the actual number of errors.
	},
	
	
	instance: function(f) {
		this.behavior = wFORMS.behaviors.validation; 
		this.target = f;
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
			if(!f[i].addEventListener) base2.DOM.bind(f[i]);		
			f[i].addEventListener('submit', function(e){ return _v.run(e, this)} ,false);
			v.push(_v);	
			_v.onApply();
		}
	} else {
		var v = new wFORMS.behaviors.validation.instance(f);
		if(!f.addEventListener) base2.DOM.bind(f);
		f.addEventListener('submit', function(e){ return v.run(e, this)} ,false);	
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
 * @param {event} e 
 * @param {domElement} element
 * @return	{boolean}	true if validation successful, false otherwise (and prevents event propagation)
 */
wFORMS.behaviors.validation.instance.prototype.run = function(e, element) {
	
	// hack to stop to event propagation under paging
	if (e.pagingStopPropagation) {
		return false;
	}

 	var errorCount = 0;
 	this.elementsInError = {};
 	for (var ruleName in this.behavior.rules) {
 		var rule = this.behavior.rules[ruleName];
   		var _self = this;
		
		if(!element.querySelectorAll)
			base2.DOM.bind(element);
		
 		element.querySelectorAll(rule.selector).forEach(function(element) { 
									
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
 		});
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
		
	    var rgx = new RegExp("([^a-z])("+v.name+")([^a-z])","gi");
	    while((' '+formula+' ').match(rgx)) {
	    if(String(varval).search(/^[\d\.,]*$/) != -1)
			formula = (' '+formula+' ').replace(rgx, "$1"+varval+"$3");
		else
			formula = (' '+formula+' ').replace(rgx, "$1'"+varval+"'$3");
	    }	      
	} 
	  
	try {
		var result = eval(formula);
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