
//Created by Action Script Viewer - http://www.buraks.com/asv
    class com.clubpenguin.util.StringUtils
    {
        function StringUtils () {
        }
        static function capitalizeFirstLetter(source) {
            return(source.substr(0, 1).toUpperCase() + source.substr(1, source.length));
        }
        static function toTitleCase(source) {
            var _local2 = source.split(" ");
            var _local3 = _local2.length;
            var _local1 = 0;
            while (_local1 < _local3) {
                _local2[_local1] = capitalizeFirstLetter(_local2[_local1]);
                _local1++;
            }
            return(_local2.join(" "));
        }
        static function lastChar(string) {
            if (typeof(string) != "string") {
                return("");
            }
            return(string.substr(-1, 1));
        }
        static function removeLastChar(string) {
            if (typeof(string) != "string") {
                return("");
            }
            return(string.substring(0, string.length - 1));
        }
        static function ensureTrailingSlash(string) {
            if (typeof(string) != "string") {
                return("");
            }
            if (lastChar(string) != "/") {
                string = string + "/";
            }
            return(string);
        }
        static function removeTrailingSlash(string) {
            if (typeof(string) != "string") {
                return("");
            }
            if (lastChar(string) == "/") {
                return(removeLastChar(string));
            }
            return(string);
        }
        static function replaceString(target, word, message) {
            return(message.split(target).join(word));
        }
        static function ResizeTextToFit(txt) {
            if (txt.textWidth > txt._width) {
                var _local4 = txt.text;
                txt.text = "A";
                var _local3 = txt.textHeight;
                txt.text = _local4;
                while (txt.textWidth > txt._width) {
                    var _local2 = txt.getTextFormat();
                    _local2.size--;
                    txt.setTextFormat(_local2);
                }
                txt._y = txt._y + (_local3 - txt.textHeight);
            }
        }
        static function checkStartsWithVowel(str) {
            var _local1 = str.charAt(0).toLowerCase();
            return(((((_local1 == "a") || (_local1 == "e")) || (_local1 == "i")) || (_local1 == "o")) || (_local1 == "u"));
        }
    }
