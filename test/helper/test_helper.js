function  fireEvent(element,event){
    base2.DOM.bind(element);
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent(event, true, true ); // event type,bubbling,cancelable
    return !element.dispatchEvent(evt);
}

function hasClass(className, theClass){
    return className.indexOf(theClass) != -1;
}