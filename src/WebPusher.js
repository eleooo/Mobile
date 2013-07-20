/// <reference path="Application.js" />
/// <reference path="DS.js" />

(function () {
    var _WebPusher = function (location) {
        var _location = location;
        var state = {
            CONNECTING: 0,
            OPEN: 1,
            CLOSING: 2,
            CLOSED: 3
        };
        var ps = false, connecting = false;
        var commands = {};
        var type = getWs();
        function getWs() {
            return !$D.WIN ? window.plugins["WebSocket"] : ("MozWebSocket" in window ? window['MozWebSocket'] : ("WebSocket" in window ? window['WebSocket'] : null));
        }
        function _connect() {
            if (type && !connecting) {
                ps ? ps.close() : ps = false;
                connecting = true;
                var _ps = new type(_location);
                //app.showtips('begin connect to ws.');
                _ps.onopen = function (evt) { onopen(_ps, evt); }
                _ps.onmessage = onmessage;
                _ps.onclose = onclose;
                _ps.onerror = onerror;
                commands["Login"] = function (data) {
                    app.showtips(data.message);
                };
            }
        }
        function loginPS() {
            var data = { Date: DS.LatestUpdateOn(),
                UserId: DS.UserID(),
                CompanyId: DS.CompanyID(),
                SubSys: 2,
                LoginSys: 2,
                Platform: app.platform(),
                Version: app.appVer()
            };
            sendMessage("Login", data);
        }
        function onopen(_ps, event) {
            connecting = false;
            ps = _ps;
            loginPS();
        }
        function onerror(event) {
            connecting = false;
            //console.log(event);
            app.showtips(event.data);
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
                ps.send(cmd + " " + message);
            }
        }
        function onclose(event) {
            connecting = false;
            if (ps == false) {
                app.showtips("无法连接到推送服务器.");
            }
            else
                ps = false;
        }
        function isConnected() {
            return ps && (ps.readyState == undefined || ps.readyState == state.OPEN);
        }
        return {
            Inited: function () {
                return !(ps === false);
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
                if (ps)
                    ps.close();
            }
        };
    }
    window.WebPusher = _WebPusher;
})();