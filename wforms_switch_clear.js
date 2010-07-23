if (typeof(wFORMS) == "undefined") {
	throw new Error("wFORMS core not found. This behavior depends on the wFORMS core.");
}

wFORMS.behaviors['switch_clear'] =  {
    DEBUG: true,
    FIELD_SELECTORS: "input[type='radio'],input[type='checkbox'],input[type='text'],select,textarea",
    BLACKLIST: ["tfa_resumeLater"],


    instance: new function(){

        wFORMS.hooks.addHook('switch', 'switch_on', recoverCalculation);
        wFORMS.hooks.addHook('switch', 'switch_off', clearFieldValues);

        function clearFieldValues(element){
            var fields = element.querySelectorAll(wFORMS.behaviors['switch_clear']['FIELD_SELECTORS']);

            fields.forEach(function(elem){
                clearValue(elem);
            });
        }

        /**
         * Event Handler for target section's switch off event
         * @param element {domElement} the target section
         */
        function clearValue(element){
            if(element.id in wFORMS.behaviors['switch_clear'].BLACKLIST){
                return;
            }
            
            var type = wFORMS.helpers.getElementType(element);
            switch(type){
                case 'input.checkbox':
                case 'input.radio':
                    element.checked = false;
                    break;
                case 'input.text':
                case 'textarea':
                    element.value = '';
                    break;
                case 'select':
                    for(var i=0, l = element.options.length;i < l;i++) {
                        element.options[i].selected = false;
                    }
                    if(element.options[0].value=='') {
                        // No value is defined for the first option.
                        // We assume it to be of the 'Please select...' kind and
                        // we can safely revert to it.
                        element.selectedIndex = 0;
                        element.options[0].selected = true;
                    } else {
                        // Otherwise, clear the selection altogether.
                        element.selectedIndex = -1;
                    }
                    break;
                default:
                    // do nothing
                    break;
            }
        }

        /**
         * Event Handler for target section's switch on event
         * @param element {domElement} the target section
         */
        function recoverCalculation(element){
            // Get form element, necessary to retrieve calculation instance.
            var f = null;
            if(element.form) {
                f = element.form;
            } else {
                f = element;
                while(f && f.tagName!='FORM' && f != document) {
                    f = f.parentNode;
                }
            }

            if(f == null){
                return;
            }

            // If calculation behavior is set, run it to update dependant formulas
            var b = wFORMS.getBehaviorInstance(f,"calculation");
            if(!b) {
                return;
            }
            if(element.form) {
                // Update formula for the switch target.
                b.refresh(null,element);
            } else {
                // Update formula for nested elements.
                var fields = element.querySelectorAll(wFORMS.behaviors['switch_clear']['FIELD_SELECTORS']);
                fields.forEach(function(elem){
                    b.refresh(null,elem);
                });
            }
        }
    }
};

(function(){
     //convert black list array to hash
    var list = wFORMS.behaviors['switch_clear'].BLACKLIST;
    wFORMS.behaviors['switch_clear'].BLACKLIST = {};
    var tmp = wFORMS.behaviors['switch_clear'].BLACKLIST;
    for(var i = 0, l = list.length; i < l ; i++){
        tmp[list[i]] = true;
    }
})();