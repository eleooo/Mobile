/// <reference path="../Application.js" />
/// <reference path="../lib/Common.js" />

(function () {
    var _OrderList = function () {
        var container = false, txtUserPhone;
        var s1, s2;
        var pageIndex = 0, pageCount = 1;
        var isLoading = false;
        var statusText = {
            notstarted: "待处理",
            inprogress: "处理中",
            modified: "已修改",
            urge: "催餐中",
            canceled: "已取消",
            completed: "订餐成功"
        };
        var p = _OrderList.prototype;
        function getSumInfoObj() {
            var sumInfo = {
                counter: { notstarted: numeral(0), inprogress: numeral(0), modified: numeral(0), urge: numeral(0), canceled: numeral(0), completed: numeral(0), all: numeral(0) },
                summary: { sum: numeral(0), sumok: numeral(0), sumcash: numeral(0), sumpoint: numeral(0) }
            };
            return sumInfo;
        }
        function processRender(orderData, isSyn) {
            //            var viewData = {
            //                counter: { notStarted: 0, inProgress: 0, modified: 0, urge: 0, canceled: 0, completed: 0, all: 0 },
            //                summary: { sum: 0, sumOk: 0, sumCash: 0, sumPoint: 0 },
            //                orders: orderData
            //            };
            //            container.html(VT["OrderListContainer"](viewData));
            //            setSummaryInfo(viewData);
            if (!isSyn && pageIndex == 0) {
                container.html("");
            }
            var item, oldItem, order, status;
            for (var i = 0; i < orderData.length; i++) {
                order = orderData[i];
                order["status"] = getOrderStatus(order);
                item = $(VT["OrderListItem"](order));
                for (var o in order) {
                    if (o && o != "ID" && o != "status")
                        item.attr(o.toLowerCase(), order[o]);
                }
                oldItem = container.find("#" + order.ID);
                if (oldItem.length == 0)
                    container.append(item);
                else
                    oldItem.replaceWith(item);
            }
            var sumInfo = getSumInfoObj();
            var items = container.find("li").each(function (i, el) {
                calcItemInfo(el, sumInfo);
            });
            items.remove().sort(function (a, b) {
                return parseInt(b.id) - parseInt(a.id);
            });
            container.append(items);
            setSummaryInfo(sumInfo);
            delete sumInfo;
        }
        function getOrderStatus(item) {
            var status;
            if (item.OrderStatus == 2) {
                status = "notstarted";
            } else if (item.OrderStatus == 3) {
                status = "modified";
            } else if (item.OrderStatus == 4) {
                if (item.OrderDateUpload > item.OrderDate) {
                    status = "urge";
                } else {
                    status = "inprogress";
                }
            } else if (item.OrderStatus == 5) {
                status = "canceled";
            } else if (item.OrderStatus == 6) {
                status = "completed";
            }
            return { status: status, text: statusText[status] };
        }
        function setSummaryInfo(data) {
            for (var c in data.counter) {
                $("a[status='" + c + "']", s1).find("i").text(data.counter[c].format('0'));
            }
            for (var s in data.summary) {
                $("i[status='" + s + "']", s2).text(data.summary[s].format('0.00'));
            }
        }
        function calcItemInfo(item, data) {
            var status = item.getAttribute("status");
            if (data.counter[status] != undefined) {
                data.counter[status].add(1);
            }
            data.counter.all.add(1);
            data.summary.sum.add(item.getAttribute("ordersum"));
            data.summary.sumok.add(item.getAttribute("ordersumok"));
            data.summary.sumcash.add(item.getAttribute("orderpaycash"));
            data.summary.sumpoint.add(item.getAttribute("orderpoint"));
        }
        function filterOrderList() {
            var status = $(this).attr("status");
            var sumInfo = getSumInfoObj();
            if (status == 'all') {
                s1.hide();
                s2.show();
                $("li", container).show().each(function (i, el) {
                    calcItemInfo(el, sumInfo);
                });
            } else {
                container.find("li").each(function (i, el) {
                    if (el.getAttribute("status") == status) {
                        el.style.display = "list-item";
                        calcItemInfo(el, sumInfo);
                    }
                    else
                        el.style.display = "none";
                });
            }
            setSummaryInfo(sumInfo);
            delete sumInfo;
        }
        function getOrders(isSyn, fn) {
            if (isLoading) {
                if (fn) { fn(); }
                return;
            }
            if (!isSyn && pageIndex >= pageCount)
                return;
            var args = {
                d1: $("#txtOrderListBeginDate").val(),
                d2: $("#txtOrderListEndDate").val(),
                c: DataStorage.CompanyID(),
                p: pageIndex + 1,
                q: getInputPhone()
            };
            if (isSyn) {
                args["t"] = DataStorage.LatestUpdateOn();
            }
            isLoading = true;
            EleoooWrapper.GetOrders(args, function (result) {
                if (result.code > -1) {
                    if (pageIndex == 0) {
                        DataStorage.LatestUpdateOn(result.data.orders.length > 0 ? result.data.orders[0].OrderUpdateOn : args.d1);
                    }
                    processRender(result.data.orders, isSyn);
                    isLoading = false;
                    if (!isSyn) {
                        pageIndex++;
                        pageCount = result.data.pageCount;
                    }
                    if (fn) { fn(); }
                }
                else
                    app.logInfo(result.message);
            });
        }
        function SynOrderList() {
            setTimeout(function () {
                getOrders(true, SynOrderList);
            }, 5000);
        }
        function getInputPhone() {
            val = txtUserPhone.val();
            if (val == txtUserPhone.attr('defVal'))
                return "";
            else
                return val;
        }
        p.onLoad = function (isReturn) {
            if (!isReturn) {
                app.bindDateSelector("txtOrderListBeginDate");
                app.bindDateSelector("txtOrderListEndDate");
                container = $("#orderContainer");
                s1 = $("#s1");
                s2 = $("#s2");
                $("a", s1).tap(filterOrderList);
                $("span", s2).tap(function () {
                    s1.show();
                    s2.hide();
                });
                txtUserPhone = $("#txtOrderListUserPhone").focusin(function () {
                    val = txtUserPhone.val();
                    if (val == txtUserPhone.attr('defVal'))
                        txtUserPhone.val("");
                }).focusout(function () {
                    val = txtUserPhone.val();
                    if (!val || val.length == 0)
                        txtUserPhone.val(txtUserPhone.attr("defVal"));
                });
                txtUserPhone.val(txtUserPhone.attr("defVal"));
                $(window).lazyload({ load: getOrders });
                //getOrders(false, SynOrderList);
                getOrders(false);
            }
        }
        p.renderView = function (fnCallback) {
            var d = (new Date()).format("yyyy-MM-dd");
            fnCallback({ beginDate: d, endDate: d });
        }
        p.refreshOrderList = function () {
            processRender(_dataCache);
        }

        p.showTempView = function (el) {
            app.currentOrderId(el.attr("orderid"));
            app.showTempView();
        }
        p.showHandleView = function (el) {
            app.currentOrderId(el.attr("orderid"));
            app.showOrderHandleView();
        }
        p.showOrderList = function (el) {
            pageCount = 1;
            pageIndex = 0;
            getOrders(false);
        }
    };

    var _OrderHandle = function () {
        var reviewContainer = false;
        var orders = {}, _order = {};
        var p = _OrderHandle.prototype;
        var chgPriceLog = {}, outOfStockLog = {}, isProcess = false;

        function __calcOrderSum() {
            var order;
            var sum = numeral(0);
            var itemSum = 0;
            var price;
            for (var o in orders) {
                order = orders[o];
                price = order["NewPrice"] || order.OrderPrice;
                if (order.IsCompanyItem && itemSum == 0) {
                    itemSum = order.OrderSum;
                }
                sum.add((order.IsCompanyItem ? order.OrderQty - 1 : order.OrderQty) * price);
            }
            _order.OrderSumOk = sum.add(itemSum).round(2);
            delete sum;
        };
        function __appendChgPriceLog(menuId, order) {
            //XXXXX价格调整为XX元
            if (order) {
                var NewPrice = numeral(order["NewPrice"]);
                if (NewPrice.valueOf() >= 0) {
                    chgPriceLog[menuId] = order.MenuName + "价格调整为" + NewPrice.format('0.00') + "元";
                } else if (chgPriceLog[menuId])
                    delete chgPriceLog[menuId];
                __calcOrderSum();
                __refreshMsnMessage();
                delete NewPrice;
            }
        }
        function __appendOutOfStockLog(menuId, order) {
            if (order) {
                var isOutOfStock = order["IsOutOfStock"];
                if (isOutOfStock) {
                    outOfStockLog[menuId] = order.MenuName;
                } else if (outOfStockLog[menuId])
                    delete outOfStockLog[menuId];
                __refreshMsnMessage();
            }
        }
        function __refreshMsnMessage() {
            var log1 = __getChgPriceLog();
            var log2 = __getOutOfStockLog();
            var cbMsnType = $('input:radio[value="1"]', reviewContainer).attr("data-message", "");
            var content = "";
            if (log1.length > 0) {
                var sum = numeral(_order.OrderSumOk).add(_order.ServiceSum);
                content = "经餐厅确认：" + log1.join("，") + "，您的订单总计为" + sum.format('0.00') + "元。";
                cbMsnType.eq(1).attr("data-message", content).siblings("span").html(content);
                delete sum;
            }
            if (log2.length > 0) {
                content = "很抱歉，" + log2.join("，") + "今天暂缺，请修改后重新下单。";
                var content2 = "很抱歉，" + _order.CompanyName + "表示，" + log2.join("，") + "今天暂缺，请修改后重新下单。";
                cbMsnType.eq(0).attr("data-message", content2).siblings("span").html(content);
            }
        };
        function __getChgPriceLog() {
            var log1 = [];
            for (var log in chgPriceLog) {
                log1.push(chgPriceLog[log]);
            }
            return log1;
        };
        function __getOutOfStockLog() {
            var log2 = [];
            for (var log in outOfStockLog) {
                log2.push(outOfStockLog[log]);
            }
            return log2;
        };
        p.isDlgView = true;
        p.changePrice = function (el) {
            el = $(el);
            var menuId = el.attr("data-id");
            var NewPrice = parseFloat(el.val()) || 0;
            var order = orders[menuId];
            if (order) {
                //NewPrice = NewPrice < 0 ? 0 : NewPrice;
                order["NewPrice"] = NewPrice;
                __appendChgPriceLog(menuId, order);
                $('input:radio[value="1"]', reviewContainer).eq(1).attr("checked", true);
            }
        }
        p.outOfStock = function (el) {
            var menuId = el.attr("data-id");
            var isOutOfStock = el.hasClass("green");
            var order = orders[menuId];
            if (order) {
                if (isOutOfStock)
                    order["IsOutOfStock"] = true;
                else
                    order["IsOutOfStock"] = false;
                __appendOutOfStockLog(menuId, order);
                $('input:radio[value="1"]', reviewContainer).eq(0).attr("checked", true);
            }
        }
        p.selectMsn = function (el) {
            $("input", el).attr("checked", true);
        }
        p.onLoad = function (isReturn) {
            reviewContainer = $("#reviewContainer");
        }
        p.processItem = function (item) {
            orders[item.MenuId.toString()] = item;
        }
        p.renderView = function (fnCallback) {
            EleoooWrapper.OrderDetail(app.currentOrderId(), function (result) {
                if (result.code == 0) {
                    _order = result.data;
                    fnCallback(_order);
                }
                else
                    app.logError(result.message);
            });
        }
        p.confirmOrder = function () {
            if (isProcess) {
                app.logInfo("正在发送,请稍等...");
                return;
            }
            var box = $('input:radio[name="msnType"]:checked', reviewContainer);
            var type = box.val();
            if (type == "1" && __getChgPriceLog().length == 0 && __getOutOfStockLog().length == 0) {
                app.logInfo("你还没有调整价信息或缺货信息.");
                return;
            };
            var message = box.attr("data-message");
            if (!message || message.length == 0) {
                app.logInfo("请输入回复内容.");
                return;
            }
            var args = {
                orderId: _order.OrderId,
                orderSessionVal: _order.orderSessionVal,
                msnType: type,
                message: message,
                orders: JSON.stringify(orders)
            };
            isProcess = true;
            EleoooWrapper.ConfirmOrder(args, function (result) {
                app.logInfo(result.message);
                if (result.code == 0) {
                    _order.orderSessionVal = result.data.orderSessionVal;
                }
                isProcess = false;
            });
        }
        p.toggleReview = function () {
            reviewContainer.toggle();
        }
    };

    var _Temp = function () {
        var p = _Temp.prototype;
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
                options.params = { id: app.currentOrderId(), m: message };
                var ft = new FileTransfer();
                ft.upload(imageURI, encodeURI(EleoooWrapper.getUrl("SendOrderTemps")), function (r) {
                    hasRf = false;
                    var result = JSON.parse(r.responseText);
                    if (result.code > -1) {
                        renderTempItem(result.data);
                    }
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
                    m: message,
                    id: app.currentOrderId()
                }, function (result) {
                    if (result.code < 0)
                        app.logError(result.message);
                    else {
                        hasRf = false;
                        renderTempItem(result.data);
                    }
                });
        }
        function renderTempItem(item) {
            var el = tempContainer.find("#" + item.id);
            if (el.length > 0) {
                el.replaceWith(VT["TempItem"](item));
            } else {
                tempContainer.appned(VT["TempItem"](item));
            }
        }
        function renderTempList(data) {
            for (var i = 0; i < data.length; i++) {
                renderTempItem(data[i]);
            }
        }
        function recordVoice(isTouchStarting) {
            if (!app.isCordovaApp() && isTouchStarting) {
                app.logError("暂不支持此操作.");
                return;
            }
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
        function getTempsList() {
            EleoooWrapper.callServices("GetOrderTemps", { id: app.currentOrderId() }, function (result) {
                if (result.code == 0) {
                    renderTempList(result.data.temps);
                    $("#phone").text(result.data.phone);
                    $("#timespan").text(result.data.timespan);
                }
            });
        }
        p.isDlgView = true;
        p.onLoad = function (isReturn) {
            tempContainer = $("#tempContainer");
            $("#recordVoice").bind("vmousedown", function () { recordVoice(true); })
                             .bind("vmouseup", function () { recordVoice(false); });
            hasRf = false;
            getTempsList();
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
    window.$_OrderList = _OrderList;
    window.$_OrderHandle = _OrderHandle;
    window.$_Temp = _Temp;
})(window);