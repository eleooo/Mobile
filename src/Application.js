﻿/// <reference path="../lib/jquery/jquery-1.7.js" />
/// <reference path="../lib/jquery/jquery.mobile.js" />
/// <reference path="../lib/Common.js" />
/// <reference path="../DataStorage.js" />
/// <reference path="../EleoooWrapper.js" />

(function () {
    var Application = function () {
        var p = Application.prototype;
        var container;
        var dlgContainer, spinner;
        var _def;
        var presenter = {};
        var currentView = false;
        var footer = false;
        var orderListViewName = "OrderList";
        var _orderId;
        var oldViewName = false;
        //var oldViewHtml = false;
        var voice = false;
        var isCordova = false;
        p.init = function (def) {
            _def = def;
            isCordova = !(typeof (cordova) == 'undefined');
            if (isCordova)
                document.addEventListener("deviceready", ready);
            else
                $(document).ready(ready);
        }
        function initPresenter(view) {
            if (!$.isPlainObject(presenter[view])) {
                presenter[view] = eval("new $_" + view + "()");
                p[view] = presenter[view];
            }
        }
        function ready() {
            container = $("#mainContainer").tap(touchTap);
            dlgContainer = $("#dlgContainer").tap(touchTap);
            (footer = $("#footer")).find("a").tap(function () {
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
            spinner = $("#spinner");
            if (DataStorage.IsAutoLogin())
                footer.find("a[view='orderList']").trigger("tap");
            else
                p.showLoginView();
        }
        function showView(view) {
            $(window).unbind("scroll");
            initPresenter(view);
            if ($.isFunction(VT[view])) {
                if (presenter[view] && $.isFunction(presenter[view].renderView)) {
                    presenter[view].renderView(function (viewData) {
                        if (currentView) {
                            if ($.isFunction(presenter[currentView].onClose)) { presenter[currentView].onClose(view); }
                            presenter[currentView]["visible"] = false;
                        }
                        (isDlgView(view) ? (container.hide(), footer.hide(), dlgContainer) : (dlgContainer.hide(), footer.show(), container)).html(VT[view](viewData)).show();
                        presenter[view]["visible"] = true;
                        oldViewName = currentView;
                        currentView = view;
                        if (presenter[view] && $.isFunction(presenter[view].onLoad))
                            presenter[view].onLoad(false);
                    });
                }
                else {
                    if (currentView) {
                        if ($.isFunction(presenter[currentView].onClose)) { presenter[currentView].onClose(view); }
                        presenter[currentView]["visible"] = false;
                    }
                    (isDlgView(view) ? (container.hide(), footer.hide(), dlgContainer) : (dlgContainer.hide(), footer.show(), container)).html(VT[view](undefined)).show();
                    oldViewName = currentView;
                    currentView = view;
                    presenter[view]["visible"] = true;
                    if (presenter[view] && $.isFunction(presenter[view].onLoad))
                        presenter[view].onLoad(false);
                }
            }
        }
        function getObject(type) {
            if (type.indexOf('.') == -1) {
                return presenter[currentView][type];
            } else {
                return eval(type);
            }
        }
        function touchTap(event) {
            //app.trace("tapping...");
            var tar = $(event.target);
            if (tar.attr("id") != getCurContainer().attr("id")) {
                var fnName = tar.attr(event.type) || (tar = tar.parent("[tap]"), tar.attr(event.type));
                if (fnName) {
                    var fn = getObject(fnName);
                    if ($.isFunction(fn)) {
                        fn.call(tar, tar, event);
                    }
                }
            }
        }
        function getCurContainer() {
            return isDlgView(currentView) ? dlgContainer : container;
        }
        function isDlgView(viewName) {
            var isDlg = presenter[viewName].isDlgView != undefined && presenter[viewName].isDlgView == true;
            return isDlg;
        }
        p.currentOrderId = function (orderId) {
            if (orderId === undefined)
                return _orderId;
            else
                return _orderId = orderId;
        }

        p.closeDlg = function () {
            if (oldViewName) {
                presenter[oldViewName]["visible"] = true;
                if ($.isFunction(presenter[currentView].onClose))
                    presenter[currentView].onClose(oldViewName);
                presenter[currentView]["visible"] = false;
                if ($.isFunction(presenter[oldViewName].onLoad))
                    presenter[oldViewName].onLoad(true);
                var v = currentView;
                currentView = oldViewName;
                oldViewName = v;
            } else {
                oldViewName = currentView;
                presenter[oldViewName]["visible"] = false;
            }
            container.show();
            footer.show();
            if (voice) {
                voice.stop();
                voice.release();
                voice = null;
            }
            dlgContainer.hide();
            dlgContainer.html("");
            return false;
        }
        p.showLoginView = function () {
            showView("Login");
        }
        p.showBalanceView = function () {
            showView("Balance");
        }
        p.showOrderHandleView = function () {
            showView("OrderHandle");
        }
        p.showOrderListView = function () {
            showView(orderListViewName);
        }
        p.showDetailView = function () {
            showView("Detail");
            return false;
        }
        p.showMenuView = function () {
            showView("Menu");
            return false;
        }
        p.showHallView = function () {
            showView("Hall");
            return false;
        }
        p.showReviewView = function () {
            showView("Review");
            return false;
        }
        p.showRushView = function () {
            showView("Rush");
            return false;
        }
        p.showRushRecordView = function () {
            showView("RushRecord");
            return false;
        }
        p.showSaleView = function () {
            showView("Sale");
            return false;
        }
        p.showSaleListView = function () {
            showView("SaleList");
            return false;
        }
        p.showTempView = function () {
            showView("Temp");
            return false;
        }
        p.logout = function () {
            p.showLoginView();
        }
        p.logInfo = function (message) {
            console.log(message);
        }
        p.trace = function (message) {
            p.logInfo(message);
        }
        p.logError = function (message) {
            console.log(message);
        }
        p.bindDateSelector = function (txtBox) {
            $("#" + txtBox).scroller("destroy").scroller({
                preset: "date",
                theme: 'android',
                mode: 'scroller',
                display: 'modal',
                lang: 'zh',
                dateFormat: 'yy-mm-dd'
            });
        }

        p.play = function (url) {
            if (voice) {
                voice.stop();
                voice.release();
                voice = false;
            } else if (url) {
                voice = new Media(el.attr('voice'));
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
    };
    window.app = new Application();
    app.init({ appName: '乐多分管理系统' });
})(window);

