
//Created by Action Script Viewer - http://www.buraks.com/asv
    class com.clubpenguin.util.EventDispatcher implements com.clubpenguin.util.IEventDispatcher
    {
        function EventDispatcher () {
        }
        function addEventListener(eventType, handler, scope) {
            if (!eventType.length) {
            }
            if (!(handler instanceof Function)) {
            }
            var _local3 = getListenersArray(this, eventType);
            var _local4 = getListenerIndex(_local3, handler, scope);
            if (_local4 == -1) {
                _local3.push({handler:handler, scope:scope});
                return(true);
            }
            return(false);
        }
        function removeEventListener(eventType, handler, scope) {
            if (!eventType.length) {
            }
            if (!(handler instanceof Function)) {
            }
            var _local3 = getListenersArray(this, eventType);
            var _local4 = getListenerIndex(_local3, handler, scope);
            if (_local4 != -1) {
                _local3.splice(_local4, 1);
                return(true);
            }
            return(false);
        }
        function updateListeners(eventType, event) {
            if (event == undefined) {
                event = {};
            }
            event.type = eventType;
            return(dispatchEvent(event));
        }
        function dispatchEvent(event) {
            if (!event.type.length) {
            }
            if (event.target == undefined) {
                event.target = this;
            }
            var _local3 = getListenersArray(this, event.type).concat();
            var _local5 = _local3.length;
            if (_local5 < 1) {
                return(false);
            }
            var _local2 = 0;
            while (_local2 < _local5) {
                (_local3[_local2].scope ? (_local3[_local2].handler.call(_local3[_local2].scope, event)) : (_local3[_local2].handler(event)));
                _local2++;
            }
            return(true);
        }
        static function getListenerIndex(listeners, handler, scope) {
            var _local4 = listeners.length;
            var _local1 = 0;
            while (_local1 < _local4) {
                if ((listeners[_local1].handler == handler) && ((scope == undefined) || (listeners[_local1].scope == scope))) {
                    return(_local1);
                }
                _local1++;
            }
            return(-1);
        }
        static function getListenersArray(eventSource, eventType) {
            if (!eventSource.__listener_obj) {
                eventSource.__listener_obj = {};
            }
            if (!eventSource.__listener_obj[eventType]) {
                eventSource.__listener_obj[eventType] = [];
            }
            return(eventSource.__listener_obj[eventType]);
        }
        static function initialize(eventSource) {
            eventSource.addEventListener = com.clubpenguin.util.EventDispatcher.prototype.addEventListener;
            eventSource.removeEventListener = com.clubpenguin.util.EventDispatcher.prototype.removeEventListener;
            eventSource.addListener = com.clubpenguin.util.EventDispatcher.prototype.addEventListener;
            eventSource.removeListener = com.clubpenguin.util.EventDispatcher.prototype.removeEventListener;
            eventSource.dispatchEvent = com.clubpenguin.util.EventDispatcher.prototype.dispatchEvent;
            eventSource.updateListeners = com.clubpenguin.util.EventDispatcher.prototype.updateListeners;
        }
    }
