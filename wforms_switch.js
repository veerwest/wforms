
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
    SELECTOR : '.target',

    RULE_ATTRIBUTE_NAME : 'rule',

    /**
     * pattern for trigger info in target host in the css style list
     * @param elem
     */
    TRIGGER_RULES: /((and)|(or))\[(.*)\]/,

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
     * Factory Method.
     * Applies the behavior to the given HTML element by setting the appropriate event handlers.
     * @param {domElement} f An HTML element, either nested inside a FORM element or (preferably) the FORM element itself.
     * @return {object} an instance of the behavior
     */
    applyTo : function(f){
        wFORMS.behaviors['switch'].instance.applyTo(f);
        wFORMS.behaviors['switch'].onApply();
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
//		this.target   = f;
		var cache = ( this.cache = []);
        /*
         Public methods
         */
        this.applyTo = function(f){
            base2.DOM.bind(f);
            getTargets(f).forEach(function (element){
                createConditionEntry(element)
            });
        };

        this.onApply = function(){
            //meant to be overridden
        };

        this.destroy = function(f){
            getTargets(f).forEach(function (element){
                for(var i = 0; i < cache.length; i++){
                    if(cache[i].target == element){
                        cache[i].destroy();
                    }
                }
            });
        };

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

        /*
            Private methods
         */
        var getTargets = function(f){
            return f.querySelectorAll(wFORMS.behaviors['switch'].SELECTOR);
        };

        /**
         *
         * @param {domElement} target
         */
        var createConditionEntry = function(target){
            var rule = target.getAttribute(wFORMS.behaviors['switch'].RULE_ATTRIBUTE_NAME);

            if(rule == null){
                return;
            }

            var m = rule.match(wFORMS.behaviors['switch'].TRIGGER_RULES);

            if ( m == null){
                return;
            }

            var logic = m[1], // 'and' or 'or'
                targets = m[4].split('|'); // trigger elements

            var conditionEntry = null, temp;

            //check whether a condition entry for the target has already existed
            if( !(temp = conditionEntryCacheExisted(target, logic) )){
                conditionEntry = new ConditionEntry(target, logic);
               //add to cache
                cache.push(conditionEntry);
            }else{
                conditionEntry = temp;
            }

            if (conditionEntry == null) return;

            for(var i = 0; i < targets.length; i++){
                var cssSelector = targets[i];
                var triggerElement = base2.DOM.Element.querySelector(document, cssSelector);

                if(triggerElement == null){ // then the trigger actually does not exist, skip this rule
                    continue;
                }

                //generate event handler for triggerElement( store it now for later destruction purpose)
                var eventHandler = generateEventHandlerForTrigger(cssSelector, triggerElement, conditionEntry);

                //add trigger to condition entry
                var triggerExisted = conditionEntry.addTrigger(cssSelector, triggerElement, eventHandler);

                if(!triggerExisted){
                    //bind event handler to each target
                    setupTrigger(triggerElement, eventHandler);
                }
            }

            //to keep consistency of page layout, run and synchronize the condition entry and the page presentation.
            conditionEntry.run();
        };

        function setupTrigger(element, eventHandler){
            bindEventHandlerToTrigger[getTriggerElementType(element)](element, eventHandler)    
        }

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
        function getTriggerElementType(element){
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
                    return tagName;
                default:
                    return 'other';
            }
        }

        /**
         * returns element on/off status
         * @param  element {domElement} trigger html element
         */
        function reportTriggerStatusByElement(element){
            var elementType = getTriggerElementType(element);
            return reportTriggerStatusByElementType(elementType, element);
        }

        /**
         * this function defines how to check the on/off status of different types of html elements
         */
        function reportTriggerStatusByElementType(elementType, elem){
            switch(elementType){
                case 'a':
                    var status = base2.DOM.Element.getAttribute(elem, 'status');
                    if(status == null){
                        base2.DOM.Element.setAttribute(elem, 'status', 'off');
                        return false;
                    }
                    return status == 'on';
                case 'input.checkbox':
                case 'input.radio':
                    return elem.checked;
                case 'input.text':
                    return elem.value.trim().length != 0;
                case 'option':
                    return elem.selected;
                case 'textarea':
                    return elem.innerHTML.trim().length != 0;
                default:
                    return false;
            }
        }

        /**
         * This function generates a event handler( a function object), which will be used for removing event binding
         * later when needed, since removing process require the same event handler for correspondence.
         * @param cssSelector {String} css selector of the trigger element
         * @param triggerElement {domElement} trigger dom element
         * @param conditionEntry
         */
        function generateEventHandlerForTrigger(cssSelector, triggerElement, conditionEntry){
            var elementType = getTriggerElementType(triggerElement);
            switch(elementType){
                case 'a':
                    return base2.JavaScript.Function2.bind(function(){
                        var status = base2.DOM.Element.getAttribute(this['dom'], 'status');
                        if(status == null){
                            status = false;
                        }else{
                            status = (status == 'on');
                        }
                        base2.DOM.Element.setAttribute(this['dom'], 'status', !status ? 'on' : 'off');
                        this['condition_entry'].updateEntry(this['trigger_css_selector'])
                    }, {
                       dom: triggerElement,
                       trigger_css_selector: cssSelector,
                       condition_entry: conditionEntry
                    });
                default:
                    return base2.JavaScript.Function2.bind(function(){
                        this['condition_entry'].updateEntry(this['trigger_css_selector'])
                    }, {
                       trigger_css_selector: cssSelector,
                       condition_entry: conditionEntry
                    });
            }
        }

        /**
         * This function group defines how to bind event handler to different types of html elements.
         */
        var bindEventHandlerToTrigger = {
            'a' : function(elem, eventHandler){
                base2.DOM.Element.addEventListener(elem, 'click', eventHandler, false);
            },

            'input.checkbox' : function(elem, eventHandler){
                base2.DOM.Element.addEventListener(elem, 'click', eventHandler, false);
            },

            'input.radio' : function(elem, eventHandler){
                var node = elem.parentNode;

                while(node.tagName.toLowerCase() != 'form'){
                    node = node.parentNode;
                }

                var radioGroup = base2.DOM.Element.querySelectorAll(node, "input[name=\""+elem.name+"\"]");

                radioGroup.forEach(function(element){
                    base2.DOM.Element.addEventListener(element, 'click', eventHandler, false);
                });
            },

            'input.text' : function(elem, eventHandler){
                base2.DOM.Element.addEventListener(elem, 'change', eventHandler, false);
            },

            'option' : function(elem, eventHandler){
                var node = elem.parentNode;

                while(node.tagName.toLowerCase() != 'select'){
                    node = node.parentNode;
                }
                //so node is the parent select object
                base2.DOM.Element.addEventListener(node, 'change', eventHandler, false);
            },

            'textarea' : function(elem, eventHandler){
                base2.DOM.Element.addEventListener(elem, 'keypress', eventHandler, false);
            },

            'other' : function(elem){
                //do nothing
            }
        };

        //for destruction process
        var removeEventHandlerFromTrigger = {
            'a' : function(elem, eventHandler){
                base2.DOM.Element.removeEventListener(elem, 'click', eventHandler);
            },
            'input.checkbox' : function(elem, eventHandler){
                base2.DOM.Element.removeEventListener(elem, 'click', eventHandler);
            },

            'input.radio' : function(elem, eventHandler){
                var node = elem.parentNode;

                while(node.tagName.toLowerCase() != 'form'){
                    node = node.parentNode;
                }

                var radioGroup = base2.DOM.Element.querySelectorAll(node, "input[name=\""+elem.name+"\"]");

                radioGroup.forEach(function(element){
                    base2.DOM.Element.removeEventListener(element, 'click', eventHandler, false);
                });
            },

            'input.text' : function(elem, eventHandler){
                base2.DOM.Element.removeEventListener(elem, 'change', eventHandler);
            },

            'option' : function(elem, eventHandler){
                var node = elem.parentNode;

                while(node.tagName.toLowerCase() != 'select'){
                    node = node.parentNode;
                }
                //so node is the parent select object
                base2.DOM.Element.removeEventListener(node, 'change', eventHandler);
            },

            'textarea' : function(elem, eventHandler){
                base2.DOM.Element.removeEventListener(elem, 'keypress', eventHandler);
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
            var triggers = (this.triggers = {});

            this.updateEntry = function(trigger_css_selector){
                var triggerEntry = this.triggers[trigger_css_selector];

                if(triggerEntry == null){
                    return;
                }
                triggerEntry.status = reportTriggerStatusByElement(triggerEntry['dom']);
                this.run();
            };

            this.updateEntries = function(){
                for(var key in this.triggers){
                    var triggerEntry = this.triggers[key];
                    triggerEntry.status = reportTriggerStatusByElement(triggerEntry['dom']);
                }
                this.run();
            };

            /**
             *
             * @param triggerElement {domElement} trigger
             * @return whether the trigger has already registered.
             */
            this.addTrigger = function(cssSelector, triggerElement, eventHandler){
                //check whether the trigger has already existed
                if(triggerElementRegistered(triggerElement)){
                    return true; // then skip
                }

                this.triggers[cssSelector] = {
                    'dom':  triggerElement,
                    'status': reportTriggerStatusByElement(triggerElement),
                    'event_handler': eventHandler
                };
                
                return false;
            };

            this.run = function(){
                if(logic[this.conditionType]()){ // if conditional rules meet
                    target.addClass(wFORMS.behaviors['switch'].CSS_ONSTATE);
                    target.removeClass(wFORMS.behaviors['switch'].CSS_OFFSTATE);
                }else{
                    target.addClass(wFORMS.behaviors['switch'].CSS_OFFSTATE);
                    target.removeClass(wFORMS.behaviors['switch'].CSS_ONSTATE);
                }
            };

            this.destroy = function(){
                for(var key in this.triggers){
                    removeEventHandlerFromTrigger[getTriggerElementType(this.triggers[key].dom)](this.triggers[key].dom,
                            this.triggers[key].event_handler);
                }
                this.triggers = null;
            };

            var logic = {
                'and': function(){
                    for(var key in triggers){
                        if(!triggers[key].status){
                            return false;
                        }
                    }
                    return true;
                },

                'or': function(){
                    for(var key in triggers){
                        if(triggers[key].status){
                            return true;
                        }
                    }
                    return false;
                }
            };

            function triggerElementRegistered(triggerElement){
                for(var key in triggers){
                    if (triggers[key]['dom'] == triggerElement){
                        return true;
                    }
                }
                return false;
            }
        }
	}    
};