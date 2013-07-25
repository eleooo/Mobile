/// <reference path="../Application.js" />
/// <reference path="../lib/Common.js" />
/// <reference path="../DS.js" />

(function () {
    var _OrderList = function () {
        var container, content, txtUserPhone, _box = false;
        var s1, s2;
        var cFilter, crtn;
        var pageIndex = 0, pageCount = 1;
        var isLoading = false, flag = 0;
        var scroller = false;
        var statusText = {
            notstarted: "待处理",
            inprogress: "处理中",
            modified: "已修改",
            urge: "催餐中",
            canceled: "已取消",
            completed: "订餐成功"
        };
        var childView = ['OrderHandle', 'Temp'];
        var p = _OrderList.prototype;
        function getSumInfoObj() {
            var sumInfo = {
                counter: { notstarted: numeral(0), inprogress: numeral(0), modified: numeral(0), urge: numeral(0), canceled: numeral(0), completed: numeral(0), all: numeral(0) },
                summary: { sum: numeral(0), sumok: numeral(0), sumcash: numeral(0), sumpoint: numeral(0) }
            };
            return sumInfo;
        }
        function getMaxDate(orderData, date) {
            var i;
            for (i = 0; i < orderData.length; i++) {
                if (orderData[i].OrderUpdateOn > date)
                    date = orderData[i].OrderUpdateOn;
            }
            return date;
        }
        function processRender(orderData, isSyn) {
            //            var viewData = {
            //                counter: { notStarted: 0, inProgress: 0, modified: 0, urge: 0, canceled: 0, completed: 0, all: 0 },
            //                summary: { sum: 0, sumOk: 0, sumCash: 0, sumPoint: 0 },
            //                orders: orderData
            //            };
            //            container.html(VT["OrderListContainer"](viewData));
            //            setSummaryInfo(viewData);
            //SZ0101022012122500002
            //'SZ0101022012122500002'.match(/[1-9][0-9]{0,3}$/) || []).join('')
            var item, oldItem, order, status, firstChild = false;
            var isEmpty = container.attr('empty') === '1';
            var tempContainer = isEmpty ? container.clone() : container;
            if (isSyn)
                firstChild = tempContainer.children().first();
            var isFilter = cFilter !== 'all';
            for (var i = 0; i < orderData.length; i++) {
                order = orderData[i];
                status = getOrderStatus(order);
                order["status"] = status;
                item = $(VT["OrderListItem"](order));
                for (var o in order) {
                    if (o && o != "ID" && o != "status")
                        item.attr("data-" + o.toLowerCase(), order[o]);
                }
                isFilter && ((cFilter !== false && cFilter !== status.status) || (cFilter === false && status.status === 'canceled')) ? item.hide() : item.show();
                oldItem = tempContainer.find("#_" + order.ID);
                if (oldItem.length == 0) {
                    if (isSyn && firstChild && firstChild.length > 0) {
                        firstChild.before(item);
                        firstChild = item;
                    } else {
                        if (firstChild && firstChild.length == 0)
                            firstChild = item;
                        tempContainer.append(item);
                    }
                }
                else
                    oldItem.replaceWith(item);
            }
            var items = tempContainer.find("li");
            //            if (isSyn) {
            //                items.remove().sort(function (a, b) {
            //                    return parseInt(b.getAttribute("data-id")) - parseInt(a.getAttribute("data-id"));
            //                });
            //            }
            if (isEmpty)
                container.html(tempContainer.html());
            container.attr('empty', 0);
            calcItemsInfo(items);
        }
        function getOrderStatus(item) {
            var status = '', cls = 'red';
            if (item.OrderStatus == 2) {
                status = "notstarted";
            } else if (item.OrderStatus == 3) {
                status = "modified";
                cls = 'yellow';
            } else if (item.OrderStatus == 4) {
                if (item.OrderDateUpload > item.OrderDate && item.MsnType != 5 && item.MsnType != 3) {
                    status = "urge";
                } else {
                    status = "inprogress";
                    cls = 'green';
                }
            } else if (item.OrderStatus == 5) {
                status = "canceled";
                cls = 'dark';
            } else if (item.OrderStatus == 6) {
                status = "completed";
                cls = item.OrderDateDeliver > item.OrderDate ? 'dark' : 'green';
            }

            return { status: status, text: statusText[status], cls: cls };
        }
        function calcItemsInfo(items) {
            var sumInfo = getSumInfoObj();
            items.each(function (i, el) {
                calcItemInfo(el, sumInfo);
            });
            setSummaryInfo(sumInfo);
            delete sumInfo;
        }
        function setSummaryInfo(data) {
            for (var c in data.counter) {
                $("a[data-status='" + c + "']", s1).find("i").text(data.counter[c].format('0'));
            }
            for (var s in data.summary) {
                $("i[data-status='" + s + "']", s2).text(data.summary[s].format('0.00'));
            }
            $("i[data-status='all']", s2).text(data.counter.all.format('0'));
        }
        function calcItemInfo(item, data) {
            var status = item.getAttribute("data-status");
            if (data.counter[status] != undefined) {
                data.counter[status].add(1);
            }
            data.counter.all.add(1);
            data.summary.sum.add(item.getAttribute("data-ordersum"));
            data.summary.sumok.add(item.getAttribute("data-ordersumok"));
            data.summary.sumcash.add(item.getAttribute("data-orderpaycash"));
            data.summary.sumpoint.add(item.getAttribute("data-orderpoint"));
        }
        function visible() {
            return app.cview() === 'OrderList';
            //return _box.css('display') !== 'none';
            //return !_box.hasClass('hide');
        }
        function filterOrderList(status, isret) {
            if (status == cFilter) return;
            //var sumInfo = getSumInfoObj();
            if (status == 'all') {
                s1.hide();
                s2.show();
                $("li", container).show();
                //$("li", container).show().each(function (i, el) {
                //   calcItemInfo(el, sumInfo);
                //});
            } else {
                container.find("li").each(function (i, el) {
                    if (el.getAttribute("data-status") == status) {
                        el.style.display = "list-item";
                        //calcItemInfo(el, sumInfo);
                    }
                    else
                        el.style.display = "none";
                });
            }
            //setSummaryInfo(sumInfo);
            //delete sumInfo;
            cFilter = status;
            scroller.refresh();
        }
        function getOrders(isSyn, fn) {
            if (isLoading) {
                if (fn) { fn(); }
                return;
            }
            if (!isSyn && pageIndex >= pageCount)
                return;
            var args = {
                d1: $("#txtOrderListBeginDate", _box).val(),
                d2: $("#txtOrderListEndDate", _box).val(),
                c: DS.CompanyID(),
                p: pageIndex + 1,
                q: txtUserPhone.val()
            };
            if (isSyn) {
                args["t"] = DS.LatestUpdateOn();
            }
            isLoading = true;
            WS.GetOrders(args, function (result) {
                if (result.code > -1) {
                    if (pageIndex == 0 && !app.psInited()) {
                        //app.showtips("connect ps 0");
                        DS.LatestUpdateOn(getMaxDate(result.data.orders, args.d1));
                        if (app.isSocket())
                            app.initPS();
                        else if (flag == 0) {
                            flag = 1;
                            SynOrderList();
                        }
                    }
                    if (result.data.orders.length > 0) {
                        processRender(result.data.orders, isSyn);
                        isLoading = false;
                        if (!isSyn) {
                            pageIndex++;
                            pageCount = result.data.pageCount;
                        }
                    }
                    if (fn) { fn(); }
                    if (visible())
                        scroller.refresh();
                }
                else
                    app.logInfo(result.message);
            });
        }
        function SynOrderList() {
            if (flag == 1) {
                setTimeout(function () {
                    getOrders(true, SynOrderList);
                }, 5000);
            }
        }
        p.goback = function () {
            crtn.hide();
            container.find("li").each(function (i, el) {
                el.getAttribute('data-status') === 'canceled' ? el.style.display = "none" : el.style.display = "list-item";
            });
            if (cFilter == 'all') {
                s1.show();
                s2.hide();
            }
            cFilter = false;
            scroller.refresh();
        }
        p.box = function (el) {
            if (el) _box = el;
            return _box;
        }
        p.reset = function (by) {
            if (childView.indexOf(by) === -1) {
                pageCount = 1;
                pageIndex = 0;
                isLoading = false;
                flag = 0;
                txtUserPhone.val('');
                container.html("").attr('empty', 1);
                cFilter = false;
                crtn.hide();
            }
        }
        p.show = function (arg, by) {
            childView.indexOf(by) === -1 ? (p.reset(by), getOrders(false)) : void (0);
        }
        p.init = function () {
            app.bindDateSelector("txtOrderListBeginDate", _box);
            app.bindDateSelector("txtOrderListEndDate", _box);
            container = $("#orderContainer", _box);
            content = $(".content", _box);
            crtn = $(".return", _box);
            s1 = $("#s1");
            s2 = $("#s2");
            $("a", s1).tap(function () {
                filterOrderList($(this).attr("data-status"));
                cFilter ? crtn.show() : void (0);
            });
            $("span", s2).tap(function () {
                s1.show();
                s2.hide();
            });
            txtUserPhone = $("#txtOrderListUserPhone", _box);
            //            txtUserPhone = $("#txtOrderListUserPhone", _box).focusin(function () {
            //                val = txtUserPhone.val();
            //                if (val == txtUserPhone.attr('defVal'))
            //                    txtUserPhone.val("");
            //            }).focusout(function () {
            //                val = txtUserPhone.val();
            //                if (!val || val.length == 0)
            //                    txtUserPhone.val(txtUserPhone.attr("defVal"));
            //            });

            scroller = app.iscroll(_box.find(".content").get(0));
            scroller.on('scrollEnd', function () {
                if (Math.abs(scroller.y) >= Math.abs(scroller.maxScrollY)) {
                    getOrders(false);

                }
            });
        }
        p.onPushOrder = function (result) {
            if (result.data.length > 0) {
                isLoading = true;
                DS.LatestUpdateOn(result.data, DS.LatestUpdateOn());
                processRender(result.data, true);
                isLoading = false;
                if (result.hasNew && !$D.WIN) {
                    //app.notify("你有新的订单需要处理.", "乐多分");
                    navigator.notification.beep(2);
                }
            }
        }
        p.renderView = function (fnCallback) {
            var d = (new Date()).format("yyyy-MM-dd");
            fnCallback({ beginDate: d, endDate: d });
        }
        p.showTempView = function (el) {
            app.showTemp(el.attr("data-id"));
        }
        p.showHandleView = function (el) {
            //var status = el.attr('data-status');
            //if (unHandle.indexOf(status) === -1)
            app.showOrderHandle({ id: el.attr("data-id"), status: el.attr('data-status') });
        }
        p.showOrderList = function (el) {
            pageCount = 1;
            pageIndex = 0;
            isLoading = false;
            container.html("").attr('empty', 1);
            cFilter = false;
            crtn.hide();
            scroller.refresh();
            getOrders(false);
        }
    };

    var _OrderHandle = function () {
        var reviewContainer = false, _box = false;
        var orders, _order;
        var p = _OrderHandle.prototype;
        var chgPriceLog, outOfStockLog, isProcess = false;
        var scroller, cthandler, cthnum, cthts;
        var unHandle = ['canceled', 'completed', 'inprogress'];
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
            var cbMsnType = $('input[value="1"]', reviewContainer).attr("data-message", "");
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
        p.box = function (el) {
            if (el) _box = el;
            return _box;
        }
        p.changePrice = function (el) {
            el = $(el);
            var menuId = el.attr("data-id");
            var NewPrice = parseFloat(el.val()) || 0;
            var order = orders[menuId];
            if (order) {
                //NewPrice = NewPrice < 0 ? 0 : NewPrice;
                order["NewPrice"] = NewPrice;
                __appendChgPriceLog(menuId, order);
                $('input[value="1"]', reviewContainer).eq(1).attr("checked", true);
                scroller.scrollTo(0, scroller.maxScrollY);
            }
        }
        p.outOfStock = function (el) {
            var menuId = el.attr("data-id");
            var isOutOfStock = el.hasClass("green");
            var order = orders[menuId];
            if (order) {
                if (isOutOfStock) {
                    order["IsOutOfStock"] = true;
                    el.addClass("red").removeClass("green");
                }
                else {
                    order["IsOutOfStock"] = false;
                    el.addClass("green").removeClass("red");
                }
                __appendOutOfStockLog(menuId, order);
                $('input[value="1"]', reviewContainer).eq(0).attr("checked", true);
                scroller.scrollTo(0, scroller.maxScrollY);
            }
        }
        p.selectMsn = function (el) {
            el.find("input").attr("checked", true);
        }
        p.init = function () {
            cthandler = $("#cthandler", _box);
            cthnum = $("#cthnum", _box);
            cthts = $("#cthts", _box);
            scroller = app.iscroll(cthandler.parent().get(0));
        }
        p.reset = function () {
            orders = {};
            _order = null;
            chgPriceLog = {};
            outOfStockLog = {};
            cthandler.html('');
            cthnum.text('');
            cthts.text('');
        }
        p.show = function (arg) {
            p.reset();
            WS.OrderDetail(arg.id, function (result) {
                if (result.code == 0) {
                    _order = result.data;
                    cthnum.text(_order.MemberPhoneNumber).attr('href', 'tel:' + _order.MemberPhoneNumber);
                    cthts.text(_order.Timespan);
                    cthandler.html(VT["OrderHandleView"](_order));
                    reviewContainer = $("#reviewContainer", _box);
                    if (unHandle.indexOf(arg.status) > -1)
                        $("#btnReview", reviewContainer).hide();
                    scroller.refresh();
                }
                else
                    app.logError(result.message);
            });
        }
        p.processItem = function (item) {
            orders[item.MenuId.toString()] = item;
        }
        p.confirmOrder = function () {
            if (isProcess) {
                app.logInfo("正在发送,请稍等...");
                return;
            }
            var box = $('input[name="msnType"]:checked', reviewContainer);
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
            WS.ConfirmOrder(args, function (result) {
                app.logInfo(result.message);
                if (result.code == 0) {
                    _order.orderSessionVal = result.data.orderSessionVal;
                }
                isProcess = false;
            });
        }
        p.toggleReview = function () {
            reviewContainer.toggle();
            scroller.refresh();
            if (reviewContainer.css('display') != 'none')
                scroller.scrollTo(0, scroller.maxScrollY);
        }
    };

    var _Temp = function () {
        var p = _Temp.prototype, _box = false;
        var container = false;
        var rv = false;
        var rfUrl = "voice.wav";
        var fPath = false;
        var hasRf = false;
        var id = 0;
        var scroller;
        function sendVoiceMessageCore(message) {
            if (hasRf) {
                var options = new FileUploadOptions();
                options.fileKey = "voice";
                options.fileName = rfUrl;
                options.mimeType = "media/mp3";
                options.params = { id: id, m: message };
                var ft = new FileTransfer();
                ft.upload(fPath + rfUrl, encodeURI(WS.getUrl("SendOrderTemps")), function (r) {
                    hasRf = false;
                    var result = JSON.parse(r.responseText);
                    if (result.code > -1) {
                        renderTempItem(container, result.data);
                        $("#txtMessage", _box).val("");
                        scroller.refresh();
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
                WS.callServices("SendOrderTemps", { m: message, id: id }, function (result) {
                    if (result.code < 0)
                        app.logError(result.message);
                    else {
                        hasRf = false;
                        renderTempItem(container, result.data);
                        $("#txtMessage", _box).val("");
                        $("#temp_review", _box).hide();
                        scroller.refresh();
                    }
                });
        }
        function renderTempItem(ct, item) {
            var el = ct.find("#_" + item.id);
            if (el.length > 0) {
                el.replaceWith(VT["TempItem"](item));
            } else {
                ct.append(VT["TempItem"](item));
            }
        }
        function renderTempList(data) {
            var isempty = container.attr('empty') === '1';
            var tempContainer = isempty ? container.clone() : container;
            for (var i = 0; i < data.length; i++) {
                renderTempItem(tempContainer, data[i]);
            }
            if (isempty)
                container.html(tempContainer.html());
            container.attr('empty', 0);
        }
        function recordVoice(isTouchStarting) {
            if (!app.isCordovaApp() && isTouchStarting) {
                app.logError("暂不支持此操作.");
                return;
            }
            if (isTouchStarting) {
                if (!fPath) {
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
                        fPath = fs.root.fullPath + '/';
                    }, function (evt) {
                        app.logError("获取系统目录失败:" + evt.target.error.code);
                    });
                } else {
                    if (!rv) {
                        rv = new Media(fPath + rfUrl, function () {
                            console.log("recordAudio():Audio Success");
                        }, function (err) {
                            console.log("recordAudio():Audio Error: " + err.code);
                        });
                        rv.startRecord();
                    }
                }
            } else if (rv) {
                rv.stopRecord();
                hasRf = rv.getDuration() >= 2;
                rv.release();
                rv = false;
            }
        }
        function getTempsList(orderid) {
            id = orderid;
            WS.callServices("GetOrderTemps", { id: orderid }, function (result) {
                if (result.code == 0) {
                    renderTempList(result.data.temps);
                    $("#phone", _box).text(result.data.MemberPhoneNumber).attr('href', 'tel:' + result.data.MemberPhoneNumber);
                    $("#timespan", _box).text(result.data.Timespan);
                    scroller.refresh();
                }
            });
        }
        p.box = function (el) {
            if (el) _box = el;
            return _box;
        }
        p.show = function (arg) {
            p.reset();
            getTempsList(arg);
        }
        p.reset = function () {
            hasRf = false;
            container.html('').attr('empty', 1);
            $("#temp_review", _box).hide();
        }
        p.init = function () {
            container = $("#tempContainer", _box);
            $("#recordVoice", _box).bind("touchstart", function () { recordVoice(true); })
                             .bind("touchend", function () { recordVoice(false); });
            scroller = app.iscroll(container.parent().get(0), { scrollbars: false });
        }
        p.playVoice = function (el) {
            app.play(el.attr('voice'));
        }
        p.send = function () {
            var val = $("#txtMessage", _box).val();
            if (val && val.length > 0)
                sendMessageCore(val);
            else
                app.showtips("请输入发送内容.");
        }
        p.showqs = function (el) {
            $("#temp_review", _box).toggle();
        }
        p.quickSend = function (el) {
            $("#txtMessage", _box).val(el.text());
            $("#temp_review", _box).toggle();
        }
    }
    window.$_OrderList = _OrderList;
    window.$_OrderHandle = _OrderHandle;
    window.$_Temp = _Temp;
})(window);