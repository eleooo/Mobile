/// <reference path="../../js/app.js" />

(function () {
    var _OrderList = function () {
        var fields = ["ID",
                "OrderDate",
                "OrderMemberID",
                "OrderSellerID",
                "MemberPhoneNumber",
                "OrderSum",
                "OrderSumOk",
                "OrderPoint",
                "OrderPay",
                "OrderPayPoint",
                "OrderPayCash",
                "OrderStatus", //
                "OrderUpdateOn",
                "OrderDateUpload",
                "OrderNum"];
        var commandText = false;
        var dtBegin = false, dtEnd = false;
        var container = false;
        var s1, s2;
        var _dataCache = false;
        var statusText = {
            notStarted: "待处理",
            inProgress: "处理中",
            modified: "已修改",
            urge: "催餐中",
            canceled: "已取消",
            completed: "订餐成功"
        };
        var p = _OrderList.prototype;
        function getSQL() {
            if (!commandText) {
                commandText = "REPLACE INTO Orders(" + fields.join(",") + ")VALUES(" + new Array(fields.length).join("?,") + "?)";
            }
            return commandText;
        }
        function toSaveCmd(datas) {
            var cmds = [];
            $.each(datas, function (i, data) {
                var p = [];
                $.each(fields, function (j, field) {
                    p.push(data[field]);
                });
                cmds.push(DataStorage.getCommand(getsql, p));
            });
            return cmds;
        }
        function processRender(orderData) {
            var viewData = {
                counter: { notStarted: 0, inProgress: 0, modified: 0, urge: 0, canceled: 0, completed: 0, all: 0 },
                summary: { sum: 0, sumOk: 0, sumCash: 0, sumPoint: 0 },
                orders: orderData
            };
            container.html(VT["OrderListContainer"](viewData));
            setSummaryInfo(viewData);
        }
        function showOrderList() {
            if (!DataStorage.supportDatabase()) {
                processRender(_dataCache);
                return;
            }
            var sql = ["select * from Orders where OrderDate Between ? and ? ",
                   $("#txtUserPhone").val() ? " and MemberPhoneNumber = '" + $("#txtUserPhone").val() + "'" : '',
                   " Order By Id Desc"];
            dtBegin = $("#txtBeginDate").val();
            dtEnd = $("#txtEndDate").val();
            var dt = new Date(dtEnd);
            dt.setDate(dt.getDate() + 1);
            var cmd = DataStorage.getCommand(sql.join(''), [dtBegin, dt.format("yyyy-MM-dd")], function (transaction, results, rowsArray) {
                processRender(rowsArray);
            });
            DataStorage.execute(cmd);
        }
        function setSummaryInfo(data) {
            for (var c in data.counter) {
                $("a", s1).find("[status='" + c + "'] > i").text(data.counter[c]);
            }
            for (var s in data.summary) {
                $("i", s1).find("[status='" + s + "']").text(data.summary[s]);
            }
        }
        function filterOrderList() {
            var status = $(this).attr("status");
            if (status == 'all') {
                s1.hide();
                s2.show();
                $("li", container).show();
            } else {
                $("li", container).hide().find("[status='" + status + "']").show();
            }
            //setSummaryInfo(null);
        }

        p.onLoad = function (isReturn) {
            if (!isReturn) {
                app.bindDateSelector("txtBeginDate");
                app.bindDateSelector("txtEndDate");
                container = $("#orderContainer");
                showOrderList();
                s1 = $("#s1");
                s2 = $("#s2");
                $("a", s1).tap(filterOrderList);
                $("span", s2).tap(function () {
                    s1.show();
                    s2.hide();
                });
            }
        }
        p.renderView = function (fnCallback) {
            if (!dtBegin || !dtEnd) {
                var d = new Date();
                dtBegin = d.format("yyyy-MM-dd");
                dtEnd = dtBegin;
            }
            fnCallback({ beginDate: dtBegin, endDate: dtEnd });
        }
        p.saveSynResult = function (result, fnHandler) {
            if (!DataStorage.supportDatabase()) {
                _dataCache = result.data.orders;
                if (result.data.orders.length > 0) {
                    DataStorage.LatestUpdateOn(result.data.orders[0].OrderUpdateOn);
                }
                fnHandler();
            } else {
                DataStorage.execute(toSaveCmd(result.data.orders), function () {
                    if (result.data.orders.length > 0) {
                        DataStorage.LatestUpdateOn(result.data.orders[0].OrderUpdateOn);
                    }
                    fnHandler();
                });
            }
        }
        p.refreshOrderList = function () {
            showOrderList();
        }
        p.calcItemInfo = function (item, data) {
            //public enum OrderStatus
            //{
            //    Commonn = 1,
            //    NotStart = 2,
            //    Modified = 3,
            //    InProgress = 4,
            //    Canceled = 5,
            //    Completed = 6,
            //} 
            //counter: { notStarted: 0, inProgress: 0, modified: 0, urge: 0, canceled: 0, completed: 0 },
            //summary: { sum: 0, sumOk: 0, sumCash: 0, sumPoint: 0 },
            var status;
            if (item.OrderStatus == 2) {
                data.counter.notStarted += 1;
                status = "notStarted";
            } else if (item.OrderStatus == 3) {
                data.counter.modified += 1;
                status = "modified";
            } else if (item.OrderStatus == 4) {
                if (item.OrderDateUpload > item.OrderDate) {
                    data.counter.urge += 1;
                    status = "urge";
                } else {
                    data.counter.inProgress += 1;
                    status = "inProgress";
                }
            } else if (itme.OrderStatus == 5) {
                data.counter.canceled += 1;
                status = "canceled";
            } else if (item.OrderStatus == 6) {
                data.counter.completed += 1;
                status = "completed";
            }
            data.counter.all += 1;
            data.summary.sum += item.OrderSum;
            data.summary.sumOk += item.OrderSumOk;
            data.summary.sumCash += item.OrderPayCash;
            data.summary.sumPoint += item.OrderPoint;
            return { status: status, text: statusText[status] };
        }
        p.showTempView = function (el) {
            app.currentOrderId(el.attr("orderid"));
            app.showTempView();
        }
        p.showHandleView = function (el) {
            app.currentOrderId(el.attr("orderid"));
            app.showOrderHandleView();
        }

        p.getBeginDate = function () {
            return dtBegin;
        }
        p.getEndDate = function () {
            return dtEnd;
        }
        p.getPhone = function () {
            return $("#txtUserPhone").val();
        }
    };

    var _OrderHandle = function () {
        var reviewContainer = false;
        var orders = false;
        var p = _OrderHandle.prototype;
        p.isDlgView = true;
        p.changePrice = function (el) {
        }
        p.outOfStock = function (el) {
        }
        p.selectMsn = function (el) {
            $("input", el).attr("checked", true);
        }
        p.onLoad = function (isReturn) {
            reviewContainer = $("#reviewContainer");
        }
        p.renderView = function (fnCallback) {
            EleoooWrapper.OrderDetail(app.currentOrderId(), function (result) {
                if (result.code == 0) {
                    orders = result.data;
                    fnCallback(orders);
                }
                else
                    app.logError(result.message);
            });
        }
        p.confirmOrder = function () {

        }
        p.toggleReview = function () {
            reviewContainer.toggle();
        }
    };

    var _Temp = function () {
        var p = _Temp.prototype;
        var temps = false;
        var tempContainer = false;
        var rv = false;
        var rfUrl = "voice.mp3";
        var hasRf = false;
        function sendVoiceMessageCore(message) {
            if (hasRf) {
                var options = new FileUploadOptions();
                options.fileKey = "voice";
                options.fileName = rfUrl;
                options.mimeType = "media/mp3";
                options.params = { orderId: app.currentOrderId(), message: message };
                var ft = new FileTransfer();
                ft.upload(imageURI, encodeURI(EleoooWrapper.getUrl("SendOrderTemps")), function (r) {
                    hasRf = false;
                    refreshTempsList(undefined);
                }, function (error) {
                    app.logError(error.source);
                }, options);
            }
        }
        function sendMessageCore(message) {
            if (hasRf)
                sendVoiceMessageCore(message);
            else
                EleoooWrapper.callServices("SendOrderTemps", {
                    message: message,
                    orderId: app.currentOrderId()
                }, function (result) {
                    if (result.code < 0)
                        app.logError(result.message);
                    else {
                        hasRf = false;
                        refreshTempsList(undefined);
                    }
                });
        }
        function renderTempList(data) {
            tempContainer.html(VT["TempContainer"](data));
        }
        function recordVoice(isTouchStarting) {
            if (isTouchStarting) {
                if (!rv) {
                    rv = new Media(rfUrl);
                    rv.startRecord();
                }
            } else if (rv) {
                rv.stopRecord();
                hasRf = rv.getDuration() >= 2;
                rv.release();
                rv = false;
            }
        }
        function refreshTempsList(fnCallback) {
            EleoooWrapper.callServices("GetOrderTemps", { orderId: app.currentOrderId() }, function (result) {
                if (result.code == 0) {
                    if ($.isFunction(fnCallback)) {
                        temps = result.data.temps;
                        fnCallback(result.data);
                    } else {
                        renderTempList(result.data.temps);
                    }
                }
            });
        }
        p.isDlgView = true;
        p.onLoad = function (isReturn) {
            tempContainer = $("#tempContainer");
            $("#recordVoice").bind("vmousedown", function () { recordVoice(true); })
                         .bind("vmouseup", function () { recordVoice(false); });
            hasRf = false;
            renderTempList(temps);
        }
        p.renderView = function (fnCallback) {
            refreshTempsList(fnCallback);
        }
        p.playVoice = function (el) {
            app.play(el.attr('voice'));
        }
        p.sendMessage = function () {
            var val = $("#txtMessage").val();
            if (val && val.length > 0)
                sendMessageCore(val);
            else
                $("#temp_review").toggle();
        }
        p.quickSend = function (el) {
            sendMessageCore(el.val());
            $("#temp_review").toggle();
        }
    }
    window._OrderList = _OrderList;
    window._OrderHandle = _OrderHandle;
    window._Temp = _Temp;
})(window);