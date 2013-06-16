(function () {
    var _DataStorage = function () {
        function getData(key, val) {
            if (val === undefined)
                return localStorage[key];
            else {
                return localStorage[key] = typeof (val) != "string" ? JSON.stringify(val) : val;
            }
        }
        return {
            ViewCache: function (view, data) {
                return getData(view, data);
            },
            WebAuthKey: function (key) {
                return getData("EleoooWebAuthKey", key);
            },
            UserPhone: function (phoneNum) {
                return getData("EleoooUserPhone", phoneNum);
            },
            UserPwd: function (pwd) {
                return getData("EleoooUserPwd", pwd);
            },
            UserID: function (id) {
                return getData("EleoooUserID", id);
            },
            CompanyID: function (id) {
                return getData("EleoooCompanyID", id);
            },
            LatestUpdateOn: function (date) {
                return getData("EleoooLatestUpdateOn", date);
            },
            Version: function (ver) {
                return getData("EleoooVersion", ver);
            },
            IsSavePwd: function (state) {
                return getData("EleoooIsSavePwd", state);
            },
            IsAutoLogin: function (state) {
                return getData("EleoooIsAutoLogin", state);
            }
        };
    };
    window.DataStorage = _DataStorage();
})(window);