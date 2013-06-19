/// <reference path="../js/app.js" />
/// <reference path="lib/jquery/jquery-1.7.js" />

//API's execute success return format: {code:0,message:'',data{}},execute fail return format:{code:-1,message''}
//Login success result:{code:0,message:'success',data{ UserID:0,UserPhone:'',WebAuthKey:'',CompanyID:0 }}
//Version success result:{code:0,data:'1.0.0'}
//SendPassword post {phone:''} success {code:0,message:''}
//GetOrders success {code:0,orders[{},{}]}
//GetOrderTemps post data: {orderId:0} , result data:{code:0,message:'',data:{memberphonenumber:'',timespan:'',temps:[]}}
//SendOrderTemps post data:{orderId:0,message:'',voice:''}
(function () {
    var _EleoooWrapper = function () {
        var servicesUrl = "http://www.eleooo.com/public/RestHandler.ashx/";
        //var servicesUrl = "http://localhost:4726/public/RestHandler.ashx/";
        var xhrs = {};
        var WebAPI = {
            Login: iniAPI('App', false, 'Login'),
            SendPassword: iniAPI('App', false, 'SendPassword'),
            Version: iniAPI('App', false, 'Version'),
            GetOrders: iniAPI('OrderMeal', true, 'GetOrders'),
            GetOrderDetail: iniAPI('OrderMeal', true, 'GetDetail'),
            GetOrderTemps: iniAPI('OrderMeal', true, 'GetTemps'),
            SendOrderTemps: iniAPI('OrderMeal', true, 'SendTemps'),
            ConfirmOrder: iniAPI('OrderMeal', true, 'SendMessage'),
            FacebookQuery: iniAPI('FaceBook', true, 'Get'),
            ReplyFacebook: iniAPI('FaceBook', true, 'Edit'),
            GetMyInfo: iniAPI('User', true, 'Get'),
            SaveMyInfo: iniAPI('User', true, 'Edit'),
            GetMenus: iniAPI('MealMenu', true, 'Get'),
            SaveMenus: iniAPI('MealMenu', true, 'Edit')
        };
        function iniAPI(name, isAuth, action) {
            action = action || "Get";
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
            data = data || {};
            if (api.isAuth) {
                data["__t"] = DataStorage.WebAuthKey();
            }
            data["__"] = (new Date()).valueOf();
            var url = getAPI(api);
            if (xhrs[url]) {
                return;
            }
            $.ajax({
                url: url,
                data: data,
                dataType: "jsonp",
                success: fnCallback,
                complete: function () {
                    delete xhrs[url];
                    app.spinner(false);
                },
                beforeSend: function () {
                    app.spinner(true);
                }
            });
            xhrs[url] = true;
        }
        return {
            Login: function (phoneNum, pwd, fnCallback) {
                execute(WebAPI.Login, { u: phoneNum, p: pwd, s: 2 }, function (result) {
                    if (result.code == 0) {
                        DataStorage.CompanyID(result.data.c);
                        DataStorage.UserID(result.data.id);
                        DataStorage.UserPhone(result.data.p);
                        DataStorage.WebAuthKey(result.data.t);
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
            GetOrders: function (data, fnCallback) {
                execute(WebAPI.GetOrders, data, fnCallback);
            },
            OrderDetail: function (orderId, fnCallback) {
                execute(WebAPI.GetOrderDetail, { id: orderId }, fnCallback);
            },
            ConfirmOrder: function (data, fnCallback) {
                execute(WebAPI.ConfirmOrder, data, fnCallback);
            },
            FacebookQuery: function (data, fnCallback) {
                execute(WebAPI.FacebookQuery, data, fnCallback);
            },
            ReplyFacebook: function (data, fnCallback) {
                execute(WebAPI.ReplyFacebook, data, fnCallback);
            },
            GetMyInfo: function (fnCallback) {
                execute(WebAPI.GetMyInfo, null, fnCallback);
            },
            SaveMyInfo: function (data, fnCallback) {
                execute(WebAPI.SaveMyInfo, data, fnCallback);
            },
            GetMenus: function (data, fnCallback) {
                execute(WebAPI.GetMenus, data, fnCallback);
            },
            SaveMenus: function (data, fnCallback) {
                execute(WebAPI.SaveMenus, data, fnCallback);
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
    window.EleoooWrapper = new _EleoooWrapper();
})();