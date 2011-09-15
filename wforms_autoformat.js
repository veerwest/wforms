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
    CASE_INSENSITIVE_MATCH: true,
    MONITOR_CHECK_TIMES: 10,

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
        'DELETE': 46,
        BACKSPACE: 8
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
        this._pasteMonitorHandler = null;
    },

    TemplateEntry: function(order, type, value){
        this.order = order;
        this.type = type;
        this.value = value;
        this.templateFragment = null;
        this.fragmentOrder = 0;
    },

    TemplateFragment : (function(){
        function TemplateFragment(order){
            this.order = order;
            this.characters = [];
            this.entries = [];
            this.next = null;
        }
        return TemplateFragment;
    })(),

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

    getSelection: function(element){
        var cursurPosition=-1, selectionLength;
        if(element.selectionStart >=0 ){
            cursurPosition= element.selectionStart;
            selectionLength =  element.selectionEnd - element.selectionStart;
        }else{//IE
            var range = document.selection.createRange();
            selectionLength = range.text.length;
            range.moveStart("character", -element.value.length);
            cursurPosition = range.text.length - selectionLength;
        }
        return {caret: cursurPosition, length: selectionLength};
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

    escapeHTMLEntities : function(htmlCode){
        var div = document.createElement('div');
        var text = document.createTextNode(htmlCode);
        div.appendChild(text);
        return div.innerHTML.replace(/ /g, '&nbsp;');
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
        var mutex = false;

        //TODO : make the anonymous event functions static
        element.addEventListener('keypress', function(event){
            var id = this.id;
            var infoEntry = wFORMS.behaviors.autoformat._globalCache[id];
            if(!infoEntry){
                return ;
            }
            if(mutex){
                mutex = false;
                return;
            }
            var handled = infoEntry.handleTyping(event);
            if(handled){
                event.preventDefault();
            }
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
                mutex = true; // 'keydown' has a higher priority
                event.preventDefault();
            } else{
                mutex = false; // pass process right to 'keypress'
            }
        }, true);

        for(var i = 0 ; i < 2 ; i++){
            element.addEventListener(['drop', 'drag'][i], function(event){
                event.preventDefault();
                return false;
            }, true);
        }
        element.setAttribute('autocomplete', 'off');
        element.style.imeMode = 'disabled';

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

        //handle paste
        element.addEventListener('paste', function(event){
            var id = this.id;
            var infoEntry = wFORMS.behaviors.autoformat._globalCache[id];
            if(!infoEntry){
                return ;
            }
            var selection = wFORMS.behaviors.autoformat.getSelection(infoEntry.element);

            infoEntry._pasteMonitorHandler = window.setInterval((function(){
                var entry = infoEntry;
                var count = 0;
                return function(){
                    var result = entry.checkCacheTempered(selection);
                    console.log(result);
                    if(result != false){
                        window.clearInterval(entry._pasteMonitorHandler);
                        entry.handlePaste(result, selection);
                    }
                    count++;
                    if(count >= wFORMS.behaviors.autoformat.MONITOR_CHECK_TIMES){
                        window.clearInterval(entry._pasteMonitorHandler);
                    }
                };
            })(), 10);
        });
    },

    _attachGhostPromptLayer : function(element){
        var positioningDiv = document.createElement('div');
        element.parentNode.insertBefore(positioningDiv, element);
        positioningDiv.style.position = 'relative';
        positioningDiv.style.display = 'inline-block';

        positioningDiv.appendChild(element);
        element.addClass('autoformatprompt-control');

        var newDiv = document.createElement('div');
        positioningDiv.appendChild(newDiv);
        newDiv.innerHTML = "Show something";
        newDiv.style.display = 'none';
        newDiv.className = 'autoformatprompt';

        var elementHeight = element.offsetHeight;
        var elementWidth = element.offsetWidth;

        positioningDiv.style.height = elementHeight + 'px';
        positioningDiv.style.width = elementWidth + 'px';

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
        if(template[i].type == 'L'){
            result.push(new wFORMS.behaviors.autoformat.TemplateEntryLabel(i, template[i].value));
            continue;
        }
        result.push(new wFORMS.behaviors.autoformat.TemplateEntryMask(i, template[i].type, template[i].value));
    }
    return result;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.buildTemplateFragmentList = function(){
    var j = 0, order = 0, fragment = null, templateEntry = null, fragmentOrder = 0;
    for (var i = 0 ; i < this.template.length; i++){
        templateEntry = this.template[i];
        var newFragment = new wFORMS.behaviors.autoformat.TemplateFragment(fragmentOrder++);
        if(fragment!=null){
            fragment.next = newFragment;
        }
        fragment = newFragment;

        if(templateEntry.type != 'L'){
            templateEntry.setTemplateFragment(fragment);
            templateEntry.setTemplateFragmentOrder(0);
            fragment.addEntry(templateEntry);
        }else{
            //if type 'L', then match consecutive 'L's
            order = 0;
            for(j = i; j < this.template.length; j++){
                templateEntry = this.template[j];
                if(templateEntry.type != 'L'){
                    break;
                }
                templateEntry.setTemplateFragment(fragment);
                templateEntry.setTemplateFragmentOrder(order++);
                fragment.addEntry(templateEntry);
            }
            i=j - 1;
        }
        this.templateFragments.push(fragment);
    }
};

