/// <reference path="../EleoooWrapper.js" />
/// <reference path="../DataStorage.js" />
/// <reference path="../Application.js" />
(function () {
    var _Detail = function () {
        var ctList, _box = false;
        var p = _Detail.prototype;
        p.box = function (el) {
            if (el) _box = el;
            return _box;
        }
        p.renderView = function (fnCallback) {
            var d = new Date();
            var d1 = d.DateAdd('d', 1 - d.getDate()).format("yyyy-MM-dd");
            fnCallback({ beginDate: d1, endDate: d.format("yyyy-MM-dd") });
        }
        p.init = function () {
            ctList = $("#fList", _box);
            app.bindDateSelector("txtDetailBeginDate", _box);
            app.bindDateSelector("txtDetailEndDate", _box);
            //scroller = new IScroll(ctList.parent().get(0), { bounceTime: 50, useTransition: false });
        }
        p.reset = function () {
            ctList.html('');
        }
        p.show = function () {
            var arg = { t: 0,
                d1: $("#txtDetailBeginDate", _box).val(),
                d2: $("#txtDetailEndDate", _box).val()
            };
            WS.GetFinance(arg, function (result) {
                ctList.html(result.data);
            });
        }
    }
    var _Balance = function () {
        var ctList, _box = false;
        var scroller;
        var p = _Balance.prototype;
        p.box = function (el) {
            if (el) _box = el;
            return _box;
        }
        p.renderView = function (fnCallback) {
            var d = new Date();
            var d1 = d.DateAdd('d', 1 - d.getDate()).format("yyyy-MM-dd");
            fnCallback({ beginDate: d1, endDate: d.format("yyyy-MM-dd") });
        }
        p.init = function () {
            ctList = $("#dList", _box);
            app.bindDateSelector("txtBalanceBeginDate", _box);
            app.bindDateSelector("txtBalanceEndDate", _box);
            //scroller = new IScroll(ctList.parent().get(0), { bounceTime: 50 });
            scroller = app.iscroll(ctList.parent().get(0), { scrollbars: false });
        }
        p.reset = function () {
            ctList.html('');
        }
        p.show = function () {
            var arg = { t: 1,
                d1: $("#txtBalanceBeginDate", _box).val(),
                d2: $("#txtBalanceEndDate", _box).val()
            };
            WS.GetFinance(arg, function (result) {
                ctList.html(result.data);
                scroller.refresh();
            });
        }
    }
    window.$_Detail = _Detail;
    window.$_Balance = _Balance;
})(window);