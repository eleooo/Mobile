(function () {
    var _DS = function () {
        var _ds = {};
        function getData(key, val) {
            if (val === undefined)
                return (localStorage || _ds)[key];
            else {
                return (localStorage || _ds)[key] = (val && typeof (val) != "string") ? JSON.stringify(val) : val;
            }
        }
        return {
            ViewCache: function (view, data) {
                return getData(view, data);
            },
            WebAuthKey: function (key) {
                return getData("WebAuthKey", key);
            },
            UserPhone: function (phoneNum) {
                return getData("UserPhone", phoneNum);
            },
            UserPwd: function (pwd) {
                return getData("UserPwd", pwd);
            },
            UserID: function (id) {
                return getData("UserID", id);
            },
            CompanyID: function (id) {
                return getData("CompanyID", id);
            },
            LatestUpdateOn: function (date) {
                return getData("LatestUpdateOn", date);
            },
            Version: function (ver) {
                return getData("Version", ver);
            },
            IsSavePwd: function (state) {
                return getData("IsSavePwd", state);
            },
            IsAutoLogin: function (state) {
                return getData("IsAutoLogin", state);
            }
        };
    };
    window.DS = _DS();
})(window);