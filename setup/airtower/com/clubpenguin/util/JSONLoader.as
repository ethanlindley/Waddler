
//Created by Action Script Viewer - http://www.buraks.com/asv
    class com.clubpenguin.util.JSONLoader extends com.clubpenguin.util.EventDispatcher
    {
        var loadVars, updateListeners;
        function JSONLoader () {
            super();
        }
        function load(url) {
            raw = "";
            data = null;
            loadVars = new LoadVars();
            loadVars.onData = com.clubpenguin.util.Delegate.create(this, onData);
            loadVars.load(url);
        }
        function onData(jsonText) {
            try {
                raw = jsonText;
                data = cinqetdemi.JSON.parse(jsonText);
                updateListeners(COMPLETE);
            } catch(e:Error) {
                updateListeners(FAIL);
            }
        }
        function toString() {
            return("[JSONLoader]");
        }
        static var COMPLETE = "complete";
        static var FAIL = "fail";
        static var CLASS_NAME = "com.clubpenguin.util.JSONLoader";
        var raw = "";
        var data = null;
    }
