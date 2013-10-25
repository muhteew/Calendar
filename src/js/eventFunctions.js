var addEvent, removeEvent;

if (document.addEventListener) { // проверка существования метода
    addEvent = function(elem, type, handler) {
        elem.addEventListener(type, handler, false);
    };
    removeEvent = function(elem, type, handler) {
        elem.removeEventListener(type, handler, false);
    };
} else {
    addEvent = function(elem, type, handler) {
        elem.attachEvent("on" + type, handler);
    };
    removeEvent = function(elem, type, handler) {
        elem.detachEvent("on" + type, handler);
    };
}
