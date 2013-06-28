/// <reference path="../lib/jquery/jquery-1.7.js" />
/// <reference path="../lib/jquery/jquery.mobile.js" />
/// <reference path="../lib/Common.js" />
/// <reference path="../DataStorage.js" />
/// <reference path="EleoooWrapper.js" />
/// <reference path="WebSocket.js" />

(function () {
    var Application = function () {
        var p = Application.prototype;
        var _body, spinner, prompter, prompterCallback = false;
        var presenters = {};
        var currentView = false;
        var footernav = false, footer = false;
        var orderListViewName = "OrderList";
        var oldViewName = [];
        var voice = false;
        var isbackground = false;
        var _ps = false;
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
            _ps = new WebPusher($D.pusher);
            if (!$D.WIN) {
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
                document.addEventListener("touchend", function (event) {
                    //this function is used to prevent duplicate "tap" events
                    var tag = event.target.nodeName.toUpperCase();
                    if (!(tag in ["INPUT", "TEXTAREA"])) {
                        console.log('touchend : ' + tag);
                        event.preventDefault();
                        event.stopPropagation();
                        return false;
                    }
                });
            }
            _body = $("body");
            footernav = (footer = $("#footer", _body)).find("a").bind("tap", function (evt) {
                var v = evt.currentTarget.getAttribute('t');
                p[v].call(this, evt);
            });
            spinner = $("#spinner", _body);
            prompter = $("#prompter", _body).bind("tap", app.hideTips);
            if (DS.IsAutoLogin() && DS.WebAuthKey()) {
                p.showOrderList();
            } else p.showLogin();
            $(window.applicationCache).bind("downloading", function () {
                app.showtips("正在更新程序...");
            }).bind("updateready", function () {
                app.alert("请重启应用程序.", "更新完成", "退出程序", function () {
                    !$D.WIN ? navigator.app.exitApp() : document.location.reload();
                });
            });
        }
        p.init = function () {
            $(document).ready(function () {
                if (!$D.WIN) {
                    document.addEventListener("deviceready", ready);
                }
                else ready();
            });
        }
        function _initPS(orderPusher) {
            if (!app.ol()) {
                app.logError("没有检测到网络连接.", true);
                return;
            }
            if (!_ps.Connected()) {
                _ps.connect();
                _ps.regCommmand("Notify", function (evt) {
                    var msg = evt.data.title + ':' + evt.data.message;
                    app.showtips(msg);
                });
                if (orderPusher)
                    _ps.regCommmand("Order", orderPusher);
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
                    //event.stopImmediatePropagation();
                }
            }
            //event.preventDefault();
        }
        function _online() {
            p.initPS();
        }
        p.initPS = function () {
            _initPS(presenters[orderListViewName].onPushOrder);
        },
        p.psInited = function () {
            return _ps.Inited();
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
            var v, presenter;
            for (v in presenters) {
                presenter = presenters[v];
                if ($.isFunction(presenter.reset))
                    presenter.reset();
            }
            _ps.close();
            oldViewName = [];
            //Array.clear(oldViewName);
            p.showLogin();
        }
        p.notify = function (message) {
            p.showtips(message);
        }
        p.logInfo = function (message, tops) {
            p.showtips(message);
            console.log(message);
            if (tops)
                _ps.log(message);
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
            return !$D.WIN;
        }
        p.ol = function () {
            if ($D.WIN)
                return navigator.onLine;
            else {
                var networkState = navigator.connection.type;
                return networkState != Connection.UNKNOWN && networkState != Connection.NONE;
            }
        },
        p.spinner = function (isShow) {
            isShow ? spinner.show() : spinner.hide();
        }
        p.hideTips = function () {
            prompter.addClass("hide").removeClass('top');
            if ($.isFunction(prompterCallback)) {
                prompterCallback();
                prompterCallback = false;
            }
        }
        p.showtips = function (message, fn) {
            console.log(message);
            if ($.isFunction(fn))
                prompterCallback = fn;
            prompter.removeClass('hide').addClass('top').text(message);
        },
        p.getUrl = function () {
            return $D.url;
        },
        p.confirm = function (message, title, btnText, fn) {
            if (!$D.WIN) {
                navigator.notification.confirm(
                                message,
                                fn,
                                title || $D.appName,
                                btnText);
            } else {
                var ret = confirm((title || '') + message);
                fn(ret);
            }
        },
        p.alert = function (message, title, btnText, fn) {
            if (!$D.WIN) {
                navigator.notification.alert(
                                message,
                                fn,
                                title || $D.appName,
                                btnText);
            } else {
                var ret = alert((title || '') + message);
                fn(ret);
            }
        },
        p.isSocket = function () {
            return _ps.support();
        },
        p.platform = function () {
            return $D.WIN ? navigator.platform : device.platform;
        },
        p.appVer = function () {
            return $D.WIN ? navigator.appVersion : device.version;
        }
    };
    window.app = new Application();
    app.init();
})();


//String appCachePath = getApplicationContext().getCacheDir().getAbsolutePath();
//this.appView.getSettings().setAppCachePath(appCachePath);
//this.appView.getSettings().setDomStorageEnabled(true);
//this.appView.getSettings().setAppCacheMaxSize(1024 * 1024 * 15);
//this.appView.getSettings().setAllowFileAccess(true);
//this.appView.getSettings().setAppCacheEnabled(true); 