
//Created by Action Script Viewer - http://www.buraks.com/asv
    class com.clubpenguin.util.Enumeration
    {
        var __constructor__, _value;
        function Enumeration (value_p) {
            var _local2 = __constructor__;
            if (value_p == null) {
                _value = ((_local2.__enumCount == null) ? ((_local2.__enumCount = 0)) : (++_local2.__enumCount));
            } else {
                _value = value_p;
                if ((_local2.__enumCount == null) || (value_p > _local2.__enumCount)) {
                    _local2.__enumCount = value_p;
                }
            }
        }
        function get name() {
            for (var _local2 in __constructor__) {
                if (this == __constructor__[_local2]) {
                    return(_local2);
                }
            }
            return(null);
        }
        function get value() {
            return(_value);
        }
    }
