if (typeof(wFORMS) == "undefined") {
	throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}


wFORMS.behaviors.lengthPrompt = {

    ATTRIBUTE_SELECTOR: 'maxLength',
    ALLOWED_ELEMENT_TYPE: ['input[type="text"]', 'input[type="color"]', 'input[type="date"]', 'input[type="datetime"]',
        , 'input[type="datetime-local"]', 'input[type="email"]', 'input[type="month"]', 'input[type="number"]',
        'input[type="range"]', 'input[type="search"]', 'input[type="tel"]', 'input[type="time"]', 'input[type="url"]',
        'input[type="week"]','textarea'],
    MONITOR_CHECK_TIMES: 10,
    CUSTOM_INDICATOR_STYLE: 'lengthIndicator',

    keyCode:{
        LEFT : 37,
        RIGHT : 39,
        END: 35,
        HOME: 36,
        DELETE: 46,
        BACKSPACE: 8
    },

    instance: function(){
        return function LengthPrompt(element){
            this.element = element;
            this.ui_indicator = null;
            this.maxLength = -1;
            this.previousLength = -1;

            this._pasteMonitorHandler = null;
            this.inputCache = null;
        }
    }(),

    _globalCache: {},

    applyTo: function(f){
        'use strict';

        var elements = base2.DOM.Element.querySelectorAll(f, wFORMS.behaviors.lengthPrompt._getActorsSelector());
        elements.forEach(function(element){
            var maxLength = element.getAttribute(wFORMS.behaviors.lengthPrompt.ATTRIBUTE_SELECTOR);
            if(maxLength === null || maxLength === undefined){
                return;
            }
            var infoEntry = new wFORMS.behaviors.lengthPrompt.instance(element);
            infoEntry.maxLength = parseInt(maxLength);
            var id = wFORMS.behaviors.lengthPrompt._getIDForActorElement(element);

            wFORMS.standardizeElement(element);
            infoEntry.deployUI();
            infoEntry.bindEvents();

            wFORMS.behaviors.lengthPrompt._globalCache[id] = infoEntry;
        });
    },


    //event handlers
    eventHandlers : {
        focus: function(event){
            var infoEntry = wFORMS.behaviors.lengthPrompt._globalCache[this.id];
            if(!infoEntry){
                return;
            }
            infoEntry.showIndicator();
        },

        blur: function(event){
            var infoEntry = wFORMS.behaviors.lengthPrompt._globalCache[this.id];
            if(!infoEntry){
                return;
            }
            infoEntry.hideIndicator();
        },

        keyup: function(event){
            var infoEntry = wFORMS.behaviors.lengthPrompt._globalCache[this.id];
            if(!infoEntry){
                return;
            }
            infoEntry.checkUpdate();
        },

        //handle on paste event for textarea
        paste: function(event){
            var infoEntry = wFORMS.behaviors.lengthPrompt._globalCache[this.id];
            if(!infoEntry){
                return ;
            }
            var selection = wFORMS.behaviors.lengthPrompt.getSelection(infoEntry.element);
            infoEntry.inputCache = this.value;

            infoEntry._pasteMonitorHandler = window.setInterval((function(){
                var count = 0;
                return function(){
                    var result = infoEntry.checkCacheTempered(selection);
                    if(result !== false){
                        window.clearInterval(infoEntry._pasteMonitorHandler);
                        infoEntry.handlePaste(result, selection);
                    }
                    count++;
                    if(count >= wFORMS.behaviors.lengthPrompt.MONITOR_CHECK_TIMES){
                        window.clearInterval(infoEntry._pasteMonitorHandler);
                    }
                };
            })(), 10);
        },

        textarea_input: function(event){
            var infoEntry = wFORMS.behaviors.lengthPrompt._globalCache[this.id];
            if(!infoEntry){
                return ;
            }
            infoEntry.restrictInput(event);
        }

    },

    messages: '%1 characters left.',

    // private methods
    _getActorsSelector: function(){
        if(!wFORMS.behaviors.lengthPrompt.ACTORS_SELECTOR){
            var temp = '';
            for(var i = 0; i < wFORMS.behaviors.lengthPrompt.ALLOWED_ELEMENT_TYPE.length; i++){
                temp += wFORMS.behaviors.lengthPrompt.ALLOWED_ELEMENT_TYPE[i] + '[' +  wFORMS.behaviors.lengthPrompt.ATTRIBUTE_SELECTOR + '], ';
            }
            wFORMS.behaviors.lengthPrompt.ACTORS_SELECTOR = temp.slice(0, -2);
        }
        return wFORMS.behaviors.lengthPrompt.ACTORS_SELECTOR;
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
    } ,

    getSelection: function(element){
       var cursurPosition=-1, selectionLength;
       if(element.selectionStart >=0 ){
           cursurPosition= element.selectionStart;
           selectionLength =  element.selectionEnd - element.selectionStart;
       }else if(document.selection){//IE
           var $oS, $oR, $oT;
           if (element.tagName && element.tagName === "TEXTAREA"){
                $oS = document.selection.createRange().duplicate();
                $oR = element.createTextRange();
                $oR.collapse(false);
                $oR.moveToBookmark($oS.getBookmark());
                if ($oS.text === ''){
                    $oT = $oR.duplicate();
                    $oT.moveEnd("character", 1);
                    if ($oS.boundingWidth === $oT.boundingWidth && $oS.boundingHeight === $oT.boundingHeight){
                        $oR = $oT;
                    }
                }
           }else{
                $oR = document.selection.createRange().duplicate();
           }
           selectionLength = $oR.text.length;
           cursurPosition = Math.abs($oR.moveStart("character", -1000000));
       }else if (document.getSelection){ /* Netscape */
           cursurPosition = 0;
           selectionLength = document.getSelection().length;
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
       }

};

(function(ext){
    for(key in ext){
        wFORMS.behaviors.lengthPrompt.instance.prototype[key] = ext[key];
    }
})({
    deployUI: function(){
        var positioningDiv = this.element.parentNode;
        //test '.wForm .inputWrapper'
        if(!base2.DOM.Element.matchesSelector(this.element.parentNode, wFORMS.INPUT_CONTROL_WRAPPER_SELECTOR)){
            positioningDiv = this.mirrorWrapperDiv();
        }
        //add floating indicator
        var indicatorDiv = document.createElement('div');
        positioningDiv.appendChild(indicatorDiv);
        indicatorDiv.style.position = 'absolute';
        indicatorDiv.style.top = '0px';
        indicatorDiv.style.display = 'none';
        indicatorDiv.style.width = '100%';
        indicatorDiv.className = wFORMS.behaviors.lengthPrompt.CUSTOM_INDICATOR_STYLE;

        this.ui_indicator = indicatorDiv;
        this.adjustIndicatorPosition();
        this.checkUpdate();
    },

    adjustIndicatorPosition: function(){
        var retrieveCssProperty = (function(element){
            return function(cssProperty){
                return parseFloat(base2.DOM.AbstractView.getComputedStyle(window, element, '')
                    .getPropertyValue(cssProperty).replace(/px$/, '')) || 0 ;
            }
        })(this.element);

        var sum = this.element.offsetWidth || retrieveCssProperty('width'); // width first
        var properties = ['margin-left', 'margin-right', 'border-left-width', 'border-right-width', 'padding-left',
                'padding-right'];
        for(var i = 0, l = properties.length; i < l ; i++){
            sum += retrieveCssProperty(properties[i]) || 0;
        }
        this.ui_indicator.style.left = sum + 'px';
    },

    mirrorWrapperDiv: function(){
        var positioningDiv = document.createElement('div');
        this.element.parentNode.insertBefore(positioningDiv, this.element);
        positioningDiv.style.position = 'relative';

        positioningDiv.style.display = base2.DOM.AbstractView.getComputedStyle(window, this.element, '').getPropertyValue('display');
        positioningDiv.appendChild(this.element);

        return positioningDiv;
    },

    bindEvents: function(){
        for (var i = 0, events = ['focus', 'blur']; i < events.length; i++){
            var event = events[i];
            this.element.addEventListener(event, wFORMS.behaviors.lengthPrompt.eventHandlers[event], true);
        }

        if(this.element.tagName.toUpperCase() == 'TEXTAREA'){
            this.element.addEventListener('paste', wFORMS.behaviors.lengthPrompt.eventHandlers['paste'], true);
            this.element.addEventListener('keydown', wFORMS.behaviors.lengthPrompt.eventHandlers['textarea_input'], true);
        }
    },

    bindMonitorEvent: function(){
        for (var i = 0, events = ['keyup']; i < events.length; i++){
            var event = events[i];
            this.element.addEventListener(event, wFORMS.behaviors.lengthPrompt.eventHandlers[event], true);
        }
    },

    releaseMonitorEvent: function(){
        for (var i = 0, events = [ 'keyup']; i < events.length; i++){
            var event = events[i];
            base2.DOM.Element.removeEventListener(this.element, event,
                wFORMS.behaviors.lengthPrompt.eventHandlers[event], true);
        }
    },

    checkCacheTempered: function(refSelection){
        var value = this.element.value;
        if(value == this.inputCache){
            return false;
        }

        var diffLength = value.length - this.inputCache.length + refSelection.length;
        var caret = wFORMS.behaviors.lengthPrompt.getSelection(this.element).caret;
        var start = caret - diffLength;
        var diff = value.substr(start, diffLength);
        return {diff: diff, start: start, length: diffLength};
    },

    handlePaste: function(diffInfo, selection){
        var overFlow = this.inputCache.length - selection.length + diffInfo.length - this.maxLength;
        var diff = diffInfo.diff;
        if(overFlow > 0){
            diff = diff.substr(0, diff.length - overFlow);
        }
        this.element.value = this.inputCache.substr(0, selection.caret) + diff
            + this.inputCache.substr(selection.caret + selection.length, this.inputCache.length);
        wFORMS.behaviors.lengthPrompt.setCaretPosition(this.element, selection.caret + diff.length);
        this.checkUpdate();
    },

    restrictInput: function(event){
        if(this.element.value.length == this.maxLength &&
            !this.testSpecialKey(event) // allow special functional keys(so those keys can reduce the length)
            && (wFORMS.behaviors.lengthPrompt.getSelection(this.element).length == 0) ){ //if user selected some text, allow overwrite
            event.preventDefault();
        }
    },

    testSpecialKey : function(event){
        var keyCode = event.which || event.keyCode;
        return( (event.ctrlKey && ( keyCode == 65 ||    /* Ctrl + A*/
                                    keyCode == 88 ||    /* Ctrl + X*/
                                    keyCode == 67 ||    /* Ctrl + C*/
                                    keyCode == 86 )     /* Ctrl + V*/
                                  ) ||
            (keyCode == wFORMS.behaviors.lengthPrompt.keyCode['END']) || /* end */
            (keyCode == wFORMS.behaviors.lengthPrompt.keyCode['HOME']) /* home */ ||
            (keyCode == wFORMS.behaviors.lengthPrompt.keyCode['LEFT']) /* left */||
            (keyCode == wFORMS.behaviors.lengthPrompt.keyCode['RIGHT']) /* right */||
            (keyCode == wFORMS.behaviors.lengthPrompt.keyCode['DELETE']) /* delete */||
            (keyCode == wFORMS.behaviors.lengthPrompt.keyCode['BACKSPACE'])/* backspace */
        )
    },

    showIndicator: function(){
        this.adjustIndicatorPosition();
        this.ui_indicator.style.display = 'block';
        this.bindMonitorEvent();
    },

    hideIndicator: function(){
        this.ui_indicator.style.display = 'none';
        this.releaseMonitorEvent();
    },

    updateIndicator: function(){
        var length = this.element.value.length;
        var left = this.maxLength - length;
        this.ui_indicator.innerHTML = wFORMS.behaviors.lengthPrompt.messages.replace(/%1/g, left);
    },

    checkUpdate: function(){
        var length = this.element.value.length;
        if( length != this.previousLength){
            this.updateIndicator();
            this.previousLength = length;
        }
    }

});