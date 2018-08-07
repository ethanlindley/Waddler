
//Created by Action Script Viewer - http://www.buraks.com/asv
    class com.clubpenguin.util.Timeout
    {
        var __get__onStop;
        function Timeout (time, func, params, scope) {
            _time = time * com.clubpenguin.util.Time.ONE_SECOND_IN_MILLISECONDS;
            _func = func;
            _params = params;
            _scope = scope;
        }
        function start() {
            _id = _global.setTimeout(com.clubpenguin.util.Delegate.create(this, handler), _time, _params);
        }
        function stop() {
            _global.clearTimeout(_id);
            _onStop(this);
            cleanUp();
        }
        function handler(params) {
            if (_scope == undefined) {
                _func(params);
            } else {
                _func.call(_scope, params);
            }
            this.stop();
        }
        function cleanUp() {
            _id = -1;
            _time = -1;
            _func = undefined;
            _params = undefined;
            _scope = undefined;
            _onStop = undefined;
        }
        function set onStop(func) {
            _onStop = func;
            //return(__get__onStop());
        }
        function toString() {
            var _local2 = "";
            _local2 = _local2 + "Timeout -> ";
            _local2 = _local2 + (" id: " + _id);
            _local2 = _local2 + (" time: " + _time);
            _local2 = _local2 + (" func: " + _func);
            _local2 = _local2 + (" params: " + _params);
            _local2 = _local2 + (" scope: " + _scope);
            _local2 = _local2 + (" onStop: " + _onStop);
            return(_local2);
        }
        var _id = -1;
        var _time = -1;
        var _func = undefined;
        var _params = undefined;
        var _scope = undefined;
        var _onStop = undefined;
    }
