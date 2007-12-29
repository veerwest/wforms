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
var _1=(new Date()).getTime();
_1=_1.toString().substr(6);
for(var i=0;i<6;i++){
_1+=String.fromCharCode(48+Math.floor((Math.random()*10)));
}
return "id_"+_1;
};
wFORMS.helpers.getFieldValue=function(_3){
switch(_3.tagName){
case "INPUT":
if(_3.type=="checkbox"){
return _3.checked?_3.value:null;
}
if(_3.type=="radio"){
return _3.checked?_3.value:null;
}
return _3.value;
break;
case "SELECT":
if(_3.selectedIndex==-1){
return null;
}
if(_3.getAttribute("multiple")){
var v=[];
for(var i=0;i<_3.options.length;i++){
if(_3.options[i].selected){
v.push(_3.options[i].value);
}
}
return v;
}
return _3.options[_3.selectedIndex].value;
break;
case "TEXTAREA":
return _3.value;
break;
default:
return null;
break;
}
};
wFORMS.helpers.getComputedStyle=function(_6,_7){
if(document.defaultView&&document.defaultView.getComputedStyle){
return document.defaultView.getComputedStyle(_6,"")[_7];
}else{
if(_6.currentStyle){
return _6.currentStyle[_7];
}
}
return false;
};
wFORMS.helpers.getLeft=function(_8){
var _9=0;
while(_8.offsetParent){
if(wFORMS.helpers.getComputedStyle(_8,"position")=="relative"){
return _9;
}
if(_9>0&&wFORMS.helpers.getComputedStyle(_8,"position")=="absolute"){
return _9;
}
_9+=_8.offsetLeft;
_8=_8.offsetParent;
}
return _9;
};
wFORMS.helpers.getTop=function(_a){
var _b=0;
while(_a.offsetParent){
if(wFORMS.helpers.getComputedStyle(_a,"position")=="relative"){
return _b;
}
if(_b>0&&wFORMS.helpers.getComputedStyle(_a,"position")=="absolute"){
return _b;
}
_b+=_a.offsetTop;
_a=_a.offsetParent;
}
return _b;
};
wFORMS.helpers.activateStylesheet=function(_c){
if(document.getElementsByTagName){
var ss=document.getElementsByTagName("link");
}else{
if(document.styleSheets){
var ss=document.styleSheets;
}
}
for(var i=0;ss[i];i++){
if(ss[i].href.indexOf(_c)!=-1){
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
for(var _12 in wFORMS.behaviors){
if(_12=="switch"){
continue;
}
var b=wFORMS.behaviors[_12].applyTo(f);
if(b&&b.constructor.toString().indexOf("Array")==-1){
b=[b];
}
for(var i=0;b&&i<b.length;i++){
if(!wFORMS.instances[_12]){
wFORMS.instances[_12]=[b[i]];
}else{
wFORMS.removeBehavior(f,_12);
wFORMS.instances[_12].push(b[i]);
}
}
}
};
wFORMS.removeBehavior=function(f,_15){
return null;
if(!wFORMS.instances[_15]){
return null;
}
for(var i=0;i<wFORMS.instances[_15].length;i++){
if(wFORMS.instances[_15][i].target==f){
wFORMS.instances[_15][i]=null;
}
}
return null;
};
wFORMS.getBehaviorInstance=function(f,_18){
if(!wFORMS.instances[_18]){
return null;
}
for(var i=0;i<wFORMS.instances[_18].length;i++){
if(wFORMS.instances[_18][i].target==f){
return wFORMS.instances[_18][i];
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
f.matchAll(wFORMS.behaviors.hint.HINT_SELECTOR).forEach(function(_1d){
var e=b.getElementByHintId(_1d.id);
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
e.addEventListener("focus",function(_1f){
b.run(_1f,e);
},false);
e.addEventListener("blur",function(_20){
b.run(_20,e);
},false);
}
}else{
e.addEventListener("mouseover",function(_21){
b.run(_21,e);
},false);
e.addEventListener("mouseout",function(_22){
b.run(_22,e);
},false);
}
}
});
return b;
};
wFORMS.behaviors.hint.instance.prototype.run=function(_23,_24){
var _25=this.getHintElement(_24);
if(!_25){
return;
}
if(_23.type=="focus"||_23.type=="mouseover"){
_25.removeClass(wFORMS.behaviors.hint.CSS_INACTIVE);
_25.addClass(wFORMS.behaviors.hint.CSS_ACTIVE);
this.setup(_25,_24);
}else{
_25.addClass(wFORMS.behaviors.hint.CSS_INACTIVE);
_25.removeClass(wFORMS.behaviors.hint.CSS_ACTIVE);
}
};
wFORMS.behaviors.hint.instance.prototype.getElementByHintId=function(_26){
var id=_26.substr(0,_26.length-wFORMS.behaviors.hint.HINT_SUFFIX.length);
var e=document.getElementById(id);
return e;
};
wFORMS.behaviors.hint.instance.prototype.getHintElement=function(_29){
var e=document.getElementById(_29.id+this.behavior.HINT_SUFFIX);
return e&&e!=""?e:null;
};
wFORMS.behaviors.hint.instance.prototype.setup=function(_2b,_2c){
_2b.style.left=((_2c.tagName=="SELECT"?+_2c.offsetWidth:0)+wFORMS.helpers.getLeft(_2c))+"px";
_2b.style.top=(wFORMS.helpers.getTop(_2c)+_2c.offsetHeight)+"px";
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
var _31=wFORMS.behaviors.paging;
var _32=(wFORMS.behaviors.validation&&wFORMS.behaviors.paging.runValidationOnPageNext);
var _33=false;
f.matchAll(wFORMS.behaviors.paging.SELECTOR).forEach(function(_34){
_33=true;
var ph=b.getOrCreatePlaceHolder(_34);
var _36=wFORMS.behaviors.paging.getPageIndex(_34);
if(_36==1){
var _37=base2.DOM.bind(ph.appendChild(_31._createNextPageButton(_36)));
if(_32){
_37.addEventListener("click",function(_38){
var v=wFORMS.getBehaviorInstance(b.target,"validation");
if(v.run(_38,_34)){
b.run(_38,_37);
}
},false);
}else{
_37.addEventListener("click",function(_3a){
b.run(_3a,_37);
},false);
}
wFORMS.behaviors.paging.showPage(_34);
}else{
var _37=base2.DOM.bind(_31._createPreviousPageButton(_36));
ph.insertBefore(_37,ph.firstChild);
_37.addEventListener("click",function(_3b){
b.run(_3b,_37);
},false);
if(!wFORMS.behaviors.paging.isLastPageIndex(_36,true)){
var _3c=base2.DOM.bind(ph.appendChild(_31._createNextPageButton(_36)));
if(_32){
_3c.addEventListener("click",function(_3d){
var v=wFORMS.getBehaviorInstance(b.target,"validation");
if(v.run(_3d,_34)){
b.run(_3d,_3c);
}
},false);
}else{
_3c.addEventListener("click",function(_3f){
b.run(_3f,_3c);
},false);
}
}
}
});
if(_33){
p=b.findNextPage(0);
b.currentPageIndex=0;
b.activatePage(wFORMS.behaviors.paging.getPageIndex(p));
}
return b;
};
wFORMS.behaviors.paging.getPageIndex=function(_40){
if(_40&&_40.id){
var _41=_40.id.replace(new RegExp(wFORMS.behaviors.paging.ID_PAGE_PREFIX+"(\\d+)"),"$1");
_41=parseInt(_41);
return !isNaN(_41)?_41:false;
}
return false;
};
wFORMS.behaviors.paging._createNextPageButton=function(_42){
var _43=wFORMS.behaviors.paging.createNextPageButton();
_43.setAttribute(wFORMS.behaviors.paging.ATTR_INDEX,_42+1);
_43.id=wFORMS.behaviors.paging.ID_BUTTON_NEXT_PREFIX+_42;
return _43;
};
wFORMS.behaviors.paging.createNextPageButton=function(){
var _44=document.createElement("input");
_44.setAttribute("value",wFORMS.behaviors.paging.MESSAGES.CAPTION_NEXT);
_44.setAttribute("type","button");
_44.className=wFORMS.behaviors.paging.CSS_BUTTON_NEXT;
return _44;
};
wFORMS.behaviors.paging._createPreviousPageButton=function(_45){
var _46=wFORMS.behaviors.paging.createPreviousPageButton();
_46.setAttribute(wFORMS.behaviors.paging.ATTR_INDEX,_45-1);
_46.id=wFORMS.behaviors.paging.ID_BUTTON_PREVIOUS_PREFIX+_45;
return _46;
};
wFORMS.behaviors.paging.createPreviousPageButton=function(){
var _47=document.createElement("input");
_47.setAttribute("value",wFORMS.behaviors.paging.MESSAGES.CAPTION_PREVIOUS);
_47.setAttribute("type","button");
_47.className=wFORMS.behaviors.paging.CSS_BUTTON_PREVIOUS;
return _47;
};
wFORMS.behaviors.paging.instance.prototype.getOrCreatePlaceHolder=function(_48){
var id=_48.id+wFORMS.behaviors.paging.ID_PLACEHOLDER_SUFFIX;
var _4a=document.getElementById(id);
if(!_4a){
_4a=_48.appendChild(document.createElement("div"));
_4a.id=id;
_4a.className=wFORMS.behaviors.paging.CSS_BUTTON_PLACEHOLDER;
}
return _4a;
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
wFORMS.behaviors.paging.instance.prototype.activatePage=function(_4d){
if(_4d==this.currentPageIndex){
return false;
}
_4d=parseInt(_4d);
if(_4d>this.currentPageIndex){
var p=this.findNextPage(this.currentPageIndex);
}else{
var p=this.findPreviousPage(this.currentPageIndex);
}
if(p){
var _4d=wFORMS.behaviors.paging.getPageIndex(p);
var b=wFORMS.behaviors.paging;
var _50=this;
setTimeout(function(){
_50.setupManagedControls(_4d);
b.hidePage(b.getPageByIndex(_50.currentPageIndex));
b.showPage(p);
_50.currentPageIndex=_4d;
},1);
}
};
wFORMS.behaviors.paging.instance.prototype.setupManagedControls=function(_51){
if(!_51){
_51=this.currentPageIndex;
}
var b=wFORMS.behaviors.paging;
if(b.isFirstPageIndex(_51)){
if(ctrl=b.getPreviousButton(_51)){
ctrl.style.display="none";
}
}else{
if(ctrl=b.getPreviousButton(_51)){
ctrl.style.display="inline";
}
}
if(b.isLastPageIndex(_51)){
if(ctrl=b.getNextButton(_51)){
ctrl.style.display="none";
}
this.showSubmitButtons();
}else{
if(ctrl=b.getNextButton(_51)){
ctrl.style.display="inline";
}
this.hideSubmitButtons();
}
};
wFORMS.behaviors.paging.instance.prototype.showSubmitButtons=function(){
this.target.matchAll("input[type~=\"submit\"]").forEach(function(_53){
_53.removeClass(wFORMS.behaviors.paging.CSS_SUBMIT_HIDDEN);
});
};
wFORMS.behaviors.paging.instance.prototype.hideSubmitButtons=function(){
this.target.matchAll("input[type~=\"submit\"]").forEach(function(_54){
_54.addClass(wFORMS.behaviors.paging.CSS_SUBMIT_HIDDEN);
});
};
wFORMS.behaviors.paging.getPageByIndex=function(_55){
var _56=document.getElementById(wFORMS.behaviors.paging.ID_PAGE_PREFIX+_55);
return _56?base2.DOM.bind(_56):false;
};
wFORMS.behaviors.paging.getNextButton=function(_57){
return document.getElementById(wFORMS.behaviors.paging.ID_BUTTON_NEXT_PREFIX+_57);
};
wFORMS.behaviors.paging.getPreviousButton=function(_58){
return document.getElementById(wFORMS.behaviors.paging.ID_BUTTON_PREVIOUS_PREFIX+_58);
};
wFORMS.behaviors.paging.isLastPageIndex=function(_59,_5a){
_59=parseInt(_59)+1;
var b=wFORMS.behaviors.paging;
var p=b.getPageByIndex(_59);
if((_b=wFORMS.behaviors["switch"])&&!_5a){
while(p&&_b.isSwitchedOff(p)){
_59++;
p=b.getPageByIndex(_59);
}
}
return p?false:true;
};
wFORMS.behaviors.paging.isFirstPageIndex=function(_5d,_5e){
_5d=parseInt(_5d)-1;
var b=wFORMS.behaviors.paging;
var p=b.getPageByIndex(_5d);
if((_b=wFORMS.behaviors["switch"])&&!_5e){
while(p&&_b.isSwitchedOff(p)){
_5d--;
p=b.getPageByIndex(_5d);
}
}
return p?false:true;
};
wFORMS.behaviors.paging.instance.prototype.findNextPage=function(_61){
_61=parseInt(_61)+1;
var b=wFORMS.behaviors.paging;
var p=b.getPageByIndex(_61);
if(_b=wFORMS.behaviors["switch"]){
while(p&&_b.isSwitchedOff(p)){
_61++;
p=b.getPageByIndex(_61);
}
}
return p?p:true;
};
wFORMS.behaviors.paging.instance.prototype.findPreviousPage=function(_64){
_64=parseInt(_64)-1;
var b=wFORMS.behaviors.paging;
var p=b.getPageByIndex(_64);
if(_b=wFORMS.behaviors["switch"]){
while(p&&_b.isSwitchedOff(p)){
_64--;
p=b.getPageByIndex(_64);
}
}
return p?p:false;
};
wFORMS.behaviors.paging.instance.prototype.run=function(e,_68){
this.activatePage(_68.getAttribute(wFORMS.behaviors.paging.ATTR_INDEX));
};
if(typeof (wFORMS)=="undefined"){
throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
wFORMS.behaviors.repeat={SELECTOR_REPEAT:"*[class~=\"repeat\"]",SELECTOR_REMOVEABLE:"*[class~=\"removeable\"]",ID_SUFFIX_DUPLICATE_LINK:"-wfDL",ID_SUFFIX_COUNTER:"-RC",CSS_DUPLICATE_LINK:"duplicateLink",CSS_DUPLICATE_SPAN:"duplicateSpan",CSS_DELETE_LINK:"removeLink",CSS_DELETE_SPAN:"removeSpan",CSS_REMOVEABLE:"removeable",CSS_REPEATABLE:"repeat",ATTR_DUPLICATE:"wfr__dup",ATTR_DUPLICATE_ELEM:"wfr__dup_elem",ATTR_HANDLED:"wfr_handled",ATTR_MASTER_SECTION:"wfr__master_sec",ATTR_LINK_SECTION_ID:"wfr_sec_id",MESSAGES:{ADD_CAPTION:"Add another response",ADD_TITLE:"Will duplicate this question or section.",REMOVE_CAPTION:"Remove",REMOVE_TITLE:"Will remove this question or section"},UPDATEABLE_ATTR_ARRAY:["id","name","for"],preserveRadioName:false,CSS_PRESERVE_RADIO_NAME:"preserveRadioName",onRepeat:function(_69){
},onRemove:function(){
},allowRepeat:function(_6a,b){
return true;
},instance:function(f){
this.behavior=wFORMS.behaviors.repeat;
this.target=f;
}};
wFORMS.behaviors.repeat.applyTo=function(f){
var _6e=this;
var b=new Array();
f.matchAll(this.SELECTOR_REPEAT).forEach(function(_70){
if(_6e.isHandled(_70)){
return;
}
if(!_70.id){
_70.id=wFORMS.helpers.randomId();
}
var _b=new _6e.instance(_70);
var e=_b.getOrCreateRepeatLink(_70);
e.addEventListener("click",function(_73){
_b.run(_73,e);
},false);
b.push(_b);
_6e.handleElement(_70);
});
var _74=function(_75){
e=_6e.createRemoveLink(_75.id);
if(_75.tagName=="TR"){
var tds=_75.getElementsByTagName("TD");
var _77=tds[tds.length-1];
_77.appendChild(e);
}else{
_75.appendChild(e);
}
};
if(f.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE)){
_74(f);
}
f.matchAll(this.SELECTOR_REMOVEABLE).forEach(function(e){
_74(e);
});
return b;
};
wFORMS.behaviors.repeat.instance.prototype.getOrCreateRepeatLink=function(_79){
var id=_79.id+wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK;
var e=document.getElementById(id);
if(!e||e==""){
e=this.createRepeatLink(id);
var _7c=document.createElement("span");
_7c.className=wFORMS.behaviors.repeat.CSS_DUPLICATE_SPAN;
e=_7c.appendChild(e);
if(_79.tagName.toUpperCase()=="TR"){
var _7d=_79.matchSingle("td:nth-last-child(0n+1)");
if(_7d==""){
_7d=_79.appendChild(document.createElement("TD"));
}
_7d.appendChild(_7c);
}else{
_79.appendChild(_7c);
}
}
return base2.DOM.bind(e);
};
wFORMS.behaviors.repeat.instance.prototype.createRepeatLink=function(id){
var _7f=document.createElement("a");
_7f.id=id;
_7f.setAttribute("href","#");
_7f.className=wFORMS.behaviors.repeat.CSS_DUPLICATE_LINK;
_7f.setAttribute("title",wFORMS.behaviors.repeat.MESSAGES.ADD_TITLE);
_7f.appendChild(document.createElement("span").appendChild(document.createTextNode(wFORMS.behaviors.repeat.MESSAGES.ADD_CAPTION)));
return _7f;
};
wFORMS.behaviors.repeat.createRemoveLink=function(id){
var _81=document.createElement("a");
_81.id=id+wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK;
_81.setAttribute("href","#");
_81.className=wFORMS.behaviors.repeat.CSS_DELETE_LINK;
_81.setAttribute("title",wFORMS.behaviors.repeat.MESSAGES.REMOVE_TITLE);
_81.setAttribute(wFORMS.behaviors.repeat.ATTR_LINK_SECTION_ID,id);
var _82=document.createElement("span");
_82.appendChild(document.createTextNode(wFORMS.behaviors.repeat.MESSAGES.REMOVE_CAPTION));
_81.appendChild(_82);
_81.onclick=function(_83){
wFORMS.behaviors.repeat.onRemoveLinkClick(_83,_81);
};
var _82=document.createElement("span");
_82.className=wFORMS.behaviors.repeat.CSS_DELETE_SPAN;
_82.appendChild(_81);
return _82;
};
wFORMS.behaviors.repeat.instance.prototype.getTargetByRepeatLink=function(_84){
return this.target.matchSingle("#"+_84.id.substring(0,_84.id.length-wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK.length));
};
wFORMS.behaviors.repeat.instance.prototype.duplicateSection=function(_85){
if(!this.behavior.allowRepeat(_85,this)){
return false;
}
this.updateMasterSection(_85);
var _86=base2.DOM.bind(_85.cloneNode(true));
var _87=_85;
while(_87&&(_87.nodeType==3||_87.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE)||_87.hasClass(wFORMS.behaviors.repeat.CSS_REPEATABLE))){
_87=_87.nextSibling;
if(_87&&_87.nodeType==1&&!_87.hasClass){
_87=base2.DOM.bind(_87);
}
}
_85.parentNode.insertBefore(_86,_87);
this.updateDuplicatedSection(_86);
wFORMS.applyBehaviors(_86);
wFORMS.behaviors.repeat.onRepeat(_86);
};
wFORMS.behaviors.repeat.removeSection=function(id){
var _89=document.getElementById(id);
if(_89!=""){
_89.parentNode.removeChild(_89);
wFORMS.behaviors.repeat.onRemove();
}
};
wFORMS.behaviors.repeat.onRemoveLinkClick=function(_8a,_8b){
this.removeSection(_8b.getAttribute(wFORMS.behaviors.repeat.ATTR_LINK_SECTION_ID));
if(_8a){
_8a.preventDefault();
}
};
wFORMS.behaviors.repeat.instance.prototype.updateMasterSection=function(_8c){
if(_8c.doItOnce==true){
return true;
}else{
_8c.doItOnce=true;
}
var _8d=this.createSuffix(_8c);
_8c.id=this.clearSuffix(_8c.id)+_8d;
this.updateMasterElements(_8c,_8d);
};
wFORMS.behaviors.repeat.instance.prototype.updateMasterElements=function(_8e,_8f){
if(!_8e||_8e.nodeType!=1){
return;
}
var cn=_8e.childNodes;
for(var i=0;i<cn.length;i++){
var n=cn[i];
if(n.nodeType!=1){
continue;
}
if(!n.hasClass){
base2.DOM.bind(n);
}
if(n.hasClass(wFORMS.behaviors.repeat.CSS_REPEATABLE)){
_8f+="[0]";
}
if(!n.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE)){
for(var j=0;j<wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY.length;j++){
var _94=wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY[j];
var _95=this.clearSuffix(n.getAttribute(_94));
if(!_95){
continue;
}
if(wFORMS.behaviors.hint&&wFORMS.behaviors.hint.isHintId(n.id)){
n.setAttribute(_94,_95.replace(new RegExp("(.*)("+wFORMS.behaviors.hint.HINT_SUFFIX+")$"),"$1"+_8f+"$2"));
}else{
if(n.id.indexOf(wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK)!=-1){
n.setAttribute(_94,_95.replace(new RegExp("(.*)("+wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK+")$"),"$1"+_8f+"$2"));
}else{
n.setAttribute(_94,_95+_8f);
}
}
}
this.updateMasterElements(n,_8f);
}
}
};
wFORMS.behaviors.repeat.instance.prototype.updateDuplicatedSection=function(_96){
var _97=this;
var _98=this.getNextDuplicateIndex(this.target);
var _99=this.createSuffix(_96,_98);
_96.setAttribute(wFORMS.behaviors.repeat.ATTR_MASTER_SECTION,_96.id);
_96.id=this.clearSuffix(_96.id)+_99;
_96.className=_96.className.replace(wFORMS.behaviors.repeat.CSS_REPEATABLE,wFORMS.behaviors.repeat.CSS_REMOVEABLE);
if(_96.hasClass(wFORMS.behaviors.repeat.CSS_PRESERVE_RADIO_NAME)){
var _9a=true;
}else{
var _9a=wFORMS.behaviors.repeat.preserveRadioName;
}
this.updateSectionChildNodes(_96.matchAll("> *"),_99,_9a);
};
wFORMS.behaviors.repeat.instance.prototype.updateSectionChildNodes=function(_9b,_9c,_9d){
var _9e=this;
_9b.forEach(function(e){
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
var _a0=e.tagName.toUpperCase();
if(_a0=="INPUT"||_a0=="TEXTAREA"){
if(e.type!="radio"&&e.type!="checkbox"){
e.value="";
}else{
e.checked=false;
}
}
_9e.updateAttributes(e,_9c,_9d);
if(_elems=e.matchAll("> *")){
if(e.hasClass(wFORMS.behaviors.repeat.CSS_REPEATABLE)){
_9e.updateSectionChildNodes(_elems,wFORMS.behaviors.repeat.instance.prototype.createSuffix(e),_9d);
}else{
_9e.updateSectionChildNodes(_elems,_9c,_9d);
}
}
});
};
wFORMS.behaviors.repeat.instance.prototype.createSuffix=function(e,_a2){
var _a3="["+(_a2?_a2:"0")+"]";
var reg=/\[(\d+)\]$/;
e=e.parentNode;
while(e){
if(e.hasClass&&(e.hasClass(wFORMS.behaviors.repeat.CSS_REPEATABLE)||e.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE))){
var idx=reg.exec(e.id);
if(idx){
idx=idx[1];
}
_a3="["+(idx?idx:"0")+"]"+_a3;
}
e=e.parentNode;
}
return _a3;
};
wFORMS.behaviors.repeat.instance.prototype.clearSuffix=function(_a6){
if(!_a6){
return;
}
if(_a6.indexOf("[")!=-1){
return _a6.substring(0,_a6.indexOf("["));
}
return _a6;
};
wFORMS.behaviors.repeat.instance.prototype.updateAttributes=function(e,_a8,_a9){
var _aa=wFORMS.behaviors.hint&&wFORMS.behaviors.hint.isHintId(e.id);
var _ab=e.id.indexOf(wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK)!=-1;
wFORMS.behaviors.repeat.setInDuplicateGroup(e);
if(wFORMS.behaviors.repeat.isHandled(e)){
wFORMS.behaviors.repeat.removeHandled(e);
}
if(wFORMS.behaviors["switch"]&&wFORMS.behaviors["switch"].isHandled(e)){
wFORMS.behaviors["switch"].removeHandle(e);
}
for(var i=0;i<wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY.length;i++){
var _ad=wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY[i];
var _ae=this.clearSuffix(e.getAttribute(_ad));
if(!_ae){
continue;
}
if(_ad=="name"&&e.tagName.toUpperCase()=="INPUT"&&_a9){
continue;
}
if(_aa&&_ad=="id"){
e.setAttribute("id",_ae+_a8+wFORMS.behaviors.hint.HINT_SUFFIX);
}else{
if(_ab){
e.setAttribute(_ad,_ae.replace(new RegExp("(.*)("+wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK+")$"),"$1"+_a8+"$2"));
}else{
e.setAttribute(_ad,_ae+_a8);
}
}
}
};
wFORMS.behaviors.repeat.instance.prototype.getNextDuplicateIndex=function(_af){
var c=wFORMS.behaviors.repeat.getOrCreateCounterField(_af);
var _b1=parseInt(c.value)+1;
c.value=_b1;
return _b1;
};
wFORMS.behaviors.repeat.getOrCreateCounterField=function(_b2){
var cId=_b2.id+wFORMS.behaviors.repeat.ID_SUFFIX_COUNTER;
var _b4=document.getElementById(cId);
if(!_b4||_b4==""){
_b4=wFORMS.behaviors.repeat.createCounterField(cId);
var _b5=_b2.parentNode;
while(_b5&&_b5.tagName.toUpperCase()!="FORM"){
_b5=_b5.parentNode;
}
_b5.appendChild(_b4);
}
return _b4;
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
wFORMS.behaviors.repeat.isDuplicate=function(_b9){
return _b9.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE);
};
wFORMS.behaviors.repeat.setDuplicate=function(_ba){
};
wFORMS.behaviors.repeat.isInDuplicateGroup=function(_bb){
return _bb.getAttribute(wFORMS.behaviors.repeat.ATTR_DUPLICATE_ELEM)?true:false;
};
wFORMS.behaviors.repeat.setInDuplicateGroup=function(_bc){
return _bc.setAttribute(wFORMS.behaviors.repeat.ATTR_DUPLICATE_ELEM,true);
};
wFORMS.behaviors.repeat.isHandled=function(_bd){
return _bd.getAttribute(wFORMS.behaviors.repeat.ATTR_HANDLED);
};
wFORMS.behaviors.repeat.getMasterSection=function(_be){
if(!wFORMS.behaviors.repeat.isDuplicate(_be)){
return false;
}
var e=document.getElementById(_be.getAttribute(wFORMS.behaviors.repeat.ATTR_MASTER_SECTION));
return e==""?null:e;
};
wFORMS.behaviors.repeat.handleElement=function(_c0){
return _c0.setAttribute(wFORMS.behaviors.repeat.ATTR_HANDLED,true);
};
wFORMS.behaviors.repeat.removeHandled=function(_c1){
return _c1.removeAttribute(wFORMS.behaviors.repeat.ATTR_HANDLED);
};
wFORMS.behaviors.repeat.instance.prototype.run=function(e,_c3){
this.duplicateSection(this.target);
if(e){
e.preventDefault();
}
};
if(typeof (wFORMS)=="undefined"){
throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
wFORMS.behaviors["switch"]={SELECTOR:"*[class*=\"switch-\"]",CSS_PREFIX:"switch-",CSS_OFFSTATE_PREFIX:"offstate-",CSS_ONSTATE_PREFIX:"onstate-",CSS_ONSTATE_FLAG:"swtchIsOn",CSS_OFFSTATE_FLAG:"swtchIsOff",onSwitchOn:function(_c4){
},onSwitchOff:function(_c5){
},onSwitch:function(_c6){
},instance:function(f){
this.behavior=wFORMS.behaviors["switch"];
this.target=f;
}};
wFORMS.behaviors["switch"].applyTo=function(f){
var b=new wFORMS.behaviors["switch"].instance(f);
f.matchAll(wFORMS.behaviors["switch"].SELECTOR).forEach(function(_ca){
if(!_ca.id){
_ca.id=wFORMS.helpers.randomId();
}
switch(_ca.tagName.toUpperCase()){
case "OPTION":
var _cb=_ca.parentNode;
while(_cb&&_cb.tagName.toUpperCase()!="SELECT"){
_cb=_cb.parentNode;
}
base2.DOM.bind(_cb);
if(_cb&&!wFORMS.behaviors["switch"].isHandled(_cb)){
_cb.addEventListener("change",function(_cc){
b.run(_cc,_cb);
},false);
b.setupTargets(_ca);
wFORMS.behaviors["switch"].handleElement(_cb);
}
break;
case "INPUT":
if(_ca.type&&_ca.type.toUpperCase()=="RADIO"){
if(!wFORMS.behaviors["switch"].isHandled(_ca)){
b.setupTargets(_ca);
}
var _cd=_ca.form[_ca.name];
for(var i=_cd.length-1;i>=0;i--){
var _cf=base2.DOM.bind(_cd[i]);
if(!wFORMS.behaviors["switch"].isHandled(_cf)){
_cf.addEventListener("click",function(_d0){
b.run(_d0,_cf);
},false);
wFORMS.behaviors["switch"].handleElement(_cf);
}
}
}else{
_ca.addEventListener("click",function(_d1){
b.run(_d1,_ca);
},false);
b.setupTargets(_ca);
}
break;
default:
_ca.addEventListener("click",function(_d2){
b.run(_d2,_ca);
},false);
break;
}
});
return b;
};
wFORMS.behaviors["switch"].isHandled=function(_d3){
return _d3.getAttribute("rel")&&_d3.getAttribute("rel").indexOf("wfHandled")>-1;
};
wFORMS.behaviors["switch"].handleElement=function(_d4){
return _d4.setAttribute("rel",(_d4.getAttribute("rel")||"")+" wfHandled");
};
wFORMS.behaviors["switch"].removeHandle=function(_d5){
if(attr=_d5.getAttribute("rel")){
if(attr=="wfHandled"){
_d5.removeAttribute("rel");
}else{
if(attr.indexOf("wfHandled")!=-1){
_d5.setAttribute("rel",attr.replace(/(.*)( wfHandled)(.*)/,"$1$3"));
}
}
}
};
wFORMS.behaviors["switch"].instance.prototype.getTriggersByElements=function(_d6,_d7){
var o={ON:new Array(),OFF:new Array(),toString:function(){
return "ON: "+this.ON+"\nOFF: "+this.OFF;
}};
for(var i=0;i<_d6.length;i++){
var _da=_d6[i];
switch(_da.tagName.toUpperCase()){
case "OPTION":
if(_da.selected){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(_da,_d7));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(_da,_d7));
}
break;
case "SELECT":
for(var j=0;j<_da.options.length;j++){
var opt=_da.options.item(j);
if(opt.selected){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(opt,_d7));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(opt,_d7));
}
}
break;
case "INPUT":
if(_da.type&&_da.type.toUpperCase()=="RADIO"){
var _dd=_da.form[_da.name];
for(var j=_dd.length-1;j>=0;j--){
var _de=_dd[j];
if(_de==_da||!base2.Array2.contains(_d6,_de)){
if(_de.checked){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(_de,_d7));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(_de,_d7));
}
}
}
}else{
if(_da.checked){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(_da,_d7));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(_da,_d7));
}
}
break;
default:
if(_da.hasClass(this.behavior.CSS_ONSTATE_FLAG)){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(_da,_d7));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(_da,_d7));
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
var _e0=new Array();
for(var i=0;i<o.OFF.length;i++){
if(!base2.Array2.contains(_e0,o.OFF[i])){
_e0.push(o.OFF[i]);
}
}
o.ON=_ON;
o.OFF=_e0;
return o;
};
wFORMS.behaviors["switch"].getSwitchNamesFromTrigger=function(_e1,_e2){
return wFORMS.behaviors["switch"].getSwitchNames(_e1.className,"trigger",_e2);
};
wFORMS.behaviors["switch"].getSwitchNamesFromTarget=function(_e3,_e4){
return wFORMS.behaviors["switch"].getSwitchNames(_e3.className,"target",_e4);
};
wFORMS.behaviors["switch"].getSwitchNames=function(_e5,_e6,_e7){
if(!_e5||_e5==""){
return [];
}
var _e8=_e5.split(" ");
var _e9=new Array();
if(_e6=="trigger"){
var _ea=true;
}else{
var _ea=false;
}
for(var i=_e8.length-1;i>=0;i--){
var cn=_e8[i];
if(_ea){
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
if(sn&&(!_e7||base2.Array2.contains(_e7,sn))){
_e9.push(sn);
}
}
return _e9;
};
wFORMS.behaviors["switch"].instance.prototype.getTargetsBySwitchName=function(_ee,_ef){
var res=new Array();
var _f1=this;
var b=wFORMS.behaviors.repeat;
if(arguments[1]=="ON"){
var _f3=[wFORMS.behaviors["switch"].CSS_ONSTATE_PREFIX+_ee];
}else{
var _f3=[wFORMS.behaviors["switch"].CSS_OFFSTATE_PREFIX+_ee];
}
this.target.getElementsByClassName(_f3).forEach(function(_f4){
if(b&&b.isInDuplicateGroup(_f4)&&!(b.isDuplicate(_f1.target)||b.isInDuplicateGroup(_f1.target))){
return;
}
res.push(base2.DOM.bind(_f4));
});
return res;
};
wFORMS.behaviors["switch"].instance.prototype.getTriggersByTarget=function(_f5){
var res=new Array();
var _f7=this;
var _f8=wFORMS.behaviors["switch"].getSwitchNamesFromTarget(_f5);
var b=wFORMS.behaviors.repeat;
base2.forEach(_f8,function(_fa){
_f7.target.getElementsByClassName([wFORMS.behaviors["switch"].CSS_PREFIX+_fa]).forEach(function(_fb){
if(b&&b.isInDuplicateGroup(_fb)&&!(b.isDuplicate(_f5)||b.isInDuplicateGroup(_f5))){
return;
}
res.push(base2.DOM.bind(_fb));
});
});
return this.getTriggersByElements(res,_f8);
};
wFORMS.behaviors["switch"].instance.prototype.setupTargets=function(_fc){
this.run(null,_fc);
};
wFORMS.behaviors["switch"].isSwitchedOff=function(_fd){
return (_fd.className.match(new RegExp(wFORMS.behaviors["switch"].CSS_OFFSTATE_PREFIX+"[^ ]*"))?true:false)&&(_fd.className.match(new RegExp(wFORMS.behaviors["switch"].CSS_ONSTATE_PREFIX+"[^ ]*"))?false:true);
};
wFORMS.behaviors["switch"].instance.prototype.run=function(e,_ff){
if(!_ff.hasClass){
base2.DOM.bind(_ff);
}
if(_ff.hasClass(this.behavior.CSS_ONSTATE_FLAG)){
_ff.removeClass(this.behavior.CSS_ONSTATE_FLAG);
_ff.addClass(this.behavior.CSS_OFFSTATE_FLAG);
if(e){
e.preventDefault();
}
}else{
if(_ff.hasClass(this.behavior.CSS_OFFSTATE_FLAG)){
_ff.removeClass(this.behavior.CSS_OFFSTATE_FLAG);
_ff.addClass(this.behavior.CSS_ONSTATE_FLAG);
if(e){
e.preventDefault();
}
}
}
var _100=this.getTriggersByElements(new Array(_ff));
var _101=this;
base2.forEach(_100.OFF,function(_102){
var _103=_101.getTargetsBySwitchName(_102,"ON");
base2.forEach(_103,function(elem){
var _105=_101.getTriggersByTarget(elem);
if(_105.ON.length==0){
elem.addClass(wFORMS.behaviors["switch"].CSS_OFFSTATE_PREFIX+_102);
elem.removeClass(wFORMS.behaviors["switch"].CSS_ONSTATE_PREFIX+_102);
_101.behavior.onSwitchOff(elem);
}
});
});
base2.forEach(_100.ON,function(_106){
var _107=_101.getTargetsBySwitchName(_106,"OFF");
base2.forEach(_107,function(elem){
elem.removeClass(wFORMS.behaviors["switch"].CSS_OFFSTATE_PREFIX+_106);
elem.addClass(wFORMS.behaviors["switch"].CSS_ONSTATE_PREFIX+_106);
_101.behavior.onSwitchOn(elem);
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
wFORMS.behaviors.validation.instance.prototype.run=function(e,_114){
var _115=0;
this.elementsInError={};
for(var _116 in this.behavior.rules){
var rule=this.behavior.rules[_116];
var _118=this;
if(!_114.matchAll){
base2.DOM.bind(_114);
}
_114.matchAll(rule.selector).forEach(function(_119){
if(_118.isSwitchedOff(_119)){
return;
}
var _11a=wFORMS.helpers.getFieldValue(_119);
if(rule.check.call){
var _11b=rule.check.call(_118,_119,_11a);
}else{
var _11b=_118[rule.check].call(_118,_119,_11a);
}
if(!_11b){
if(!_119.id){
_119.id=wFORMS.helpers.randomId();
}
_118.elementsInError[_119.id]={id:_119.id,rule:_116};
_118.removeErrorMessage(_119);
if(rule.fail){
rule.fail.call(_118,_119,_116);
}else{
_118.fail.call(_118,_119,_116);
}
_115++;
}else{
if(!_118.elementsInError[_119.id]){
_118.removeErrorMessage(_119);
}
if(rule.pass){
rule.pass.call(_118,_119);
}else{
_118.pass.call(_118,_119);
}
}
});
}
if(_115>0){
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
wFORMS.behaviors.validation.instance.prototype.fail=function(_11c,_11d){
_11c.addClass(this.behavior.styling.fieldError);
this.addErrorMessage(_11c,this.behavior.messages[_11d]);
},wFORMS.behaviors.validation.instance.prototype.pass=function(_11e){
};
wFORMS.behaviors.validation.instance.prototype.addErrorMessage=function(_11f,_120){
if(!_11f.id){
_11f.id=wFORMS.helpers.randomId();
}
var _121=document.createTextNode(" "+_120);
var p=document.getElementById(_11f.id+"-E");
if(!p){
p=document.createElement("div");
p.setAttribute("id",_11f.id+"-E");
p=_11f.parentNode.insertBefore(p,_11f.nextSibling);
}
p.appendChild(_121);
base2.DOM.bind(p);
p.addClass(this.behavior.styling.errorMessage);
};
wFORMS.behaviors.validation.instance.prototype.removeErrorMessage=function(_123){
if(!_123.hasClass){
base2.DOM.bind(_123);
}
if(_123.hasClass(this.behavior.styling.fieldError)){
_123.removeClass(this.behavior.styling.fieldError);
var _124=document.getElementById(_123.id+"-E");
if(_124){
_124.parentNode.removeChild(_124);
}
}
};
wFORMS.behaviors.validation.instance.prototype.isSwitchedOff=function(_125){
var sb=wFORMS.getBehaviorInstance(this.target,"switch");
if(sb){
var _127=_125;
while(_127&&_127.tagName!="BODY"){
if(_127.className&&_127.className.indexOf(sb.behavior.CSS_OFFSTATE_PREFIX)!=-1&&_127.className.indexOf(sb.behavior.CSS_ONSTATE_PREFIX)==-1){
return true;
}
_127=_127.parentNode;
}
}
return false;
};
wFORMS.behaviors.validation.instance.prototype.isEmpty=function(s){
var _129=/^\s+$/;
return ((s==null)||(s.length==0)||_129.test(s));
};
wFORMS.behaviors.validation.instance.prototype.validateRequired=function(_12a,_12b){
switch(_12a.tagName){
case "INPUT":
var _12c=_12a.getAttribute("type");
if(!_12c){
_12c="text";
}
switch(_12c.toLowerCase()){
case "checkbox":
case "radio":
return _12a.checked;
break;
default:
return !this.isEmpty(_12b);
}
break;
case "SELECT":
return !this.isEmpty(_12b);
break;
case "TEXTAREA":
return !this.isEmpty(_12b);
break;
default:
return this.validateOneRequired(_12a);
break;
}
return false;
};
wFORMS.behaviors.validation.instance.prototype.validateOneRequired=function(_12d){
if(_12d.nodeType!=1){
return false;
}
if(this.isSwitchedOff(_12d)){
return false;
}
switch(_12d.tagName){
case "INPUT":
var _12e=_12d.getAttribute("type");
if(!_12e){
_12e="text";
}
switch(_12e.toLowerCase()){
case "checkbox":
case "radio":
return _12d.checked;
break;
default:
return !this.isEmpty(wFORMS.helpers.getFieldValue(_12d));
}
break;
case "SELECT":
return !this.isEmpty(wFORMS.helpers.getFieldValue(_12d));
break;
case "TEXTAREA":
return !this.isEmpty(wFORMS.helpers.getFieldValue(_12d));
break;
default:
for(var i=0;i<_12d.childNodes.length;i++){
if(this.validateOneRequired(_12d.childNodes[i])){
return true;
}
}
break;
}
return false;
};
wFORMS.behaviors.validation.instance.prototype.validateAlpha=function(_130,_131){
var _132=/^[a-zA-Z\s]+$/;
return this.isEmpty(_131)||_132.test(_131);
};
wFORMS.behaviors.validation.instance.prototype.validateAlphanum=function(_133,_134){
var _135=/^[\w\s]+$/;
return this.isEmpty(_134)||_135.test(_134);
};
wFORMS.behaviors.validation.instance.prototype.validateDate=function(_136,_137){
var _138=new Date(_137);
return this.isEmpty(_137)||!isNaN(_138);
};
wFORMS.behaviors.validation.instance.prototype.validateTime=function(_139,_13a){
return true;
};
wFORMS.behaviors.validation.instance.prototype.validateEmail=function(_13b,_13c){
var _13d=/\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/;
return this.isEmpty(_13c)||_13d.test(_13c);
};
wFORMS.behaviors.validation.instance.prototype.validateInteger=function(_13e,_13f){
var _140=/^[+]?\d+$/;
return this.isEmpty(_13f)||_140.test(_13f);
};
wFORMS.behaviors.validation.instance.prototype.validateFloat=function(_141,_142){
return this.isEmpty(_142)||!isNaN(parseFloat(_142));
};
wFORMS.behaviors.validation.instance.prototype.validateCustom=function(_143,_144){
var _145=new RegExp("/(.*)/([gi]*)");
var _146=_143.className.match(_145);
if(_146&&_146[0]){
var _147=new RegExp(_146[1],_146[2]);
if(!_144.match(_147)){
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
var _14c=elem.className.substr(elem.className.indexOf("formula=")+8).split(" ")[0];
var _14d=_14c.split(/[^a-zA-Z]+/g);
b.varFields=[];
for(var i=0;i<_14d.length;i++){
if(_14d[i]!=""){
f.matchAll("*[class*=\""+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+_14d[i]+"\"]").forEach(function(_14f){
var _150=((" "+_14f.className+" ").indexOf(" "+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+_14d[i]+" ")!=-1);
if(!_150){
return;
}
switch(_14f.tagName+":"+_14f.getAttribute("type")){
case "INPUT:":
case "INPUT:null":
case "INPUT:text":
case "INPUT:hidden":
case "INPUT:password":
case "TEXTAREA:null":
if(!_14f._wforms_calc_handled){
_14f.addEventListener("blur",function(e){
return b.run(e,this);
},false);
_14f._wforms_calc_handled=true;
}
break;
case "INPUT:radio":
case "INPUT:checkbox":
if(!_14f._wforms_calc_handled){
_14f.addEventListener("click",function(e){
return b.run(e,this);
},false);
_14f._wforms_calc_handled=true;
}
break;
case "SELECT:null":
if(!_14f._wforms_calc_handled){
_14f.addEventListener("change",function(e){
return b.run(e,this);
},false);
_14f._wforms_calc_handled=true;
}
break;
default:
return;
break;
}
b.varFields.push({name:_14d[i],field:_14f});
});
}
}
var calc={field:elem,formula:_14c,variables:b.varFields};
b.calculations.push(calc);
b.compute(calc);
});
b.onApply();
return b;
};
wFORMS.behaviors.calculation.instance.prototype.onApply=function(){
};
wFORMS.behaviors.calculation.instance.prototype.run=function(_155,_156){
for(var i=0;i<this.calculations.length;i++){
var calc=this.calculations[i];
for(var j=0;j<calc.variables.length;j++){
if(_156==calc.variables[j].field){
this.compute(calc);
}
}
}
};
wFORMS.behaviors.calculation.instance.prototype.compute=function(_15a){
var f=this.target;
var _15c=_15a.formula;
for(var i=0;i<_15a.variables.length;i++){
var v=_15a.variables[i];
var _15f=0;
var _160=this;
f.matchAll("*[class*=\""+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+v.name+"\"]").forEach(function(f){
var _162=((" "+f.className+" ").indexOf(" "+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+v.name+" ")!=-1);
if(!_162){
return;
}
if(_160.hasValueInClassName(f)){
var _163=_160.getValueFromClassName(f);
}else{
var _163=wFORMS.helpers.getFieldValue(f);
}
if(!_163){
_163=0;
}
if(_163.constructor.toString().indexOf("Array")!==-1){
for(var j=0;j<_163.length;j++){
_15f+=parseFloat(_163[j]);
}
}else{
_15f+=parseFloat(_163);
}
});
var rgx=new RegExp("[^a-z]+("+v.name+")[^a-z]+","gi");
var m=rgx.exec(" "+_15c+" ");
if(m){
if(m[1]){
_15c=_15c.replace(m[1],_15f);
}else{
_15c=_15c.replace(m[0],_15f);
}
}
}
try{
var _167=eval(_15c);
if(_167=="Infinity"||_167=="NaN"||isNaN(_167)){
_167="error";
}
}
catch(x){
_167="error";
}
var _168=wFORMS.getBehaviorInstance(this.target,"validation");
if(_168){
if(!wFORMS.behaviors.validation.messages["calculation"]){
wFORMS.behaviors.validation.messages["calculation"]=this.behavior.CALCULATION_ERROR_MESSAGE;
}
_168.removeErrorMessage(_15a.field);
if(_167=="error"){
_168.fail(_15a.field,"calculation");
}
}
_15a.field.value=_167;
if(_15a.field.className&&(_15a.field.className.indexOf(this.behavior.VARIABLE_SELECTOR_PREFIX)!=-1)){
this.run(null,_15a.field);
}
};
wFORMS.behaviors.calculation.instance.prototype.hasValueInClassName=function(_169){
switch(_169.tagName){
case "SELECT":
for(var i=0;i<_169.options.length;i++){
if(_169.options[i].className&&_169.options[i].className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)!=-1){
return true;
}
}
return false;
break;
default:
if(!_169.className||(" "+_169.className).indexOf(" "+this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)==-1){
return false;
}
break;
}
return true;
};
wFORMS.behaviors.calculation.instance.prototype.getValueFromClassName=function(_16b){
switch(_16b.tagName){
case "INPUT":
if(!_16b.className||_16b.className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)==-1){
return null;
}
var _16c=_16b.className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(" ")[0];
if(_16b.type=="checkbox"){
return _16b.checked?_16c:null;
}
if(_16b.type=="radio"){
return _16b.checked?_16c:null;
}
return _16c;
break;
case "SELECT":
if(_16b.selectedIndex==-1){
return null;
}
if(_16b.getAttribute("multiple")){
var v=[];
for(var i=0;i<_16b.options.length;i++){
if(_16b.options[i].selected){
if(_16b.options[i].className&&_16b.options[i].className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)!=-1){
var _16c=_16b.options[i].className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(" ")[0];
v.push(_16c);
}
}
}
if(v.length==0){
return null;
}
return v;
}
if(_16b.options[_16b.selectedIndex].className&&_16b.options[_16b.selectedIndex].className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)!=-1){
var _16c=_16b.options[_16b.selectedIndex].className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(" ")[0];
return _16c;
}
break;
case "TEXTAREA":
if(!_16b.className||_16b.className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)==-1){
return null;
}
var _16c=_16b.className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(" ")[0];
return _16c;
break;
default:
return null;
break;
}
return null;
};

