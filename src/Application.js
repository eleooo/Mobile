/// <reference path="../lib/jquery/jquery-1.7.js" />
/// <reference path="../lib/jquery/jquery.mobile.js" />
/// <reference path="../lib/Common.js" />
/// <reference path="../DataStorage.js" />
/// <reference path="EleoooWrapper.js" />
/// <reference path="WebSocket.js" />

(function () {
    var Application = function () {
        var p = Application.prototype;
        var _body, spinner, prompter;
        var _def;
        var presenters = {};
        var currentView = false;
        var footernav = false, footer = false;
        var orderListViewName = "OrderList";
        var oldViewName = [];
        var voice = false;
        var isCordova = false;
        var isbackground = false;
        var _ws = false;
        function getPresenter(view) {
            var presenter = presenters[view];
            if (presenter === undefined) {
                presenter = new window['$_' + view]();
                presenters[view] = presenter;
                p[view] = presenter;
            }
            return presenter;
        }
        function ready() {
            _ws = new PushServices(_def.pusher);
            document.addEventListener("online", _online, false);
            document.addEventListener("resume", function () { isbackground = false; _online(); }, false);
            document.addEventListener("pause", function () { isbackground = true; }, false);
            document.addEventListener("backbutton", function () {
                if (oldViewName.length > 0) {
                    app.goback();
                } else {
                    app.confirm('你确定要退出程序吗?',
                                undefined,
                                '确定,取消',
                                function (btn) { btn == '1' ? navigator.app.exitApp() : void (0); }
                                );
                }
            }, true);
            _body = $("body");
            footernav = (footer = $("#footer", _body)).find("a").bind("tap", function (evt) {
                var v = evt.currentTarget.getAttribute('t');
                p[v].call(this, evt);
            });
            spinner = $("#spinner", _body);
            prompter = $("#prompter", _body);
            prompter.find("a").bind("tap", app.hideTips);
            if (DS.IsAutoLogin() && DS.WebAuthKey()) {
                p.showOrderList();
            } else p.showLogin();
        }
        p.init = function (def) {
            _def = def;
            $(document).ready(function () {
                isCordova = typeof (cordova) !== 'undefined';
                if (isCordova) {
                    document.addEventListener("deviceready", ready);
                }
                else ready();
            });
        }
        function _initWS(orderPusher) {
            if (!app.hasNetwork()) {
                app.logError("没有检测到网络连接.", true);
                return;
            }
            if (!_ws.Connected()) {
                _ws.connect();
                _ws.regCommmand("Notify", function (evt) {
                    var msg = evt.data.title + ':' + evt.data.message;
                    app.showtips(msg, undefined, false);
                });
                if (orderPusher)
                    _ws.regCommmand("Order", orderPusher);
            }
        }
        function initView(presenter, view, arg, isReturn) {
            if (presenter.box() !== false && presenter.box() !== undefined)
                return false;
            presenter.box($("<div></div>").hide().bind("tap", touchTap).appendTo(_body));
            if (!$.isFunction(VT[view])) {
                if ($.isFunction(presenter.init))
                    presenter.init();
                return false;
            }
            if ($.isFunction(presenter.renderView)) {
                presenter.renderView(function (viewData) {
                    presenter.box().html(VT[view](viewData));
                    if ($.isFunction(presenter.init))
                        presenter.init();
                    _showView(presenter, view, arg, isReturn);
                });
                return true;
            } else {
                presenter.box().html(VT[view](undefined));
                if ($.isFunction(presenter.init))
                    presenter.init();
                return false;
            }
        }
        function _showView(presenter, view, arg, isReturn) {
            if (currentView) {
                var curPresenter = getPresenter(currentView);
                $.isFunction(curPresenter.onClose) ? curPresenter.onClose() : void (0);
                curPresenter.box().hide();
                if (!isReturn)
                    oldViewName.push(currentView);
                if (voice) {
                    voice.stop();
                    voice.release();
                    voice = null;
                }
            }
            var isFound = false;
            var att;
            footernav.each(function (i, el) {
                att = el.getAttribute('v');
                if (att.indexOf(',' + view + ',') > -1)
                    el.className = 'nav_on', isFound = true;
                else
                    el.className = '';
            });
            isFound ? footer.show() : footer.hide();
            if ($.isFunction(presenter.show))
                presenter.show(arg);
            presenter.box().show();
            currentView = view;
        }
        function showView(view, arg, isReturn) {
            if (view === currentView)
                return;
            $(window).unbind("scroll");
            var presenter = getPresenter(view);
            if (!initView(presenter, view, arg, isReturn)) {
                _showView(presenter, view, arg, isReturn);
            }
        }
        function getObject(type) {
            if (type.indexOf('.') == -1) {
                return presenters[currentView][type];
            } else {
                return p[type.replace('app.', '')];
            }
        }
        function touchTap(event) {
            //app.trace("tapping...");
            var tar = $(event.target);
            var fnName = tar.attr(event.type) || (tar = tar.parent("[tap]"), tar.attr(event.type));
            if (fnName) {
                var fn = getObject(fnName);
                if ($.isFunction(fn)) {
                    fn.call(tar, tar, event);
                }
            }
        }
        function _online() {
            app.initWS();
        }
        p.initWS = function () {
            _initWS(presenters[orderListViewName].onPushOrder);
        },
        p.wsInited = function () {
            return _ws.Inited();
        },
        p.goback = function () {
            var view = oldViewName.pop() || orderListViewName;
            showView(view, undefined, true);
        }
        p.showLogin = function (arg) {
            showView("Login", arg);
        }
        p.showBalance = function (arg) {
            showView("Balance", arg);
        }
        p.showOrderHandle = function (arg) {
            showView("OrderHandle", arg);
        }
        p.showOrderList = function (arg) {
            showView(orderListViewName, arg);
        }
        p.showDetail = function (arg) {
            showView("Detail", arg);
            return false;
        }
        p.showMenu = function (arg) {
            showView("Menu", arg);
            return false;
        }
        p.showHall = function (arg) {
            showView("Hall", arg);
            return false;
        }
        p.showReview = function (arg) {
            showView("Review", arg);
            return false;
        }
        p.showRush = function (arg) {
            showView("Rush", arg);
            return false;
        }
        p.showRushRecord = function (arg) {
            showView("RushRecord", arg);
            return false;
        }
        p.showSale = function (arg) {
            showView("Sale", arg);
            return false;
        }
        p.showSaleList = function (arg) {
            showView("SaleList", arg);
            return false;
        }
        p.showTemp = function (arg) {
            showView("Temp", arg);
            return false;
        }
        p.logout = function () {
            DS.IsAutoLogin(false);
            DS.WebAuthKey(null);
            _ws.close();
            p.showLoginView();
        }
        p.notify = function (message) {
            console.log(message);
        }
        p.logInfo = function (message, isPusher) {
            console.log(message);
            if (!isPusher)
                _ws.log(message);
        }
        p.trace = function (message, isPusher) {
            p.logInfo(message, isPusher);
        }
        p.logError = function (message) {
            console.log(message);
        }
        p.bindDateSelector = function (txtBox, box) {
            $("#" + txtBox, box).scroller("destroy").scroller({
                preset: "date",
                theme: 'android',
                mode: 'scroller',
                display: 'modal',
                lang: 'zh',
                dateFormat: 'yy-mm-dd'
            });
        }
        p.inbackground = function () {
            return isbackground;
        }
        p.play = function (url) {
            if (voice) {
                voice.stop();
                voice.release();
                voice = false;
            }
            if (url) {
                voice = new Media(url);
                voice.play();
            }
        }
        p.isCordovaApp = function () {
            return isCordova;
        }
        p.hasNetwork = function () {
            if (!isCordova)
                return true;
            else {
                var networkState = navigator.connection.type;
                return networkState != Connection.UNKNOWN && networkState != Connection.NONE;
            }
        },
        p.spinner = function (isShow) {
            isShow ? spinner.show() : spinner.hide();
        }
        p.hideTips = function () {
            prompter.css({ opacity: "0" }).hide();
        }
        p.showtips = function (message, fn, isAnimate) {
            prompter.unbind("tap");
            if ($.isFunction(fn))
                prompter.bind("tap", fn);
            if (isAnimate) {
                prompter.css("z-index", "10000").show().animate({ opacity: "100" }, 400, null, function () {
                    setTimeout(function () {
                        prompter.css({ "opacity": "0", "z-index": "0" }).hide();
                    }, 2000)
                }).find("span").text(message);
            } else
                prompter.show().css({ "opacity": "100", "z-index": "10000" }).find("span").text(message);
        },
        p.getUrl = function () {
            return _def.url;
        },
        p.confirm = function (message, title, btnText, fn) {
            if (isCordova) {
                navigator.notification.confirm(
                                message,
                                fn,
                                title || _def.appName,
                                btnText);
            } else {
                var ret = confirm(title);
                fn(ret);
            }
        },
        p.getViewStack = function () {
            return oldViewName;
        }
    };
    window.app = new Application();
    app.init({ appName: '乐多分管理系统',
        pusher: "ws://192.168.0.104:8080/",
        url: "http://www.eleooo.com"
        //servicesUrl: "http://192.168.0.104:80"
    });
})(window);

