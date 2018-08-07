
//Created by Action Script Viewer - http://www.buraks.com/asv
    class com.clubpenguin.util.QueryParams
    {
        function QueryParams () {
        }
        static function getQueryParams(testingQueryString) {
            var _local8;
            if (testingQueryString) {
                _local8 = testingQueryString;
            } else {
                _local8 = String(flash.external.ExternalInterface.call("parent.window.location.search.substring", 1));
            }
            var _local7 = {};
            var _local6 = _local8.split("&");
            var _local3 = 0;
            var _local2 = -1;
            while (_local3 < _local6.length) {
                var _local1 = _local6[_local3];
                _local2 = _local1.indexOf("=");
                if (_local2 > 0) {
                    var _local4 = _local1.substring(0, _local2);
                    _local4.toLowerCase();
                    var _local5 = _local1.substring(_local2 + 1);
                    _local7[_local4] = _local5;
                }
                _local3++;
            }
            return(_local7);
        }
    }
