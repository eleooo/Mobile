/// <reference path="../../js/app.js" />

(function () {
    var _Login = function () {
        var txtUserPhone = false;
        var txtUserPwd = false;
        var cbAutoLogin = false;
        var cbSavePwd = false;
        var btnSendPwdDispTxt = "秒后可重发";
        var btnSendPwd = false;
        var counter = 0;
        var p = _Login.prototype, _box = false;
        function refreshTimerDisp() {
            if (counter <= 0) {
                btnSendPwd.val("短信获取密码");
                btnSendPwd.removeClass("gray");
                btnSendPwd.addClass("green");
            } else {
                btnSendPwd.val(counter + btnSendPwdDispTxt);
                counter = counter - 1;
                setTimeout(refreshTimerDisp, 1000);
            }
        }
        p.box = function (el) {
            if (el) _box = el;
            return _box;
        }

        p.init = function (isReturn) {
            txtUserPhone = $("#txtLoginUserPhone", _box).val("13800100712");
            txtUserPwd = $("#txtLoginUserPwd", _box).val("123456");
            cbAutoLogin = $("#cbAutoLogin", _box);
            cbSavePwd = $("#cbSavePwd");
            if (DS.IsSavePwd()) {
                txtUserPhone.val(DS.UserPhone());
                txtUserPwd.val(DS.UserPwd());
                cbSavePwd.attr("checked", "checked");
            }
            if (DS.IsAutoLogin()) {
                cbAutoLogin.attr("checked", "checked");
            }
        }
        p.login = function () {
            var phone = txtUserPhone.val();
            if (!phone || phone.length == 0) {
                app.logError("请输入你的登录账号.");
                return;
            }
            var pwd = txtUserPwd.val();
            if (!pwd || pwd.length == 0) {
                app.logError("请输入你的登录密码.");
                return;
            }
            WS.Login(phone, pwd, function (result) {
                if (result.code == 0) {
                    if (cbSavePwd.attr("checked"))
                        DS.IsSavePwd(true);
                    if (cbAutoLogin.attr("checked"))
                        DS.IsAutoLogin(true);
                    app.goback();
                    app.showOrderList();
                } else {
                    app.logError(result.message);
                }
            });
        }
        p.sendPassword = function () {
            btnSendPwd = btnSendPwd || $(this);
            if (btnSendPwd.hasClass("gray"))
                return;
            var phone = txtUserPhone.val();
            if (!phone || phone.length == 0) {
                app.logError("请输入你的登录账号.");
                return;
            }
            WS.SendPassword(phone, function (result) {
                if (result.code == 0) {
                    btnSendPwd.removeClass("green");
                    btnSendPwd.addClass("gray");
                    counter = 60;
                    refreshTimerDisp();
                } else {
                    app.logError(result.message);
                }
            });
        }
        p.showSendMsn = function () {
            $('#sendPwd', _box).toggle();
        }
    }
    window.$_Login = _Login;
})(window);