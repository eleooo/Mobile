﻿/// <reference path="../js/app.js" />
/// <reference path="lib/jquery/jquery-1.7.js" />

//API's execute success return format: {code:0,message:'',data{}},execute fail return format:{code:-1,message''}
//Login success result:{code:0,message:'success',data{ UserID:0,UserPhone:'',WebAuthKey:'',CompanyID:0 }}
//Version success result:{code:0,data:'1.0.0'}
//SendPassword post {phone:''} success {code:0,message:''}
//SynOrderData success {code:0,orders[{},{}]}
//GetOrderTemps post data: {orderId:0} , result data:{code:0,message:'',data:{memberphonenumber:'',timespan:'',temps:[]}}
//SendOrderTemps post data:{orderId:0,message:'',voice:''}
(function () {
    var EleoooWrapper = function () {
        var servicesUrl = "http://www.eleooo.com/public/RestHandler.ashx/";
        var xhrs = {};
        var WebAPI = {
            Login: iniAPI('App', false, 'Login'),
            SendPassword: iniAPI('App', false, 'SendPassword'),
            Version: iniAPI('App', false, 'Version'),
            SynOrderData: iniAPI('Order', true, 'SynOrderData'),
            GetOrderDetail: iniAPI('Order', true, 'GetOrderDetail'),
            GetOrderTemps: iniAPI('Order', true, 'GetOrderTemps'),
            SendOrderTemps: iniAPI('Order', true, 'SendOrderTemps')
        };
        function iniAPI(name, isAuth, action) {
            action = action || "Query";
            return { name: name, isAuth: isAuth, action: action };
        }
        function getAPI(api) {
            return servicesUrl + api.name + "/" + api.action;
        }
        function execute(api, data, fnCallback) {
            if (!app.hasNetwork()) {
                fnCallback({ code: -1, message: 'No network connect.' });
                return;
            }
            if (api.isAuth) {
                data["eleoooAuth"] = DataStorage.WebAuthKey();
            }
            var url = getAPI(api);
            if (xhrs[url]) {
                xhrs[url].abort();
                app.trace("abort calling...");
            }
            var xhr = $.ajax({
                url: url,
                data: data,
                dataType: "jsonp",
                success: fnCallback,
                complete: function () {
                    delete xhrs[url];
                    app.trace("complete calling...");
                }
            });
            xhrs[url] = xhr;
        }
        return {
            Login: function (phoneNum, pwd, fnCallback) {
                execute(WebAPI.Login, { userPhone: phoneNum, userPwd: pwd }, function (result) {
                    if (result.code == 0) {
                        DataStorage.CompanyID(result.data.CompanyID);
                        DataStorage.UserID(result.data.UserID);
                        DataStorage.UserPhone(result.data.UserPhone);
                        DataStorage.WebAuthKey(result.data.WebAuthKey);

                    }
                    fnCallback(result);
                });
            },
            Version: function (fnCallback) {
                execute(WebAPI.Version, {}, fnCallback);
            },
            SendPassword: function (phoneNum, fnCallback) {
                execute(WebAPI.SendPassword, { userPhone: phoneNum }, fnCallback);
            },
            SynOrderData: function (fnCallback) {
                var data = {
                    UserID: DataStorage.UserID(),
                    CompanyID: DataStorage.CompanyID(),
                    LatestUpdateOn: DataStorage.LatestUpdateOn(),
                    supportDatabase: DataStorage.supportDatabase(),
                    dtBegin: app.OrderList.getBeginDate(),
                    dtEnd: app.OrderList.getEndDate(),
                    phone: app.OrderList.getPhone()
                };

                execute(WebAPI.SynOrderData, data, fnCallback);
            },
            OrderDetail: function (orderId, fnCallback) {
                execute(WebAPI.OrderDetail, { orderId: orderId }, fnCallback);
            },
            getUrl: function (name) {
                var api = WebAPI[name];
                if (api)
                    return getAPI(api);
                else
                    return null;
            },
            callServices: function (name, data, fnCallback) {
                var api = WebAPI[name];
                if (api) {
                    execute(api, data, fnCallback);
                }
            }
        };
    }
    window.EleoooWrapper = new EleoooWrapper();
})();