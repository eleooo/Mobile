/// <reference path="../js/app.js" />
/// <reference path="../js/templates.js" />

(function () {
    var Application = function () {
        var p = Application.prototype;
        var container;
        var dlgContainer;
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
            if (DataStorage.IsAutoLogin())
                footer.find("a[view='orderList']").tap();
            else
                p.showLoginView();
        }
        function showView(view) {
            $(window).unbind("scrollstop");
            initPresenter(view);
            if ($.isFunction(VT[view])) {
                if (presenter[view] && $.isFunction(presenter[view].renderView)) {
                    presenter[view].renderView(function (viewData) {
                        oldViewName = currentView;
                        currentView = view;
                        if (oldViewName) {
                            if ($.isFunction(presenter[oldViewName].onClose)) { presenter[oldViewName].onClose(); }
                            presenter[oldViewName]["visible"] = false;
                        }
                        (isDlgView(view) ? (container.hide(), footer.hide(), dlgContainer) : (dlgContainer.hide(), footer.show(), container)).html(VT[view](viewData)).show();
                        presenter[view]["visible"] = true;
                        if (presenter[view] && $.isFunction(presenter[view].onLoad))
                            presenter[view].onLoad(false);
                    });
                }
                else {
                    oldViewName = currentView;
                    if (oldViewName) {
                        if ($.isFunction(presenter[oldViewName].onClose)) { presenter[oldViewName].onClose(); }
                        presenter[oldViewName]["visible"] = false;
                    }
                    (isDlgView(view) ? (container.hide(), footer.hide(), dlgContainer) : (dlgContainer.hide(), footer.show(), container)).html(VT[view](undefined)).show();
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
            var fnName = tar.attr(event.type);
            if (tar.attr("id") != container.attr("id") && fnName) {
                var fn = getObject(fnName);
                if ($.isFunction(fn)) {
                    fn.call(tar, tar, event);
                }
            }
        }
        function isDlgView(viewName) {
            var isDlgView = presenter[viewName].isDlgView != undefined && presenter[viewName].isDlgView == true;
            return isDlgView;
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
                    presenter[currentView].onClose();
                presenter[currentView]["visible"] = false;
                if ($.isFunction(presenter[oldViewName].onLoad))
                    presenter[oldViewName].onLoad(true);
                oldViewName = currentView;
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
        p.hasNetwork = function () {
            if (!isCordova)
                return true;
            else {
                var networkState = navigator.connection.type;
                return networkState != Connection.UNKNOWN && networkState != Connection.NONE;
            }
        }
    };
    window.app = new Application();
    app.init({ appName: '乐多分管理系统' });
})(window);

