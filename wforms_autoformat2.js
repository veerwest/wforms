/**
 * Created by IntelliJ IDEA.
 * User: anch
 * Date: 8/26/11
 * Time: 12:07 PM
 */

if (typeof(wFORMS) == "undefined") {
	throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}


wFORMS.behaviors.autoformat = {

    ATTRIBUTE_SELECTOR: 'autoformat',
    ALLOWED_ELEMENT_TYPE: ['input[type="text"]', 'textarea'],
    DELETED_PLACE_HOLDER : '_',

    //lazy load constant
    ACTORS_SELECTOR : null,

    PARSER : null,

    charSet : {
        'D' : '#',
        'T' : '$'
    },

    keyCode:{
        'D': [{keyCodeStart:48, keyCodeEnd: 57, asciiStart:48}],//Digits

        'T': [{keyCodeStart:48, keyCodeEnd: 57, asciiStart:48}, //Digits
              {keyCodeStart:97, keyCodeEnd: 122, asciiStart:97}, //Small letters
              {keyCodeStart:65, keyCodeEnd: 90, asciiStart:65}], //Capital letters,
        'LEFT' : 37,
        'RIGHT' : 39,
        'END': 35,
        'HOME': 36,
        'DELETE': 46
    },

    _globalCache: {

    },

    InfoEntry: function(elem){
        this.element = elem;
        this.template = this.interpretRule(elem);
        this.templateFragments = [];
        this.buildTemplateFragmentList();
        this.promptLayer = null;
        this.inputCache = [];
    },

    TemplateEntry: function(order, type, value){
        this.order = order;
        this.type = type;
        this.value = value;
        this.templateFragment = null;
        this.fragmentOrder = 0;
    },

    TemplateFragment : function(order){
        this.order = order;
        this.characters = [];
        this.entries = [];
    },

    InputEntry: function(){

    },

    instance: function(f){
        this.actorsInDomain = [];
    },

    applyTo: function(f) {

        var elements = base2.DOM.Element.querySelectorAll(f, wFORMS.behaviors.autoformat._getActorsSelector());
        var IDGroups = [];
        elements.forEach(function(element){
            var id = wFORMS.behaviors.autoformat._getIDForActorElement(element);
            //add to group
            IDGroups.push(id);

            //build global mapping
            var infoEntry = new wFORMS.behaviors.autoformat.InfoEntry(element);
            wFORMS.behaviors.autoformat._globalCache[id] = infoEntry;

            //bind event to element
            wFORMS.behaviors.autoformat._bindEventToElement(element);
            infoEntry.promptLayer = wFORMS.behaviors.autoformat._attachGhostPromptLayer(element);
        });
        var instance = new wFORMS.behaviors.autoformat.instance(f);
        //add IDGroups to instance
        instance.actorsInDomain = IDGroups; // then later the detail InFoEntry can be retrieved by using ID and searching from globalCache

        return instance;
    },

    getCaretPosition: function(element){
        var cursurPosition=-1;
        if(element.selectionStart >=0 ){
            cursurPosition= element.selectionStart;
        }else{//IE
            var range = document.selection.createRange();
            range.moveStart("character", -element.value.length);
            cursurPosition = range.text.length;
        }
        return cursurPosition;
    },

    setCaretPosition: function(caret, pos){

        if(caret.setSelectionRange)
        {
            caret.focus();
            caret.setSelectionRange(pos,pos);
        }
        else if (caret.createTextRange) {
            var range = caret.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    },

    // private methods
    _getActorsSelector: function(){
        if(!wFORMS.behaviors.autoformat.ACTORS_SELECTOR){
            var temp = '';
            for(var i = 0; i < wFORMS.behaviors.autoformat.ALLOWED_ELEMENT_TYPE.length; i++){
                temp += wFORMS.behaviors.autoformat.ALLOWED_ELEMENT_TYPE[i] + '[' +  wFORMS.behaviors.autoformat.ATTRIBUTE_SELECTOR + '], ';
            }
            wFORMS.behaviors.autoformat.ACTORS_SELECTOR = temp.slice(0, -2);
        }
        return wFORMS.behaviors.autoformat.ACTORS_SELECTOR;
    },

    _getIDForActorElement: function(element){
        var id = element.id;
        if(id === ''){
            while(true){
                var tempId = wFORMS.helpers.randomId();
                if(document.getElementById(tempId)!=null){
                    continue;
                }
                element.id = tempId;
                break;
            }
        }

        return element.id;
    },

    _getParser: function(){
        if(wFORMS.behaviors.autoformat.PARSER == null){
            wFORMS.behaviors.autoformat.PARSER = eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('(9(){3 C={1u:9(r,t){3 u={"15":S,"17":M,"N":U,"V":W,"18":O,"19":P,"1a":X,"1b":Y};6(t!==1c){6(u[t]===1c){1d 1e 1f("1v 1w 1g: "+Z(t)+".");}}8{t="V"}3 v=0;3 w=1h;3 x=0;3 y=[];3 z={};9 1i(a,b,c){3 d=a;3 e=c-a.G;10(3 i=0;i<e;i++){d=b+d}7 d}9 N(a){3 b=a.1x(0);6(b<=1y){3 c=\'x\';3 d=2}8{3 c=\'u\';3 d=4}7\'\\\\\'+c+1i(b.1z(16).1A(),\'0\',d)}9 Z(s){7\'"\'+s.J(/\\\\/g,\'\\\\\\\\\').J(/"/g,\'\\\\"\').J(/\\r/g,\'\\\\r\').J(/\\n/g,\'\\\\n\').J(/[\\1B-\\1C]/g,N)+\'"\'}9 H(a){6(v<x){7}6(v>x){x=v;y=[]}y.1j(a)}9 W(){3 c=\'V@\'+v;3 d=z[c];6(d){v=d.E;7 d.F}3 e=v;3 f=v;3 g=M();6(g!==5){3 h=W();6(h!==5){3 i=[g,h]}8{3 i=5;v=f}}8{3 i=5;v=f}3 j=i!==5?(9(a,b){7 a.1k(b)})(i[0],i[1]):5;6(j!==5){3 k=j}8{3 k=5;v=e}6(k!==5){3 l=k}8{3 m=M();6(m!==5){3 l=m}8{3 l=5}}z[c]={E:v,F:l};7 l}9 M(){3 a=\'17@\'+v;3 b=z[a];6(b){v=b.E;7 b.F}3 c=O();6(c!==5){3 d=c}8{3 e=Y();6(e!==5){3 d=e}8{3 f=X();6(f!==5){3 d=f}8{3 d=5}}}z[a]={E:v,F:d};7 d}9 Y(){3 a=\'1b@\'+v;3 b=z[a];6(b){v=b.E;7 b.F}3 c=v;6(r.K(v,1)==="$"){3 d="$";v+=1}8{3 d=5;6(w){H("\\"$\\"")}}3 e=d!==5?(9(){7[{Q:\'T\'}]})():5;6(e!==5){3 f=e}8{3 f=5;v=c}z[a]={E:v,F:f};7 f}9 O(){3 c=\'18@\'+v;3 d=z[c];6(d){v=d.E;7 d.F}3 e=v;3 f=v;3 g=P();6(g!==5){3 h=O();6(h!==5){3 i=[g,h]}8{3 i=5;v=f}}8{3 i=5;v=f}3 j=i!==5?(9(a,b){7[{Q:\'L\',1l:a}].1k(b)})(i[0],i[1]):5;6(j!==5){3 k=j}8{3 k=5;v=e}6(k!==5){3 m=k}8{3 n=v;3 o=P();3 p=o!==5?(9(l){7[{Q:\'L\',1l:l}]})(o):5;6(p!==5){3 q=p}8{3 q=5;v=n}6(q!==5){3 m=q}8{3 m=5}}z[c]={E:v,F:m};7 m}9 P(){3 a=\'19@\'+v;3 b=z[a];6(b){v=b.E;7 b.F}3 c=U();6(c!==5){3 d=c}8{3 e=S();6(e!==5){3 d=e}8{3 d=5}}z[a]={E:v,F:d};7 d}9 S(){3 a=\'15@\'+v;3 b=z[a];6(b){v=b.E;7 b.F}6(r.K(v).1D(/^[^$#]/)!==5){3 c=r.11(v);v++}8{3 c=5;6(w){H("[^$#]")}}z[a]={E:v,F:c};7 c}9 X(){3 a=\'1a@\'+v;3 b=z[a];6(b){v=b.E;7 b.F}3 c=v;6(r.K(v,1)==="#"){3 d="#";v+=1}8{3 d=5;6(w){H("\\"#\\"")}}3 e=d!==5?(9(){7[{Q:\'D\'}]})():5;6(e!==5){3 f=e}8{3 f=5;v=c}z[a]={E:v,F:f};7 f}9 U(){3 a=\'N@\'+v;3 b=z[a];6(b){v=b.E;7 b.F}3 c=v;6(r.K(v,2)==="%$"){3 d="%$";v+=2}8{3 d=5;6(w){H("\\"%$\\"")}}3 e=d!==5?(9(){7\'$\'})():5;6(e!==5){3 f=e}8{3 f=5;v=c}6(f!==5){3 g=f}8{3 h=v;6(r.K(v,2)==="%#"){3 i="%#";v+=2}8{3 i=5;6(w){H("\\"%#\\"")}}3 j=i!==5?(9(){7\'#\'})():5;6(j!==5){3 k=j}8{3 k=5;v=h}6(k!==5){3 g=k}8{3 g=5}}z[a]={E:v,F:g};7 g}9 1m(){9 1n(a){a.1E();3 b=5;3 c=[];10(3 i=0;i<a.G;i++){6(a[i]!==b){c.1j(a[i]);b=a[i]}}1F(c.G){1o 0:7\'1p 1q 1r\';1o 1:7 c[0];1G:7 c.1H(0,c.G-1).1I(\', \')+\' 1J \'+c[c.G-1]}}3 d=1n(y);3 e=1K.1L(v,x);3 f=e<r.G?Z(r.11(e)):\'1p 1q 1r\';7\'1M \'+d+\' 1N \'+f+\' 1O.\'}9 1s(){3 a=1;3 b=1;3 c=12;10(3 i=0;i<x;i++){3 d=r.11(i);6(d===\'\\n\'){6(!c){a++}b=1;c=12}8 6(d===\'\\r\'|d===\'\\1P\'||d===\'\\1Q\'){a++;b=1;c=1h}8{b++;c=12}}7{13:a,14:b}}3 A=u[t]();6(A===5||v!==r.G){3 B=1s();1d 1e I.R(1m(),B.13,B.14);}7 A},1R:9(){7 I.1S}};C.R=9(a,b,c){I.1g=\'R\';I.1T=a;I.13=b;I.14=c};C.R.1t=1f.1t;7 C})()',62,118,'|||var||null|if|return|else|function|||||||||||||||||||||||||||||||nextPos|result|length|matchFailed|this|replace|substr||parse_entity|escape|parse_literal|parse_literalchar|type|SyntaxError|parse_char||parse_escape|exp|parse_exp|parse_number|parse_text|quote|for|charAt|false|line|column|char||entity|literal|literalchar|number|text|undefined|throw|new|Error|name|true|padLeft|push|concat|value|buildErrorMessage|buildExpected|case|end|of|input|computeErrorPosition|prototype|parse|Invalid|rule|charCodeAt|0xFF|toString|toUpperCase|x80|uFFFF|match|sort|switch|default|slice|join|or|Math|max|Expected|but|found|u2028|u2029|toSource|_source|message'.split('|'),0,{}));
        }
        return wFORMS.behaviors.autoformat.PARSER;
    },

    _bindEventToElement: function(element){
        wFORMS.standardizeElement(element);

        element.addEventListener('keypress', function(event){
            var id = this.id;
            var infoEntry = wFORMS.behaviors.autoformat._globalCache[id];
            if(!infoEntry){
                return ;
            }
            event.preventDefault();
            var result = infoEntry.handleTyping(event);
        }, true);

        element.addEventListener('keydown', function(event){
            var id = this.id;
            var infoEntry = wFORMS.behaviors.autoformat._globalCache[id];
            if(!infoEntry){
                return ;
            }
            var handled = infoEntry.handleControlKey(event);
            //TODO disable other functional keys
            if(handled){
                event.preventDefault();
            }
        }, true);

        for(var i = 0 ; i < 4 ; i++){
            element.addEventListener(['drop', 'paste', 'drag', 'copy'][i], function(event){
                return false;
            }, true);
        }
        element.setAttribute('autocomplete', 'off');
        element.style.imeMode = 'disabled';

        //auto skip caret position
        element.addEventListener('click', function(){
            var id = this.id;
            var infoEntry = wFORMS.behaviors.autoformat._globalCache[id];
            if(!infoEntry){
                return ;
            }
            infoEntry.skipLabelSpan();
        });

        //handle input mask display/hide
        element.addEventListener('focus', function(){
            var id = this.id;
            var infoEntry = wFORMS.behaviors.autoformat._globalCache[id];
            if(!infoEntry){
                return ;
            }
            infoEntry.showPrompt();
        });

        //handle input mask display/hide
        element.addEventListener('blur', function(){
            var id = this.id;
            var infoEntry = wFORMS.behaviors.autoformat._globalCache[id];
            if(!infoEntry){
                return ;
            }
            infoEntry.hidePrompt();
        });
    },

    _attachGhostPromptLayer : function(element){
        var newDiv = document.createElement('div');
        element.parentNode.insertBefore(newDiv, element.nextSibling);
        newDiv.innerHTML = "Show something";
        newDiv.style.position = 'absolute';
        newDiv.style.left = element.offsetLeft + 'px';
        newDiv.style.top = (element.offsetTop + element.offsetHeight + 2) + 'px';
        newDiv.style.display = 'none';
        newDiv.className = 'autoformatprompt';


        return newDiv;
    }

};

