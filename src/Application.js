/// <reference path="../js/app.js" />
/// <reference path="../js/templates.js" />

(function () {
    var Application = function () {
        var p = Application.prototype;
        var container;
        var dlgContainer;
        var _def;
        var presenter = {};
        var isSynDataStarted = false;
        var currentView = false;
        var footer = false;
        var orderListViewName = "OrderList";
        var _orderId;
        var oldViewName = false;
        var oldViewHtml = false;
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
                presenter[view] = eval("new _" + view + "()");
                p[view] = presenter[view];
            }
        }
        function ready() {
            p.logInfo("application is ready.");
            container = $("#mainContainer").tap(touchTap);
            dlgContainer = $("#dlgContainer").tap(touchTap);
            (footer = $("#footer")).find("a").tap(function () {
                var nav = $(this);
                if (nav.hasClass("nav_on"))
                    return;
                else {
                    $(".nav_on", footer).removeClass("nav_on");
                    nav.addClass("nav_on");
                    if (nav.attr("view"))
                        showView(nav.attr("view"));
                }
            });
            if (DataStorage.IsAutoLogin())
                p.showOrderListView();
            else
                p.showLoginView();
        }
        function showView(view) {
            initPresenter(view);
            if ($.isFunction(VT[view])) {
                if (presenter[view] && $.isFunction(presenter[view].renderView)) {
                    presenter[view].renderView(function (viewData) {
                        oldViewName = currentView;
                        oldViewHtml = isDlgView(oldViewName) ? dlgContainer.html() : container.html();
                        currentView = view;
                        (isDlgView(view) ? (container.hide(), footer.hide(), dlgContainer) : (dlgContainer.hide(), footer.show(), container)).html(VT[view](viewData)).show();
                        if (presenter[view] && $.isFunction(presenter[view].onLoad))
                            presenter[view].onLoad(false);
                    });
                }
                else {
                    oldViewName = currentView;
                    oldViewHtml = container.html();
                    (isDlgView(view) ? (container.hide(), footer.hide(), dlgContainer) : (dlgContainer.hide(), footer.show(), container)).html(VT[view](undefined)).show();
                    currentView = view;
                    if (presenter[view] && $.isFunction(presenter[view].onLoad))
                        presenter[view].onLoad(false);
                }
            }
        }
        function prcessSynOrderResult(result) {
            presenter[orderListViewName].saveSynResult(result, function () {
                if (currentView == orderListViewName && result.data.orders.length > 0) {
                    presenter[orderListViewName].refreshOrderList();
                }
                setTimeout(function () {
                    EleoooWrapper.SynOrderData(prcessSynOrderResult);
                }, 3000);
            });
        }
        function beginSynOrderData() {
            if (isSynDataStarted)
                return;
            DataStorage.initStorage(undefined);
            EleoooWrapper.SynOrderData(prcessSynOrderResult);
            isSynDataStarted = true;
        }
        function touchTap(event) {
            app.trace("tapping...");
            var tar = $(event.target);
            if (tar.attr("id") != container.attr("id") && tar.attr(event.type) && $.isFunction(presenter[currentView][tar.attr(event.type)])) {
                presenter[currentView][tar.attr(event.type)].call(tar, event);
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
            if (oldViewHtml && oldViewName) {
                dlgContainer.hide();
                container.show();
                if ($.isFunction(presenter[oldViewName].onLoad))
                    presenter[oldViewName].onLoad(true);
                footer.show();
            }
            if (voice) {
                voice.stop();
                voice.release();
                voice = null;
            }
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
            beginSynOrderData();
        }
        p.showDetailView = function () {
            showView("Detail");
        }
        p.showMenuView = function () {
            showView("Menu");
        }
        p.showHallView = function () {
            showView("Hall");
        }
        p.showReviewView = function () {
            showView("Review");
        }
        p.showRushView = function () {
            showView("Rush");
        }
        p.showRushRecordView = function () {
            showView("RushRecord");
        }
        p.showSaleView = function () {
            showView("Sale");
        }
        p.showSaleListView = function () {
            showView("SaleList");
        }
        p.showTempView = function () {
            showView("Temp");
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
                theme: 'android',
                mode: 'scroller',
                display: 'modal',
                lang: 'zh'
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

