var base2={name:"base2",version:"0.9 (alpha)",exports:"Base, Namespace, Abstract, Module, Enumerable, Hash, Collection, RegGrp, "+"Array2, Date2, String2, "+"assert, assertArity, assertType, "+"assignID, copy, detect, extend, forEach, format, instanceOf, match, rescape, slice, trim, "+"I, K, Undefined, Null, True, False, bind, delegate, flip, not, partial, returns, unbind",global:this,namespace:"var global=base2.global;function base(o,a){return o.base.apply(o,a)};",detect:new function(_){
var _2=_;
var _3;
var _4=_.java;
if(_.navigator){
var _5=document.createElement("span");
var _6=navigator.platform+" "+navigator.userAgent;
if(!_3){
_6=_6.replace(/MSIE\s[\d.]+/,"");
}
_6=_6.replace(/([a-z])[\s\/](\d)/gi,"$1$2");
_4=navigator.javaEnabled()&&_4;
}
return function(_7){
var r=false;
var _9=_7.charAt(0)=="!";
if(_9){
_7=_7.slice(1);
}
_7=_7.replace(/^([^\(].*)$/,"/($1)/i.test(platform)");
try{
eval("r=!!"+_7);
}
catch(error){
}
return !!(_9^r);
};
}(this)};
new function(_){
var _b=base2.detect;
var _c=Array.slice||function(_d){
return _slice.apply(_d,_slice.call(arguments,1));
};
var _e=K(),Null=K(null),True=K(true),False=K(false);
var _f=1;
var _10=/^[_$]/;
var _11=/%([1-9])/g;
var _12=/^\s\s*/;
var _13=/\s\s*$/;
var _14=/([\/()[\]{}|*+-.,^$?\\])/g;
var _15=/eval/.test(_b)?/\bbase\b/:/./;
var _16=["constructor","toString","valueOf"];
var _17=String(new RegExp);
var _18=Array.prototype.slice;
var _19=_get_Function_forEach();
eval(base2.namespace);
var _1a=function(_1b,_1c){
base2.__prototyping=true;
var _1d=new this;
extend(_1d,_1b);
delete base2.__prototyping;
var _1e=_1d.constructor;
function klass(){
if(!base2.__prototyping){
if(this.constructor==arguments.callee||this.__constructing){
this.__constructing=true;
_1e.apply(this,arguments);
delete this.__constructing;
}else{
return extend(arguments[0],_1d);
}
}
}
_1d.constructor=klass;
for(var i in Base){
klass[i]=this[i];
}
klass.ancestor=this;
klass.base=_e;
klass.init=_e;
klass.prototype=_1d;
extend(klass,_1c);
klass.init();
klass["#implements"]=[];
klass["#implemented_by"]=[];
return klass;
};
var _20=_1a.call(Object,{constructor:function(){
if(arguments.length>0){
this.extend(arguments[0]);
}
},base:function(){
},extend:delegate(extend)},_20={ancestorOf:delegate(_ancestorOf),extend:_1a,forEach:delegate(_19),implement:function(_21){
if(instanceOf(_21,Function)){
if(_20.ancestorOf(_21)){
_21(this.prototype);
this["#implements"].push(_21);
_21["#implemented_by"].push(this);
}
}else{
extend(this.prototype,_21);
}
return this;
}});
var _22=_20.extend({constructor:function(_23,_24){
this.extend(_24);
if(typeof this.init=="function"){
this.init();
}
if(this.name!="base2"){
base2.addName(this.name,this);
this.namespace=format("var %1=base2.%1;",this.name);
}
var _25=/[^\s,]+/g;
_23.imports=Array2.reduce(this.imports.match(_25),function(_26,_27){
assert(base2[_27],format("Namespace not found: '%1'.",_27));
return _26+=base2[_27].namespace;
},base2.namespace);
_23.exports=Array2.reduce(this.exports.match(_25),function(_28,_29){
this.namespace+=format("var %2=%1.%2;",this.name,_29);
return _28+=format("if(!%1.%2)%1.%2=%2;",this.name,_29);
},"",this);
},exports:"",imports:"",namespace:"",name:"",addName:function(_2a,_2b){
this[_2a]=_2b;
this.exports+=", "+_2a;
this.namespace+=format("var %1=%2.%1;",_2a,this.name);
}});
var _2c=_20.extend({constructor:function(){
throw new TypeError("Class cannot be instantiated.");
}});
var _2d=_2c.extend(null,{extend:function(_2e,_2f){
var _30=this.base();
forEach(this,function(_31,_32){
if(!_2d[_32]&&instanceOf(_31,Function)&&!_10.test(_32)){
extend(_30,_32,_31);
}
});
_30.implement(_2e);
extend(_30,_2f);
_30.init();
return _30;
},implement:function(_33){
var _34=this;
if(typeof _33=="function"){
_34.base(_33);
if(_2d.ancestorOf(_33)){
forEach(_33,function(_35,_36){
if(!_2d[_36]&&instanceOf(_35,Function)&&!_10.test(_36)){
extend(_34,_36,_35);
}
});
}
}else{
_19(Object,_33,function(_37,_38){
if(_38.charAt(0)=="@"){
if(_b(_38.slice(1))){
forEach(_37,arguments.callee);
}
}else{
if(!_2d[_38]&&instanceOf(_37,Function)){
function _module(){
return _34[_38].apply(_34,[this].concat(_c(arguments)));
}
_module._module=_34;
_module._base=_15.test(_37);
extend(_34.prototype,_38,_module);
}
}
});
extend(_34,_33);
}
return _34;
}});
var _39=_2d.extend({every:function(_3a,_3b,_3c){
var _3d=true;
try{
this.forEach(_3a,function(_3e,key){
_3d=_3b.call(_3c,_3e,key,_3a);
if(!_3d){
throw StopIteration;
}
});
}
catch(error){
if(error!=StopIteration){
throw error;
}
}
return !!_3d;
},filter:function(_40,_41,_42){
var i=0;
return this.reduce(_40,function(_44,_45,key){
if(_41.call(_42,_45,key,_40)){
_44[i++]=_45;
}
return _44;
},[]);
},invoke:function(_47,_48){
var _49=_c(arguments,2);
return this.map(_47,(typeof _48=="function")?function(_4a){
if(_4a!=null){
return _48.apply(_4a,_49);
}
}:function(_4b){
if(_4b!=null){
return _4b[_48].apply(_4b,_49);
}
});
},map:function(_4c,_4d,_4e){
var _4f=[],i=0;
this.forEach(_4c,function(_50,key){
_4f[i++]=_4d.call(_4e,_50,key,_4c);
});
return _4f;
},pluck:function(_52,key){
return this.map(_52,function(_54){
if(_54!=null){
return _54[key];
}
});
},reduce:function(_55,_56,_57,_58){
var _59=arguments.length>2;
this.forEach(_55,function(_5a,key){
if(_59){
_57=_56.call(_58,_57,_5a,key,_55);
}else{
_57=_5a;
_59=true;
}
});
return _57;
},some:function(_5c,_5d,_5e){
return !this.every(_5c,not(_5d),_5e);
}},{forEach:forEach});
var _5f="#";
var _60=_20.extend({constructor:function(_61){
this.merge(_61);
},copy:delegate(copy),exists:function(key){
return _5f+key in this;
},fetch:function(key){
return this[_5f+key];
},forEach:function(_64,_65){
for(var key in this){
if(key.charAt(0)==_5f){
_64.call(_65,this[key],key.slice(1),this);
}
}
},merge:function(_67){
var _68=flip(this.store);
forEach(arguments,function(_69){
forEach(_69,_68,this);
},this);
return this;
},remove:function(key){
var _6b=this[_5f+key];
delete this[_5f+key];
return _6b;
},store:function(key,_6d){
if(arguments.length==1){
_6d=key;
}
return this[_5f+key]=_6d;
},union:function(_6e){
return this.merge.apply(this.copy(),arguments);
}});
_60.implement(_39);
var _6f="~";
var _70=_60.extend({constructor:function(_71){
this[_6f]=new Array2;
this.base(_71);
},add:function(key,_73){
assert(!this.exists(key),"Duplicate key '"+key+"'.");
return this.store.apply(this,arguments);
},copy:function(){
var _74=this.base();
_74[_6f]=this[_6f].copy();
return _74;
},count:function(){
return this[_6f].length;
},fetchAt:function(_75){
if(_75<0){
_75+=this[_6f].length;
}
var key=this[_6f][_75];
if(key!==undefined){
return this[_5f+key];
}
},forEach:function(_77,_78){
var _79=this[_6f];
var _7a=_79.length;
for(var i=0;i<_7a;i++){
_77.call(_78,this[_5f+_79[i]],_79[i],this);
}
},indexOf:function(key){
return this[_6f].indexOf(String(key));
},insertAt:function(_7d,key,_7f){
assert(Math.abs(_7d)<this[_6f].length,"Index out of bounds.");
assert(!this.exists(key),"Duplicate key '"+key+"'.");
this[_6f].insertAt(_7d,String(key));
return this.store.apply(this,arguments);
},item:_e,keys:function(_80,_81){
switch(arguments.length){
case 0:
return this[_6f].copy();
case 1:
return this[_6f].item(_80);
default:
return this[_6f].slice(_80,_81);
}
},remove:function(key){
var _83=arguments[1];
if(_83||this.exists(key)){
if(!_83){
this[_6f].remove(String(key));
}
return this.base(key);
}
},removeAt:function(_84){
var key=this[_6f].removeAt(_84);
if(key!==undefined){
return this.remove(key,true);
}
},reverse:function(){
this[_6f].reverse();
return this;
},sort:function(_86){
if(_86){
var _87=this;
this[_6f].sort(function(_88,_89){
return _86(_87[_5f+_88],_87[_5f+_89],_88,_89);
});
}else{
this[_6f].sort();
}
return this;
},store:function(key,_8b){
if(arguments.length==1){
_8b=key;
}
if(!this.exists(key)){
this[_6f].push(String(key));
}
var _8c=this.constructor;
if(_8c.Item&&!instanceOf(_8b,_8c.Item)){
_8b=_8c.create.apply(_8c,arguments);
}
return this[_5f+key]=_8b;
},storeAt:function(_8d,_8e){
assert(Math.abs(_8d)<this[_6f].length,"Index out of bounds.");
arguments[0]=this[_6f].item(_8d);
return this.store.apply(this,arguments);
},toString:function(){
return String(this[_6f]);
}},{Item:null,init:function(){
this.prototype.item=this.prototype.fetchAt;
},create:function(key,_90){
if(this.Item){
return new this.Item(key,_90);
}
},extend:function(_91,_92){
var _93=this.base(_91);
_93.create=this.create;
extend(_93,_92);
if(!_93.Item){
_93.Item=this.Item;
}else{
if(typeof _93.Item!="function"){
_93.Item=(this.Item||_20).extend(_93.Item);
}
}
_93.init();
return _93;
}});
var _94=/\\(\d+)/g;
var _95=/\\./g;
var _96=/\(\?[:=!]|\[[^\]]+\]/g;
var _97=/\(/g;
var _98=_70.extend({constructor:function(_99,_9a){
this.base(_99);
if(typeof _9a=="string"){
this.global=/g/.test(_9a);
this.ignoreCase=/i/.test(_9a);
}
},global:true,ignoreCase:false,exec:function(_9b,_9c){
_9b+="";
if(arguments.length==1){
var _9d=this;
var _9e=this[_6f];
_9c=function(_9f){
if(!_9f){
return "";
}
var _a0,offset=1,i=0;
while(_a0=_9d[_5f+_9e[i++]]){
var _a1=offset+_a0.length+1;
if(arguments[offset]){
var _a2=_a0.replacement;
switch(typeof _a2){
case "function":
var _a3=_c(arguments,offset,_a1);
var _a4=arguments[arguments.length-2];
return _a2.apply(_9d,_a3.concat(_a4,_9b));
case "number":
return arguments[offset+_a2];
default:
return _a2;
}
}
offset=_a1;
}
};
}
return _9b.replace(this.valueOf(),_9c);
},test:function(_a5){
return this.exec(_a5)!=_a5;
},toString:function(){
var _a6=0;
return "("+this.map(function(_a7){
var ref=String(_a7).replace(_94,function(_a9,_aa){
return "\\"+(1+Number(_aa)+_a6);
});
_a6+=_a7.length+1;
return ref;
}).join(")|(")+")";
},valueOf:function(_ab){
if(_ab=="object"){
return this;
}
var _ac=(this.global?"g":"")+(this.ignoreCase?"i":"");
return new RegExp(this,_ac);
}},{IGNORE:"$0",init:function(){
forEach("add,exists,fetch,remove,store".split(","),function(_ad){
extend(this,_ad,function(_ae){
if(instanceOf(_ae,RegExp)){
_ae=_ae.source;
}
return base(this,arguments);
});
},this.prototype);
},Item:{constructor:function(_af,_b0){
_af=instanceOf(_af,RegExp)?_af.source:String(_af);
if(typeof _b0=="number"){
_b0=String(_b0);
}else{
if(_b0==null){
_b0="";
}
}
if(typeof _b0=="string"&&/\$(\d+)/.test(_b0)){
if(/^\$\d+$/.test(_b0)){
_b0=parseInt(_b0.slice(1));
}else{
var Q=/'/.test(_b0.replace(/\\./g,""))?"\"":"'";
_b0=_b0.replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/\$(\d+)/g,Q+"+(arguments[$1]||"+Q+Q+")+"+Q);
_b0=new Function("return "+Q+_b0.replace(/(['"])\1\+(.*)\+\1\1$/,"$1")+Q);
}
}
this.length=_98.count(_af);
this.replacement=_b0;
this.toString=returns(_af);
},length:0,replacement:""},count:function(_b2){
_b2=String(_b2).replace(_95,"").replace(_96,"");
return match(_b2,_97).length;
}});
Function.prototype.prototype={};
if("".replace(/^/,String)){
var _b3=/(g|gi)$/;
extend(String.prototype,"replace",function(_b4,_b5){
if(typeof _b5=="function"){
if(instanceOf(_b4,RegExp)){
var _b6=_b4;
var _b7=_b6.global;
if(_b7==null){
_b7=_b3.test(_b6);
}
if(_b7){
_b6=new RegExp(_b6.source);
}
}else{
_b6=new RegExp(rescape(_b4));
}
var _b8,string=this,result="";
while(string&&(_b8=_b6.exec(string))){
result+=string.slice(0,_b8.index)+_b5.apply(this,_b8);
string=string.slice(_b8.index+_b8[0].length);
if(!_b7){
break;
}
}
return result+string;
}
return this.base(_b4,_b5);
});
}
var _b9=_createObject2(Array,"concat,join,pop,push,reverse,shift,slice,sort,splice,unshift",[_39,{combine:function(_ba,_bb){
if(!_bb){
_bb=_ba;
}
return this.reduce(_ba,function(_bc,key,_be){
_bc[key]=_bb[_be];
return _bc;
},{});
},contains:function(_bf,_c0){
return this.indexOf(_bf,_c0)!=-1;
},copy:function(_c1){
var _c2=this.slice(_c1);
if(!_c2.swap){
this(_c2);
}
return _c2;
},flatten:function(_c3){
var i=0;
return this.reduce(_c3,function(_c5,_c6){
if(this.like(_c6)){
this.reduce(_c6,arguments.callee,_c5,this);
}else{
_c5[i++]=_c6;
}
return _c5;
},[],this);
},forEach:_Array_forEach,indexOf:function(_c7,_c8,_c9){
var _ca=_c7.length;
if(_c9==null){
_c9=0;
}else{
if(_c9<0){
_c9=Math.max(0,_ca+_c9);
}
}
for(var i=_c9;i<_ca;i++){
if(_c7[i]===_c8){
return i;
}
}
return -1;
},insertAt:function(_cc,_cd,_ce){
this.splice(_cc,_ce,0,_cd);
return _cd;
},item:function(_cf,_d0){
if(_d0<0){
_d0+=_cf.length;
}
return _cf[_d0];
},lastIndexOf:function(_d1,_d2,_d3){
var _d4=_d1.length;
if(_d3==null){
_d3=_d4-1;
}else{
if(from<0){
_d3=Math.max(0,_d4+_d3);
}
}
for(var i=_d3;i>=0;i--){
if(_d1[i]===_d2){
return i;
}
}
return -1;
},map:function(_d6,_d7,_d8){
var _d9=[];
this.forEach(_d6,function(_da,_db){
_d9[_db]=_d7.call(_d8,_da,_db,_d6);
});
return _d9;
},remove:function(_dc,_dd){
var _de=this.indexOf(_dc,_dd);
if(_de!=-1){
this.removeAt(_dc,_de);
}
return _dd;
},removeAt:function(_df,_e0){
return this.splice(_df,_e0,1);
},swap:function(_e1,_e2,_e3){
var _e4=_e1[_e2];
_e1[_e2]=_e1[_e3];
_e1[_e3]=_e4;
return _e1;
}}]);
_b9.reduce=_39.reduce;
_b9.prototype.forEach=delegate(_Array_forEach);
_b9.like=function(_e5){
return !!(_e5&&typeof _e5=="object"&&typeof _e5.length=="number");
};
var _e6=/^((-\d+|\d{4,})(-(\d{2})(-(\d{2}))?)?)?T((\d{2})(:(\d{2})(:(\d{2})(\.(\d{1,3})(\d)?\d*)?)?)?)?(([+-])(\d{2})(:(\d{2}))?|Z)?$/;
var _e7={FullYear:2,Month:4,Date:6,Hours:8,Minutes:10,Seconds:12,Milliseconds:14};
var _e8={Hectomicroseconds:15,UTC:16,Sign:17,Hours:18,Minutes:20};
var _e9=/(((00)?:0+)?:0+)?\.0+$/;
var _ea=/(T[0-9:.]+)$/;
var _eb=_createObject2(Date,"",[{toISOString:function(_ec){
var _ed="####-##-##T##:##:##.###";
for(var _ee in _e7){
_ed=_ed.replace(/#+/,function(_ef){
var _f0=_ec["getUTC"+_ee]();
if(_ee=="Month"){
_f0++;
}
return ("000"+_f0).slice(-_ef.length);
});
}
return _ed.replace(_e9,"").replace(_ea,"$1Z");
}}]);
_eb.now=function(){
return (new Date).valueOf();
};
_eb.parse=function(_f1,_f2){
if(arguments.length>1){
assertType(_f2,"number","defaultDate should be of type 'number'.");
}
var _f3=String(_f1).match(_e6);
if(_f3){
if(_f3[_e7.Month]){
_f3[_e7.Month]--;
}
if(_f3[_e8.Hectomicroseconds]>=5){
_f3[_e7.Milliseconds]++;
}
var _f4=new Date(_f2||0);
var _f5=_f3[_e8.UTC]||_f3[_e8.Hours]?"UTC":"";
for(var _f6 in _e7){
var _f7=_f3[_e7[_f6]];
if(!_f7){
continue;
}
_f4["set"+_f5+_f6](_f7);
if(_f4["get"+_f5+_f6]()!=_f3[_e7[_f6]]){
return new Date(NaN);
}
}
if(_f3[_e8.Hours]){
var _f8=Number(_f3[_e8.Sign]+_f3[_e8.Hours]);
var _f9=Number(_f3[_e8.Sign]+(_f3[_e8.Minutes]||0));
_f4.setUTCMinutes(_f4.getUTCMinutes()+(_f8*60)+_f9);
}
return _f4.valueOf();
}else{
return Date.parse(_f1);
}
};
var _fa=_createObject2(String,"charAt,charCodeAt,concat,indexOf,lastIndexOf,match,replace,search,slice,split,substr,substring,toLowerCase,toUpperCase",[{trim:trim}]);
function _createObject2(_fb,_fc,_fd){
var _fe=_2d.extend();
forEach(_fc.split(","),function(_ff){
_fe[_ff]=unbind(_fb.prototype[_ff]);
});
forEach(_fd,_fe.implement,_fe);
var _100=function(){
if(arguments[0]==_fb.prototype){
extend(_fb,_100);
}
return _fe(this.constructor==_fe?_fb.apply(_fb,arguments):arguments[0]);
};
_100.prototype=_fe.prototype;
forEach(_fe,function(_101,name){
if(_fb[name]){
_fe[name]=_fb[name];
delete _fe.prototype[name];
}
_100[name]=_fe[name];
});
_100.ancestor=Object;
delete _100.extend;
return _100;
}
function extend(_103,_104){
var _105=arguments.callee;
if(_103!=null){
if(arguments.length>2){
var key=String(_104);
var _107=arguments[2];
if(key.charAt(0)=="@"){
return _b(key.slice(1))?_105(_103,_107):_103;
}
if(_103.extend==_105&&/^(base|extend)$/.test(key)){
return _103;
}
var _108=_103[key];
if(_108&&instanceOf(_107,Function)){
if(_107!=_108&&!_ancestorOf(_107,_108)){
if(_107._base||_15.test(_107)){
var _109=_107;
function _base(){
var _10a=this.base;
this.base=_108;
var _10b=_109.apply(this,arguments);
this.base=_10a;
return _10b;
}
_107=_base;
_107.method=_109;
_107.ancestor=_108;
}
_103[key]=_107;
}
}else{
_103[key]=_107;
}
}else{
if(_104){
var Type=instanceOf(_104,Function)?Function:Object;
if(base2.__prototyping){
forEach(_16,function(key){
if(_104[key]!=Type.prototype[key]){
_105(_103,key,_104[key]);
}
});
}else{
if(typeof _103.extend=="function"&&typeof _103!="function"&&_103.extend!=_105){
_105=unbind(_103.extend);
}
}
_19(Type,_104,function(_10e,key){
_105(_103,key,_10e);
});
}
}
}
return _103;
}
function _ancestorOf(_110,fn){
while(fn&&fn.ancestor!=_110){
fn=fn.ancestor;
}
return !!fn;
}
if(typeof StopIteration=="undefined"){
StopIteration=new Error("StopIteration");
}
function forEach(_112,_113,_114,fn){
if(_112==null){
return;
}
if(!fn){
if(instanceOf(_112,Function)){
fn=Function;
}else{
if(typeof _112.forEach=="function"&&_112.forEach!=arguments.callee){
_112.forEach(_113,_114);
return;
}else{
if(typeof _112.length=="number"){
_Array_forEach(_112,_113,_114);
return;
}
}
}
}
_19(fn||Object,_112,_113,_114);
}
function _Array_forEach(_116,_117,_118){
if(_116==null){
return;
}
var _119=_116.length,i;
if(typeof _116=="string"){
for(i=0;i<_119;i++){
_117.call(_118,_116.charAt(i),i,_116);
}
}else{
for(i=0;i<_119;i++){
if(_116[i]!==undefined){
_117.call(_118,_116[i],i,_116);
}
}
}
}
function _get_Function_forEach(){
var Temp=function(){
this.i=1;
};
Temp.prototype={i:1};
var _11b=0;
for(var i in new Temp){
_11b++;
}
return (_11b>1)?function(fn,_11e,_11f,_120){
var _121={};
for(var key in _11e){
if(!_121[key]&&fn.prototype[key]===undefined){
_121[key]=true;
_11f.call(_120,_11e[key],key,_11e);
}
}
}:function(fn,_124,_125,_126){
for(var key in _124){
if(fn.prototype[key]===undefined){
_125.call(_126,_124[key],key,_124);
}
}
};
}
function instanceOf(_128,_129){
assertType(_129,"function","Invalid 'instanceOf' operand.");
if(_128 instanceof _129){
return true;
}
if(_128==null){
return false;
}
if(_isBaseClass(_129)){
return false;
}
if(_isBaseClass(_128.constructor)){
return _129==Object;
}
switch(_129){
case Array:
return !!(typeof _128=="object"&&_128.join&&_128.splice);
case Function:
return !!(typeof _128=="function"&&_128.call);
case RegExp:
return _128.constructor.prototype.toString()==_17;
case Date:
return !!_128.getTimezoneOffset;
case String:
case Number:
case Boolean:
return typeof _128==typeof _129.prototype.valueOf();
case Object:
return typeof _128=="object"&&typeof _128.constructor=="function";
}
return false;
}
function _isBaseClass(_12a){
return _12a==_20||_ancestorOf(_20,_12a);
}
function assert(_12b,_12c,Err){
if(!_12b){
throw new (Err||Error)(_12c||"Assertion failed.");
}
}
function assertArity(args,_12f,_130){
if(_12f==null){
_12f=args.callee.length;
}
if(args.length<_12f){
throw new SyntaxError(_130||"Not enough arguments.");
}
}
function assertType(_131,type,_133){
if(type&&(typeof type=="function"?!instanceOf(_131,type):typeof _131!=type)){
throw new TypeError(_133||"Invalid type.");
}
}
function assignID(_134){
if(!_134.base2ID){
_134.base2ID="b2_"+_f++;
}
return _134.base2ID;
}
function copy(_135){
var fn=function(){
};
fn.prototype=_135;
return new fn;
}
function format(_137){
var args=arguments;
var _139=new RegExp("%([1-"+arguments.length+"])","g");
return String(_137).replace(_139,function(_13a,_13b){
return _13b<args.length?args[_13b]:_13a;
});
}
function match(_13c,_13d){
return String(_13c).match(_13d)||[];
}
function rescape(_13e){
return String(_13e).replace(_14,"\\$1");
}
function trim(_13f){
return String(_13f).replace(_12,"").replace(_13,"");
}
function I(i){
return i;
}
function K(k){
return function(){
return k;
};
}
var _142=K;
function bind(fn,_144){
var args=_c(arguments,2);
var _146=function(){
return fn.apply(_144,args.concat(_c(arguments)));
};
_146._cloneID=assignID(fn);
return _146;
}
function delegate(fn,_148){
return function(){
return fn.apply(_148,[this].concat(_c(arguments)));
};
}
function flip(fn){
return function(){
return fn.apply(this,_b9.swap(arguments,0,1));
};
}
function not(fn){
return function(){
return !fn.apply(this,arguments);
};
}
function partial(fn){
var args=_c.call(arguments,1);
return function(){
return fn.apply(this,args.concat(_c(arguments)));
};
}
function unbind(fn){
return function(_14e){
return fn.apply(_14e,_c(arguments,1));
};
}
base2=new _22(this,base2);
eval(this.exports);
base2.extend=extend;
forEach(_39,function(_14f,name){
if(!_2d[name]){
base2.addName(name,bind(_14f,_39));
}
});
var _151=new base2.Namespace(this,{name:"utils"});
};
new function(_){
var _153=document.createElement("span");
var _154;
var BOM={userAgent:"",init:function(){
var MSIE;
var _157=navigator.userAgent;
if(!MSIE){
_157=_157.replace(/MSIE\s[\d.]+/,"");
}
_157=_157.replace(/([a-z])[\s\/](\d)/gi,"$1$2");
this.userAgent=navigator.platform+" "+_157;
},detect:function(test){
var r=false;
var not=test.charAt(0)=="!";
test=test.replace(/^\!?(if\s*|platform\s+)?/,"").replace(/^(["']?)([^\(].*)(\1)$/,"/($2)/i.test(BOM.userAgent)");
try{
eval("r=!!"+test);
}
catch(error){
}
return Boolean(not^r);
}};
base2.extend(BOM,{name:"BOM",version:"0.9",exports:"detect,Window"});
BOM=new base2.Namespace(this,BOM);
eval(this.imports);
var _15b=Base.prototype.extend;
Base.prototype.extend=function(_15c,_15d){
if(typeof _15c=="string"&&_15c.charAt(0)=="@"){
return BOM.detect(_15c.slice(1))?_15b.call(this,_15d):this;
}
return _15b.apply(this,arguments);
};
if(BOM.detect("MSIE.+win")){
var _15e={};
BOM.$bind=function(_15f,_160){
if(!_160||_160.nodeType!=1){
return _15f;
}
var _161=_160.uniqueID;
var _162=assignID(_15f);
_15e[_162]=_15f;
if(!_15e[_161]){
_15e[_161]={};
}
var _163=_15e[_161][_162];
if(_163){
return _163;
}
_160=null;
_15f=null;
var _164=function(){
var _165=document.all[_161];
if(_165){
return _15e[_162].apply(_165,arguments);
}
};
_164.cloneID=_162;
_15e[_161][_162]=_164;
return _164;
};
attachEvent("onunload",function(){
_15e=null;
});
}
var _166=Module.extend(null,{verify:function(_167){
return (_167&&_167.Infinity)?_167:null;
},"@MSIE":{verify:function(_168){
return (_168==self)?self:this.base();
}}});
eval(this.exports);
};
new function(_){
var DOM=new base2.Namespace(this,{name:"DOM",version:"0.9 (alpha)",exports:"Interface, Binding, AbstractView, Event, EventTarget, NodeSelector, DocumentEvent, DocumentSelector, ElementSelector, "+"StaticNodeList, ViewCSS, Node, Document, Element, HTMLDocument, HTMLElement, Selector, Traversal, XPathParser",bind:function(node){
if(node&&node.nodeType){
var uid=assignID(node);
if(!arguments.callee[uid]){
switch(node.nodeType){
case 1:
if(typeof node.className=="string"){
(HTMLElement.bindings[node.tagName]||HTMLElement).bind(node);
}else{
Element.bind(node);
}
break;
case 9:
if(node.links){
HTMLDocument.bind(node);
}else{
Document.bind(node);
}
break;
default:
Node.bind(node);
}
arguments.callee[uid]=true;
}
}
return node;
}});
eval(this.imports);
if(detect("MSIE[56].+win")&&!detect("SV1")){
var _16d={};
extend(base2,"bind",function(_16e,_16f){
if(!_16f||_16f.nodeType!=1){
return this.base(_16e,_16f);
}
var _170=_16f.uniqueID;
var _171=assignID(_16e);
_16d[_171]=_16e;
_16e=null;
_16f=null;
if(!_16d[_170]){
_16d[_170]={};
}
var _172=_16d[_170][_171];
if(_172){
return _172;
}
var _173=function(){
var _174=document.all[_170];
if(_174){
return _16d[_171].apply(_174,arguments);
}
};
_173._cloneID=_171;
_16d[_170][_171]=_173;
return _173;
});
attachEvent("onunload",function(){
_16d=null;
});
}
var _175=Module.extend(null,{implement:function(_176){
if(typeof _176=="object"){
forEach(_176,function(_177,name){
if(name.charAt(0)=="@"){
forEach(_177,arguments.callee,this);
}else{
if(!this[name]&&typeof _177=="function"){
this.createDelegate(name,_177.length);
}
}
},this);
}
return this.base(_176);
},createDelegate:function(name,_17a){
if(!this[name]){
var FN="var fn=function _%1(%2){%3.base=%3.%1.ancestor;var m=%3.base?'base':'%1';return %3[m](%4)}";
var args="abcdefghij".split("").slice(-_17a);
eval(format(FN,name,args,args[0],args.slice(1)));
fn._delegate=name;
this[name]=fn;
}
}});
var _17d=_175.extend(null,{bind:function(_17e){
return this(_17e);
}});
var _17f=Module.extend({getDefaultView:function(node){
return this.getDocument(node).defaultView;
},getNextElementSibling:function(node){
while(node&&(node=node.nextSibling)&&!this.isElement(node)){
continue;
}
return node;
},getNodeIndex:function(node){
var _183=0;
while(node&&(node=node.previousSibling)){
_183++;
}
return _183;
},getOwnerDocument:function(node){
return node.ownerDocument;
},getPreviousElementSibling:function(node){
while(node&&(node=node.previousSibling)&&!this.isElement(node)){
continue;
}
return node;
},getTextContent:function(node){
return node[_17f.$TEXT];
},isEmpty:function(node){
node=node.firstChild;
while(node){
if(node.nodeType==3||this.isElement(node)){
return false;
}
node=node.nextSibling;
}
return true;
},setTextContent:function(node,text){
return node[_17f.$TEXT]=text;
},"@MSIE":{getDefaultView:function(node){
return this.getDocument(node).parentWindow;
},"@MSIE5":{getOwnerDocument:function(node){
return node.ownerDocument||node.document;
}}}},{$TEXT:"textContent",contains:function(node,_18d){
while(_18d&&(_18d=_18d.parentNode)&&node!=_18d){
continue;
}
return !!_18d;
},getDocument:function(node){
return this.isDocument(node)?node:this.getOwnerDocument(node);
},isDocument:function(node){
return !!(node&&node.documentElement);
},isElement:function(node){
return !!(node&&node.nodeType==1);
},"@(element.contains)":{contains:function(node,_192){
return node!=_192&&this.isDocument(node)?node==this.getOwnerDocument(_192):node.contains(_192);
}},"@MSIE":{$TEXT:"innerText"},"@MSIE5":{isElement:function(node){
return !!(node&&node.nodeType==1&&node.tagName!="!");
}}});
var _194=_17d.extend();
var _195=_17d.extend({"@!(document.createEvent)":{initEvent:function(_196,type,_198,_199){
_196.timeStamp=new Date().valueOf();
_196.type=type;
_196.bubbles=_198;
_196.cancelable=_199;
},"@MSIE":{initEvent:function(_19a,type,_19c,_19d){
this.base(_19a,type,_19c,_19d);
_19a.cancelBubble=!_19a.bubbles;
},preventDefault:function(_19e){
if(_19e.cancelable!==false){
_19e.returnValue=false;
}
},stopPropagation:function(_19f){
_19f.cancelBubble=true;
}}}},{BUBBLES:"abort,error,select,change,resize,scroll",CANCELABLE:"click,mousedown,mouseup,mouseover,mousemove,mouseout,keydown,keyup,submit,reset",init:function(){
this.BUBBLES=Array2.combine((this.BUBBLES+","+this.CANCELABLE).split(","));
this.CANCELABLE=Array2.combine(this.CANCELABLE.split(","));
},"@MSIE":{"@Mac":{bind:function(_1a0){
return this.base(extend({preventDefault:function(){
if(this.cancelable!==false){
this.returnValue=false;
}
}},_1a0));
}},"@Windows":{bind:function(_1a1){
this.base(_1a1);
if(!_1a1.timeStamp){
_1a1.bubbles=!!this.BUBBLES[_1a1.type];
_1a1.cancelable=!!this.CANCELABLE[_1a1.type];
_1a1.timeStamp=new Date().valueOf();
}
if(!_1a1.target){
_1a1.target=_1a1.srcElement;
}
_1a1.relatedTarget=_1a1.fromElement||null;
return _1a1;
}}}});
var _1a2=_175.extend({"@!(element.addEventListener)":{addEventListener:function(_1a3,type,_1a5,_1a6){
var _1a7=assignID(_1a3);
var _1a8=_1a5._cloneID||assignID(_1a5);
var _1a9=_1a2.$all[_1a7];
if(!_1a9){
_1a9=_1a2.$all[_1a7]={};
}
var _1aa=_1a9[type];
var _1ab=_1a3["on"+type];
if(!_1aa){
_1aa=_1a9[type]={};
if(_1ab){
_1aa[0]=_1ab;
}
}
_1aa[_1a8]=_1a5;
if(_1ab!==undefined){
_1a3["on"+type]=delegate(_1a2.$handleEvent);
}
},dispatchEvent:function(_1ac,_1ad){
return _1a2.$handleEvent(_1ac,_1ad);
},removeEventListener:function(_1ae,type,_1b0,_1b1){
var _1b2=_1a2.$all[_1ae.base2ID];
if(_1b2&&_1b2[type]){
delete _1b2[type][_1b0.base2ID];
}
},"@MSIE.+win":{addEventListener:function(_1b3,type,_1b5,_1b6){
if(typeof _1b5=="function"){
_1b5=bind(_1b5,_1b3);
}
this.base(_1b3,type,_1b5,_1b6);
},dispatchEvent:function(_1b7,_1b8){
_1b8.target=_1b7;
try{
return _1b7.fireEvent(_1b8.type,_1b8);
}
catch(error){
return this.base(_1b7,_1b8);
}
}}}},{dispatchEvent:function(_1b9,_1ba){
if(typeof _1ba=="string"){
var type=_1ba;
_1ba=DocumentEvent.createEvent(_1b9,"Events");
_195.initEvent(_1ba,type,false,false);
}
this.base(_1b9,_1ba);
},"@!(element.addEventListener)":{$all:{},$handleEvent:function(_1bc,_1bd){
var _1be=true;
var _1bf=_1a2.$all[_1bc.base2ID];
if(_1bf){
_1bd=_195.bind(_1bd);
var _1c0=_1bf[_1bd.type];
for(var i in _1c0){
var _1c2=_1c0[i];
if(_1c2.handleEvent){
_1be=_1c2.handleEvent(_1bd);
}else{
_1be=_1c2.call(_1bc,_1bd);
}
if(_1bd.returnValue===false){
_1be=false;
}
if(_1be===false){
break;
}
}
}
return _1be;
},"@MSIE":{$handleEvent:function(_1c3,_1c4){
if(_1c3.Infinity){
_1c3=_1c3.document.parentWindow;
if(!_1c4){
_1c4=_1c3.event;
}
}
return this.base(_1c3,_1c4||_17f.getDefaultView(_1c3).event);
}}}});
var _1c5=_175.extend({"@!(document.createEvent)":{createEvent:function(_1c6,type){
return _195.bind({});
},"@(document.createEventObject)":{createEvent:function(_1c8,type){
return _195.bind(_1c8.createEventObject());
}}},"@(document.createEvent)":{"@!(document.createEvent('Events'))":{createEvent:function(_1ca,type){
return this.base(_1ca,type=="Events"?"UIEvents":type);
}}}});
var _1cc=Module.extend(null,{fired:false,fire:function(){
if(!_1cc.fired){
_1cc.fired=true;
setTimeout("base2.DOM.EventTarget.dispatchEvent(document,'DOMContentLoaded')",0);
}
},init:function(){
_1a2.addEventListener(document,"DOMContentLoaded",function(){
_1cc.fired=true;
},false);
_1a2.addEventListener(window,"load",this.fire,false);
},"@(addEventListener)":{init:function(){
this.base();
addEventListener("load",this.fire,false);
}},"@(attachEvent)":{init:function(){
this.base();
attachEvent("onload",this.fire);
}},"@MSIE.+win":{init:function(){
this.base();
document.write("<script id=__ready defer src=//:></script>");
document.all.__ready.onreadystatechange=function(){
if(this.readyState=="complete"){
this.removeNode();
_1cc.fire();
}
};
}},"@KHTML":{init:function(){
this.base();
var _1cd=setInterval(function(){
if(/loaded|complete/.test(document.readyState)){
clearInterval(_1cd);
_1cc.fire();
}
},100);
}}});
var _1ce=_175.extend({"@!(document.defaultView.getComputedStyle)":{"@MSIE":{getComputedStyle:function(view,_1d0,_1d1){
var _1d2=/(width|height|top|bottom|left|right|fontSize)$/;
var _1d3=/^(color|backgroundColor)$/;
var _1d4={};
var _1d5=_1d0.currentStyle;
for(var i in _1d5){
if(_1d2.test(i)){
_1d4[i]=this.$getPixelValue(_1d0,_1d4[i])+"px";
}else{
if(_1d3.test(i)){
_1d4[i]=this.$getColorValue(_1d0,i=="color"?"ForeColor":"BackColor");
}else{
_1d4[i]=_1d5[i];
}
}
}
return _1d4;
}}}},{toCamelCase:function(_1d7){
return String(_1d7).replace(/\-([a-z])/g,function(_1d8,chr){
return chr.toUpperCase();
});
},"@MSIE":{$getPixelValue:function(_1da,_1db){
var _1dc=/^\d+(px)?$/i;
if(_1dc.test(_1db)){
return parseInt(_1db);
}
var _1dd=_1da.style.left;
var _1de=_1da.runtimeStyle.left;
_1da.runtimeStyle.left=_1da.currentStyle.left;
_1da.style.left=_1db||0;
_1db=_1da.style.pixelLeft;
_1da.style.left=_1dd;
_1da.runtimeStyle.left=_1de;
return _1db;
},$getColorValue:function(_1df,_1e0){
var _1e1=_1df.document.body.createTextRange();
_1e1.moveToElementText(_1df);
var _1e2=_1e1.queryCommandValue(_1e0);
return format("rgb(%1,%2,%3)",_1e2&255,(_1e2&65280)>>8,(_1e2&16711680)>>16);
}}});
var _1e3=_175.extend({"@!(element.getElementsByClassName)":{getElementsByClassName:function(node,_1e5){
if(instanceOf(_1e5,Array)){
_1e5=_1e5.join(".");
}
return this.matchAll(node,"."+_1e5);
}},"@!(element.matchSingle)":{matchAll:function(node,_1e7){
return new Selector(_1e7).exec(node);
},matchSingle:function(node,_1e9){
return new Selector(_1e9).exec(node,1);
}}});
extend(_1e3.prototype,{matchAll:function(_1ea){
return extend(this.base(_1ea),"item",function(_1eb){
return DOM.bind(this.base(_1eb));
});
},matchSingle:function(_1ec){
return DOM.bind(this.base(_1ec));
}});
var _1ed=_1e3.extend();
var _1ee=_1e3.extend({"@!(element.matchesSelector)":{matchesSelector:function(_1ef,_1f0){
return new Selector(_1f0).test(_1ef);
}}});
var _1f1=Base.extend({constructor:function(_1f2){
_1f2=_1f2||[];
this.length=_1f2.length;
this.item=function(_1f3){
return _1f2[_1f3];
};
},length:0,forEach:function(_1f4,_1f5){
var _1f6=this.length;
for(var i=0;i<_1f6;i++){
_1f4.call(_1f5,this.item(i),i,this);
}
},item:Undefined,"@(XPathResult)":{constructor:function(_1f8){
if(_1f8&&_1f8.snapshotItem){
this.length=_1f8.snapshotLength;
this.item=function(_1f9){
return _1f8.snapshotItem(_1f9);
};
}else{
this.base(_1f8);
}
}}});
_1f1.implement(Enumerable);
var _1fa=Base.extend({constructor:function(_1fb){
this.toString=returns(trim(_1fb));
},exec:function(_1fc,_1fd){
try{
var _1fe=this.$evaluate(_1fc||document,_1fd);
}
catch(error){
throw new SyntaxError(format("'%1' is not a valid CSS selector.",this));
}
return _1fd?_1fe:new _1f1(_1fe);
},test:function(_1ff){
_1ff.setAttribute("b2_test",true);
var _200=new _1fa(this+"[b2_test]");
var _201=_200.exec(_17f.getOwnerDocument(_1ff),true);
_1ff.removeAttribute("b2_test");
return _201==_1ff;
},$evaluate:function(_202,_203){
return _1fa.parse(this)(_202,_203);
}});
var _204=RegGrp.extend({constructor:function(_205){
this.base(_205);
this.cache={};
this.sorter=new RegGrp;
this.sorter.add(/:not\([^)]*\)/,RegGrp.IGNORE);
this.sorter.add(/([ >](\*|[\w-]+))([^: >+~]*)(:\w+-child(\([^)]+\))?)([^: >+~]*)/,"$1$3$6$4");
},cache:null,ignoreCase:true,escape:function(_206){
var _207=/'/g;
var _208=this._strings=[];
return this.optimise(this.format(String(_206).replace(_204.ESCAPE,function(_209){
_208.push(_209.slice(1,-1).replace(_207,"\\'"));
return "\x01"+_208.length;
})));
},format:function(_20a){
return _20a.replace(_204.WHITESPACE,"$1").replace(_204.IMPLIED_SPACE,"$1 $2").replace(_204.IMPLIED_ASTERISK,"$1*$2");
},optimise:function(_20b){
return this.sorter.exec(_20b.replace(_204.WILD_CARD,">* "));
},parse:function(_20c){
return this.cache[_20c]||(this.cache[_20c]=this.unescape(this.exec(this.escape(_20c))));
},unescape:function(_20d){
var _20e=this._strings;
return _20d.replace(/\x01(\d+)/g,function(_20f,_210){
return _20e[_210-1];
});
}},{ESCAPE:/(["'])[^\1]*\1/g,IMPLIED_ASTERISK:/([\s>+~,]|[^(]\+|^)([#.:@])/g,IMPLIED_SPACE:/(^|,)([^\s>+~])/g,WHITESPACE:/\s*([\s>+~(),]|^|$)\s*/g,WILD_CARD:/\s\*\s/g,_nthChild:function(_211,args,_213,last,not,and,mod,_218){
last=/last/i.test(_211)?last+"+1-":"";
if(!isNaN(args)){
args="0n+"+args;
}else{
if(args=="even"){
args="2n";
}else{
if(args=="odd"){
args="2n+1";
}
}
}
args=args.split(/n\+?/);
var a=args[0]?(args[0]=="-")?-1:parseInt(args[0]):1;
var b=parseInt(args[1])||0;
var not=a<0;
if(not){
a=-a;
if(a==1){
b++;
}
}
var _21b=format(a==0?"%3%7"+(last+b):"(%4%3-%2)%6%1%70%5%4%3>=%2",a,b,_213,last,and,mod,_218);
if(not){
_21b=not+"("+_21b+")";
}
return _21b;
}});
_1fa.operators={"=":"%1=='%2'","!=":"%1!='%2'","~=":/(^| )%1( |$)/,"|=":/^%1(-|$)/,"^=":/^%1/,"$=":/%1$/,"*=":/%1/};
_1fa.operators[""]="%1!=null";
_1fa.pseudoClasses={"checked":"e%1.checked","contains":"e%1[Traversal.$TEXT].indexOf('%2')!=-1","disabled":"e%1.disabled","empty":"Traversal.isEmpty(e%1)","enabled":"e%1.disabled===false","first-child":"!Traversal.getPreviousElementSibling(e%1)","last-child":"!Traversal.getNextElementSibling(e%1)","only-child":"!Traversal.getPreviousElementSibling(e%1)&&!Traversal.getNextElementSibling(e%1)","root":"e%1==Traversal.getDocument(e%1).documentElement"};
new function(_){
var _21d=detect("MSIE");
var _21e=detect("MSIE5");
var _21f=detect("(element.sourceIndex)");
var _VAR="var p%2=0,i%2,e%2,n%2=e%1.";
var _ID=_21f?"e%1.sourceIndex":"assignID(e%1)";
var _222="var g="+_ID+";if(!p[g]){p[g]=1;";
var _223="r[r.length]=e%1;if(s)return e%1;";
var _FN="fn=function(e0,s){indexed++;var r=[],p={},reg=[%1],"+"d=Traversal.getDocument(e0),c=d.body?'toUpperCase':'toString';";
var byId=_21d?function(_226,id){
var _228=_226.all[id]||null;
if(!_228||_228.id==id){
return _228;
}
for(var i=0;i<_228.length;i++){
if(_228[i].id==id){
return _228[i];
}
}
return null;
}:function(_22a,id){
return _22a.getElementById(id);
};
var _22c=1;
function register(_22d){
if(_22d.b2_indexed!=_22c){
var _22e=0;
var _22f=_22d.firstChild;
while(_22f){
if(_22f.nodeType==1&&_22f.tagName!="!"){
_22f.b2_index=++_22e;
}
_22f=_22f.nextSibling;
}
_22d.b2_length=_22e;
_22d.b2_indexed=_22c;
}
return _22d;
}
var fn;
var reg;
var _232;
var _233;
var _234;
var _235;
var _236={};
var _237=new _204({"^ \\*:root":function(_238){
_233=false;
var _239="e%2=d.documentElement;if(Traversal.contains(e%1,e%2)){";
return format(_239,_232++,_232);
}," (\\*|[\\w-]+)#([\\w-]+)":function(_23a,_23b,id){
_233=false;
var _23d="var e%2=byId(d,'%4');if(e%2&&";
if(_23b!="*"){
_23d+="e%2.nodeName=='%3'[c]()&&";
}
_23d+="Traversal.contains(e%1,e%2)){";
if(_234){
_23d+=format("i%1=n%1.length;",_234);
}
return format(_23d,_232++,_232,_23b,id);
}," (\\*|[\\w-]+)":function(_23e,_23f){
_235++;
_233=_23f=="*";
var _240=_VAR;
_240+=(_233&&_21e)?"all":"getElementsByTagName('%3')";
_240+=";for(i%2=0;(e%2=n%2[i%2]);i%2++){";
return format(_240,_232++,_234=_232,_23f);
},">(\\*|[\\w-]+)":function(_241,_242){
var _243=_21d&&_234;
_233=_242=="*";
var _244=_VAR;
_244+=_243?"children":"childNodes";
if(!_233&&_243){
_244+=".tags('%3')";
}
_244+=";for(i%2=0;(e%2=n%2[i%2]);i%2++){";
if(_233){
_244+="if(e%2.nodeType==1){";
_233=_21e;
}else{
if(!_243){
_244+="if(e%2.nodeName=='%3'[c]()){";
}
}
return format(_244,_232++,_234=_232,_242);
},"\\+(\\*|[\\w-]+)":function(_245,_246){
var _247="";
if(_233&&_21d){
_247+="if(e%1.tagName!='!'){";
}
_233=false;
_247+="e%1=Traversal.getNextElementSibling(e%1);if(e%1";
if(_246!="*"){
_247+="&&e%1.nodeName=='%2'[c]()";
}
_247+="){";
return format(_247,_232,_246);
},"~(\\*|[\\w-]+)":function(_248,_249){
var _24a="";
if(_233&&_21d){
_24a+="if(e%1.tagName!='!'){";
}
_233=false;
_235=2;
_24a+="while(e%1=e%1.nextSibling){if(e%1.b2_adjacent==indexed)break;e%1.b2_adjacent=indexed;if(";
if(_249=="*"){
_24a+="e%1.nodeType==1";
if(_21e){
_24a+="&&e%1.tagName!='!'";
}
}else{
_24a+="e%1.nodeName=='%2'[c]()";
}
_24a+="){";
return format(_24a,_232,_249);
},"#([\\w-]+)":function(_24b,id){
_233=false;
var _24d="if(e%1.id=='%2'){";
if(_234){
_24d+=format("i%1=n%1.length;",_234);
}
return format(_24d,_232,id);
},"\\.([\\w-]+)":function(_24e,_24f){
_233=false;
reg.push(new RegExp("(^|\\s)"+rescape(_24f)+"(\\s|$)"));
return format("if(reg[%2].test(e%1.className)){",_232,reg.length-1);
},":not\\((\\*|[\\w-]+)?([^)]*)\\)":function(_250,_251,_252){
var _253=(_251&&_251!="*")?format("if(e%1.nodeName=='%2'[c]()){",_232,_251):"";
_253+=_237.exec(_252);
return "if(!"+_253.slice(2,-1).replace(/\)\{if\(/g,"&&")+"){";
},":nth(-last)?-child\\(([^)]+)\\)":function(_254,last,args){
_233=false;
last=format("e%1.parentNode.b2_length",_232);
var _257="if(p%1!==e%1.parentNode)";
_257+="p%1=register(e%1.parentNode);var i=e%1.b2_index;if(";
return format(_257,_232)+_204._nthChild(_254,args,"i",last,"!","&&","%","==")+"){";
},":([\\w-]+)(\\(([^)]+)\\))?":function(_258,_259,$2,args){
return "if("+format(_1fa.pseudoClasses[_259],_232,args||"")+"){";
},"\\[([\\w-]+)\\s*([^=]?=)?\\s*([^\\]]*)\\]":function(_25c,attr,_25e,_25f){
var _260=Element.$attributes[attr]||attr;
if(attr=="class"){
_260="className";
}else{
if(attr=="for"){
_260="htmlFor";
}
}
if(_25e){
attr=format("(e%1.%3||e%1.getAttribute('%2'))",_232,attr,_260);
}else{
attr=format("Element.getAttribute(e%1,'%2')",_232,attr);
}
var _261=_1fa.operators[_25e||""];
if(instanceOf(_261,RegExp)){
reg.push(new RegExp(format(_261.source,rescape(_237.unescape(_25f)))));
_261="reg[%2].test(%1)";
_25f=reg.length-1;
}
return "if("+format(_261,attr,_25f)+"){";
}});
_1fa.parse=function(_262){
if(!_236[_262]){
reg=[];
fn="";
var _263=_237.escape(_262).split(",");
for(var i=0;i<_263.length;i++){
_233=_232=_234=0;
_235=_263.length>1?2:0;
var _265=_237.exec(_263[i])||"throw;";
if(_233&&_21d){
_265+=format("if(e%1.tagName!='!'){",_232);
}
var _266=(_235>1)?_222:"";
_265+=format(_266+_223,_232);
_265+=Array(match(_265,/\{/g).length+1).join("}");
fn+=_265;
}
eval(format(_FN,reg)+_237.unescape(fn)+"return s?null:r}");
_236[_262]=fn;
}
return _236[_262];
};
};
var _267=_204.extend({constructor:function(){
this.base(_267.rules);
this.sorter.storeAt(1,"$1$4$3$6");
},escape:function(_268){
return this.base(_268).replace(/,/g,"\x02");
},unescape:function(_269){
return this.base(_269.replace(/\[self::\*\]/g,"").replace(/(^|\x02)\//g,"$1./").replace(/\x02/g," | "));
},"@opera":{unescape:function(_26a){
return this.base(_26a.replace(/last\(\)/g,"count(preceding-sibling::*)+count(following-sibling::*)+1"));
}}},{init:function(){
this.values.attributes[""]="[@$1]";
forEach(this.types,function(add,type){
forEach(this.values[type],add,this.rules);
},this);
},optimised:{pseudoClasses:{"first-child":"[1]","last-child":"[last()]","only-child":"[last()=1]"}},rules:extend({},{"@!KHTML":{"(^|\\x02) (\\*|[\\w-]+)#([\\w-]+)":"$1id('$3')[self::$2]","([ >])(\\*|[\\w-]+):([\\w-]+-child(\\(([^)]+)\\))?)":function(_26d,_26e,_26f,_270,$4,args){
var _273=(_26e==" ")?"//*":"/*";
if(/^nth/i.test(_270)){
_273+=_nthChild(_270,args,"position()");
}else{
_273+=_267.optimised.pseudoClasses[_270];
}
return _273+"[self::"+_26f+"]";
}}}),types:{identifiers:function(_274,_275){
this[rescape(_275)+"([\\w-]+)"]=_274;
},combinators:function(_276,_277){
this[rescape(_277)+"(\\*|[\\w-]+)"]=_276;
},attributes:function(_278,_279){
this["\\[([\\w-]+)\\s*"+rescape(_279)+"\\s*([^\\]]*)\\]"]=_278;
},pseudoClasses:function(_27a,_27b){
this[":"+_27b.replace(/\(\)$/,"\\(([^)]+)\\)")]=_27a;
}},values:{identifiers:{"#":"[@id='$1'][1]",".":"[contains(concat(' ',@class,' '),' $1 ')]"},combinators:{" ":"/descendant::$1",">":"/child::$1","+":"/following-sibling::*[1][self::$1]","~":"/following-sibling::$1"},attributes:{"*=":"[contains(@$1,'$2')]","^=":"[starts-with(@$1,'$2')]","$=":"[substring(@$1,string-length(@$1)-string-length('$2')+1)='$2']","~=":"[contains(concat(' ',@$1,' '),' $2 ')]","|=":"[contains(concat('-',@$1,'-'),'-$2-')]","!=":"[not(@$1='$2')]","=":"[@$1='$2']"},pseudoClasses:{"empty":"[not(child::*) and not(text())]","first-child":"[not(preceding-sibling::*)]","last-child":"[not(following-sibling::*)]","not()":_not,"nth-child()":_nthChild,"nth-last-child()":_nthChild,"only-child":"[not(preceding-sibling::*) and not(following-sibling::*)]","root":"[not(parent::*)]"}},"@opera":{init:function(){
this.optimised.pseudoClasses["last-child"]=this.values.pseudoClasses["last-child"];
this.optimised.pseudoClasses["only-child"]=this.values.pseudoClasses["only-child"];
this.base();
}}});
var _27c=new _267;
function _not(_27d,args){
return "[not("+_27c.exec(trim(args)).replace(/\[1\]/g,"").replace(/^(\*|[\w-]+)/,"[self::$1]").replace(/\]\[/g," and ").slice(1,-1)+")]";
}
function _nthChild(_27f,args,_281){
return "["+_204._nthChild(_27f,args,_281||"count(preceding-sibling::*)+1","last()","not"," and "," mod ","=")+"]";
}
_1fa.implement({toXPath:function(){
return _1fa.toXPath(this);
},"@(XPathResult)":{$evaluate:function(_282,_283){
if(_1fa.$NOT_XPATH.test(this)){
return this.base(_282,_283);
}
var _284=_17f.getDocument(_282);
var type=_283?9:7;
var _286=_284.evaluate(this.toXPath(),_282,null,type,null);
return _283?_286.singleNodeValue:_286;
}},"@MSIE":{$evaluate:function(_287,_288){
if(typeof _287.selectNodes!="undefined"&&!_1fa.$NOT_XPATH.test(this)){
var _289=_288?"selectSingleNode":"selectNodes";
return _287[_289](this.toXPath());
}
return this.base(_287,_288);
}}});
extend(_1fa,{xpathParser:null,toXPath:function(_28a){
if(!this.xpathParser){
this.xpathParser=new _267;
}
return this.xpathParser.parse(_28a);
},$NOT_XPATH:/:(checked|disabled|enabled|contains)|^(#[\w-]+\s*)?\w+$/,"@KHTML":{$NOT_XPATH:/:(checked|disabled|enabled|contains)|^(#[\w-]+\s*)?\w+$|nth\-|,/,"@!WebKit5":{$NOT_XPATH:/./}}});
var Node=_17d.extend({"@!(element.compareDocumentPosition)":{compareDocumentPosition:function(node,_28d){
if(_17f.contains(node,_28d)){
return 4|16;
}else{
if(_17f.contains(_28d,node)){
return 2|8;
}
}
var _28e=Node.$getSourceIndex(node);
var _28f=Node.$getSourceIndex(_28d);
if(_28e<_28f){
return 4;
}else{
if(_28e>_28f){
return 2;
}
}
return 0;
}}},{$getSourceIndex:function(node){
var key=0;
while(node){
key=_17f.getNodeIndex(node)+"."+key;
node=node.parentNode;
}
return key;
},"@(element.sourceIndex)":{$getSourceIndex:function(node){
return node.sourceIndex;
}}});
var _293=Node.extend(null,{bind:function(_294){
this.base(_294);
extend(_294,"createElement",function(_295){
return DOM.bind(this.base(_295));
});
_194.bind(_294.defaultView);
return _294;
},"@!(document.defaultView)":{bind:function(_296){
_296.defaultView=_17f.getDefaultView(_296);
return this.base(_296);
}}});
_293.createDelegate("createElement",2);
var _297=Node.extend({"@MSIE[67]":{getAttribute:function(_298,name,_29a){
if(_298.className===undefined||name=="href"||name=="src"){
return this.base(_298,name,2);
}
var _29b=_298.getAttributeNode(name);
return _29b&&_29b.specified?_29b.nodeValue:null;
}},"@MSIE5.+win":{getAttribute:function(_29c,name,_29e){
if(_29c.className===undefined||name=="href"||name=="src"){
return this.base(_29c,name,2);
}
var _29f=_29c.attributes[this.$attributes[name.toLowerCase()]||name];
return _29f?_29f.specified?_29f.nodeValue:null:this.base(_29c,name);
}}},{$attributes:{},"@MSIE5.+win":{init:function(){
var _2a0="colSpan,rowSpan,vAlign,dateTime,accessKey,tabIndex,encType,maxLength,readOnly,longDesc";
var keys=_2a0.toLowerCase().split(",");
var _2a2=_2a0.split(",");
this.$attributes=Array2.combine(keys,_2a2);
}}});
_297.createDelegate("setAttribute",3);
extend(_297.prototype,"cloneNode",function(deep){
var _2a4=this.base(deep||false);
_2a4.base2ID=undefined;
return _2a4;
});
_194.implement(_1ce);
_293.implement(_1ed);
_293.implement(_1c5);
_293.implement(_1a2);
_297.implement(_1ee);
_297.implement(_1a2);
var _2a5=_293.extend(null,{"@(document.activeElement===undefined)":{bind:function(_2a6){
this.base(_2a6);
_2a6.activeElement=null;
_2a6.addEventListener("focus",function(_2a7){
_2a6.activeElement=_2a7.target;
},false);
return _2a6;
}}});
var _2a8=_297.extend({addClass:function(_2a9,_2aa){
if(!this.hasClass(_2a9,_2aa)){
_2a9.className+=(_2a9.className?" ":"")+_2aa;
}
},hasClass:function(_2ab,_2ac){
var _2ad=new RegExp("(^|\\s)"+_2ac+"(\\s|$)");
return _2ad.test(_2ab.className);
},removeClass:function(_2ae,_2af){
var _2b0=new RegExp("(^|\\s)"+_2af+"(\\s|$)","g");
_2ae.className=_2ae.className.replace(_2b0,"$2");
},toggleClass:function(_2b1,_2b2){
if(this.hasClass(_2b1,_2b2)){
this.removeClass(_2b1,_2b2);
}else{
this.addClass(_2b1,_2b2);
}
}},{bindings:{},tags:"*",extend:function(){
var _2b3=base(this,arguments);
var tags=(_2b3.tags||"").toUpperCase().split(",");
forEach(tags,function(_2b5){
_2a8.bindings[_2b5]=_2b3;
});
return _2b3;
},"@!(element.ownerDocument)":{bind:function(_2b6){
this.base(_2b6);
_2b6.ownerDocument=_17f.getOwnerDocument(_2b6);
return _2b6;
}}});
DOM.$=function(_2b7,_2b8){
return new _1fa(_2b7).exec(_2b8,1);
};
DOM.$$=function(_2b9,_2ba){
return new _1fa(_2b9).exec(_2ba);
};
eval(this.exports);
};
if(typeof (base2)=="undefined"){
throw new Error("Base2 not found. wForms 3.0 depends on the base2 library.");
}
base2.DOM.bind(document);
if(typeof (wFORMS)=="undefined"){
wFORMS={};
}
wFORMS.NAME="wFORMS";
wFORMS.VERSION="3.0.beta";
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
wFORMS.helpers.getFieldValue=function(_2bd){
switch(_2bd.tagName){
case "INPUT":
if(_2bd.type=="checkbox"){
return _2bd.checked?_2bd.value:null;
}
if(_2bd.type=="radio"){
return _2bd.checked?_2bd.value:null;
}
return _2bd.value;
break;
case "SELECT":
if(_2bd.selectedIndex==-1){
return null;
}
if(_2bd.getAttribute("multiple")){
var v=[];
for(var i=0;i<_2bd.options.length;i++){
if(_2bd.options[i].selected){
v.push(_2bd.options[i].value);
}
}
return v;
}
return _2bd.options[_2bd.selectedIndex].value;
break;
case "TEXTAREA":
return _2bd.value;
break;
default:
return null;
break;
}
};
wFORMS.helpers.getComputedStyle=function(_2c0,_2c1){
if(document.defaultView&&document.defaultView.getComputedStyle){
return document.defaultView.getComputedStyle(_2c0,"")[_2c1];
}else{
if(_2c0.currentStyle){
return _2c0.currentStyle[_2c1];
}
}
return false;
};
wFORMS.helpers.getLeft=function(elem){
var pos=0;
while(elem.offsetParent){
if(wFORMS.helpers.getComputedStyle(elem,"position")=="relative"){
return pos;
}
if(pos>0&&wFORMS.helpers.getComputedStyle(elem,"position")=="absolute"){
return pos;
}
pos+=elem.offsetLeft;
elem=elem.offsetParent;
}
return pos;
};
wFORMS.helpers.getTop=function(elem){
var pos=0;
while(elem.offsetParent){
if(wFORMS.helpers.getComputedStyle(elem,"position")=="relative"){
return pos;
}
if(pos>0&&wFORMS.helpers.getComputedStyle(elem,"position")=="absolute"){
return pos;
}
pos+=elem.offsetTop;
elem=elem.offsetParent;
}
return pos;
};
wFORMS.helpers.activateStylesheet=function(_2c6){
if(document.getElementsByTagName){
var ss=document.getElementsByTagName("link");
}else{
if(document.styleSheets){
var ss=document.styleSheets;
}
}
for(var i=0;ss[i];i++){
if(ss[i].href.indexOf(_2c6)!=-1){
ss[i].disabled=true;
ss[i].disabled=false;
}
}
};
wFORMS.onLoadHandler=function(){
document.matchAll("form").forEach(function(f){
wFORMS.applyBehaviors(f);
});
};
wFORMS.applyBehaviors=function(f){
if(!f.matchAll){
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
for(var _2cc in wFORMS.behaviors){
if(_2cc=="switch"){
continue;
}
var b=wFORMS.behaviors[_2cc].applyTo(f);
if(b&&b.constructor.toString().indexOf("Array")==-1){
b=[b];
}
for(var i=0;b&&i<b.length;i++){
if(!wFORMS.instances[_2cc]){
wFORMS.instances[_2cc]=[b[i]];
}else{
wFORMS.removeBehavior(f,_2cc);
wFORMS.instances[_2cc].push(b[i]);
}
}
}
};
wFORMS.removeBehavior=function(f,_2cf){
return null;
if(!wFORMS.instances[_2cf]){
return null;
}
for(var i=0;i<wFORMS.instances[_2cf].length;i++){
if(wFORMS.instances[_2cf][i].target==f){
wFORMS.instances[_2cf][i]=null;
}
}
return null;
};
wFORMS.getBehaviorInstance=function(f,_2d2){
if(!wFORMS.instances[_2d2]){
return null;
}
for(var i=0;i<wFORMS.instances[_2d2].length;i++){
if(wFORMS.instances[_2d2][i].target==f){
return wFORMS.instances[_2d2][i];
}
}
return null;
};
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
f.matchAll(wFORMS.behaviors.hint.HINT_SELECTOR).forEach(function(elem){
var e=b.getElementByHintId(elem.id);
if(e){
if(!e.addEventListener){
base2.DOM.bind(e);
}
if(e.tagName.match(/(select)|(input)|(textarea)/i)){
if(e.attachEvent){
e.attachEvent("onfocus",function(){
b.run(window.event,e);
});
e.attachEvent("onblur",function(){
b.run(window.event,e);
});
}else{
e.addEventListener("focus",function(_2d9){
b.run(_2d9,e);
},false);
e.addEventListener("blur",function(_2da){
b.run(_2da,e);
},false);
}
}else{
e.addEventListener("mouseover",function(_2db){
b.run(_2db,e);
},false);
e.addEventListener("mouseout",function(_2dc){
b.run(_2dc,e);
},false);
}
}
});
return b;
};
wFORMS.behaviors.hint.instance.prototype.run=function(_2dd,_2de){
var hint=this.getHintElement(_2de);
if(!hint){
return;
}
if(_2dd.type=="focus"||_2dd.type=="mouseover"){
hint.removeClass(wFORMS.behaviors.hint.CSS_INACTIVE);
hint.addClass(wFORMS.behaviors.hint.CSS_ACTIVE);
this.setup(hint,_2de);
}else{
hint.addClass(wFORMS.behaviors.hint.CSS_INACTIVE);
hint.removeClass(wFORMS.behaviors.hint.CSS_ACTIVE);
}
};
wFORMS.behaviors.hint.instance.prototype.getElementByHintId=function(_2e0){
var id=_2e0.substr(0,_2e0.length-wFORMS.behaviors.hint.HINT_SUFFIX.length);
var e=document.getElementById(id);
return e;
};
wFORMS.behaviors.hint.instance.prototype.getHintElement=function(_2e3){
var e=document.getElementById(_2e3.id+this.behavior.HINT_SUFFIX);
return e&&e!=""?e:null;
};
wFORMS.behaviors.hint.instance.prototype.setup=function(hint,_2e6){
hint.style.left=((_2e6.tagName=="SELECT"?+_2e6.offsetWidth:0)+wFORMS.helpers.getLeft(_2e6))+"px";
hint.style.top=(wFORMS.helpers.getTop(_2e6)+_2e6.offsetHeight)+"px";
};
wFORMS.behaviors.hint.isHintId=function(id){
return id.match(new RegExp(wFORMS.behaviors.hint.HINT_SUFFIX+"$"))!=null;
};
if(typeof (wFORMS)=="undefined"){
throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
wFORMS.behaviors.paging={SELECTOR:"*[class~=\"wfPage\"]",CSS_PAGE:"wfPage",CSS_CURRENT_PAGE:"wfCurrentPage",CSS_BUTTON_NEXT:"wfPageNextButton",CSS_BUTTON_PREVIOUS:"wfPagePreviousButton",CSS_BUTTON_PLACEHOLDER:"wfPagingButtons",ID_BUTTON_NEXT_PREFIX:"wfPageNextId",ID_BUTTON_PREVIOUS_PREFIX:"wfPagePreviousId",CSS_SUBMIT_HIDDEN:"wfHideSubmit",ID_PAGE_PREFIX:"wfPgIndex-",ID_PLACEHOLDER_SUFFIX:"-buttons",ATTR_INDEX:"wfPageIndex_activate",MESSAGES:{CAPTION_NEXT:"Next Page",CAPTION_PREVIOUS:"Previous Page"},runValidationOnPageNext:true,instance:function(f){
this.behavior=wFORMS.behaviors.paging;
this.target=f;
this.currentPageIndex=1;
}};
wFORMS.behaviors.paging.applyTo=function(f){
var b=new wFORMS.behaviors.paging.instance(f);
var _2eb=wFORMS.behaviors.paging;
var _2ec=(wFORMS.behaviors.validation&&wFORMS.behaviors.paging.runValidationOnPageNext);
var _2ed=false;
f.matchAll(wFORMS.behaviors.paging.SELECTOR).forEach(function(elem){
_2ed=true;
var ph=b.getOrCreatePlaceHolder(elem);
var _2f0=wFORMS.behaviors.paging.getPageIndex(elem);
if(_2f0==1){
var ctrl=base2.DOM.bind(ph.appendChild(_2eb._createNextPageButton(_2f0)));
if(_2ec){
ctrl.addEventListener("click",function(_2f2){
var v=wFORMS.getBehaviorInstance(b.target,"validation");
if(v.run(_2f2,elem)){
b.run(_2f2,ctrl);
}
},false);
}else{
ctrl.addEventListener("click",function(_2f4){
b.run(_2f4,ctrl);
},false);
}
wFORMS.behaviors.paging.showPage(elem);
}else{
var ctrl=base2.DOM.bind(_2eb._createPreviousPageButton(_2f0));
ph.insertBefore(ctrl,ph.firstChild);
ctrl.addEventListener("click",function(_2f5){
b.run(_2f5,ctrl);
},false);
if(!wFORMS.behaviors.paging.isLastPageIndex(_2f0,true)){
var _2f6=base2.DOM.bind(ph.appendChild(_2eb._createNextPageButton(_2f0)));
if(_2ec){
_2f6.addEventListener("click",function(_2f7){
var v=wFORMS.getBehaviorInstance(b.target,"validation");
if(v.run(_2f7,elem)){
b.run(_2f7,_2f6);
}
},false);
}else{
_2f6.addEventListener("click",function(_2f9){
b.run(_2f9,_2f6);
},false);
}
}
}
});
if(_2ed){
p=b.findNextPage(0);
b.currentPageIndex=0;
b.activatePage(wFORMS.behaviors.paging.getPageIndex(p));
}
return b;
};
wFORMS.behaviors.paging.getPageIndex=function(elem){
if(elem&&elem.id){
var _2fb=elem.id.replace(new RegExp(wFORMS.behaviors.paging.ID_PAGE_PREFIX+"(\\d+)"),"$1");
_2fb=parseInt(_2fb);
return !isNaN(_2fb)?_2fb:false;
}
return false;
};
wFORMS.behaviors.paging._createNextPageButton=function(_2fc){
var elem=wFORMS.behaviors.paging.createNextPageButton();
elem.setAttribute(wFORMS.behaviors.paging.ATTR_INDEX,_2fc+1);
elem.id=wFORMS.behaviors.paging.ID_BUTTON_NEXT_PREFIX+_2fc;
return elem;
};
wFORMS.behaviors.paging.createNextPageButton=function(){
var elem=document.createElement("input");
elem.setAttribute("value",wFORMS.behaviors.paging.MESSAGES.CAPTION_NEXT);
elem.setAttribute("type","button");
elem.className=wFORMS.behaviors.paging.CSS_BUTTON_NEXT;
return elem;
};
wFORMS.behaviors.paging._createPreviousPageButton=function(_2ff){
var elem=wFORMS.behaviors.paging.createPreviousPageButton();
elem.setAttribute(wFORMS.behaviors.paging.ATTR_INDEX,_2ff-1);
elem.id=wFORMS.behaviors.paging.ID_BUTTON_PREVIOUS_PREFIX+_2ff;
return elem;
};
wFORMS.behaviors.paging.createPreviousPageButton=function(){
var elem=document.createElement("input");
elem.setAttribute("value",wFORMS.behaviors.paging.MESSAGES.CAPTION_PREVIOUS);
elem.setAttribute("type","button");
elem.className=wFORMS.behaviors.paging.CSS_BUTTON_PREVIOUS;
return elem;
};
wFORMS.behaviors.paging.instance.prototype.getOrCreatePlaceHolder=function(_302){
var id=_302.id+wFORMS.behaviors.paging.ID_PLACEHOLDER_SUFFIX;
var elem=document.getElementById(id);
if(!elem){
elem=_302.appendChild(document.createElement("div"));
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
wFORMS.behaviors.paging.instance.prototype.activatePage=function(_307){
if(_307==this.currentPageIndex){
return false;
}
_307=parseInt(_307);
if(_307>this.currentPageIndex){
var p=this.findNextPage(this.currentPageIndex);
}else{
var p=this.findPreviousPage(this.currentPageIndex);
}
if(p){
var _307=wFORMS.behaviors.paging.getPageIndex(p);
var b=wFORMS.behaviors.paging;
var _30a=this;
setTimeout(function(){
_30a.setupManagedControls(_307);
b.hidePage(b.getPageByIndex(_30a.currentPageIndex));
b.showPage(p);
_30a.currentPageIndex=_307;
},1);
}
};
wFORMS.behaviors.paging.instance.prototype.setupManagedControls=function(_30b){
if(!_30b){
_30b=this.currentPageIndex;
}
var b=wFORMS.behaviors.paging;
if(b.isFirstPageIndex(_30b)){
if(ctrl=b.getPreviousButton(_30b)){
ctrl.style.display="none";
}
}else{
if(ctrl=b.getPreviousButton(_30b)){
ctrl.style.display="inline";
}
}
if(b.isLastPageIndex(_30b)){
if(ctrl=b.getNextButton(_30b)){
ctrl.style.display="none";
}
this.showSubmitButtons();
}else{
if(ctrl=b.getNextButton(_30b)){
ctrl.style.display="inline";
}
this.hideSubmitButtons();
}
};
wFORMS.behaviors.paging.instance.prototype.showSubmitButtons=function(){
this.target.matchAll("input[type~=\"submit\"]").forEach(function(elem){
elem.removeClass(wFORMS.behaviors.paging.CSS_SUBMIT_HIDDEN);
});
};
wFORMS.behaviors.paging.instance.prototype.hideSubmitButtons=function(){
this.target.matchAll("input[type~=\"submit\"]").forEach(function(elem){
elem.addClass(wFORMS.behaviors.paging.CSS_SUBMIT_HIDDEN);
});
};
wFORMS.behaviors.paging.getPageByIndex=function(_30f){
var page=document.getElementById(wFORMS.behaviors.paging.ID_PAGE_PREFIX+_30f);
return page?base2.DOM.bind(page):false;
};
wFORMS.behaviors.paging.getNextButton=function(_311){
return document.getElementById(wFORMS.behaviors.paging.ID_BUTTON_NEXT_PREFIX+_311);
};
wFORMS.behaviors.paging.getPreviousButton=function(_312){
return document.getElementById(wFORMS.behaviors.paging.ID_BUTTON_PREVIOUS_PREFIX+_312);
};
wFORMS.behaviors.paging.isLastPageIndex=function(_313,_314){
_313=parseInt(_313)+1;
var b=wFORMS.behaviors.paging;
var p=b.getPageByIndex(_313);
if((_b=wFORMS.behaviors["switch"])&&!_314){
while(p&&_b.isSwitchedOff(p)){
_313++;
p=b.getPageByIndex(_313);
}
}
return p?false:true;
};
wFORMS.behaviors.paging.isFirstPageIndex=function(_317,_318){
_317=parseInt(_317)-1;
var b=wFORMS.behaviors.paging;
var p=b.getPageByIndex(_317);
if((_b=wFORMS.behaviors["switch"])&&!_318){
while(p&&_b.isSwitchedOff(p)){
_317--;
p=b.getPageByIndex(_317);
}
}
return p?false:true;
};
wFORMS.behaviors.paging.instance.prototype.findNextPage=function(_31b){
_31b=parseInt(_31b)+1;
var b=wFORMS.behaviors.paging;
var p=b.getPageByIndex(_31b);
if(_b=wFORMS.behaviors["switch"]){
while(p&&_b.isSwitchedOff(p)){
_31b++;
p=b.getPageByIndex(_31b);
}
}
return p?p:true;
};
wFORMS.behaviors.paging.instance.prototype.findPreviousPage=function(_31e){
_31e=parseInt(_31e)-1;
var b=wFORMS.behaviors.paging;
var p=b.getPageByIndex(_31e);
if(_b=wFORMS.behaviors["switch"]){
while(p&&_b.isSwitchedOff(p)){
_31e--;
p=b.getPageByIndex(_31e);
}
}
return p?p:false;
};
wFORMS.behaviors.paging.instance.prototype.run=function(e,_322){
this.activatePage(_322.getAttribute(wFORMS.behaviors.paging.ATTR_INDEX));
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
var _328=this;
var b=new Array();
f.matchAll(this.SELECTOR_REPEAT).forEach(function(elem){
if(_328.isHandled(elem)){
return;
}
if(!elem.id){
elem.id=wFORMS.helpers.randomId();
}
var _b=new _328.instance(elem);
var e=_b.getOrCreateRepeatLink(elem);
e.addEventListener("click",function(_32d){
_b.run(_32d,e);
},false);
b.push(_b);
_328.handleElement(elem);
});
var _32e=function(elem){
e=_328.createRemoveLink(elem.id);
if(elem.tagName=="TR"){
var tds=elem.getElementsByTagName("TD");
var _331=tds[tds.length-1];
_331.appendChild(e);
}else{
elem.appendChild(e);
}
};
if(f.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE)){
_32e(f);
}
f.matchAll(this.SELECTOR_REMOVEABLE).forEach(function(e){
_32e(e);
});
return b;
};
wFORMS.behaviors.repeat.instance.prototype.getOrCreateRepeatLink=function(elem){
var id=elem.id+wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK;
var e=document.getElementById(id);
if(!e||e==""){
e=this.createRepeatLink(id);
var _336=document.createElement("span");
_336.className=wFORMS.behaviors.repeat.CSS_DUPLICATE_SPAN;
e=_336.appendChild(e);
if(elem.tagName.toUpperCase()=="TR"){
var _337=elem.matchSingle("td:nth-last-child(0n+1)");
if(_337==""){
_337=elem.appendChild(document.createElement("TD"));
}
_337.appendChild(_336);
}else{
elem.appendChild(_336);
}
}
return base2.DOM.bind(e);
};
wFORMS.behaviors.repeat.instance.prototype.createRepeatLink=function(id){
var _339=document.createElement("a");
_339.id=id;
_339.setAttribute("href","#");
_339.className=wFORMS.behaviors.repeat.CSS_DUPLICATE_LINK;
_339.setAttribute("title",wFORMS.behaviors.repeat.MESSAGES.ADD_TITLE);
_339.appendChild(document.createElement("span").appendChild(document.createTextNode(wFORMS.behaviors.repeat.MESSAGES.ADD_CAPTION)));
return _339;
};
wFORMS.behaviors.repeat.createRemoveLink=function(id){
var _33b=document.createElement("a");
_33b.id=id+wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK;
_33b.setAttribute("href","#");
_33b.className=wFORMS.behaviors.repeat.CSS_DELETE_LINK;
_33b.setAttribute("title",wFORMS.behaviors.repeat.MESSAGES.REMOVE_TITLE);
_33b.setAttribute(wFORMS.behaviors.repeat.ATTR_LINK_SECTION_ID,id);
var _33c=document.createElement("span");
_33c.appendChild(document.createTextNode(wFORMS.behaviors.repeat.MESSAGES.REMOVE_CAPTION));
_33b.appendChild(_33c);
_33b.onclick=function(_33d){
wFORMS.behaviors.repeat.onRemoveLinkClick(_33d,_33b);
};
var _33c=document.createElement("span");
_33c.className=wFORMS.behaviors.repeat.CSS_DELETE_SPAN;
_33c.appendChild(_33b);
return _33c;
};
wFORMS.behaviors.repeat.instance.prototype.getTargetByRepeatLink=function(elem){
return this.target.matchSingle("#"+elem.id.substring(0,elem.id.length-wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK.length));
};
wFORMS.behaviors.repeat.instance.prototype.duplicateSection=function(elem){
if(!this.behavior.allowRepeat(elem,this)){
return false;
}
this.updateMasterSection(elem);
var _340=base2.DOM.bind(elem.cloneNode(true));
var _341=elem;
while(_341&&(_341.nodeType==3||_341.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE)||_341.hasClass(wFORMS.behaviors.repeat.CSS_REPEATABLE))){
_341=_341.nextSibling;
if(_341&&_341.nodeType==1&&!_341.hasClass){
_341=base2.DOM.bind(_341);
}
}
elem.parentNode.insertBefore(_340,_341);
this.updateDuplicatedSection(_340);
wFORMS.applyBehaviors(_340);
wFORMS.behaviors.repeat.onRepeat(_340);
};
wFORMS.behaviors.repeat.removeSection=function(id){
var elem=document.getElementById(id);
if(elem!=""){
elem.parentNode.removeChild(elem);
wFORMS.behaviors.repeat.onRemove();
}
};
wFORMS.behaviors.repeat.onRemoveLinkClick=function(_344,elem){
this.removeSection(elem.getAttribute(wFORMS.behaviors.repeat.ATTR_LINK_SECTION_ID));
if(_344){
_344.preventDefault();
}
};
wFORMS.behaviors.repeat.instance.prototype.updateMasterSection=function(elem){
if(elem.doItOnce==true){
return true;
}else{
elem.doItOnce=true;
}
var _347=this.createSuffix(elem);
elem.id=this.clearSuffix(elem.id)+_347;
this.updateMasterElements(elem,_347);
};
wFORMS.behaviors.repeat.instance.prototype.updateMasterElements=function(elem,_349){
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
base2.DOM.bind(n);
}
if(n.hasClass(wFORMS.behaviors.repeat.CSS_REPEATABLE)){
_349+="[0]";
}
if(!n.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE)){
for(var j=0;j<wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY.length;j++){
var _34e=wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY[j];
var _34f=this.clearSuffix(n.getAttribute(_34e));
if(!_34f){
continue;
}
if(wFORMS.behaviors.hint&&wFORMS.behaviors.hint.isHintId(n.id)){
n.setAttribute(_34e,_34f.replace(new RegExp("(.*)("+wFORMS.behaviors.hint.HINT_SUFFIX+")$"),"$1"+_349+"$2"));
}else{
if(n.id.indexOf(wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK)!=-1){
n.setAttribute(_34e,_34f.replace(new RegExp("(.*)("+wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK+")$"),"$1"+_349+"$2"));
}else{
n.setAttribute(_34e,_34f+_349);
}
}
}
this.updateMasterElements(n,_349);
}
}
};
wFORMS.behaviors.repeat.instance.prototype.updateDuplicatedSection=function(elem){
var _351=this;
var _352=this.getNextDuplicateIndex(this.target);
var _353=this.createSuffix(elem,_352);
elem.setAttribute(wFORMS.behaviors.repeat.ATTR_MASTER_SECTION,elem.id);
elem.id=this.clearSuffix(elem.id)+_353;
elem.className=elem.className.replace(wFORMS.behaviors.repeat.CSS_REPEATABLE,wFORMS.behaviors.repeat.CSS_REMOVEABLE);
if(elem.hasClass(wFORMS.behaviors.repeat.CSS_PRESERVE_RADIO_NAME)){
var _354=true;
}else{
var _354=wFORMS.behaviors.repeat.preserveRadioName;
}
this.updateSectionChildNodes(elem.matchAll("> *"),_353,_354);
};
wFORMS.behaviors.repeat.instance.prototype.updateSectionChildNodes=function(_355,_356,_357){
var _358=this;
_355.forEach(function(e){
if(wFORMS.behaviors.repeat.isDuplicate(e)){
e.parentNode.removeChild(e);
return;
}
if(e.hasClass(wFORMS.behaviors.repeat.CSS_DUPLICATE_SPAN)){
e.parentNode.removeChild(e);
return;
}
if(e.hasClass(wFORMS.behaviors.repeat.CSS_DUPLICATE_LINK)){
e.parentNode.removeChild(e);
return;
}
var _35a=e.tagName.toUpperCase();
if(_35a=="INPUT"||_35a=="TEXTAREA"){
if(e.type!="radio"&&e.type!="checkbox"){
e.value="";
}else{
e.checked=false;
}
}
_358.updateAttributes(e,_356,_357);
if(_elems=e.matchAll("> *")){
if(e.hasClass(wFORMS.behaviors.repeat.CSS_REPEATABLE)){
_358.updateSectionChildNodes(_elems,wFORMS.behaviors.repeat.instance.prototype.createSuffix(e),_357);
}else{
_358.updateSectionChildNodes(_elems,_356,_357);
}
}
});
};
wFORMS.behaviors.repeat.instance.prototype.createSuffix=function(e,_35c){
var _35d="["+(_35c?_35c:"0")+"]";
var reg=/\[(\d+)\]$/;
e=e.parentNode;
while(e){
if(e.hasClass&&(e.hasClass(wFORMS.behaviors.repeat.CSS_REPEATABLE)||e.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE))){
var idx=reg.exec(e.id);
if(idx){
idx=idx[1];
}
_35d="["+(idx?idx:"0")+"]"+_35d;
}
e=e.parentNode;
}
return _35d;
};
wFORMS.behaviors.repeat.instance.prototype.clearSuffix=function(_360){
if(!_360){
return;
}
if(_360.indexOf("[")!=-1){
return _360.substring(0,_360.indexOf("["));
}
return _360;
};
wFORMS.behaviors.repeat.instance.prototype.updateAttributes=function(e,_362,_363){
var _364=wFORMS.behaviors.hint&&wFORMS.behaviors.hint.isHintId(e.id);
var _365=e.id.indexOf(wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK)!=-1;
wFORMS.behaviors.repeat.setInDuplicateGroup(e);
if(wFORMS.behaviors.repeat.isHandled(e)){
wFORMS.behaviors.repeat.removeHandled(e);
}
if(wFORMS.behaviors["switch"]&&wFORMS.behaviors["switch"].isHandled(e)){
wFORMS.behaviors["switch"].removeHandle(e);
}
for(var i=0;i<wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY.length;i++){
var _367=wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY[i];
var _368=this.clearSuffix(e.getAttribute(_367));
if(!_368){
continue;
}
if(_367=="name"&&e.tagName.toUpperCase()=="INPUT"&&_363){
continue;
}
if(_364&&_367=="id"){
e.setAttribute("id",_368+_362+wFORMS.behaviors.hint.HINT_SUFFIX);
}else{
if(_365){
e.setAttribute(_367,_368.replace(new RegExp("(.*)("+wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK+")$"),"$1"+_362+"$2"));
}else{
e.setAttribute(_367,_368+_362);
}
}
}
};
wFORMS.behaviors.repeat.instance.prototype.getNextDuplicateIndex=function(elem){
var c=wFORMS.behaviors.repeat.getOrCreateCounterField(elem);
var _36b=parseInt(c.value)+1;
c.value=_36b;
return _36b;
};
wFORMS.behaviors.repeat.getOrCreateCounterField=function(elem){
var cId=elem.id+wFORMS.behaviors.repeat.ID_SUFFIX_COUNTER;
var _36e=document.getElementById(cId);
if(!_36e||_36e==""){
_36e=wFORMS.behaviors.repeat.createCounterField(cId);
var _36f=elem.parentNode;
while(_36f&&_36f.tagName.toUpperCase()!="FORM"){
_36f=_36f.parentNode;
}
_36f.appendChild(_36e);
}
return _36e;
};
wFORMS.behaviors.repeat.createCounterField=function(id){
cElem=base2.DOM.bind(document.createElement("input"));
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
wFORMS.behaviors.repeat.instance.prototype.run=function(e,_37d){
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
f.matchAll(wFORMS.behaviors["switch"].SELECTOR).forEach(function(elem){
if(!elem.id){
elem.id=wFORMS.helpers.randomId();
}
switch(elem.tagName.toUpperCase()){
case "OPTION":
var _385=elem.parentNode;
while(_385&&_385.tagName.toUpperCase()!="SELECT"){
_385=_385.parentNode;
}
base2.DOM.bind(_385);
if(_385&&!wFORMS.behaviors["switch"].isHandled(_385)){
_385.addEventListener("change",function(_386){
b.run(_386,_385);
},false);
b.setupTargets(elem);
wFORMS.behaviors["switch"].handleElement(_385);
}
break;
case "INPUT":
if(elem.type&&elem.type.toUpperCase()=="RADIO"){
if(!wFORMS.behaviors["switch"].isHandled(elem)){
b.setupTargets(elem);
}
var _387=elem.form[elem.name];
for(var i=_387.length-1;i>=0;i--){
var _389=base2.DOM.bind(_387[i]);
if(!wFORMS.behaviors["switch"].isHandled(_389)){
_389.addEventListener("click",function(_38a){
b.run(_38a,_389);
},false);
wFORMS.behaviors["switch"].handleElement(_389);
}
}
}else{
elem.addEventListener("click",function(_38b){
b.run(_38b,elem);
},false);
b.setupTargets(elem);
}
break;
default:
elem.addEventListener("click",function(_38c){
b.run(_38c,elem);
},false);
break;
}
});
return b;
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
wFORMS.behaviors["switch"].instance.prototype.getTriggersByElements=function(_390,_391){
var o={ON:new Array(),OFF:new Array(),toString:function(){
return "ON: "+this.ON+"\nOFF: "+this.OFF;
}};
for(var i=0;i<_390.length;i++){
var elem=_390[i];
switch(elem.tagName.toUpperCase()){
case "OPTION":
if(elem.selected){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(elem,_391));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(elem,_391));
}
break;
case "SELECT":
for(var j=0;j<elem.options.length;j++){
var opt=elem.options.item(j);
if(opt.selected){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(opt,_391));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(opt,_391));
}
}
break;
case "INPUT":
if(elem.type&&elem.type.toUpperCase()=="RADIO"){
var _397=elem.form[elem.name];
for(var j=_397.length-1;j>=0;j--){
var _398=_397[j];
if(_398==elem||!base2.Array2.contains(_390,_398)){
if(_398.checked){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(_398,_391));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(_398,_391));
}
}
}
}else{
if(elem.checked){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(elem,_391));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(elem,_391));
}
}
break;
default:
if(elem.hasClass(this.behavior.CSS_ONSTATE_FLAG)){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(elem,_391));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(elem,_391));
}
break;
}
}
var _ON=new Array();
for(var i=0;i<o.ON.length;i++){
if(!base2.Array2.contains(_ON,o.ON[i])){
_ON.push(o.ON[i]);
}
}
var _OFF=new Array();
for(var i=0;i<o.OFF.length;i++){
if(!base2.Array2.contains(_OFF,o.OFF[i])){
_OFF.push(o.OFF[i]);
}
}
o.ON=_ON;
o.OFF=_OFF;
return o;
};
wFORMS.behaviors["switch"].getSwitchNamesFromTrigger=function(elem,_39c){
return wFORMS.behaviors["switch"].getSwitchNames(elem.className,"trigger",_39c);
};
wFORMS.behaviors["switch"].getSwitchNamesFromTarget=function(elem,_39e){
return wFORMS.behaviors["switch"].getSwitchNames(elem.className,"target",_39e);
};
wFORMS.behaviors["switch"].getSwitchNames=function(_39f,_3a0,_3a1){
if(!_39f||_39f==""){
return [];
}
var _3a2=_39f.split(" ");
var _3a3=new Array();
if(_3a0=="trigger"){
var _3a4=true;
}else{
var _3a4=false;
}
for(var i=_3a2.length-1;i>=0;i--){
var cn=_3a2[i];
if(_3a4){
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
if(sn&&(!_3a1||base2.Array2.contains(_3a1,sn))){
_3a3.push(sn);
}
}
return _3a3;
};
wFORMS.behaviors["switch"].instance.prototype.getTargetsBySwitchName=function(_3a8,_3a9){
var res=new Array();
var _3ab=this;
var b=wFORMS.behaviors.repeat;
if(arguments[1]=="ON"){
var _3ad=[wFORMS.behaviors["switch"].CSS_ONSTATE_PREFIX+_3a8];
}else{
var _3ad=[wFORMS.behaviors["switch"].CSS_OFFSTATE_PREFIX+_3a8];
}
this.target.getElementsByClassName(_3ad).forEach(function(elem){
if(b&&b.isInDuplicateGroup(elem)&&!(b.isDuplicate(_3ab.target)||b.isInDuplicateGroup(_3ab.target))){
return;
}
res.push(base2.DOM.bind(elem));
});
return res;
};
wFORMS.behaviors["switch"].instance.prototype.getTriggersByTarget=function(_3af){
var res=new Array();
var _3b1=this;
var _3b2=wFORMS.behaviors["switch"].getSwitchNamesFromTarget(_3af);
var b=wFORMS.behaviors.repeat;
base2.forEach(_3b2,function(name){
_3b1.target.getElementsByClassName([wFORMS.behaviors["switch"].CSS_PREFIX+name]).forEach(function(elem){
if(b&&b.isInDuplicateGroup(elem)&&!(b.isDuplicate(_3af)||b.isInDuplicateGroup(_3af))){
return;
}
res.push(base2.DOM.bind(elem));
});
});
return this.getTriggersByElements(res,_3b2);
};
wFORMS.behaviors["switch"].instance.prototype.setupTargets=function(elem){
this.run(null,elem);
};
wFORMS.behaviors["switch"].isSwitchedOff=function(elem){
return (elem.className.match(new RegExp(wFORMS.behaviors["switch"].CSS_OFFSTATE_PREFIX+"[^ ]*"))?true:false)&&(elem.className.match(new RegExp(wFORMS.behaviors["switch"].CSS_ONSTATE_PREFIX+"[^ ]*"))?false:true);
};
wFORMS.behaviors["switch"].instance.prototype.run=function(e,_3b9){
if(!_3b9.hasClass){
base2.DOM.bind(_3b9);
}
if(_3b9.hasClass(this.behavior.CSS_ONSTATE_FLAG)){
_3b9.removeClass(this.behavior.CSS_ONSTATE_FLAG);
_3b9.addClass(this.behavior.CSS_OFFSTATE_FLAG);
if(e){
e.preventDefault();
}
}else{
if(_3b9.hasClass(this.behavior.CSS_OFFSTATE_FLAG)){
_3b9.removeClass(this.behavior.CSS_OFFSTATE_FLAG);
_3b9.addClass(this.behavior.CSS_ONSTATE_FLAG);
if(e){
e.preventDefault();
}
}
}
var _3ba=this.getTriggersByElements(new Array(_3b9));
var _3bb=this;
base2.forEach(_3ba.OFF,function(_3bc){
var _3bd=_3bb.getTargetsBySwitchName(_3bc,"ON");
base2.forEach(_3bd,function(elem){
var _3bf=_3bb.getTriggersByTarget(elem);
if(_3bf.ON.length==0){
elem.addClass(wFORMS.behaviors["switch"].CSS_OFFSTATE_PREFIX+_3bc);
elem.removeClass(wFORMS.behaviors["switch"].CSS_ONSTATE_PREFIX+_3bc);
_3bb.behavior.onSwitchOff(elem);
}
});
});
base2.forEach(_3ba.ON,function(_3c0){
var _3c1=_3bb.getTargetsBySwitchName(_3c0,"OFF");
base2.forEach(_3c1,function(elem){
elem.removeClass(wFORMS.behaviors["switch"].CSS_OFFSTATE_PREFIX+_3c0);
elem.addClass(wFORMS.behaviors["switch"].CSS_ONSTATE_PREFIX+_3c0);
_3bb.behavior.onSwitchOn(elem);
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
wFORMS.behaviors.validation={rules:{isRequired:{selector:".required",check:"validateRequired"},isAlpha:{selector:".validate-alpha",check:"validateAlpha"},isAlphanum:{selector:".validate-alphanum",check:"validateAlphanum"},isDate:{selector:".validate-date",check:"validateDate"},isTime:{selector:".validate-time",check:"validateTime"},isEmail:{selector:".validate-email",check:"validateEmail"},isInteger:{selector:".validate-integer",check:"validateInteger"},isFloat:{selector:".validate-float",check:"validateFloat"},isCustom:{selector:".validate-custom",check:"validateCustom"}},styling:{fieldError:"errFld",errorMessage:"errMsg"},messages:{isRequired:"This field is required. ",isAlpha:"The text must use alphabetic characters only (a-z, A-Z). Numbers are not allowed.",isEmail:"This does not appear to be a valid email address.",isInteger:"Please enter an integer.",isFloat:"Please enter a number (ex. 1.9).",isAlphanum:"Please use alpha-numeric characters only [a-z 0-9].",isDate:"This does not appear to be a valid date.",isCustom:"Please enter a valid value.",notification:"%% error(s) detected. Your form has not been submitted yet.\nPlease check the information you provided."},instance:function(f){
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
}
}else{
var v=new wFORMS.behaviors.validation.instance(f);
if(!f.addEventListener){
base2.DOM.bind(f);
}
f.addEventListener("submit",function(e){
return v.run(e,this);
},false);
}
return v;
};
wFORMS.behaviors.validation.instance.prototype.run=function(e,_3ce){
var _3cf=0;
this.elementsInError={};
for(var _3d0 in this.behavior.rules){
var rule=this.behavior.rules[_3d0];
var _3d2=this;
if(!_3ce.matchAll){
base2.DOM.bind(_3ce);
}
_3ce.matchAll(rule.selector).forEach(function(_3d3){
if(_3d2.isSwitchedOff(_3d3)){
return;
}
var _3d4=wFORMS.helpers.getFieldValue(_3d3);
if(rule.check.call){
var _3d5=rule.check.call(_3d2,_3d3,_3d4);
}else{
var _3d5=_3d2[rule.check].call(_3d2,_3d3,_3d4);
}
if(!_3d5){
if(!_3d3.id){
_3d3.id=wFORMS.helpers.randomId();
}
_3d2.elementsInError[_3d3.id]={id:_3d3.id,rule:_3d0};
_3d2.removeErrorMessage(_3d3);
if(rule.fail){
rule.fail.call(_3d2,_3d3,_3d0);
}else{
_3d2.fail.call(_3d2,_3d3,_3d0);
}
_3cf++;
}else{
if(!_3d2.elementsInError[_3d3.id]){
_3d2.removeErrorMessage(_3d3);
}
if(rule.pass){
rule.pass.call(_3d2,_3d3);
}else{
_3d2.pass.call(_3d2,_3d3);
}
}
});
}
if(_3cf>0){
e.preventDefault?e.preventDefault():e.returnValue=false;
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
wFORMS.behaviors.validation.instance.prototype.fail=function(_3d6,_3d7){
_3d6.addClass(this.behavior.styling.fieldError);
this.addErrorMessage(_3d6,this.behavior.messages[_3d7]);
},wFORMS.behaviors.validation.instance.prototype.pass=function(_3d8){
};
wFORMS.behaviors.validation.instance.prototype.addErrorMessage=function(_3d9,_3da){
if(!_3d9.id){
_3d9.id=wFORMS.helpers.randomId();
}
var _3db=document.createTextNode(" "+_3da);
var p=document.getElementById(_3d9.id+"-E");
if(!p){
p=document.createElement("div");
p.setAttribute("id",_3d9.id+"-E");
p=_3d9.parentNode.insertBefore(p,_3d9.nextSibling);
}
p.appendChild(_3db);
base2.DOM.bind(p);
p.addClass(this.behavior.styling.errorMessage);
};
wFORMS.behaviors.validation.instance.prototype.removeErrorMessage=function(_3dd){
if(!_3dd.hasClass){
base2.DOM.bind(_3dd);
}
if(_3dd.hasClass(this.behavior.styling.fieldError)){
_3dd.removeClass(this.behavior.styling.fieldError);
var _3de=document.getElementById(_3dd.id+"-E");
if(_3de){
_3de.parentNode.removeChild(_3de);
}
}
};
wFORMS.behaviors.validation.instance.prototype.isSwitchedOff=function(_3df){
var sb=wFORMS.getBehaviorInstance(this.target,"switch");
if(sb){
var _3e1=_3df;
while(_3e1&&_3e1.tagName!="BODY"){
if(_3e1.className&&_3e1.className.indexOf(sb.behavior.CSS_OFFSTATE_PREFIX)!=-1&&_3e1.className.indexOf(sb.behavior.CSS_ONSTATE_PREFIX)==-1){
return true;
}
_3e1=_3e1.parentNode;
}
}
return false;
};
wFORMS.behaviors.validation.instance.prototype.isEmpty=function(s){
var _3e3=/^\s+$/;
return ((s==null)||(s.length==0)||_3e3.test(s));
};
wFORMS.behaviors.validation.instance.prototype.validateRequired=function(_3e4,_3e5){
switch(_3e4.tagName){
case "INPUT":
var _3e6=_3e4.getAttribute("type");
if(!_3e6){
_3e6="text";
}
switch(_3e6.toLowerCase()){
case "checkbox":
case "radio":
return _3e4.checked;
break;
default:
return !this.isEmpty(_3e5);
}
break;
case "SELECT":
return !this.isEmpty(_3e5);
break;
case "TEXTAREA":
return !this.isEmpty(_3e5);
break;
default:
return this.validateOneRequired(_3e4);
break;
}
return false;
};
wFORMS.behaviors.validation.instance.prototype.validateOneRequired=function(_3e7){
if(_3e7.nodeType!=1){
return false;
}
if(this.isSwitchedOff(_3e7)){
return false;
}
switch(_3e7.tagName){
case "INPUT":
var _3e8=_3e7.getAttribute("type");
if(!_3e8){
_3e8="text";
}
switch(_3e8.toLowerCase()){
case "checkbox":
case "radio":
return _3e7.checked;
break;
default:
return !this.isEmpty(wFORMS.helpers.getFieldValue(_3e7));
}
break;
case "SELECT":
return !this.isEmpty(wFORMS.helpers.getFieldValue(_3e7));
break;
case "TEXTAREA":
return !this.isEmpty(wFORMS.helpers.getFieldValue(_3e7));
break;
default:
for(var i=0;i<_3e7.childNodes.length;i++){
if(this.validateOneRequired(_3e7.childNodes[i])){
return true;
}
}
break;
}
return false;
};
wFORMS.behaviors.validation.instance.prototype.validateAlpha=function(_3ea,_3eb){
var _3ec=/^[a-zA-Z\s]+$/;
return this.isEmpty(_3eb)||_3ec.test(_3eb);
};
wFORMS.behaviors.validation.instance.prototype.validateAlphanum=function(_3ed,_3ee){
var _3ef=/^[\w\s]+$/;
return this.isEmpty(_3ee)||_3ef.test(_3ee);
};
wFORMS.behaviors.validation.instance.prototype.validateDate=function(_3f0,_3f1){
var _3f2=new Date(_3f1);
return this.isEmpty(_3f1)||!isNaN(_3f2);
};
wFORMS.behaviors.validation.instance.prototype.validateTime=function(_3f3,_3f4){
return true;
};
wFORMS.behaviors.validation.instance.prototype.validateEmail=function(_3f5,_3f6){
var _3f7=/\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/;
return this.isEmpty(_3f6)||_3f7.test(_3f6);
};
wFORMS.behaviors.validation.instance.prototype.validateInteger=function(_3f8,_3f9){
var _3fa=/^[+]?\d+$/;
return this.isEmpty(_3f9)||_3fa.test(_3f9);
};
wFORMS.behaviors.validation.instance.prototype.validateFloat=function(_3fb,_3fc){
return this.isEmpty(_3fc)||!isNaN(parseFloat(_3fc));
};
wFORMS.behaviors.validation.instance.prototype.validateCustom=function(_3fd,_3fe){
var _3ff=new RegExp("/(.*)/([gi]*)");
var _400=_3fd.className.match(_3ff);
if(_400&&_400[0]){
var _401=new RegExp(_400[1],_400[2]);
if(!_3fe.match(_401)){
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
f.matchAll(wFORMS.behaviors.calculation.CALCULATION_SELECTOR).forEach(function(elem){
var _406=elem.className.substr(elem.className.indexOf("formula=")+8).split(" ")[0];
var _407=_406.split(/[^a-zA-Z]+/g);
b.varFields=[];
for(var i=0;i<_407.length;i++){
if(_407[i]!=""){
f.matchAll("*[class*=\""+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+_407[i]+"\"]").forEach(function(_409){
var _40a=((" "+_409.className+" ").indexOf(" "+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+_407[i]+" ")!=-1);
if(!_40a){
return;
}
switch(_409.tagName+":"+_409.getAttribute("type")){
case "INPUT:":
case "INPUT:null":
case "INPUT:text":
case "INPUT:hidden":
case "INPUT:password":
case "TEXTAREA:null":
if(!_409._wforms_calc_handled){
_409.addEventListener("blur",function(e){
return b.run(e,this);
},false);
_409._wforms_calc_handled=true;
}
break;
case "INPUT:radio":
case "INPUT:checkbox":
if(!_409._wforms_calc_handled){
_409.addEventListener("click",function(e){
return b.run(e,this);
},false);
_409._wforms_calc_handled=true;
}
break;
case "SELECT:null":
if(!_409._wforms_calc_handled){
_409.addEventListener("change",function(e){
return b.run(e,this);
},false);
_409._wforms_calc_handled=true;
}
break;
default:
return;
break;
}
b.varFields.push({name:_407[i],field:_409});
});
}
}
var calc={field:elem,formula:_406,variables:b.varFields};
b.calculations.push(calc);
b.compute(calc);
});
b.onApply();
return b;
};
wFORMS.behaviors.calculation.instance.prototype.onApply=function(){
};
wFORMS.behaviors.calculation.instance.prototype.run=function(_40f,_410){
for(var i=0;i<this.calculations.length;i++){
var calc=this.calculations[i];
for(var j=0;j<calc.variables.length;j++){
if(_410==calc.variables[j].field){
this.compute(calc);
}
}
}
};
wFORMS.behaviors.calculation.instance.prototype.compute=function(_414){
var f=this.target;
var _416=_414.formula;
for(var i=0;i<_414.variables.length;i++){
var v=_414.variables[i];
var _419=0;
var _41a=this;
f.matchAll("*[class*=\""+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+v.name+"\"]").forEach(function(f){
var _41c=((" "+f.className+" ").indexOf(" "+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+v.name+" ")!=-1);
if(!_41c){
return;
}
if(_41a.hasValueInClassName(f)){
var _41d=_41a.getValueFromClassName(f);
}else{
var _41d=wFORMS.helpers.getFieldValue(f);
}
if(!_41d){
_41d=0;
}
if(_41d.constructor.toString().indexOf("Array")!==-1){
for(var j=0;j<_41d.length;j++){
_419+=parseFloat(_41d[j]);
}
}else{
_419+=parseFloat(_41d);
}
});
var rgx=new RegExp("[^a-z]+("+v.name+")[^a-z]+","gi");
var m=rgx.exec(" "+_416+" ");
if(m){
if(m[1]){
_416=_416.replace(m[1],_419);
}else{
_416=_416.replace(m[0],_419);
}
}
}
try{
var _421=eval(_416);
if(_421=="Infinity"||_421=="NaN"||isNaN(_421)){
_421="error";
}
}
catch(x){
_421="error";
}
var _422=wFORMS.getBehaviorInstance(this.target,"validation");
if(_422){
if(!wFORMS.behaviors.validation.messages["calculation"]){
wFORMS.behaviors.validation.messages["calculation"]=this.behavior.CALCULATION_ERROR_MESSAGE;
}
_422.removeErrorMessage(_414.field);
if(_421=="error"){
_422.fail(_414.field,"calculation");
}
}
_414.field.value=_421;
if(_414.field.className&&(_414.field.className.indexOf(this.behavior.VARIABLE_SELECTOR_PREFIX)!=-1)){
this.run(null,_414.field);
}
};
wFORMS.behaviors.calculation.instance.prototype.hasValueInClassName=function(_423){
switch(_423.tagName){
case "SELECT":
for(var i=0;i<_423.options.length;i++){
if(_423.options[i].className&&_423.options[i].className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)!=-1){
return true;
}
}
return false;
break;
default:
if(!_423.className||(" "+_423.className).indexOf(" "+this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)==-1){
return false;
}
break;
}
return true;
};
wFORMS.behaviors.calculation.instance.prototype.getValueFromClassName=function(_425){
switch(_425.tagName){
case "INPUT":
if(!_425.className||_425.className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)==-1){
return null;
}
var _426=_425.className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(" ")[0];
if(_425.type=="checkbox"){
return _425.checked?_426:null;
}
if(_425.type=="radio"){
return _425.checked?_426:null;
}
return _426;
break;
case "SELECT":
if(_425.selectedIndex==-1){
return null;
}
if(_425.getAttribute("multiple")){
var v=[];
for(var i=0;i<_425.options.length;i++){
if(_425.options[i].selected){
if(_425.options[i].className&&_425.options[i].className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)!=-1){
var _426=_425.options[i].className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(" ")[0];
v.push(_426);
}
}
}
if(v.length==0){
return null;
}
return v;
}
if(_425.options[_425.selectedIndex].className&&_425.options[_425.selectedIndex].className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)!=-1){
var _426=_425.options[_425.selectedIndex].className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(" ")[0];
return _426;
}
break;
case "TEXTAREA":
if(!_425.className||_425.className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)==-1){
return null;
}
var _426=_425.className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(" ")[0];
return _426;
break;
default:
return null;
break;
}
return null;
};

