
if (typeof(wFORMS) == "undefined") {
	throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}
/**
 * wForms switch behavior.  
 * See: http://www.formassembly.com/wForms/v2.0/documentation/conditional-sections.php
 *  and http://www.formassembly.com/wForms/v2.0/documentation/examples/switch_validation.html 
 */
wFORMS.behaviors['switch'] =  {
    DEBUG: true,

	/**
	 * Selector expression for the switch elements
     * @final
     * @see	http://www.w3.org/TR/css3-selectors/

	 */
    TARGET_SELECTOR : '.target',

    TARGET_INDENTIFIER: 'target',

    RULE_ATTRIBUTE_NAME : 'rule',
    TRIGGER_CONDITION_ATTRIBUTE_NAME : 'triggerrule',

    /**
     * pattern for trigger info in target host in the css style list
     * @param elem
     */
    TRIGGER_RULES: /((and)|(or))\[(.*)\]$/,

    /**
	 * CSS class prefix for the off state of the target element
     * @final
	 */
	CSS_OFFSTATE : 'offstate',

	/**
	 * CSS class prefix for the on state of the target element
     * @final
	 */
	CSS_ONSTATE : 'onstate',

    /**
     * this is used to work around ids of form #id[number], which will be treated as an integral id, square [] part will
     *  not have special semantics.
     */
    CSS_ID_PATTERN: /#(.*)\[(\d)+\]$/,

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

    isSwitchedOn: function(element){
        wFORMS.standardizeElement(element);
        return element.hasClass(wFORMS.behaviors['switch'].CSS_ONSTATE);
    },

    isSwitchedOff: function(element){
        wFORMS.standardizeElement(element);
        return element.hasClass(wFORMS.behaviors['switch'].CSS_OFFSTATE);
    },

    /**
     * Factory Method.
     * Applies the behavior to the given HTML element by setting the appropriate event handlers.
     * @param {domElement} f An HTML element, either nested inside a FORM element or (preferably) the FORM element itself.
     * @return {object} an instance of the behavior
     */
    applyTo : function(f){
        wFORMS.behaviors['switch'].instance.applyTo(f);
        wFORMS.behaviors['switch'].onApply();

        if(!wFORMS.instances['switch']) {
			wFORMS.instances['switch'] = wFORMS.behaviors['switch'].instance;
		}

        return wFORMS.behaviors['switch'].instance;
    },

    destroy: function(f){
        wFORMS.behaviors['switch'].instance.destroy(f);
    },

    onApply: function(){
        //meant to be overridden
        wFORMS.behaviors['switch'].instance.onApply();
    },
	
	/**
	 * Creates new instance of the behavior
     * @constructor
	 */
	instance : new function(f){
		this.behavior = wFORMS.behaviors['switch']; 
		var cache = ( this.cache = []);
        var backUpCache = []; //temporarily store deleted cache for later recovery purpose
        /*
         Public methods
         */
        this.applyTo = function(f){
            wFORMS.standardizeElement(f);
            getTargets(f).forEach(function (element){
                if(typeof element == 'undefined'){
                    return;
                }
                establishBinding(element);
            });
            if(f.hasClass(wFORMS.behaviors['switch'].TARGET_INDENTIFIER)){
                establishBinding(f);
            }
        };

        this.onApply = function(){
            //meant to be overridden
        };

        this.destroy = function(f){
            getTargets(f).forEach(function (element){
                _destroy(element);
            });
            if(f.hasClass(wFORMS.behaviors['switch'].TARGET_INDENTIFIER)){
                _destroy(f);
            }
        };

        function _destroy(element){
            for(var i = 0; i < cache.length; i++){
                if(cache[i].target == element){
                    cache[i].destroy();
                    backUpCache.push(cache.splice(i, 1)[0]);
                }
            }
        }

        /**
         * Update the condition entries with UI presentation, if they are not consistent
         */
        this.run = function(target){
            if(target == null){
                for(var i = 0; i < cache.length; i++){
                    cache[i].updateEntries();
                }    
            }else{
                for(var i = 0; i < cache.length; i++){
                    if(cache[i].target == target){
                        cache[i].updateEntries();
                    }
                }
            }
        };

        /* Private methods */
        var getTargets = function(f){
            return f.querySelectorAll(wFORMS.behaviors['switch'].TARGET_SELECTOR);
        };

        function establishBinding(target){
            //first check whether the binding has been created before
            for(var i = 0; i < backUpCache.length; i++){
                if(backUpCache[i].target == target){
                    var entry = backUpCache.splice(i, 1)[0];
                    //reactivate cache
                    entry.recover();
                    cache.push(entry);
                    return;
                }
            }
            //otherwise create from stretch
            analyzeRule(target);
        }

        /**
         *
         * @param {domElement} target
         */
        function analyzeRule(target){
            var rule = target.getAttribute(wFORMS.behaviors['switch'].RULE_ATTRIBUTE_NAME);

            if(rule == null){
                return;
            }

            var m = rule.match(wFORMS.behaviors['switch'].TRIGGER_RULES);
            if ( m == null){
                return;
            }

            var logic = m[1], // 'and' or 'or'
                triggersCssSelectors = escapeCssSelectors(m[4].split('|')),
                triggers = []; // trigger elements

            for(var i = 0; i < triggersCssSelectors.length; i++){
                var triggerElement = document.querySelector(triggersCssSelectors[i]);
                
                if(triggerElement == null){ // then the trigger actually does not exist, skip this rule
                    continue;
                }

                triggers.push(triggerElement);
            }

            createConditionEntry(target, triggers, logic);
        }

        function escapeCssSelectors(triggersCssSelectors){
            for(var i = 0, l = triggersCssSelectors.length; i< l; i++){
                var selector = triggersCssSelectors[i];
                if(selector.match(wFORMS.behaviors['switch'].CSS_ID_PATTERN)){
                    triggersCssSelectors[i] = triggersCssSelectors[i].replace('[', '\\[').replace(']', '\\]');
                }
            }
            return triggersCssSelectors;
        }

        /**
         * create condition entry, which is used to maintain the triggers' status and trigger-target relationship
         * @param target
         * @param triggers
         * @param logic
         */
        function createConditionEntry(target, triggers, logic){
            var conditionEntry = null, temp;
            wFORMS.standardizeElement(target);

            //check whether a condition entry for the target has already existed
            if( !(temp = conditionEntryCacheExisted(target, logic) )){
                conditionEntry = new ConditionEntry(target, logic);
               //add to cache
                cache.push(conditionEntry);
            }else{
                conditionEntry = temp;
            }

            if (conditionEntry == null) return;

            for(var i = 0; i < triggers.length; i++){
                var triggerElement = triggers[i];
                wFORMS.standardizeElement(triggerElement);

                //generate event handler for triggerElement( store it now for later destruction purpose)
                var eventHandler = generateEventHandlerForTrigger(triggerElement, conditionEntry);

                //add trigger to condition entry
                var triggerExisted = conditionEntry.addTrigger(triggerElement, eventHandler);

                if(!triggerExisted){
                    //bind event handler to each target
                    setupTrigger(triggerElement, eventHandler);
                }
            }

            //to keep consistency of page layout, run and synchronize the condition entry and the page presentation.
            conditionEntry.run();
        }

        function setupTrigger(element, eventHandler){
            bindEventHandlerToTrigger[wFORMS.helpers.getElementType(element)](element, eventHandler)
        }

        /**
         * returns element on/off status
         * @param  element {domElement} trigger html element
         */
        function reportTriggerStatusByElement(element){
            var formula = element.getAttribute(wFORMS.behaviors['switch'].TRIGGER_CONDITION_ATTRIBUTE_NAME);
            if(formula != null){
                try{
                    return computeFormula(element, formula);
                }catch(e){
                    //if error occurred, then still try to judge on/off status with default behaviors    
                }
            }
            var elementType = wFORMS.helpers.getElementType(element);
            return reportTriggerStatusByElementType(elementType, element);
        }

        /**
         * this function defines how to check the on/off status of different types of html elements
         */
        function reportTriggerStatusByElementType(elementType, elem){
            switch(elementType){
                case 'a':
                    var status = elem.getAttribute('status');
                    if(status == null){
                        elem.setAttribute('status', 'off');
                        return false;
                    }
                    return status == 'on';
                case 'input.checkbox':
                case 'input.radio':
                    return elem.checked;
                case 'input.text':
                    return base2.JavaScript.String2.trim(elem.value).length != 0;
                case 'option':
                    return elem.selected;
                case 'textarea':
                    return base2.JavaScript.String2.trim(elem.value).length != 0;
                default:
                    return false;
            }
        }

        function computeFormula(element, formula){
            return (function(){
                return eval(formula);
            }).apply(element);
        }

        /**
         * This function generates a event handler( a function object), which will be used for removing event binding
         * later when needed, since removing process require the same event handler for correspondence.
         * @param cssSelector {String} css selector of the trigger element
         * @param triggerElement {domElement} trigger dom element
         * @param conditionEntry
         */
        function generateEventHandlerForTrigger(triggerElement, conditionEntry){
            var elementType = wFORMS.helpers.getElementType(triggerElement);
            var context = {
               dom: triggerElement,
               condition_entry: conditionEntry
            };
            switch(elementType){
                case 'a':
                    return base2.JavaScript.Function2.bind(function(){
                        var status = this['dom'].getAttribute('status');
                        if(status == null){
                            status = false;
                        }else{
                            status = (status == 'on');
                        }
                        this['dom'].setAttribute('status', !status ? 'on' : 'off');
                        this['condition_entry'].updateEntry(this['dom'])
                    }, context);
                default:
                    return base2.JavaScript.Function2.bind(function(){
                        this['condition_entry'].updateEntry(this['dom']);
                    }, context);
            }
        }

        /**
         * Apply the switch rules in originalNode to newNode, originalNode and newNode must have same tree structure.
         * @param originalNode
         * @param newNode
         */
        function cloneSection(originalNode, newNode){
            var result = originalNode.querySelectorAll(wFORMS.behaviors['switch'].TARGET_SELECTOR);
            var originalTargets = [];
            result.forEach(function(element){
                originalTargets.push(element);
            });

            //if originalNode is also a target
            for(var i = 0, l = cache.length; i < l; i++){
                if(cache[i].target == originalNode){
                    originalTargets.push(originalNode);
                    break;
                }
            }
            
            result = buildTargetTriggersMapping(originalTargets);
            var mapping = result[0], triggersSet = result[1], targetSet = result[2];
            //dual-walk dom tree
            traverseDom(originalNode, newNode);

            function traverseDom(originalNode, newNode){
                if(base2.JavaScript.Array2.contains(targetSet, originalNode)){ //if current node appears in the targets list
                    replaceTarget(originalNode, newNode);
                }

                if(base2.JavaScript.Array2.contains(triggersSet, originalNode)){//if current node appears in the triggers list
                    replaceTrigger(originalNode, newNode);
                }
                var originalChildren = originalNode.childNodes,
                    newChildren = newNode.childNodes;

                for(var i = 0, j = 0, l = originalChildren.length; i < l; i++){
                    var originalNode = originalChildren[i],
                        newNode = newChildren[j];
                    if(originalNode.nodeType == 3){
                        j++;//skip                         
                    }else {
                        base2.DOM.bind(originalNode);
                        if(!originalNode.hasClass(wFORMS.behaviors.repeat['CSS_REMOVEABLE']) && newNode){
                            traverseDom(originalChildren[i], newNode);
                            j++;
                        } //otherwise skip
                    }
                }
            }

            function replaceTarget(originalNode, newNode){
                for(var i = 0, l = mapping.length; i < l ; i++){
                    if(mapping[i].target == originalNode){
                        mapping[i].target = newNode;
                        break;
                    }
                }
            }

            function replaceTrigger(originalNode, newNode){
                for(var i = 0, l = mapping.length; i < l ; i++){
                    var triggers = mapping[i].triggers;
                    for(var j = 0, m = triggers.length; j < m; j++){
                        if(triggers[j] == originalNode){
                            triggers[j] = newNode;
                        }
                    }
                }
            }

            //realize switch behavior according to mapping
            for(var i = 0, l = mapping.length; i < l; i++){
                var triggers = mapping[i].triggers;
                var logic = mapping[i].logic;
                //update trigger rule definition
                var triggerRule = generateTriggerRule(triggers, logic);
                if(triggerRule != null){
                    mapping[i].target.setAttribute('rule', triggerRule);    
                }
                createConditionEntry(mapping[i].target, triggers, logic);
            }
        }

        function buildTargetTriggersMapping(targets){
            var mapping = [], triggersSet = [], targetsSet = [];

            for(var h = 0, k = targets.length; h < k; h++){
                var element = targets[h];
                var entry = {target: element, triggers: [], logic: null};
                for(var i = 0, l = cache.length; i < l; i++){
                    if(cache[i].target == element){
                       var triggers = cache[i].triggers;
                       entry.logic = cache[i].conditionType;
                       for(var j = 0, m = triggers.length; j < m; j++){
                           var triggerElement = triggers[j]['dom'];
                            entry.triggers.push(triggerElement);
                            if(!base2.JavaScript.Array2.contains(triggersSet, triggerElement)){
                               triggersSet.push(triggerElement);
                            }
                       }
                       break;
                    }
                }
                targetsSet.push(element);
                mapping.push(entry);
            }

            return [mapping, triggersSet, targetsSet];
        }

        function generateTriggerRule(triggers, logic){
            var s = logic + '[';
            for(var i = 0, mark = false, l = triggers.length; i < l; i++ ){
                var id = triggers[i].getAttribute('id');
                if(id != null){
                    s+='#' + id +"|";
                    mark = true;
                }
                s = s.replace(/\|$/, ']');
            }
            return mark ? s : null;
        }

        wFORMS.hooks.addHook('repeat', 'repeat', cloneSection);

        /**
         * This function group defines how to bind event handler to different types of html elements.
         */
        var bindEventHandlerToTrigger = {
            'a' : function(elem, eventHandler){
                elem.addEventListener('click', eventHandler, false);
            },

            'input.checkbox' : function(elem, eventHandler){
                elem.addEventListener('click', eventHandler, false);
            },

            'input.radio' : function(elem, eventHandler){
                var node = elem.parentNode;

                while(node.tagName.toLowerCase() != 'form'){
                    node = node.parentNode;
                }

                var radioGroup = node.querySelectorAll("input[name=\""+elem.name+"\"]");

                radioGroup.forEach(function(element){
                    wFORMS.standardizeElement(element);
                    element.addEventListener('click', eventHandler, false);
                });
            },

            'input.text' : function(elem, eventHandler){
                elem.addEventListener('change', eventHandler, false);
            },

            'option' : function(elem, eventHandler){
                var node = elem.parentNode;

                while(node.tagName.toLowerCase() != 'select'){
                    node = node.parentNode;
                }
                wFORMS.standardizeElement(node);
                //so node is the parent select object
                node.addEventListener('change', eventHandler, false);
            },

            'textarea' : function(elem, eventHandler){
                elem.addEventListener('keypress', eventHandler, false);
                elem.addEventListener('blur', eventHandler, false);
            },

            'other' : function(elem){
                //do nothing
            }
        };

        //for destruction process
        var removeEventHandlerFromTrigger = {
            'a' : function(elem, eventHandler){
                elem.removeEventListener('click', eventHandler, false);
            },
            'input.checkbox' : function(elem, eventHandler){
                elem.removeEventListener('click', eventHandler, false);
            },

            'input.radio' : function(elem, eventHandler){
                var node = elem.parentNode;

                while(node.tagName.toLowerCase() != 'form'){
                    node = node.parentNode;
                }

                var radioGroup = node.querySelectorAll("input[name=\""+elem.name+"\"]");

                radioGroup.forEach(function(element){
                    wFORMS.standardizeElement(element);
                    element.removeEventListener('click', eventHandler, false);
                });
            },

            'input.text' : function(elem, eventHandler){
                elem.removeEventListener('change', eventHandler, false);
            },

            'option' : function(elem, eventHandler){
                var node = elem.parentNode;

                while(node.tagName.toLowerCase() != 'select'){
                    node = node.parentNode;
                }
                //so node is the parent select object
                wFORMS.standardizeElement(node);
                node.removeEventListener('change', eventHandler, false);
            },

            'textarea' : function(elem, eventHandler){
                elem.removeEventListener('keypress', eventHandler, false);
                elem.removeEventListener('blur', eventHandler, false);
            },

            'other' : function(elem, eventHandler){
                //do nothing
            }
        };

        function conditionEntryCacheExisted(target, conditionType){
            if(!checkConditionTypeValidity(conditionType)){
                return null;
            }

            for(var i = 0; i < cache.length; i++){
                if(cache[i].target == target){
                    if(cache[i].conditionType != conditionType){
                        if(wFORMS.behaviors['switch']['DEBUG']){
                            alert("Target:" + target + " has registered a different conditional rule other than \""
                                    + conditionType + "\". New rule cannot be created.")
                        }
                        return null;
                    }
                    return cache[i];
                }
            }
            return null;
        }

        function checkConditionTypeValidity(conditionType){
            return new base2.JavaScript.Array2('and', 'or').contains(conditionType.toLowerCase());    
        }

        /**
         * data structure used for monitoring conditional logic
         * @param {domElement} target
         */
        var ConditionEntry = function(target, conditionType){
            this.target = target;

            conditionType = conditionType.toLowerCase();

            //judge condition type validity
            if(!checkConditionTypeValidity(conditionType)){
                return null;    
            }
            this.conditionType = conditionType;

            //triggers cache
            var triggers = (this.triggers = []);

            this.updateEntry = function(triggerElement){
                var triggerEntry = null;

                for(var i = 0; i < this.triggers.length; i++){
                    if(this.triggers[i]['dom'] == triggerElement){
                        triggerEntry = this.triggers[i];
                    }
                }
                
                if(triggerEntry == null){
                    return;
                }
                triggerEntry.status = reportTriggerStatusByElement(triggerEntry['dom']);
                this.run();
            };

            this.updateEntries = function(){
                for(var i = 0; i < this.triggers.length; i++){
                    var triggerEntry = this.triggers[i];
                    triggerEntry.status = reportTriggerStatusByElement(triggerEntry['dom']);
                }
                this.run();
            };

            /**
             *
             * @param triggerElement {domElement} trigger
             * @return whether the trigger has already registered.
             */
            this.addTrigger = function(triggerElement, eventHandler){
                //check whether the trigger has already existed
                if(triggerElementRegistered(triggerElement)){
                    return true; // then skip
                }

                this.triggers.push({
                    'dom':  triggerElement,
                    'status': reportTriggerStatusByElement(triggerElement),
                    'event_handler': eventHandler
                });
                
                return false;
            };

            this.run = function(){
                if(logic[this.conditionType]()){ // if conditional rules meet
                    target.addClass(wFORMS.behaviors['switch'].CSS_ONSTATE);
                    target.removeClass(wFORMS.behaviors['switch'].CSS_OFFSTATE);
                    wFORMS.hooks.triggerHook('switch', 'switch_on', target);
                }else{
                    target.addClass(wFORMS.behaviors['switch'].CSS_OFFSTATE);
                    target.removeClass(wFORMS.behaviors['switch'].CSS_ONSTATE);
                    wFORMS.hooks.triggerHook('switch', 'switch_off', target);
                }
            };

            this.destroy = function(){
                for(var i = 0; i < this.triggers.length; i++){
                    var triggerEntry = this.triggers[i];
                    removeEventHandlerFromTrigger[wFORMS.helpers.getElementType(triggerEntry['dom'])](triggerEntry['dom'],
                            triggerEntry['event_handler']);
                }
            };

            this.recover = function(){
                for(var i = 0; i < this.triggers.length; i++){
                    var triggerEntry = this.triggers[i];
                    bindEventHandlerToTrigger[wFORMS.helpers.getElementType(triggerEntry['dom'])](triggerEntry['dom'],
                            triggerEntry['event_handler']);
                }
                this.updateEntries();
            };

            var logic = {
                'and': function(){
                    for(var i = 0; i < triggers.length; i++){
                        if(!triggers[i].status){
                            return false;
                        }
                    }
                    return true;
                },

                'or': function(){
                    for(var i = 0; i < triggers.length; i++){
                        if(triggers[i].status){
                            return true;
                        }
                    }
                    return false;
                }
            };

            function triggerElementRegistered(triggerElement){
                for(var i = 0; i < triggers.length; i++){
                    if(triggers[i]['dom'] == triggerElement){
                        return true;
                    }
                }              
                return false;
            }
        }
	}    
};

/**
     *
     * @param element {domElement}
     * @return {String} return a string as the the following possible values:
     *  'a'
     *  'input.checkbox'
     *  'input.radio'
     *  'input.text'
     *  'textarea'
     *  'option'
     *  'other'
     */
wFORMS.helpers.getElementType = function(element){
    var tagName = element.tagName.toLowerCase();
    switch(element.tagName.toLowerCase()){
        case 'input':
            if(element.type == 'radio'){
                return 'input.radio'
            }else if(element.type == 'checkbox'){
                return 'input.checkbox'
            }else if(element.type == 'text'){
                return 'input.text'
            }
            break;
        case 'option':
        case 'textarea':
        case 'a':
        case 'select':
            return tagName;
        default:
            return 'other';
    }
};