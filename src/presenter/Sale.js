/// <reference path="../Common.js" />
/// <reference path="../Application.js" />
/// <reference path="../WS.js" />

(function () {
    var _Sale = function () {
        var pageIndex = 0, pageCount = 1;
        var menuContainer, pBox, _box = false;
        var curDir = false, itemInfo;
        var p = _Sale.prototype;
        function getItemObj() {
            var d = new Date().format("yyyy-MM-dd");
            var d1 = new Date(d).DateAdd('d', 7).format("yyyy-MM-dd");
            var names = [], sumPrice = numeral(0), item;
            $.each(itemInfo, function (i, id) {
                item = menuContainer.find("#_" + id);
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
                CompanyID: null,
                ItemInfo: JSON.stringify(itemInfo),
                ItemStatus: 1,
                ItemID: 0
            };
            delete names;
            delete sumPrice;
            delete items;
            return obj;
        }
        function getDirItem(dirId, dirName) {
            if (curDir && curDir.attr('data-id') == dirId)
                return curDir;
            else {
                curDir = $("#__" + dirId, menuContainer);
                if (curDir.length == 0) {
                    curDir = $("<li id='__" + dirId + "' data-id='" + dirId + "'><h2 style=\"color: #333; cursor: pointer;\" tap=\"toggleMenus\">" + dirName + "</h2></li>");
                    menuContainer.append(curDir);
                }
                return curDir;
            }
        }
        function getMenuItem(menu) {
            return VT["SaleItem"](menu);
        }
        function renderMenu(menus) {
            var dir, menu, item;
            curDir = false;
            menuContainer.remove();
            for (var i = 0; i < menus.length; i++) {
                menu = menus[i];
                dir = getDirItem(menu.dirid, menu.dirname);
                item = dir.find("#_" + menu.id);
                var m = getMenuItem(menu);
                if (item.length == 0)
                    dir.append(m);
                else
                    item.replaceWith(m);
            }
            pBox.append(menuContainer);
        }
        function getMenuList() {
            if (pageIndex >= pageCount)
                return;
            var args = { p: pageIndex + 1 };
            WS.GetMenus(args, function (result) {
                if (pageIndex == 0)
                    menuContainer.html('');
                if (result.code > -1) {
                    renderMenu(result.data.menus);
                    pageIndex++;
                    pageCount = result.data.pageCount;
                }
            });
        }
        p.box = function (el) {
            if (el !== undefined)
                _box = el;
            return _box;
        }
        p.reset = function () {
            pageIndex = 0;
            pageCount = 1;
            menuContainer.html('');
        }
        p.show = function (arg) {
            if (arg) {
                pageIndex = 0;
                pageCount = 1;
            }
            itemInfo = [];
            menuContainer.find("input.red").removeClass('red').addClass('green');
            if (pageIndex == 0)
                getMenuList();
            menuContainer.lazyload({ load: getMenuList });
        }
        p.init = function () {
            menuContainer = $("#saleContainer");
            pBox = menuContainer.parent();
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
        p.toggleMenu = function (el) {
            el.siblings().toggle();
        }
    }
    var _Rush = function () {
        var _itemInfo = false, _box = false;
        var imgItem, inputs, itemLimits;
        var imgData = false;
        function _takePicData(data) {
            imgData = data;
            imgItem.attr("src", "data:image/jpeg;base64," + data);
            imgItem.show();
        }
        function getInputdata() {
            var v, att;
            inputs.each(function (i, el) {
                v = el.value;
                att = el.getAttribute('t');
                if (t == 'dec')
                    v = parseFloat(v) || 0;
                else if (t == 'int')
                    v = parseInt(v) || 0;
                _itemInfo[el.id] = v;
            });
            _itemInfo["ItemLimit"] = parseInt(itemLimits.find(':checked').val());
            if (_itemInfo.ItemSum < _itemInfo.ItemNeedPay) {
                app.showtips("现金支付额不能大于促销总额.", undefined, false);
                return false;
            }
            if (!(_itemInfo.ItemPoint >= 0.5 && _itemInfo.ItemPoint <= 1.5)) {
                app.showtips("抢购积分必须在0.5-1.5之间.", undefined, false);
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
            inputs = $("input .input", _box);
            itemLimits = $("input[name='ItemLimit']", _box);
            app.bindDateSelector("ItemDate", _box);
            app.bindDateSelector("ItemEndDate", _box);
        }
        p.show = function (arg) {
            _itemInfo = arg;
            var v, att;
            inputs.each(function (i, el) {
                v = _itemInfo[el.id];
                att = el.getAttribute('t');
                if (v && t == 'dec')
                    v = numeral(v).format('0.00');
                el.value = v || '';
            });
            v = _itemInfo["ItemLimit"];
            itemLimits.find("[value='" + v + "']").attr('checked', true);
            v = _itemInfo["ItemPic"];
            imgData = false;
            if (v) {
                imgItem.attr("src", v);
                imgItem.show();
            } else
                imgItem.hide();
        }
        p.takeaPic = function (el) {
            if (!app.isCordovaApp()) {
                app.showtips("暂不支持此功能.", undefined, true);
                return;
            }
            navigator.camera.getPicture(_takePicData, function (ex) { }, { quality: 30, destinationType: Camera.DestinationType.DATA_URL });
        }
        p.saveItem = function (el) {
            if (getInputdata()) {
                var arg = {
                    item: JSON.stringifty(_itemInfo),
                    img: imgData || ''
                };
                WS.SaveItem(arg, function (result) {
                    app.showtips(result.message, undefined, true);
                });
            }
        }
    }
    var _SaleList = function () {
        var pageIndex = 0, pageCount = 1;
        var saleList, pBox, _box = false;
        var p = _SaleList.prototype;
        function renderSaleList(items) {
            var item, i;
            saleList.remove();
            for (i = 0; i < items.length; i++) {
                item = saleList.find("#_" + items[i].ItemID);
                if (item.length == 0)
                    saleList.append(VT['SaleListItem'](items[i]));
                else
                    saleList.replaceWith(VT['SaleListItem'](items[i]));
            }
            pBox.append(saleList);
        }
        function getSaleList() {
            if (pageIndex >= pageCount)
                return;
            var arg = { d1: $("#txtSaleListBeginDate", _box).val(), d2: $("#txtSaleListEndDate", _box).val(), p: pageIndex + 1 };
            WS.GetItems(arg, function (result) {
                if (result.code > -1) {
                    if (pageIndex == 0)
                        saleList.html('');
                    renderSaleList(result.data.items);
                    pageIndex = pageIndex + 1;
                    pageCount = result.data.pageCount;
                }
            });
        }
        p.box = function (el) {
            if (el) _box = el;
            return _box;
        }
        p.reset = function () {
            pageIndex = 0;
            pageCount = 0;
            saleList.html('');
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
        }
        p.show = function () {
            p.reset();
            getSaleList();
            saleList.lazyload({ load: getSaleList });
        }
        p.showSaleList = function () {
            pageCount = 1;
            pageIndex = 0;
            getSaleList();
        }
        p.showRush = function (el) {
            WS.GetItem(el.attr('data-id'), function (result) {
                if (result.code > -1) {
                    app.showRush(result.data);
                } else
                    app.showtips(result.message, undefined, true);
            });
        }
        p.delItem = function (el) {
            WS.delItem({ id: el.attr('data-id') }, function (result) {
                if (result.code > -1)
                    saleList.find("#_" + el.attr('data-id')).remove();
                app.showtips(result.message, undefined, true);
            });
        }
    }
    var _RushRecord = function () {
        var pageIndex = 0, pageCount = 1;
        var rushList, pBox, ctAmount, ctPoint, _box = false;
        var cSum = numeral(0), pSum = numeral(0);
        var p = _RushRecord.prototype;
        function renderRush(items) {
            var item, itemEl, i;
            rushList.remove();
            for (i = 0; i < items.length; i++) {
                item = items[i];
                itemEl = rushList.find("#_" + item.ItemID);
                if (itemEl.length > 0) {
                    cSum.subtract(itemEl.attr('data-qty')).add(1);
                    pSum.subtract(itemEl.attr('data-point')).add(item.ItemPoint);
                    itemEl.replaceWith(VT["RushRecordItem"](item));
                } else {
                    cSum.add(item.ItemQty);
                    pSum.add(item.PointSum);
                    rushList.append(VT["RushRecordItem"](item));
                }
            }
            pBox.before(rushList);
            ctAmount.text(cSum.format('0'));
            ctPoint.text(pSum.format('0.00'));
        }
        function getRushList() {
            if (pageIndex >= pageCount)
                return;
            var arg = { d1: $("#txtRushRecordBeginDate", _box).val(), d2: $("#txtRushRecordEndDate", _box).val(), p: pageIndex + 1 };
            WS.GetRushItems(arg, function (result) {
                if (result.code > -1) {
                    if (pageIndex == 0)
                        rushList.html('');
                    renderRush(result.data.items);
                    pageIndex = pageIndex + 1;
                    pageCount = result.data.pageCount;
                }
            });
        }
        p.box = function (el) {
            if (el) _box = el;
            return _box;
        }
        p.reset = function () {
            rushList.html('');
            pageCount = 1;
            pageIndex = 0;
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
        }
        p.show = function () {
            p.reset();
            getRushList();
            rushList.lazyload({ load: getRushList });
        }
        p.showRushList = function () {
            getRushList();
        }
    }
    window.$_Sale = _Sale;
    window.$_Rush = _Rush;
    window.$_SaleList = _SaleList;
    window.$_RushRecord = _RushRecord;
})(window);