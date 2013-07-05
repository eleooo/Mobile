/// <reference path="../Common.js" />
/// <reference path="../Application.js" />
/// <reference path="../WS.js" />

(function () {
    var _Sale = function () {
        //var pageIndex = 0, pageCount = 1;
        var container, pBox, _box = false;
        var curDir = false, itemInfo, dirInfos;
        var childView = 'Rush';
        var scroller, isLoading;
        var p = _Sale.prototype;
        function getItemObj() {
            var d = new Date().format("yyyy-MM-dd");
            var d1 = new Date(d).DateAdd('d', 7).format("yyyy-MM-dd");
            var names = [], sumPrice = numeral(0), item;
            $.each(itemInfo, function (i, id) {
                item = container.find("#_" + id);
                names.push(unescape(item.attr('data-name')));
                sumPrice.add(item.attr('data-price'));
            });
            var obj = {
                ItemTitle: names.join('+'),
                ItemPoint: null, //积分兑换
                ItemNeedPay: null, //现金支付
                ItemAmount: 1, //投放数量
                OrderFreqLimit: null, //消费频率
                OrderSumLimit: null, //平均金额
                ItemDate: d, //投放周期
                ItemEndDate: d1, //投放周期
                WorkingHours: null, //促销时段
                ItemLimit: 3, //抢购次数
                ItemPic: null,
                ItemSum: sumPrice.value(), //总额
                CompanyID: DS.CompanyID(),
                ItemInfo: JSON.stringify(itemInfo),
                ItemStatus: 1,
                ItemID: 0
            };
            delete names;
            delete sumPrice;
            delete items;
            return obj;
        }
        function getDirItem(ct, dirId, dirName) {
            if (curDir && curDir.id == dirId)
                return curDir;
            else {
                var dc = ct.find("#__" + dirId);
                if (dc.length == 0) {
                    dc = $("<li><h2 style=\"color: #333; cursor: pointer;\" tap='toggleMenus' data-id='" + dirId + "'>" + dirName + "</h2><div id='__" + dirId + "' data-id='" + dirId + "' style='display:none'></div></li>");
                    ct.append(dc);
                    var di = { s: 1, i: 0, d: dc.find("#__" + dirId), v: false, id: dirId, c: 0 };
                    dirInfos[dirId] = di;
                } else {
                    di = dirInfos[dirId];
                    di.d = dc;
                }
                return di;
            }
        }
        function renderDirs(ct, dirs) {
            var i, dr, di;
            for (i = 0; i < dirs.length; i++) {
                dr = dirs[i];
                di = getDirItem(ct, dr.id, dr.name);
                if (i == 0) {
                    di.d.show();
                    di.v = true;
                    curDir = di;
                }
            }
        }
        function getMenuItem(menu) {
            return VT["SaleItem"](menu);
        }
        function renderMenu(data) {
            var di, menu, item, i;
            var isEmpty = container.attr('empty') == '1';
            var tempContainer = isEmpty ? container.clone() : container;
            var menus = data.menus;
            if (data.dirs && data.dirs.length > 0)
                renderDirs(tempContainer, data.dirs);
            for (i = 0; i < menus.length; i++) {
                menu = menus[i];
                di = getDirItem(tempContainer, menu.dirid);
                item = di.d.find("#_" + menu.id);
                var m = getMenuItem(menu);
                if (item.length == 0) {
                    di.d.append(m);
                    di.c = di.c + 1;
                }
                else
                    item.replaceWith(m);
            }
            if (isEmpty) {
                container.html(tempContainer.html());
                for (i in dirInfos)
                    dirInfos[i].d = container.find("#__" + i);
            }
            if (i > 0)
                container.attr('empty', 0);
        }
        function getMenuList() {
            if (isLoading || (curDir && curDir.s && curDir.i >= curDir.s))
                return;
            var args = { p: curDir.i || 1,
                d: curDir.id || 0
            };
            isLoading = true;
            WS.GetMenus(args, function (result) {
                if (result.code > -1) {
                    renderMenu(result.data);
                    curDir.i = curDir.i + 1;
                    curDir.s = result.data.pageCount;
                }
                scroller.refresh();
                isLoading = false;
            });
        }
        p.box = function (el) {
            if (el !== undefined)
                _box = el;
            return _box;
        }
        p.reset = function (by) {
            if (by !== childView) {
                dirInfos = {};
                curDir = false;
                container.html('').attr('empty', 1);
                isLoading = false;
            }
        }
        p.show = function (arg, by) {
            p.reset(by);
            itemInfo = [];
            container.find("input.red").removeClass('red').addClass('green');
            if (by !== childView) {
                getMenuList();
            }
        }
        p.init = function () {
            container = $("#saleContainer");
            pBox = container.parent();
            //scroller = new IScroll(pBox.get(0), { bounceTime: 50, scrollbars: true, interactiveScrollbars: true });
            scroller = app.iscroll(pBox.get(0));
            scroller.on('scrollEnd', function () {
                if (Math.abs(scroller.y) >= Math.abs(scroller.maxScrollY)) {
                    getMenuList();
                }
            });
        }
        p.toggleSale = function (el) {
            if (el.hasClass('red')) {
                app.confirm("还需要继续选择菜单吗?", "促销方案", "继续选择,下一步", function (ret) {
                    if (ret == '1') {
                        Array.remove(itemInfo, parseInt(el.attr('data-id')));
                        el.removeClass('red').addClass('green');
                    } else
                        app.showRush(getItemObj());
                });
            } else {
                itemInfo.push(parseInt(el.attr('data-id')));
                el.removeClass('green').addClass('red');
                app.confirm("还需要继续选择菜单吗?", "促销方案", "继续选择,下一步", function (ret) {
                    if (ret != '1')
                        app.showRush(getItemObj());
                });
            }
        }
        p.toggleMenus = function (el) {
            if (isLoading) return;
            var di = dirInfos[el.attr('data-id')];
            //{ s: 1, i: 0, d: dr, v: false };
            if (di.v) {
                if (curDir && di.id == curDir.id) curDir = false;
                el.siblings("#__" + di.id).hide();
                scroller.refresh();
                di.v = false;
            } else {
                if (curDir) {
                    curDir.d.hide();
                    //container.find("#__" + curDir.id).hide();
                    curDir.v = false;
                }
                curDir = di;
                //el.siblings("#__" + di.id).show();
                di.v = true;
                di.d.show();
                if (di.c <= 0)
                    getMenuList();
                else
                    scroller.refresh();
            }
        }
    }
    var _Rush = function () {
        var _itemInfo = false, _box = false;
        var imgItem, inputs, itemLimits;
        var imgData = false;
        var scroller;
        function _takePicData(data) {
            imgData = data;
            imgItem.attr("src", "data:image/jpeg;base64," + data);
            imgItem.show();
        }
        function getInputdata() {
            var v, t;
            inputs.each(function (i, el) {
                v = el.value;
                t = el.getAttribute('t');
                if (t == 'dec')
                    v = parseFloat(v) || 0;
                else if (t == 'int')
                    v = parseInt(v) || 0;
                _itemInfo[el.id] = v;
            });
            _itemInfo["ItemLimit"] = parseInt(itemLimits.find('input:checked').val());
            if (_itemInfo.ItemSum < _itemInfo.ItemNeedPay) {
                app.showtips("现金支付额不能大于促销总额.");
                return false;
            }
            if (!(_itemInfo.ItemPoint >= 0.5 && _itemInfo.ItemPoint <= 1.5)) {
                app.showtips("抢购积分必须在0.5-1.5之间.");
                return false;
            }
            return true;
        }
        var p = _Rush.prototype;
        p.box = function (el) {
            if (el) _box = el;
            return _box;
        }
        p.init = function () {
            imgItem = $("#ItemPic", _box);
            inputs = $(".input", _box);
            itemLimits = $(".link", _box);
            app.bindDateSelector("ItemDate", _box);
            app.bindDateSelector("ItemEndDate", _box);
            //scroller = new IScroll(_box.find('.wrap').get(0), { scrollbars: true, interactiveScrollbars: true });
            scroller = app.iscroll(_box.find('.wrap').get(0), { scrollbars: false });
        }
        p.show = function (arg) {
            _itemInfo = arg;
            //console.log(JSON.stringify(_itemInfo));
            var v, t;
            inputs.each(function (i, el) {
                v = _itemInfo[el.id];
                t = el.getAttribute('t');
                if (v && t == 'dec')
                    v = numeral(v).format('0.00');
                el.value = v || '';
            });
            v = _itemInfo["ItemLimit"];
            itemLimits.find("input[value='" + v + "']").attr('checked', true);
            v = _itemInfo["ItemPic"];
            imgData = false;
            if (v) {
                imgItem.attr("src", v);
                imgItem.show();
            } else imgItem.hide();
            scroller.refresh();
        }
        p.takeaPic = function (el) {
            if (!app.isCordovaApp()) {
                app.showtips("暂不支持此功能.");
                return;
            }
            navigator.camera.getPicture(_takePicData, function (ex) { }, { quality: 30, destinationType: Camera.DestinationType.DATA_URL });
        }
        p.saveItem = function (el) {
            if (getInputdata()) {
                var arg = {
                    item: JSON.stringify(_itemInfo),
                    img: imgData || ''
                };
                WS.SaveItem(arg, function (result) {
                    if (result.code == 0) {
                        _itemInfo = result.data;
                        imgData = false;
                    }
                    app.showtips(result.message);
                });
            }
        }
    }
    var _SaleList = function () {
        var pageIndex = 0, pageCount = 1;
        var saleList, pBox, _box = false;
        var childView = ['Rush', 'RushRecord'];
        var p = _SaleList.prototype;
        var scroller, isLoading;
        function renderSaleList(items) {
            var item, i;
            var isEmpty = saleList.attr('empty') == '1';
            var tempContainer = isEmpty ? saleList.clone() : saleList;
            for (i = 0; i < items.length; i++) {
                item = saleList.find("#_" + items[i].ItemID);
                if (item.length == 0)
                    saleList.append(VT['SaleListItem'](items[i]));
                else
                    saleList.replaceWith(VT['SaleListItem'](items[i]));
            }
            if (isEmpty)
                saleList.html(tempContainer.html());
            if (i > 0)
                saleList.attr('empty', 0);
        }
        function getSaleList() {
            if (pageIndex >= pageCount || isLoading)
                return;
            var arg = { d1: $("#txtSaleListBeginDate", _box).val(), d2: $("#txtSaleListEndDate", _box).val(), p: pageIndex + 1 };
            isLoading = true;
            WS.GetItems(arg, function (result) {
                if (result.code > -1) {
                    if (pageIndex == 0)
                        saleList.html('').attr('empty', 1);
                    renderSaleList(result.data.items);
                    pageIndex = pageIndex + 1;
                    pageCount = result.data.pageCount;
                }
                scroller.refresh();
                isLoading = false;
            });
        }
        p.box = function (el) {
            if (el) _box = el;
            return _box;
        }
        p.reset = function (by) {
            if (childView.indexOf(by) === -1) {
                pageIndex = 0;
                pageCount = 0;
                isLoading = false;
                saleList.html('').attr('empty', 1);
            }
        }
        p.renderView = function (fnCallback) {
            var d = new Date();
            var d1 = d.DateAdd('d', 1 - d.getDate()).format("yyyy-MM-dd");
            var d2 = d.DateAdd('m', 1).format("yyyy-MM-dd");
            fnCallback({ beginDate: d1, endDate: d2 });
        }
        p.init = function () {
            saleList = $("#saleList", _box);
            pBox = saleList.parent();
            app.bindDateSelector("txtSaleListBeginDate", _box);
            app.bindDateSelector("txtSaleListEndDate", _box);
            //scroller = new IScroll(saleList.parent().get(0), { bounceTime: 50, scrollbars: true, interactiveScrollbars: true });
            scroller = app.iscroll(saleList.parent().get(0));
            scroller.on('scrollEnd', function () {
                if (Math.abs(scroller.y) >= Math.abs(scroller.maxScrollY)) {
                    getSaleList();
                }
            });
        }
        p.show = function (arg, by) {
            if (childView.indexOf(by) === -1) {
                getSaleList();
            }
        }
        p.showSaleList = function () {
            p.reset();
            getSaleList();
        }
        p.showRush = function (el) {
            WS.GetItem(el.attr('data-id'), function (result) {
                if (result.code > -1) {
                    app.showRush(result.data);
                } else
                    app.showtips(result.message);
            });
        }
        p.delItem = function (el) {
            WS.delItem({ id: el.attr('data-id') }, function (result) {
                if (result.code > -1) {
                    saleList.find("#_" + el.attr('data-id')).remove();
                    scroller.refresh();
                }
                app.showtips(result.message);
            });
        }
    }
    var _RushRecord = function () {
        var pageIndex = 0, pageCount = 1;
        var rushList, pBox, ctAmount, ctPoint, _box = false;
        var cSum = numeral(0), pSum = numeral(0);
        var scroller, isLoading;
        var p = _RushRecord.prototype;
        function renderRush(items) {
            var item, itemEl, i;
            var isEmpty = rushList.attr('empty') === '1';
            var tempContainer = isEmpty ? rushList.clone() : rushList;
            for (i = 0; i < items.length; i++) {
                item = items[i];
                itemEl = tempContainer.find("#_" + item.ItemID);
                if (itemEl.length > 0) {
                    cSum.subtract(itemEl.attr('data-qty')).add(1);
                    pSum.subtract(itemEl.attr('data-point')).add(item.ItemPoint);
                    itemEl.replaceWith(VT["RushRecordItem"](item));
                } else {
                    cSum.add(item.ItemQty);
                    pSum.add(item.PointSum);
                    tempContainer.append(VT["RushRecordItem"](item));
                }
            }
            if (isEmpty)
                rushList.html(tempContainer.html());
            if (i > 0)
                rushList.attr('empty', 0);
            ctAmount.text(cSum.format('0'));
            ctPoint.text(pSum.format('0.00'));
        }
        function getRushList() {
            if (pageIndex >= pageCount || isLoading)
                return;
            var arg = { d1: $("#txtRushRecordBeginDate", _box).val(), d2: $("#txtRushRecordEndDate", _box).val(), p: pageIndex + 1 };
            isLoading = true;
            WS.GetRushItems(arg, function (result) {
                if (result.code > -1) {
                    if (pageIndex == 0)
                        rushList.html('').attr('empty', 1);
                    renderRush(result.data.items);
                    pageIndex = pageIndex + 1;
                    pageCount = result.data.pageCount;
                }
                scroller.refresh();
                isLoading = false;
            });
        }
        p.box = function (el) {
            if (el) _box = el;
            return _box;
        }
        p.reset = function () {
            rushList.html('').attr('empty', 1);
            pageCount = 1;
            pageIndex = 0;
            isLoading = false;
        }
        p.renderView = function (fnCallback) {
            var d = new Date();
            var d1 = d.DateAdd('d', 1 - d.getDate()).format("yyyy-MM-dd");
            fnCallback({ beginDate: d1, endDate: d.format("yyyy-MM-dd") });
        }
        p.init = function () {
            rushList = $("#rushList", _box);
            pBox = rushList.siblings();
            app.bindDateSelector("txtRushRecordBeginDate", _box);
            app.bindDateSelector("txtRushRecordEndDate", _box);
            ctAmount = $("#amountSum", _box);
            ctPoint = $("#pointSum", _box);
            //scroller = new IScroll(rushList.parent().get(0), { bounceTime: 50, scrollbars: true, interactiveScrollbars: true });
            scroller = app.iscroll(rushList.parent().get(0));
            scroller.on('scrollEnd', function () {
                if (Math.abs(scroller.y) >= Math.abs(scroller.maxScrollY)) {
                    getRushList();
                }
            });
        }
        p.show = function () {
            p.reset();
            getRushList();
        }
        p.showRushList = function () {
            p.reset();
            getRushList();
        }
    }
    window.$_Sale = _Sale;
    window.$_Rush = _Rush;
    window.$_SaleList = _SaleList;
    window.$_RushRecord = _RushRecord;
})(window);