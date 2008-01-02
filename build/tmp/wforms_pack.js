var base2={name:"base2",version:"1.0 (beta 2)",exports:"Base,Package,Abstract,Module,Enumerable,Map,Collection,RegGrp,"+"assert,assertArity,assertType,assignID,copy,detect,extend,"+"forEach,format,global,instanceOf,match,rescape,slice,trim,typeOf,"+"I,K,Undefined,Null,True,False,bind,delegate,flip,not,unbind",global:this,detect:new function(_){
var _2=_;
var _3=NaN;
var _4=_.java?true:false;
if(_.navigator){
var _5=document.createElement("span");
var _6=navigator.platform+" "+navigator.userAgent.replace(/([a-z])[\s\/](\d)/gi,"$1$2");
if(!_3){
_6=_6.replace(/MSIE[\d.]+/,"");
}
_4&=navigator.javaEnabled();
}
return function(a){
var r=false;
var b=a.charAt(0)=="!";
if(b){
a=a.slice(1);
}
if(a.charAt(0)=="("){
try{
eval("r=!!"+a);
}
catch(error){
}
}else{
r=new RegExp("("+a+")","i").test(_6);
}
return !!(b^r);
};
}(this)};
new function(_){
var _0="function base(o,a){return o.base.apply(o,a)};";
eval(_0);
var _c=base2.detect;
var _d=K(),Null=K(null),True=K(true),False=K(false);
var _1=/%([1-9])/g;
var _2=/^\s\s*/;
var _3=/\s\s*$/;
var _4=/([\/()[\]{}|*+-.,^$?\\])/g;
var _5=/eval/.test(_c)?/\bbase\s*\(/:/.*/;
var _6=["constructor","toString","valueOf"];
var _7=_c("(jscript)")?new RegExp("^"+rescape(isNaN).replace(/isNaN/,"\\w+")+"$"):{test:False};
var _8=1;
var _9=Array.prototype.slice;
var _17=Array.slice||function(a){
return _9.apply(a,_9.call(arguments,1));
};
_10();
var _11=function(a,b){
base2.__prototyping=this.prototype;
var c=new this;
extend(c,a);
delete base2.__prototyping;
var d=c.constructor;
function _12(){
if(!base2.__prototyping){
if(this.constructor==arguments.callee||this.__constructing){
this.__constructing=true;
d.apply(this,arguments);
delete this.__constructing;
}else{
return extend(arguments[0],c);
}
}
return this;
}
c.constructor=_12;
for(var i in Base){
_12[i]=this[i];
}
_12.toString=K(String(d));
_12.ancestor=this;
_12.base=_d;
_12.init=_d;
extend(_12,b);
_12.prototype=c;
_12.init();
return _12;
};
var _1f=_11.call(Object,{constructor:function(){
if(arguments.length>0){
this.extend(arguments[0]);
}
},base:function(){
},extend:delegate(extend)},_1f={ancestorOf:delegate(_13),extend:_11,forEach:delegate(_10),implement:function(a){
if(typeof a=="function"){
if(_13(_1f,a)){
a(this.prototype);
}
}else{
extend(this.prototype,a);
}
return this;
}});
var _21=_1f.extend({constructor:function(d,e){
this.extend(e);
if(this.init){
this.init();
}
if(this.name!="base2"){
if(!this.parent){
this.parent=base2;
}
this.parent.addName(this.name,this);
this.namespace=format("var %1=%2;",this.name,String(this).slice(1,-1));
}
var f=/[^\s,]+/g;
if(d){
d.imports=Array2.reduce(this.imports.match(f),function(a,b){
eval("var ns=base2."+b);
assert(ns,format("Package not found: '%1'.",b),ReferenceError);
return a+=ns.namespace;
},_0+base2.namespace+JavaScript.namespace);
d.exports=Array2.reduce(this.exports.match(f),function(a,b){
var c=this.name+"."+b;
this.namespace+="var "+b+"="+c+";";
return a+="if(!"+c+")"+c+"="+b+";";
},"",this);
}
},exports:"",imports:"",name:"",namespace:"",parent:null,addName:function(a,b){
if(!this[a]){
this[a]=b;
this.exports+=","+a;
this.namespace+=format("var %1=%2.%1;",a,this.name);
}
},addPackage:function(a){
this.addName(a,new _21(null,{name:a,parent:this}));
},toString:function(){
return format("[%1]",this.parent?String(this.parent).slice(1,-1)+"."+this.name:this.name);
}});
var _2d=_1f.extend({constructor:function(){
throw new TypeError("Class cannot be instantiated.");
}});
var _2e=_2d.extend(null,{extend:function(a,b){
var c=this.base();
c.implement(this);
c.implement(a);
extend(c,b);
c.init();
return c;
},implement:function(d){
var e=this;
if(typeof d=="function"){
if(!_13(d,e)){
this.base(d);
}
if(_13(_2e,d)){
forEach(d,function(a,b){
if(!e[b]){
if(typeof a=="function"&&a.call&&d.prototype[b]){
a=function(){
return d[b].apply(d,arguments);
};
}
e[b]=a;
}
});
}
}else{
extend(e,d);
_10(Object,d,function(b,c){
if(c.charAt(0)=="@"){
if(_c(c.slice(1))){
forEach(b,arguments.callee);
}
}else{
if(typeof b=="function"&&b.call){
e.prototype[c]=function(){
var a=_9.call(arguments);
a.unshift(this);
return e[c].apply(e,a);
};
}
}
});
}
return e;
}});
var _39=_2e.extend({every:function(c,d,e){
var f=true;
try{
this.forEach(c,function(a,b){
f=d.call(e,a,b,c);
if(!f){
throw StopIteration;
}
});
}
catch(error){
if(error!=StopIteration){
throw error;
}
}
return !!f;
},filter:function(d,e,f){
var i=0;
return this.reduce(d,function(a,b,c){
if(e.call(f,b,c,d)){
a[i++]=b;
}
return a;
},[]);
},invoke:function(b,c){
var d=_9.call(arguments,2);
return this.map(b,(typeof c=="function")?function(a){
return (a==null)?undefined:c.apply(a,d);
}:function(a){
return (a==null)?undefined:a[c].apply(a,d);
});
},map:function(c,d,e){
var f=[],i=0;
this.forEach(c,function(a,b){
f[i++]=d.call(e,a,b,c);
});
return f;
},pluck:function(b,c){
return this.map(b,function(a){
return (a==null)?undefined:a[c];
});
},reduce:function(c,d,e,f){
var g=arguments.length>2;
this.forEach(c,function(a,b){
if(g){
e=d.call(f,e,a,b,c);
}else{
e=a;
g=true;
}
});
return e;
},some:function(a,b,c){
return !this.every(a,not(b),c);
}},{forEach:forEach});
var _14="#";
var Map=_1f.extend({constructor:function(a){
this.merge(a);
},copy:delegate(copy),forEach:function(a,b){
for(var c in this){
if(c.charAt(0)==_14){
a.call(b,this[c],c.slice(1),this);
}
}
},get:function(a){
return this[_14+a];
},getKeys:function(){
return this.map(flip(I));
},getValues:function(){
return this.map(I);
},has:function(a){
return _14+a in this;
},merge:function(b){
var c=flip(this.put);
forEach(arguments,function(a){
forEach(a,c,this);
},this);
return this;
},remove:function(a){
delete this[_14+a];
},put:function(a,b){
if(arguments.length==1){
b=a;
}
this[_14+a]=b;
},size:function(){
var a=0;
for(var b in this){
if(b.charAt(0)==_14){
a++;
}
}
return a;
},union:function(a){
return this.merge.apply(this.copy(),arguments);
}});
Map.implement(_39);
var _15="~";
var _71=Map.extend({constructor:function(a){
this[_15]=new Array2;
this.base(a);
},add:function(a,b){
assert(!this.has(a),"Duplicate key '"+a+"'.");
this.put.apply(this,arguments);
},copy:function(){
var a=this.base();
a[_15]=this[_15].copy();
return a;
},forEach:function(a,b){
var c=this[_15];
var d=c.length;
for(var i=0;i<d;i++){
a.call(b,this[_14+c[i]],c[i],this);
}
},getAt:function(a){
if(a<0){
a+=this[_15].length;
}
var b=this[_15][a];
return (b===undefined)?undefined:this[_14+b];
},getKeys:function(){
return this[_15].concat();
},indexOf:function(a){
return this[_15].indexOf(String(a));
},insertAt:function(a,b,c){
assert(Math.abs(a)<this[_15].length,"Index out of bounds.");
assert(!this.has(b),"Duplicate key '"+b+"'.");
this[_15].insertAt(a,String(b));
this[_14+b]==null;
this.put.apply(this,_9.call(arguments,1));
},item:_d,put:function(a,b){
if(arguments.length==1){
b=a;
}
if(!this.has(a)){
this[_15].push(String(a));
}
var c=this.constructor;
if(c.Item&&!instanceOf(b,c.Item)){
b=c.create.apply(c,arguments);
}
this[_14+a]=b;
},putAt:function(a,b){
assert(Math.abs(a)<this[_15].length,"Index out of bounds.");
arguments[0]=this[_15].item(a);
this.put.apply(this,arguments);
},remove:function(a){
if(this.has(a)){
this[_15].remove(String(a));
delete this[_14+a];
}
},removeAt:function(a){
var b=this[_15].removeAt(a);
delete this[_14+b];
},reverse:function(){
this[_15].reverse();
return this;
},size:function(){
return this[_15].length;
},sort:function(c){
if(c){
var d=this;
this[_15].sort(function(a,b){
return c(d[_14+a],d[_14+b],a,b);
});
}else{
this[_15].sort();
}
return this;
},toString:function(){
return String(this[_15]);
}},{Item:null,init:function(){
this.prototype.item=this.prototype.getAt;
},create:function(a,b){
return this.Item?new this.Item(a,b):b;
},extend:function(a,b){
var c=this.base(a);
c.create=this.create;
extend(c,b);
if(!c.Item){
c.Item=this.Item;
}else{
if(typeof c.Item!="function"){
c.Item=(this.Item||_1f).extend(c.Item);
}
}
c.init();
return c;
}});
var _16=/\\(\d+)/g,_17=/\\./g,_18=/\(\?[:=!]|\[[^\]]+\]/g,_19=/\(/g,_20=/\$(\d+)/,_21=/^\$\d+$/;
var _93=_71.extend({constructor:function(a,b){
this.base(a);
if(typeof b=="string"){
this.global=/g/.test(b);
this.ignoreCase=/i/.test(b);
}
},global:true,ignoreCase:false,exec:function(h,j){
var k=(this.global?"g":"")+(this.ignoreCase?"i":"");
h=String(h)+"";
if(arguments.length==1){
var l=this;
var m=this[_15];
j=function(a){
if(a){
var b,c=1,i=0;
while((b=l[_14+m[i++]])){
var d=c+b.length+1;
if(arguments[c]){
var e=b.replacement;
switch(typeof e){
case "function":
var f=_9.call(arguments,c,d);
var g=arguments[arguments.length-2];
return e.apply(l,f.concat(g,h));
case "number":
return arguments[c+e];
default:
return e;
}
}
c=d;
}
}
return "";
};
}
return h.replace(new RegExp(this,k),j);
},insertAt:function(a,b,c){
if(instanceOf(b,RegExp)){
arguments[1]=b.source;
}
return base(this,arguments);
},test:function(a){
return this.exec(a)!=a;
},toString:function(){
var e=0;
return "("+this.map(function(c){
var d=String(c).replace(_16,function(a,b){
return "\\"+(1+Number(b)+e);
});
e+=c.length+1;
return d;
}).join(")|(")+")";
}},{IGNORE:"$0",init:function(){
forEach("add,get,has,put,remove".split(","),function(b){
_22(this,b,function(a){
if(instanceOf(a,RegExp)){
arguments[0]=a.source;
}
return base(this,arguments);
});
},this.prototype);
},Item:{constructor:function(a,b){
if(typeof b=="number"){
b=String(b);
}else{
if(b==null){
b="";
}
}
if(typeof b=="string"&&_20.test(b)){
if(_21.test(b)){
b=parseInt(b.slice(1));
}else{
var Q=/'/.test(b.replace(/\\./g,""))?"\"":"'";
b=b.replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\$(\d+)/g,Q+"+(arguments[$1]||"+Q+Q+")+"+Q);
b=new Function("return "+Q+b.replace(/(['"])\1\+(.*)\+\1\1$/,"$1")+Q);
}
}
this.length=_93.count(a);
this.replacement=b;
this.toString=K(String(a));
},length:0,replacement:""},count:function(a){
a=String(a).replace(_17,"").replace(_18,"");
return match(a,_19).length;
}});
var _b0={name:"JavaScript",version:base2.version,exports:"Array2,Date2,String2",namespace:"",bind:function(c){
forEach(this.exports.match(/\w+/g),function(a){
var b=a.slice(0,-1);
extend(c[b],this[a]);
this[a](c[b].prototype);
},this);
return this;
}};
if((new Date).getYear()>1900){
Date.prototype.getYear=function(){
return this.getFullYear()-1900;
};
Date.prototype.setYear=function(a){
return this.setFullYear(a+1900);
};
}
Function.prototype.prototype={};
if("".replace(/^/,K("$$"))=="$"){
extend(String.prototype,"replace",function(a,b){
if(typeof b=="function"){
var c=b;
b=function(){
return String(c.apply(null,arguments)).split("$").join("$$");
};
}
return this.base(a,b);
});
}
var _b8=_23(Array,Array,"concat,join,pop,push,reverse,shift,slice,sort,splice,unshift",[_39,{combine:function(d,e){
if(!e){
e=d;
}
return this.reduce(d,function(a,b,c){
a[b]=e[c];
return a;
},{});
},contains:function(a,b){
return this.indexOf(a,b)!=-1;
},copy:function(a){
var b=_9.call(a);
if(!b.swap){
this(b);
}
return b;
},flatten:function(c){
var d=0;
return this.reduce(c,function(a,b){
if(this.like(b)){
this.reduce(b,arguments.callee,a,this);
}else{
a[d++]=b;
}
return a;
},[],this);
},forEach:_24,indexOf:function(a,b,c){
var d=a.length;
if(c==null){
c=0;
}else{
if(c<0){
c=Math.max(0,d+c);
}
}
for(var i=c;i<d;i++){
if(a[i]===b){
return i;
}
}
return -1;
},insertAt:function(a,b,c){
this.splice(a,b,0,c);
return c;
},item:function(a,b){
if(b<0){
b+=a.length;
}
return a[b];
},lastIndexOf:function(a,b,c){
var d=a.length;
if(c==null){
c=d-1;
}else{
if(c<0){
c=Math.max(0,d+c);
}
}
for(var i=c;i>=0;i--){
if(a[i]===b){
return i;
}
}
return -1;
},map:function(c,d,e){
var f=[];
this.forEach(c,function(a,b){
f[b]=d.call(e,a,b,c);
});
return f;
},remove:function(a,b){
var c=this.indexOf(a,b);
if(c!=-1){
this.removeAt(a,c);
}
return b;
},removeAt:function(a,b){
return this.splice(a,b,1);
},swap:function(a,b,c){
if(b<0){
b+=a.length;
}
if(c<0){
c+=a.length;
}
var d=a[b];
a[b]=a[c];
a[c]=d;
return a;
}}]);
_b8.reduce=_39.reduce;
_b8.like=function(a){
return !!(a&&typeof a=="object"&&typeof a.length=="number");
};
var _25=/^((-\d+|\d{4,})(-(\d{2})(-(\d{2}))?)?)?T((\d{2})(:(\d{2})(:(\d{2})(\.(\d{1,3})(\d)?\d*)?)?)?)?(([+-])(\d{2})(:(\d{2}))?|Z)?$/;
var _26={FullYear:2,Month:4,Date:6,Hours:8,Minutes:10,Seconds:12,Milliseconds:14};
var _27={Hectomicroseconds:15,UTC:16,Sign:17,Hours:18,Minutes:20};
var _28=/(((00)?:0+)?:0+)?\.0+$/;
var _29=/(T[0-9:.]+)$/;
var _ea=_23(Date,function(a,b,c,h,m,s,d){
switch(arguments.length){
case 0:
return new Date;
case 1:
return new Date(a);
default:
return new Date(a,b,arguments.length==2?1:c,h||0,m||0,s||0,d||0);
}
},"",[{toISOString:function(c){
var d="####-##-##T##:##:##.###";
for(var e in _26){
d=d.replace(/#+/,function(a){
var b=c["getUTC"+e]();
if(e=="Month"){
b++;
}
return ("000"+b).slice(-a.length);
});
}
return d.replace(_28,"").replace(_29,"$1Z");
}}]);
_ea.now=function(){
return (new Date).valueOf();
};
_ea.parse=function(a,b){
if(arguments.length>1){
assertType(b,"number","defaultDate should be of type 'number'.");
}
var c=String(a).match(_25);
if(c){
if(c[_26.Month]){
c[_26.Month]--;
}
if(c[_27.Hectomicroseconds]>=5){
c[_26.Milliseconds]++;
}
var d=new Date(b||0);
var e=c[_27.UTC]||c[_27.Hours]?"UTC":"";
for(var f in _26){
var _fd=c[_26[f]];
if(!_fd){
continue;
}
d["set"+e+f](_fd);
if(d["get"+e+f]()!=c[_26[f]]){
return NaN;
}
}
if(c[_27.Hours]){
var g=Number(c[_27.Sign]+c[_27.Hours]);
var h=Number(c[_27.Sign]+(c[_27.Minutes]||0));
d.setUTCMinutes(d.getUTCMinutes()+(g*60)+h);
}
return d.valueOf();
}else{
return Date.parse(a);
}
};
var _100=_23(String,function(a){
return new String(arguments.length==0?"":a);
},"charAt,charCodeAt,concat,indexOf,lastIndexOf,match,replace,search,slice,split,substr,substring,toLowerCase,toUpperCase",[{trim:trim}]);
function _23(c,_103,d,e){
var f=_2e.extend();
forEach(d.match(/\w+/g),function(a){
f[a]=unbind(c.prototype[a]);
});
forEach(e,f.implement,f);
var g=function(){
return f(this.constructor==f?_103.apply(null,arguments):arguments[0]);
};
g.prototype=f.prototype;
forEach(f,function(a,b){
if(c[b]){
f[b]=c[b];
delete f.prototype[b];
}
g[b]=f[b];
});
g.ancestor=Object;
delete g.extend;
if(c!=Array){
delete g.forEach;
}
return g;
}
function extend(a,b){
if(a&&b){
if(arguments.length>2){
var c=b;
b={};
b[c]=arguments[2];
}
var d=(typeof b=="function"?Function:Object).prototype;
var i=_6.length,c;
if(base2.__prototyping){
while(c=_6[--i]){
var e=b[c];
if(e!=d[c]){
if(_5.test(e)){
_22(a,c,e);
}else{
a[c]=e;
}
}
}
}
for(c in b){
if(d[c]===undefined){
var e=b[c];
if(c.charAt(0)=="@"){
if(_c(c.slice(1))){
arguments.callee(a,e);
}
continue;
}
var f=a[c];
if(f&&typeof e=="function"){
if(e!=f&&(!f.method||!_13(e,f))){
if(_5.test(e)){
_22(a,c,e);
}else{
e.ancestor=f;
a[c]=e;
}
}
}else{
a[c]=e;
}
}
}
}
return a;
}
function _13(a,b){
while(b){
if(!b.ancestor){
return false;
}
b=b.ancestor;
if(b==a){
return true;
}
}
return false;
}
function _22(c,d,e){
var f=c[d];
var g=base2.__prototyping;
if(g&&f!=g[d]){
g=null;
}
function _30(){
var a=this.base;
this.base=g?g[d]:f;
var b=e.apply(this,arguments);
this.base=a;
return b;
}
_30.ancestor=f;
_30.method=e;
_30.toString=function(){
return String(e);
};
c[d]=_30;
}
if(typeof StopIteration=="undefined"){
StopIteration=new Error("StopIteration");
}
function forEach(a,b,c,d){
if(a==null){
return;
}
if(!d){
if(typeof a=="function"&&a.call){
d=Function;
}else{
if(typeof a.forEach=="function"&&a.forEach!=arguments.callee){
a.forEach(b,c);
return;
}else{
if(typeof a.length=="number"){
_24(a,b,c);
return;
}
}
}
}
_10(d||Object,a,b,c);
}
function _24(a,b,c){
if(a==null){
return;
}
var d=a.length,i;
if(typeof a=="string"){
for(i=0;i<d;i++){
b.call(c,a.charAt(i),i,a);
}
}else{
for(i=0;i<d;i++){
if(i in a){
b.call(c,a[i],i,a);
}
}
}
}
function _10(g,h,j,k){
var l=function(){
this.i=1;
};
l.prototype={i:1};
var m=0;
for(var i in new l){
m++;
}
_10=(m>1)?function(a,b,c,d){
var e={};
for(var f in b){
if(!e[f]&&a.prototype[f]===undefined){
e[f]=true;
c.call(d,b[f],f,b);
}
}
}:function(a,b,c,d){
for(var e in b){
if(a.prototype[e]===undefined){
c.call(d,b[e],e,b);
}
}
};
_10(g,h,j,k);
}
function typeOf(a){
var b=typeof a;
switch(b){
case "object":
return a===null?"null":typeof a.call=="function"||_7.test(a)?"function":b;
case "function":
return typeof a.call=="function"?b:"object";
default:
return b;
}
}
function instanceOf(a,b){
if(typeof b!="function"){
throw new TypeError("Invalid 'instanceOf' operand.");
}
if(a==null){
return false;
}
if(a instanceof b){
return true;
}
if(_1f.ancestorOf==b.ancestorOf){
return false;
}
if(_1f.ancestorOf==a.constructor.ancestorOf){
return b==Object;
}
switch(b){
case Array:
return !!(typeof a=="object"&&a.join&&a.splice);
case Function:
return typeOf(a)=="function";
case RegExp:
return typeof a.constructor.$1=="string";
case Date:
return !!a.getTimezoneOffset;
case String:
case Number:
case Boolean:
return typeof a==typeof b.prototype.valueOf();
case Object:
return true;
}
return false;
}
function assert(a,b,c){
if(!a){
throw new (c||Error)(b||"Assertion failed.");
}
}
function assertArity(a,b,c){
if(b==null){
b=a.callee.length;
}
if(a.length<b){
throw new SyntaxError(c||"Not enough arguments.");
}
}
function assertType(a,b,c){
if(b&&(typeof b=="function"?!instanceOf(a,b):typeOf(a)!=b)){
throw new TypeError(c||"Invalid type.");
}
}
function assignID(a){
if(!a.base2ID){
a.base2ID="b2_"+_8++;
}
return a.base2ID;
}
function copy(a){
var b=function(){
};
b.prototype=a;
return new b;
}
function format(c){
var d=arguments;
var e=new RegExp("%([1-"+arguments.length+"])","g");
return String(c).replace(e,function(a,b){
return d[b];
});
}
function match(a,b){
return String(a).match(b)||[];
}
function rescape(a){
return String(a).replace(_4,"\\$1");
}
function trim(a){
return String(a).replace(_2,"").replace(_3,"");
}
function I(i){
return i;
}
function K(k){
return function(){
return k;
};
}
function bind(a,b){
var c=_9.call(arguments,2);
return c.length==0?function(){
return a.apply(b,arguments);
}:function(){
return a.apply(b,c.concat.apply(c,arguments));
};
}
function delegate(b,c){
return function(){
var a=_9.call(arguments);
a.unshift(this);
return b.apply(c,a);
};
}
function flip(a){
return function(){
return a.apply(this,_b8.swap(arguments,0,1));
};
}
function not(a){
return function(){
return !a.apply(this,arguments);
};
}
function unbind(b){
return function(a){
return b.apply(a,_9.call(arguments,1));
};
}
base2=new _21(this,base2);
eval(this.exports);
base2.extend=extend;
forEach(_39,function(a,b){
if(!_2e[b]){
base2.addName(b,bind(a,_39));
}
});
_b0=new _21(this,_b0);
eval(this.exports);
};
new function(_){
var DOM=new base2.Package(this,{name:"DOM",version:"1.0 (beta 2)",exports:"Interface,Binding,Node,Document,Element,AbstractView,HTMLDocument,HTMLElement,"+"Selector,Traversal,XPathParser,NodeSelector,DocumentSelector,ElementSelector,"+"StaticNodeList,Event,EventTarget,DocumentEvent,ViewCSS,CSSStyleDeclaration",bind:function(a){
if(a&&a.nodeType){
var b=assignID(a);
if(!DOM.bind[b]){
switch(a.nodeType){
case 1:
if(typeof a.className=="string"){
(HTMLElement.bindings[a.tagName]||HTMLElement).bind(a);
}else{
Element.bind(a);
}
break;
case 9:
if(a.writeln){
HTMLDocument.bind(a);
}else{
Document.bind(a);
}
break;
default:
Node.bind(a);
}
DOM.bind[b]=true;
}
}
return a;
},"@MSIE5.+win":{bind:function(a){
if(a&&a.writeln){
a.nodeType=9;
}
return this.base(a);
}}});
eval(this.imports);
var _0=detect("MSIE");
var _1=detect("MSIE5");
var _163=Module.extend(null,{implement:function(e){
var f=this;
if(_163.ancestorOf(e)){
forEach(e,function(a,b){
if(e[b]._2){
f[b]=function(){
return e[b].apply(e,arguments);
};
}
});
}else{
if(typeof e=="object"){
this.forEach(e,function(a,b){
if(b.charAt(0)=="@"){
forEach(a,arguments.callee);
}else{
if(typeof a=="function"&&a.call){
if(!f[b]){
var c="var fn=function _%1(%2){%3.base=%3.%1.ancestor;var m=%3.base?'base':'%1';return %3[m](%4)}";
var d="abcdefghij".split("").slice(-a.length);
eval(format(c,b,d,d[0],d.slice(1)));
fn._2=b;
f[b]=fn;
}
}
}
});
}
}
return this.base(e);
}});
var _16c=_163.extend(null,{bind:function(a){
return extend(a,this.prototype);
}});
var Node=_16c.extend({"@!(element.compareDocumentPosition)":{compareDocumentPosition:function(a,b){
if(Traversal.contains(a,b)){
return 4|16;
}else{
if(Traversal.contains(b,a)){
return 2|8;
}
}
var c=_3(a);
var d=_3(b);
if(c<d){
return 4;
}else{
if(c>d){
return 2;
}
}
return 0;
}}});
var _3=document.documentElement.sourceIndex?function(a){
return a.sourceIndex;
}:function(a){
var b=0;
while(a){
b=Traversal.getNodeIndex(a)+"."+b;
a=a.parentNode;
}
return b;
};
var _177=Node.extend(null,{bind:function(b){
extend(b,"createElement",function(a){
return DOM.bind(this.base(a));
});
AbstractView.bind(b.defaultView);
if(b!=window.document){
new DOMContentLoadedEvent(b);
}
return this.base(b);
},"@!(document.defaultView)":{bind:function(a){
a.defaultView=Traversal.getDefaultView(a);
return this.base(a);
}}});
var _4=/^(href|src|type)$/;
var _5={"class":"className","for":"htmlFor"};
var _17d=Node.extend({"@MSIE.+win":{getAttribute:function(a,b,c){
if(a.className===undefined){
return this.base(a,b);
}
var d=_6(a,b);
if(d&&(d.specified||b=="value")){
if(_4.test(b)){
return this.base(a,b,2);
}else{
if(b=="style"){
return a.style.cssText;
}else{
return d.nodeValue;
}
}
}
return null;
},setAttribute:function(a,b,c){
if(a.className===undefined){
this.base(a,b,c);
}else{
if(b=="style"){
a.style.cssText=c;
}else{
c=String(c);
var d=_6(a,b);
if(d){
d.nodeValue=c;
}else{
this.base(a,_5[b]||b,c);
}
}
}
}},"@!(element.hasAttribute)":{hasAttribute:function(a,b){
return this.getAttribute(a,b)!=null;
}}});
extend(_17d.prototype,"cloneNode",function(a){
var b=this.base(a||false);
b.base2ID=undefined;
return b;
});
if(_0){
var _18a="colSpan,rowSpan,vAlign,dateTime,accessKey,tabIndex,encType,maxLength,readOnly,longDesc";
extend(_5,Array2.combine(_18a.toLowerCase().split(","),_18a.split(",")));
var _6=_1?function(a,b){
return a.attributes[b]||a.attributes[_5[b.toLowerCase()]];
}:function(a,b){
return a.getAttributeNode(b);
};
}
var TEXT=_0?"innerText":"textContent";
var _191=Module.extend({getDefaultView:function(a){
return this.getDocument(a).defaultView;
},getNextElementSibling:function(a){
while(a&&(a=a.nextSibling)&&!this.isElement(a)){
continue;
}
return a;
},getNodeIndex:function(a){
var b=0;
while(a&&(a=a.previousSibling)){
b++;
}
return b;
},getOwnerDocument:function(a){
return a.ownerDocument;
},getPreviousElementSibling:function(a){
while(a&&(a=a.previousSibling)&&!this.isElement(a)){
continue;
}
return a;
},getTextContent:function(a){
return a[TEXT];
},isEmpty:function(a){
a=a.firstChild;
while(a){
if(a.nodeType==3||this.isElement(a)){
return false;
}
a=a.nextSibling;
}
return true;
},setTextContent:function(a,b){
return a[TEXT]=b;
},"@MSIE":{getDefaultView:function(a){
return (a.document||a).parentWindow;
},"@MSIE5":{getOwnerDocument:function(a){
return a.ownerDocument||a.document;
}}}},{contains:function(a,b){
while(b&&(b=b.parentNode)&&a!=b){
continue;
}
return !!b;
},getDocument:function(a){
return this.isDocument(a)?a:this.getOwnerDocument(a);
},isDocument:function(a){
return !!(a&&a.documentElement);
},isElement:function(a){
return !!(a&&a.nodeType==1);
},"@(element.contains)":{contains:function(a,b){
return a!=b&&(this.isDocument(a)?a==this.getOwnerDocument(b):a.contains(b));
}},"@MSIE5":{isElement:function(a){
return !!(a&&a.nodeType==1&&a.tagName!="!");
}}});
var _1a6=_16c.extend();
var _1a7=_16c.extend({"@!(document.createEvent)":{initEvent:function(a,b,c,d){
a.type=b;
a.bubbles=c;
a.cancelable=d;
a.timeStamp=new Date().valueOf();
},"@MSIE":{initEvent:function(a,b,c,d){
this.base(a,b,c,d);
a.cancelBubble=!a.bubbles;
},preventDefault:function(a){
if(a.cancelable!==false){
a.returnValue=false;
}
},stopPropagation:function(a){
a.cancelBubble=true;
}}}},{"@!(document.createEvent)":{"@MSIE":{bind:function(a){
if(!a.timeStamp){
a.bubbles=!!_7[a.type];
a.cancelable=!!_8[a.type];
a.timeStamp=new Date().valueOf();
}
if(!a.target){
a.target=a.srcElement;
}
a.relatedTarget=a[(a.type=="mouseout"?"to":"from")+"Element"];
return this.base(a);
}}}});
if(_0){
var _7="abort,error,select,change,resize,scroll";
var _8="click,mousedown,mouseup,mouseover,mousemove,mouseout,keydown,keyup,submit,reset";
_7=Array2.combine((_7+","+_8).split(","));
_8=Array2.combine(_8.split(","));
}
var _1b5=_163.extend({"@!(element.addEventListener)":{addEventListener:function(a,b,c,d){
var e=assignID(a);
var f=assignID(c);
var g=_9[e];
if(!g){
g=_9[e]={};
}
var h=g[b];
var i=a["on"+b];
if(!h){
h=g[b]={};
if(i){
h[0]=i;
}
}
h[f]=c;
if(i!==undefined){
a["on"+b]=_9._10;
}
},dispatchEvent:function(a,b){
return _10.call(a,b);
},removeEventListener:function(a,b,c,d){
var e=_9[a.base2ID];
if(e&&e[b]){
delete e[b][c.base2ID];
}
},"@(element.fireEvent)":{dispatchEvent:function(a,b){
var c="on"+b.type;
b.target=a;
if(a[c]===undefined){
return this.base(a,b);
}else{
return a.fireEvent(c,b);
}
}}}});
var _9=new Base({_10:_10,"@MSIE":{_10:function(){
var a=this;
var b=(a.document||a).parentWindow;
if(a.Infinity){
a=b;
}
return _10.call(a,b.event);
}}});
function _10(a){
var b=true;
var c=_9[this.base2ID];
if(c){
_1a7.bind(a);
var d=c[a.type];
for(var i in d){
var _1d1=d[i];
if(_1d1.handleEvent){
var _1d2=_1d1.handleEvent(a);
}else{
_1d2=_1d1.call(this,a);
}
if(_1d2===false||a.returnValue===false){
b=false;
}
}
}
return b;
}
var _1d3=_163.extend({"@!(document.createEvent)":{createEvent:function(a,b){
return _1a7.bind({});
},"@(document.createEventObject)":{createEvent:function(a,b){
return _1a7.bind(a.createEventObject());
}}},"@(document.createEvent)":{"@!(document.createEvent('Events'))":{createEvent:function(a,b){
return this.base(a,b=="Events"?"UIEvents":b);
}}}});
var _1da=Base.extend({constructor:function(b){
var c=false;
this.fire=function(){
if(!c){
c=true;
setTimeout(function(){
var a=_1d3.createEvent(b,"Events");
_1a7.initEvent(a,"DOMContentLoaded",false,false);
_1b5.dispatchEvent(b,a);
},1);
}
};
_1b5.addEventListener(b,"DOMContentLoaded",function(){
c=true;
},false);
this.listen(b);
},listen:function(a){
_1b5.addEventListener(_191.getDefaultView(a),"load",this.fire,false);
},"@MSIE.+win":{listen:function(a){
if(a.readyState!="complete"){
var b=this;
a.write("<script id=__ready defer src=//:></script>");
a.all.__ready.onreadystatechange=function(){
if(this.readyState=="complete"){
this.removeNode();
b.fire();
}
};
}
}},"@KHTML":{listen:function(a){
if(a.readyState!="complete"){
var b=this;
var c=setInterval(function(){
if(/loaded|complete/.test(a.readyState)){
clearInterval(c);
b.fire();
}
},100);
}
}}});
new _1da(document);
_177.implement(_1d3);
_177.implement(_1b5);
_17d.implement(_1b5);
var _11=/^\d+(px)?$/i;
var _12=/(width|height|top|bottom|left|right|fontSize)$/;
var _13=/^(color|backgroundColor)$/;
var _1e7=_163.extend({"@!(document.defaultView.getComputedStyle)":{"@MSIE":{getComputedStyle:function(a,b,c){
var d=b.currentStyle;
var e={};
for(var i in d){
if(_12.test(i)){
e[i]=_14(b,e[i])+"px";
}else{
if(_13.test(i)){
e[i]=_15(b,i=="color"?"ForeColor":"BackColor");
}else{
e[i]=d[i];
}
}
}
return e;
}}},getComputedStyle:function(a,b,c){
return _16.bind(this.base(a,b,c));
}},{toCamelCase:function(c){
return c.replace(/\-([a-z])/g,function(a,b){
return b.toUpperCase();
});
}});
function _14(a,b){
if(_11.test(b)){
return parseInt(b);
}
var c=a.style.left;
var d=a.runtimeStyle.left;
a.runtimeStyle.left=a.currentStyle.left;
a.style.left=b||0;
b=a.style.pixelLeft;
a.style.left=c;
a.runtimeStyle.left=d;
return b;
}
function _15(a,b){
var c=a.document.body.createTextRange();
c.moveToElementText(a);
var d=c.queryCommandValue(b);
return format("rgb(%1,%2,%3)",d&255,(d&65280)>>8,(d&16711680)>>16);
}
var _16=_16c.extend({getPropertyValue:function(a,b){
return this.base(a,_17[b]||b);
},"@MSIE.+win":{getPropertyValue:function(a,b){
return b=="float"?a.styleFloat:a[_1e7.toCamelCase(b)];
}}});
var _201=_16.extend({setProperty:function(a,b,c,d){
return this.base(a,_17[b]||b,c,d);
},"@MSIE.+win":{setProperty:function(a,b,c,d){
if(b=="opacity"){
a.opacity=c;
a.zoom=1;
a.filter="progid:DXImageTransform.Microsoft.Alpha(opacity="+(c*100)+")";
}else{
a.cssText+=format("%1:%2 %3;",b,c,d);
}
}}});
var _17=new Base({"@Gecko":{opacity:"-moz-opacity"},"@KHTML":{opacity:"-khtml-opacity"}});
_1a6.implement(_1e7);
var _20b=_163.extend({"@!(element.querySelector)":{querySelector:function(a,b){
return new Selector(b).exec(a,1);
},querySelectorAll:function(a,b){
return new Selector(b).exec(a);
}}});
extend(_20b.prototype,{querySelector:function(a){
return DOM.bind(this.base(a));
},querySelectorAll:function(b){
return extend(this.base(b),"item",function(a){
return DOM.bind(this.base(a));
});
}});
var _213=_20b.extend();
var _214=_20b.extend({"@!(element.matchesSelector)":{matchesSelector:function(a,b){
return new Selector(b).test(a);
}}});
var _217=Base.extend({constructor:function(b){
b=b||[];
this.length=b.length;
this.item=function(a){
return b[a];
};
},length:0,forEach:function(a,b){
for(var i=0;i<this.length;i++){
a.call(b,this.item(i),i,this);
}
},item:Undefined,"@(XPathResult)":{constructor:function(b){
if(b&&b.snapshotItem){
this.length=b.snapshotLength;
this.item=function(a){
return b.snapshotItem(a);
};
}else{
this.base(b);
}
}}});
_217.implement(Enumerable);
var _21f=RegGrp.extend({constructor:function(a){
this.base(a);
this.cache={};
this.sorter=new RegGrp;
this.sorter.add(/:not\([^)]*\)/,RegGrp.IGNORE);
this.sorter.add(/([ >](\*|[\w-]+))([^: >+~]*)(:\w+-child(\([^)]+\))?)([^: >+~]*)/,"$1$3$6$4");
},cache:null,ignoreCase:true,escape:function(b){
var c=/'/g;
var d=this._18=[];
return this.optimise(this.format(String(b).replace(_21f.ESCAPE,function(a){
return "\x01"+d.push(a.slice(1,-1).replace(c,"\\'"));
})));
},format:function(a){
return a.replace(_21f.WHITESPACE,"$1").replace(_21f.IMPLIED_SPACE,"$1 $2").replace(_21f.IMPLIED_ASTERISK,"$1*$2");
},optimise:function(a){
return this.sorter.exec(a.replace(_21f.WILD_CARD,">* "));
},parse:function(a){
return this.cache[a]||(this.cache[a]=this.unescape(this.exec(this.escape(a))));
},unescape:function(c){
var d=this._18;
return c.replace(/\x01(\d+)/g,function(a,b){
return d[b-1];
});
}},{ESCAPE:/'(\\.|[^'\\])*'|"(\\.|[^"\\])*"/g,IMPLIED_ASTERISK:/([\s>+~,]|[^(]\+|^)([#.:\[])/g,IMPLIED_SPACE:/(^|,)([^\s>+~])/g,WHITESPACE:/\s*([\s>+~(),]|^|$)\s*/g,WILD_CARD:/\s\*\s/g,_19:function(c,d,e,f,g,h,i,j){
f=/last/i.test(c)?f+"+1-":"";
if(!isNaN(d)){
d="0n+"+d;
}else{
if(d=="even"){
d="2n";
}else{
if(d=="odd"){
d="2n+1";
}
}
}
d=d.split(/n\+?/);
var a=d[0]?(d[0]=="-")?-1:parseInt(d[0]):1;
var b=parseInt(d[1])||0;
var k=a<0;
if(k){
a=-a;
if(a==1){
b++;
}
}
var l=format(a==0?"%3%7"+(f+b):"(%4%3-%2)%6%1%70%5%4%3>=%2",a,b,e,f,h,i,j);
if(k){
l=g+"("+l+")";
}
return l;
}});
var _238=_21f.extend({constructor:function(){
this.base(_238.rules);
this.sorter.putAt(1,"$1$4$3$6");
},escape:function(a){
return this.base(a).replace(/,/g,"\x02");
},unescape:function(b){
return this.base(b.replace(/\[self::\*\]/g,"").replace(/(^|\x02)\//g,"$1./").replace(/\x02/g," | ")).replace(/'[^'\\]*\\'(\\.|[^'\\])*'/g,function(a){
return "concat("+a.split("\\'").join("',\"'\",'")+")";
});
},"@opera":{unescape:function(a){
return this.base(a.replace(/last\(\)/g,"count(preceding-sibling::*)+count(following-sibling::*)+1"));
}}},{init:function(){
this.values.attributes[""]="[@$1]";
forEach(this.types,function(a,b){
forEach(this.values[b],a,this.rules);
},this);
},optimised:{pseudoClasses:{"first-child":"[1]","last-child":"[last()]","only-child":"[last()=1]"}},rules:extend({},{"@!KHTML":{"(^|\\x02) (\\*|[\\w-]+)#([\\w-]+)":"$1id('$3')[self::$2]","([ >])(\\*|[\\w-]+):([\\w-]+-child(\\(([^)]+)\\))?)":function(a,b,c,d,e,f){
var g=(b==" ")?"//*":"/*";
if(/^nth/i.test(d)){
g+=_19(d,f,"position()");
}else{
g+=_238.optimised.pseudoClasses[d];
}
return g+"[self::"+c+"]";
}}}),types:{identifiers:function(a,b){
this[rescape(b)+"([\\w-]+)"]=a;
},combinators:function(a,b){
this[rescape(b)+"(\\*|[\\w-]+)"]=a;
},attributes:function(a,b){
this["\\[([\\w-]+)\\s*"+rescape(b)+"\\s*([^\\]]*)\\]"]=a;
},pseudoClasses:function(a,b){
this[":"+b.replace(/\(\)$/,"\\(([^)]+)\\)")]=a;
}},values:{identifiers:{"#":"[@id='$1'][1]",".":"[contains(concat(' ',@class,' '),' $1 ')]"},combinators:{" ":"/descendant::$1",">":"/child::$1","+":"/following-sibling::*[1][self::$1]","~":"/following-sibling::$1"},attributes:{"*=":"[contains(@$1,'$2')]","^=":"[starts-with(@$1,'$2')]","$=":"[substring(@$1,string-length(@$1)-string-length('$2')+1)='$2']","~=":"[contains(concat(' ',@$1,' '),' $2 ')]","|=":"[contains(concat('-',@$1,'-'),'-$2-')]","!=":"[not(@$1='$2')]","=":"[@$1='$2']"},pseudoClasses:{"empty":"[not(child::*) and not(text())]","first-child":"[not(preceding-sibling::*)]","last-child":"[not(following-sibling::*)]","not()":_20,"nth-child()":_19,"nth-last-child()":_19,"only-child":"[not(preceding-sibling::*) and not(following-sibling::*)]","root":"[not(parent::*)]"}},"@opera":{init:function(){
this.optimised.pseudoClasses["last-child"]=this.values.pseudoClasses["last-child"];
this.optimised.pseudoClasses["only-child"]=this.values.pseudoClasses["only-child"];
this.base();
}}});
var _21=new _238;
function _20(a,b){
return "[not("+_21.exec(trim(b)).replace(/\[1\]/g,"").replace(/^(\*|[\w-]+)/,"[self::$1]").replace(/\]\[/g," and ").slice(1,-1)+")]";
}
function _19(a,b,c){
return "["+_21f._19(a,b,c||"count(preceding-sibling::*)+1","last()","not"," and "," mod ","=")+"]";
}
var _22=":(checked|disabled|enabled|contains)|^(#[\\w-]+\\s*)?\\w+$";
if(detect("KHTML")){
if(detect("WebKit5")){
_22+="|nth\\-|,";
}else{
_22=".";
}
}
_22=new RegExp(_22);
var _23;
var _256=Base.extend({constructor:function(a){
this.toString=K(trim(a));
},exec:function(a,b){
return _256.parse(this)(a,b);
},test:function(a){
var b=new _256(this+"[b2-test]");
a.setAttribute("b2-test",true);
var c=b.exec(_191.getOwnerDocument(a),true);
a.removeAttribute("b2-test");
return c==a;
},toXPath:function(){
return _256.toXPath(this);
},"@(XPathResult)":{exec:function(a,b){
if(_22.test(this)){
return this.base(a,b);
}
var c=_191.getDocument(a);
var d=b?9:7;
var e=c.evaluate(this.toXPath(),a,null,d,null);
return b?e.singleNodeValue:e;
}},"@MSIE":{exec:function(a,b){
if(typeof a.selectNodes!="undefined"&&!_22.test(this)){
var c=b?"selectSingleNode":"selectNodes";
return a[c](this.toXPath());
}
return this.base(a,b);
}},"@(true)":{exec:function(a,b){
try{
var c=this.base(a||document,b);
}
catch(error){
throw new SyntaxError(format("'%1' is not a valid CSS selector.",this));
}
return b?c:new _217(c);
}}},{toXPath:function(a){
if(!_23){
_23=new _238;
}
return _23.parse(a);
}});
new function(_){
var _24={"=":"%1=='%2'","!=":"%1!='%2'","~=":/(^| )%1( |$)/,"|=":/^%1(-|$)/,"^=":/^%1/,"$=":/%1$/,"*=":/%1/};
_24[""]="%1!=null";
var _25={"checked":"e%1.checked","contains":"e%1[TEXT].indexOf('%2')!=-1","disabled":"e%1.disabled","empty":"Traversal.isEmpty(e%1)","enabled":"e%1.disabled===false","first-child":"!Traversal.getPreviousElementSibling(e%1)","last-child":"!Traversal.getNextElementSibling(e%1)","only-child":"!Traversal.getPreviousElementSibling(e%1)&&!Traversal.getNextElementSibling(e%1)","root":"e%1==Traversal.getDocument(e%1).documentElement"};
var _26=detect("(element.sourceIndex)");
var _27="var p%2=0,i%2,e%2,n%2=e%1.";
var _28=_26?"e%1.sourceIndex":"assignID(e%1)";
var _29="var g="+_28+";if(!p[g]){p[g]=1;";
var _30="r[r.length]=e%1;if(s)return e%1;";
var _31="fn=function(e0,s){indexed++;var r=[],p={},reg=[%1],"+"d=Traversal.getDocument(e0),c=d.body?'toUpperCase':'toString';";
var byId=_0?function(a,b){
var c=a.all[b]||null;
if(!c||c.id==b){
return c;
}
for(var i=0;i<c.length;i++){
if(c[i].id==b){
return c[i];
}
}
return null;
}:function(a,b){
return a.getElementById(b);
};
var _279=1;
function register(a){
if(a.rows){
a.b2_length=a.rows.length;
a.b2_lookup="rowIndex";
}else{
if(a.cells){
a.b2_length=a.cells.length;
a.b2_lookup="cellIndex";
}else{
if(a.b2_indexed!=_279){
var b=0;
var c=a.firstChild;
while(c){
if(c.nodeType==1&&c.nodeName!="!"){
c.b2_index=++b;
}
c=c.nextSibling;
}
a.b2_length=b;
a.b2_lookup="b2_index";
}
}
}
a.b2_indexed=_279;
return a;
}
var fn;
var reg;
var _32;
var _33;
var _34;
var _35;
var _36={};
var _284=new _21f({"^ \\*:root":function(a){
_33=false;
var b="e%2=d.documentElement;if(Traversal.contains(e%1,e%2)){";
return format(b,_32++,_32);
}," (\\*|[\\w-]+)#([\\w-]+)":function(a,b,c){
_33=false;
var d="var e%2=byId(d,'%4');if(e%2&&";
if(b!="*"){
d+="e%2.nodeName=='%3'[c]()&&";
}
d+="Traversal.contains(e%1,e%2)){";
if(_34){
d+=format("i%1=n%1.length;",_34);
}
return format(d,_32++,_32,b,c);
}," (\\*|[\\w-]+)":function(a,b){
_35++;
_33=b=="*";
var c=_27;
c+=(_33&&_1)?"all":"getElementsByTagName('%3')";
c+=";for(i%2=0;(e%2=n%2[i%2]);i%2++){";
return format(c,_32++,_34=_32,b);
},">(\\*|[\\w-]+)":function(a,b){
var c=_0&&_34;
_33=b=="*";
var d=_27;
d+=c?"children":"childNodes";
if(!_33&&c){
d+=".tags('%3')";
}
d+=";for(i%2=0;(e%2=n%2[i%2]);i%2++){";
if(_33){
d+="if(e%2.nodeType==1){";
_33=_1;
}else{
if(!c){
d+="if(e%2.nodeName=='%3'[c]()){";
}
}
return format(d,_32++,_34=_32,b);
},"\\+(\\*|[\\w-]+)":function(a,b){
var c="";
if(_33&&_0){
c+="if(e%1.tagName!='!'){";
}
_33=false;
c+="e%1=Traversal.getNextElementSibling(e%1);if(e%1";
if(b!="*"){
c+="&&e%1.nodeName=='%2'[c]()";
}
c+="){";
return format(c,_32,b);
},"~(\\*|[\\w-]+)":function(a,b){
var c="";
if(_33&&_0){
c+="if(e%1.tagName!='!'){";
}
_33=false;
_35=2;
c+="while(e%1=e%1.nextSibling){if(e%1.b2_adjacent==indexed)break;if(";
if(b=="*"){
c+="e%1.nodeType==1";
if(_1){
c+="&&e%1.tagName!='!'";
}
}else{
c+="e%1.nodeName=='%2'[c]()";
}
c+="){e%1.b2_adjacent=indexed;";
return format(c,_32,b);
},"#([\\w-]+)":function(a,b){
_33=false;
var c="if(e%1.id=='%2'){";
if(_34){
c+=format("i%1=n%1.length;",_34);
}
return format(c,_32,b);
},"\\.([\\w-]+)":function(a,b){
_33=false;
reg.push(new RegExp("(^|\\s)"+rescape(b)+"(\\s|$)"));
return format("if(e%1.className&&reg[%2].test(e%1.className)){",_32,reg.length-1);
},":not\\((\\*|[\\w-]+)?([^)]*)\\)":function(a,b,c){
var d=(b&&b!="*")?format("if(e%1.nodeName=='%2'[c]()){",_32,b):"";
d+=_284.exec(c);
return "if(!"+d.slice(2,-1).replace(/\)\{if\(/g,"&&")+"){";
},":nth(-last)?-child\\(([^)]+)\\)":function(a,b,c){
_33=false;
b=format("e%1.parentNode.b2_length",_32);
var d="if(p%1!==e%1.parentNode)p%1=register(e%1.parentNode);";
d+="var i=e%1[p%1.b2_lookup];if(";
return format(d,_32)+_21f._19(a,c,"i",b,"!","&&","%","==")+"){";
},":([\\w-]+)(\\(([^)]+)\\))?":function(a,b,c,d){
return "if("+format(_25[b]||"throw",_32,d||"")+"){";
},"\\[([\\w-]+)\\s*([^=]?=)?\\s*([^\\]]*)\\]":function(a,b,c,d){
var e=_5[b]||b;
if(c){
var f="e%1.getAttribute('%2',2)";
if(!_4.test(b)){
f="e%1.%3||"+f;
}
b=format("("+f+")",_32,b,e);
}else{
b=format("Element.getAttribute(e%1,'%2')",_32,b);
}
var g=_24[c||""];
if(instanceOf(g,RegExp)){
reg.push(new RegExp(format(g.source,rescape(_284.unescape(d)))));
g="reg[%2].test(%1)";
d=reg.length-1;
}
return "if("+format(g,b,d)+"){";
}});
_256.parse=function(a){
if(!_36[a]){
reg=[];
fn="";
var b=_284.escape(a).split(",");
for(var i=0;i<b.length;i++){
_33=_32=_34=0;
_35=b.length>1?2:0;
var c=_284.exec(b[i])||"throw;";
if(_33&&_0){
c+=format("if(e%1.tagName!='!'){",_32);
}
var d=(_35>1)?_29:"";
c+=format(d+_30,_32);
c+=Array(match(c,/\{/g).length+1).join("}");
fn+=c;
}
eval(format(_31,reg)+_284.unescape(fn)+"return s?null:r}");
_36[a]=fn;
}
return _36[a];
};
};
_177.implement(_213);
_17d.implement(_214);
var _2b5=_177.extend(null,{"@(document.activeElement===undefined)":{bind:function(b){
b.activeElement=null;
_1b5.addEventListener(b,"focus",function(a){
b.activeElement=a.target;
},false);
return this.base(b);
}}});
var _2b8=_17d.extend({addClass:function(a,b){
if(!this.hasClass(a,b)){
a.className+=(a.className?" ":"")+b;
}
},hasClass:function(a,b){
var c=new RegExp("(^|\\s)"+b+"(\\s|$)");
return c.test(a.className);
},removeClass:function(a,b){
var c=new RegExp("(^|\\s)"+b+"(\\s|$)","g");
a.className=a.className.replace(c,"$2");
},toggleClass:function(a,b){
if(this.hasClass(a,b)){
this.removeClass(a,b);
}else{
this.addClass(a,b);
}
}},{bindings:{},tags:"*",bind:function(a){
_201.bind(a.style);
return this.base(a);
},extend:function(){
var b=base(this,arguments);
var c=(b.tags||"").toUpperCase().split(",");
forEach(c,function(a){
_2b8.bindings[a]=b;
});
return b;
},"@!(element.ownerDocument)":{bind:function(a){
a.ownerDocument=_191.getOwnerDocument(a);
return this.base(a);
}}});
_2b8.extend(null,{tags:"APPLET,EMBED",bind:I});
eval(this.exports);
};
if(typeof (base2)=="undefined"){
throw new Error("Base2 not found. wForms 3.0 depends on the base2 library.");
}
if(typeof (wFORMS)=="undefined"){
wFORMS={};
}
wFORMS.NAME="wFORMS";
wFORMS.VERSION="3.0";
wFORMS.__repr__=function(){
return "["+this.NAME+" "+this.VERSION+"]";
};
wFORMS.toString=function(){
return this.__repr__();
};
wFORMS.behaviors={};
wFORMS.helpers={};
wFORMS.instances=[];
wFORMS.helpers.randomId=function(){
var seed=(new Date()).getTime();
seed=seed.toString().substr(6);
for(var i=0;i<6;i++){
seed+=String.fromCharCode(48+Math.floor((Math.random()*10)));
}
return "id_"+seed;
};
wFORMS.helpers.getFieldValue=function(_2ca){
switch(_2ca.tagName){
case "INPUT":
if(_2ca.type=="checkbox"){
return _2ca.checked?_2ca.value:null;
}
if(_2ca.type=="radio"){
return _2ca.checked?_2ca.value:null;
}
return _2ca.value;
break;
case "SELECT":
if(_2ca.selectedIndex==-1){
return null;
}
if(_2ca.getAttribute("multiple")){
var v=[];
for(var i=0;i<_2ca.options.length;i++){
if(_2ca.options[i].selected){
v.push(_2ca.options[i].value);
}
}
return v;
}
return _2ca.options[_2ca.selectedIndex].value;
break;
case "TEXTAREA":
return _2ca.value;
break;
default:
return null;
break;
}
};
wFORMS.helpers.getComputedStyle=function(_2cd,_2ce){
return document.defaultView.getComputedStyle(_2cd,"").getPropertyValue(_2ce);
};
wFORMS.helpers.getLeft=function(elem){
var pos=0;
while(elem.offsetParent){
if(document.defaultView.getComputedStyle(elem,"").getPropertyValue("position")=="relative"){
return pos;
}
if(pos>0&&document.defaultView.getComputedStyle(elem,"").getPropertyValue("position")=="absolute"){
return pos;
}
pos+=elem.offsetLeft;
elem=elem.offsetParent;
}
if(!window.opera&&document.all&&document.compatMode&&document.compatMode!="BackCompat"){
pos+=parseInt(document.body.currentStyle.marginTop);
}
return pos;
};
wFORMS.helpers.getTop=function(elem){
var pos=0;
while(elem.offsetParent){
if(document.defaultView.getComputedStyle(elem,"").getPropertyValue("position")=="relative"){
return pos;
}
if(pos>0&&document.defaultView.getComputedStyle(elem,"").getPropertyValue("position")=="absolute"){
return pos;
}
pos+=elem.offsetTop;
elem=elem.offsetParent;
}
if(!window.opera&&document.all&&document.compatMode&&document.compatMode!="BackCompat"){
pos+=parseInt(document.body.currentStyle.marginLeft)+1;
}
return pos;
};
wFORMS.helpers.activateStylesheet=function(_2d3){
if(document.getElementsByTagName){
var ss=document.getElementsByTagName("link");
}else{
if(document.styleSheets){
var ss=document.styleSheets;
}
}
for(var i=0;ss[i];i++){
if(ss[i].href.indexOf(_2d3)!=-1){
ss[i].disabled=true;
ss[i].disabled=false;
}
}
};
wFORMS.helpers.contains=function(_2d6,_2d7){
var l=_2d6.length;
for(var i=0;i<l;i++){
if(_2d6[i]===_2d7){
return true;
}
}
return false;
};
wFORMS.onLoadHandler=function(){
var _2da=document.getElementsByTagName("FORM");
for(var i=0;i<_2da.length;i++){
if(_2da[i].getAttribute("rel")!="no-behavior"){
wFORMS.applyBehaviors(_2da[i]);
}
}
};
wFORMS.applyBehaviors=function(f){
if(!f.querySelectorAll){
base2.DOM.bind(f);
}
if(wFORMS.behaviors["switch"]){
var b=wFORMS.behaviors["switch"].applyTo(f);
if(!wFORMS.instances["switch"]){
wFORMS.instances["switch"]=[b];
}else{
wFORMS.removeBehavior(f,"switch");
wFORMS.instances["switch"].push(b);
}
}
for(var _2de in wFORMS.behaviors){
if(_2de=="switch"){
continue;
}
var b=wFORMS.behaviors[_2de].applyTo(f);
if(b&&b.constructor.toString().indexOf("Array")==-1){
b=[b];
}
for(var i=0;b&&i<b.length;i++){
if(!wFORMS.instances[_2de]){
wFORMS.instances[_2de]=[b[i]];
}else{
wFORMS.removeBehavior(f,_2de);
wFORMS.instances[_2de].push(b[i]);
}
}
}
};
wFORMS.removeBehavior=function(f,_2e1){
return null;
if(!wFORMS.instances[_2e1]){
return null;
}
for(var i=0;i<wFORMS.instances[_2e1].length;i++){
if(wFORMS.instances[_2e1][i].target==f){
wFORMS.instances[_2e1][i]=null;
}
}
return null;
};
wFORMS.getBehaviorInstance=function(f,_2e4){
if(!wFORMS.instances[_2e4]){
return null;
}
for(var i=0;i<wFORMS.instances[_2e4].length;i++){
if(wFORMS.instances[_2e4][i].target==f){
return wFORMS.instances[_2e4][i];
}
}
return null;
};
if(!document.querySelectorAll){
base2.DOM.bind(document);
}
document.addEventListener("DOMContentLoaded",wFORMS.onLoadHandler,false);
wFORMS.helpers.activateStylesheet("wforms-jsonly.css");
if(typeof (wFORMS)=="undefined"){
throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
wFORMS.behaviors.hint={CSS_INACTIVE:"field-hint-inactive",CSS_ACTIVE:"field-hint",HINT_SELECTOR:"*[id$=\"-H\"]",HINT_SUFFIX:"-H",instance:function(f){
this.behavior=wFORMS.behaviors.hint;
this.target=f;
}};
wFORMS.behaviors.hint.applyTo=function(f){
var b=new wFORMS.behaviors.hint.instance(f);
f.querySelectorAll(wFORMS.behaviors.hint.HINT_SELECTOR).forEach(function(elem){
var e=b.getElementByHintId(elem.id);
if(e){
if(!e.addEventListener){
base2.DOM.bind(e);
}
if(e.tagName=="SELECT"||e.tagName=="TEXTAREA"||(e.tagName=="INPUT"&&e.type!="radio"&&e.type!="checkbox")){
e.addEventListener("focus",function(_2eb){
b.run(_2eb,this);
},false);
e.addEventListener("blur",function(_2ec){
b.run(_2ec,this);
},false);
}else{
e.addEventListener("mouseover",function(_2ed){
b.run(_2ed,e);
},false);
e.addEventListener("mouseout",function(_2ee){
b.run(_2ee,e);
},false);
}
}
});
b.onApply();
return b;
};
wFORMS.behaviors.hint.instance.prototype.onApply=function(){
};
wFORMS.behaviors.hint.instance.prototype.run=function(_2ef,_2f0){
var hint=this.getHintElement(_2f0);
if(!hint){
return;
}
if(_2ef.type=="focus"||_2ef.type=="mouseover"){
hint.removeClass(wFORMS.behaviors.hint.CSS_INACTIVE);
hint.addClass(wFORMS.behaviors.hint.CSS_ACTIVE);
this.setup(hint,_2f0);
}else{
hint.addClass(wFORMS.behaviors.hint.CSS_INACTIVE);
hint.removeClass(wFORMS.behaviors.hint.CSS_ACTIVE);
}
};
wFORMS.behaviors.hint.instance.prototype.getElementByHintId=function(_2f2){
var id=_2f2.substr(0,_2f2.length-wFORMS.behaviors.hint.HINT_SUFFIX.length);
var e=document.getElementById(id);
return e;
};
wFORMS.behaviors.hint.instance.prototype.getHintElement=function(_2f5){
var e=document.getElementById(_2f5.id+this.behavior.HINT_SUFFIX);
return e&&e!=""?e:null;
};
wFORMS.behaviors.hint.instance.prototype.setup=function(hint,_2f8){
var l=((_2f8.tagName=="SELECT"?+_2f8.offsetWidth:0)+wFORMS.helpers.getLeft(_2f8));
var t=(wFORMS.helpers.getTop(_2f8)+_2f8.offsetHeight);
hint.style.left=l+"px";
hint.style.top=t+"px";
};
wFORMS.behaviors.hint.isHintId=function(id){
return id.match(new RegExp(wFORMS.behaviors.hint.HINT_SUFFIX+"$"))!=null;
};
if(typeof (wFORMS)=="undefined"){
throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
wFORMS.behaviors.paging={SELECTOR:".wfPage",CSS_PAGE:"wfPage",CSS_CURRENT_PAGE:"wfCurrentPage",CSS_BUTTON_NEXT:"wfPageNextButton",CSS_BUTTON_PREVIOUS:"wfPagePreviousButton",CSS_BUTTON_PLACEHOLDER:"wfPagingButtons",ID_BUTTON_NEXT_PREFIX:"wfPageNextId",ID_BUTTON_PREVIOUS_PREFIX:"wfPagePreviousId",CSS_SUBMIT_HIDDEN:"wfHideSubmit",ID_PAGE_PREFIX:"wfPgIndex-",ID_PLACEHOLDER_SUFFIX:"-buttons",ATTR_INDEX:"wfPageIndex_activate",MESSAGES:{CAPTION_NEXT:"Next Page",CAPTION_PREVIOUS:"Previous Page"},runValidationOnPageNext:true,onPageNext:function(){
},onPagePrevious:function(){
},onPageChange:function(){
},instance:function(f){
this.behavior=wFORMS.behaviors.paging;
this.target=f;
this.currentPageIndex=1;
}};
wFORMS.behaviors.paging.applyTo=function(f){
var b=new wFORMS.behaviors.paging.instance(f);
var _2ff=wFORMS.behaviors.paging;
var _300=(wFORMS.behaviors.validation&&wFORMS.behaviors.paging.runValidationOnPageNext);
var _301=false;
f.querySelectorAll(wFORMS.behaviors.paging.SELECTOR).forEach(function(elem){
_301=true;
var ph=b.getOrCreatePlaceHolder(elem);
var _304=wFORMS.behaviors.paging.getPageIndex(elem);
if(_304==1){
var ctrl=base2.DOM.bind(ph.appendChild(_2ff._createNextPageButton(_304)));
if(_300){
ctrl.addEventListener("click",function(_306){
var v=wFORMS.getBehaviorInstance(b.target,"validation");
if(v.run(_306,elem)){
b.run(_306,ctrl);
}
},false);
}else{
ctrl.addEventListener("click",function(_308){
b.run(_308,ctrl);
},false);
}
wFORMS.behaviors.paging.showPage(elem);
}else{
var ctrl=base2.DOM.bind(_2ff._createPreviousPageButton(_304));
ph.insertBefore(ctrl,ph.firstChild);
ctrl.addEventListener("click",function(_309){
b.run(_309,ctrl);
},false);
if(!wFORMS.behaviors.paging.isLastPageIndex(_304,true)){
var _30a=base2.DOM.bind(ph.appendChild(_2ff._createNextPageButton(_304)));
if(_300){
_30a.addEventListener("click",function(_30b){
var v=wFORMS.getBehaviorInstance(b.target,"validation");
if(v.run(_30b,elem)){
b.run(_30b,_30a);
}
},false);
}else{
_30a.addEventListener("click",function(_30d){
b.run(_30d,_30a);
},false);
}
}
}
});
if(_301){
p=b.findNextPage(0);
b.currentPageIndex=0;
b.activatePage(wFORMS.behaviors.paging.getPageIndex(p));
b.onApply();
}
return b;
};
wFORMS.behaviors.paging.instance.prototype.onApply=function(){
};
wFORMS.behaviors.paging.getPageIndex=function(elem){
if(elem&&elem.id){
var _30f=elem.id.replace(new RegExp(wFORMS.behaviors.paging.ID_PAGE_PREFIX+"(\\d+)"),"$1");
_30f=parseInt(_30f);
return !isNaN(_30f)?_30f:false;
}
return false;
};
wFORMS.behaviors.paging._createNextPageButton=function(_310){
var elem=wFORMS.behaviors.paging.createNextPageButton();
elem.setAttribute(wFORMS.behaviors.paging.ATTR_INDEX,_310+1);
elem.id=wFORMS.behaviors.paging.ID_BUTTON_NEXT_PREFIX+_310;
return elem;
};
wFORMS.behaviors.paging.createNextPageButton=function(){
var elem=document.createElement("input");
elem.setAttribute("value",wFORMS.behaviors.paging.MESSAGES.CAPTION_NEXT);
elem.setAttribute("type","button");
elem.className=wFORMS.behaviors.paging.CSS_BUTTON_NEXT;
return elem;
};
wFORMS.behaviors.paging._createPreviousPageButton=function(_313){
var elem=wFORMS.behaviors.paging.createPreviousPageButton();
elem.setAttribute(wFORMS.behaviors.paging.ATTR_INDEX,_313-1);
elem.id=wFORMS.behaviors.paging.ID_BUTTON_PREVIOUS_PREFIX+_313;
return elem;
};
wFORMS.behaviors.paging.createPreviousPageButton=function(){
var elem=document.createElement("input");
elem.setAttribute("value",wFORMS.behaviors.paging.MESSAGES.CAPTION_PREVIOUS);
elem.setAttribute("type","button");
elem.className=wFORMS.behaviors.paging.CSS_BUTTON_PREVIOUS;
return elem;
};
wFORMS.behaviors.paging.instance.prototype.getOrCreatePlaceHolder=function(_316){
var id=_316.id+wFORMS.behaviors.paging.ID_PLACEHOLDER_SUFFIX;
var elem=document.getElementById(id);
if(!elem){
elem=_316.appendChild(document.createElement("div"));
elem.id=id;
elem.className=wFORMS.behaviors.paging.CSS_BUTTON_PLACEHOLDER;
}
return elem;
};
wFORMS.behaviors.paging.hidePage=function(e){
if(e){
e.removeClass(wFORMS.behaviors.paging.CSS_CURRENT_PAGE);
e.addClass(wFORMS.behaviors.paging.CSS_PAGE);
}
};
wFORMS.behaviors.paging.showPage=function(e){
if(e){
e.removeClass(wFORMS.behaviors.paging.CSS_PAGE);
e.addClass(wFORMS.behaviors.paging.CSS_CURRENT_PAGE);
}
};
wFORMS.behaviors.paging.instance.prototype.activatePage=function(_31b){
if(_31b==this.currentPageIndex){
return false;
}
_31b=parseInt(_31b);
if(_31b>this.currentPageIndex){
var p=this.findNextPage(this.currentPageIndex);
}else{
var p=this.findPreviousPage(this.currentPageIndex);
}
if(p){
var _31d=this;
setTimeout(function(){
var _31e=_31d.behavior.getPageIndex(p);
_31d.setupManagedControls(_31e);
_31d.behavior.hidePage(_31d.behavior.getPageByIndex(_31d.currentPageIndex));
_31d.behavior.showPage(p);
var _31f=_31d.currentPageIndex;
_31d.currentPageIndex=_31e;
_31d.behavior.onPageChange(p);
if(_31e>_31f){
_31d.behavior.onPageNext(p);
}else{
_31d.behavior.onPagePrevious(p);
}
},1);
}
};
wFORMS.behaviors.paging.instance.prototype.setupManagedControls=function(_320){
if(!_320){
_320=this.currentPageIndex;
}
var b=wFORMS.behaviors.paging;
if(b.isFirstPageIndex(_320)){
if(ctrl=b.getPreviousButton(_320)){
ctrl.style.display="none";
}
}else{
if(ctrl=b.getPreviousButton(_320)){
ctrl.style.display="inline";
}
}
if(b.isLastPageIndex(_320)){
if(ctrl=b.getNextButton(_320)){
ctrl.style.display="none";
}
this.showSubmitButtons();
}else{
if(ctrl=b.getNextButton(_320)){
ctrl.style.display="inline";
}
this.hideSubmitButtons();
}
};
wFORMS.behaviors.paging.instance.prototype.showSubmitButtons=function(){
this.target.querySelectorAll("input[type~=\"submit\"]").forEach(function(elem){
elem.removeClass(wFORMS.behaviors.paging.CSS_SUBMIT_HIDDEN);
});
};
wFORMS.behaviors.paging.instance.prototype.hideSubmitButtons=function(){
this.target.querySelectorAll("input[type~=\"submit\"]").forEach(function(elem){
elem.addClass(wFORMS.behaviors.paging.CSS_SUBMIT_HIDDEN);
});
};
wFORMS.behaviors.paging.getPageByIndex=function(_324){
var page=document.getElementById(wFORMS.behaviors.paging.ID_PAGE_PREFIX+_324);
return page?base2.DOM.bind(page):false;
};
wFORMS.behaviors.paging.getNextButton=function(_326){
return document.getElementById(wFORMS.behaviors.paging.ID_BUTTON_NEXT_PREFIX+_326);
};
wFORMS.behaviors.paging.getPreviousButton=function(_327){
return document.getElementById(wFORMS.behaviors.paging.ID_BUTTON_PREVIOUS_PREFIX+_327);
};
wFORMS.behaviors.paging.isLastPageIndex=function(_328,_329){
_328=parseInt(_328)+1;
var b=wFORMS.behaviors.paging;
var p=b.getPageByIndex(_328);
if((_b=wFORMS.behaviors["switch"])&&!_329){
while(p&&_b.isSwitchedOff(p)){
_328++;
p=b.getPageByIndex(_328);
}
}
return p?false:true;
};
wFORMS.behaviors.paging.isFirstPageIndex=function(_32c,_32d){
_32c=parseInt(_32c)-1;
var b=wFORMS.behaviors.paging;
var p=b.getPageByIndex(_32c);
if((_b=wFORMS.behaviors["switch"])&&!_32d){
while(p&&_b.isSwitchedOff(p)){
_32c--;
p=b.getPageByIndex(_32c);
}
}
return p?false:true;
};
wFORMS.behaviors.paging.instance.prototype.findNextPage=function(_330){
_330=parseInt(_330)+1;
var b=wFORMS.behaviors.paging;
var p=b.getPageByIndex(_330);
if(_b=wFORMS.behaviors["switch"]){
while(p&&_b.isSwitchedOff(p)){
_330++;
p=b.getPageByIndex(_330);
}
}
return p?p:true;
};
wFORMS.behaviors.paging.instance.prototype.findPreviousPage=function(_333){
_333=parseInt(_333)-1;
var b=wFORMS.behaviors.paging;
var p=b.getPageByIndex(_333);
if(_b=wFORMS.behaviors["switch"]){
while(p&&_b.isSwitchedOff(p)){
_333--;
p=b.getPageByIndex(_333);
}
}
return p?p:false;
};
wFORMS.behaviors.paging.instance.prototype.run=function(e,_337){
this.activatePage(_337.getAttribute(wFORMS.behaviors.paging.ATTR_INDEX));
};
if(typeof (wFORMS)=="undefined"){
throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
wFORMS.behaviors.repeat={SELECTOR_REPEAT:"*[class~=\"repeat\"]",SELECTOR_REMOVEABLE:"*[class~=\"removeable\"]",ID_SUFFIX_DUPLICATE_LINK:"-wfDL",ID_SUFFIX_COUNTER:"-RC",CSS_DUPLICATE_LINK:"duplicateLink",CSS_DUPLICATE_SPAN:"duplicateSpan",CSS_DELETE_LINK:"removeLink",CSS_DELETE_SPAN:"removeSpan",CSS_REMOVEABLE:"removeable",CSS_REPEATABLE:"repeat",ATTR_DUPLICATE:"wfr__dup",ATTR_DUPLICATE_ELEM:"wfr__dup_elem",ATTR_HANDLED:"wfr_handled",ATTR_MASTER_SECTION:"wfr__master_sec",ATTR_LINK_SECTION_ID:"wfr_sec_id",MESSAGES:{ADD_CAPTION:"Add another response",ADD_TITLE:"Will duplicate this question or section.",REMOVE_CAPTION:"Remove",REMOVE_TITLE:"Will remove this question or section"},UPDATEABLE_ATTR_ARRAY:["id","name","for"],preserveRadioName:false,CSS_PRESERVE_RADIO_NAME:"preserveRadioName",onRepeat:function(elem){
},onRemove:function(){
},allowRepeat:function(elem,b){
return true;
},instance:function(f){
this.behavior=wFORMS.behaviors.repeat;
this.target=f;
}};
wFORMS.behaviors.repeat.applyTo=function(f){
var _33d=this;
var b=new Array();
f.querySelectorAll(this.SELECTOR_REPEAT).forEach(function(elem){
if(_33d.isHandled(elem)){
return;
}
if(!elem.id){
elem.id=wFORMS.helpers.randomId();
}
var _b=new _33d.instance(elem);
var e=_b.getOrCreateRepeatLink(elem);
e.addEventListener("click",function(_342){
_b.run(_342,e);
},false);
b.push(_b);
_33d.handleElement(elem);
});
var _343=function(elem){
e=_33d.createRemoveLink(elem.id);
if(elem.tagName=="TR"){
var tds=elem.getElementsByTagName("TD");
var _346=tds[tds.length-1];
_346.appendChild(e);
}else{
elem.appendChild(e);
}
};
if(f.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE)){
_343(f);
}
f.querySelectorAll(this.SELECTOR_REMOVEABLE).forEach(function(e){
_343(e);
});
for(var i=0;i<b.length;i++){
b[i].onApply();
}
return b;
};
wFORMS.behaviors.repeat.instance.prototype.onApply=function(){
};
wFORMS.behaviors.repeat.instance.prototype.getOrCreateRepeatLink=function(elem){
var id=elem.id+wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK;
var e=document.getElementById(id);
if(!e||e==""){
e=this.createRepeatLink(id);
var _34c=document.createElement("span");
_34c.className=wFORMS.behaviors.repeat.CSS_DUPLICATE_SPAN;
e=_34c.appendChild(e);
if(elem.tagName.toUpperCase()=="TR"){
var _34d=elem.getElementsByTagName("TD");
if(!_34d){
_34d=elem.appendChild(document.createElement("TD"));
}else{
_34d=_34d[_34d.length-1];
}
_34d.appendChild(_34c);
}else{
elem.appendChild(_34c);
}
}
return base2.DOM.bind(e);
};
wFORMS.behaviors.repeat.instance.prototype.createRepeatLink=function(id){
var _34f=document.createElement("A");
_34f.id=id;
_34f.setAttribute("href","#");
_34f.className=wFORMS.behaviors.repeat.CSS_DUPLICATE_LINK;
_34f.setAttribute("title",wFORMS.behaviors.repeat.MESSAGES.ADD_TITLE);
_34f.appendChild(document.createElement("span").appendChild(document.createTextNode(wFORMS.behaviors.repeat.MESSAGES.ADD_CAPTION)));
return _34f;
};
wFORMS.behaviors.repeat.createRemoveLink=function(id){
var _351=document.createElement("a");
_351.id=id+wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK;
_351.setAttribute("href","#");
_351.className=wFORMS.behaviors.repeat.CSS_DELETE_LINK;
_351.setAttribute("title",wFORMS.behaviors.repeat.MESSAGES.REMOVE_TITLE);
_351.setAttribute(wFORMS.behaviors.repeat.ATTR_LINK_SECTION_ID,id);
var _352=document.createElement("span");
_352.appendChild(document.createTextNode(wFORMS.behaviors.repeat.MESSAGES.REMOVE_CAPTION));
_351.appendChild(_352);
_351.onclick=function(_353){
wFORMS.behaviors.repeat.onRemoveLinkClick(_353,_351);
};
var _352=document.createElement("span");
_352.className=wFORMS.behaviors.repeat.CSS_DELETE_SPAN;
_352.appendChild(_351);
return _352;
};
wFORMS.behaviors.repeat.instance.prototype.getTargetByRepeatLink=function(elem){
return this.target.matchSingle("#"+elem.id.substring(0,elem.id.length-wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK.length));
};
wFORMS.behaviors.repeat.instance.prototype.duplicateSection=function(elem){
if(!this.behavior.allowRepeat(elem,this)){
return false;
}
this.updateMasterSection(elem);
var _356=elem.cloneNode(true);
_356=elem.parentNode.insertBefore(_356,this.getInsertNode(elem));
this.updateDuplicatedSection(_356);
wFORMS.applyBehaviors(_356);
wFORMS.behaviors.repeat.onRepeat(_356);
};
wFORMS.behaviors.repeat.removeSection=function(id){
var elem=document.getElementById(id);
if(elem!=""){
elem.parentNode.removeChild(elem);
wFORMS.behaviors.repeat.onRemove();
}
};
wFORMS.behaviors.repeat.instance.prototype.getInsertNode=function(elem){
var _35a=elem.nextSibling;
if(_35a&&_35a.nodeType==1&&!_35a.hasClass){
_35a=base2.DOM.bind(_35a);
}
while(_35a&&(_35a.nodeType==3||_35a.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE))){
_35a=_35a.nextSibling;
if(_35a&&_35a.nodeType==1&&!_35a.hasClass){
_35a=base2.DOM.bind(_35a);
}
}
return _35a;
};
wFORMS.behaviors.repeat.onRemoveLinkClick=function(_35b,elem){
this.removeSection(elem.getAttribute(wFORMS.behaviors.repeat.ATTR_LINK_SECTION_ID));
if(_35b){
_35b.preventDefault();
}
};
wFORMS.behaviors.repeat.instance.prototype.updateMasterSection=function(elem){
if(elem.doItOnce==true){
return true;
}else{
elem.doItOnce=true;
}
var _35e=this.createSuffix(elem);
elem.id=this.clearSuffix(elem.id)+_35e;
this.updateMasterElements(elem,_35e);
};
wFORMS.behaviors.repeat.instance.prototype.updateMasterElements=function(elem,_360){
if(!elem||elem.nodeType!=1){
return;
}
var cn=elem.childNodes;
for(var i=0;i<cn.length;i++){
var n=cn[i];
if(n.nodeType!=1){
continue;
}
if(!n.hasClass){
n.hasClass=function(_364){
return base2.DOM.HTMLElement.hasClass(this,_364);
};
}
var _365=_360;
if(n.hasClass(wFORMS.behaviors.repeat.CSS_REPEATABLE)){
_360+="[0]";
}
if(!n.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE)){
for(var j=0;j<wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY.length;j++){
var _367=wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY[j];
var _368=this.clearSuffix(n.getAttribute(_367));
if(!_368){
continue;
}
if(_367=="id"&&wFORMS.behaviors.hint&&wFORMS.behaviors.hint.isHintId(n.id)){
n.id=_368.replace(new RegExp("(.*)("+wFORMS.behaviors.hint.HINT_SUFFIX+")$"),"$1"+_360+"$2");
}else{
if(_367=="id"&&wFORMS.behaviors.validation&&wFORMS.behaviors.validation.isErrorPlaceholderId(n.id)){
n.id=_368.replace(new RegExp("(.*)("+wFORMS.behaviors.validation.ERROR_PLACEHOLDER_SUFFIX+")$"),"$1"+_360+"$2");
}else{
if(_367=="id"&&n.id.indexOf(wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK)!=-1){
n.id=_368.replace(new RegExp("(.*)("+wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK+")$"),"$1"+_360+"$2");
}else{
if(_367=="id"){
n.id=_368+_360;
}else{
if(_367=="name"){
n.name=_368+_360;
}else{
n.setAttribute(_367,_368+_360);
}
}
}
}
}
}
this.updateMasterElements(n,_360);
}
_360=_365;
}
};
wFORMS.behaviors.repeat.instance.prototype.updateDuplicatedSection=function(elem){
var _36a=this.getNextDuplicateIndex(this.target);
var _36b=this.createSuffix(elem,_36a);
elem.setAttribute(this.behavior.ATTR_MASTER_SECTION,elem.id);
elem.id=this.clearSuffix(elem.id)+_36b;
elem.className=elem.className.replace(this.behavior.CSS_REPEATABLE,this.behavior.CSS_REMOVEABLE);
if(!elem.hasClass){
elem.hasClass=function(_36c){
return base2.DOM.HTMLElement.hasClass(this,_36c);
};
}
if(elem.hasClass(this.behavior.CSS_PRESERVE_RADIO_NAME)){
var _36d=true;
}else{
var _36d=this.behavior.preserveRadioName;
}
this.updateSectionChildNodes(elem,_36b,_36d);
};
wFORMS.behaviors.repeat.instance.prototype.updateSectionChildNodes=function(elem,_36f,_370){
var _371=new Array();
var l=elem.childNodes.length;
for(var i=0;i<l;i++){
var e=elem.childNodes[i];
if(e.nodeType!=1){
continue;
}
if(!e.hasClass){
e.hasClass=function(_375){
return base2.DOM.HTMLElement.hasClass(this,_375);
};
}
if(this.behavior.isDuplicate(e)){
_371.push(e);
continue;
}
if(e.hasClass(this.behavior.CSS_DUPLICATE_SPAN)){
_371.push(e);
continue;
}
if(e.hasClass(this.behavior.CSS_DUPLICATE_LINK)){
_371.push(e);
continue;
}
if(e.tagName=="INPUT"||e.tagName=="TEXTAREA"){
if(e.type!="radio"&&e.type!="checkbox"){
e.value="";
}else{
e.checked=false;
}
}
this.updateAttributes(e,_36f,_370);
if(e.hasClass(this.behavior.CSS_REPEATABLE)){
this.updateSectionChildNodes(e,this.createSuffix(e),_370);
}else{
this.updateSectionChildNodes(e,_36f,_370);
}
}
for(var i=0;i<_371.length;i++){
var e=_371[i];
if(e.clearAttributes){
e.clearAttributes(false);
}
if(e.parentNode){
e.parentNode.removeChild(e);
}
}
};
wFORMS.behaviors.repeat.instance.prototype.createSuffix=function(e,_377){
var _378="["+(_377?_377:"0")+"]";
var reg=/\[(\d+)\]$/;
e=e.parentNode;
while(e){
if(e.hasClass&&(e.hasClass(wFORMS.behaviors.repeat.CSS_REPEATABLE)||e.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE))){
var idx=reg.exec(e.id);
if(idx){
idx=idx[1];
}
_378="["+(idx?idx:"0")+"]"+_378;
}
e=e.parentNode;
}
return _378;
};
wFORMS.behaviors.repeat.instance.prototype.clearSuffix=function(_37b){
if(!_37b){
return;
}
if(_37b.indexOf("[")!=-1){
return _37b.substring(0,_37b.indexOf("["));
}
return _37b;
};
wFORMS.behaviors.repeat.instance.prototype.updateAttributes=function(e,_37d,_37e){
var _37f=wFORMS.behaviors.hint&&wFORMS.behaviors.hint.isHintId(e.id);
var _380=wFORMS.behaviors.validation&&wFORMS.behaviors.validation.isErrorPlaceholderId(e.id);
var _381=e.id.indexOf(wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK)!=-1;
wFORMS.behaviors.repeat.setInDuplicateGroup(e);
if(wFORMS.behaviors.repeat.isHandled(e)){
wFORMS.behaviors.repeat.removeHandled(e);
}
if(wFORMS.behaviors["switch"]&&wFORMS.behaviors["switch"].isHandled(e)){
wFORMS.behaviors["switch"].removeHandle(e);
}
var l=wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY.length;
for(var i=0;i<l;i++){
var _384=wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY[i];
var _385=this.clearSuffix(e.getAttribute(_384));
if(!_385){
continue;
}
if(_384=="name"&&e.tagName=="INPUT"&&_37e){
continue;
}else{
if(_380&&_384=="id"){
e.id=_385+_37d+wFORMS.behaviors.validation.ERROR_PLACEHOLDER_SUFFIX;
}else{
if(_37f&&_384=="id"){
e.id=_385+_37d+wFORMS.behaviors.hint.HINT_SUFFIX;
}else{
if(_381&&_384=="id"){
e.id=_385.replace(new RegExp("(.*)("+wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK+")$"),"$1"+_37d+"$2");
}else{
if(_384=="id"){
e.id=_385+_37d;
}else{
if(_384=="name"){
e.name=_385+_37d;
}else{
e.setAttribute(_384,_385+_37d);
}
}
}
}
}
}
}
};
wFORMS.behaviors.repeat.instance.prototype.getNextDuplicateIndex=function(elem){
var c=wFORMS.behaviors.repeat.getOrCreateCounterField(elem);
var _388=parseInt(c.value)+1;
c.value=_388;
return _388;
};
wFORMS.behaviors.repeat.getOrCreateCounterField=function(elem){
var cId=elem.id+wFORMS.behaviors.repeat.ID_SUFFIX_COUNTER;
var _38b=document.getElementById(cId);
if(!_38b||_38b==""){
_38b=wFORMS.behaviors.repeat.createCounterField(cId);
var _38c=elem.parentNode;
while(_38c&&_38c.tagName.toUpperCase()!="FORM"){
_38c=_38c.parentNode;
}
_38c.appendChild(_38b);
}
return _38b;
};
wFORMS.behaviors.repeat.createCounterField=function(id){
cElem=document.createElement("input");
cElem.id=id;
cElem.setAttribute("type","hidden");
cElem.setAttribute("name",id);
cElem.value="0";
return cElem;
};
wFORMS.behaviors.repeat.instance.prototype.getDuplicatedSectionsCount=function(){
var b=wFORMS.behaviors.repeat;
if(b.isDuplicate(this.target)){
return false;
}
return parseInt(b.getOrCreateCounterField(this.target).value);
};
wFORMS.behaviors.repeat.instance.prototype.getSectionsCount=function(){
var b=wFORMS.behaviors.repeat;
if(b.isDuplicate(this.target)){
return false;
}
return parseInt(b.getOrCreateCounterField(this.target).value)+1;
};
wFORMS.behaviors.repeat.isDuplicate=function(elem){
return elem.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE);
};
wFORMS.behaviors.repeat.setDuplicate=function(elem){
};
wFORMS.behaviors.repeat.isInDuplicateGroup=function(elem){
return elem.getAttribute(wFORMS.behaviors.repeat.ATTR_DUPLICATE_ELEM)?true:false;
};
wFORMS.behaviors.repeat.setInDuplicateGroup=function(elem){
return elem.setAttribute(wFORMS.behaviors.repeat.ATTR_DUPLICATE_ELEM,true);
};
wFORMS.behaviors.repeat.isHandled=function(elem){
return elem.getAttribute(wFORMS.behaviors.repeat.ATTR_HANDLED);
};
wFORMS.behaviors.repeat.getMasterSection=function(elem){
if(!wFORMS.behaviors.repeat.isDuplicate(elem)){
return false;
}
var e=document.getElementById(elem.getAttribute(wFORMS.behaviors.repeat.ATTR_MASTER_SECTION));
return e==""?null:e;
};
wFORMS.behaviors.repeat.handleElement=function(elem){
return elem.setAttribute(wFORMS.behaviors.repeat.ATTR_HANDLED,true);
};
wFORMS.behaviors.repeat.removeHandled=function(elem){
return elem.removeAttribute(wFORMS.behaviors.repeat.ATTR_HANDLED);
};
wFORMS.behaviors.repeat.instance.prototype.run=function(e,_39a){
this.duplicateSection(this.target);
if(e){
e.preventDefault();
}
};
if(typeof (wFORMS)=="undefined"){
throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
wFORMS.behaviors["switch"]={SELECTOR:"*[class*=\"switch-\"]",CSS_PREFIX:"switch-",CSS_OFFSTATE_PREFIX:"offstate-",CSS_ONSTATE_PREFIX:"onstate-",CSS_ONSTATE_FLAG:"swtchIsOn",CSS_OFFSTATE_FLAG:"swtchIsOff",onSwitchOn:function(elem){
},onSwitchOff:function(elem){
},onSwitch:function(form){
},instance:function(f){
this.behavior=wFORMS.behaviors["switch"];
this.target=f;
}};
wFORMS.behaviors["switch"].applyTo=function(f){
var b=new wFORMS.behaviors["switch"].instance(f);
f.querySelectorAll(wFORMS.behaviors["switch"].SELECTOR).forEach(function(elem){
if(!elem.id){
elem.id=wFORMS.helpers.randomId();
}
switch(elem.tagName.toUpperCase()){
case "OPTION":
var _3a2=elem.parentNode;
while(_3a2&&_3a2.tagName.toUpperCase()!="SELECT"){
_3a2=_3a2.parentNode;
}
base2.DOM.bind(_3a2);
if(_3a2&&!wFORMS.behaviors["switch"].isHandled(_3a2)){
_3a2.addEventListener("change",function(_3a3){
b.run(_3a3,_3a2);
},false);
b.setupTargets(elem);
wFORMS.behaviors["switch"].handleElement(_3a2);
}
break;
case "INPUT":
if(elem.type&&elem.type.toUpperCase()=="RADIO"){
if(!wFORMS.behaviors["switch"].isHandled(elem)){
b.setupTargets(elem);
}
var _3a4=elem.form[elem.name];
for(var i=_3a4.length-1;i>=0;i--){
var _3a6=base2.DOM.bind(_3a4[i]);
if(!wFORMS.behaviors["switch"].isHandled(_3a6)){
_3a6.addEventListener("click",function(_3a7){
b.run(_3a7,_3a6);
},false);
wFORMS.behaviors["switch"].handleElement(_3a6);
}
}
}else{
elem.addEventListener("click",function(_3a8){
b.run(_3a8,elem);
},false);
b.setupTargets(elem);
}
break;
default:
elem.addEventListener("click",function(_3a9){
b.run(_3a9,elem);
},false);
break;
}
});
b.onApply();
return b;
};
wFORMS.behaviors["switch"].instance.prototype.onApply=function(){
};
wFORMS.behaviors["switch"].isHandled=function(elem){
return elem.getAttribute("rel")&&elem.getAttribute("rel").indexOf("wfHandled")>-1;
};
wFORMS.behaviors["switch"].handleElement=function(elem){
return elem.setAttribute("rel",(elem.getAttribute("rel")||"")+" wfHandled");
};
wFORMS.behaviors["switch"].removeHandle=function(elem){
if(attr=elem.getAttribute("rel")){
if(attr=="wfHandled"){
elem.removeAttribute("rel");
}else{
if(attr.indexOf("wfHandled")!=-1){
elem.setAttribute("rel",attr.replace(/(.*)( wfHandled)(.*)/,"$1$3"));
}
}
}
};
wFORMS.behaviors["switch"].instance.prototype.getTriggersByElements=function(_3ad,_3ae){
var o={ON:new Array(),OFF:new Array(),toString:function(){
return "ON: "+this.ON+"\nOFF: "+this.OFF;
}};
for(var i=0;i<_3ad.length;i++){
var elem=_3ad[i];
switch(elem.tagName.toUpperCase()){
case "OPTION":
if(elem.selected){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(elem,_3ae));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(elem,_3ae));
}
break;
case "SELECT":
for(var j=0;j<elem.options.length;j++){
var opt=elem.options.item(j);
if(opt.selected){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(opt,_3ae));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(opt,_3ae));
}
}
break;
case "INPUT":
if(elem.type&&elem.type.toUpperCase()=="RADIO"){
var _3b4=elem.form[elem.name];
if(!_3b4){
break;
}
for(var j=_3b4.length-1;j>=0;j--){
var _3b5=_3b4[j];
if(_3b5==elem||!wFORMS.helpers.contains(_3ad,_3b5)){
if(_3b5.checked){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(_3b5,_3ae));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(_3b5,_3ae));
}
}
}
}else{
if(elem.checked){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(elem,_3ae));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(elem,_3ae));
}
}
break;
default:
if(elem.hasClass(this.behavior.CSS_ONSTATE_FLAG)){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(elem,_3ae));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(elem,_3ae));
}
break;
}
}
var _ON=new Array();
for(var i=0;i<o.ON.length;i++){
if(!wFORMS.helpers.contains(_ON,o.ON[i])){
_ON.push(o.ON[i]);
}
}
var _OFF=new Array();
for(var i=0;i<o.OFF.length;i++){
if(!wFORMS.helpers.contains(_OFF,o.OFF[i])){
_OFF.push(o.OFF[i]);
}
}
o.ON=_ON;
o.OFF=_OFF;
return o;
};
wFORMS.behaviors["switch"].getSwitchNamesFromTrigger=function(elem,_3b9){
return wFORMS.behaviors["switch"].getSwitchNames(elem.className,"trigger",_3b9);
};
wFORMS.behaviors["switch"].getSwitchNamesFromTarget=function(elem,_3bb){
return wFORMS.behaviors["switch"].getSwitchNames(elem.className,"target",_3bb);
};
wFORMS.behaviors["switch"].getSwitchNames=function(_3bc,_3bd,_3be){
if(!_3bc||_3bc==""){
return [];
}
var _3bf=_3bc.split(" ");
var _3c0=new Array();
if(_3bd=="trigger"){
var _3c1=true;
}else{
var _3c1=false;
}
for(var i=_3bf.length-1;i>=0;i--){
var cn=_3bf[i];
if(_3c1){
if(cn.indexOf(this.CSS_PREFIX)==0){
var sn=cn.substring(this.CSS_PREFIX.length);
}
}else{
if(cn.indexOf(this.CSS_ONSTATE_PREFIX)==0){
var sn=cn.substring(this.CSS_ONSTATE_PREFIX.length);
}else{
if(cn.indexOf(this.CSS_OFFSTATE_PREFIX)==0){
var sn=cn.substring(this.CSS_OFFSTATE_PREFIX.length);
}
}
}
if(sn&&(!_3be||wFORMS.helpers.contains(_3be,sn))){
_3c0.push(sn);
}
}
return _3c0;
};
wFORMS.behaviors["switch"].instance.prototype.getTargetsBySwitchName=function(_3c5,_3c6){
var res=new Array();
var _3c8=this;
var b=wFORMS.behaviors.repeat;
if(arguments[1]=="ON"){
var _3ca=[wFORMS.behaviors["switch"].CSS_ONSTATE_PREFIX+_3c5];
}else{
var _3ca=[wFORMS.behaviors["switch"].CSS_OFFSTATE_PREFIX+_3c5];
}
this.target.querySelectorAll("."+_3ca).forEach(function(elem){
if(b&&b.isInDuplicateGroup(elem)&&!(b.isDuplicate(_3c8.target)||b.isInDuplicateGroup(_3c8.target))){
return;
}
res.push(base2.DOM.bind(elem));
});
return res;
};
wFORMS.behaviors["switch"].instance.prototype.getTriggersByTarget=function(_3cc){
var res=new Array();
var _3ce=this;
var _3cf=wFORMS.behaviors["switch"].getSwitchNamesFromTarget(_3cc);
var b=wFORMS.behaviors.repeat;
base2.forEach(_3cf,function(name){
_3ce.target.querySelectorAll("."+wFORMS.behaviors["switch"].CSS_PREFIX+name).forEach(function(elem){
if(b&&b.isInDuplicateGroup(elem)&&!(b.isDuplicate(_3cc)||b.isInDuplicateGroup(_3cc))){
return;
}
res.push(base2.DOM.bind(elem));
});
});
return this.getTriggersByElements(res,_3cf);
};
wFORMS.behaviors["switch"].instance.prototype.setupTargets=function(elem){
this.run(null,elem);
};
wFORMS.behaviors["switch"].isSwitchedOff=function(elem){
return (elem.className.match(new RegExp(wFORMS.behaviors["switch"].CSS_OFFSTATE_PREFIX+"[^ ]*"))?true:false)&&(elem.className.match(new RegExp(wFORMS.behaviors["switch"].CSS_ONSTATE_PREFIX+"[^ ]*"))?false:true);
};
wFORMS.behaviors["switch"].instance.prototype.run=function(e,_3d6){
if(!_3d6.hasClass){
base2.DOM.bind(_3d6);
}
if(_3d6.hasClass(this.behavior.CSS_ONSTATE_FLAG)){
_3d6.removeClass(this.behavior.CSS_ONSTATE_FLAG);
_3d6.addClass(this.behavior.CSS_OFFSTATE_FLAG);
if(e){
e.preventDefault();
}
}else{
if(_3d6.hasClass(this.behavior.CSS_OFFSTATE_FLAG)){
_3d6.removeClass(this.behavior.CSS_OFFSTATE_FLAG);
_3d6.addClass(this.behavior.CSS_ONSTATE_FLAG);
if(e){
e.preventDefault();
}
}
}
var _3d7=this.getTriggersByElements(new Array(_3d6));
var _3d8=this;
base2.forEach(_3d7.OFF,function(_3d9){
var _3da=_3d8.getTargetsBySwitchName(_3d9,"ON");
base2.forEach(_3da,function(elem){
var _3dc=_3d8.getTriggersByTarget(elem);
if(_3dc.ON.length==0){
elem.addClass(wFORMS.behaviors["switch"].CSS_OFFSTATE_PREFIX+_3d9);
elem.removeClass(wFORMS.behaviors["switch"].CSS_ONSTATE_PREFIX+_3d9);
_3d8.behavior.onSwitchOff(elem);
}
});
});
base2.forEach(_3d7.ON,function(_3dd){
var _3de=_3d8.getTargetsBySwitchName(_3dd,"OFF");
base2.forEach(_3de,function(elem){
elem.removeClass(wFORMS.behaviors["switch"].CSS_OFFSTATE_PREFIX+_3dd);
elem.addClass(wFORMS.behaviors["switch"].CSS_ONSTATE_PREFIX+_3dd);
_3d8.behavior.onSwitchOn(elem);
});
});
if(b=wFORMS.getBehaviorInstance(this.target,"paging")){
b.setupManagedControls();
}
this.behavior.onSwitch(this.target);
};
if(typeof (wFORMS)=="undefined"){
throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
wFORMS.behaviors.validation={ERROR_PLACEHOLDER_SUFFIX:"-E",rules:{isRequired:{selector:".required",check:"validateRequired"},isAlpha:{selector:".validate-alpha",check:"validateAlpha"},isAlphanum:{selector:".validate-alphanum",check:"validateAlphanum"},isDate:{selector:".validate-date",check:"validateDate"},isTime:{selector:".validate-time",check:"validateTime"},isEmail:{selector:".validate-email",check:"validateEmail"},isInteger:{selector:".validate-integer",check:"validateInteger"},isFloat:{selector:".validate-float",check:"validateFloat"},isCustom:{selector:".validate-custom",check:"validateCustom"}},styling:{fieldError:"errFld",errorMessage:"errMsg"},messages:{isRequired:"This field is required. ",isAlpha:"The text must use alphabetic characters only (a-z, A-Z). Numbers are not allowed.",isEmail:"This does not appear to be a valid email address.",isInteger:"Please enter an integer.",isFloat:"Please enter a number (ex. 1.9).",isAlphanum:"Please use alpha-numeric characters only [a-z 0-9].",isDate:"This does not appear to be a valid date.",isCustom:"Please enter a valid value.",notification:"%% error(s) detected. Your form has not been submitted yet.\nPlease check the information you provided."},instance:function(f){
this.behavior=wFORMS.behaviors.validation;
this.target=f;
},onPass:function(f){
},onFail:function(f){
}};
wFORMS.behaviors.validation.applyTo=function(f){
if(!f||!f.tagName){
throw new Error("Can't apply behavior to "+f);
}
if(f.tagName!="FORM"){
if(f.form){
f=f.form;
}else{
var _f=f;
for(f=f.parentNode;f&&f.tagName!="FORM";f=f.parentNode){
continue;
}
if(!f||f.tagName!="FORM"){
f=_f.getElementsByTagName("form");
}
}
}
if(!f.tagName&&f.length>0){
var v=new Array();
for(var i=0;i<f.length;i++){
var _v=new wFORMS.behaviors.validation.instance(f[i]);
if(!f[i].addEventListener){
base2.DOM.bind(f[i]);
}
f[i].addEventListener("submit",function(e){
return _v.run(e,this);
},false);
v.push(_v);
_v.onApply();
}
}else{
var v=new wFORMS.behaviors.validation.instance(f);
if(!f.addEventListener){
base2.DOM.bind(f);
}
f.addEventListener("submit",function(e){
return v.run(e,this);
},false);
v.onApply();
}
return v;
};
wFORMS.behaviors.validation.instance.prototype.onApply=function(){
};
wFORMS.behaviors.validation.instance.prototype.run=function(e,_3eb){
var _3ec=0;
this.elementsInError={};
for(var _3ed in this.behavior.rules){
var rule=this.behavior.rules[_3ed];
var _3ef=this;
if(!_3eb.querySelectorAll){
base2.DOM.bind(_3eb);
}
_3eb.querySelectorAll(rule.selector).forEach(function(_3f0){
if(_3ef.isSwitchedOff(_3f0)){
return;
}
var _3f1=wFORMS.helpers.getFieldValue(_3f0);
if(rule.check.call){
var _3f2=rule.check.call(_3ef,_3f0,_3f1);
}else{
var _3f2=_3ef[rule.check].call(_3ef,_3f0,_3f1);
}
if(!_3f2){
if(!_3f0.id){
_3f0.id=wFORMS.helpers.randomId();
}
_3ef.elementsInError[_3f0.id]={id:_3f0.id,rule:_3ed};
_3ef.removeErrorMessage(_3f0);
if(rule.fail){
rule.fail.call(_3ef,_3f0,_3ed);
}else{
_3ef.fail.call(_3ef,_3f0,_3ed);
}
_3ec++;
}else{
if(!_3ef.elementsInError[_3f0.id]){
_3ef.removeErrorMessage(_3f0);
}
if(rule.pass){
rule.pass.call(_3ef,_3f0);
}else{
_3ef.pass.call(_3ef,_3f0);
}
}
});
}
if(_3ec>0){
if(e){
e.preventDefault?e.preventDefault():e.returnValue=false;
}
if(this.behavior.onFail){
this.behavior.onFail();
}
return false;
}
if(this.behavior.onPass){
this.behavior.onPass();
}
return true;
};
wFORMS.behaviors.validation.instance.prototype.fail=function(_3f3,_3f4){
_3f3.addClass(this.behavior.styling.fieldError);
this.addErrorMessage(_3f3,this.behavior.messages[_3f4]);
},wFORMS.behaviors.validation.instance.prototype.pass=function(_3f5){
};
wFORMS.behaviors.validation.instance.prototype.addErrorMessage=function(_3f6,_3f7){
if(!_3f6.id){
_3f6.id=wFORMS.helpers.randomId();
}
var _3f8=document.createTextNode(_3f7);
var p=document.getElementById(_3f6.id+this.behavior.ERROR_PLACEHOLDER_SUFFIX);
if(!p){
p=document.createElement("div");
p.setAttribute("id",_3f6.id+this.behavior.ERROR_PLACEHOLDER_SUFFIX);
if(_3f6.tagName=="TR"){
p=(_3f6.getElementsByTagName("TD")[0]).appendChild(p);
}else{
p=_3f6.parentNode.insertBefore(p,_3f6.nextSibling);
}
}
p.appendChild(_3f8);
base2.DOM.bind(p);
p.addClass(this.behavior.styling.errorMessage);
};
wFORMS.behaviors.validation.instance.prototype.removeErrorMessage=function(_3fa){
if(!_3fa.hasClass){
base2.DOM.bind(_3fa);
}
if(_3fa.hasClass(this.behavior.styling.fieldError)){
_3fa.removeClass(this.behavior.styling.fieldError);
var _3fb=document.getElementById(_3fa.id+this.behavior.ERROR_PLACEHOLDER_SUFFIX);
if(_3fb){
_3fb.parentNode.removeChild(_3fb);
}
}
};
wFORMS.behaviors.validation.instance.prototype.isSwitchedOff=function(_3fc){
var sb=wFORMS.getBehaviorInstance(this.target,"switch");
if(sb){
var _3fe=_3fc;
while(_3fe&&_3fe.tagName!="BODY"){
if(_3fe.className&&_3fe.className.indexOf(sb.behavior.CSS_OFFSTATE_PREFIX)!=-1&&_3fe.className.indexOf(sb.behavior.CSS_ONSTATE_PREFIX)==-1){
return true;
}
_3fe=_3fe.parentNode;
}
}
return false;
};
wFORMS.behaviors.validation.isErrorPlaceholderId=function(id){
return id.match(new RegExp(wFORMS.behaviors.validation.ERROR_PLACEHOLDER_SUFFIX+"$"))!=null;
};
wFORMS.behaviors.validation.instance.prototype.isEmpty=function(s){
var _401=/^\s+$/;
return ((s==null)||(s.length==0)||_401.test(s));
};
wFORMS.behaviors.validation.instance.prototype.validateRequired=function(_402,_403){
switch(_402.tagName){
case "INPUT":
var _404=_402.getAttribute("type");
if(!_404){
_404="text";
}
switch(_404.toLowerCase()){
case "checkbox":
case "radio":
return _402.checked;
break;
default:
return !this.isEmpty(_403);
}
break;
case "SELECT":
return !this.isEmpty(_403);
break;
case "TEXTAREA":
return !this.isEmpty(_403);
break;
default:
return this.validateOneRequired(_402);
break;
}
return false;
};
wFORMS.behaviors.validation.instance.prototype.validateOneRequired=function(_405){
if(_405.nodeType!=1){
return false;
}
if(this.isSwitchedOff(_405)){
return false;
}
switch(_405.tagName){
case "INPUT":
var _406=_405.getAttribute("type");
if(!_406){
_406="text";
}
switch(_406.toLowerCase()){
case "checkbox":
case "radio":
return _405.checked;
break;
default:
return !this.isEmpty(wFORMS.helpers.getFieldValue(_405));
}
break;
case "SELECT":
return !this.isEmpty(wFORMS.helpers.getFieldValue(_405));
break;
case "TEXTAREA":
return !this.isEmpty(wFORMS.helpers.getFieldValue(_405));
break;
default:
for(var i=0;i<_405.childNodes.length;i++){
if(this.validateOneRequired(_405.childNodes[i])){
return true;
}
}
break;
}
return false;
};
wFORMS.behaviors.validation.instance.prototype.validateAlpha=function(_408,_409){
var _40a=/^[a-zA-Z\s]+$/;
return this.isEmpty(_409)||_40a.test(_409);
};
wFORMS.behaviors.validation.instance.prototype.validateAlphanum=function(_40b,_40c){
var _40d=/^[\w\s]+$/;
return this.isEmpty(_40c)||_40d.test(_40c);
};
wFORMS.behaviors.validation.instance.prototype.validateDate=function(_40e,_40f){
var _410=new Date(_40f);
return this.isEmpty(_40f)||!isNaN(_410);
};
wFORMS.behaviors.validation.instance.prototype.validateTime=function(_411,_412){
return true;
};
wFORMS.behaviors.validation.instance.prototype.validateEmail=function(_413,_414){
var _415=/\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/;
return this.isEmpty(_414)||_415.test(_414);
};
wFORMS.behaviors.validation.instance.prototype.validateInteger=function(_416,_417){
var _418=/^[+]?\d+$/;
return this.isEmpty(_417)||_418.test(_417);
};
wFORMS.behaviors.validation.instance.prototype.validateFloat=function(_419,_41a){
return this.isEmpty(_41a)||!isNaN(parseFloat(_41a));
};
wFORMS.behaviors.validation.instance.prototype.validateCustom=function(_41b,_41c){
var _41d=new RegExp("/(.*)/([gi]*)");
var _41e=_41b.className.match(_41d);
if(_41e&&_41e[0]){
var _41f=new RegExp(_41e[1],_41e[2]);
if(!_41c.match(_41f)){
return false;
}
}
return true;
};
if(typeof (wFORMS)=="undefined"){
throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
wFORMS.behaviors.calculation={VARIABLE_SELECTOR_PREFIX:"calc-",CHOICE_VALUE_SELECTOR_PREFIX:"calcval-",CALCULATION_SELECTOR:"*[class*=\"formula=\"]",CALCULATION_ERROR_MESSAGE:"There was an error computing this field.",instance:function(f){
this.behavior=wFORMS.behaviors.calculation;
this.target=f;
this.calculations=[];
}};
wFORMS.behaviors.calculation.applyTo=function(f){
var b=new wFORMS.behaviors.calculation.instance(f);
f.querySelectorAll(wFORMS.behaviors.calculation.CALCULATION_SELECTOR).forEach(function(elem){
var _424=elem.className.substr(elem.className.indexOf("formula=")+8).split(" ")[0];
var _425=_424.split(/[^a-zA-Z]+/g);
b.varFields=[];
for(var i=0;i<_425.length;i++){
if(_425[i]!=""){
f.querySelectorAll("*[class*=\""+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+_425[i]+"\"]").forEach(function(_427){
var _428=((" "+_427.className+" ").indexOf(" "+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+_425[i]+" ")!=-1);
if(!_428){
return;
}
switch(_427.tagName+":"+_427.getAttribute("type")){
case "INPUT:":
case "INPUT:null":
case "INPUT:text":
case "INPUT:hidden":
case "INPUT:password":
case "TEXTAREA:null":
if(!_427._wforms_calc_handled){
_427.addEventListener("blur",function(e){
return b.run(e,this);
},false);
_427._wforms_calc_handled=true;
}
break;
case "INPUT:radio":
case "INPUT:checkbox":
if(!_427._wforms_calc_handled){
_427.addEventListener("click",function(e){
return b.run(e,this);
},false);
_427._wforms_calc_handled=true;
}
break;
case "SELECT:null":
if(!_427._wforms_calc_handled){
_427.addEventListener("change",function(e){
return b.run(e,this);
},false);
_427._wforms_calc_handled=true;
}
break;
default:
return;
break;
}
b.varFields.push({name:_425[i],field:_427});
});
}
}
var calc={field:elem,formula:_424,variables:b.varFields};
b.calculations.push(calc);
b.compute(calc);
});
b.onApply();
return b;
};
wFORMS.behaviors.calculation.instance.prototype.onApply=function(){
};
wFORMS.behaviors.calculation.instance.prototype.run=function(_42d,_42e){
for(var i=0;i<this.calculations.length;i++){
var calc=this.calculations[i];
for(var j=0;j<calc.variables.length;j++){
if(_42e==calc.variables[j].field){
this.compute(calc);
}
}
}
};
wFORMS.behaviors.calculation.instance.prototype.compute=function(_432){
var f=this.target;
var _434=_432.formula;
var _435=new Array();
for(var i=0;i<_432.variables.length;i++){
var v=_432.variables[i];
var _438=0;
var _439=this;
if(wFORMS.helpers.contains(_435,v.name)){
continue;
}else{
_435.push(v.name);
}
f.querySelectorAll("*[class*=\""+_439.behavior.VARIABLE_SELECTOR_PREFIX+v.name+"\"]").forEach(function(f){
var _43b=((" "+f.className+" ").indexOf(" "+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+v.name+" ")!=-1);
if(!_43b){
return;
}
if(_439.hasValueInClassName(f)){
var _43c=_439.getValueFromClassName(f);
}else{
var _43c=wFORMS.helpers.getFieldValue(f);
}
if(!_43c){
_43c=0;
}
if(_43c.constructor.toString().indexOf("Array")!==-1){
for(var j=0;j<_43c.length;j++){
_438+=parseFloat(_43c[j]);
}
}else{
_438+=parseFloat(_43c);
}
});
var rgx=new RegExp("([^a-z])("+v.name+")([^a-z])","gi");
while((" "+_434+" ").match(rgx)){
_434=(" "+_434+" ").replace(rgx,"$1"+_438+"$3");
}
}
try{
var _43f=eval(_434);
if(_43f=="Infinity"||_43f=="NaN"||isNaN(_43f)){
_43f="error";
}
}
catch(x){
_43f="error";
console.log(_432.formula,_434);
}
var _440=wFORMS.getBehaviorInstance(this.target,"validation");
if(_440){
if(!wFORMS.behaviors.validation.messages["calculation"]){
wFORMS.behaviors.validation.messages["calculation"]=this.behavior.CALCULATION_ERROR_MESSAGE;
}
_440.removeErrorMessage(_432.field);
if(_43f=="error"){
_440.fail(_432.field,"calculation");
}
}
_432.field.value=_43f;
if(_432.field.className&&(_432.field.className.indexOf(this.behavior.VARIABLE_SELECTOR_PREFIX)!=-1)){
this.run(null,_432.field);
}
};
wFORMS.behaviors.calculation.instance.prototype.hasValueInClassName=function(_441){
switch(_441.tagName){
case "SELECT":
for(var i=0;i<_441.options.length;i++){
if(_441.options[i].className&&_441.options[i].className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)!=-1){
return true;
}
}
return false;
break;
default:
if(!_441.className||(" "+_441.className).indexOf(" "+this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)==-1){
return false;
}
break;
}
return true;
};
wFORMS.behaviors.calculation.instance.prototype.getValueFromClassName=function(_443){
switch(_443.tagName){
case "INPUT":
if(!_443.className||_443.className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)==-1){
return null;
}
var _444=_443.className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(" ")[0];
if(_443.type=="checkbox"){
return _443.checked?_444:null;
}
if(_443.type=="radio"){
return _443.checked?_444:null;
}
return _444;
break;
case "SELECT":
if(_443.selectedIndex==-1){
return null;
}
if(_443.getAttribute("multiple")){
var v=[];
for(var i=0;i<_443.options.length;i++){
if(_443.options[i].selected){
if(_443.options[i].className&&_443.options[i].className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)!=-1){
var _444=_443.options[i].className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(" ")[0];
v.push(_444);
}
}
}
if(v.length==0){
return null;
}
return v;
}
if(_443.options[_443.selectedIndex].className&&_443.options[_443.selectedIndex].className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)!=-1){
var _444=_443.options[_443.selectedIndex].className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(" ")[0];
return _444;
}
break;
case "TEXTAREA":
if(!_443.className||_443.className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)==-1){
return null;
}
var _444=_443.className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(" ")[0];
return _444;
break;
default:
return null;
break;
}
return null;
};