/**
 * Event Handler for Keydown event. Keydown event is able to capture functional key event, such as arrow keys, while 'keypress' is not.
 * @param event
 * return true: functional keys are detected and handled. false:  no functional keys are pressed.
 */
wFORMS.behaviors.autoformat.InfoEntry.prototype.handleControlKey = function(event){
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

    if(this.testCombinationKey(event)){
        return false; // yield way for other procedures to deal with the combination keys.
    }

    var cur = wFORMS.behaviors.autoformat.getCaretPosition(this.element), nextInputPoint;
    var templateEntry = this.getSymbolPosition(cur);

    if(templateEntry.type == 'EOF'){
       return true;
    }

    if(templateEntry.type == 'L'){
        if(templateEntry.fragmentOrder == 0){ // if caret is at the front boundary of the fixed text fragment.
            //then prefilling (auto-complete) fixed text fragment
            this.prefill(cur);
        }
        nextInputPoint = templateEntry.templateFragment.getLastEntry().order + 1;
        //try to match a fixed text from current 'cur'(cursor) position
        if(templateEntry.matchKey(event)){ //if matched, step ahead
            cur++;
        }else{//if not matched, try to match the next masked input
            templateEntry = this.getSymbolPosition(nextInputPoint);
            if(templateEntry.type == 'EOF'){  // if this is the last fragment, fill it anyway
                this.prefill(cur);
                cur = nextInputPoint;
            }else{
                var result = templateEntry.matchKey(event);
                if(!result.match){
                    return true; // failed to recognize a legal input, do nothing, the input of this time is discarded
                }
                //update input cache
                this.insertInputEntry(nextInputPoint, {type: 'I', value: result.character});
                cur = nextInputPoint + 1;
            }
        }
        this.displayCache();
        wFORMS.behaviors.autoformat.setCaretPosition(this.element, cur);
        return true; // handled
    }

    //handle typing input
    var isUpdated = this.keyCodeCheck(templateEntry, event);
    if(isUpdated){
        this.autoFill(cur);
        wFORMS.behaviors.autoformat.setCaretPosition(this.element, cur+1);
        return true;
    }

    return true;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.testSpecialKey = function(event){
    return event.altKey || event.ctrlKey || event.metaKey;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.testCombinationKey = function(event){
    var keyCode = event.which || event.keyCode;
    var character = String.fromCharCode(keyCode);

    if(event.ctrlKey && (character == 'C' || character == 'c') ){
        return true;
    }
    if(event.ctrlKey && (character == 'V' || character == 'v') ){
        return true;
    }
    if(event.ctrlKey && (character == 'A' || character == 'a') ){
        return true;
    }

    return false;
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
    if(this.testSpecialKey(event)){
        return false;
    }
    //test template type match
    if(templateEntry.type != 'D' && templateEntry.type != 'T'){
        return false;
    }

    var result = templateEntry.matchKey(event);
    if(!result.match){
        return false;
    }

    //create entry in input cache
    var position = templateEntry.order;
    this.insertInputEntry(position, {type: 'I', value: result.character});

    return true;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.displayCache = function(){
    var output = this.calculateCachePresentation();

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

    return caretPos;
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
    var templateEntry = this.template[cursorPosition], fragment;
    if(templateEntry == undefined){
        fragment = this.templateFragments[this.templateFragments.length - 1];
    }else{
        var fragmentOrder = templateEntry.templateFragment.order;
        fragment =  this.templateFragments[fragmentOrder > 0? fragmentOrder - 1 : 0];
    }

    cursorPosition = fragment.entries[0].order;
    wFORMS.behaviors.autoformat.setCaretPosition(this.element, cursorPosition);
    return cursorPosition;

};
wFORMS.behaviors.autoformat.InfoEntry.prototype.handleRightMovement = function(event, cursorPosition){
    var templateEntry = this.template[cursorPosition], fragment;
    if(templateEntry == undefined){
        fragment = this.templateFragments[this.templateFragments.length - 1];
    }else{
        fragment =  templateEntry.templateFragment;
    }
    cursorPosition = fragment.getLastEntry().order + 1;
    wFORMS.behaviors.autoformat.setCaretPosition(this.element, cursorPosition);
    return cursorPosition;

};
wFORMS.behaviors.autoformat.InfoEntry.prototype.handleHome = function(event, cursorPosition){
    wFORMS.behaviors.autoformat.setCaretPosition(this.element, 0);
    return 0;

};
wFORMS.behaviors.autoformat.InfoEntry.prototype.handleEnd = function(event, cursorPosition){
    cursorPosition = this.inputCache.length;
    wFORMS.behaviors.autoformat.setCaretPosition(this.element, cursorPosition + 1);
    return cursorPosition;
};
wFORMS.behaviors.autoformat.InfoEntry.prototype.handleDelete = function(event, caret){
    var selection = wFORMS.behaviors.autoformat.getSelection(this.element);
    if(selection.length!=0){
        return this.groupSelectionRemove(selection);
    }

    var templateEntry = this.template[caret], templateFragment, suppressAutoFill = false;
    if(templateEntry.type == 'L'){
        templateFragment = templateEntry.templateFragment;
        if(templateFragment.next == null){
            suppressAutoFill = true; //will remove the last fragment
        }else{
            templateFragment = templateFragment.next;
            if(templateFragment.type == 'L'){
                throw 'Exceptional case';
            }
            var firstEntryOrder = templateFragment.entries[0].order;
            //input entry exist?
            if(this.inputCache[firstEntryOrder] != undefined // if a Mask entry after the fragment exists
                || templateEntry.fragmentOrder !=0){ // if caret is not at the first character of the fragment
                caret = firstEntryOrder; // skip to first entry of the next adjacent fragment
            }else{
                caret = templateEntry.templateFragment.entries[0].order; //prepare to remove the current fragment
                suppressAutoFill = true;
            }
        }
    }

    var inputQueue= this.buildActiveInputQueueAtCaret(caret), i;
    inputQueue.shift();

    this.fillActiveInputIntoTemplate(caret, inputQueue, suppressAutoFill);
    this.displayCache();
    wFORMS.behaviors.autoformat.setCaretPosition(this.element, caret);

    return true;
};
wFORMS.behaviors.autoformat.InfoEntry.prototype.handleBackspace = function(event, caret){
    var selection = wFORMS.behaviors.autoformat.getSelection(this.element), noDeleteFlag = false;
    if(selection.length!=0){
        return this.groupSelectionRemove(selection);
    }

    var templateFragment, suppressAutoFill = false;
    caret --;
    if(caret < 0){
        return true; //handled, though did nothing
    }
    var templateEntry = this.template[caret];
    if(templateEntry.type == 'L'){
        templateFragment = templateEntry.templateFragment;
        if(templateFragment.order ==0){
            caret = 0;
            noDeleteFlag = true;
            suppressAutoFill = true;
        }else{
            //TODO make it bidirectional linked list
            templateFragment = this.templateFragments[templateFragment.order-1];
            if(templateFragment.type == 'L'){
                throw 'Exceptional case';
            }
            caret = templateFragment.entries[0].order;
        }
    }
    var inputQueue= this.buildActiveInputQueueAtCaret(caret);
    if(!noDeleteFlag){      // if delete flag isn't set
        inputQueue.shift();
    }

    this.fillActiveInputIntoTemplate(caret, inputQueue, suppressAutoFill);
    this.displayCache();
    wFORMS.behaviors.autoformat.setCaretPosition(this.element, caret);
    return true;

};

wFORMS.behaviors.autoformat.InfoEntry.prototype.handlePaste = function(difference, refSelection){
    var inputQueue = this.buildActiveInputQueueAtCaret(difference.start);
    var removeCount = 0;
    if(refSelection.length != 0){// need remove the active input characters in the selection
        removeCount = this.inputMaskStatisticWithinRange(refSelection.caret, refSelection.length);
    }
    //remove 'removeCount' elements from the queue
    while(removeCount > 0){
        inputQueue.shift();
        removeCount--;
    }
    var insertionQueue = [];
    //build up insertion as entry list
    for(var i = 0; i < difference.diff.length; i++){
        insertionQueue.push({type: 'I', value: difference.diff[i]});
    }
    //splice the insertion with the successive input
    inputQueue = insertionQueue.concat(inputQueue);

    this.fillActiveInputIntoTemplate(difference.start, inputQueue);
    this.displayCache();
    wFORMS.behaviors.autoformat.setCaretPosition(this.element, difference.start);
    return true;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.groupSelectionRemove = function(selection){
    var caret = selection.caret;
    var inputQueue= this.buildActiveInputQueueAtCaret(caret);
    var activeInput = this.inputMaskStatisticWithinRange(caret, selection.length);
    while(activeInput > 0){
        inputQueue.shift();
        activeInput--;
    }
    this.fillActiveInputIntoTemplate(caret, inputQueue);
    this.displayCache();
    wFORMS.behaviors.autoformat.setCaretPosition(this.element, caret);
    return true;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.updatePatternPrompt = function(){
    var inputText = this.getTextValue();
    var output = '';

    var templateOutputPoint = inputText.length;

    for(var i = templateOutputPoint; i < this.template.length; i ++){
        var templateEntry = this.template[i], symbol, style = 'noinput';

        if(templateEntry.type == 'L'){
            symbol = wFORMS.behaviors.autoformat.escapeHTMLEntities(templateEntry.value) ;
            style = 'label';
        }else{
            symbol = wFORMS.behaviors.autoformat.charSet[templateEntry.type];
        }
        output += '<span class="' + style + '">' + symbol + '</span>';
    }
    this.promptLayer.style.left = this.measureTextWidth(this.promptLayer, wFORMS.behaviors.autoformat.escapeHTMLEntities(inputText)) + 'px';
    this.promptLayer.innerHTML = output;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.getTextValue = function(){
    //TODO
    return this.element.value;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.calculateCachePresentation = function(){
    var output = '';
    for(var i = 0; i < this.inputCache.length; i++){
        try{
            output += this.inputCache[i].value;
        }catch(e){
            var aaa = 1;
        }
    }

    return output;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.measureTextWidth = function(placeHolder, text){
    placeHolder.innerHTML = text;
    return placeHolder.offsetWidth;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.showPrompt = function(){
    var div = this.promptLayer;
    div.style.display = '';
    div.style.top = this.element.offsetTop + 'px';

    var elementHeight = this.element.offsetHeight;
    var elementWidth = this.element.offsetWidth;

    this.element.parentNode.style.height = elementHeight + 'px';
    this.element.parentNode.style.width = elementWidth + 'px';

    this.updatePatternPrompt();
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.hidePrompt = function(){
    var div = this.promptLayer;
    div.style.display = 'none';
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.checkCacheTempered = function(refSelection){
    var value = this.getTextValue(), valueLength = value.length, cacheLength = this.inputCache.length, diff, start;
    cacheLength = cacheLength - refSelection.length;

    if(valueLength == cacheLength){// no change
        return false;
    }
    var diffLength = valueLength - cacheLength;
    var caret = wFORMS.behaviors.autoformat.getCaretPosition(this.element);
    if(diffLength > 0){ //pasted new stuff
        //the difference would be the 'diffLength'-long portion before caret
        start = caret - diffLength;
        diff = value.substr(start, diffLength);
    }else{
        start = caret;
        diff = this.calculateCachePresentation().substr(start, -diffLength);
    }

    return {diff: diff, start: start, length : diffLength};
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.inputMaskStatisticWithinRange = function(caret, length){
    var count = 0;
    for(var i = caret, j = 0; i < this.inputCache.length && j < length; i++){
        var inputEntry = this.inputCache[i];
        if(inputEntry.type != 'L'){
            count++;
        }
        j++
    }
    return count;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.insertInputEntry = function(caret, insertInputEntry){
    var inputQueue= this.buildActiveInputQueueAtCaret(caret), i;
    inputQueue.splice(0,0, insertInputEntry);
    this.fillActiveInputIntoTemplate(caret, inputQueue);
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.buildActiveInputQueueAtCaret = function(caret){
    var inputQueue= [], i;
    for(i = caret; i < this.inputCache.length; i++){
        var inputEntry = this.inputCache[i];
        if( inputEntry.type == 'I'){
            inputQueue.push(inputEntry);
        }
    }
    return inputQueue;
};

wFORMS.behaviors.autoformat.InfoEntry.prototype.fillActiveInputIntoTemplate = function(caret, inputQueue, isSuppressAutoFill){
    if(isSuppressAutoFill == undefined){
        isSuppressAutoFill = false;
    }
    var templateMatchPosition = caret, templateFragment, inputQueueElement, i;
    while(inputQueue.length){
        var templateEntry = this.template[templateMatchPosition];
        if(templateEntry == undefined){ // reach the end of the template
            break;
        }
        if(templateEntry.type !='L'){
            inputQueueElement = inputQueue.shift();
            if(templateEntry.matchCharacter(inputQueueElement.value)){
                this.inputCache[templateMatchPosition++] = inputQueueElement;
            } // if not match, the 'inputQueueElement' will be discarded intentionally
        }else if(templateEntry.type =='L'){
            templateFragment = templateEntry.templateFragment;
            var startOrder = templateEntry.fragmentOrder;
            for(i = startOrder; i < templateFragment.entries.length; i++){
                templateEntry = templateFragment.entries[i];
                this.inputCache[templateMatchPosition++] = {type: 'L', value: templateEntry.value};
                //if the input queue head element match the template entry, consume that head element
                inputQueueElement = inputQueue[0];
                if(inputQueueElement != undefined && templateEntry.matchCharacter(inputQueueElement.value)){
                    inputQueue.shift();
                }
            }
        }
    }
    this.inputCache.splice(templateMatchPosition, this.inputCache.length);  //delete until last

    templateEntry = this.template[templateMatchPosition];
    if(templateEntry != undefined && templateEntry.type == 'L' && !isSuppressAutoFill){ //keep the fixed text fragment after the input tail
        templateFragment = templateEntry.templateFragment;
        for(i = 0; i < templateFragment.entries.length; i++){
            this.inputCache[templateMatchPosition++] = {type: 'L', value: templateFragment.entries[i].value};
        }
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
   var character = entry.type == 'L' ? entry.value : wFORMS.behaviors.autoformat.charSet[entry.type];
   this.characters.push(character);
   this.entries.push(entry);
};

wFORMS.behaviors.autoformat.TemplateFragment.prototype.getLastEntry = function(entry){
   return this.entries[this.entries.length - 1];
};

//=============== TemplateEntryLabel Class Definition=============== //

wFORMS.behaviors.autoformat.TemplateEntryLabel = (function(){
    function TemplateEntryLabel(order, value){
        wFORMS.behaviors.autoformat.TemplateEntry.call(this, order, 'L', value);
    }
    TemplateEntryLabel.prototype = new wFORMS.behaviors.autoformat.TemplateEntry();
    TemplateEntryLabel.prototype.constructor = TemplateEntryLabel;
    return TemplateEntryLabel;
})();

wFORMS.behaviors.autoformat.TemplateEntryLabel.prototype.matchKey = function(event){
   var keyCode = event.which || event.keyCode;
   var character = String.fromCharCode(keyCode);

   return this.matchCharacter(character);
};

wFORMS.behaviors.autoformat.TemplateEntryLabel.prototype.matchCharacter = function(character){
    if(wFORMS.behaviors.autoformat.CASE_INSENSITIVE_MATCH){
       return character.toUpperCase() == this.value.toUpperCase();
   }
   return character == this.value;
};

//=============== TemplateEntryMask Class Definition=============== //
wFORMS.behaviors.autoformat.TemplateEntryMask = (function(){
    function TemplateEntryMask(order, type, value){
        wFORMS.behaviors.autoformat.TemplateEntry.call(this, order, type, value);
    }
    TemplateEntryMask.prototype = new wFORMS.behaviors.autoformat.TemplateEntry();
    TemplateEntryMask.prototype.constructor = TemplateEntryMask;
    return TemplateEntryMask;
})();

/**
 *
 * @param event The DOM event object
 * @param keyCode Usually will not be used unless 'matchCharacter' wants to borrow its logic
 */
wFORMS.behaviors.autoformat.TemplateEntryMask.prototype.matchKey = function(event, keyCode){
    var keyCodeMeta = wFORMS.behaviors.autoformat.keyCode[this.type], result = {};
    if(keyCode == undefined){
        keyCode = event.which || event.keyCode;
    }
    var character = null, range = null;
    for(i = 0 ; i < keyCodeMeta.length; i++){// enumerate ranges
        range = keyCodeMeta[i];
        if(keyCode >= range.keyCodeStart && keyCode <= range.keyCodeEnd){
            result.match = true;
            //calculate character
            character = String.fromCharCode(range.asciiStart + keyCode - range.keyCodeStart);
            break;
        }
    }

    if(!character){
       result.match = false;
       return result;  // not fall in range
    }
    result.character = character;

    return result;
};

wFORMS.behaviors.autoformat.TemplateEntryMask.prototype.matchCharacter = function(character){
    var keyCode = character.charCodeAt(0);
    var result = this.matchKey(null, keyCode);
    return result.match;
};

