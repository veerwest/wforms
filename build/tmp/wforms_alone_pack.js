if(typeof (wFORMS)=="undefined"){
throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
wFORMS.behaviors.hint={CSS_INACTIVE:"field-hint-inactive",CSS_ACTIVE:"field-hint",HINT_SELECTOR:"*[id$=\"-H\"]",HINT_SUFFIX:"-H",instance:function(f){
this.behavior=wFORMS.behaviors.hint;
this.target=f;
}};
wFORMS.behaviors.hint.applyTo=function(f){
var b=new wFORMS.behaviors.hint.instance(f);
f.querySelectorAll(wFORMS.behaviors.hint.HINT_SELECTOR).forEach(function(_4){
var e=b.getElementByHintId(_4.id);
if(e){
if(!e.addEventListener){
base2.DOM.bind(e);
}
if(e.tagName=="SELECT"||e.tagName=="TEXTAREA"||(e.tagName=="INPUT"&&e.type!="radio"&&e.type!="checkbox")){
e.addEventListener("focus",function(_6){
b.run(_6,this);
},false);
e.addEventListener("blur",function(_7){
b.run(_7,this);
},false);
}else{
e.addEventListener("mouseover",function(_8){
b.run(_8,e);
},false);
e.addEventListener("mouseout",function(_9){
b.run(_9,e);
},false);
}
}
});
b.onApply();
return b;
};
wFORMS.behaviors.hint.instance.prototype.onApply=function(){
};
wFORMS.behaviors.hint.instance.prototype.run=function(_a,_b){
var _c=this.getHintElement(_b);
if(!_c){
return;
}
if(_a.type=="focus"||_a.type=="mouseover"){
_c.removeClass(wFORMS.behaviors.hint.CSS_INACTIVE);
_c.addClass(wFORMS.behaviors.hint.CSS_ACTIVE);
this.setup(_c,_b);
}else{
_c.addClass(wFORMS.behaviors.hint.CSS_INACTIVE);
_c.removeClass(wFORMS.behaviors.hint.CSS_ACTIVE);
}
};
wFORMS.behaviors.hint.instance.prototype.getElementByHintId=function(_d){
var id=_d.substr(0,_d.length-wFORMS.behaviors.hint.HINT_SUFFIX.length);
var e=document.getElementById(id);
return e;
};
wFORMS.behaviors.hint.instance.prototype.getHintElement=function(_10){
var e=document.getElementById(_10.id+this.behavior.HINT_SUFFIX);
return e&&e!=""?e:null;
};
wFORMS.behaviors.hint.instance.prototype.setup=function(_12,_13){
var l=((_13.tagName=="SELECT"?+_13.offsetWidth:0)+wFORMS.helpers.getLeft(_13));
var t=(wFORMS.helpers.getTop(_13)+_13.offsetHeight);
_12.style.left=l+"px";
_12.style.top=t+"px";
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
var _1a=wFORMS.behaviors.paging;
var _1b=(wFORMS.behaviors.validation&&wFORMS.behaviors.paging.runValidationOnPageNext);
var _1c=false;
f.querySelectorAll(wFORMS.behaviors.paging.SELECTOR).forEach(function(_1d){
_1c=true;
var ph=b.getOrCreatePlaceHolder(_1d);
var _1f=wFORMS.behaviors.paging.getPageIndex(_1d);
if(_1f==1){
var _20=base2.DOM.bind(ph.appendChild(_1a._createNextPageButton(_1f)));
if(_1b){
_20.addEventListener("click",function(_21){
var v=wFORMS.getBehaviorInstance(b.target,"validation");
if(v.run(_21,_1d)){
b.run(_21,_20);
}
},false);
}else{
_20.addEventListener("click",function(_23){
b.run(_23,_20);
},false);
}
wFORMS.behaviors.paging.showPage(_1d);
}else{
var _20=base2.DOM.bind(_1a._createPreviousPageButton(_1f));
ph.insertBefore(_20,ph.firstChild);
_20.addEventListener("click",function(_24){
b.run(_24,_20);
},false);
if(!wFORMS.behaviors.paging.isLastPageIndex(_1f,true)){
var _25=base2.DOM.bind(ph.appendChild(_1a._createNextPageButton(_1f)));
if(_1b){
_25.addEventListener("click",function(_26){
var v=wFORMS.getBehaviorInstance(b.target,"validation");
if(v.run(_26,_1d)){
b.run(_26,_25);
}
},false);
}else{
_25.addEventListener("click",function(_28){
b.run(_28,_25);
},false);
}
}
}
});
if(_1c){
p=b.findNextPage(0);
b.currentPageIndex=0;
b.activatePage(wFORMS.behaviors.paging.getPageIndex(p));
b.onApply();
}
return b;
};
wFORMS.behaviors.paging.instance.prototype.onApply=function(){
};
wFORMS.behaviors.paging.getPageIndex=function(_29){
if(_29&&_29.id){
var _2a=_29.id.replace(new RegExp(wFORMS.behaviors.paging.ID_PAGE_PREFIX+"(\\d+)"),"$1");
_2a=parseInt(_2a);
return !isNaN(_2a)?_2a:false;
}
return false;
};
wFORMS.behaviors.paging._createNextPageButton=function(_2b){
var _2c=wFORMS.behaviors.paging.createNextPageButton();
_2c.setAttribute(wFORMS.behaviors.paging.ATTR_INDEX,_2b+1);
_2c.id=wFORMS.behaviors.paging.ID_BUTTON_NEXT_PREFIX+_2b;
return _2c;
};
wFORMS.behaviors.paging.createNextPageButton=function(){
var _2d=document.createElement("input");
_2d.setAttribute("value",wFORMS.behaviors.paging.MESSAGES.CAPTION_NEXT);
_2d.setAttribute("type","button");
_2d.className=wFORMS.behaviors.paging.CSS_BUTTON_NEXT;
return _2d;
};
wFORMS.behaviors.paging._createPreviousPageButton=function(_2e){
var _2f=wFORMS.behaviors.paging.createPreviousPageButton();
_2f.setAttribute(wFORMS.behaviors.paging.ATTR_INDEX,_2e-1);
_2f.id=wFORMS.behaviors.paging.ID_BUTTON_PREVIOUS_PREFIX+_2e;
return _2f;
};
wFORMS.behaviors.paging.createPreviousPageButton=function(){
var _30=document.createElement("input");
_30.setAttribute("value",wFORMS.behaviors.paging.MESSAGES.CAPTION_PREVIOUS);
_30.setAttribute("type","button");
_30.className=wFORMS.behaviors.paging.CSS_BUTTON_PREVIOUS;
return _30;
};
wFORMS.behaviors.paging.instance.prototype.getOrCreatePlaceHolder=function(_31){
var id=_31.id+wFORMS.behaviors.paging.ID_PLACEHOLDER_SUFFIX;
var _33=document.getElementById(id);
if(!_33){
_33=_31.appendChild(document.createElement("div"));
_33.id=id;
_33.className=wFORMS.behaviors.paging.CSS_BUTTON_PLACEHOLDER;
}
return _33;
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
wFORMS.behaviors.paging.instance.prototype.activatePage=function(_36){
if(_36==this.currentPageIndex){
return false;
}
_36=parseInt(_36);
if(_36>this.currentPageIndex){
var p=this.findNextPage(this.currentPageIndex);
}else{
var p=this.findPreviousPage(this.currentPageIndex);
}
if(p){
var _38=this;
setTimeout(function(){
var _39=_38.behavior.getPageIndex(p);
_38.setupManagedControls(_39);
_38.behavior.hidePage(_38.behavior.getPageByIndex(_38.currentPageIndex));
_38.behavior.showPage(p);
var _3a=_38.currentPageIndex;
_38.currentPageIndex=_39;
_38.behavior.onPageChange(p);
if(_39>_3a){
_38.behavior.onPageNext(p);
}else{
_38.behavior.onPagePrevious(p);
}
},1);
}
};
wFORMS.behaviors.paging.instance.prototype.setupManagedControls=function(_3b){
if(!_3b){
_3b=this.currentPageIndex;
}
var b=wFORMS.behaviors.paging;
if(b.isFirstPageIndex(_3b)){
if(ctrl=b.getPreviousButton(_3b)){
ctrl.style.display="none";
}
}else{
if(ctrl=b.getPreviousButton(_3b)){
ctrl.style.display="inline";
}
}
if(b.isLastPageIndex(_3b)){
if(ctrl=b.getNextButton(_3b)){
ctrl.style.display="none";
}
this.showSubmitButtons();
}else{
if(ctrl=b.getNextButton(_3b)){
ctrl.style.display="inline";
}
this.hideSubmitButtons();
}
};
wFORMS.behaviors.paging.instance.prototype.showSubmitButtons=function(){
this.target.querySelectorAll("input[type~=\"submit\"]").forEach(function(_3d){
_3d.removeClass(wFORMS.behaviors.paging.CSS_SUBMIT_HIDDEN);
});
};
wFORMS.behaviors.paging.instance.prototype.hideSubmitButtons=function(){
this.target.querySelectorAll("input[type~=\"submit\"]").forEach(function(_3e){
_3e.addClass(wFORMS.behaviors.paging.CSS_SUBMIT_HIDDEN);
});
};
wFORMS.behaviors.paging.getPageByIndex=function(_3f){
var _40=document.getElementById(wFORMS.behaviors.paging.ID_PAGE_PREFIX+_3f);
return _40?base2.DOM.bind(_40):false;
};
wFORMS.behaviors.paging.getNextButton=function(_41){
return document.getElementById(wFORMS.behaviors.paging.ID_BUTTON_NEXT_PREFIX+_41);
};
wFORMS.behaviors.paging.getPreviousButton=function(_42){
return document.getElementById(wFORMS.behaviors.paging.ID_BUTTON_PREVIOUS_PREFIX+_42);
};
wFORMS.behaviors.paging.isLastPageIndex=function(_43,_44){
_43=parseInt(_43)+1;
var b=wFORMS.behaviors.paging;
var p=b.getPageByIndex(_43);
if((_b=wFORMS.behaviors["switch"])&&!_44){
while(p&&_b.isSwitchedOff(p)){
_43++;
p=b.getPageByIndex(_43);
}
}
return p?false:true;
};
wFORMS.behaviors.paging.isFirstPageIndex=function(_47,_48){
_47=parseInt(_47)-1;
var b=wFORMS.behaviors.paging;
var p=b.getPageByIndex(_47);
if((_b=wFORMS.behaviors["switch"])&&!_48){
while(p&&_b.isSwitchedOff(p)){
_47--;
p=b.getPageByIndex(_47);
}
}
return p?false:true;
};
wFORMS.behaviors.paging.instance.prototype.findNextPage=function(_4b){
_4b=parseInt(_4b)+1;
var b=wFORMS.behaviors.paging;
var p=b.getPageByIndex(_4b);
if(_b=wFORMS.behaviors["switch"]){
while(p&&_b.isSwitchedOff(p)){
_4b++;
p=b.getPageByIndex(_4b);
}
}
return p?p:true;
};
wFORMS.behaviors.paging.instance.prototype.findPreviousPage=function(_4e){
_4e=parseInt(_4e)-1;
var b=wFORMS.behaviors.paging;
var p=b.getPageByIndex(_4e);
if(_b=wFORMS.behaviors["switch"]){
while(p&&_b.isSwitchedOff(p)){
_4e--;
p=b.getPageByIndex(_4e);
}
}
return p?p:false;
};
wFORMS.behaviors.paging.instance.prototype.run=function(e,_52){
this.activatePage(_52.getAttribute(wFORMS.behaviors.paging.ATTR_INDEX));
};
if(typeof (wFORMS)=="undefined"){
throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
wFORMS.behaviors.repeat={SELECTOR_REPEAT:"*[class~=\"repeat\"]",SELECTOR_REMOVEABLE:"*[class~=\"removeable\"]",ID_SUFFIX_DUPLICATE_LINK:"-wfDL",ID_SUFFIX_COUNTER:"-RC",CSS_DUPLICATE_LINK:"duplicateLink",CSS_DUPLICATE_SPAN:"duplicateSpan",CSS_DELETE_LINK:"removeLink",CSS_DELETE_SPAN:"removeSpan",CSS_REMOVEABLE:"removeable",CSS_REPEATABLE:"repeat",ATTR_DUPLICATE:"wfr__dup",ATTR_DUPLICATE_ELEM:"wfr__dup_elem",ATTR_HANDLED:"wfr_handled",ATTR_MASTER_SECTION:"wfr__master_sec",ATTR_LINK_SECTION_ID:"wfr_sec_id",MESSAGES:{ADD_CAPTION:"Add another response",ADD_TITLE:"Will duplicate this question or section.",REMOVE_CAPTION:"Remove",REMOVE_TITLE:"Will remove this question or section"},UPDATEABLE_ATTR_ARRAY:["id","name","for"],preserveRadioName:false,CSS_PRESERVE_RADIO_NAME:"preserveRadioName",onRepeat:function(_53){
},onRemove:function(){
},allowRepeat:function(_54,b){
return true;
},instance:function(f){
this.behavior=wFORMS.behaviors.repeat;
this.target=f;
}};
wFORMS.behaviors.repeat.applyTo=function(f){
var _58=this;
var b=new Array();
f.querySelectorAll(this.SELECTOR_REPEAT).forEach(function(_5a){
if(_58.isHandled(_5a)){
return;
}
if(!_5a.id){
_5a.id=wFORMS.helpers.randomId();
}
var _b=new _58.instance(_5a);
var e=_b.getOrCreateRepeatLink(_5a);
e.addEventListener("click",function(_5d){
_b.run(_5d,e);
},false);
b.push(_b);
_58.handleElement(_5a);
});
var _5e=function(_5f){
e=_58.createRemoveLink(_5f.id);
if(_5f.tagName=="TR"){
var tds=_5f.getElementsByTagName("TD");
var _61=tds[tds.length-1];
_61.appendChild(e);
}else{
_5f.appendChild(e);
}
};
if(f.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE)){
_5e(f);
}
f.querySelectorAll(this.SELECTOR_REMOVEABLE).forEach(function(e){
_5e(e);
});
for(var i=0;i<b.length;i++){
b[i].onApply();
}
return b;
};
wFORMS.behaviors.repeat.instance.prototype.onApply=function(){
};
wFORMS.behaviors.repeat.instance.prototype.getOrCreateRepeatLink=function(_64){
var id=_64.id+wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK;
var e=document.getElementById(id);
if(!e||e==""){
e=this.createRepeatLink(id);
var _67=document.createElement("span");
_67.className=wFORMS.behaviors.repeat.CSS_DUPLICATE_SPAN;
e=_67.appendChild(e);
if(_64.tagName.toUpperCase()=="TR"){
var _68=_64.getElementsByTagName("TD");
if(!_68){
_68=_64.appendChild(document.createElement("TD"));
}else{
_68=_68[_68.length-1];
}
_68.appendChild(_67);
}else{
_64.appendChild(_67);
}
}
return base2.DOM.bind(e);
};
wFORMS.behaviors.repeat.instance.prototype.createRepeatLink=function(id){
var _6a=document.createElement("A");
_6a.id=id;
_6a.setAttribute("href","#");
_6a.className=wFORMS.behaviors.repeat.CSS_DUPLICATE_LINK;
_6a.setAttribute("title",wFORMS.behaviors.repeat.MESSAGES.ADD_TITLE);
_6a.appendChild(document.createElement("span").appendChild(document.createTextNode(wFORMS.behaviors.repeat.MESSAGES.ADD_CAPTION)));
return _6a;
};
wFORMS.behaviors.repeat.createRemoveLink=function(id){
var _6c=document.createElement("a");
_6c.id=id+wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK;
_6c.setAttribute("href","#");
_6c.className=wFORMS.behaviors.repeat.CSS_DELETE_LINK;
_6c.setAttribute("title",wFORMS.behaviors.repeat.MESSAGES.REMOVE_TITLE);
_6c.setAttribute(wFORMS.behaviors.repeat.ATTR_LINK_SECTION_ID,id);
var _6d=document.createElement("span");
_6d.appendChild(document.createTextNode(wFORMS.behaviors.repeat.MESSAGES.REMOVE_CAPTION));
_6c.appendChild(_6d);
_6c.onclick=function(_6e){
wFORMS.behaviors.repeat.onRemoveLinkClick(_6e,_6c);
};
var _6d=document.createElement("span");
_6d.className=wFORMS.behaviors.repeat.CSS_DELETE_SPAN;
_6d.appendChild(_6c);
return _6d;
};
wFORMS.behaviors.repeat.instance.prototype.getTargetByRepeatLink=function(_6f){
return this.target.matchSingle("#"+_6f.id.substring(0,_6f.id.length-wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK.length));
};
wFORMS.behaviors.repeat.instance.prototype.duplicateSection=function(_70){
if(!this.behavior.allowRepeat(_70,this)){
return false;
}
this.updateMasterSection(_70);
var _71=_70.cloneNode(true);
_71=_70.parentNode.insertBefore(_71,this.getInsertNode(_70));
this.updateDuplicatedSection(_71);
wFORMS.applyBehaviors(_71);
wFORMS.behaviors.repeat.onRepeat(_71);
};
wFORMS.behaviors.repeat.removeSection=function(id){
var _73=document.getElementById(id);
if(_73!=""){
_73.parentNode.removeChild(_73);
wFORMS.behaviors.repeat.onRemove();
}
};
wFORMS.behaviors.repeat.instance.prototype.getInsertNode=function(_74){
var _75=_74.nextSibling;
if(_75&&_75.nodeType==1&&!_75.hasClass){
_75=base2.DOM.bind(_75);
}
while(_75&&(_75.nodeType==3||_75.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE))){
_75=_75.nextSibling;
if(_75&&_75.nodeType==1&&!_75.hasClass){
_75=base2.DOM.bind(_75);
}
}
return _75;
};
wFORMS.behaviors.repeat.onRemoveLinkClick=function(_76,_77){
this.removeSection(_77.getAttribute(wFORMS.behaviors.repeat.ATTR_LINK_SECTION_ID));
if(_76){
_76.preventDefault();
}
};
wFORMS.behaviors.repeat.instance.prototype.updateMasterSection=function(_78){
if(_78.doItOnce==true){
return true;
}else{
_78.doItOnce=true;
}
var _79=this.createSuffix(_78);
_78.id=this.clearSuffix(_78.id)+_79;
this.updateMasterElements(_78,_79);
};
wFORMS.behaviors.repeat.instance.prototype.updateMasterElements=function(_7a,_7b){
if(!_7a||_7a.nodeType!=1){
return;
}
var cn=_7a.childNodes;
for(var i=0;i<cn.length;i++){
var n=cn[i];
if(n.nodeType!=1){
continue;
}
if(!n.hasClass){
n.hasClass=function(_7f){
return base2.DOM.HTMLElement.hasClass(this,_7f);
};
}
var _80=_7b;
if(n.hasClass(wFORMS.behaviors.repeat.CSS_REPEATABLE)){
_7b+="[0]";
}
if(!n.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE)){
for(var j=0;j<wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY.length;j++){
var _82=wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY[j];
var _83=this.clearSuffix(n.getAttribute(_82));
if(!_83){
continue;
}
if(_82=="id"&&wFORMS.behaviors.hint&&wFORMS.behaviors.hint.isHintId(n.id)){
n.id=_83.replace(new RegExp("(.*)("+wFORMS.behaviors.hint.HINT_SUFFIX+")$"),"$1"+_7b+"$2");
}else{
if(_82=="id"&&wFORMS.behaviors.validation&&wFORMS.behaviors.validation.isErrorPlaceholderId(n.id)){
n.id=_83.replace(new RegExp("(.*)("+wFORMS.behaviors.validation.ERROR_PLACEHOLDER_SUFFIX+")$"),"$1"+_7b+"$2");
}else{
if(_82=="id"&&n.id.indexOf(wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK)!=-1){
n.id=_83.replace(new RegExp("(.*)("+wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK+")$"),"$1"+_7b+"$2");
}else{
if(_82=="id"){
n.id=_83+_7b;
}else{
if(_82=="name"){
n.name=_83+_7b;
}else{
n.setAttribute(_82,_83+_7b);
}
}
}
}
}
}
this.updateMasterElements(n,_7b);
}
_7b=_80;
}
};
wFORMS.behaviors.repeat.instance.prototype.updateDuplicatedSection=function(_84){
var _85=this.getNextDuplicateIndex(this.target);
var _86=this.createSuffix(_84,_85);
_84.setAttribute(this.behavior.ATTR_MASTER_SECTION,_84.id);
_84.id=this.clearSuffix(_84.id)+_86;
_84.className=_84.className.replace(this.behavior.CSS_REPEATABLE,this.behavior.CSS_REMOVEABLE);
if(!_84.hasClass){
_84.hasClass=function(_87){
return base2.DOM.HTMLElement.hasClass(this,_87);
};
}
if(_84.hasClass(this.behavior.CSS_PRESERVE_RADIO_NAME)){
var _88=true;
}else{
var _88=this.behavior.preserveRadioName;
}
this.updateSectionChildNodes(_84,_86,_88);
};
wFORMS.behaviors.repeat.instance.prototype.updateSectionChildNodes=function(_89,_8a,_8b){
var _8c=new Array();
var l=_89.childNodes.length;
for(var i=0;i<l;i++){
var e=_89.childNodes[i];
if(e.nodeType!=1){
continue;
}
if(!e.hasClass){
e.hasClass=function(_90){
return base2.DOM.HTMLElement.hasClass(this,_90);
};
}
if(this.behavior.isDuplicate(e)){
_8c.push(e);
continue;
}
if(e.hasClass(this.behavior.CSS_DUPLICATE_SPAN)){
_8c.push(e);
continue;
}
if(e.hasClass(this.behavior.CSS_DUPLICATE_LINK)){
_8c.push(e);
continue;
}
if(e.tagName=="INPUT"||e.tagName=="TEXTAREA"){
if(e.type!="radio"&&e.type!="checkbox"){
e.value="";
}else{
e.checked=false;
}
}
this.updateAttributes(e,_8a,_8b);
if(e.hasClass(this.behavior.CSS_REPEATABLE)){
this.updateSectionChildNodes(e,this.createSuffix(e),_8b);
}else{
this.updateSectionChildNodes(e,_8a,_8b);
}
}
for(var i=0;i<_8c.length;i++){
var e=_8c[i];
if(e.clearAttributes){
e.clearAttributes(false);
}
if(e.parentNode){
e.parentNode.removeChild(e);
}
}
};
wFORMS.behaviors.repeat.instance.prototype.createSuffix=function(e,_92){
var _93="["+(_92?_92:"0")+"]";
var reg=/\[(\d+)\]$/;
e=e.parentNode;
while(e){
if(e.hasClass&&(e.hasClass(wFORMS.behaviors.repeat.CSS_REPEATABLE)||e.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE))){
var idx=reg.exec(e.id);
if(idx){
idx=idx[1];
}
_93="["+(idx?idx:"0")+"]"+_93;
}
e=e.parentNode;
}
return _93;
};
wFORMS.behaviors.repeat.instance.prototype.clearSuffix=function(_96){
if(!_96){
return;
}
if(_96.indexOf("[")!=-1){
return _96.substring(0,_96.indexOf("["));
}
return _96;
};
wFORMS.behaviors.repeat.instance.prototype.updateAttributes=function(e,_98,_99){
var _9a=wFORMS.behaviors.hint&&wFORMS.behaviors.hint.isHintId(e.id);
var _9b=wFORMS.behaviors.validation&&wFORMS.behaviors.validation.isErrorPlaceholderId(e.id);
var _9c=e.id.indexOf(wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK)!=-1;
wFORMS.behaviors.repeat.setInDuplicateGroup(e);
if(wFORMS.behaviors.repeat.isHandled(e)){
wFORMS.behaviors.repeat.removeHandled(e);
}
if(wFORMS.behaviors["switch"]&&wFORMS.behaviors["switch"].isHandled(e)){
wFORMS.behaviors["switch"].removeHandle(e);
}
var l=wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY.length;
for(var i=0;i<l;i++){
var _9f=wFORMS.behaviors.repeat.UPDATEABLE_ATTR_ARRAY[i];
var _a0=this.clearSuffix(e.getAttribute(_9f));
if(!_a0){
continue;
}
if(_9f=="name"&&e.tagName=="INPUT"&&_99){
continue;
}else{
if(_9b&&_9f=="id"){
e.id=_a0+_98+wFORMS.behaviors.validation.ERROR_PLACEHOLDER_SUFFIX;
}else{
if(_9a&&_9f=="id"){
e.id=_a0+_98+wFORMS.behaviors.hint.HINT_SUFFIX;
}else{
if(_9c&&_9f=="id"){
e.id=_a0.replace(new RegExp("(.*)("+wFORMS.behaviors.repeat.ID_SUFFIX_DUPLICATE_LINK+")$"),"$1"+_98+"$2");
}else{
if(_9f=="id"){
e.id=_a0+_98;
}else{
if(_9f=="name"){
e.name=_a0+_98;
}else{
e.setAttribute(_9f,_a0+_98);
}
}
}
}
}
}
}
};
wFORMS.behaviors.repeat.instance.prototype.getNextDuplicateIndex=function(_a1){
var c=wFORMS.behaviors.repeat.getOrCreateCounterField(_a1);
var _a3=parseInt(c.value)+1;
c.value=_a3;
return _a3;
};
wFORMS.behaviors.repeat.getOrCreateCounterField=function(_a4){
var cId=_a4.id+wFORMS.behaviors.repeat.ID_SUFFIX_COUNTER;
var _a6=document.getElementById(cId);
if(!_a6||_a6==""){
_a6=wFORMS.behaviors.repeat.createCounterField(cId);
var _a7=_a4.parentNode;
while(_a7&&_a7.tagName.toUpperCase()!="FORM"){
_a7=_a7.parentNode;
}
_a7.appendChild(_a6);
}
return _a6;
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
wFORMS.behaviors.repeat.isDuplicate=function(_ab){
return _ab.hasClass(wFORMS.behaviors.repeat.CSS_REMOVEABLE);
};
wFORMS.behaviors.repeat.setDuplicate=function(_ac){
};
wFORMS.behaviors.repeat.isInDuplicateGroup=function(_ad){
return _ad.getAttribute(wFORMS.behaviors.repeat.ATTR_DUPLICATE_ELEM)?true:false;
};
wFORMS.behaviors.repeat.setInDuplicateGroup=function(_ae){
return _ae.setAttribute(wFORMS.behaviors.repeat.ATTR_DUPLICATE_ELEM,true);
};
wFORMS.behaviors.repeat.isHandled=function(_af){
return _af.getAttribute(wFORMS.behaviors.repeat.ATTR_HANDLED);
};
wFORMS.behaviors.repeat.getMasterSection=function(_b0){
if(!wFORMS.behaviors.repeat.isDuplicate(_b0)){
return false;
}
var e=document.getElementById(_b0.getAttribute(wFORMS.behaviors.repeat.ATTR_MASTER_SECTION));
return e==""?null:e;
};
wFORMS.behaviors.repeat.handleElement=function(_b2){
return _b2.setAttribute(wFORMS.behaviors.repeat.ATTR_HANDLED,true);
};
wFORMS.behaviors.repeat.removeHandled=function(_b3){
return _b3.removeAttribute(wFORMS.behaviors.repeat.ATTR_HANDLED);
};
wFORMS.behaviors.repeat.instance.prototype.run=function(e,_b5){
this.duplicateSection(this.target);
if(e){
e.preventDefault();
}
};
if(typeof (wFORMS)=="undefined"){
throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
wFORMS.behaviors["switch"]={SELECTOR:"*[class*=\"switch-\"]",CSS_PREFIX:"switch-",CSS_OFFSTATE_PREFIX:"offstate-",CSS_ONSTATE_PREFIX:"onstate-",CSS_ONSTATE_FLAG:"swtchIsOn",CSS_OFFSTATE_FLAG:"swtchIsOff",onSwitchOn:function(_b6){
},onSwitchOff:function(_b7){
},onSwitch:function(_b8){
},instance:function(f){
this.behavior=wFORMS.behaviors["switch"];
this.target=f;
}};
wFORMS.behaviors["switch"].applyTo=function(f){
var b=new wFORMS.behaviors["switch"].instance(f);
f.querySelectorAll(wFORMS.behaviors["switch"].SELECTOR).forEach(function(_bc){
if(!_bc.id){
_bc.id=wFORMS.helpers.randomId();
}
switch(_bc.tagName.toUpperCase()){
case "OPTION":
var _bd=_bc.parentNode;
while(_bd&&_bd.tagName.toUpperCase()!="SELECT"){
_bd=_bd.parentNode;
}
base2.DOM.bind(_bd);
if(_bd&&!wFORMS.behaviors["switch"].isHandled(_bd)){
_bd.addEventListener("change",function(_be){
b.run(_be,_bd);
},false);
b.setupTargets(_bc);
wFORMS.behaviors["switch"].handleElement(_bd);
}
break;
case "INPUT":
if(_bc.type&&_bc.type.toUpperCase()=="RADIO"){
if(!wFORMS.behaviors["switch"].isHandled(_bc)){
b.setupTargets(_bc);
}
var _bf=_bc.form[_bc.name];
for(var i=_bf.length-1;i>=0;i--){
var _c1=base2.DOM.bind(_bf[i]);
if(!wFORMS.behaviors["switch"].isHandled(_c1)){
_c1.addEventListener("click",function(_c2){
b.run(_c2,_c1);
},false);
wFORMS.behaviors["switch"].handleElement(_c1);
}
}
}else{
_bc.addEventListener("click",function(_c3){
b.run(_c3,_bc);
},false);
b.setupTargets(_bc);
}
break;
default:
_bc.addEventListener("click",function(_c4){
b.run(_c4,_bc);
},false);
break;
}
});
b.onApply();
return b;
};
wFORMS.behaviors["switch"].instance.prototype.onApply=function(){
};
wFORMS.behaviors["switch"].isHandled=function(_c5){
return _c5.getAttribute("rel")&&_c5.getAttribute("rel").indexOf("wfHandled")>-1;
};
wFORMS.behaviors["switch"].handleElement=function(_c6){
return _c6.setAttribute("rel",(_c6.getAttribute("rel")||"")+" wfHandled");
};
wFORMS.behaviors["switch"].removeHandle=function(_c7){
if(attr=_c7.getAttribute("rel")){
if(attr=="wfHandled"){
_c7.removeAttribute("rel");
}else{
if(attr.indexOf("wfHandled")!=-1){
_c7.setAttribute("rel",attr.replace(/(.*)( wfHandled)(.*)/,"$1$3"));
}
}
}
};
wFORMS.behaviors["switch"].instance.prototype.getTriggersByElements=function(_c8,_c9){
var o={ON:new Array(),OFF:new Array(),toString:function(){
return "ON: "+this.ON+"\nOFF: "+this.OFF;
}};
for(var i=0;i<_c8.length;i++){
var _cc=_c8[i];
switch(_cc.tagName.toUpperCase()){
case "OPTION":
if(_cc.selected){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(_cc,_c9));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(_cc,_c9));
}
break;
case "SELECT":
for(var j=0;j<_cc.options.length;j++){
var opt=_cc.options.item(j);
if(opt.selected){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(opt,_c9));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(opt,_c9));
}
}
break;
case "INPUT":
if(_cc.type&&_cc.type.toUpperCase()=="RADIO"){
var _cf=_cc.form[_cc.name];
if(!_cf){
break;
}
for(var j=_cf.length-1;j>=0;j--){
var _d0=_cf[j];
if(_d0==_cc||!wFORMS.helpers.contains(_c8,_d0)){
if(_d0.checked){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(_d0,_c9));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(_d0,_c9));
}
}
}
}else{
if(_cc.checked){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(_cc,_c9));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(_cc,_c9));
}
}
break;
default:
if(_cc.hasClass(this.behavior.CSS_ONSTATE_FLAG)){
o.ON=o.ON.concat(this.behavior.getSwitchNamesFromTrigger(_cc,_c9));
}else{
o.OFF=o.OFF.concat(this.behavior.getSwitchNamesFromTrigger(_cc,_c9));
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
var _d2=new Array();
for(var i=0;i<o.OFF.length;i++){
if(!wFORMS.helpers.contains(_d2,o.OFF[i])){
_d2.push(o.OFF[i]);
}
}
o.ON=_ON;
o.OFF=_d2;
return o;
};
wFORMS.behaviors["switch"].getSwitchNamesFromTrigger=function(_d3,_d4){
return wFORMS.behaviors["switch"].getSwitchNames(_d3.className,"trigger",_d4);
};
wFORMS.behaviors["switch"].getSwitchNamesFromTarget=function(_d5,_d6){
return wFORMS.behaviors["switch"].getSwitchNames(_d5.className,"target",_d6);
};
wFORMS.behaviors["switch"].getSwitchNames=function(_d7,_d8,_d9){
if(!_d7||_d7==""){
return [];
}
var _da=_d7.split(" ");
var _db=new Array();
if(_d8=="trigger"){
var _dc=true;
}else{
var _dc=false;
}
for(var i=_da.length-1;i>=0;i--){
var cn=_da[i];
if(_dc){
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
if(sn&&(!_d9||wFORMS.helpers.contains(_d9,sn))){
_db.push(sn);
}
}
return _db;
};
wFORMS.behaviors["switch"].instance.prototype.getTargetsBySwitchName=function(_e0,_e1){
var res=new Array();
var _e3=this;
var b=wFORMS.behaviors.repeat;
if(arguments[1]=="ON"){
var _e5=[wFORMS.behaviors["switch"].CSS_ONSTATE_PREFIX+_e0];
}else{
var _e5=[wFORMS.behaviors["switch"].CSS_OFFSTATE_PREFIX+_e0];
}
this.target.querySelectorAll("."+_e5).forEach(function(_e6){
if(b&&b.isInDuplicateGroup(_e6)&&!(b.isDuplicate(_e3.target)||b.isInDuplicateGroup(_e3.target))){
return;
}
res.push(base2.DOM.bind(_e6));
});
return res;
};
wFORMS.behaviors["switch"].instance.prototype.getTriggersByTarget=function(_e7){
var res=new Array();
var _e9=this;
var _ea=wFORMS.behaviors["switch"].getSwitchNamesFromTarget(_e7);
var b=wFORMS.behaviors.repeat;
base2.forEach(_ea,function(_ec){
_e9.target.querySelectorAll("."+wFORMS.behaviors["switch"].CSS_PREFIX+_ec).forEach(function(_ed){
if(b&&b.isInDuplicateGroup(_ed)&&!(b.isDuplicate(_e7)||b.isInDuplicateGroup(_e7))){
return;
}
res.push(base2.DOM.bind(_ed));
});
});
return this.getTriggersByElements(res,_ea);
};
wFORMS.behaviors["switch"].instance.prototype.setupTargets=function(_ee){
this.run(null,_ee);
};
wFORMS.behaviors["switch"].isSwitchedOff=function(_ef){
return (_ef.className.match(new RegExp(wFORMS.behaviors["switch"].CSS_OFFSTATE_PREFIX+"[^ ]*"))?true:false)&&(_ef.className.match(new RegExp(wFORMS.behaviors["switch"].CSS_ONSTATE_PREFIX+"[^ ]*"))?false:true);
};
wFORMS.behaviors["switch"].instance.prototype.run=function(e,_f1){
if(!_f1.hasClass){
base2.DOM.bind(_f1);
}
if(_f1.hasClass(this.behavior.CSS_ONSTATE_FLAG)){
_f1.removeClass(this.behavior.CSS_ONSTATE_FLAG);
_f1.addClass(this.behavior.CSS_OFFSTATE_FLAG);
if(e){
e.preventDefault();
}
}else{
if(_f1.hasClass(this.behavior.CSS_OFFSTATE_FLAG)){
_f1.removeClass(this.behavior.CSS_OFFSTATE_FLAG);
_f1.addClass(this.behavior.CSS_ONSTATE_FLAG);
if(e){
e.preventDefault();
}
}
}
var _f2=this.getTriggersByElements(new Array(_f1));
var _f3=this;
base2.forEach(_f2.OFF,function(_f4){
var _f5=_f3.getTargetsBySwitchName(_f4,"ON");
base2.forEach(_f5,function(_f6){
var _f7=_f3.getTriggersByTarget(_f6);
if(_f7.ON.length==0){
_f6.addClass(wFORMS.behaviors["switch"].CSS_OFFSTATE_PREFIX+_f4);
_f6.removeClass(wFORMS.behaviors["switch"].CSS_ONSTATE_PREFIX+_f4);
_f3.behavior.onSwitchOff(_f6);
}
});
});
base2.forEach(_f2.ON,function(_f8){
var _f9=_f3.getTargetsBySwitchName(_f8,"OFF");
base2.forEach(_f9,function(_fa){
_fa.removeClass(wFORMS.behaviors["switch"].CSS_OFFSTATE_PREFIX+_f8);
_fa.addClass(wFORMS.behaviors["switch"].CSS_ONSTATE_PREFIX+_f8);
_f3.behavior.onSwitchOn(_fa);
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
wFORMS.behaviors.validation.instance.prototype.run=function(e,_106){
var _107=0;
this.elementsInError={};
for(var _108 in this.behavior.rules){
var rule=this.behavior.rules[_108];
var _10a=this;
if(!_106.querySelectorAll){
base2.DOM.bind(_106);
}
_106.querySelectorAll(rule.selector).forEach(function(_10b){
if(_10a.isSwitchedOff(_10b)){
return;
}
var _10c=wFORMS.helpers.getFieldValue(_10b);
if(rule.check.call){
var _10d=rule.check.call(_10a,_10b,_10c);
}else{
var _10d=_10a[rule.check].call(_10a,_10b,_10c);
}
if(!_10d){
if(!_10b.id){
_10b.id=wFORMS.helpers.randomId();
}
_10a.elementsInError[_10b.id]={id:_10b.id,rule:_108};
_10a.removeErrorMessage(_10b);
if(rule.fail){
rule.fail.call(_10a,_10b,_108);
}else{
_10a.fail.call(_10a,_10b,_108);
}
_107++;
}else{
if(!_10a.elementsInError[_10b.id]){
_10a.removeErrorMessage(_10b);
}
if(rule.pass){
rule.pass.call(_10a,_10b);
}else{
_10a.pass.call(_10a,_10b);
}
}
});
}
if(_107>0){
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
wFORMS.behaviors.validation.instance.prototype.fail=function(_10e,_10f){
_10e.addClass(this.behavior.styling.fieldError);
this.addErrorMessage(_10e,this.behavior.messages[_10f]);
},wFORMS.behaviors.validation.instance.prototype.pass=function(_110){
};
wFORMS.behaviors.validation.instance.prototype.addErrorMessage=function(_111,_112){
if(!_111.id){
_111.id=wFORMS.helpers.randomId();
}
var _113=document.createTextNode(_112);
var p=document.getElementById(_111.id+this.behavior.ERROR_PLACEHOLDER_SUFFIX);
if(!p){
p=document.createElement("div");
p.setAttribute("id",_111.id+this.behavior.ERROR_PLACEHOLDER_SUFFIX);
if(_111.tagName=="TR"){
p=(_111.getElementsByTagName("TD")[0]).appendChild(p);
}else{
p=_111.parentNode.insertBefore(p,_111.nextSibling);
}
}
p.appendChild(_113);
base2.DOM.bind(p);
p.addClass(this.behavior.styling.errorMessage);
};
wFORMS.behaviors.validation.instance.prototype.removeErrorMessage=function(_115){
if(!_115.hasClass){
base2.DOM.bind(_115);
}
if(_115.hasClass(this.behavior.styling.fieldError)){
_115.removeClass(this.behavior.styling.fieldError);
var _116=document.getElementById(_115.id+this.behavior.ERROR_PLACEHOLDER_SUFFIX);
if(_116){
_116.parentNode.removeChild(_116);
}
}
};
wFORMS.behaviors.validation.instance.prototype.isSwitchedOff=function(_117){
var sb=wFORMS.getBehaviorInstance(this.target,"switch");
if(sb){
var _119=_117;
while(_119&&_119.tagName!="BODY"){
if(_119.className&&_119.className.indexOf(sb.behavior.CSS_OFFSTATE_PREFIX)!=-1&&_119.className.indexOf(sb.behavior.CSS_ONSTATE_PREFIX)==-1){
return true;
}
_119=_119.parentNode;
}
}
return false;
};
wFORMS.behaviors.validation.isErrorPlaceholderId=function(id){
return id.match(new RegExp(wFORMS.behaviors.validation.ERROR_PLACEHOLDER_SUFFIX+"$"))!=null;
};
wFORMS.behaviors.validation.instance.prototype.isEmpty=function(s){
var _11c=/^\s+$/;
return ((s==null)||(s.length==0)||_11c.test(s));
};
wFORMS.behaviors.validation.instance.prototype.validateRequired=function(_11d,_11e){
switch(_11d.tagName){
case "INPUT":
var _11f=_11d.getAttribute("type");
if(!_11f){
_11f="text";
}
switch(_11f.toLowerCase()){
case "checkbox":
case "radio":
return _11d.checked;
break;
default:
return !this.isEmpty(_11e);
}
break;
case "SELECT":
return !this.isEmpty(_11e);
break;
case "TEXTAREA":
return !this.isEmpty(_11e);
break;
default:
return this.validateOneRequired(_11d);
break;
}
return false;
};
wFORMS.behaviors.validation.instance.prototype.validateOneRequired=function(_120){
if(_120.nodeType!=1){
return false;
}
if(this.isSwitchedOff(_120)){
return false;
}
switch(_120.tagName){
case "INPUT":
var _121=_120.getAttribute("type");
if(!_121){
_121="text";
}
switch(_121.toLowerCase()){
case "checkbox":
case "radio":
return _120.checked;
break;
default:
return !this.isEmpty(wFORMS.helpers.getFieldValue(_120));
}
break;
case "SELECT":
return !this.isEmpty(wFORMS.helpers.getFieldValue(_120));
break;
case "TEXTAREA":
return !this.isEmpty(wFORMS.helpers.getFieldValue(_120));
break;
default:
for(var i=0;i<_120.childNodes.length;i++){
if(this.validateOneRequired(_120.childNodes[i])){
return true;
}
}
break;
}
return false;
};
wFORMS.behaviors.validation.instance.prototype.validateAlpha=function(_123,_124){
var _125=/^[a-zA-Z\s]+$/;
return this.isEmpty(_124)||_125.test(_124);
};
wFORMS.behaviors.validation.instance.prototype.validateAlphanum=function(_126,_127){
var _128=/^[\w\s]+$/;
return this.isEmpty(_127)||_128.test(_127);
};
wFORMS.behaviors.validation.instance.prototype.validateDate=function(_129,_12a){
var _12b=new Date(_12a);
return this.isEmpty(_12a)||!isNaN(_12b);
};
wFORMS.behaviors.validation.instance.prototype.validateTime=function(_12c,_12d){
return true;
};
wFORMS.behaviors.validation.instance.prototype.validateEmail=function(_12e,_12f){
var _130=/\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/;
return this.isEmpty(_12f)||_130.test(_12f);
};
wFORMS.behaviors.validation.instance.prototype.validateInteger=function(_131,_132){
var _133=/^[+]?\d+$/;
return this.isEmpty(_132)||_133.test(_132);
};
wFORMS.behaviors.validation.instance.prototype.validateFloat=function(_134,_135){
return this.isEmpty(_135)||!isNaN(parseFloat(_135));
};
wFORMS.behaviors.validation.instance.prototype.validateCustom=function(_136,_137){
var _138=new RegExp("/(.*)/([gi]*)");
var _139=_136.className.match(_138);
if(_139&&_139[0]){
var _13a=new RegExp(_139[1],_139[2]);
if(!_137.match(_13a)){
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
var _13f=elem.className.substr(elem.className.indexOf("formula=")+8).split(" ")[0];
var _140=_13f.split(/[^a-zA-Z]+/g);
b.varFields=[];
for(var i=0;i<_140.length;i++){
if(_140[i]!=""){
f.querySelectorAll("*[class*=\""+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+_140[i]+"\"]").forEach(function(_142){
var _143=((" "+_142.className+" ").indexOf(" "+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+_140[i]+" ")!=-1);
if(!_143){
return;
}
switch(_142.tagName+":"+_142.getAttribute("type")){
case "INPUT:":
case "INPUT:null":
case "INPUT:text":
case "INPUT:hidden":
case "INPUT:password":
case "TEXTAREA:null":
if(!_142._wforms_calc_handled){
_142.addEventListener("blur",function(e){
return b.run(e,this);
},false);
_142._wforms_calc_handled=true;
}
break;
case "INPUT:radio":
case "INPUT:checkbox":
if(!_142._wforms_calc_handled){
_142.addEventListener("click",function(e){
return b.run(e,this);
},false);
_142._wforms_calc_handled=true;
}
break;
case "SELECT:null":
if(!_142._wforms_calc_handled){
_142.addEventListener("change",function(e){
return b.run(e,this);
},false);
_142._wforms_calc_handled=true;
}
break;
default:
return;
break;
}
b.varFields.push({name:_140[i],field:_142});
});
}
}
var calc={field:elem,formula:_13f,variables:b.varFields};
b.calculations.push(calc);
b.compute(calc);
});
b.onApply();
return b;
};
wFORMS.behaviors.calculation.instance.prototype.onApply=function(){
};
wFORMS.behaviors.calculation.instance.prototype.run=function(_148,_149){
for(var i=0;i<this.calculations.length;i++){
var calc=this.calculations[i];
for(var j=0;j<calc.variables.length;j++){
if(_149==calc.variables[j].field){
this.compute(calc);
}
}
}
};
wFORMS.behaviors.calculation.instance.prototype.compute=function(_14d){
var f=this.target;
var _14f=_14d.formula;
var _150=new Array();
for(var i=0;i<_14d.variables.length;i++){
var v=_14d.variables[i];
var _153=0;
var _154=this;
if(wFORMS.helpers.contains(_150,v.name)){
continue;
}else{
_150.push(v.name);
}
f.querySelectorAll("*[class*=\""+_154.behavior.VARIABLE_SELECTOR_PREFIX+v.name+"\"]").forEach(function(f){
var _156=((" "+f.className+" ").indexOf(" "+wFORMS.behaviors.calculation.VARIABLE_SELECTOR_PREFIX+v.name+" ")!=-1);
if(!_156){
return;
}
if(_154.hasValueInClassName(f)){
var _157=_154.getValueFromClassName(f);
}else{
var _157=wFORMS.helpers.getFieldValue(f);
}
if(!_157){
_157=0;
}
if(_157.constructor.toString().indexOf("Array")!==-1){
for(var j=0;j<_157.length;j++){
_153+=parseFloat(_157[j]);
}
}else{
_153+=parseFloat(_157);
}
});
var rgx=new RegExp("([^a-z])("+v.name+")([^a-z])","gi");
while((" "+_14f+" ").match(rgx)){
_14f=(" "+_14f+" ").replace(rgx,"$1"+_153+"$3");
}
}
try{
var _15a=eval(_14f);
if(_15a=="Infinity"||_15a=="NaN"||isNaN(_15a)){
_15a="error";
}
}
catch(x){
_15a="error";
console.log(_14d.formula,_14f);
}
var _15b=wFORMS.getBehaviorInstance(this.target,"validation");
if(_15b){
if(!wFORMS.behaviors.validation.messages["calculation"]){
wFORMS.behaviors.validation.messages["calculation"]=this.behavior.CALCULATION_ERROR_MESSAGE;
}
_15b.removeErrorMessage(_14d.field);
if(_15a=="error"){
_15b.fail(_14d.field,"calculation");
}
}
_14d.field.value=_15a;
if(_14d.field.className&&(_14d.field.className.indexOf(this.behavior.VARIABLE_SELECTOR_PREFIX)!=-1)){
this.run(null,_14d.field);
}
};
wFORMS.behaviors.calculation.instance.prototype.hasValueInClassName=function(_15c){
switch(_15c.tagName){
case "SELECT":
for(var i=0;i<_15c.options.length;i++){
if(_15c.options[i].className&&_15c.options[i].className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)!=-1){
return true;
}
}
return false;
break;
default:
if(!_15c.className||(" "+_15c.className).indexOf(" "+this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)==-1){
return false;
}
break;
}
return true;
};
wFORMS.behaviors.calculation.instance.prototype.getValueFromClassName=function(_15e){
switch(_15e.tagName){
case "INPUT":
if(!_15e.className||_15e.className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)==-1){
return null;
}
var _15f=_15e.className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(" ")[0];
if(_15e.type=="checkbox"){
return _15e.checked?_15f:null;
}
if(_15e.type=="radio"){
return _15e.checked?_15f:null;
}
return _15f;
break;
case "SELECT":
if(_15e.selectedIndex==-1){
return null;
}
if(_15e.getAttribute("multiple")){
var v=[];
for(var i=0;i<_15e.options.length;i++){
if(_15e.options[i].selected){
if(_15e.options[i].className&&_15e.options[i].className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)!=-1){
var _15f=_15e.options[i].className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(" ")[0];
v.push(_15f);
}
}
}
if(v.length==0){
return null;
}
return v;
}
if(_15e.options[_15e.selectedIndex].className&&_15e.options[_15e.selectedIndex].className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)!=-1){
var _15f=_15e.options[_15e.selectedIndex].className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(" ")[0];
return _15f;
}
break;
case "TEXTAREA":
if(!_15e.className||_15e.className.indexOf(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)==-1){
return null;
}
var _15f=_15e.className.split(this.behavior.CHOICE_VALUE_SELECTOR_PREFIX)[1].split(" ")[0];
return _15f;
break;
default:
return null;
break;
}
return null;
};

