﻿
//Created by Action Script Viewer - http://www.buraks.com/asv
    class org.osflash.signals.Signal implements org.osflash.signals.ISignal, org.osflash.signals.IDispatcher
    {
        var listenerBoxes, _valueClasses;
        function Signal () {
            listenerBoxes = [];
            setValueClasses(arguments);
        }
        function getNumListeners() {
            return(listenerBoxes.length);
        }
        function getValueClasses() {
            return(_valueClasses);
        }
        function add(listener, scope) {
            registerListener(listener, scope, false);
        }
        function addOnce(listener, scope) {
            registerListener(listener, scope, true);
        }
        function remove(listener, scope) {
            if (listenersNeedCloning) {
                listenerBoxes = listenerBoxes.slice();
                listenersNeedCloning = false;
            }
            var _local2 = listenerBoxes.length;
            while (_local2--) {
                if ((listenerBoxes[_local2].listener == listener) && (listenerBoxes[_local2].scope == scope)) {
                    listenerBoxes.splice(_local2, 1);
                    return(undefined);
                }
            }
        }
        function removeAll() {
            var _local2 = listenerBoxes.length;
            while (_local2--) {
                remove(listenerBoxes[_local2].listener, listenerBoxes[_local2].scope);
            }
        }
        function dispatch() {
            var _local6;
            var _local3 = 0;
            while (_local3 < _valueClasses.length) {
                if (primitiveMatchesValueClass(arguments[_local3], _valueClasses[_local3])) {
                } else {
                    _local6 = arguments[_local3];
                    if ((_local6 == null) || (_local6 instanceof _valueClasses[_local3])) {
                    } else {
                        throw new Error(((("Value object <" + _local6) + "> is not an instance of <") + _valueClasses[_local3]) + ">.");
                    }
                }
                _local3++;
            }
            var _local7 = listenerBoxes;
            var _local8 = _local7.length;
            var _local4;
            var _local9;
            listenersNeedCloning = true;
            var _local5 = 0;
            while (_local5 < _local8) {
                _local4 = _local7[_local5];
                if (_local4.once) {
                    remove(_local4.listener, _local4.scope);
                }
                _local4.listener.apply(_local4.scope, arguments);
                _local5++;
            }
            listenersNeedCloning = false;
        }
        function primitiveMatchesValueClass(primitive, valueClass) {
            if ((((typeof(primitive) == "string") && (valueClass == String)) || ((typeof(primitive) == "number") && (valueClass == Number))) || ((typeof(primitive) == "boolean") && (valueClass == Boolean))) {
                return(true);
            }
            return(false);
        }
        function setValueClasses(valueClasses) {
            _valueClasses = valueClasses || ([]);
            var _local2 = _valueClasses.length;
            while (_local2--) {
                if (!(_valueClasses[_local2] instanceof Function)) {
                    throw new Error(((("Invalid valueClasses argument: item at index " + _local2) + " should be a Class but was:<") + _valueClasses[_local2]) + ">.");
                }
            }
        }
        function registerListener(listener, scope, once) {
            var _local2 = 0;
            while (_local2 < listenerBoxes.length) {
                if ((listenerBoxes[_local2].listener == listener) && (listenerBoxes[_local2].scope == scope)) {
                    if (listenerBoxes[_local2].once && (!once)) {
                        throw new Error("You cannot addOnce() then try to add() the same listener without removing the relationship first.");
                    } else if (once && (!listenerBoxes[_local2].once)) {
                        throw new Error("You cannot add() then addOnce() the same listener without removing the relationship first.");
                    }
                    return(undefined);
                }
                _local2++;
            }
            if (listenersNeedCloning) {
                listenerBoxes = listenerBoxes.slice();
            }
            listenerBoxes.push({listener:listener, scope:scope, once:once});
        }
        var listenersNeedCloning = false;
    }
