class com.clubpenguin.net.Airtower
{
    var shell, LOGIN_IP, LOGIN_PORT_EVEN, LOGIN_PORT_ODD, on_login_response, on_world_response;
    function Airtower(shell, loginServer)
    {
        this.shell = shell;
        LOGIN_IP = loginServer.ip[shell.randBetween(0, loginServer.ip.length - 1)];
        LOGIN_PORT_EVEN = loginServer.even_port;
        LOGIN_PORT_ODD = loginServer.odd_port;
        server = new com.clubpenguin.net.Connection();
    } // End of the function
    function addListener(type, func, scope)
    {
        if (type == undefined || func == undefined)
        {
            shell.$e("addListner() -> You must pass a valid listener type and function! type: " + type + " func: " + func);
            return (false);
        } // end if
        var _loc3 = this.getListenersArray(type);
        var _loc4 = this.getListenerIndex(_loc3, func);
        if (_loc4 == -1)
        {
            shell.$d("[airtower] Successfully added listener to: \"" + type + "\"");
            _loc3.push({func: func, scope: scope});
            return (true);
        } // end if
        shell.$d("[airtower] Failed to add listener. Tried to add a duplicate listener to: \"" + type + "\"");
        return (false);
    } // End of the function
    function removeListener(type, func)
    {
        var _loc2 = this.getListenersArray(type);
        var _loc3 = this.getListenerIndex(_loc2, func);
        if (_loc3 != -1)
        {
            shell.$d("[airtower] Successfully removed listener from: \"" + type + "\"");
            _loc2.splice(_loc3, 1);
            return (true);
        } // end if
        shell.$d("[airtower] Failed to remove listener which did not exist from: \"" + type + "\"");
        return (false);
    } // End of the function
    function getListenerIndex(array, func)
    {
        var _loc2 = array.length;
        for (var _loc1 = 0; _loc1 < _loc2; ++_loc1)
        {
            if (array[_loc1].func == func)
            {
                return (_loc1);
            } // end if
        } // end of for
        return (-1);
    } // End of the function
    function updateListeners(type, obj)
    {
        var _loc3 = this.getListenersArray(type);
        var _loc5 = _loc3.length;
        if (_loc5 < 1)
        {
            shell.$d("[airtower] No listeners currently attached to: \"" + type + "\"");
            return (false);
        } // end if
        if (_loc5 == 1)
        {
            _loc3[0].scope ? (_loc3[0].func.call(_loc3[0].scope, obj)) : (_loc3[0].func(obj));
            return (true);
        } // end if
        for (var _loc2 = 0; _loc2 < _loc5; ++_loc2)
        {
            _loc3[_loc2].scope ? (_loc3[_loc2].func.call(_loc3[_loc2].scope, obj)) : (_loc3[_loc2].func(obj));
        } // end of for
        return (true);
    } // End of the function
    function getListenersArray(type)
    {
        if (sf_listener_container[type] == undefined)
        {
            sf_listener_container[type] = new Array();
        } // end if
        return (sf_listener_container[type]);
    } // End of the function
    function onAirtowerResponse(eventData, type)
    {
        var _loc2 = eventData.shift();
        this.updateListeners(_loc2, eventData);
    } // End of the function
    function setConnection(connection)
    {
        server = connection || server;
    } // End of the function
    function connectToLogin(in_username, in_pass, login_response)
    {
        if (!is_logged_in)
        {
            on_login_response = login_response;
            username = in_username;
            password = in_pass;
            server.onConnection = com.clubpenguin.util.Delegate.create(this, handleLoginConnection);
            server.onRandomKey = com.clubpenguin.util.Delegate.create(this, handleLoginRandomKey);
            server.onExtensionResponse = com.clubpenguin.util.Delegate.create(this, onAirtowerResponse);
            server.debug = true;
            this.addListener(HANDLE_LOGIN, handleOnLogin, this);
            var _loc2 = this.getLoginServerPort(in_username);
            server.connect(LOGIN_IP, _loc2);
        }
        else
        {
            shell.$e("connectToLogin() -> Your already logged in! Cant login again");
        } // end else if
    } // End of the function
    function getLoginServerPort(nickname)
    {
        var _loc2 = nickname.charCodeAt(0);
        if (_loc2 % 2 == 0)
        {
            return (LOGIN_PORT_EVEN);
        } // end if
        return (LOGIN_PORT_ODD);
    } // End of the function
    function handleLostConnection()
    {
        this.updateListeners(CONNECTION_LOST, null);
    } // End of the function
    function handleLoginConnection(success)
    {
        if (success)
        {
            server.getRandomKey();
        }
        else
        {
            server.disconnect();
            this.on_login_response(false);
        } // end else if
    } // End of the function
    function handleLoginRandomKey(key)
    {
        rand_key = key;
        this.login();
    } // End of the function
    function login()
    {
        server.login(com.clubpenguin.net.Airtower.LOGIN_ZONE, username, com.clubpenguin.crypto.ZASETH.encryptZaseth(password, rand_key));
    } // End of the function
    function handleOnLogin(obj)
    {
        this.removeListener(HANDLE_LOGIN, handleOnLogin);
        server.disconnect();
        shell.setMyPlayerId(obj[1]);
        playerId = obj[1];
        shell.updateWorldPopulations(obj[4]);
        shell.setWorldsWithBuddies(obj[3]);
        login_key = obj[2];
        this.on_login_response(true);
        is_logged_in = true;
    } // End of the function
    function connectToRedemption(server_ip, server_port, connect_to_world_response)
    {
        isRedemption = true;
        on_world_response = connect_to_world_response;
        server.onConnection = com.clubpenguin.util.Delegate.create(this, handleWorldConnection);
        server.onRandomKey = com.clubpenguin.util.Delegate.create(this, handleWorldRandomKey);
        this.addListener(HANDLE_LOGIN, joinWorld, this);
        server.connect(server_ip, server_port);
    } // End of the function
    function connectToWorld(server_ip, server_port, connect_to_world_response)
    {
        isRedemption = false;
        on_world_response = connect_to_world_response;
        server.onConnection = com.clubpenguin.util.Delegate.create(this, handleWorldConnection);
        server.onRandomKey = com.clubpenguin.util.Delegate.create(this, handleWorldRandomKey);
        this.addListener(HANDLE_LOGIN, joinWorld, this);
        server.connect(server_ip, server_port);
    } // End of the function
    function handleWorldConnection(success)
    {
        if (success)
        {
            server.getRandomKey();
        }
        else
        {
            server.onConnection = null;
            server.onConnectionLost = null;
            server.onRandomKey = null;
            server.onExtensionResponse = null;
            this.on_world_response(false, false, false, false, false);
            on_world_response = null;
        } // end else if
    } // End of the function
    function handleWorldRandomKey(key)
    {
        rand_key = key;
        this.worldLogin();
    } // End of the function
    function worldLogin()
    {
        server.login(com.clubpenguin.net.Airtower.SERVER_ZONE, username, com.clubpenguin.crypto.ZASETH.encryptZaseth(login_key, rand_key));
    } // End of the function
    function joinWorld()
    {
        this.removeListener(HANDLE_LOGIN, joinWorld);
        server.onConnectionLost = com.clubpenguin.util.Delegate.create(this, handleLostConnection);
        var _loc2 = new Array();
        _loc2.push(playerId);
        _loc2.push(login_key);
        _loc2.push(shell.getLanguageAbbriviation());
        var _loc3 = com.clubpenguin.util.QueryParams.getQueryParams();
        if (Number(_loc3.rm))
        {
            _loc2.push(Number(_loc3.rm));
        } // end if
        if (isRedemption)
        {
            this.addListener(REDEMPTION_JOIN_WORLD, handleJoinRedemption, this);
            this.send(REDEMPTION, REDEMPTION_JOIN_WORLD, _loc2, "str", -1);
            return;
        } // end if
        this.addListener(JOIN_WORLD, handleJoinWorld, this);
        this.send(PLAY_EXT, NAVIGATION + "#" + JOIN_WORLD, _loc2, "str", -1);
    } // End of the function
    function handleJoinRedemption(obj)
    {
        this.removeListener(REDEMPTION_JOIN_WORLD, handleJoinRedemption);
        var _loc4 = new Array();
        var _loc5 = new Array();
        var _loc6 = false;
        var _loc7 = obj.shift();
        if (obj[0] != "")
        {
            _loc4 = obj[0];
        } // end if
        if (obj[1] != "")
        {
            _loc5 = obj[1];
        } // end if
        if (obj[2] != "")
        {
            _loc6 = Boolean(Number(obj[2]));
        } // end if
        var _loc3 = new Array();
        _loc3[0] = _loc4;
        _loc3[1] = _loc5;
        _loc3[2] = _loc6;
        this.on_world_response(_loc3);
        on_world_response = undefined;
    } // End of the function
    function handleJoinWorld(obj)
    {
        this.removeListener(JOIN_WORLD, handleJoinWorld);
        var _loc6 = Boolean(Number(obj[1]));
        var _loc3 = Boolean(Number(obj[2]));
        var _loc5 = Boolean(Number(obj[3]));
        var _loc4 = Boolean(Number(obj[4]));
        this.on_world_response(true, _loc6, _loc3, _loc5, _loc4);
        on_world_response = undefined;
    } // End of the function
    function send(extension, command, arr, type, room_id)
    {
        server.sendXtMessage(extension, command, arr, type, room_id);
    } // End of the function
    function disconnect()
    {
        if (server.connected())
        {
            server.disconnect();
        }
        else
        {
            shell.$d("[airtower] disconnect() -> Trying to disconnect the server when its not connected");
        } // end else if
    } // End of the function
    static var linkageId = "__Packages.com.clubpenguin.net.Airtower";
    static var serializable = Object.registerClass(com.clubpenguin.net.Airtower.linkageId, com.clubpenguin.net.Airtower);
    var STRING_TYPE = "str";
    var XML_TYPE = "xml";
    var PLAY_EXT = "s";
    var GAME_EXT = "z";
    var NAVIGATION = "j";
    var PLAYER_HANDLER = "u";
    var ITEM_HANDLER = "i";
    var IGNORE_HANDLER = "n";
    var BUDDY_HANDLER = "b";
    var TOY_HANDLER = "t";
    var TABLE_HANDLER = "a";
    var IGLOO_HANDLER = "g";
    var PET_HANDLER = "p";
    var MESSAGE_HANDLER = "m";
    var MAIL_HANDLER = "l";
    var SURVEY_HANDLER = "e";
    var WADDLE = "w";
    var SETTING_HANDLER = "s";
    var MODERATION_HANDLER = "o";
    var NINJA_HANDLER = "ni";
    var ROOM_HANDLER = "r";
    var REDEMPTION = "red";
    var REDEMPTION_JOIN_WORLD = "rjs";
    var HANDLE_LOGIN = "l";
    var HANDLE_ALERT = "a";
    var HANDLE_ERROR = "e";
    var GET_BUDDY_LIST = "gb";
    var GET_IGNORE_LIST = "gn";
    var GET_PLAYER = "gp";
    var GET_ROOM_LIST = "gr";
    var GET_TABLE = "gt";
    var JOIN_WORLD = "js";
    var JOIN_ROOM = "jr";
    var REFRESH_ROOM = "grs";
    var LOAD_PLAYER = "lp";
    var ADD_PLAYER = "ap";
    var REMOVE_PLAYER = "rp";
    var UPDATE_PLAYER = "up";
    var PLAYER_MOVE = "sp";
    var PLAYER_FRAME = "sf";
    var PLAYER_ACTION = "sa";
    var OPEN_BOOK = "at";
    var CLOSE_BOOK = "rt";
    var THROW_BALL = "sb";
    var JOIN_GAME = "jg";
    var SEND_MESSAGE = "sm";
    var SEND_BLOCKED_MESSAGE = "mm";
    var SEND_EMOTE = "se";
    var SEND_JOKE = "sj";
    var SEND_SAFE_MESSAGE = "ss";
    var SEND_LINE_MESSAGE = "sl";
    var SEND_QUICK_MESSAGE = "sq";
    var SEND_TOUR_GUIDE_MESSAGE = "sg";
    var COIN_DIG_UPDATE = "cdu";
    var GET_INVENTORY_LIST = "gi";
    var MAIL_START_ENGINE = "mst";
    var GET_MAIL = "mg";
    var SEND_MAIL = "ms";
    var RECEIVE_MAIL = "mr";
    var DELETE_MAIL = "md";
    var DELETE_MAIL_FROM_PLAYER = "mdp";
    var GET_MAIL_DETAILS = "mgd";
    var MAIL_CHECKED = "mc";
    var GAME_OVER = "zo";
    var BUY_INVENTORY = "ai";
    var CHECK_INVENTORY = "qi";
    var ADD_IGNORE = "an";
    var REMOVE_IGNORE = "rn";
    var REMOVE_BUDDY = "rb";
    var REQUEST_BUDDY = "br";
    var ACCEPT_BUDDY = "ba";
    var BUDDY_ONLINE = "bon";
    var BUDDY_OFFLINE = "bof";
    var FIND_BUDDY = "bf";
    var GET_PLAYER_OBJECT = "gp";
    var REPORT_PLAYER = "r";
    var UPDATE_PLAYER_COLOUR = "upc";
    var UPDATE_PLAYER_HEAD = "uph";
    var UPDATE_PLAYER_FACE = "upf";
    var UPDATE_PLAYER_NECK = "upn";
    var UPDATE_PLAYER_BODY = "upb";
    var UPDATE_PLAYER_HAND = "upa";
    var UPDATE_PLAYER_FEET = "upe";
    var UPDATE_PLAYER_FLAG = "upl";
    var UPDATE_PLAYER_PHOTO = "upp";
    var UPDATE_PLAYER_REMOVE = "upr";
    var GET_FURNITURE_LIST = "gf";
    var UPDATE_ROOM = "up";
    var UPDATE_FLOOR = "ag";
    var UPDATE_IGLOO_TYPE = "au";
    var UNLOCK_IGLOO = "or";
    var LOCK_IGLOO = "cr";
    var UPDATE_IGLOO_MUSIC = "um";
    var GET_IGLOO_DETAILS = "gm";
    var JOIN_PLAYER_IGLOO = "jp";
    var SAVE_IGLOO_FURNITURE = "ur";
    var GET_IGLOO_LIST = "gr";
    var BUY_FURNITURE = "af";
    var SEND_IGLOO = "sig";
    var GET_OWNED_IGLOOS = "go";
    var ACTIVATE_IGLOO = "ao";
    var GET_MY_PLAYER_PUFFLES = "pgu";
    var GET_PLAYER_PUFFLES = "pg";
    var PUFFLE_FRAME = "ps";
    var PUFFLE_MOVE = "pm";
    var REST_PUFFLE = "pr";
    var BATH_PUFFLE = "pb";
    var PLAY_PUFFLE = "pp";
    var FEED_PUFFLE = "pf";
    var WALK_PUFFLE = "pw";
    var TREAT_PUFFLE = "pt";
    var INTERACTION_PLAY = "ip";
    var INTERACTION_REST = "ir";
    var INTERACTION_FEED = "if";
    var PUFFLE_INIT_INTERACTION_PLAY = "pip";
    var PUFFLE_INIT_INTERACTION_REST = "pir";
    var ADOPT_PUFFLE = "pn";
    var UPDATE_TABLE = "ut";
    var GET_TABLE_POPULATION = "gt";
    var JOIN_TABLE = "jt";
    var LEAVE_TABLE = "lt";
    var UPDATE_WADDLE = "uw";
    var GET_WADDLE_POPULATION = "gw";
    var JOIN_WADDLE = "jw";
    var LEAVE_WADDLE = "lw";
    var START_WADDLE = "sw";
    var SEND_WADDLE = "jx";
    var SPY_PHONE_REQUEST = "spy";
    var HEARTBEAT = "h";
    var TIMEOUT = "t";
    var MODERATOR_ACTION = "ma";
    var KICK = "k";
    var MUTE = "m";
    var BAN = "b";
    var SEND_MASCOT_MESSAGE = "sma";
    var DONATE = "dc";
    var POLL = "spl";
    var CONNECTION_LOST = "con";
    var GET_CARDS = "gcd";
    var GET_NINJA_LEVEL = "gnl";
    var GET_FIRE_LEVEL = "gfl";
    var GET_WATER_LEVEL = "gwl";
    var GET_NINJA_RANKS = "gnr";
    var GET_LAST_REVISION = "glr";
    static var LOGIN_ZONE = "w1";
    static var SERVER_ZONE = "w1";
    var server_ip = "";
    var server_port = 0;
    var username = "";
    var password = "";
    var playerId = -1;
    var rand_key = "";
    var login_key = "";
    var is_logged_in = false;
    var server = null;
    var sf_listener_container = new Object();
    var isRedemption = false;
} // End of Class
