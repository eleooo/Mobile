/// <reference path="../lib/jquery/jquery-1.7.js" />
/// <reference path="../DataStorage.js" />
/// <reference path="../EleoooWrapper.js" />

(function () {
    var _Hall = function () {
        var myInfo = {};
        var txtphone, txtWorkingTime, txtOnSetSum, p1, p2
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
        p.isDlgView = true;
        p.onLoad = function (isReturn) {
            txtphone = $("#txtPhone");
            txtWorkingTime = $("#txtWorkingTime");
            txtOnSetSum = $("#txtOnSetSum");
            p1 = $("#p1");
            p2 = $("#p2");
        }
        p.onClose = function () {
            getInputData();
            delete myInfo["p1"];
            delete myInfo["p2"];
            DataStorage.ViewCache("Hall", myInfo);
        }
        p.renderView = function (fnCallback) {
            if (!app.hasNetwork()) {
                myInfo = DataStorage.ViewCache("Hall") || myInfo;
                myInfo["p"] = DataStorage.UserPhone();
                fnCallback(myInfo);
                return;
            }
            EleoooWrapper.GetMyInfo(function (result) {
                myInfo = result.data || myInfo;
                myInfo["p"] = DataStorage.UserPhone();
                myInfo["CompanyWorkTime"] = myInfo["CompanyWorkTime"] || "";
                myInfo["OnSetSum"] = myInfo["OnSetSum"] || "";
                fnCallback(myInfo);
            });
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
            EleoooWrapper.SaveMyInfo(myInfo, function (result) {
                if (result.code > -1) {
                    DataStorage.UserPhone(phone);
                }
                app.logInfo(result.message);
            });
        }
    }
    window.$_Hall = _Hall;
})(window);