wFORMS.behaviors.autoformat.instance.prototype.onApply = function() {

};

wFORMS.behaviors.autoformat.instance.prototype.run = function(){

};

wFORMS.behaviors.autoformat.InfoEntry.prototype.interpretRule = function(element){
    var attributeValue = element.getAttribute(wFORMS.behaviors.autoformat.ATTRIBUTE_SELECTOR);
    var parser = wFORMS.behaviors.autoformat._getParser();
    var template = parser.parse(attributeValue), result = [];
    for(var i = 0 ; i < template.length; i++){  // add sequence info
        result.push(new wFORMS.behaviors.autoformat.TemplateEntry(i, template[i].type, template[i].value));
    }
    return result;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.buildTemplateFragmentList = function(){
    var j = 0, order = 0, fragment, templateEntry = null;
    for (var i = 0 ; i < this.template.length; i++){
        if( this.template[i] != 'L' || templateEntry == null || (templateEntry.type != 'L' && this.template[i] == 'L') ){
            fragment = new  wFORMS.behaviors.autoformat.TemplateFragment(j);
            this.templateFragments.push(fragment);
            order = 0;
        }
        templateEntry = this.template[i];
        templateEntry.setTemplateFragment(fragment);
        templateEntry.setTemplateFragmentOrder(order++);
        fragment.addEntry(templateEntry);
    }
};

/**
 * Event Handler for Keydown event. Keydown event is able to capture functional key event, such as arrow keys, while 'keypress' is not.
 * @param event
 * return true: functional keys are detected and handled. false:  no functional keys are pressed.
 */
wFORMS.behaviors.autoformat.InfoEntry.prototype.handleControlKey = function(event){
    if(this.testSpecialKey(event)){
        return false;
    }
    //handle control input
    var result = this.handleFunctionalKey(event);

    return result.handled;
};

/**
 * Event Handler for Keypress event, 'keypress' event is able to differentiate letter cases (Capital or Small), while 'keydown' is not.
 * @param event
 * return true: the data cache is changed. false:  the data cache isn't altered
 */
wFORMS.behaviors.autoformat.InfoEntry.prototype.handleTyping = function(event){

    var cur = wFORMS.behaviors.autoformat.getCaretPosition(this.element), nextInputPoint;
    var templateEntry = this.getSymbolPosition(cur);

    if(templateEntry.type == 'L'){
        if(templateEntry.fragmentOrder == 0){ // if caret is at the front boundary of fixed text fragment.
            //then prefilling (auto-complete) fixed text fragment
            nextInputPoint = this.prefill(cur);
        }
        //try to match a fixed text from current cur position

//        templateEntry = this.getSymbolPosition(cur);
    }

    if(templateEntry.type == 'EOF'){
        return false;
    }

    //handle typing input
    var isUpdated = this.keyCodeCheck(templateEntry, event);
    if(isUpdated){
        cur = this.autoFill(cur);
    }

    return false;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.testSpecialKey = function(event){
//    return event.altKey || event.shiftKey || event.ctrlKey || event.metaKey;
    return event.altKey || event.ctrlKey || event.metaKey;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.getSymbolPosition = function(caret){

    var dataLength = this.inputCache.length;
    if(caret > dataLength){
       caret = dataLength;
    }
    var templateLength = this.template.length;
    if(caret >= templateLength){
        return {type: 'EOF', order: templateLength};
    }
    return this.template[caret];
};

/**
 *
 * @param templateEntry
 * @param event
 * return true: legal input; false: illegal input
 */

wFORMS.behaviors.autoformat.InfoEntry.prototype.keyCodeCheck = function(templateEntry, event){
    //test template type match
    var acceptedInputType = ['D', 'T'], match = false, i;
    for(i = 0 ; i < 2; i++){
        if(templateEntry.type == acceptedInputType[i]){
            match = true;
            break;
        }
    }
    if (!match) return false;

    //test keyCode falls in range
    var keyCodeMeta = wFORMS.behaviors.autoformat.keyCode[templateEntry.type];
    var keyCode = event.which || event.keyCode, character = null, range = null;
    for(i = 0 ; i < keyCodeMeta.length; i++){// enumerate ranges
        range = keyCodeMeta[i];
        if(keyCode >= range.keyCodeStart && keyCode <= range.keyCodeEnd){
            //calculate character
            character = String.fromCharCode(range.asciiStart + keyCode - range.keyCodeStart);
            break;
        }
    }
    if(!character){
        return false;  // not fall in range
    }

    //create entry in input cache
    var position = templateEntry.order;
    this.inputCache[position] = {type: 'I', value: character};

    return true;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.displayCache = function(){
    var output = '';
    for(var i = 0; i < this.inputCache.length; i++){
        output += this.inputCache[i].value;
    }

    //TODO deal with textarea
    this.element.value = output;

    this.updatePatternPrompt();
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.prefill = function(caretPos){
     while(true){
        var templateEntry = this.template[caretPos];
        if( templateEntry == undefined || templateEntry.type != 'L' ){
            break;
        }
        var position = templateEntry.order;
        this.inputCache[position] = {type: 'L', value: templateEntry.value};

        caretPos++;
    }

    return caretPos;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.autoFill = function(caretPos){

    while(true){
        caretPos++;
        var templateEntry = this.template[caretPos];
        if( templateEntry == undefined || templateEntry.type != 'L' ){
            break;
        }
        var position = templateEntry.order;
        this.inputCache[position] = {type: 'L', value: templateEntry.value};
    }
    this.displayCache();

    wFORMS.behaviors.autoformat.setCaretPosition(this.element, caretPos);

    return caretPos;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.skipLabelSpan = function(){
    var cur = wFORMS.behaviors.autoformat.getCaretPosition(this.element);
    while(true){
        var templateEntry = this.template[cur];
        if( templateEntry == undefined || templateEntry.type != 'L' ){
            break;
        }
        cur++;
    }
    wFORMS.behaviors.autoformat.setCaretPosition(this.element, cur);
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.handleFunctionalKey = function(event){
    var keyCode = event.which || event.keyCode;
    var cur = wFORMS.behaviors.autoformat.getCaretPosition(this.element);
    var actionMapping = [['LEFT', 'handleLeftMovement'], ['RIGHT', 'handleRightMovement'], ['HOME', 'handleHome'],
        ['END', 'handleEnd'], ['DELETE', 'handleDelete'],  ['BACKSPACE', 'handleBackspace']];

    for(var i = 0 ; i < actionMapping.length; i++){
        var entry = actionMapping[i];
        if(keyCode == wFORMS.behaviors.autoformat.keyCode[entry[0]]){
            return {handled: true, cursor: this[entry[1]](event, cur)};
        }
    }

    return {handled:false, cursor: cur};
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.handleLeftMovement = function(event, cursorPosition){
    var templateEntry;

    if (cursorPosition == 0){ //already leftmost
        return 0;
    }

    while(cursorPosition!=0){
        cursorPosition--;    //move left until reach the first non-stationary input entry
        templateEntry = this.template[cursorPosition];
        if( templateEntry.type != 'L' ){
            break;
        }
    }
    var inputCacheLength = this.inputCache.length;
    if(cursorPosition == 0){ // if first entry is stationary entry, skip to the following non-stationary entry
        while(cursorPosition < inputCacheLength){
            templateEntry = this.template[cursorPosition];
            if( templateEntry.type != 'L' ){
                break;
            }
            cursorPosition ++;
        }
    }

    wFORMS.behaviors.autoformat.setCaretPosition(this.element, cursorPosition);

    return cursorPosition;

};
wFORMS.behaviors.autoformat.InfoEntry.prototype.handleRightMovement = function(event, cursorPosition){
    var templateEntry;
    var rightMostBoundary = this.inputCache.length;

    if (cursorPosition >= rightMostBoundary){ //already rightmost
        return rightMostBoundary;
    }

    while(cursorPosition< rightMostBoundary){
        cursorPosition++;    //move right until reach the first non-stationary input entry
        templateEntry = this.template[cursorPosition];
        if( templateEntry ==undefined || templateEntry.type != 'L' ){
            break;
        }
    }

    while(cursorPosition < this.template.length){  // fill and skip the stationary symbols
        templateEntry = this.template[cursorPosition];
        if( templateEntry.type != 'L' ){
            break;
        }
        cursorPosition++;
        var position = templateEntry.order;
        this.inputCache[position] = {type: 'L', value: templateEntry.value};
    }

    wFORMS.behaviors.autoformat.setCaretPosition(this.element, cursorPosition);

    return cursorPosition;

};
wFORMS.behaviors.autoformat.InfoEntry.prototype.handleHome = function(event, cursorPosition){
    cursorPosition = 0;

    var inputCacheLength = this.inputCache.length;
    while(cursorPosition < inputCacheLength){
        var templateEntry = this.template[cursorPosition];
        if( templateEntry.type != 'L' ){
            break;
        }
        cursorPosition ++;
    }

    wFORMS.behaviors.autoformat.setCaretPosition(this.element, cursorPosition);

    return cursorPosition;

};
wFORMS.behaviors.autoformat.InfoEntry.prototype.handleEnd = function(event, cursorPosition){
    var inputCacheLength = this.inputCache.length;
    cursorPosition = inputCacheLength;
    while(cursorPosition < this.template.length){  // fill and skip the stationary symbols
        templateEntry = this.template[cursorPosition];
        if( templateEntry.type != 'L' ){
            break;
        }
        cursorPosition++;
        var position = templateEntry.order;
        this.inputCache[position] = {type: 'L', value: templateEntry.value};
    }

    wFORMS.behaviors.autoformat.setCaretPosition(this.element, cursorPosition);
    return cursorPosition;
};
wFORMS.behaviors.autoformat.InfoEntry.prototype.handleDelete = function(event, cursorPosition){
    var inputLength = this.inputCache.length;

    if(cursorPosition == this.getInputEnding() ){ // already at the end, do nothing
        return cursorPosition;
    }

    //test if the caret is before the last character
    if(cursorPosition == inputLength - 1){
        this.inputCache.splice(cursorPosition, 1);
    }else{
        //delete a character in the middle
        this.inputCache[cursorPosition] = {type: 'D', value: wFORMS.behaviors.autoformat.DELETED_PLACE_HOLDER};
        cursorPosition = this.advanceOneCursorPosition(cursorPosition);
    }
    cursorPosition = this.deleteTrailingPlaceholders(cursorPosition);

    this.displayCache();
    wFORMS.behaviors.autoformat.setCaretPosition(this.element, cursorPosition);

    return cursorPosition;
};
wFORMS.behaviors.autoformat.InfoEntry.prototype.handleBackspace = function(event, cursorPosition){
    var inputLength = this.inputCache.length;

    if(cursorPosition == this.getInputBeginning()){
        return cursorPosition;
    }

    //test if the caret is after the last character
    if(cursorPosition == this.getInputEnding()){
        this.inputCache.splice(cursorPosition, 1);
    }
};
wFORMS.behaviors.autoformat.InfoEntry.prototype.deleteTrailingPlaceholders = function(cursorPosition){

    var lookBefore = function(position, inputCache){
        for(var i = position; i >=0 ;i--){
            var inputEntry = inputCache[i];
            if(inputEntry.type == 'L'){
                continue;
            }

            if(inputEntry.type == 'D'){
                return i;
            }
            return position;
        }
    };

    var i;
    for( i = this.inputCache.length - 1; i >=0;){
        var inputEntry = this.inputCache[i];
        if(inputEntry.type == 'D'){
            i--;
            continue;
        }
        if(inputEntry.type == 'L'){
            var position = lookBefore(i, this.inputCache);
            if(position == i ){
                break;
            }
            i = position - 1;
        }
        if(inputEntry.type == 'I'){
            break;
        }
    }

    if(i < this.inputCache.length - 1){
        this.inputCache.splice(i+1, this.inputCache.length - i );
        cursorPosition = this.inputCache.length;
    }

    return cursorPosition;
};
wFORMS.behaviors.autoformat.InfoEntry.prototype.advanceOneCursorPosition = function(cursorPosition){
    cursorPosition++;
    var inputEntry = this.inputCache[cursorPosition];

    if(inputEntry.type == 'I' || inputEntry.type == 'D' ){
        return cursorPosition;
    }

    var i;
    if(inputEntry.type == 'L'){
        for(i = cursorPosition + 1; i <= this.inputCache.length; i++){
            inputEntry = this.inputCache[i];
            if(inputEntry == undefined || inputEntry.type != 'L'){
                break;
            }
        }
    }
    return i;

};
wFORMS.behaviors.autoformat.InfoEntry.prototype.getPreviousCaretPosition = function(cursorPosition){
    return this.inputCache.length - 1;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.updatePatternPrompt = function(){
    var output = '';

    for(var i = 0; i < this.template.length; i ++){
        var templateEntry = this.template[i];
        var symbol = templateEntry.type == 'L' ? templateEntry.value : wFORMS.behaviors.autoformat.charSet[templateEntry.type];
        var style = 'noinput';
        var inputEntry = this.inputCache[i];
        if(inputEntry != undefined){ // this position is not input yet
            style = inputEntry.type == 'I' ? 'input' :
                inputEntry.type == 'D' ? 'delete' : 'label'
        }
        output += '<span class="' + style + '">' + symbol + '</span>';
    }
    this.promptLayer.innerHTML = output;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.showPrompt = function(){
    var div = this.promptLayer;
    div.style.display = 'block';
    this.updatePatternPrompt();
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.hidePrompt = function(){
    var div = this.promptLayer;
    div.style.display = 'none';
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.getInputBeginning = function(){
    return 0;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.getInputEnding = function(){
    return this.inputCache.length;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.getInputCacheFragments = function(){
    var inputLength = this.inputCache.length;
    for(var i = 0; i < inputLength; i++)  {

    }
};

//=============== TemplateEntry methods =============== //

wFORMS.behaviors.autoformat.TemplateEntry.prototype.setTemplateFragmentOrder = function(order){
   this.fragmentOrder = order;
};

wFORMS.behaviors.autoformat.TemplateEntry.prototype.setTemplateFragment = function(templateFragment){
   this.templateFragment = templateFragment;
};

//=============== TemplateFragment methods =============== //

wFORMS.behaviors.autoformat.TemplateFragment.prototype.addEntry = function(entry){
   var char = entry.type == 'L' ? entry.value : wFORMS.behaviors.autoformat.charSet[entry.type];
   this.characters.push(char);
   this.entries.push(entry);
};




