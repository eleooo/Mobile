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
    var _WS = function () {
        var xhrs = {};
        var jq = typeof(Zepto) == undefined;
        var WebAPI = {
            Login: iniAPI('App', false, 'Login'),
            SendPassword: iniAPI('App', false, 'SendPassword'),
            Ver: iniAPI('App', false, 'GetVer'),
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
            SaveMenus: iniAPI('MealMenu', true, 'Edit'),
            GetItem: iniAPI('OrderMeal', true, 'GetItem'),
            SaveItem: iniAPI('OrderMeal', true, 'SaveItem'),
            GetItems: iniAPI('OrderMeal', true, 'GetItems'),
            GetRushItems: iniAPI('OrderMeal', true, 'GetRushItems'),
            DelItem: iniAPI('OrderMeal', true, 'DelItem'),
            GetFinance: iniAPI('App', true, 'GetFinance'),
        };
        function iniAPI(name, isAuth, action) {
            action = action || "Get";
            return { name: name, isAuth: isAuth, action: action };
        }
        function getAPI(api) {
            return app.getUrl() + '/public/RestHandler.ashx/' + api.name + "/" + api.action;
        }
        function execute(api, data, fnCallback) {
            if (!app.ol()) {
                fnCallback({ code: -1, message: '网络没有连接.' });
                return;
            }
            data = data || {};
            if (api.isAuth) {
                data["__t"] = DS.WebAuthKey();
            }
            var url = getAPI(api);
            //console.log("begin call api:"+url);
            //console.log(JSON.stringify(data));

            if (xhrs[url]) {
                return;
            }
            $.ajax({
                url: url,
                data: data,
                dataType: "jsonp",
                type:"POST",
                cache:false,
                success: function (result) { fnCallback(result); delete data; delete result; },
                complete: function () {
                    delete xhrs[url];
                    app.spinner(false);
                },
                beforeSend: function () {
                    app.spinner(true);
                },
                error: function (xhr, type) {
                    delete xhrs[url];
                    app.spinner(false);
                    app.showtips("services call errors.");
                }
            });
            xhrs[url] = true;
        }
        return {
            Login: function (phoneNum, pwd, fnCallback) {
                execute(WebAPI.Login, { u: phoneNum, p: pwd, s: 2 }, function (result) {
                    if (result.code == 0) {
                        DS.CompanyID(result.data.c);
                        DS.UserID(result.data.id);
                        DS.UserPhone(result.data.p);
                        DS.WebAuthKey(result.data.t);
                    }
                    fnCallback(result);
                });
            },
            SendPassword: function (phoneNum, fnCallback) {
                execute(WebAPI.SendPassword, { phone: phoneNum }, fnCallback);
            },
            Ver:function(){
                execute(WebAPI.Ver,undefined,function(result){
                    app.logInfo("current version :"+result.data);
                    DS.Version(result.data);
                });
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
            GetItem: function (id, fnCallback) {
                execute(WebAPI.GetItem, { id: id }, fnCallback);
            },
            GetItems: function (data, fnCallback) {
                execute(WebAPI.GetItems, data, fnCallback);
            },
            GetRushItems: function (data, fnCallback) {
                execute(WebAPI.GetRushItems, data, fnCallback);
            },
            SaveItem: function (data, fnCallback) {
                execute(WebAPI.SaveItem, data, fnCallback);
            },
            delItem: function (data, fnCallback) {
                execute(WebAPI.DelItem, data, fnCallback);
            },
            GetFinance:function(data,fnCallback){
                execute(WebAPI.GetFinance,data,fnCallback);
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
    window.WS = new _WS();
})();