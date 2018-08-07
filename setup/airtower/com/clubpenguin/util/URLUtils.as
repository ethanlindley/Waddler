﻿class com.clubpenguin.util.URLUtils
{
    static var runningLocal;
    function URLUtils()
    {
    } // End of the function
    static function getCacheResetURL(url)
    {
        if (!com.clubpenguin.util.URLUtils.cacheResetEnabled)
        {
            return (url);
        } // end if
        if (com.clubpenguin.util.URLUtils.isRunningLocal() || url.indexOf(".swf") == -1)
        {
            return (url);
        } // end if
        if (url.indexOf(com.clubpenguin.util.URLUtils.CACHE_RESET_PARAM_NAME + "=" + com.clubpenguin.util.URLUtils.CACHE_RESET_PARAM_VALUE) != -1)
        {
            return (url);
        } // end if
        var _loc2 = url + "?" + com.clubpenguin.util.URLUtils.CACHE_RESET_PARAM_NAME + "=" + com.clubpenguin.util.URLUtils.CACHE_RESET_PARAM_VALUE;
        return (_loc2);
    } // End of the function
    static function resetCacheOnURLsInObject(object)
    {
        for (var _loc3 in object)
        {
            var _loc2 = com.clubpenguin.util.URLUtils.getCacheResetURL(object[_loc3]);
            object[_loc3] = _loc2;
        } // end of for...in
    } // End of the function
    static function isRunningLocal()
    {
        if (com.clubpenguin.util.URLUtils.runningLocal != undefined)
        {
            return (com.clubpenguin.util.URLUtils.runningLocal);
        } // end if
        runningLocal = false;
        if (_root._url.indexOf("file") == 0)
        {
            runningLocal = true;
        } // end if
        return (com.clubpenguin.util.URLUtils.runningLocal);
    } // End of the function
    static var CACHE_RESET_PARAM_NAME = "cr";
    static var CACHE_RESET_PARAM_VALUE = 1;
    static var cacheResetEnabled = false;
} // End of Class