/// <reference path="../lib/jquery/jquery-1.7.js" />
/// <reference path="../DS.js" />
/// <reference path="../WS.js" />

(function () {
    var _Hall = function () {
        var myInfo = {};
        var txtphone, txtWorkingTime, txtOnSetSum, p1, p2, _box = false;
        var scroller, ctHall;
        var p = _Hall.prototype;
        function getInputData() {
            myInfo["p"] = txtphone.val();
            myInfo["CompanyWorkTime"] = txtWorkingTime.val();
            myInfo["OnSetSum"] = txtOnSetSum.val();
            if (p1.val())
                myInfo["p1"] = p1.val();
            if (p2.val())
                myInfo["p2"] = p2.val();
        }
        p.box = function (el) {
            if (el) _box = el;
            return _box;
        }
        p.reset = function () {
            ctHall.html('');
        }
        p.show = function () {
            WS.GetMyInfo(function (result) {
                myInfo = result.data || myInfo;
                myInfo["p"] = DS.UserPhone();
                myInfo["CompanyWorkTime"] = myInfo["CompanyWorkTime"] || "";
                myInfo["OnSetSum"] = myInfo["OnSetSum"] || "";
                ctHall.html(VT["HallView"](myInfo));

                txtphone = $("#txtPhone", _box);
                txtWorkingTime = $("#txtWorkingTime", _box);
                txtOnSetSum = $("#txtOnSetSum", _box);
                p1 = $("#p1", _box);
                p2 = $("#p2", _box);
                scroller.refresh();
            });
        }
        p.init = function () {
            ctHall = $("#ctHall", _box);
            scroller = new IScroll(ctHall.parent().get(0), { bounceTime: 50, scrollbars: true, interactiveScrollbars: true});
        }
        p.addWorkingtime = function (el) {
            var val = prompt("请输入新营业时间,格式如:10:00-11:00");
            if (val) {
                var v = txtWorkingTime.val();
                if (v)
                    v = v + "," + val;
                else
                    v = val;
                txtWorkingTime.val(v);
            }
        }
        p.changeStatus = function (el) {
            if (myInfo["IsSuspend"]) {
                el.attr("src", "images/on.png");
                myInfo["IsSuspend"] = false;
            } else {
                el.attr("src", "images/off.png");
                myInfo["IsSuspend"] = true;
            }
        }
        p.saveMyInfo = function (el) {
            var phone = txtphone.val();
            if (!phone || phone.length == 0) {
                app.logInfo("你的登录账号不能为空.");
                return;
            }
            var pw1 = p1.val();
            var pw2 = p2.val();
            if (pw1 && pw1 != pw2) {
                app.logInfo("你两次输入的密码不一致.");
                return;
            }
            getInputData();
            WS.SaveMyInfo(myInfo, function (result) {
                if (result.code > -1) {
                    DS.UserPhone(phone);
                }
                app.logInfo(result.message);
            });
        }
    }
    window.$_Hall = _Hall;
})(window);