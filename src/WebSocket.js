/// <reference path="Application.js" />
/// <reference path="DS.js" />

(function () {
    var _PushServices = function (pusher) {
        var _pusher = pusher;
        var state = {
            CONNECTING: 0,
            OPEN: 1,
            CLOSING: 2,
            CLOSED: 3
        };
        var ws = false;
        var commands = {};
        var type = "MozWebSocket" in window ? 'MozWebSocket' : ("WebSocket" in window ? 'WebSocket' : null);
        function _connect() {
            app.logInfo("Socket type:" + type);
            if (type) {
                ws = false;
                var _ws = new window[type](_pusher);
                if ($D.IE) {
                    _ws.onopen = onopen;
                    _ws.onmessage = onmessage;
                    _ws.onclose = onclose;
                    _ws.onerror = onerror;
                } else {
                    _ws.addEventListener('open', onopen);
                    _ws.addEventListener('message', onmessage);
                    _ws.addEventListener('close', onclose);
                    _ws.addEventListener('error', onerror);
                }
                commands["Login"] = app.logError;
            }
        }
        function loginWS() {
            var data = { Date: DS.LatestUpdateOn(),
                UserId: DS.UserID(),
                CompanyId: DS.CompanyID(),
                SubSys: 2,
                LoginSys: 2,
                Platform: app.platform(),
                Version: app.appVer()
            };
            sendMessage("Login-" + DS.WebAuthKey(), data);
        }
        function onopen(event) {
            ws = event.target || event;
            console.log("web socket onopen calling...");
            console.log(JSON.stringify(event));
            loginWS();
        }
        function onerror(event) {
            console.log(event);
        }
        function onmessage(event) {
            var data = event.data;
            if (typeof (data) == 'string')
                data = JSON.parse(data);
            if (data.cmd && commands[data.cmd])
                commands[data.cmd](data);
            delete data;
        }
        function sendMessage(cmd, message) {
            message = message || "";
            if (typeof (message) != 'string')
                message = JSON.stringify(message);
            if (isConnected()) {
                ws.send(cmd + " " + message);
            }
        }
        function onclose(event) {
            if (ws == false) {
                app.showtips("无法连接到推送服务器.", false, true);
            }
            else
                ws = false;
        }
        function isConnected() {
            return ws && ws.readyState == state.OPEN;
        }
        return {
            Inited: function () {
                return !(ws === false);
            },
            Connected: function () {
                return isConnected();
            },
            connect: function () {
                if (!isConnected())
                    _connect();
            },
            support: function () {
                return type != undefined;
            },
            regCommmand: function (cmd, fnCallback) {
                commands[cmd] = fnCallback;
            },
            log: function (mesage) {
                if (mesage) {
                    if (typeof (mesage) != 'string')
                        mesage = JSON.stringify(mesage);
                    sendMessage("Log", mesage);
                }
            },
            close: function () {
                if (ws)
                    ws.close();
            }
        };
    }
    window.PushServices = _PushServices;
})();