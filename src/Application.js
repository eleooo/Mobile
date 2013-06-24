/// <reference path="../lib/jquery/jquery-1.7.js" />
/// <reference path="../lib/jquery/jquery.mobile.js" />
/// <reference path="../lib/Common.js" />
/// <reference path="../DS.js" />
/// <reference path="EleoooWrapper.js" />
/// <reference path="WebSocket.js" />

(function () {
    var Application = function () {
        var p = Application.prototype;
        var _body, spinner, prompter;
        var _def;
        var presenters = {};
        var currentView = false;
        var footer = false;
        var orderListViewName = "OrderList";
        var oldViewName = [];
        var voice = false;
        var isCordova = false;
        var isbackground = false;
        var _ws = false;
        p.init = function (def) {
            _def = def;
            $(document).ready(function () {
                isCordova = !(typeof (cordova) == 'undefined');
                if (isCordova) {
                    document.addEventListener("deviceready", ready);
                }
                else
                    ready();
            });
        }
        function getPresenter(view) {
            var presenter = presenters[view];
            if (presenter == undefined) {
                presenter = eval("new $_" + view + "()");
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
            (footer = $("#footer", _body)).find("a").tap(function () {
                var nav = $(this);
                if (nav.hasClass("nav_on"))
                    return;
                else {
                    $(".nav_on", footer).removeClass("nav_on");
                    nav.addClass("nav_on");
                    var view = nav.attr("view");
                    if (view) {
                        var s = view.charAt(0);
                        view = view.replace(s, s.toUpperCase());
                        showView(view);
                    }
                }
            });
            spinner = $("#spinner", _body);
            prompter = $("#prompter", _body);
            prompter.find("a").bind("tap", app.hideTips);
            if (DS.IsAutoLogin() && DS.WebAuthKey()) {
                footer.find("a[view='orderList']").trigger("tap");
            }
            else
                p.showLoginView();
        }
        function _initWS(orderPusher) {
            if (!app.hasNetwork()) {
                app.logError("没有检测到网络连接.", true);
                return;
            }
            if (!_ws.Connected()) {
                _ws.connect();
                _ws.regCommmand("Notify", function (evt) {
                    app.showtips(evt.data, undefined, false);
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
                if ($.isFunction(presenter.onLoad))
                    presenter.onLoad();
                return false;
            }
            if ($.isFunction(presenter.renderView)) {
                presenter.renderView(function (viewData) {
                    presenter.box().html(VT[view](viewData));
                    if ($.isFunction(presenter.onLoad))
                        presenter.onLoad();
                    _showView(presenter, view, arg, isReturn);
                });
                return true;
            } else {
                presenter.box().html(VT[view](undefined));
                if ($.isFunction(presenter.onLoad))
                    presenter.onLoad();
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
            presenter.isDlgView ? footer.hide() : footer.show();
            if ($.isFunction(presenter.onShow))
                presenter.onShow(arg);
            presenter.box().show();
            currentView = view;
        }
        function showView(view, arg, isReturn) {
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
                return eval(type);
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
        p.showLoginView = function (arg) {
            showView("Login", arg);
        }
        p.showBalanceView = function (arg) {
            showView("Balance", arg);
        }
        p.showOrderHandleView = function (arg) {
            showView("OrderHandle", arg);
        }
        p.showOrderListView = function (arg) {
            //showView(orderListViewName, arg);
            footer.find("a[view='orderList']").trigger("tap");
        }
        p.showDetailView = function (arg) {
            showView("Detail", arg);
            return false;
        }
        p.showMenuView = function (arg) {
            showView("Menu", arg);
            return false;
        }
        p.showHallView = function (arg) {
            showView("Hall", arg);
            return false;
        }
        p.showReviewView = function (arg) {
            showView("Review", arg);
            return false;
        }
        p.showRushView = function (arg) {
            showView("Rush", arg);
            return false;
        }
        p.showRushRecordView = function (arg) {
            showView("RushRecord", arg);
            return false;
        }
        p.showSaleView = function (arg) {
            showView("Sale", arg);
            return false;
        }
        p.showSaleListView = function (arg) {
            showView("SaleList", arg);
            return false;
        }
        p.showTempView = function (arg) {
            showView("Temp", arg);
            return false;
        }
        p.logout = function () {
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

